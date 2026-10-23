import { existsSync, readFileSync, readdirSync } from 'node:fs';
import { extname, join, relative, resolve } from 'node:path';

const outputDirectory = resolve('dist');

function walk(directory) {
  return readdirSync(directory, { withFileTypes: true }).flatMap((entry) => {
    const path = join(directory, entry.name);
    return entry.isDirectory() ? walk(path) : [path];
  });
}

function matches(html, pattern) {
  return [...html.matchAll(pattern)];
}

function resolveInternalTarget(urlPath) {
  const cleanPath = decodeURIComponent(urlPath.split('#')[0].split('?')[0]);
  const relativePath = cleanPath.replace(/^\/+/, '');

  if (!relativePath) return join(outputDirectory, 'index.html');
  if (cleanPath.endsWith('/')) return join(outputDirectory, relativePath, 'index.html');
  if (extname(relativePath)) return join(outputDirectory, relativePath);

  const candidates = [
    join(outputDirectory, relativePath),
    join(outputDirectory, `${relativePath}.html`),
    join(outputDirectory, relativePath, 'index.html'),
  ];

  return candidates.find(existsSync) ?? candidates[0];
}

if (!existsSync(outputDirectory)) {
  console.error('Built-site validation requires dist/. Run npm run build first.');
  process.exit(1);
}

const htmlFiles = walk(outputDirectory).filter((file) => file.endsWith('.html'));
const errors = [];
const warnings = [];
const canonicals = new Map();
let usesPlaceholderOrigin = false;

for (const file of htmlFiles) {
  const route = relative(outputDirectory, file);
  const html = readFileSync(file, 'utf8');
  const titles = matches(html, /<title>([^<]+)<\/title>/g);
  const descriptions = matches(html, /<meta\s+name="description"\s+content="([^"]+)"\s*\/?>(?:<\/meta>)?/g);
  const canonicalLinks = matches(html, /<link\s+rel="canonical"\s+href="([^"]+)"\s*\/?>(?:<\/link>)?/g);
  const headings = matches(html, /<h1(?:\s[^>]*)?>/g);
  const pagefindBodies = matches(html, /data-pagefind-body(?:="")?/g);

  if (!/<html\s+lang="en"/.test(html)) errors.push(`${route}: missing html[lang="en"]`);
  if (titles.length !== 1) errors.push(`${route}: expected one non-empty title, found ${titles.length}`);
  if (descriptions.length !== 1) errors.push(`${route}: expected one meta description, found ${descriptions.length}`);
  if (canonicalLinks.length !== 1) errors.push(`${route}: expected one canonical URL, found ${canonicalLinks.length}`);
  if (headings.length !== 1) errors.push(`${route}: expected one h1, found ${headings.length}`);
  if (pagefindBodies.length !== 1) errors.push(`${route}: expected one Pagefind content boundary, found ${pagefindBodies.length}`);

  if (canonicalLinks.length === 1) {
    const canonical = canonicalLinks[0][1];
    try {
      const parsed = new URL(canonical);
      if (parsed.protocol !== 'https:') errors.push(`${route}: canonical URL must use HTTPS`);
      if (canonicals.has(canonical)) {
        errors.push(`${route}: canonical URL duplicates ${canonicals.get(canonical)}`);
      } else {
        canonicals.set(canonical, route);
      }
      if (parsed.hostname === 'example.com') {
        usesPlaceholderOrigin = true;
      }
    } catch {
      errors.push(`${route}: canonical URL is invalid`);
    }
  }

  const main = html.match(/<main(?:\s[^>]*)?>([\s\S]*?)<\/main>/)?.[1] ?? '';
  const crawlableText = main.replace(/<[^>]+>/g, ' ').replace(/\s+/g, ' ').trim();
  if (crawlableText.length < 40) errors.push(`${route}: main content is missing or too short`);

  for (const match of html.matchAll(/href="(\/[^"]*)"/g)) {
    const href = match[1];
    if (href.startsWith('//')) continue;
    const target = resolveInternalTarget(href);
    if (!existsSync(target)) errors.push(`${route}: broken internal link ${href}`);
  }

  for (const match of html.matchAll(/<script\s+type="application\/ld\+json">([\s\S]*?)<\/script>/g)) {
    try {
      JSON.parse(match[1]);
    } catch {
      errors.push(`${route}: structured data is not valid JSON`);
    }
  }
}

if (usesPlaceholderOrigin) {
  warnings.push('production origin is not configured; generated canonical URLs use example.com');
}

for (const requiredFile of ['robots.txt', 'sitemap-index.xml', 'sitemap-0.xml']) {
  if (!existsSync(join(outputDirectory, requiredFile))) errors.push(`dist/${requiredFile}: required SEO output is missing`);
}

const robotsPath = join(outputDirectory, 'robots.txt');
if (existsSync(robotsPath) && !/^Sitemap:/m.test(readFileSync(robotsPath, 'utf8'))) {
  warnings.push('robots.txt: add the production sitemap URL after the production origin is confirmed');
}

for (const warning of [...new Set(warnings)]) console.warn(`Warning: ${warning}`);

if (errors.length > 0) {
  console.error('\nBuilt-site validation failed:\n');
  for (const error of errors) console.error(`- ${error}`);
  process.exit(1);
}

console.log(`Built-site validation passed for ${htmlFiles.length} HTML pages with no broken internal links.`);
