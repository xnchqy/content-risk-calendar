import { defineConfig } from 'astro/config';
import tailwind from '@astrojs/tailwind';

export default defineConfig({
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
