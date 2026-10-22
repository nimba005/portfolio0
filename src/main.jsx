import React from 'react';
import { createRoot, hydrateRoot } from 'react-dom/client';
import App from './App.jsx';
import { initAnalytics } from './analytics.js';
import './styles.css';

const root = document.getElementById('root');

if (/^\/admin(\/|$)/.test(window.location.pathname)) {
  // The admin panel is loaded on demand so visitors never download its code.
  import('./admin/AdminApp.jsx').then(({ default: AdminApp }) => {
    root.replaceChildren();
    createRoot(root).render(
      <React.StrictMode>
        <AdminApp />
      </React.StrictMode>,
    );
  });
} else {
  const app = (
    <React.StrictMode>
      <App />
    </React.StrictMode>
  );

  // Production HTML is pre-rendered at build time (scripts/prerender.mjs), so hydrate it.
  if (root.hasChildNodes()) {
    hydrateRoot(root, app);
  } else {
    createRoot(root).render(app);
  }
  initAnalytics();
}
