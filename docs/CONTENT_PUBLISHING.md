# Content Publishing Engine

VisaOS content collection files are editorial records, not public pages by default. `src/pages/[...path].astro` generates a static route only when an entry has `editorialStatus: approved` and `noindex: false`. Every other state remains outside `dist/`, the sitemap and Pagefind.

## Article metadata contract

Each article records a stable route `path`, matching `canonicalPath`, unique title and description, reader intent, content type, publication status, indexing decision, applicability, source IDs and accessible breadcrumbs. Visa guidance also requires a source-check date and at least one visa classification. Country guides additionally require a country name and ISO alpha-2 country code.

Approved entries require `reviewedAt`, `reviewedBy`, `approvedAt` and `reviewDueAt`. Approved content may remain intentionally non-public with `noindex: true`; approval alone never creates a route.

## Source and publication gates

Source IDs resolve to `src/content/sources/*.json`. A publishable article may reference only sources marked `verified`, and no publishable article may use a source beyond its volatility-based freshness window. Source references and editorial review information are visible in rendered articles.

Validation rejects duplicate content/static routes, route/canonical mismatches, missing source IDs, incomplete SEO or scope metadata, non-approved indexable entries and broken internal content links. The built-site validator also fails if a non-publishable entry leaks into `dist/` or an approved indexable entry is missing.

## Local draft previews

Run `npm run dev` and open `http://localhost:4321/dev-preview/` to review the five substantive draft entries with their normal article or country-guide layout. The local index shows editorial status and source-verification flags. Preview pages display a prominent `DRAFT — NOT APPROVED FOR PUBLICATION` notice, omit canonical/discovery metadata, set `noindex, nofollow, noarchive` and opt out of Pagefind markup.

Preview route generation is deny-by-default: `src/pages/dev-preview/[...path].astro` returns no static paths unless Astro is running in development mode, and requests are limited to loopback hostnames. Production validation fails if any `/dev-preview/` HTML is present. Previewing never changes an entry's editorial status, `noindex` value or production route eligibility.

## Current research boundary

The repository contains the supplied Sprint 3 handoff: 88 keyword hypotheses, a first-20-page proposal, six source candidates and an empty competitor-audit template. It does **not** contain measured keyword volume or difficulty, completed localized SERP audits or Search Console evidence. The original `UNKNOWN`, `UNVERIFIED`, `NOT AUDITED`, `PENDING` and `TBD` markers are protected by `npm run validate:research`.

Use `docs/SPRINT_3_RESEARCH.md` as the reconciliation layer between the immutable handoff and repository routes. New measured research must record its tool or method, market, language, location settings and collection date; it must not overwrite the handoff to imply evidence existed earlier.
