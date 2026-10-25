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

Sprint 3 research limitations, keyword hypotheses and the reconciled first-20-page plan are documented in [docs/SPRINT_3_RESEARCH.md](docs/SPRINT_3_RESEARCH.md). The five current drafts remain unapproved; their founder review brief is in [docs/FOUNDER_EDITORIAL_REVIEW.md](docs/FOUNDER_EDITORIAL_REVIEW.md).

## Before deployment

1. Confirm official URLs, dated rules, and source applicability before publishing substantive instructions.
2. Run `npm run validate` and review Lighthouse and accessibility reports.
3. Follow [docs/DEPLOYMENT.md](docs/DEPLOYMENT.md) for the approved Cloudflare Pages build and DNS settings.
4. Confirm `https://visaos.devshinx.dev` is attached to the Pages project before changing DNS.
5. Set up Google Search Console only after the domain is live and verified.

## Safety

Do not commit API keys, private SEO exports, or applicant data. Not affiliated with the U.S. government. This starter intentionally contains navigation and limited verified-source links, not unreviewed claims about fees or eligibility.
