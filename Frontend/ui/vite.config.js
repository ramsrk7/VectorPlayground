import path from 'path';
import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';

// https://vitejs.dev/config/
export default defineConfig({
  define: {
    'process.env': process.env,
  },
  plugins: [react()],
  resolve: {
    alias: {
      '@tailwindConfig': path.resolve(__dirname, 'tailwind.config.js'),
    },
  },
  optimizeDeps: {
    include: [
      '@tailwindConfig',
    ],
  },
  build: {
    commonjsOptions: {
      transformMixedEsModules: true,
    },
  },
  server: {
    proxy: {
      '/api': {
        target: 'http://127.0.0.1:8000', // Backend URL
        changeOrigin: true, // Changes the origin of the request to the target URL
        rewrite: (path) => path.replace(/^\/api/, ''), // Removes '/api' prefix
      },
    },
  },
});
