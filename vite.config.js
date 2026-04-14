import { defineConfig } from 'vite';
import { resolve } from 'path';

export default defineConfig({
  build: {
    rollupOptions: {
      input: {
        main: resolve(__dirname, 'index.html'),
        login: resolve(__dirname, 'pages/login.html'),
        map: resolve(__dirname, 'pages/map.html'),
        profile: resolve(__dirname, 'pages/profile.html'),
        results: resolve(__dirname, 'pages/results.html'),
        venue: resolve(__dirname, 'pages/venue.html'),
        createvenue: resolve(__dirname, 'pages/createvenue.html'),
      },
    },
  },
});