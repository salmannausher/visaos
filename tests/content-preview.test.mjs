import assert from 'node:assert/strict';
import test from 'node:test';
import {
  createPreviewRouteRecords,
  isLocalPreviewHostname,
  previewPathFor,
} from '../src/lib/content-preview.mjs';

function entry(id, title, editorialStatus = 'draft') {
  return { id, data: { path: id, title, editorialStatus, noindex: true } };
}

const entries = [
  entry('us/visitor-visa', 'Visitor visa', 'approved'),
  entry('us/ds-160', 'DS-160 overview', 'approved'),
  entry('us/ds-160/save-and-return', 'Save a DS-160', 'approved'),
  entry('us/visa-wait-times', 'Visa wait times', 'approved'),
  entry('us/from/pakistan/visitor-visa', 'Pakistan visitor visa', 'approved'),
  entry('us/ds-160/correct-after-submission', 'Correct a submitted DS-160'),
  entry('us/ds-160/confirmation-page', 'Lost DS-160 confirmation page'),
  entry('us/problems/214b', '214(b) refusal'),
  entry('us/problems/221g', '221(g) refusal'),
  entry('us/appointments/expedited-appointment', 'Expedited appointment'),
  entry('internal/article-model-example', 'Internal fixture'),
  entry('us/approved', 'Approved article', 'approved'),
];

test('production mode generates no preview routes', () => {
  assert.deepEqual(createPreviewRouteRecords(entries, { development: false }), []);
});

test('development mode generates the index and five Sprint 5 draft preview routes', () => {
  const routes = createPreviewRouteRecords(entries, { development: true });
  const paths = routes.slice(1).map((route) => route.params.path);

  assert.equal(routes[0].params.path, undefined);
  assert.equal(routes[0].props.kind, 'index');
  assert.deepEqual(paths.sort(), [
    'us/appointments/expedited-appointment',
    'us/ds-160/confirmation-page',
    'us/ds-160/correct-after-submission',
    'us/problems/214b',
    'us/problems/221g',
  ]);
  assert(!paths.some((path) => path.startsWith('internal/')));
});

test('preview URLs are stable and access is restricted to loopback hostnames', () => {
  assert.equal(previewPathFor('us/ds-160'), '/dev-preview/us/ds-160/');
  assert.equal(isLocalPreviewHostname('localhost'), true);
  assert.equal(isLocalPreviewHostname('127.0.0.1'), true);
  assert.equal(isLocalPreviewHostname('[::1]'), true);
  assert.equal(isLocalPreviewHostname('preview.example.test'), false);
});
