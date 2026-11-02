const matchCount = (html, pattern) => [...html.matchAll(pattern)].length;

export function validateErrorDocument(html, { unpublishedPaths = [] } = {}) {
  const errors = [];
  const robots = [...html.matchAll(/<meta\s+name="robots"\s+content="([^"]+)"\s*\/?>(?:<\/meta>)?/g)];

  if (!/<html\s+lang="en"/.test(html)) errors.push('missing html[lang="en"]');
  if (matchCount(html, /<title>([^<]+)<\/title>/g) !== 1) errors.push('expected one title');
  if (matchCount(html, /<meta\s+name="description"\s+content="([^"]+)"/g) !== 1) {
    errors.push('expected one meta description');
  }
  if (robots.length !== 1 || !robots[0][1].split(',').some((value) => value.trim() === 'noindex')) {
    errors.push('expected one noindex robots directive');
  }
  if (matchCount(html, /<link\s+rel="canonical"/g) !== 0) errors.push('must not declare a canonical URL');
  if (matchCount(html, /<meta\s+property="og:url"/g) !== 0) errors.push('must not declare an Open Graph URL');
  if (matchCount(html, /<script\s+type="application\/ld\+json"/g) !== 0) {
    errors.push('must not contain structured data');
  }
  if (matchCount(html, /data-pagefind-body(?:="")?/g) !== 0) {
    errors.push('must not expose a Pagefind content boundary');
  }
  if (!/<main(?:\s[^>]*)?\sdata-pagefind-ignore(?:="")?/.test(html)) {
    errors.push('main content must be excluded from Pagefind');
  }
  if (matchCount(html, /<h1(?:\s[^>]*)?>/g) !== 1) errors.push('expected one h1');
  if (/\/dev-preview\//.test(html)) errors.push('must not link to development preview routes');
  if (/DRAFT\s*[—-]\s*NOT APPROVED FOR PUBLICATION/i.test(html)) {
    errors.push('must not contain draft preview content');
  }

  for (const path of unpublishedPaths) {
    const route = `/${path.replace(/^\/+|\/+$/g, '')}/`;
    if (html.includes(route)) errors.push(`must not expose unpublished route ${route}`);
  }

  return errors;
}
