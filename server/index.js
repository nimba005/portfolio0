import { createHash } from 'node:crypto';
import express from 'express';
import geoip from 'geoip-lite';
import { createAuth } from './auth.js';
import { migrate, pool } from './db.js';
import { exportCsv, getStats } from './stats.js';

const required = ['DATABASE_URL', 'ADMIN_EMAIL', 'ADMIN_PASSWORD_HASH', 'TOKEN_SECRET', 'IP_SALT', 'ALLOWED_ORIGINS'];
const missing = required.filter((name) => !process.env[name]);
if (missing.length) {
  console.error(`Missing environment variables: ${missing.join(', ')}`);
  process.exit(1);
}

const allowedOrigins = new Set(process.env.ALLOWED_ORIGINS.split(',').map((origin) => origin.trim()).filter(Boolean));
const ipSalt = process.env.IP_SALT;
const auth = createAuth({
  adminEmail: process.env.ADMIN_EMAIL.trim().toLowerCase(),
  passwordHash: process.env.ADMIN_PASSWORD_HASH.trim(),
  tokenSecret: process.env.TOKEN_SECRET,
});

const app = express();
app.disable('x-powered-by');
// Render terminates TLS in front of the app and passes the visitor address in X-Forwarded-For.
app.set('trust proxy', true);

app.use((req, res, next) => {
  res.set('X-Content-Type-Options', 'nosniff');
  res.set('X-Robots-Tag', 'noindex, nofollow');
  const origin = req.get('origin');
  if (origin && allowedOrigins.has(origin)) {
    res.set('Access-Control-Allow-Origin', origin);
    res.set('Vary', 'Origin');
    res.set('Access-Control-Allow-Headers', 'Content-Type, Authorization');
    res.set('Access-Control-Allow-Methods', 'GET, POST, OPTIONS');
    res.set('Access-Control-Max-Age', '86400');
  }
  if (req.method === 'OPTIONS') return res.sendStatus(204);
  return next();
});

app.get('/healthz', (req, res) => res.json({ ok: true }));

// --- Visit collection -------------------------------------------------------

const EVENT_TYPES = new Set(['pageview', 'section', 'download', 'outbound', 'contact', 'engagement']);
const BOT_PATTERN = /bot|crawl|spider|slurp|headless|lighthouse|preview|facebookexternalhit|embedly|whatsapp|telegram|curl|wget|python-requests|axios|node-fetch/i;

const text = (value, max) => (typeof value === 'string' && value.trim() ? value.trim().slice(0, max) : null);

function parseAgent(agent) {
  const ua = agent.toLowerCase();
  const device = /ipad|tablet/.test(ua) ? 'Tablet' : /mobi|iphone|android/.test(ua) ? 'Mobile' : 'Desktop';
  const browser = ua.includes('edg/')
    ? 'Edge'
    : ua.includes('opr/') || ua.includes('opera')
      ? 'Opera'
      : ua.includes('samsungbrowser')
        ? 'Samsung Internet'
        : ua.includes('firefox') || ua.includes('fxios')
          ? 'Firefox'
          : ua.includes('chrome') || ua.includes('crios')
            ? 'Chrome'
            : ua.includes('safari')
              ? 'Safari'
              : 'Other';
  const os = /windows/.test(ua)
    ? 'Windows'
    : /iphone|ipad|ipod/.test(ua)
      ? 'iOS'
      : /android/.test(ua)
        ? 'Android'
        : /mac os/.test(ua)
          ? 'macOS'
          : /cros/.test(ua)
            ? 'ChromeOS'
            : /linux/.test(ua)
              ? 'Linux'
              : 'Other';
  return { device, browser, os };
}

function referrerHost(value, origin) {
  try {
    const url = new URL(value);
    if (!/^https?:$/.test(url.protocol) || url.origin === origin) return null;
    return url.hostname.replace(/^www\./, '').slice(0, 120);
  } catch {
    return null;
  }
}

const eventCounts = new Map();
function overEventLimit(ip) {
  const minute = Math.floor(Date.now() / 60000);
  const key = `${ip}:${minute}`;
  const count = (eventCounts.get(key) || 0) + 1;
  eventCounts.set(key, count);
  if (eventCounts.size > 5000) {
    for (const stored of eventCounts.keys()) if (!stored.endsWith(`:${minute}`)) eventCounts.delete(stored);
  }
  return count > 120;
}

// Beacons are sent as text/plain so browsers skip the CORS preflight.
app.post('/api/collect', express.text({ type: '*/*', limit: '4kb' }), async (req, res) => {
  const origin = req.get('origin');
  res.sendStatus(204);
  if (!origin || !allowedOrigins.has(origin) || overEventLimit(req.ip)) return;

  let data;
  try {
    data = JSON.parse(req.body || '{}');
  } catch {
    return;
  }
  if (!EVENT_TYPES.has(data.type)) return;

  const agent = req.get('user-agent') || '';
  const geo = geoip.lookup(req.ip || '') || {};
  const { device, browser, os } = parseAgent(agent);
  const duration = Number.isFinite(data.duration) ? Math.min(Math.max(Math.round(data.duration), 0), 4 * 60 * 60 * 1000) : null;

  try {
    await pool.query(
      `INSERT INTO events (type, path, label, visitor_id, session_id, ip_hash, country, region, city, timezone,
                           device, browser, os, referrer_host, language, screen, duration_ms, is_bot)
       VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10, $11, $12, $13, $14, $15, $16, $17, $18)`,
      [
        data.type,
        text(data.path, 300),
        text(data.label, 200),
        text(data.visitorId, 64),
        text(data.sessionId, 64),
        // Only a salted hash of the IP is kept, enough to count unique visitors without storing the address.
        createHash('sha256').update(`${ipSalt}:${req.ip}`).digest('hex').slice(0, 32),
        geo.country || null,
        geo.region || null,
        geo.city || null,
        text(data.timeZone, 64) || geo.timezone || null,
        device,
        browser,
        os,
        data.type === 'pageview' ? referrerHost(data.referrer, origin) : null,
        text(data.language, 16),
        text(data.screen, 16),
        data.type === 'engagement' ? duration : null,
        !agent || BOT_PATTERN.test(agent),
      ],
    );
  } catch (error) {
    console.error('Could not record event:', error.message);
  }
});

// --- Admin -------------------------------------------------------------------

app.post('/api/admin/login', express.json({ limit: '2kb' }), auth.login);

app.get('/api/admin/stats', auth.requireAdmin, async (req, res) => {
  try {
    res.set('Cache-Control', 'no-store');
    res.json(await getStats(req.query));
  } catch (error) {
    console.error('Stats failed:', error);
    res.status(500).json({ error: 'Could not load analytics.' });
  }
});

app.get('/api/admin/export.csv', auth.requireAdmin, async (req, res) => {
  try {
    const csv = await exportCsv(req.query);
    res.set('Cache-Control', 'no-store');
    res.set('Content-Type', 'text/csv; charset=utf-8');
    res.set('Content-Disposition', `attachment; filename="portfolio-visits-${req.query.range || '30d'}.csv"`);
    res.send(csv);
  } catch (error) {
    console.error('Export failed:', error);
    res.status(500).json({ error: 'Could not export analytics.' });
  }
});

app.use((req, res) => res.status(404).json({ error: 'Not found' }));

await migrate();
const port = Number(process.env.PORT) || 8787;
app.listen(port, () => console.log(`Analytics API listening on ${port}`));
