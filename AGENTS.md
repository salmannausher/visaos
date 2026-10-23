# VisaOS Repository Guidance

This file applies to the entire repository. VisaOS is an independent educational website, not a government service, law firm, visa agent, appointment provider, or guarantee of any immigration outcome.

## Decision order

When priorities conflict, use this order:

1. Protect applicants and their data.
2. Keep legal, policy, procedural, and operational claims accurate and properly scoped.
3. Preserve crawlability, accessibility, performance, and a clear reader journey.
4. Keep the site deployable on zero-cost infrastructure.
5. Add breadth or convenience only after the first four requirements are satisfied.

Accuracy is more important than publishing speed or content volume. Omit a claim that cannot be verified and bounded.

## Build-first workflow

- Before implementing a feature, run `npm install` and `npm run build` on the starter or current base. Stop and report any baseline failure before changing product code.
- Use Node.js 22, matching `.github/workflows/ci.yml`.
- The required local validation commands are `npm run check` and `npm run build`. The build already runs Astro diagnostics, produces the static site and sitemap, and creates the Pagefind index.
- Keep changes focused and reviewable. Do not mix content, dependency, infrastructure, and broad formatting changes without a clear reason.
- Do not commit generated directories: `node_modules/`, `dist/`, or `.astro/`.

## SEO-first architecture

- Preserve a static-first Astro architecture. Routes belong in `src/pages/`, shared document metadata and site chrome belong in `src/layouts/`, global presentation belongs in `src/styles/`, and pass-through assets belong in `public/`.
- Prefer semantic HTML and server-rendered content. Add client-side JavaScript only when it creates essential user value that HTML and CSS cannot provide.
- Give every indexable page one clear search intent, one descriptive `h1`, a unique and accurate title, a useful meta description, and a self-referential canonical URL.
- Maintain a logical information hierarchy: general visa guidance, country/post-specific guidance, and problem-solving content must remain distinct and link to one another where the reader journey warrants it.
- Use stable, readable URLs and descriptive internal-link text. Avoid orphan pages, duplicate intent, doorway pages, thin programmatic pages, and keyword-driven copy that does not answer a real applicant question.
- Keep important explanations in crawlable page content, not only in images, widgets, accordions, or client-rendered interfaces.
- Protect Core Web Vitals: minimize dependencies, scripts, font payloads, image weight, layout shifts, and render-blocking resources. All functionality must remain usable with keyboard navigation and sensible heading structure.
- Structured data must describe visible, verified content and conform to the relevant schema. Never add ratings, affiliations, authorship, FAQs, or government status that the page cannot substantiate.
- Keep `astro.config.mjs` aligned with the real production origin before launch so canonical URLs and the sitemap are correct. Keep `public/robots.txt` crawlable and add the production sitemap URL when the origin is known.
- Pagefind is the default search architecture because it builds a local static index. Exclude boilerplate or duplicate content from indexing when search is introduced, and verify the index after every material routing change.
- Any redirect or URL removal must preserve reader value and accumulated search equity. Prefer a relevant permanent redirect; do not redirect unrelated removed pages to the home page.

## Official-source verification

- Use primary, official sources for factual claims. Prefer the U.S. Department of State and the relevant U.S. embassy or consulate for visa categories, forms, fees, interviews, appointment procedures, wait times, issuance, refusals, and post-specific instructions. Use USCIS, CBP, the Department of Homeland Security, the Federal Register, statutes, or regulations only where they control the subject.
- A scheduling or service vendor may support a vendor-specific operational claim only when an official government page identifies that vendor for the relevant location. A vendor, blog, forum, search snippet, social post, or AI output is never the sole authority for law, policy, eligibility, fees, required documents, or expected outcomes.
- Open and read the source before relying on it. Search-result snippets and remembered rules are insufficient.
- Verify every volatile claim at the time of writing or substantive review. This includes fees, forms, document lists, wait times, appointment availability, interview-waiver rules, processing estimates, reciprocity, entry rules, and contact or courier procedures.
- Scope each claim by all relevant dimensions: visa category, applicant nationality, country of residence, application or interview post, age, date, and stated exceptions or conditions. Do not generalize a post-specific instruction into a global rule.
- Link the official source next to the claim it supports and use descriptive anchor text. Record the source and verification date in page metadata, review notes, or the pull-request description until the project adopts a dedicated citation model.
- When official sources conflict, prefer the legally or operationally controlling source, explain the narrower applicability, and flag the conflict for editorial review. Do not silently reconcile it from intuition.
- Paraphrase accurately and quote sparingly. Never imply affiliation, legal representation, privileged access, faster appointments, or guaranteed approval.
- If a reliable answer depends on facts not established by official sources, say what is unknown and direct the reader to the appropriate official channel. Do not invent a complete checklist merely to make a page appear comprehensive.

## Editorial quality gates

No substantive page is publishable until it passes all applicable gates:

1. **Intent:** The page answers a real, specific reader question and does not duplicate another route.
2. **Evidence:** Each legal, policy, procedural, numerical, and time-sensitive claim has a current official source with the correct scope.
3. **Accuracy review:** A reviewer checks terminology, conditions, exceptions, dates, links, and any difference between global and local instructions.
4. **Safety:** The copy avoids legal advice, outcome promises, evasion tactics, fabricated certainty, and requests for sensitive personal information. The independent, educational nature of VisaOS is clear where confusion is possible.
5. **Editorial quality:** Writing is original, direct, empathetic, and plain-language. It distinguishes requirements from suggestions and facts from interpretation. Remove filler, alarmism, and keyword stuffing.
6. **SEO and accessibility:** Title, description, canonical URL, headings, internal links, link labels, image alternatives, and structured data are accurate. The page works without client-side JavaScript and with keyboard navigation where applicable.
7. **Freshness:** Volatile guidance states a meaningful reviewed or updated date. Pages that cannot be kept accurate must be revised, clearly qualified, marked non-indexable when appropriate, or removed with a relevant redirect.
8. **Technical validation:** `npm run check` and `npm run build` pass. Review the generated route, sitemap behavior, and Pagefind output; inspect the rendered page when layout or navigation changed.

Corrections should be explicit, prompt, and traceable through reviewed repository changes. A correction must re-check downstream pages that repeat or depend on the same claim.

## Public-repository security and privacy

- Treat every tracked file, commit, issue, CI log, build artifact, and pull-request comment as permanently public.
- Never commit or paste secrets, API tokens, private keys, credentials, cookies, session data, unpublished analytics or Search Console exports, internal moderation notes, or private contact lists. Use environment variables for approved secrets and keep `.env*` files ignored except for a redacted `.env.example`.
- Never collect, store, or publish applicant personal data in this repository. This includes names tied to cases, passport or national-ID data, dates of birth, addresses, DS-160 or application identifiers, appointment confirmations, payment receipts, case numbers, financial evidence, travel histories, account screenshots, and support correspondence.
- Use synthetic, obviously fictional, fully redacted fixtures and screenshots. Cropping or blurring is not sufficient when metadata or recoverable layers may remain; recreate the example instead.
- Link only to verified official domains and officially designated providers. Check look-alike domains, redirects, downloadable files, QR codes, phone numbers, and email addresses before publishing them.
- Do not add a form, analytics script, ad network, tracker, remote embed, cookie, or user-submitted content pipeline without an explicit privacy, security, consent, retention, abuse, and cost review.
- Keep dependencies minimal and lockfile changes intentional. Review install scripts, package provenance, licenses, vulnerability reports, and generated diffs before merge. Do not weaken CI or suppress a security warning merely to obtain a green build.
- Report suspected exposed credentials or personal data privately to the repository owner. Do not repeat the sensitive value in a public issue or commit. Rotate or revoke exposed credentials before cleaning repository history.

## Zero-cost infrastructure constraint

- The production architecture must remain operable at zero recurring infrastructure cost. The default is a statically generated Astro site deployed to the free tier of Cloudflare Pages, with local build-time search through Pagefind and CI through the available GitHub Actions allowance.
- Prefer build-time computation and checked-in editorial content over servers, databases, queues, paid APIs, managed search, or always-on functions.
- Do not require a credit card, paid subscription, expiring trial, per-request AI service, or paid observability product for development, validation, deployment, search, analytics, or normal site operation.
- Free-tier services are acceptable only when their quotas, privacy terms, failure mode, export path, and vendor lock-in are documented. The site must remain useful when an optional third-party service is unavailable.
- Reject designs whose expected traffic, build frequency, bandwidth, storage, or function usage is likely to exceed the free allowance. Prefer graceful degradation and static fallbacks.
- Any exception requires owner approval before implementation, a written cost ceiling and exit plan, and a zero-cost alternative. Approval to experiment is not approval to make a paid service a production dependency.

## Definition of done

A change is complete only when it is source-verifiable, safe for a public repository, accessible and crawlable, compatible with the zero-cost static architecture, and passes `npm run check` plus `npm run build`. Document any remaining uncertainty instead of presenting it as settled fact.
