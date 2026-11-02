// Cloudflare Worker entry. Static files in dist/ are served by Workers Assets; only /api/* reaches this code.
import { json } from '../analytics/http.js';
import { onRequestGet as exportCsv } from './api/admin/export.js';
import { onRequestPost as login } from './api/admin/login.js';
import { onRequestGet as stats } from './api/admin/stats.js';
import { onRequestPost as collect } from './api/collect.js';

const routes = {
  'POST /api/collect': collect,
  'POST /api/admin/login': login,
  'GET /api/admin/stats': stats,
  'GET /api/admin/export': exportCsv,
};

export default {
  async fetch(request, env, ctx) {
    const { pathname } = new URL(request.url);
    const handler = routes[`${request.method} ${pathname}`];
    if (handler) return handler({ request, env, waitUntil: (promise) => ctx.waitUntil(promise) });
    if (pathname.startsWith('/api/')) return json({ error: 'Not found' }, 404);
    return env.ASSETS.fetch(request);
  },
};
