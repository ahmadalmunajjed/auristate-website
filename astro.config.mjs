// @ts-check
import { defineConfig, fontProviders } from 'astro/config';

import tailwindcss from '@tailwindcss/vite';

// https://astro.build/config
export default defineConfig({
  vite: {
    plugins: [tailwindcss()]
  },
  fonts: [
    // Concept A — Minimal Luxury
    {
      provider: fontProviders.google(),
      name: 'Cormorant Garamond',
      cssVariable: '--font-display-a',
      weights: [400, 500, 600],
      styles: ['normal', 'italic'],
      fallbacks: ['Georgia', 'serif']
    },
    {
      provider: fontProviders.google(),
      name: 'Inter',
      cssVariable: '--font-body-a',
      weights: [400, 500, 600],
      fallbacks: ['system-ui', 'sans-serif']
    },
    // Concept B — Bold Editorial Dark
    {
      provider: fontProviders.google(),
      name: 'Bodoni Moda',
      cssVariable: '--font-display-b',
      weights: [500, 700],
      styles: ['normal', 'italic'],
      fallbacks: ['Georgia', 'serif']
    },
    {
      provider: fontProviders.google(),
      name: 'Manrope',
      cssVariable: '--font-body-b',
      weights: [400, 500, 600],
      fallbacks: ['system-ui', 'sans-serif']
    },
    // Concept C — Warm Heritage Contemporary
    {
      provider: fontProviders.google(),
      name: 'Fraunces',
      cssVariable: '--font-display-c',
      weights: ['300 700'],
      styles: ['normal', 'italic'],
      fallbacks: ['Georgia', 'serif']
    },
    {
      provider: fontProviders.google(),
      name: 'Work Sans',
      cssVariable: '--font-body-c',
      weights: [400, 500, 600],
      fallbacks: ['system-ui', 'sans-serif']
    }
  ]
});