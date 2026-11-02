const REQUIRED_ENV = ['DATABASE_URL', 'ADMIN_EMAIL', 'ADMIN_PASSWORD_HASH', 'TOKEN_SECRET', 'IP_SALT'];

const BASE_HEADERS = {
  'Cache-Control': 'no-store',
  'X-Content-Type-Options': 'nosniff',
  'X-Robots-Tag': 'noindex, nofollow',
};

export function json(body, status = 200, headers = {}) {
  return new Response(JSON.stringify(body), {
    status,
    headers: { ...BASE_HEADERS, 'Content-Type': 'application/json; charset=utf-8', ...headers },
  });
}

export function emptyResponse() {
  return new Response(null, { status: 204, headers: BASE_HEADERS });
}

export function fileResponse(body, contentType, filename) {
  return new Response(body, {
    headers: { ...BASE_HEADERS, 'Content-Type': contentType, 'Content-Disposition': `attachment; filename="${filename}"` },
  });
}

export function missingConfig(env) {
  const missing = REQUIRED_ENV.filter((name) => !env[name]);
  if (missing.length) console.error(`Missing environment variables: ${missing.join(', ')}`);
  return missing.length > 0;
}

/** True when the request comes from this site's own pages. */
export function isSameOrigin(request) {
  const self = new URL(request.url).origin;
  const origin = request.headers.get('origin');
  if (origin) return origin === self;
  return (request.headers.get('referer') || '').startsWith(`${self}/`);
}
