import { defineConfig } from 'astro/config';
import sitemap from '@astrojs/sitemap';
import { SITE_ORIGIN } from './src/config/site.mjs';

export default defineConfig({
  site: SITE_ORIGIN,
  integrations: [sitemap()],
});
