import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';

export default defineConfig({
  plugins: [react()],
  // ponytail: keep CRA's output dir so .gitignore and any deploy config still match
  build: { outDir: 'build' },
});
