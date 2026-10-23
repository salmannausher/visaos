import { defineCollection, reference } from 'astro:content';
import { glob } from 'astro/loaders';
import { z } from 'astro/zod';

const isoDate = z.iso.date();
const httpsUrl = z.url().refine((value) => new URL(value).protocol === 'https:', {
  error: 'Source URLs must use HTTPS.',
});

const scope = z.object({
  visaClassifications: z.array(z.string().min(1)).default([]),
  nationalities: z.array(z.string().min(1)).default([]),
  residences: z.array(z.string().min(1)).default([]),
  posts: z.array(z.string().min(1)).default([]),
  notes: z.string().min(1).optional(),
});

const sources = defineCollection({
  loader: glob({ pattern: '**/*.json', base: './src/content/sources' }),
  schema: z
    .object({
      title: z.string().min(1),
      url: httpsUrl,
      publisher: z.string().min(1),
      sourceType: z.enum(['us-government', 'official-provider']),
      designationSource: httpsUrl.optional(),
      lastChecked: isoDate,
      effectiveDate: isoDate.optional(),
      volatility: z.enum(['low', 'medium', 'high']),
      verificationStatus: z.enum(['verified', 'needs-review']),
      topics: z.array(z.string().min(1)).min(1),
      appliesTo: scope,
      notes: z.string().min(1).optional(),
    })
    .superRefine((source, context) => {
      const hostname = new URL(source.url).hostname;

      if (source.sourceType === 'us-government' && !hostname.endsWith('.gov')) {
        context.addIssue({
          code: 'custom',
          path: ['url'],
          message: 'U.S. government sources must use a .gov hostname.',
        });
      }

      if (source.sourceType === 'official-provider' && !source.designationSource) {
        context.addIssue({
          code: 'custom',
          path: ['designationSource'],
          message: 'Official providers require a government designation source.',
        });
      }
    }),
});

const articles = defineCollection({
  loader: glob({ pattern: '**/*.md', base: './src/content/articles' }),
  schema: z
    .object({
      path: z
        .string()
        .regex(/^[a-z0-9]+(?:\/[a-z0-9-]+)*$/, 'Use a lowercase, extension-free route path.'),
      title: z.string().min(20).max(70),
      description: z.string().min(70).max(170),
      eyebrow: z.string().min(1).optional(),
      summary: z.string().min(1),
      intent: z.string().min(1),
      contentType: z.enum(['pillar', 'country', 'question', 'problem', 'policy']),
      editorialStatus: z.enum(['draft', 'in-review', 'approved']).default('draft'),
      noindex: z.boolean().default(true),
      reviewedAt: isoDate.optional(),
      approvedAt: isoDate.optional(),
      updatedAt: isoDate.optional(),
      applicability: scope,
      sources: z.array(reference('sources')).default([]),
      breadcrumbs: z
        .array(
          z.object({
            label: z.string().min(1),
            href: z.string().regex(/^\/(?:[a-z0-9-]+\/)*$/, 'Breadcrumb paths must be internal directory URLs.'),
          }),
        )
        .min(1),
    })
    .superRefine((article, context) => {
      if (article.editorialStatus !== 'approved') return;

      if (article.noindex) {
        context.addIssue({
          code: 'custom',
          path: ['noindex'],
          message: 'Approved articles must be indexable.',
        });
      }

      if (!article.reviewedAt || !article.approvedAt) {
        context.addIssue({
          code: 'custom',
          path: ['editorialStatus'],
          message: 'Approved articles require reviewedAt and approvedAt dates.',
        });
      }

      if (article.sources.length === 0 && article.contentType !== 'policy') {
        context.addIssue({
          code: 'custom',
          path: ['sources'],
          message: 'Approved visa articles require at least one official source.',
        });
      }
    }),
});

export const collections = { articles, sources };
