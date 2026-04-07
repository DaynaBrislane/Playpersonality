import { defineConfig } from 'vite';
import { resolve } from 'path';

export default defineConfig({
  build: {
    rollupOptions: {
      input: {
        main: resolve(__dirname, 'index.html'),
        quiz: resolve(__dirname, 'quiz.html'),
        suggestions: resolve(__dirname, 'suggestions.html'),
        glassTile: resolve(__dirname, 'glass-tile.html'),
        collabonboard: resolve(__dirname, 'collabonboard.html'),
        collaborationProfiles: resolve(__dirname, 'collaboration-profiles.html'),
        collaborationProfileView: resolve(__dirname, 'collaboration-profile-view.html'),
      },
    },
  },
});
