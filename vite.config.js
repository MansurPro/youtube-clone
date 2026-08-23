import { defineConfig, loadEnv } from 'vite';
import react from '@vitejs/plugin-react';

export default defineConfig(({ mode }) => {
  // Loaded without a prefix filter so RAPID_API_KEY is readable here. It stays
  // in the dev server process and is never exposed to the browser, matching how
  // the Netlify function behaves in production.
  const env = loadEnv(mode, process.cwd(), '');

  return {
    plugins: [react()],
    // ponytail: keep CRA's output dir so .gitignore and any deploy config still match
    build: { outDir: 'build' },
    server: {
      // Dev stand-in for netlify/functions/youtube.js, so `npm start` works
      // without installing the Netlify CLI.
      proxy: {
        '/api/youtube': {
          target: 'https://youtube-v31.p.rapidapi.com',
          changeOrigin: true,
          rewrite: (path) => path.replace(/^\/api\/youtube/, ''),
          headers: {
            'X-RapidAPI-Key': env.RAPID_API_KEY ?? '',
            'X-RapidAPI-Host': 'youtube-v31.p.rapidapi.com',
          },
        },
      },
    },
  };
});
