# Sprint 3 SEO and Editorial Research

This document incorporates the supplied `visaos-sprint3-research-handoff/` pack into the repository context without upgrading hypotheses into evidence. The original CSV and README files remain unchanged so their research state is auditable.

`npm run validate:research` protects the supplied row counts and unresolved research markers from silent promotion. Completed research should be recorded in a new dated evidence file and reviewed alongside an intentional validator update; do not rewrite the handoff as if the evidence existed when it was supplied.

## Evidence boundary

- The pack contains 20 proposed pages, 88 keyword seeds, six source candidates and an empty competitor-audit template.
- Keyword seeds are hypotheses, not measurements. Every supplied `monthly_volume` and `keyword_difficulty` value remains `UNKNOWN` or `UNVERIFIED` exactly as received.
- Every supplied SERP field remains `PENDING LOCALIZED SERP` or `NOT AUDITED`. The competitor-audit template remains empty.
- No ranking, traffic or difficulty claim is established by this pack.
- Candidate source URLs are not automatically production source records. They must pass the repository's official-source, applicability and freshness checks before supporting publishable content.
- The pack contains no Search Console export, applicant data, credential or private analytics. Do not add those materials to this public repository.

## First-20-page route reconciliation

The `proposed_url` column in the supplied CSV is preserved as research history. The table below is the engineering reconciliation against current Astro pages and article drafts. A “planned” row does not create a route or authorize writing or publication.

| Rank | Supplied proposed URL | Reconciled target | Repository relationship and action |
| ---: | --- | --- | --- |
| 1 | `/us/visitor-visa/` | `/us/visitor-visa/` | Existing substantive draft. Retain its route and keep it non-public pending founder review. |
| 2 | `/us/visitor-visa/b1-vs-b2/` | same | Planned distinct comparison intent; no content file or public route exists. |
| 3 | `/us/visitor-visa/documents/` | same | Planned conditional-document intent; avoid turning it into a universal checklist. |
| 4 | `/us/ds-160/` | `/us/ds-160/` | Existing substantive draft. Retain its route and keep it non-public pending founder review. |
| 5 | `/us/ds-160/correct-after-submission/` | same | Planned stage-dependent correction intent; no content file or public route exists. |
| 6 | `/us/ds-160/retrieve-application/` | `/us/ds-160/save-and-return/` | Consolidate into the existing save-and-return draft; do not create a competing retrieval page unless a localized SERP audit proves a distinct intent. |
| 7 | `/us/ds-160/confirmation-page/` | same | Planned confirmation/barcode troubleshooting intent; keep separate from retrieval only if research confirms distinct user needs. |
| 8 | `/us/appointments/wait-times/` | `/us/visa-wait-times/` | Use the existing wait-times draft route. Do not create the supplied alternative route. |
| 9 | `/us/problems/fee-not-reflected/` | same | Planned provider-specific problem page under the existing `/us/problems/` navigation hub. |
| 10 | `/us/problems/delivery-address/` | same | Planned provider-specific problem page under the existing `/us/problems/` navigation hub. |
| 11 | `/us/from/pakistan/` | `/us/from/pakistan/visitor-visa/` | Keep `/us/from/pakistan/` as a navigation hub. Put substantive visitor-visa intent in the existing draft so the two pages do not compete. |
| 12 | `/us/from/pakistan/appointments/` | same | Planned local scheduling intent. The keyword pack also proposes singular `/appointment/`; use the plural target if this page is commissioned. |
| 13 | `/us/from/pakistan/delivery/` | same | Planned local delivery intent; requires verified mission/provider instructions. |
| 14 | `/us/from/india/` | same | Planned India country hub; no route or draft exists. |
| 15 | `/us/from/india/appointments/` | same | Planned India scheduling intent. Normalize keyword seeds from singular `/appointment/` to this target if commissioned. |
| 16 | `/us/from/bangladesh/` | same | Planned Bangladesh country hub; no route or draft exists. |
| 17 | `/us/from/philippines/` | same | Planned Philippines country hub; no route or draft exists. |
| 18 | `/us/visitor-visa/business-conference/` | same | Planned travel-purpose intent; higher scrutiny is required to avoid individualized eligibility advice. |
| 19 | `/us/problems/221g/` | same | Planned sensitive post-interview topic under the existing problems hub; expert review is recommended. |
| 20 | `/us/problems/214b/` | same | Planned sensitive refusal topic under the existing problems hub; expert review is recommended. |

This mapping gives each supplied page concept one target. Three supplied URLs are superseded by existing draft architecture: ranks 6, 8 and 11. The static `/us/`, `/us/from/pakistan/` and `/us/problems/` pages remain navigation hubs and are not substitutes for approved substantive guidance.

## Keyword-seed integration

The 88 rows remain a discovery backlog. Before commissioning a page, an editor must:

1. record market, language, location settings, timestamp and the first ten localized results;
2. distinguish a standalone intent from a question that belongs on an existing page;
3. map every material visa claim to a directly checked official source;
4. reject country variants that would only swap a country name without verified procedural differences; and
5. retain `UNKNOWN`, `UNVERIFIED`, `NOT AUDITED`, `PENDING` and `TBD` until evidence supports a reviewed replacement.

The 20 question-form rows marked `TBD: merge with an existing intent cluster` remain unassigned. They must not be converted into routes merely to increase page count.

## Source-candidate reconciliation

| Supplied candidate | Repository state |
| --- | --- |
| `STATE-VISITOR` | Same official URL as `dos-visitor-visa`; use the existing production record. |
| `STATE-DS160` | Same official URL as `dos-ds160-overview`; use the existing production record. |
| `STATE-DS160-FAQ` | Same official URL as `dos-ds160-faq`; use the existing production record. |
| `STATE-NIV-RESIDENCE` | Research candidate only. It is not referenced by an article and has not been promoted into the production registry. |
| `GOOGLE-AI-SEARCH` | SEO research reference, not an immigration claim source and not part of the article source registry. |
| `GOOGLE-ESSENTIALS` | SEO quality reference, not an immigration claim source and not part of the article source registry. |

Source-candidate presence is not verification. All sources must be opened and checked again at publication, with the applicable category, country, residence, post and effective date recorded where relevant.

## Research blockers

- Localized SERP observations are `PENDING` for all four target markets.
- Search volume and keyword difficulty are `UNKNOWN` or `UNVERIFIED` for every supplied keyword.
- Competitor coverage and differentiation have not been measured.
- The 88 supplied seeds do not meet the roadmap's aspirational 200–300-candidate target; quality and verification take priority over filling the gap.
- Pakistan local procedures remain blocked on human verification of the U.S. Mission Pakistan source and any provider it officially designates.
- No planned substantive page may become public until its claim/source map and founder approval are recorded.
