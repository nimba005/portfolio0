import { hmac, safeEqual, sha256Hex, verifyPassword } from './crypto.js';

const TOKEN_TTL_MS = 8 * 60 * 60 * 1000;
const MAX_FAILURES_PER_IP = 5;
// Caps total failed logins too, so rotating IPs cannot be used to brute-force the password.
const MAX_FAILURES_GLOBAL = 30;

// Changing the password hash changes this, which signs out every existing session.
const keyVersion = async (env) => (await sha256Hex(env.ADMIN_PASSWORD_HASH)).slice(0, 12);

export async function issueToken(env) {
  const payload = btoa(JSON.stringify({ sub: 'admin', v: await keyVersion(env), exp: Date.now() + TOKEN_TTL_MS }));
  return `${payload}.${await hmac(env.TOKEN_SECRET, payload)}`;
}

export async function isAdmin(request, env) {
  const token = (request.headers.get('authorization') || '').replace(/^Bearer\s+/i, '');
  const [payload, signature] = token.split('.');
  if (!payload || !signature || !safeEqual(signature, await hmac(env.TOKEN_SECRET, payload))) return false;
  try {
    const claims = JSON.parse(atob(payload));
    return claims.sub === 'admin' && claims.v === (await keyVersion(env)) && claims.exp > Date.now();
  } catch {
    return false;
  }
}

/** Returns { status, body } for the login request. Failed attempts are kept in Postgres so every instance shares them. */
export async function login(db, env, { ipHash, email, password }) {
  const { rows } = await db.query(
    `SELECT count(*) FILTER (WHERE ip_hash = $1) AS ip_failures,
            count(*) AS all_failures,
            min(created_at) FILTER (WHERE ip_hash = $1) AS ip_oldest,
            min(created_at) AS all_oldest
     FROM login_failures WHERE created_at > now() - interval '15 minutes'`,
    [ipHash],
  );
  const stats = rows[0];
  const ipLocked = Number(stats.ip_failures) >= MAX_FAILURES_PER_IP;
  if (ipLocked || Number(stats.all_failures) >= MAX_FAILURES_GLOBAL) {
    const oldest = new Date(ipLocked ? stats.ip_oldest : stats.all_oldest).getTime();
    const retryAfter = Math.max(1, Math.ceil((oldest + 15 * 60 * 1000 - Date.now()) / 1000));
    return { status: 429, body: { error: 'Too many failed attempts. Try again later.', retryAfter } };
  }

  const emailOk = safeEqual(String(email).trim().toLowerCase(), String(env.ADMIN_EMAIL).trim().toLowerCase());
  // Always run the password check so response time does not reveal whether the email matched.
  const passwordOk = await verifyPassword(String(password).slice(0, 256), env.ADMIN_PASSWORD_HASH);

  if (!emailOk || !passwordOk) {
    await db.query(`INSERT INTO login_failures (ip_hash) VALUES ($1)`, [ipHash]);
    await db.query(`DELETE FROM login_failures WHERE created_at < now() - interval '1 day'`);
    return { status: 401, body: { error: 'Incorrect email or password.' } };
  }

  await db.query(`DELETE FROM login_failures WHERE ip_hash = $1`, [ipHash]);
  return { status: 200, body: { token: await issueToken(env), expiresIn: TOKEN_TTL_MS / 1000 } };
}
