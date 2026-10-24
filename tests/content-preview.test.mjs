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
  entry('us/visitor-visa', 'Visitor visa'),
  entry('us/ds-160', 'DS-160 overview'),
  entry('us/ds-160/save-and-return', 'Save a DS-160'),
  entry('us/visa-wait-times', 'Visa wait times'),
  entry('us/from/pakistan/visitor-visa', 'Pakistan visitor visa'),
  entry('internal/article-model-example', 'Internal fixture'),
  entry('us/approved', 'Approved article', 'approved'),
];

test('production mode generates no preview routes', () => {
  assert.deepEqual(createPreviewRouteRecords(entries, { development: false }), []);
});

test('development mode generates the index and five draft preview routes', () => {
  const routes = createPreviewRouteRecords(entries, { development: true });
  const paths = routes.slice(1).map((route) => route.params.path);

  assert.equal(routes[0].params.path, undefined);
  assert.equal(routes[0].props.kind, 'index');
  assert.deepEqual(paths.sort(), [
    'us/ds-160',
    'us/ds-160/save-and-return',
    'us/from/pakistan/visitor-visa',
    'us/visa-wait-times',
    'us/visitor-visa',
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
