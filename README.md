# VisaOS

Independent, source-backed U.S. visa knowledge website built with Astro.

## Local development

```bash
npm ci
npm run dev
npm run check
npm test
npm run build
npm run validate
```

## Content publishing

Collection entries are private-by-default build inputs. Only founder-approved, indexable entries
generate static routes; drafts, pending-review, rejected and non-indexable entries remain outside
the production build. See [docs/CONTENT_PUBLISHING.md](docs/CONTENT_PUBLISHING.md) for the metadata,
source-verification and freshness gates.

## Before deployment

1. Replace `https://example.com` in `astro.config.mjs` with the real production origin.
2. Confirm official URLs, dated rules, and source applicability before publishing substantive instructions.
3. Run `npm run build` and review Lighthouse and accessibility reports.
4. Connect Cloudflare Pages using build command `npm run build` and output directory `dist`.
5. Set up Google Search Console after domain verification.

## Safety

Do not commit API keys, private SEO exports, or applicant data. Not affiliated with the U.S. government. This starter intentionally contains navigation and limited verified-source links, not unreviewed claims about fees or eligibility.
