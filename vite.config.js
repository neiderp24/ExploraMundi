import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';
import cesium from 'vite-plugin-cesium';

export default defineConfig({
  plugins: [react(), cesium()],
  optimizeDeps: {
    include: ['cesium']
  },
  server: {
    fs: {
      strict: false
    }
  },
  define: {
    CESIUM_BASE_URL: JSON.stringify('/cesium'), // <-- IMPORTANTE
  }
});
