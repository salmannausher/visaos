import { readFileSync } from 'node:fs';
import { resolve } from 'node:path';

const handoffDirectory = resolve('visaos-sprint3-research-handoff');

function parseCsv(name) {
  const input = readFileSync(resolve(handoffDirectory, name), 'utf8');
  const records = [];
  let record = [];
  let field = '';
  let quoted = false;

  for (let index = 0; index < input.length; index += 1) {
    const character = input[index];

    if (quoted) {
      if (character === '"' && input[index + 1] === '"') {
        field += '"';
        index += 1;
      } else if (character === '"') {
        quoted = false;
      } else {
        field += character;
      }
      continue;
    }

    if (character === '"') {
      quoted = true;
    } else if (character === ',') {
      record.push(field);
      field = '';
    } else if (character === '\n') {
      record.push(field.replace(/\r$/, ''));
      records.push(record);
      record = [];
      field = '';
    } else {
      field += character;
    }
  }

  if (quoted) throw new Error(`${name}: unterminated quoted field`);
  if (field || record.length > 0) {
    record.push(field.replace(/\r$/, ''));
    records.push(record);
  }

  const [headers, ...rows] = records;
  if (!headers) throw new Error(`${name}: missing header row`);

  return rows
    .filter((row) => row.some(Boolean))
    .map((row, rowIndex) => {
      if (row.length !== headers.length) {
        throw new Error(`${name}:${rowIndex + 2}: expected ${headers.length} fields, found ${row.length}`);
      }
      return Object.fromEntries(headers.map((header, columnIndex) => [header, row[columnIndex]]));
    });
}

function assert(condition, message) {
  if (!condition) throw new Error(message);
}

function assertEvery(rows, predicate, message) {
  const failure = rows.findIndex((row) => !predicate(row));
  assert(failure === -1, `${message} (row ${failure + 2})`);
}

const plan = parseCsv('first-20-page-plan.csv');
const keywords = parseCsv('keyword-seeds.csv');
const sources = parseCsv('source-registry.csv');
const competitorAudit = parseCsv('competitor-audit-template.csv');

assert(plan.length === 20, `first-20-page-plan.csv: expected 20 rows, found ${plan.length}`);
assert(
  new Set(plan.map(({ rank }) => rank)).size === 20 &&
    plan.every(({ rank }, index) => Number(rank) === index + 1),
  'first-20-page-plan.csv: ranks must remain unique and ordered 1 through 20',
);
assert(
  new Set(plan.map(({ proposed_url: route }) => route)).size === plan.length,
  'first-20-page-plan.csv: proposed routes must remain unique',
);
assertEvery(
  plan,
  (row) =>
    row.monthly_volume === 'UNKNOWN' &&
    row.keyword_difficulty === 'UNKNOWN' &&
    row.serp_audit === 'PENDING LOCALIZED SERP' &&
    row.editorial_status === 'DRAFT / NOT APPROVED',
  'first-20-page-plan.csv: UNKNOWN, PENDING or draft research gates changed without a new evidence record',
);

assert(keywords.length === 88, `keyword-seeds.csv: expected 88 rows, found ${keywords.length}`);
assertEvery(
  keywords,
  (row) =>
    row.monthly_volume === 'UNVERIFIED' &&
    row.keyword_difficulty === 'UNVERIFIED' &&
    row.serp_competitors === 'NOT AUDITED' &&
    row.status === 'hypothesis',
  'keyword-seeds.csv: an unverified research field was silently promoted',
);

assert(sources.length === 6, `source-registry.csv: expected 6 rows, found ${sources.length}`);
assert(
  new Set(sources.map(({ source_id: sourceId }) => sourceId)).size === sources.length,
  'source-registry.csv: source IDs must remain unique',
);
assertEvery(
  sources,
  ({ url }) => {
    try {
      return new URL(url).protocol === 'https:';
    } catch {
      return false;
    }
  },
  'source-registry.csv: candidate URLs must be valid HTTPS URLs',
);

assert(
  competitorAudit.length === 0,
  'competitor-audit-template.csv: the supplied template must remain empty; record completed audits in a dated evidence file',
);

console.log(
  `Research handoff validation passed for ${plan.length} planned pages, ${keywords.length} keyword hypotheses, ${sources.length} source candidates and an empty competitor-audit template.`,
);
