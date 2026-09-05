import fs from 'node:fs/promises';
import assert from 'node:assert/strict';
import path from 'node:path';

const root = 'out';
await fs.rm(root, { recursive: true, force: true });
await fs.cp('dist/client', root, { recursive: true });
// The Pages mount supplies /shelbyklein; remove Vinext's on-disk asset prefix.
await fs.rename(path.join(root, 'shelbyklein/_next'), path.join(root, '_next'));
await fs.rmdir(path.join(root, 'shelbyklein'));
const projects = JSON.parse(await fs.readFile('content/projects.json', 'utf8'));
const articles = JSON.parse(await fs.readFile('content/articles.json', 'utf8'));
const publicHTML = new Set((await fs.readdir('public', { recursive: true })).filter(file => file.endsWith('.html')));
// Vinext prerenders extensionless route requests; Pages serves directory indexes.
// Move exported HTML to those indexes after rendering to avoid server redirects
// during the export. Keep the conventional root index and 404 files in place.
for (const file of await fs.readdir(root, { recursive: true })) {
  if (!file.endsWith('.html') || publicHTML.has(file) || path.basename(file) === 'index.html' || file === '404.html') continue;
  const destination = path.join(root, file.slice(0, -5), 'index.html');
  await fs.mkdir(path.dirname(destination), { recursive: true });
  await fs.rename(path.join(root, file), destination);
}
const routes = ['', 'writing', ...projects.map(project => `work/${project.id}`), ...articles.map(article => `writing/${article.slug}`)];
for (const route of routes) {
  const html = await fs.readFile(path.join(root, route, 'index.html'), 'utf8');
  assert(html.includes('<html'), `Missing HTML for ${route || '/'}`);
}
const htmlFiles = (await fs.readdir(root, { recursive: true })).filter(file => file.endsWith('.html'));
const checked = new Set();
for (const file of htmlFiles) {
  const html = await fs.readFile(path.join(root, file), 'utf8');
  for (const match of html.matchAll(/(?:href|src)="(\/(?!\/)[^"]*)"/g)) {
    const url = match[1];
    assert(url.startsWith('/shelbyklein/'), `Unprefixed URL in ${file}: ${url}`);
    if (checked.has(url)) continue;
    const pathname = new URL(url, 'https://shelbyklein.github.io').pathname;
    const relative = decodeURIComponent(pathname.slice('/shelbyklein/'.length));
    const destination = path.join(root, relative, pathname.endsWith('/') ? 'index.html' : '');
    await fs.access(destination);
    checked.add(url);
  }
}
assert.equal(htmlFiles.length, routes.length + projects.filter(project => project.legacySlug).length + articles.length + 4 + publicHTML.size, 'Missing legacy, embedded, or 404 pages');
await fs.access(path.join(root, '404.html'));
await fs.writeFile(path.join(root, '.nojekyll'), '');
console.log(`GitHub Pages export ready: ${routes.length} content pages, ${htmlFiles.length - routes.length - publicHTML.size - 1} legacy pages, ${publicHTML.size} embedded scenes, a 404 page, and ${checked.size} verified local links/assets in out/.`);
