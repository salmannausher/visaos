# Founder Editorial Review — Five Sprint 2 Articles

## Publication decision update — 2026-10-26

The founder explicitly instructed VisaOS to publish the articles and deploy. All five substantive entries were rechecked against their official sources on 2026-10-26, reviewed by `OpenAI Codex — source verification review`, and approved for publication with `noindex: false`. The internal policy fixture remains a draft and is not routed.

| Article | Decision | Next review due |
| --- | --- | --- |
| Visitor visa basics | APPROVED | 2026-12-10 |
| DS-160 overview | APPROVED | 2027-01-24 |
| Save and return to a DS-160 | APPROVED | 2027-01-24 |
| Visa wait times | APPROVED | 2026-12-10 |
| Visitor visa from Pakistan | APPROVED after direct Mission-page verification and a scoped rewrite | 2026-12-10 |

The high-volatility pages must be rechecked by their recorded review dates. Approval does not authorize individualized advice, copied wait-time values, account access, appointment booking or outcome predictions.

## Original pre-approval brief — 2026-10-24

The material below is retained as the pre-approval record. Its `PENDING` decisions and draft-state descriptions were superseded by the publication decision above after the listed blockers were resolved.

## Review outcome

| Draft | Route | Source state | Editorial recommendation | Founder decision |
| --- | --- | --- | --- | --- |
| Visitor visa basics | `/us/visitor-visa/` | Two Department of State records marked verified on 2026-10-23 | Hold for wording and scope review | PENDING |
| DS-160 overview | `/us/ds-160/` | Two Department of State records marked verified on 2026-10-23 | Hold for factual/editorial review | PENDING |
| Save and return to a DS-160 | `/us/ds-160/save-and-return/` | Department of State FAQ marked verified on 2026-10-23 | Hold for current-system recheck | PENDING |
| Visa wait times | `/us/visa-wait-times/` | High-volatility Department of State record marked verified on 2026-10-23 | Hold; recheck immediately before approval | PENDING |
| Visitor visa from Pakistan | `/us/from/pakistan/visitor-visa/` | Global source verified; Pakistan mission source is `needs-review` | Hard hold until manual local-source verification | PENDING |

No draft is recommended for publication in this change set.

## 1. Visitor visa basics

File: `src/content/articles/visitor-visa-basics.md`

Claim/source review:

- The temporary-travel and B-1/B-2 classification summary is attributed to the Department of State visitor-visa page.
- The direction to match the classification to the genuine travel purpose is framed as general information, not an eligibility decision.
- The statement that employment, degree study and permanent residence require a different route needs a final line-level comparison with the current official “travel purposes not permitted” wording. Do not broaden the official categories by paraphrase.
- The post-specific instruction caveat is appropriate and prevents a universal workflow claim.
- The draft explicitly declines eligibility decisions, approval predictions and universal document lists.

Founder review questions:

- Is the B-1/B-2 scope narrow enough for the initial pillar page?
- Should the “different route” sentence be tightened after the final source comparison?
- Are the limitations prominent enough before any future approval?

## 2. DS-160 overview

File: `src/content/articles/ds-160-overview.md`

Claim/source review:

- The form purpose, electronic submission and use in consular processing are attributed to the Department of State overview.
- The barcode confirmation page and post-specific next-step statements are attributed to the overview and FAQ.
- The accuracy section correctly avoids choosing answers or correcting records for users.
- The privacy warning is operational safety guidance and does not request applicant data.

Founder review questions:

- Does the page clearly distinguish form submission from appointment and post-specific steps?
- Should any next-step language be narrowed further to avoid implying one universal sequence?
- Is the privacy warning sufficiently visible in the final layout?

## 3. Saving and returning to a DS-160

File: `src/content/articles/ds-160-save-and-return.md`

Claim/source review:

- Application ID, security information, online retrieval and local file-saving statements are attributed to the Department of State FAQ.
- The draft intentionally omits a fixed return-window number and directs readers to the current FAQ. This reduces stale numeric guidance but makes a same-day source recheck important.
- Shared-device and saved-file cautions are presented as privacy safeguards.
- The draft does not request application IDs, security answers or form files.

Founder review questions:

- Is the non-numeric treatment of the return window useful enough, or should an exact value be added only after a publication-day check?
- Does this page fully absorb the research pack's “retrieve application” intent? The engineering recommendation is yes unless localized SERP evidence shows otherwise.
- Should the title or summary explicitly use the word “retrieve” without creating a second route?

## 4. Reading visa appointment wait times

File: `src/content/articles/visa-wait-times-explained.md`

Claim/source review:

- The distinction between historical averages and next-available estimates is attributed to the Department of State wait-time page.
- The draft states that estimates are not guarantees and avoids copying volatile location values.
- It tells readers to verify post, category and update date rather than transferring a number between contexts.
- The source is marked high volatility and the draft review is due 2026-12-01.

Founder review questions:

- Reopen the official table immediately before any approval and record the new check date.
- Confirm that the broad visa-classification list in metadata matches the categories actually displayed by the official source at publication.
- Approve the existing `/us/visa-wait-times/` route as the sole target instead of the pack's overlapping `/us/appointments/wait-times/` proposal.

## 5. Visitor visa from Pakistan

File: `src/content/articles/pakistan-visitor-visa-starting-points.md`

Claim/source review:

- General B-1/B-2 statements use the Department of State visitor-visa source.
- The U.S. Mission Pakistan page returned an automated-access error during research and remains `needs-review`.
- The draft therefore omits local fee, appointment, courier, interview-waiver and document instructions.
- It appropriately separates nationality, residence and application post instead of treating them as interchangeable.
- The existing `/us/from/pakistan/` static page should remain a navigation hub; substantive visitor-visa intent belongs at this draft route.

Hard approval blockers:

- A human editor must open the U.S. Mission Pakistan page and record the current instructions and access date.
- Any scheduling or delivery provider must be followed from an official government designation, not selected from search results.
- Local claim/source mapping must identify whether each instruction depends on nationality, residence or post.

## Approval procedure

For any draft the founder chooses to advance, use a separate reviewed change to:

1. resolve every item above and recheck every official URL;
2. record a named independent reviewer, `reviewedAt`, `approvedAt` and `reviewDueAt`;
3. change `editorialStatus` only after explicit founder approval;
4. set `noindex: false` only when publication is intended; and
5. run the full validation pipeline and inspect the generated HTML, sitemap and Pagefind output.

Until those steps are complete, the current publication gate must continue to produce no HTML route for any of these drafts.
