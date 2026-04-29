import { defineConfig } from 'astro/config';
import tailwind from '@astrojs/tailwind';

export default defineConfig({
  base: '/content-risk-calendar/',
  integrations: [tailwind()],
  server: {
    headers: {
      'content-type': 'text/html; charset=utf-8',
    },
  },
  vite: {
    server: {
      headers: {
        'content-type': 'text/html; charset=utf-8',
      },
    },
  },
});
