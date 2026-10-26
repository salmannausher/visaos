# Sprint 4A Production Release Review

## Article publication release — 2026-10-26

The founder subsequently authorized publication of the five substantive articles and production deployment. The earlier four-route MVP decision below remains useful historical evidence but no longer describes the current release candidate.

The release candidate now contains nine routes: the four previously reviewed static pages plus `/us/visitor-visa/`, `/us/ds-160/`, `/us/ds-160/save-and-return/`, `/us/visa-wait-times/` and `/us/from/pakistan/visitor-visa/`. Every article was rechecked against current official sources. The Pakistan Mission source was directly verified in a browser and the country guide was rewritten to use official starting points without copying local fee amounts, wait times or eligibility promises.

Local `npm ci`, `npm run check`, `npm test`, `npm run build`, `npm run validate` and the live-registry `npm audit --audit-level=high` pass. The build emits nine HTML pages and nine production-origin sitemap URLs. Output inspection found no development-preview route, localhost URL, placeholder domain, pending-review marker or unapproved article. The internal model fixture remains a non-routed draft.

GitHub Actions remains an acknowledged account-billing risk until a remote run executes. The workflow is unchanged and the local gates remain mandatory for the deployment commit.

### Live acceptance result

Cloudflare Pages successfully deployed merged commit `395c601b2ddaa65a2337c3adbdf944cdb77f7013` from `main` to project `visaos-web`. The custom domain and observed `visaos-web.pages.dev` hostname both serve the release, with production canonicals on `https://visaos.devshinx.dev`.

All nine public routes, `robots.txt`, `sitemap-index.xml`, `sitemap-0.xml` and the Pagefind JavaScript asset returned HTTPS 200. HTTP redirected to HTTPS with 301. The sitemap listed exactly the nine public routes, live canonical and Open Graph URLs matched the production origin, and a mobile viewport check found no page-level horizontal overflow or browser console errors. DNS was not modified as part of this release.

Updated 2026-10-25 for the fast-track MVP release candidate. This review audits the five routes that existed before the release fix and records the four-route production candidate. It does not approve any collection draft or authorize a merge, DNS change or deployment.

## Release decision

**Status: READY FOR FOUNDER REVIEW, NOT YET AUTHORIZED FOR DEPLOYMENT.** The provisional Pakistan hub has been removed from static routing and navigation because its local source remains `needs-review`. The remaining four pages contain limited institutional or navigation content backed by official Department of State links and pass local production validation.

GitHub Actions remains unavailable because the account-level billing lock prevents jobs from starting. This is an unresolved release risk, not a local build failure. The workflow has not been weakened or removed. Founder approval must explicitly accept this temporary CI gap before merge or deployment.

The exact Cloudflare Pages project hostname, custom-domain association, DNS state and TLS state remain unknown and require founder-controlled account steps after deployment approval.

## Review of the five pre-release routes

| Route | Metadata and canonical | Content and evidence | Privacy and safety | Release result |
| --- | --- | --- | --- | --- |
| `/` | Unique title and description; self-referential production canonical. | Revised to describe verified official-resource navigation instead of implying that unpublished guides are available. | No form, tracker, applicant data or affiliation claim. | Included. |
| `/about/` | Unique title and description; self-referential production canonical. | Accurately describes independent status, editorial standards and corrections. | Warns against sharing passport, application or financial details. | Included. |
| `/us/` | Unique title and description; self-referential production canonical. | Links verified Department of State visitor-visa, DS-160 and wait-time pages. Placeholder roadmap copy was replaced with a permanent scope statement. | No data collection, eligibility decision or outcome promise. | Included. |
| `/us/from/pakistan/` | Metadata was structurally valid. | Source remained `needs-review`, and the page contained provisional roadmap copy rather than verified country guidance. | No personal-data collection, but evidence was insufficient for publication. | **Excluded from routing, navigation, sitemap and Pagefind.** |
| `/us/problems/` | Unique title and description; self-referential production canonical. | Links the official DS-160 FAQ and gives cautious issue-triage direction without provider-specific claims. | Warns against sharing tracking data and disclaims access to official accounts. | Included. |

## Production candidate routes

- `/`
- `/about/`
- `/us/`
- `/us/problems/`

The draft at `/us/from/pakistan/visitor-visa/` remains `editorialStatus: draft` and `noindex: true`. Its breadcrumb now returns to `/us/` so content validation does not depend on the excluded hub. No draft status changed.

## Cross-page findings

- Each generated page has one title, meta description, canonical URL, Open Graph URL, `h1` and Pagefind content boundary.
- Canonical, Open Graph, sitemap and robots URLs use `https://visaos.devshinx.dev`.
- Internal-link validation covers every generated HTML link target.
- The sitemap and Pagefind input contain exactly the four production candidate routes.
- No placeholder host, localhost URL, draft route or `/dev-preview/` route appears in `dist/`.
- No analytics, remote embed, authentication, form, cookie, database or applicant-data workflow exists.
- All five substantive collection entries remain drafts and non-indexable.

## CI status

Draft pull request [#6](https://github.com/salmannausher/visaos/pull/6) targets `main` from `codex/sprint-3-research-editorial`. Its documented push and pull-request workflow runs failed before checkout because the GitHub account was locked by a billing issue. The repository's workflow still runs `npm ci`, `npm run validate` and `npm audit --audit-level=high` with read-only permissions and pinned action SHAs.

Remote GitHub inspection was unavailable during the 2026-10-25 review because both `git fetch` and `gh pr view` stalled without returning data. The PR identity and CI failure details above are therefore based on the checked-in release record and the local remote-tracking ref at `e90919e`, not a new live API response.

## Local release validation

Run sequentially on Node.js `22.22.3` and npm `10.9.8`:

- `npm ci` — passed from the lockfile.
- `npm run check` — passed with zero errors, warnings or hints.
- `npm test` — all eight tests passed.
- `npm run build` — passed and generated four static pages plus Pagefind.
- `npm run validate` — repository, research, content, tests, build and built-site validation passed.
- `npm audit --audit-level=high` — passed with zero known vulnerabilities after rerunning with registry network access; the first sandboxed attempt failed DNS resolution and was not treated as an audit result.

Independent output inspection confirmed four HTML files, four production-origin sitemap URLs, the production sitemap directive in `robots.txt`, Pagefind `page_count: 4`, and no draft, preview, Pakistan-hub, localhost or placeholder-domain strings in `dist`.

## Deployment-dependent acceptance checks

After explicit founder approval and a successful Pages deployment:

1. Verify `https://visaos.devshinx.dev/` returns a successful HTTPS response with a valid certificate and no mixed content.
2. Check all four routes, `robots.txt`, `sitemap-index.xml`, every referenced child sitemap and `/pagefind/pagefind.js`.
3. Confirm HTTP redirects to the single HTTPS origin and the Pages hostname does not create a competing indexable canonical.
4. Compare each live canonical and Open Graph URL with its `https://visaos.devshinx.dev` URL.
5. Confirm the live sitemap contains only the four public routes and no draft, Pakistan-hub or preview URL.
6. Inspect mobile, tablet and desktop reflow, navigation wrapping, horizontal overflow and touch targets.
7. Keyboard-test the skip link, navigation and every link; inspect headings, focus visibility, zoom/reflow and color contrast.
8. Confirm Pagefind assets load and its index contains only public pages. No search UI is currently exposed.

Until deployment is approved and reachable, HTTPS, DNS, redirects, live Pagefind, mobile rendering and live accessibility results remain **PENDING**.
