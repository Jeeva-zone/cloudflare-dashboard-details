import tailwindcss from '@tailwindcss/vite';
import react from '@vitejs/plugin-react';
import { defineConfig } from 'vite';

export default defineConfig({
  // GitHub Pages serves project sites from /<repository>/, while
  // Cloudflare Pages serves this app from the domain root.
  base: process.env.GITHUB_ACTIONS ? '/cloudflare-dashboard-details/' : '/',
  plugins: [react(), tailwindcss()],
  server: {
    hmr: process.env.DISABLE_HMR !== 'true',
    watch: process.env.DISABLE_HMR === 'true' ? null : {},
  },
});
