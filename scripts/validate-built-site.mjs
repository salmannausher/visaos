import { existsSync, readFileSync, readdirSync } from 'node:fs';
import { dirname, extname, join, relative, resolve, sep } from 'node:path';
import { parse } from 'yaml';
import {
  GOOGLE_SITE_VERIFICATION,
  SITE_ORIGIN,
  SITEMAP_INDEX_PATH,
} from '../src/config/site.mjs';
import { isPublishable } from '../src/lib/content-publication.mjs';

const outputDirectory = resolve('dist');
const articlesDirectory = resolve('src/content/articles');
const productionOrigin = new URL(SITE_ORIGIN).origin;
const sitemapIndexUrl = new URL(SITEMAP_INDEX_PATH, SITE_ORIGIN).toString();
const placeholderPatterns = [
  { name: 'example domain', pattern: /\b(?:www\.)?example\.(?:com|org|net)\b/i },
  { name: 'localhost', pattern: /\bhttps?:\/\/localhost(?::\d+)?\b/i },
  { name: 'loopback address', pattern: /\bhttps?:\/\/127\.0\.0\.1(?::\d+)?\b/i },
];

function walk(directory) {
  return readdirSync(directory, { withFileTypes: true }).flatMap((entry) => {
    const path = join(directory, entry.name);
    return entry.isDirectory() ? walk(path) : [path];
  });
}

function matches(html, pattern) {
  return [...html.matchAll(pattern)];
}

function readArticleData(file) {
  const contents = readFileSync(file, 'utf8');
  const match = contents.match(/^---\r?\n([\s\S]*?)\r?\n---(?:\r?\n|$)/);
  if (!match) throw new Error(`${relative(resolve('.'), file)}: missing YAML frontmatter`);
  return parse(match[1]);
}

function urlsFromXml(contents) {
  return [...contents.matchAll(/<loc>([^<]+)<\/loc>/g)].map((match) => match[1].trim());
}

function routePathForHtml(file) {
  const relativePath = relative(outputDirectory, file);
  if (relativePath === 'index.html') return '/';
  if (relativePath.endsWith(`${sep}index.html`)) {
    return `/${dirname(relativePath).split(sep).join('/')}/`;
  }
  return `/${relativePath.slice(0, -extname(relativePath).length).split(sep).join('/')}`;
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
const articles = walk(articlesDirectory)
  .filter((path) => path.endsWith('.md'))
  .map((file) => ({ file, data: readArticleData(file) }));
const errors = [];
const canonicals = new Map();

for (const file of htmlFiles) {
  if (routePathForHtml(file).startsWith('/dev-preview/')) {
    errors.push(`${relative(outputDirectory, file)}: development preview route leaked into production output`);
  }
}

for (const { data } of articles) {
  const builtPath = join(outputDirectory, data.path, 'index.html');

  if (isPublishable(data) && !existsSync(builtPath)) {
    errors.push(`${data.path}: approved indexable article route was not generated`);
  }

  if (!isPublishable(data) && existsSync(builtPath)) {
    errors.push(`${data.path}: non-publishable article leaked into the production build`);
  }
}

for (const file of htmlFiles) {
  const route = relative(outputDirectory, file);
  const html = readFileSync(file, 'utf8');
  const titles = matches(html, /<title>([^<]+)<\/title>/g);
  const descriptions = matches(html, /<meta\s+name="description"\s+content="([^"]+)"\s*\/?>(?:<\/meta>)?/g);
  const googleSiteVerifications = matches(
    html,
    /<meta\s+name="google-site-verification"\s+content="([^"]+)"\s*\/?>(?:<\/meta>)?/g,
  );
  const canonicalLinks = matches(html, /<link\s+rel="canonical"\s+href="([^"]+)"\s*\/?>(?:<\/link>)?/g);
  const sitemapLinks = matches(html, /<link\s+rel="sitemap"\s+href="([^"]+)"\s*\/?>(?:<\/link>)?/g);
  const openGraphUrls = matches(html, /<meta\s+property="og:url"\s+content="([^"]+)"\s*\/?>(?:<\/meta>)?/g);
  const headings = matches(html, /<h1(?:\s[^>]*)?>/g);
  const pagefindBodies = matches(html, /data-pagefind-body(?:="")?/g);
  const expectedCanonical = new URL(routePathForHtml(file), SITE_ORIGIN).toString();

  if (!/<html\s+lang="en"/.test(html)) errors.push(`${route}: missing html[lang="en"]`);
  if (titles.length !== 1) errors.push(`${route}: expected one non-empty title, found ${titles.length}`);
  if (descriptions.length !== 1) errors.push(`${route}: expected one meta description, found ${descriptions.length}`);
  if (
    googleSiteVerifications.length !== 1 ||
    googleSiteVerifications[0][1] !== GOOGLE_SITE_VERIFICATION
  ) {
    errors.push(`${route}: missing or incorrect Google site verification tag`);
  }
  if (canonicalLinks.length !== 1) errors.push(`${route}: expected one canonical URL, found ${canonicalLinks.length}`);
  if (sitemapLinks.length !== 1) errors.push(`${route}: expected one sitemap link, found ${sitemapLinks.length}`);
  if (openGraphUrls.length !== 1) errors.push(`${route}: expected one Open Graph URL, found ${openGraphUrls.length}`);
  if (headings.length !== 1) errors.push(`${route}: expected one h1, found ${headings.length}`);
  if (pagefindBodies.length !== 1) errors.push(`${route}: expected one Pagefind content boundary, found ${pagefindBodies.length}`);

  if (sitemapLinks.length === 1 && sitemapLinks[0][1] !== sitemapIndexUrl) {
    errors.push(`${route}: sitemap link must be ${sitemapIndexUrl}`);
  }

  if (
    canonicalLinks.length === 1 &&
    openGraphUrls.length === 1 &&
    openGraphUrls[0][1] !== canonicalLinks[0][1]
  ) {
    errors.push(`${route}: Open Graph URL must match the canonical URL`);
  }

  if (canonicalLinks.length === 1) {
    const canonical = canonicalLinks[0][1];
    try {
      const parsed = new URL(canonical);
      if (parsed.protocol !== 'https:') errors.push(`${route}: canonical URL must use HTTPS`);
      if (parsed.origin !== productionOrigin) {
        errors.push(`${route}: canonical URL must use production origin ${productionOrigin}`);
      }
      if (canonical !== expectedCanonical) {
        errors.push(`${route}: canonical URL must be ${expectedCanonical}`);
      }
      if (canonicals.has(canonical)) {
        errors.push(`${route}: canonical URL duplicates ${canonicals.get(canonical)}`);
      } else {
        canonicals.set(canonical, route);
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

for (const file of walk(outputDirectory)) {
  const contents = readFileSync(file).toString('utf8').replaceAll('\\.', '.').replaceAll('\\/', '/');
  for (const placeholder of placeholderPatterns) {
    if (placeholder.pattern.test(contents)) {
      errors.push(`${relative(outputDirectory, file)}: contains placeholder ${placeholder.name}`);
    }
  }
}

for (const requiredFile of ['robots.txt', SITEMAP_INDEX_PATH.slice(1)]) {
  if (!existsSync(join(outputDirectory, requiredFile))) errors.push(`dist/${requiredFile}: required SEO output is missing`);
}

const robotsPath = join(outputDirectory, 'robots.txt');
if (existsSync(robotsPath)) {
  const sitemapDirectives = [
    ...readFileSync(robotsPath, 'utf8').matchAll(/^Sitemap:\s*(\S+)\s*$/gim),
  ].map((match) => match[1]);
  if (sitemapDirectives.length !== 1 || sitemapDirectives[0] !== sitemapIndexUrl) {
    errors.push(`robots.txt: expected one Sitemap directive for ${sitemapIndexUrl}`);
  }
}

const sitemapPageUrls = new Set();
const sitemapIndexPath = join(outputDirectory, SITEMAP_INDEX_PATH.slice(1));
if (existsSync(sitemapIndexPath)) {
  const childSitemapUrls = urlsFromXml(readFileSync(sitemapIndexPath, 'utf8'));
  if (childSitemapUrls.length === 0) errors.push('sitemap index does not reference a child sitemap');

  for (const childUrl of childSitemapUrls) {
    let parsed;
    try {
      parsed = new URL(childUrl);
    } catch {
      errors.push(`sitemap index contains invalid URL ${childUrl}`);
      continue;
    }

    if (parsed.origin !== productionOrigin) {
      errors.push(`sitemap index URL must use production origin: ${childUrl}`);
    }

    const childPath = resolveInternalTarget(parsed.pathname);
    if (!existsSync(childPath)) {
      errors.push(`sitemap index references missing output ${parsed.pathname}`);
      continue;
    }

    for (const pageUrl of urlsFromXml(readFileSync(childPath, 'utf8'))) {
      try {
        const page = new URL(pageUrl);
        if (page.origin !== productionOrigin) {
          errors.push(`sitemap page URL must use production origin: ${pageUrl}`);
        }
        sitemapPageUrls.add(page.toString());
      } catch {
        errors.push(`child sitemap contains invalid URL ${pageUrl}`);
      }
    }
  }
}

for (const canonical of canonicals.keys()) {
  if (!sitemapPageUrls.has(canonical)) errors.push(`${canonical}: HTML route is missing from sitemap`);
}

for (const sitemapUrl of sitemapPageUrls) {
  if (!canonicals.has(sitemapUrl)) errors.push(`${sitemapUrl}: sitemap URL has no matching HTML route`);
}

for (const { data } of articles) {
  const articleUrl = new URL(data.canonicalPath, SITE_ORIGIN).toString();
  if (!isPublishable(data) && sitemapPageUrls.has(articleUrl)) {
    errors.push(`${data.path}: non-publishable article leaked into the sitemap`);
  }
}

const pagefindDirectory = join(outputDirectory, 'pagefind');
const pagefindEntry = join(pagefindDirectory, 'pagefind-entry.json');
if (!existsSync(pagefindEntry)) {
  errors.push('dist/pagefind/pagefind-entry.json: Pagefind output is missing');
} else {
  const pagefindFiles = walk(pagefindDirectory);
  for (const { data } of articles.filter(({ data }) => !isPublishable(data))) {
    const routeBytes = Buffer.from(`/${data.path}/`);
    if (pagefindFiles.some((file) => readFileSync(file).includes(routeBytes))) {
      errors.push(`${data.path}: non-publishable article leaked into Pagefind output`);
    }
  }
}

if (errors.length > 0) {
  console.error('\nBuilt-site validation failed:\n');
  for (const error of errors) console.error(`- ${error}`);
  process.exit(1);
}

console.log(
  `Built-site validation passed for ${htmlFiles.length} HTML pages and ${sitemapPageUrls.size} sitemap URLs with production origin ${productionOrigin}.`,
);
