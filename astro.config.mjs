import { defineConfig } from 'astro/config';
import tailwind from '@astrojs/tailwind';
import sitemap from '@astrojs/sitemap';
import { SITE } from './src/config/site';

export default defineConfig({
  site: SITE.domain,
  output: 'static',
  integrations: [tailwind({ applyBaseStyles: false }), sitemap()],
  build: {
    format: 'directory',
  },
});
