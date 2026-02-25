import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';

export default defineConfig({
  plugins: [react()],
  server: {
    port: 3000,
    proxy: {
      '/api': {
        // Local dev: localhost:5000. In Docker set VITE_PROXY_TARGET=http://server:5000
        target: process.env.VITE_PROXY_TARGET || 'http://localhost:5000',
        changeOrigin: true,
      },
    },
  },
});

