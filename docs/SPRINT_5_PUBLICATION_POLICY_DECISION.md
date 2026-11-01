# Sprint 5 Publication Policy Decision

Status: **FOUNDER APPROVAL RECORDED; INDEPENDENT-REVIEW POLICY DECISION PENDING**

Recorded: 2026-11-01

## Founder editorial approval

Salman Nausher confirmed on 2026-11-01 that he reviewed the final versions of these four articles and wants them published together:

- `/us/ds-160/correct-after-submission/`
- `/us/problems/214b/`
- `/us/problems/221g/`
- `/us/appointments/expedited-appointment/`

This is valid founder editorial approval. It is not an attorney review and must never be described as one.

## Existing policy conflict

`docs/EDITORIAL.md` places independent factual and editorial QA before founder approval. The page-specific Sprint 5 review record adds a qualified independent U.S. immigration-law/editorial review hold for the 214(b) and 221(g) articles. No named independent human reviewer, qualification, review date or decision has been supplied for those two pages.

The AI-assisted source review completed on 2026-11-01 found no obvious publication-blocking contradiction, but it does not satisfy or replace the recorded independent-human-review hold.

## Proposed release-specific policy decision

The founder may explicitly authorize the following narrow exception:

> For the current source-backed, general educational versions of the VisaOS 214(b) and 221(g) articles, I accept the documented AI-assisted evidence review and my own editorial review as the release path for this publication. I understand that no attorney or independent qualified immigration-law reviewer approved these pages. This decision does not remove independent factual/editorial QA from the general VisaOS workflow, does not establish legal expertise, and does not authorize personalized immigration advice.

If Salman Nausher explicitly accepts that statement, the publication PR may:

1. record `reviewedBy: Salman Nausher`, `reviewedAt: 2026-11-01` and `approvedAt: 2026-11-01` for all four articles;
2. set a review-due date appropriate to each article's source volatility;
3. set `editorialStatus: approved` and `noindex: false`;
4. retain the educational, no-guarantee and qualified-professional referral boundaries; and
5. state accurately that 214(b) and 221(g) were founder-approved under this release-specific exception and were **not** attorney-reviewed.

Until that exact policy decision is authorized—or genuine independent review evidence is recorded—the 214(b) and 221(g) entries must remain `draft` and `noindex`. Because the founder requested one coordinated four-article release, all four remain unpublished pending resolution of this gate.

## Technical readiness already established

PR #15 was squash-merged into `main` at `ec4fb433508a2aa05eddb84944328073e0626ace` with all four articles still draft and non-indexable. Its Cloudflare preview passed. Local checks on the authorized editorial head passed, while GitHub Actions remained unable to start jobs because of the documented account billing restriction.

No publication PR, production deployment or live-route claim is authorized by this document alone.
