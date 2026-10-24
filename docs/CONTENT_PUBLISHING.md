# Content Publishing Engine

VisaOS content collection files are editorial records, not public pages by default. `src/pages/[...path].astro` generates a static route only when an entry has `editorialStatus: approved` and `noindex: false`. Every other state remains outside `dist/`, the sitemap and Pagefind.

## Article metadata contract

Each article records a stable route `path`, matching `canonicalPath`, unique title and description, reader intent, content type, publication status, indexing decision, applicability, source IDs and accessible breadcrumbs. Visa guidance also requires a source-check date and at least one visa classification. Country guides additionally require a country name and ISO alpha-2 country code.

Approved entries require `reviewedAt`, `reviewedBy`, `approvedAt` and `reviewDueAt`. Approved content may remain intentionally non-public with `noindex: true`; approval alone never creates a route.

## Source and publication gates

Source IDs resolve to `src/content/sources/*.json`. A publishable article may reference only sources marked `verified`, and no publishable article may use a source beyond its volatility-based freshness window. Source references and editorial review information are visible in rendered articles.

Validation rejects duplicate content/static routes, route/canonical mismatches, missing source IDs, incomplete SEO or scope metadata, non-approved indexable entries and broken internal content links. The built-site validator also fails if a non-publishable entry leaks into `dist/` or an approved indexable entry is missing.

## Current research boundary

The repository does not contain the roadmap's measured keyword dataset or first-20-page plan. Sprint 2 draft topics come from the documented B1/B2, DS-160, wait-time and Pakistan clusters. They are candidate intents, not keyword-volume, ranking or difficulty claims. Add measured research later with its tool, market, language and collection date.
