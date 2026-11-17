import { existsSync, readFileSync, readdirSync } from 'node:fs';
import { join, posix } from 'node:path';

const DIST = 'dist';
const BASE = 'https://odalbanycenteno.com';
const errors = [];
const warnings = [];

const walk = (dir) => {
  const out = [];
  for (const entry of readdirSync(dir, { withFileTypes: true })) {
    const path = join(dir, entry.name);
    if (entry.isDirectory()) out.push(...walk(path));
    else if (entry.name.endsWith('.html')) out.push(path);
  }
  return out;
};

const attr = (html, regex) => {
  const match = html.match(regex);
  return match ? match[1].trim() : '';
};

const routeFor = (file) => {
  const rel = file.slice(DIST.length).replace(/\\/g, '/');
  if (rel === '/index.html') return '/';
  if (rel.endsWith('/index.html')) return rel.slice(0, -'index.html'.length);
  return rel;
};

const files = walk(DIST);
const routes = new Set(files.map(routeFor));
const sitemap = readFileSync('dist/sitemap-0.xml', 'utf8');
const sitemapRoutes = [...sitemap.matchAll(/<loc>([^<]+)<\/loc>/g)].map((m) => new URL(m[1], BASE).pathname);

if (sitemapRoutes.includes('/404')) errors.push('sitemap incluye /404');
if (!existsSync('public/robots.txt')) errors.push('falta public/robots.txt');
else {
  const robots = readFileSync('public/robots.txt', 'utf8');
  for (const bot of ['OAI-SearchBot', 'GPTBot', 'ClaudeBot', 'PerplexityBot', 'Google-Extended']) {
    if (!robots.includes(bot)) errors.push(`robots.txt no menciona ${bot}`);
  }
  if (!robots.includes('Sitemap: https://odalbanycenteno.com/sitemap-index.xml')) {
    errors.push('robots.txt no declara sitemap');
  }
}
if (!existsSync('public/llms.txt')) errors.push('falta public/llms.txt');

const schemaTypes = new Map();

for (const file of files) {
  const html = readFileSync(file, 'utf8');
  const route = routeFor(file);
  const is404 = route === '/404.html';

  const title = attr(html, /<title>([\s\S]*?)<\/title>/);
  const description = attr(html, /<meta name="description" content="([^"]*)"/);
  const canonical = attr(html, /<link rel="canonical" href="([^"]*)"/);
  const h1Count = (html.match(/<h1[\s>]/g) || []).length;

  if (!title) errors.push(`${route}: falta <title>`);
  if (!description) errors.push(`${route}: falta meta description`);
  if (!canonical) errors.push(`${route}: falta canonical`);
  if (!is404 && h1Count !== 1) errors.push(`${route}: H1 count ${h1Count}`);

  if (title.length > 60) warnings.push(`${route}: title ${title.length} caracteres`);
  if (description.length > 160) warnings.push(`${route}: description ${description.length} caracteres`);

  if (!is404) {
    if (!html.includes('hreflang="es"')) errors.push(`${route}: falta hreflang es`);
    if (!html.includes('name="geo.region"')) errors.push(`${route}: falta geo.region`);
    if (!html.includes('name="geo.placename"')) errors.push(`${route}: falta geo.placename`);
    if (!html.includes('property="og:image"')) errors.push(`${route}: falta og:image`);
    if (!html.includes('name="twitter:card"')) errors.push(`${route}: falta twitter:card`);
  }

  const ogImage = attr(html, /<meta property="og:image" content="([^"]*)"/);
  if (ogImage) {
    const local = new URL(ogImage).pathname;
    if (!existsSync(join(DIST, local)) && !existsSync(join('public', local))) {
      errors.push(`${route}: og:image no existe (${local})`);
    }
  }

  const types = [];
  for (const match of html.matchAll(/<script type="application\/ld\+json">([\s\S]*?)<\/script>/g)) {
    const raw = match[1];
    if (raw.includes('PENDIENTE')) errors.push(`${route}: JSON-LD contiene PENDIENTE`);
    try {
      const parsed = JSON.parse(raw);
      const list = Array.isArray(parsed) ? parsed : [parsed];
      for (const item of list) {
        if (!item['@context']) errors.push(`${route}: schema sin @context`);
        if (!item['@type']) errors.push(`${route}: schema sin @type`);
        for (const t of [].concat(item['@type'])) types.push(t);
      }
    } catch (error) {
      errors.push(`${route}: JSON-LD inválido (${error.message})`);
    }
  }
  schemaTypes.set(route, types);

  for (const match of html.matchAll(/href="(\/[^"#?]*)/g)) {
    const href = match[1];
    if (href.startsWith('//')) continue;
    const target = href.endsWith('/') ? `${href}index.html` : href;
    const clean = posix.normalize(target);
    if (clean.startsWith('/_astro/') || clean.startsWith('/fonts/') || clean.startsWith('/images/')) continue;
    if (!existsSync(join(DIST, clean)) && !existsSync(join(DIST, `${clean}.html`))) {
      errors.push(`${route}: enlace interno roto ${href}`);
    }
  }
}

const requireType = (route, type) => {
  const types = schemaTypes.get(route) || [];
  if (!types.includes(type)) errors.push(`${route}: falta schema ${type}`);
};

requireType('/', 'Dentist');
requireType('/', 'Person');
requireType('/', 'WebSite');
requireType('/', 'WebPage');
requireType('/servicios/', 'Dentist');
requireType('/servicios/limpieza-dental/', 'Service');
requireType('/servicios/extraccion-dental/', 'Service');
requireType('/servicios/ortodoncia/', 'Service');
requireType('/blog/cada-cuanto-limpieza-dental/', 'Article');
requireType('/sobre-mi/', 'Person');

for (const route of routes) {
  if (route !== '/404.html' && !sitemapRoutes.includes(route)) warnings.push(`${route}: no está en sitemap`);
}

if (warnings.length) {
  console.log('Advertencias:');
  for (const warning of warnings) console.log(`- ${warning}`);
}
if (errors.length) {
  console.error('Errores:');
  for (const error of errors) console.error(`- ${error}`);
  process.exit(1);
}
console.log(`SEO OK: ${files.length} páginas, ${sitemapRoutes.length} URLs en sitemap, sin errores.`);
