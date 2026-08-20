import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';

// User-site repo (Abiram116.github.io) serves from the domain root, so base is '/'.
// Output is a fully static bundle — no server, no runtime.
export default defineConfig({
  plugins: [react()],
  build: {
    outDir: 'dist',
    target: 'es2020',
    cssMinify: 'lightningcss',
    reportCompressedSize: false,
    rollupOptions: {
      output: {
        // Split the heavy, rarely-changing libraries out of the app chunk so a
        // copy edit does not force visitors to re-download Three.js.
        manualChunks(id) {
          if (!id.includes('node_modules')) return;
          if (id.includes('three') || id.includes('@react-three')) return 'three';
          if (id.includes('gsap')) return 'gsap';
          if (id.includes('motion')) return 'motion';
          if (id.includes('react')) return 'react';
        },
      },
    },
  },
});
