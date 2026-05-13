// @ts-check
import { defineConfig } from 'astro/config';
import tailwindcss from '@tailwindcss/vite';
import vercel from '@astrojs/vercel';

export default defineConfig({
  // output: 'static' ist Default — per-page SSR via `export const prerender = false`
  adapter: vercel(),
  vite: {
    plugins: [tailwindcss()],
  },
});
