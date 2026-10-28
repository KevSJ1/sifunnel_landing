// @ts-check
import { defineConfig } from 'astro/config';
import sitemap from '@astrojs/sitemap';
import { SITE_URL } from './src/data/site-url.mjs';

export default defineConfig({
  site: SITE_URL,
  trailingSlash: 'ignore',
  compressHTML: true,
  build: {
    // CSS en línea: sin peticiones bloqueantes, mejor FCP/LCP en móvil.
    inlineStylesheets: 'always',
    format: 'directory',
  },
  prefetch: { prefetchAll: false, defaultStrategy: 'hover' },
  integrations: [
    sitemap({
      changefreq: 'weekly',
      priority: 0.7,
      lastmod: new Date(),
      filter: (page) => !page.includes('/404'),
      serialize(item) {
        if (item.url === `${SITE_URL}/`) {
          item.priority = 1.0;
          item.changefreq = 'weekly';
        }
        if (item.url.includes('/privacidad')) {
          item.priority = 0.3;
          item.changefreq = 'yearly';
        }
        return item;
      },
      i18n: { defaultLocale: 'es', locales: { es: 'es-CO' } },
    }),
  ],
});
