import React from 'react';
import { createRoot, hydrateRoot } from 'react-dom/client';
import App from './App.jsx';
import './styles.css';

const root = document.getElementById('root');
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
