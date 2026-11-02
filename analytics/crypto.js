// Web Crypto helpers shared by the Cloudflare functions and the hash-password script.
const encoder = new TextEncoder();

export const toBase64Url = (bytes) =>
  btoa(String.fromCharCode(...new Uint8Array(bytes))).replace(/\+/g, '-').replace(/\//g, '_').replace(/=+$/, '');

export const fromBase64Url = (text) =>
  Uint8Array.from(atob(text.replace(/-/g, '+').replace(/_/g, '/')), (char) => char.charCodeAt(0));

const toHex = (bytes) => [...new Uint8Array(bytes)].map((byte) => byte.toString(16).padStart(2, '0')).join('');

export async function sha256Hex(text) {
  return toHex(await crypto.subtle.digest('SHA-256', encoder.encode(text)));
}

/** Constant-time comparison of two byte arrays or strings. */
export function safeEqual(a, b) {
  const left = typeof a === 'string' ? encoder.encode(a) : new Uint8Array(a);
  const right = typeof b === 'string' ? encoder.encode(b) : new Uint8Array(b);
  let diff = left.length ^ right.length;
  for (let i = 0; i < Math.max(left.length, right.length); i += 1) diff |= (left[i] ?? 0) ^ (right[i] ?? 0);
  return diff === 0;
}

async function pbkdf2(password, salt, iterations) {
  const key = await crypto.subtle.importKey('raw', encoder.encode(password), 'PBKDF2', false, ['deriveBits']);
  return crypto.subtle.deriveBits({ name: 'PBKDF2', hash: 'SHA-256', salt, iterations }, key, 256);
}

// Cloudflare Workers cap PBKDF2 at 100,000 iterations.
const ITERATIONS = 100000;

/** Hash format: pbkdf2-sha256$iterations$salt$hash (base64url parts). */
export async function hashPassword(password) {
  const salt = crypto.getRandomValues(new Uint8Array(16));
  const hash = await pbkdf2(password, salt, ITERATIONS);
  return ['pbkdf2-sha256', ITERATIONS, toBase64Url(salt), toBase64Url(hash)].join('$');
}

export async function verifyPassword(password, stored) {
  const [scheme, iterations, salt, hash] = String(stored).split('$');
  if (scheme !== 'pbkdf2-sha256' || !salt || !hash) return false;
  const actual = await pbkdf2(password, fromBase64Url(salt), Number(iterations));
  return safeEqual(actual, fromBase64Url(hash));
}

export async function hmac(secret, data) {
  const key = await crypto.subtle.importKey('raw', encoder.encode(secret), { name: 'HMAC', hash: 'SHA-256' }, false, ['sign']);
  return toBase64Url(await crypto.subtle.sign('HMAC', key, encoder.encode(data)));
}
