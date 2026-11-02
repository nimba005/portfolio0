import { buildEvent, clientIp, insertEvent } from '../../analytics/collect.js';
import { withDb } from '../../analytics/db.js';
import { emptyResponse, isSameOrigin, missingConfig } from '../../analytics/http.js';

const MAX_BODY = 4096;
const eventCounts = new Map();

// Best-effort flood protection per Workers instance.
function overLimit(ip) {
  const minute = Math.floor(Date.now() / 60000);
  const key = `${ip}:${minute}`;
  const count = (eventCounts.get(key) || 0) + 1;
  eventCounts.set(key, count);
  if (eventCounts.size > 5000) {
    for (const stored of eventCounts.keys()) if (!stored.endsWith(`:${minute}`)) eventCounts.delete(stored);
  }
  return count > 120;
}

export async function onRequestPost({ request, env, waitUntil }) {
  if (missingConfig(env) || !isSameOrigin(request) || overLimit(clientIp(request))) return emptyResponse();

  const body = await request.text();
  if (body.length > MAX_BODY) return emptyResponse();

  // Answer immediately; the insert finishes in the background.
  waitUntil(
    (async () => {
      const row = await buildEvent(request, env, body);
      if (row) await withDb(env, (db) => insertEvent(db, row));
    })().catch((error) => console.error('Could not record event:', error.message)),
  );
  return emptyResponse();
}
