# VisaOS MVP Release Manifest

Prepared 2026-10-25. This is a release candidate record, not authorization to merge or deploy.

## Source identity

- Repository: `https://github.com/salmannausher/visaos`
- Target branch: `main`
- Release-preparation base commit: `e90919e`
- Existing draft pull request: `#6`, `codex/sprint-3-research-editorial` into `main`
- Candidate commit: record the reviewed release commit SHA in the pull request and Cloudflare deployment record before deployment
- Production origin: `https://visaos.devshinx.dev`

The candidate commit must descend from `e90919e` and contain the reviewed route exclusion and validation evidence. Do not deploy an uncommitted working tree or infer a SHA from a local build.

## Exact public route set

| Route | Purpose |
| --- | --- |
| `/` | Independent VisaOS overview and navigation |
| `/about/` | Independence, editorial standards and privacy warning |
| `/us/` | Verified Department of State starting links |
| `/us/problems/` | Cautious application-problem triage |

Excluded route: `/us/from/pakistan/`. It must return no generated page and must not appear in navigation, sitemap or Pagefind until the Pakistan-specific source and content pass editorial review.

All five substantive content-collection entries remain `draft` and `noindex: true`. Development preview routes remain local-development-only.

## Generated release artifacts

- `dist/index.html`
- `dist/about/index.html`
- `dist/us/index.html`
- `dist/us/problems/index.html`
- `dist/robots.txt`
- `dist/sitemap-index.xml`
- every child sitemap referenced by the sitemap index
- `dist/pagefind/` static search index

Generated files are build artifacts and must not be committed.

## Cloudflare Pages configuration

| Setting | Required value |
| --- | --- |
| Production branch | `main` |
| Root directory | repository root, left blank |
| Build command | `npm run validate` |
| Output directory | `dist` |
| Build system | Pages v3 |
| Node version | `22.22.0` from `.nvmrc` |
| Environment variables | none |
| Functions or bindings | none |

Creating the Pages project, selecting **Save and Deploy**, associating the custom domain or changing DNS requires separate founder approval.

## Outstanding risks

1. GitHub Actions is blocked before checkout by an account billing lock, so remote CI has not validated this candidate.
2. The exact `*.pages.dev` project hostname, custom-domain association, DNS records, CAA compatibility and TLS issuance are not yet verified.
3. Live HTTPS, redirects, accessibility, responsive layout and Pagefind delivery cannot be accepted until a founder-approved deployment exists.
4. Department of State links and wait-time data are external and volatile; they require normal source-freshness review.
5. Pagefind assets are produced, but the MVP does not expose a user-facing search interface.

## Candidate validation evidence

The 2026-10-25 candidate passed, in order, `npm ci`, `npm run check`, `npm test`, `npm run build`, `npm run validate` and `npm audit --audit-level=high` on Node.js `22.22.3` and npm `10.9.8`. Eight tests passed, the build emitted four pages, built-site validation matched four sitemap URLs, and npm reported zero known vulnerabilities.

An independent scan of the complete `dist` tree confirmed:

- four HTML routes and Pagefind `page_count: 4`;
- one correct production canonical and Open Graph URL per HTML page;
- `robots.txt` points to `https://visaos.devshinx.dev/sitemap-index.xml`;
- the generated index points to `sitemap-0.xml`, whose URLs exactly match the four-route manifest; and
- no draft title, `/dev-preview/`, `/us/from/pakistan/`, localhost address or placeholder domain appears in output.

## Rollback procedure

1. Identify the last known-good deployment and its exact Git commit in Cloudflare Pages.
2. Use Cloudflare Pages deployment rollback to restore that deployment. For a first deployment with no known-good predecessor, remove or deactivate the custom-domain association only with founder approval rather than redirecting it to unrelated content.
3. Revert the release commit with a normal Git revert; do not reset or force-push `main`.
4. Run `npm ci`, `npm run check`, `npm test`, `npm run build`, `npm run validate` and `npm audit --audit-level=high` on the reverted tree.
5. Deploy the validated rollback commit, then recheck HTTPS, all public routes, robots, every sitemap file, canonicals and Pagefind.
6. Record the incident, affected deployment IDs, commit SHAs and acceptance results without storing secrets or applicant data.
