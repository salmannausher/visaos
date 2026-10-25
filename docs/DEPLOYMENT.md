# Cloudflare Pages Deployment

The approved production origin is `https://visaos.devshinx.dev`. This document records deployment settings only; repository changes must not create a deployment or alter DNS without founder approval.

## Pages build settings

Connect the GitHub repository to a Cloudflare Pages project with these settings:

| Setting | Value |
| --- | --- |
| Production branch | `main` |
| Root directory | repository root (leave blank) |
| Build command | `npm run validate` |
| Build output directory | `dist` |
| Build system | Pages v3 |
| Node.js | `22.22.0`, read from `.nvmrc` |

The project is a static Astro build. `npm run validate` runs the repository, research-handoff, content and test gates, creates the production build and Pagefind index, removes Pagefind's internal placeholder URL sentinels, and validates the resulting `dist` directory before Cloudflare uploads it. Cloudflare's Astro guide lists `npm run build` and `dist` as the framework defaults; VisaOS deliberately uses the stricter validation command as its build command. Do not add the Cloudflare Astro adapter, Pages Functions, Workers, KV, D1, R2, secrets or runtime bindings for this deployment. No application environment variables are required.

Cloudflare's Git integration may create preview deployments for pull requests. Preview URLs do not change canonical metadata: generated pages continue to identify the confirmed production origin. The editorial route gate also remains active in previews, so drafts and other non-publishable entries do not receive HTML routes or enter the sitemap or Pagefind input.

## Custom domain and DNS

After a Pages project exists and only with founder approval:

1. In **Workers & Pages → the Pages project → Custom domains**, add `visaos.devshinx.dev` first.
2. Record the exact project hostname assigned by Cloudflare, such as `<project-name>.pages.dev`; do not guess this value.
3. If `devshinx.dev` is already a Cloudflare-managed zone in the same account, allow the Pages custom-domain flow to create the DNS record.
4. Otherwise, at the authoritative DNS provider create a `CNAME` for `visaos` (or the full hostname if that provider requires it) targeting the exact `<project-name>.pages.dev` hostname from step 2.
5. Do not create the CNAME before associating the custom domain with the Pages project. Cloudflare documents that a manually added record without that association can fail with a 522 response.
6. Wait for Cloudflare to issue the TLS certificate, then verify HTTPS, redirects, canonical URLs, `robots.txt`, `sitemap-index.xml` and the sitemap child files before declaring production ready.

Existing CAA records on `devshinx.dev`, if any, must permit Cloudflare's certificate issuance. Inspect them before changing DNS; do not remove or weaken CAA policy without a separate review.

Creating the Pages project or selecting **Save and Deploy** initiates a deployment. Stop before that action unless the founder has explicitly approved production deployment. The project name determines the `*.pages.dev` hostname; record the value Cloudflare actually assigns instead of assuming it will be `visaos.pages.dev`.

## Verified generated artifacts

The local Astro build currently emits:

- `dist/sitemap-index.xml`
- `dist/sitemap-0.xml`, referenced by the index
- `dist/robots.txt`
- four reviewed static HTML routes and a Pagefind index derived from those HTML files

The built-site validator discovers child sitemap filenames from the generated index rather than assuming `sitemap-0.xml` will remain the only child. It scans the complete production output for placeholder hosts and rejects wrong origins, missing child files, sitemap URLs without matching HTML, HTML routes missing from the sitemap and non-publishable content leaking into HTML, the sitemap or Pagefind.

## Post-deployment acceptance

Only after founder-approved deployment, complete the live checks in `docs/SPRINT_4A_RELEASE_REVIEW.md`. At minimum verify HTTPS and certificate validity, HTTP-to-HTTPS behavior, the four public routes, canonical and Open Graph URLs, `robots.txt`, every sitemap file discovered from the index, Pagefind assets, mobile reflow, keyboard operation and accessibility tooling results.

Do not claim the site is live, crawlable or submitted to search engines based on the local build. Record the exact deployment URL, Pages project hostname, deployment commit and test time after they can be observed.

## Google Search Console preparation

Search Console setup happens only after the custom domain serves the approved production build:

1. In Search Console, add a **Domain property** for `visaos.devshinx.dev` without `https://` or a path. If the founder instead wants reporting for every `devshinx.dev` subdomain, that broader parent-domain property is a separate scope decision.
2. Choose DNS verification and copy the exact TXT record supplied by Google. Add it at the authoritative DNS provider. Verification tokens are account-specific operational data: do not commit them to this repository or paste them into a public issue.
3. Keep the verification record after ownership succeeds; removing it can remove verification.
4. Confirm the live property resolves to the intended HTTPS site, then submit `https://visaos.devshinx.dev/sitemap-index.xml` in the **Sitemaps** report.
5. Use URL Inspection on the home page and each public hub. Do not request indexing for draft, preview or non-public routes.
6. Keep Search Console exports and query data out of the public repository. Record only non-sensitive aggregate decisions in reviewed documentation.

Google documents that a Domain property uses DNS verification and that sitemap submission may help discovery; neither verification nor submission guarantees indexing.

## Official Cloudflare references

- [Deploy an Astro site to Cloudflare Pages](https://developers.cloudflare.com/pages/framework-guides/deploy-an-astro-site/)
- [Cloudflare Pages build configuration](https://developers.cloudflare.com/pages/configuration/build-configuration/)
- [Cloudflare Pages custom domains](https://developers.cloudflare.com/pages/configuration/custom-domains/)
- [Cloudflare Pages build image and Node version selection](https://developers.cloudflare.com/pages/configuration/build-image/)
- [Add a Search Console property](https://support.google.com/webmasters/answer/34592)
- [Verify Search Console ownership](https://support.google.com/webmasters/answer/9008080)
- [Get started with Search Console](https://developers.google.com/search/docs/monitor-debug/search-console-start)
