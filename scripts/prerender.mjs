// Injects the server-rendered app into dist/index.html so crawlers and link
// previews see the full page content without running JavaScript.
import { readFile, rm, writeFile } from 'node:fs/promises';
import { fileURLToPath, pathToFileURL } from 'node:url';

const root = fileURLToPath(new URL('..', import.meta.url));
const indexPath = `${root}dist/index.html`;
const ssrDir = `${root}dist-ssr`;

const { render } = await import(pathToFileURL(`${ssrDir}/entry-server.js`).href);
const template = await readFile(indexPath, 'utf8');
const placeholder = '<div id="root"></div>';

if (!template.includes(placeholder)) {
  throw new Error(`Prerender failed: ${placeholder} not found in dist/index.html`);
}

await writeFile(indexPath, template.replace(placeholder, `<div id="root">${render()}</div>`));
await rm(ssrDir, { recursive: true, force: true });

console.log('Prerendered dist/index.html');
