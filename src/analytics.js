// Lightweight visit tracking for the portfolio. Events go to the analytics API (server/) as beacons,
// so they never delay the page. Set VITE_ANALYTICS_URL at build time to enable it.
export const analyticsUrl = (import.meta.env.VITE_ANALYTICS_URL || '').replace(/\/$/, '');

// Set on the admin's browser after signing in, so the owner's own visits are not counted.
export const OWNER_OPT_OUT_KEY = 'ejn-analytics-owner';

let enabled = false;
let visitorId = null;
let sessionId = null;

function storedId(storage, key) {
  try {
    let id = storage.getItem(key);
    if (!id) {
      id = crypto.randomUUID();
      storage.setItem(key, id);
    }
    return id;
  } catch {
    return null;
  }
}

function isOptedOut() {
  if (navigator.doNotTrack === '1' || navigator.globalPrivacyControl) return true;
  try {
    return localStorage.getItem(OWNER_OPT_OUT_KEY) === '1';
  } catch {
    return false;
  }
}

function send(type, data = {}) {
  if (!enabled) return;
  const body = JSON.stringify({
    type,
    visitorId,
    sessionId,
    path: window.location.pathname,
    timeZone: Intl.DateTimeFormat().resolvedOptions().timeZone,
    ...data,
  });
  const url = `${analyticsUrl}/api/collect`;
  // text/plain keeps this a "simple" cross-origin request, so no CORS preflight is needed.
  const blob = new Blob([body], { type: 'text/plain' });
  if (!navigator.sendBeacon?.(url, blob)) {
    fetch(url, { method: 'POST', body, keepalive: true, mode: 'cors', headers: { 'Content-Type': 'text/plain' } }).catch(() => {});
  }
}

export function trackEvent(type, label) {
  send(type, { label });
}

function trackSections() {
  const seen = new Set();
  const observer = new IntersectionObserver(
    (entries) => {
      entries.forEach((entry) => {
        const id = entry.target.id;
        if (entry.isIntersecting && !seen.has(id)) {
          seen.add(id);
          send('section', { label: id === 'top' ? 'home' : id });
        }
      });
    },
    { threshold: 0.35 },
  );
  document.querySelectorAll('main section[id]').forEach((section) => observer.observe(section));
}

function trackLinks() {
  document.addEventListener(
    'click',
    (event) => {
      const link = event.target.closest?.('a[href]');
      if (!link) return;
      const url = new URL(link.href, window.location.href);
      if (url.pathname.toLowerCase().endsWith('.pdf')) {
        send('download', { label: decodeURIComponent(url.pathname.split('/').pop()) });
      } else if (url.origin !== window.location.origin && /^https?:$/.test(url.protocol)) {
        // Name project links by their card title; fall back to the link text and destination.
        const title = link.closest('article')?.querySelector('h3')?.textContent?.trim();
        const name = title || link.getAttribute('aria-label') || link.textContent.trim() || url.hostname;
        send('outbound', { label: `${name} (${url.hostname.replace(/^www\./, '')})` });
      }
    },
    { capture: true },
  );
}

function trackEngagement() {
  let visibleMs = 0;
  let visibleSince = document.visibilityState === 'visible' ? performance.now() : null;
  let lastSent = 0;

  const flush = () => {
    if (visibleSince !== null) {
      visibleMs += performance.now() - visibleSince;
      visibleSince = null;
    }
    // Reports the running total; the server keeps the largest value per session.
    if (visibleMs - lastSent >= 1000) {
      lastSent = visibleMs;
      send('engagement', { duration: Math.round(visibleMs) });
    }
  };

  document.addEventListener('visibilitychange', () => {
    if (document.visibilityState === 'hidden') flush();
    else visibleSince = performance.now();
  });
  window.addEventListener('pagehide', flush);
}

export function initAnalytics() {
  if (!analyticsUrl || isOptedOut()) return;
  visitorId = storedId(localStorage, 'ejn-visitor');
  sessionId = storedId(sessionStorage, 'ejn-session');
  enabled = true;

  send('pageview', {
    referrer: document.referrer,
    language: navigator.language,
    screen: `${window.screen.width}x${window.screen.height}`,
  });
  trackSections();
  trackLinks();
  trackEngagement();
}
