import { isAdmin } from '../../../analytics/auth.js';
import { withDb } from '../../../analytics/db.js';
import { fileResponse, json, missingConfig } from '../../../analytics/http.js';
import { exportCsv } from '../../../analytics/stats.js';

export async function onRequestGet({ request, env }) {
  if (missingConfig(env)) return json({ error: 'Analytics is not configured yet.' }, 503);
  if (!(await isAdmin(request, env))) return json({ error: 'Session expired. Please sign in again.' }, 401);

  try {
    const params = new URL(request.url).searchParams;
    const { range, csv } = await withDb(env, (db) => exportCsv(db, params));
    return fileResponse(csv, 'text/csv; charset=utf-8', `portfolio-visits-${range}.csv`);
  } catch (error) {
    console.error('Export failed:', error);
    return json({ error: 'Could not export analytics.' }, 500);
  }
}
