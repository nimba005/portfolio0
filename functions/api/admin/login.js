import { login } from '../../../analytics/auth.js';
import { hashIp } from '../../../analytics/collect.js';
import { withDb } from '../../../analytics/db.js';
import { json, missingConfig } from '../../../analytics/http.js';

export async function onRequestPost({ request, env }) {
  if (missingConfig(env)) return json({ error: 'Analytics is not configured yet.' }, 503);

  let credentials;
  try {
    const body = await request.text();
    credentials = body.length <= 2048 ? JSON.parse(body) : {};
  } catch {
    credentials = {};
  }

  const ipHash = await hashIp(request, env);
  const { status, body } = await withDb(env, (db) =>
    login(db, env, { ipHash, email: credentials.email || '', password: credentials.password || '' }),
  );
  return json(body, status, status === 429 ? { 'Retry-After': String(body.retryAfter) } : {});
}
