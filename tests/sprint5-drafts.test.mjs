import assert from 'node:assert/strict';
import { readFileSync } from 'node:fs';
import test from 'node:test';
import { parse } from 'yaml';

const sprint5Files = [
  'src/content/articles/ds-160-correct-after-submission.md',
  'src/content/articles/ds-160-lost-confirmation-page.md',
  'src/content/articles/visa-refusal-214b.md',
  'src/content/articles/visa-refusal-221g.md',
  'src/content/articles/expedited-visa-appointment.md',
];

function readArticle(file) {
  const contents = readFileSync(file, 'utf8');
  const match = contents.match(/^---\r?\n([\s\S]*?)\r?\n---\r?\n([\s\S]*)$/);
  assert(match, `${file} must contain YAML frontmatter and a Markdown body`);
  return { file, data: parse(match[1]), body: match[2] };
}

const sprint5Articles = sprint5Files.map(readArticle);
const expectedReviewDueDates = new Map([
  ['us/ds-160/correct-after-submission', '2026-12-17'],
  ['us/ds-160/confirmation-page', '2027-01-28'],
  ['us/problems/214b', '2027-01-31'],
  ['us/problems/221g', '2026-12-17'],
  ['us/appointments/expedited-appointment', '2026-12-02'],
]);

test('all five founder-approved Sprint 5 articles are publishable with accurate review metadata', () => {
  assert.equal(sprint5Articles.length, 5);

  for (const { data, file } of sprint5Articles) {
    const expectedSourceCheck = data.path.endsWith('confirmation-page')
      ? '2026-10-30'
      : '2026-11-02';
    const expectedReviewDate = data.path.endsWith('confirmation-page')
      ? '2026-10-30'
      : '2026-11-01';

    assert.equal(data.editorialStatus, 'approved', `${file} must be approved`);
    assert.equal(data.noindex, false, `${file} must be indexable`);
    assert.equal(data.reviewedBy, 'Salman Nausher');
    assert.equal(data.reviewedAt, expectedReviewDate);
    assert.equal(data.approvedAt, expectedReviewDate);

    assert.equal(data.reviewDueAt, expectedReviewDueDates.get(data.path));
    assert.equal(data.sourceCheckedAt, expectedSourceCheck);
    assert(Array.isArray(data.sources) && data.sources.length > 0, `${file} needs sources`);
  }
});

test('the unrelated model fixture remains non-publishable', () => {
  const model = readArticle('src/content/articles/_model-example.md');

  assert.equal(model.data.editorialStatus, 'draft');
  assert.equal(model.data.noindex, true);
  assert.equal(model.data.reviewedBy, undefined);
  assert.equal(model.data.approvedAt, undefined);
});

test('Sprint 5 articles include answer structure, scenarios, comparison tables and official citations', () => {
  for (const { body, file } of sprint5Articles) {
    assert.match(body, /^\*\*[^\n]+\*\*/m, `${file} needs an answer-first opening`);
    assert.match(body, /^## /m, `${file} needs accessible section headings`);
    assert.match(body, /^\| .+ \|$/m, `${file} needs a factual comparison table`);
    assert.match(body, /## Practical scenarios/m, `${file} needs practical scenarios`);
    assert.match(
      body,
      /https:\/\/(?:travel\.state\.gov|ceac\.state\.gov)\//,
      `${file} needs a direct official citation`,
    );
  }
});

test('DS-160 route ownership separates unfinished, submitted-correction and confirmation intents', () => {
  const existing = readArticle('src/content/articles/ds-160-save-and-return.md');
  const correction = sprint5Articles.find(({ data }) => data.path.endsWith('correct-after-submission'));
  const confirmation = sprint5Articles.find(({ data }) => data.path.endsWith('confirmation-page'));

  assert(correction);
  assert(confirmation);
  assert.equal(existing.data.path, 'us/ds-160/save-and-return');
  assert.equal(new Set([existing.data.intent, correction.data.intent, confirmation.data.intent]).size, 3);
  assert.match(correction.data.intent, /submitted DS-160/i);
  assert.match(confirmation.data.intent, /submitted DS-160/i);
  assert.match(existing.data.intent, /unfinished/i);
  assert.match(correction.body, /saving and returning to a DS-160/i);
  assert.match(confirmation.body, /Saving a DS-160 and returning later/i);
});

test('founder-approved articles preserve documented evidence boundaries', () => {
  const correction = sprint5Articles.find(({ data }) => data.path.endsWith('correct-after-submission'));
  const confirmation = sprint5Articles.find(({ data }) => data.path.endsWith('confirmation-page'));
  const expedite = sprint5Articles.find(({ data }) => data.path.endsWith('expedited-appointment'));

  assert(correction);
  assert(confirmation);
  assert(expedite);

  assert.match(correction.body, /officer-directed reopening scenario/i);
  assert.match(correction.body, /process published by one post is not evidence of a worldwide rule/i);
  assert.match(confirmation.body, /does not provide a universal self-service recovery procedure/i);
  assert.match(confirmation.body, /does not claim that the post can always recover the ID/i);
  assert.match(confirmation.body, /Option C — Retrieve Application/);
  assert.match(confirmation.body, /RETRIEVE AN APPLICATION/);
  assert.match(confirmation.body, /button names and page layout may change/i);
  assert.match(expedite.body, /Emergency expedite request/);
  assert.match(expedite.body, /Earlier regular slot/);
  assert.match(expedite.body, /Temporary paid-expedite pilot/);
  assert.match(expedite.body, /December 31, 2026/);
  assert.match(expedite.body, /verified on November 2, 2026/i);
  assert.match(expedite.body, /Do not send a passport image, DS-160 confirmation/);

  for (const post of [
    'Mission Canada',
    'U.S. Embassy Bogota',
    'U.S. Embassy Guatemala City',
    'U.S. Embassy San Jose',
    'U.S. Embassy Tegucigalpa',
    'Mission Mexico',
  ]) {
    assert.match(expedite.body, new RegExp(post));
  }
});

test('214(b) and 221(g) record the narrow founder-authorized exception without claiming legal review', () => {
  const review = readFileSync('docs/SPRINT_5_EDITORIAL_REVIEW.md', 'utf8');
  const decision = readFileSync('docs/SPRINT_5_PUBLICATION_POLICY_DECISION.md', 'utf8');
  const refusal214b = sprint5Articles.find(({ data }) => data.path.endsWith('214b'));
  const refusal221g = sprint5Articles.find(({ data }) => data.path.endsWith('221g'));

  assert(refusal214b);
  assert(refusal221g);
  assert.equal(refusal214b.data.editorialStatus, 'approved');
  assert.equal(refusal221g.data.editorialStatus, 'approved');
  assert.match(review, /214\(b\) refusal — independent review hold/);
  assert.match(review, /221\(g\) refusal — independent review hold/);
  assert.match(review, /AI-assisted evidence review/i);
  assert.match(decision, /release-specific policy exception is authorized/i);
  assert.match(decision, /no attorney or independent qualified immigration-law reviewer approved/i);
  assert.doesNotMatch(decision, /attorney-approved/i);
});
