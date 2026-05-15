// vite.config.js
import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';
import path from 'node:path';

export default defineConfig({
  plugins: [react()],
  resolve: {
    alias: {
      '@': path.resolve(__dirname, './src'),
    },
    // ✅ 추가: vite가 자동으로 시도할 확장자
    extensions: ['.mjs', '.js', '.mts', '.ts', '.jsx', '.tsx', '.json'],
  },
  css: {
    preprocessorOptions: {
      scss: {
        additionalData: `
          @use "@/shared/styles/variables" as *;
          @use "@/shared/styles/mixins" as *;
        `,
      },
    },
  },
});