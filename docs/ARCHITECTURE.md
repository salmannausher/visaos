# Technical Architecture — Initial Foundation

- Framework: Astro + TypeScript; content: Markdown/MDX using Astro content collections.
- CSS: dependency-free global CSS with accessible semantics and mobile-first responsive rules. The earlier Tailwind proposal was superseded by the founder's Sprint 2 decision on 2026-10-23; Tailwind may be reconsidered only if a demonstrated need outweighs its dependency and build cost.
- Search: Pagefind static indexing at build time; add a public search interface only when content volume justifies it.
- Hosting: Cloudflare Pages static site; GitHub repository / Actions for versioning and CI, subject to free-tier limits.
- Data: files in Git and structured public source registry; **no database or authentication in v1**.
- Metadata: per-page canonical, title, meta description, Open Graph, sitemap, robots, breadcrumbs and appropriate JSON-LD. Avoid assuming FAQ rich results.
- URL approach: universal `/us/visitor-visa/`, `/us/ds-160/`, `/us/problems/...`; country pages `/us/from/pakistan/` etc. Genuine translations may use `/pt-br/`, `/es/`, `/vi/`, `/id/` prefixes with justified hreflang.
- No mandatory paid analytics tools: Google Search Console + GA4, with privacy-conscious consent/config as needed.
- Future applications: keep knowledge content and reusable UI separate from future auth/case-tracking services.

## Quality gates
A clean dependency install, successful production build, no missing metadata or broken internal links, HTML crawlable without client-only rendering, accessibility spot-check, verified content, no exposed secrets.
