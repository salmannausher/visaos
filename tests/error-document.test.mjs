import assert from 'node:assert/strict';
import { readFileSync } from 'node:fs';
import test from 'node:test';
import { validateErrorDocument } from '../scripts/error-document-validation.mjs';

const validErrorDocument = `<!doctype html>
<html lang="en"><head>
<meta name="description" content="Not found">
<meta name="robots" content="noindex, nofollow, noarchive">
<title>Page not found | VisaOS</title>
</head><body><main data-pagefind-ignore><h1>Page not found</h1><a href="/">Home</a></main></body></html>`;

test('404 source uses the shared layout and explicit error-document safeguards', () => {
  const source = readFileSync(new URL('../src/pages/404.astro', import.meta.url), 'utf8');

  assert.match(source, /import Base from '\.\.\/layouts\/Base\.astro'/);
  assert.match(source, /<Base[\s\S]*\snoindex[\s\S]*\serrorDocument/);
  assert.match(source, /<h1>Page not found<\/h1>/);
  assert.match(source, /href="\/"/);
  assert.match(source, /href="\/us\/"/);
  assert.match(source, /href="\/us\/problems\/"/);
});

test('valid static error document is excluded from canonical, structured-data and search surfaces', () => {
  assert.deepEqual(validateErrorDocument(validErrorDocument), []);
});

test('error document validation rejects indexable metadata and unpublished-route exposure', () => {
  const unsafe = validErrorDocument
    .replace('</head>', '<link rel="canonical" href="https://visaos.devshinx.dev/404.html"><meta property="og:url" content="https://visaos.devshinx.dev/404.html"><script type="application/ld+json">{}</script></head>')
    .replace('<main data-pagefind-ignore>', '<main data-pagefind-body>')
    .replace('</main>', '<a href="/internal/article-model-example/">Draft</a></main>');

  const errors = validateErrorDocument(unsafe, {
    unpublishedPaths: ['internal/article-model-example'],
  });

  assert(errors.some((error) => error.includes('canonical')));
  assert(errors.some((error) => error.includes('Open Graph')));
  assert(errors.some((error) => error.includes('structured data')));
  assert(errors.some((error) => error.includes('Pagefind content boundary')));
  assert(errors.some((error) => error.includes('unpublished route')));
});
