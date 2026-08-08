/**
 * Vite SSR build configuration.
 *
 * Used by: `vite build --config vite.config.ssr.ts`
 * Output:  dist/server/entry-server.js  (ESM, Node.js compatible)
 *
 * Does NOT require PORT or BASE_PATH environment variables.
 */

import path from 'path';
import react from '@vitejs/plugin-react';
import { defineConfig } from 'vite';

export default defineConfig({
  base: '/',
  plugins: [react()],
  resolve: {
    alias: {
      '@': path.resolve(import.meta.dirname, 'src'),
      '@assets': path.resolve(import.meta.dirname, '..', '..', 'attached_assets'),
    },
    dedupe: ['react', 'react-dom'],
  },
  root: path.resolve(import.meta.dirname),
  define: {
    // Provide BASE_URL used by SeoHead / App
    'import.meta.env.BASE_URL': JSON.stringify('/'),
  },
  build: {
    outDir: path.resolve(import.meta.dirname, 'dist/server'),
    ssr: 'src/entry-server.tsx',
    emptyOutDir: true,
    rollupOptions: {
      output: {
        format: 'esm',
      },
    },
  },
  ssr: {
    // Bundle these packages into the SSR output (they use ESM-only exports)
    noExternal: ['wouter', '@tanstack/react-query', 'framer-motion', 'lucide-react', 'react-icons'],
    // Treat CSS imports as empty in SSR (styles come from client build)
    external: [],
  },
});
