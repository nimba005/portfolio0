import { createHash, createHmac, randomBytes, scrypt, timingSafeEqual } from 'node:crypto';
import { promisify } from 'node:util';

const scryptAsync = promisify(scrypt);

const TOKEN_TTL_MS = 8 * 60 * 60 * 1000;
const FAILURE_WINDOW_MS = 15 * 60 * 1000;
const MAX_FAILURES_PER_IP = 5;
// Caps total failed logins too, so rotating IPs cannot be used to brute-force the password.
const MAX_FAILURES_GLOBAL = 30;

const sha256 = (value) => createHash('sha256').update(value).digest();
const base64url = (buffer) => Buffer.from(buffer).toString('base64url');

/** Hash format: scrypt$N$r$p$salt$hash (base64url parts). */
export async function hashPassword(password) {
  const N = 16384;
  const r = 8;
  const p = 1;
  const salt = randomBytes(16);
  const hash = await scryptAsync(password, salt, 64, { N, r, p });
  return ['scrypt', N, r, p, base64url(salt), base64url(hash)].join('$');
}

async function verifyPassword(password, stored) {
  const [scheme, N, r, p, salt, hash] = String(stored).split('$');
  if (scheme !== 'scrypt' || !salt || !hash) return false;
  const expected = Buffer.from(hash, 'base64url');
  const actual = await scryptAsync(password, Buffer.from(salt, 'base64url'), expected.length, {
    N: Number(N),
    r: Number(r),
    p: Number(p),
  });
  return timingSafeEqual(actual, expected);
}

const sameText = (a, b) => timingSafeEqual(sha256(String(a)), sha256(String(b)));

const failures = new Map();
let globalFailures = [];

function recentFailures(ip, now) {
  const list = (failures.get(ip) || []).filter((time) => now - time < FAILURE_WINDOW_MS);
  failures.set(ip, list);
  globalFailures = globalFailures.filter((time) => now - time < FAILURE_WINDOW_MS);
  return list;
}

function retryAfterSeconds(list, now) {
  const oldest = Math.min(...list);
  return Math.max(1, Math.ceil((oldest + FAILURE_WINDOW_MS - now) / 1000));
}

export function createAuth({ adminEmail, passwordHash, tokenSecret }) {
  // Changing the password hash changes this fingerprint, which signs out every existing session.
  const keyVersion = sha256(passwordHash).toString('hex').slice(0, 12);

  const sign = (data) => base64url(createHmac('sha256', tokenSecret).update(data).digest());

  function issueToken() {
    const payload = base64url(JSON.stringify({ sub: 'admin', v: keyVersion, exp: Date.now() + TOKEN_TTL_MS }));
    return `${payload}.${sign(payload)}`;
  }

  function verifyToken(token) {
    const [payload, signature] = String(token || '').split('.');
    if (!payload || !signature) return false;
    const expected = Buffer.from(sign(payload));
    const actual = Buffer.from(signature);
    if (expected.length !== actual.length || !timingSafeEqual(expected, actual)) return false;
    try {
      const claims = JSON.parse(Buffer.from(payload, 'base64url').toString());
      return claims.sub === 'admin' && claims.v === keyVersion && claims.exp > Date.now();
    } catch {
      return false;
    }
  }

  async function login(req, res) {
    const now = Date.now();
    const ip = req.ip || 'unknown';
    const list = recentFailures(ip, now);

    if (list.length >= MAX_FAILURES_PER_IP || globalFailures.length >= MAX_FAILURES_GLOBAL) {
      const retryAfter = retryAfterSeconds(list.length ? list : globalFailures, now);
      res.set('Retry-After', String(retryAfter));
      return res.status(429).json({ error: 'Too many failed attempts. Try again later.', retryAfter });
    }

    const { email = '', password = '' } = req.body || {};
    const emailOk = sameText(String(email).trim().toLowerCase(), adminEmail);
    // Always run the password check so response time does not reveal whether the email matched.
    const passwordOk = await verifyPassword(String(password).slice(0, 256), passwordHash);

    if (!emailOk || !passwordOk) {
      list.push(now);
      globalFailures.push(now);
      await new Promise((resolve) => setTimeout(resolve, 400));
      return res.status(401).json({ error: 'Incorrect email or password.' });
    }

    failures.delete(ip);
    return res.json({ token: issueToken(), expiresIn: TOKEN_TTL_MS / 1000 });
  }

  function requireAdmin(req, res, next) {
    const token = (req.get('authorization') || '').replace(/^Bearer\s+/i, '');
    if (!verifyToken(token)) return res.status(401).json({ error: 'Session expired. Please sign in again.' });
    return next();
  }

  return { login, requireAdmin };
}
