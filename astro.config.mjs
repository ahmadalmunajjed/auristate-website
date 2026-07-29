// @ts-check
import { defineConfig, fontProviders } from 'astro/config';

import tailwindcss from '@tailwindcss/vite';

// https://astro.build/config
export default defineConfig({
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