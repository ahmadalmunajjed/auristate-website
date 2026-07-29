// @ts-check
import { defineConfig, fontProviders } from 'astro/config';

import tailwindcss from '@tailwindcss/vite';

// https://astro.build/config
export default defineConfig({
  // Current Cloudflare Pages deployment. TODO: swap to the custom domain when
  // it is live — every absolute URL in Layout.astro (canonical, OG image) is
  // built from this, and stale values mean broken link previews and canonicals
  // pointing at the wrong host.
  site: 'https://auristate-website.pages.dev',
  vite: {
    plugins: [tailwindcss()]
  },
  fonts: [
    {
      provider: fontProviders.google(),
      name: 'Fraunces',
      cssVariable: '--font-display',
      weights: ['300 700'],
      styles: ['normal', 'italic'],
      fallbacks: ['Georgia', 'serif']
    },
    {
      provider: fontProviders.google(),
      name: 'Work Sans',
      cssVariable: '--font-body',
      weights: [400, 500, 600],
      fallbacks: ['system-ui', 'sans-serif']
    }
  ]
});