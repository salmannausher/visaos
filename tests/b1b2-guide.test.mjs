import assert from 'node:assert/strict';
import { existsSync, readFileSync } from 'node:fs';
import test from 'node:test';
import { parse } from 'yaml';

function readMarkdown(file) {
  const contents = readFileSync(file, 'utf8');
  const match = contents.match(/^---\r?\n([\s\S]*?)\r?\n---\r?\n([\s\S]*)$/);
  assert(match, `${file} must contain YAML frontmatter and a Markdown body`);
  return { data: parse(match[1]), body: match[2] };
}

const live = readMarkdown('src/content/articles/visitor-visa-basics.md');
const candidate = readMarkdown('editorial/b1b2-guide/visitor-visa-guide.md');

test('comprehensive candidate preserves the live canonical without changing production', () => {
  assert.equal(live.data.canonicalPath, '/us/visitor-visa/');
  assert.equal(live.data.editorialStatus, 'approved');
  assert.equal(live.data.noindex, false);

  assert.equal(candidate.data.canonicalPath, live.data.canonicalPath);
  assert.equal(candidate.data.path, live.data.path);
  assert.equal(candidate.data.editorialStatus, 'draft');
  assert.equal(candidate.data.noindex, true);
  assert.equal(candidate.data.reviewedAt, undefined);
  assert.equal(candidate.data.reviewedBy, undefined);
  assert.equal(candidate.data.approvedAt, undefined);
  assert.equal(candidate.data.updatedAt, undefined);
  assert.equal(candidate.data.reviewDueAt, undefined);
  assert(candidate.data.title.length >= 20 && candidate.data.title.length <= 70);
  assert(candidate.data.description.length >= 70 && candidate.data.description.length <= 170);
});

test('candidate contains the supplied videos with explicit nonofficial safeguards', () => {
  for (const id of ['8QQOvnW0xtQ', 'GIQG7IUZkP4', '74opiv9yyQo']) {
    assert.match(candidate.body, new RegExp(`https://www\\.youtube\\.com/watch\\?v=${id}`));
  }

  assert.match(candidate.body, /not U\.S\. government policy, legal advice, or approval guarantees/i);
  assert.match(candidate.body, /Direct HTTP checks returned 200 for all three YouTube URLs/i);
  assert.match(candidate.body, /not represented as independently verified video metadata/i);
});

test('candidate records volatile official-source coverage and relevant internal links', () => {
  for (const source of [
    'dos-visitor-visa',
    'dos-b1-allowable-uses',
    'dos-ds160-faq',
    'dos-visa-fees',
    'dos-visa-validity',
    'dos-visa-denials',
    'dos-niv-interview-location',
    'dos-visa-bonds',
    'cbp-i94',
  ]) {
    assert(candidate.data.sources.includes(source), `candidate must reference ${source}`);
    assert(existsSync(`src/content/sources/${source}.json`), `${source} must exist in the registry`);
  }

  assert(candidate.data.breadcrumbs.some(({ href }) => href === '/us/'));

  for (const route of [
    '/us/ds-160/',
    '/us/ds-160/save-and-return/',
    '/us/ds-160/correct-after-submission/',
    '/us/ds-160/confirmation-page/',
    '/us/visa-wait-times/',
    '/us/appointments/expedited-appointment/',
    '/us/problems/214b/',
    '/us/problems/221g/',
  ]) {
    assert(candidate.body.includes(`](${route})`), `candidate must link to ${route}`);
  }
});
