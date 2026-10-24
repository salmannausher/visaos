export const PUBLICATION_STATUSES = ['draft', 'pending-review', 'approved', 'rejected'];

export function canonicalPathFor(path) {
  return `/${String(path).replace(/^\/+|\/+$/g, '')}/`;
}

export function isPublishable(data) {
  return data.editorialStatus === 'approved' && data.noindex === false;
}

export function createArticleRouteRecords(entries) {
  return entries
    .filter((entry) => isPublishable(entry.data))
    .sort((left, right) => left.data.path.localeCompare(right.data.path))
    .map((entry) => ({
      params: { path: entry.data.path },
      props: { entry },
    }));
}
