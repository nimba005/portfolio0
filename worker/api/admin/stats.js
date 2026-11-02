import { isAdmin } from '../../../analytics/auth.js';
import { withDb } from '../../../analytics/db.js';
import { json, missingConfig } from '../../../analytics/http.js';
import { getStats } from '../../../analytics/stats.js';

export async function onRequestGet({ request, env }) {
  if (missingConfig(env)) return json({ error: 'Analytics is not configured yet.' }, 503);
  if (!(await isAdmin(request, env))) return json({ error: 'Session expired. Please sign in again.' }, 401);

  try {
    const params = new URL(request.url).searchParams;
    return json(await withDb(env, (db) => getStats(db, params)));
  } catch (error) {
    console.error('Stats failed:', error);
    return json({ error: 'Could not load analytics.' }, 500);
  }
}
