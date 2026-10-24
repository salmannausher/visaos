import { canonicalPathFor, isPublishable, PUBLICATION_STATUSES } from '../src/lib/content-publication.mjs';

export const SOURCE_REVIEW_DAYS = {
  high: 45,
  medium: 180,
  low: 365,
};

function parseDate(value) {
  if (!value) return undefined;
  const parsed = new Date(`${value}T00:00:00Z`);
  return Number.isNaN(parsed.valueOf()) ? undefined : parsed;
}

function ageInDays(earlier, later) {
  return Math.floor((later.valueOf() - earlier.valueOf()) / 86_400_000);
}

function normalizeInternalRoute(href) {
  const path = href.split('#')[0].split('?')[0];
  if (!path.startsWith('/')) return undefined;
  return path === '/' ? '/' : canonicalPathFor(path);
}

export function validateContentInventory({ articles, sources, staticRoutes, today = new Date() }) {
  const errors = [];
  const warnings = [];
  const routes = new Map(staticRoutes.map((route) => [route, 'static page']));
  const sourceById = new Map(sources.map((source) => [source.id, source]));

  for (const source of sources) {
    const checked = parseDate(source.data.lastChecked);
    if (!checked) {
      errors.push(`${source.file}: lastChecked must be a valid ISO date`);
      continue;
    }

    const maximumAge = SOURCE_REVIEW_DAYS[source.data.volatility];
    if (maximumAge && ageInDays(checked, today) > maximumAge) {
      warnings.push(`${source.file}: ${source.data.volatility}-volatility source is due for re-verification`);
    }
  }

  for (const article of articles) {
    const route = canonicalPathFor(article.data.path);
    if (article.data.canonicalPath !== route) {
      errors.push(`${article.file}: canonicalPath must match route ${route}`);
    }

    if (routes.has(route)) {
      errors.push(`${article.file}: route ${route} duplicates ${routes.get(route)}`);
    } else {
      routes.set(route, article.file);
    }
  }

  for (const article of articles) {
    const { body = '', data, file } = article;

    if (!PUBLICATION_STATUSES.includes(data.editorialStatus)) {
      errors.push(`${file}: unknown editorialStatus ${String(data.editorialStatus)}`);
    }

    if (typeof data.title !== 'string' || data.title.length < 20 || data.title.length > 70) {
      errors.push(`${file}: title must contain 20 to 70 characters`);
    }

    if (
      typeof data.description !== 'string' ||
      data.description.length < 70 ||
      data.description.length > 170
    ) {
      errors.push(`${file}: description must contain 70 to 170 characters`);
    }

    if (data.editorialStatus !== 'approved' && data.noindex !== true) {
      errors.push(`${file}: non-approved content must set noindex: true`);
    }

    if (data.contentType !== 'policy') {
      if (!parseDate(data.sourceCheckedAt)) {
        errors.push(`${file}: visa content requires a valid sourceCheckedAt date`);
      }

      if (
        !Array.isArray(data.applicability?.visaClassifications) ||
        data.applicability.visaClassifications.length === 0
      ) {
        errors.push(`${file}: visa content requires at least one visa classification`);
      }
    }

    if (
      data.contentType === 'country' &&
      (!data.countryName ||
        !Array.isArray(data.applicability?.countries) ||
        data.applicability.countries.length === 0)
    ) {
      errors.push(`${file}: country content requires countryName and applicable country codes`);
    }

    if (
      data.editorialStatus === 'approved' &&
      (!data.reviewedAt || !data.reviewedBy || !data.approvedAt || !data.reviewDueAt)
    ) {
      errors.push(`${file}: approved content requires complete editorial review metadata`);
    }

    const internalLinks = [
      ...(Array.isArray(data.breadcrumbs) ? data.breadcrumbs.map((item) => item.href) : []),
      ...[...body.matchAll(/\]\((\/[^)\s]+)(?:\s+"[^"]*")?\)/g)].map((match) => match[1]),
    ];

    for (const href of internalLinks) {
      const target = normalizeInternalRoute(href);
      if (target && !routes.has(target)) {
        errors.push(`${file}: broken internal content link ${href}`);
      }
    }

    const sourceIds = Array.isArray(data.sources) ? data.sources : [];
    if (data.contentType !== 'policy' && sourceIds.length === 0) {
      errors.push(`${file}: visa content requires at least one official source reference`);
    }

    for (const sourceId of sourceIds) {
      const source = sourceById.get(sourceId);
      if (!source) {
        errors.push(`${file}: source reference ${sourceId} does not exist`);
        continue;
      }

      if (isPublishable(data)) {
        if (source.data.verificationStatus !== 'verified') {
          errors.push(`${file}: publishable content cannot use unverified source ${sourceId}`);
        }

        const checked = parseDate(source.data.lastChecked);
        const maximumAge = SOURCE_REVIEW_DAYS[source.data.volatility];
        if (checked && maximumAge && ageInDays(checked, today) > maximumAge) {
          errors.push(`${file}: publishable content uses stale source ${sourceId}`);
        }
      }
    }

    const reviewDue = parseDate(data.reviewDueAt);
    if (data.reviewDueAt && !reviewDue) {
      errors.push(`${file}: reviewDueAt must be a valid ISO date`);
    } else if (reviewDue && reviewDue < today) {
      const message = `${file}: content review was due ${data.reviewDueAt}`;
      if (isPublishable(data)) errors.push(message);
      else warnings.push(message);
    }
  }

  return { errors, warnings };
}
