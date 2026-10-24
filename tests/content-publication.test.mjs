import assert from 'node:assert/strict';
import test from 'node:test';
import {
  canonicalPathFor,
  createArticleRouteRecords,
  isPublishable,
} from '../src/lib/content-publication.mjs';
import { validateContentInventory } from '../scripts/content-validation.mjs';

function entry(id, editorialStatus, noindex) {
  return { id, data: { path: `us/${id}`, editorialStatus, noindex } };
}

test('publication gate exposes only approved, indexable entries', () => {
  assert.equal(isPublishable(entry('approved', 'approved', false).data), true);
  assert.equal(isPublishable(entry('draft', 'draft', true).data), false);
  assert.equal(isPublishable(entry('pending', 'pending-review', true).data), false);
  assert.equal(isPublishable(entry('rejected', 'rejected', true).data), false);
  assert.equal(isPublishable(entry('hidden', 'approved', true).data), false);
});

test('route records are deterministic and preserve entry props', () => {
  const approved = entry('visitor-visa', 'approved', false);
  const routes = createArticleRouteRecords([
    entry('z-draft', 'draft', true),
    approved,
    entry('a-rejected', 'rejected', true),
  ]);

  assert.deepEqual(routes, [{ params: { path: 'us/visitor-visa' }, props: { entry: approved } }]);
  assert.equal(canonicalPathFor('us/visitor-visa'), '/us/visitor-visa/');
});

test('content inventory catches duplicate routes and invalid source references', () => {
  const result = validateContentInventory({
    today: new Date('2026-10-23T00:00:00Z'),
    staticRoutes: ['/us/'],
    sources: [],
    articles: [
      {
        file: 'duplicate.md',
        body: '[Broken route](/missing/)',
        data: {
          path: 'us',
          canonicalPath: '/us/',
          editorialStatus: 'draft',
          noindex: true,
          sources: ['missing-source'],
        },
      },
    ],
  });

  assert(result.errors.some((error) => error.includes('duplicates static page')));
  assert(result.errors.some((error) => error.includes('does not exist')));
  assert(result.errors.some((error) => error.includes('broken internal content link')));
});

test('publishable content fails when its official source or review is stale', () => {
  const result = validateContentInventory({
    today: new Date('2026-10-23T00:00:00Z'),
    staticRoutes: [],
    sources: [
      {
        id: 'official',
        file: 'official.json',
        data: {
          lastChecked: '2026-01-01',
          volatility: 'high',
          verificationStatus: 'verified',
        },
      },
    ],
    articles: [
      {
        file: 'published.md',
        data: {
          path: 'us/published',
          canonicalPath: '/us/published/',
          editorialStatus: 'approved',
          noindex: false,
          reviewDueAt: '2026-10-01',
          sources: ['official'],
        },
      },
    ],
  });

  assert(result.errors.some((error) => error.includes('stale source official')));
  assert(result.errors.some((error) => error.includes('content review was due')));
});

test('metadata validation enforces SEO, country, category and review fields', () => {
  const result = validateContentInventory({
    today: new Date('2026-10-23T00:00:00Z'),
    staticRoutes: [],
    sources: [],
    articles: [
      {
        file: 'invalid-country.md',
        data: {
          path: 'us/from/example/visitor-visa',
          canonicalPath: '/us/from/example/visitor-visa/',
          title: 'Too short',
          description: 'Too short',
          contentType: 'country',
          editorialStatus: 'approved',
          noindex: true,
          applicability: { visaClassifications: [], countries: [] },
          sources: [],
        },
      },
    ],
  });

  assert(result.errors.some((error) => error.includes('title must contain')));
  assert(result.errors.some((error) => error.includes('description must contain')));
  assert(result.errors.some((error) => error.includes('sourceCheckedAt')));
  assert(result.errors.some((error) => error.includes('visa classification')));
  assert(result.errors.some((error) => error.includes('official source reference')));
  assert(result.errors.some((error) => error.includes('applicable country codes')));
  assert(result.errors.some((error) => error.includes('editorial review metadata')));
});
