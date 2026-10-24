export const PREVIEW_ROOT_PATH = '/dev-preview/';
export const LOCAL_PREVIEW_HOSTS = new Set(['localhost', '127.0.0.1', '[::1]', '::1']);

export function isPreviewableDraft(data) {
  return data.editorialStatus === 'draft' && !String(data.path).startsWith('internal/');
}

export function previewPathFor(path) {
  return `${PREVIEW_ROOT_PATH}${String(path).replace(/^\/+|\/+$/g, '')}/`;
}

export function isLocalPreviewHostname(hostname) {
  return LOCAL_PREVIEW_HOSTS.has(String(hostname).toLowerCase());
}

export function createPreviewRouteRecords(entries, { development = false } = {}) {
  if (!development) return [];

  const drafts = entries
    .filter((entry) => isPreviewableDraft(entry.data))
    .sort((left, right) => left.data.title.localeCompare(right.data.title));

  return [
    {
      params: { path: undefined },
      props: { kind: 'index', entries: drafts },
    },
    ...drafts.map((entry) => ({
      params: { path: entry.data.path },
      props: { kind: 'article', entry },
    })),
  ];
}
