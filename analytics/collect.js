import { sha256Hex } from './crypto.js';

const EVENT_TYPES = new Set(['pageview', 'section', 'download', 'outbound', 'contact', 'engagement']);
const BOT_PATTERN = /bot|crawl|spider|slurp|headless|lighthouse|preview|facebookexternalhit|embedly|whatsapp|telegram|curl|wget|python-requests|axios|node-fetch/i;

const text = (value, max) => (typeof value === 'string' && value.trim() ? value.trim().slice(0, max) : null);

export const clientIp = (request) => request.headers.get('cf-connecting-ip') || '0.0.0.0';

// Only a salted hash of the IP is kept: enough to count unique visitors without storing the address.
export const hashIp = async (request, env) => (await sha256Hex(`${env.IP_SALT}:${clientIp(request)}`)).slice(0, 32);

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

/** Parses a beacon body; returns the row to insert, or null when the event should be ignored. */
export async function buildEvent(request, env, body) {
  let data;
  try {
    data = JSON.parse(body || '{}');
  } catch {
    return null;
  }
  if (!EVENT_TYPES.has(data.type)) return null;

  const agent = request.headers.get('user-agent') || '';
  // Cloudflare attaches the visitor's location to every request.
  const geo = request.cf || {};
  const { device, browser, os } = parseAgent(agent);
  const duration = Number.isFinite(data.duration) ? Math.min(Math.max(Math.round(data.duration), 0), 4 * 60 * 60 * 1000) : null;

  return [
    data.type,
    text(data.path, 300),
    text(data.label, 200),
    text(data.visitorId, 64),
    text(data.sessionId, 64),
    await hashIp(request, env),
    text(geo.country, 2),
    text(geo.region, 80),
    text(geo.city, 80),
    text(data.timeZone, 64) || text(geo.timezone, 64),
    device,
    browser,
    os,
    data.type === 'pageview' ? referrerHost(data.referrer, new URL(request.url).origin) : null,
    text(data.language, 16),
    text(data.screen, 16),
    data.type === 'engagement' ? duration : null,
    !agent || BOT_PATTERN.test(agent),
  ];
}

export async function insertEvent(db, row) {
  await db.query(
    `INSERT INTO events (type, path, label, visitor_id, session_id, ip_hash, country, region, city, timezone,
                         device, browser, os, referrer_host, language, screen, duration_ms, is_bot)
     VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10, $11, $12, $13, $14, $15, $16, $17, $18)`,
    row,
  );
}
