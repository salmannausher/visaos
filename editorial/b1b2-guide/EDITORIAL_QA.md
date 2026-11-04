# VisaOS B-1/B-2 Pillar Guide — Editorial QA Handoff

Date checked: 2026-11-04
Source route: `/us/visitor-visa/`
Working article: `visitor-visa-guide.md`

## Status

**Content-ready for founder editorial review and Codex validation, NOT yet approved or deployed.**

The provided Markdown is intentionally marked `editorialStatus: draft` and `noindex: true`, with no invented `reviewedAt`, `reviewedBy`, or `approvedAt`. This is a working replacement for an already approved and live page. Do not overwrite production until a separately reviewed publication PR is authorized; keep the live approved source untouched until final merge.

## Source checks

- State Department visitor classification, allowable uses, document requirements, invitations and process: checked.
- B-1 permitted business activities and exceptions: checked.
- July 15, 2026 NIV interview location guidance: checked.
- DS-160 retrieval/correction FAQ: checked.
- Fees: State Department lists $185 standard non-petition NIV processing fee; check all applicable additional charges on release day.
- Refusals 214(b) and 221(g), admission and I-94: checked.
- B-visa bond information: confirmed program exists, not hard-coded nationality lists or amounts.
- All three user-supplied YouTube URLs were retained and returned HTTP 200 on November 4, 2026, but automated editorial tooling could not inspect their page metadata. Titles come from the supplied editorial analysis and are not described as independently verified metadata.
- Speaker name corrected to **Travis Feuerbacher**. His former-consular-officer background is described by his firm's biography and a Washington University event page; bar status was not independently verified.

## Corrected source-derived issues

1. Former officer's three principles are a preparation framework, not a legal checklist or guarantee.
2. Submitted DS-160 is not universally and permanently impossible to correct; officer-directed process exists.
3. Nonimmigrant interview place is typically nationality or residence per July 2026 policy; do not shop merely for shorter queues.
4. Six-month admission is common but not guaranteed; I-94 controls.
5. B-1 conference attendance can be distinct from paid speaking/employment; foreign pay not a universal safe harbor.
6. B-2 recreational, noncredit study differs from formal study.
7. Property-tax payments do not grant student permission.
8. Birth-tourism purpose rule should not be generalized to pregnancy or every unexpected birth.
9. Avoided unsupported 25% refusal-rate claim and promises of dramatically increased approval.
10. Added the current nationality-specific bond link, the officer-direction safeguard and no volatile nationality list or amount table.

## Codex QA tasks before publication

1. Inspect `AGENTS.md`, content schema, publication validators and source registry IDs; reconcile frontmatter with current repository. Retain existing approved metadata in production until a new genuine approval, rather than resetting an existing live page to draft.
2. Check source objects referenced by the article and add approved registry entries as necessary for newly referenced official claims, including country-of-interview 2026 policy, B-visa bonds, DS-160 FAQ and CBP I-94.
3. Refresh official sources on publication date, including latest B-visa fees, visa bonds, interview rules and any updated visitor restrictions. Never invent checked dates.
4. Confirm the exact video links and speaker attribution. If a video URL cannot be validated, label it as user-supplied rather than independently verified.
5. Validate `/us/visitor-visa/` route ownership and prevent duplicated content/URLs. Preserve meaningful existing guide material, its internal links and existing authoring conventions.
6. Run `npm ci`, `npm run check`, `npm test`, `npm run build`, `npm run validate`, `npm audit --audit-level=high`, and test article render, metadata, sitemap, Pagefind, internal links, external links and draft-route protection.
7. Require a genuine founder review of the exact new article and a separate production merge authorization, per repository policy. If any additional independent factual/editorial QA is mandatory, follow documented policy; do not invent reviews or alter it implicitly.
8. Create a reviewable PR only. Do not merge/deploy until release authorization.
