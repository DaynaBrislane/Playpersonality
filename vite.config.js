import { defineConfig } from 'vite';
import { resolve } from 'path';

export default defineConfig({
  build: {
    rollupOptions: {
      input: {
        main: resolve(__dirname, 'index.html'),
        quiz: resolve(__dirname, 'quiz.html'),
        suggestions: resolve(__dirname, 'suggestions.html'),
        collaborationProfiles: resolve(__dirname, 'collaboration-profiles.html'),
        newChat: resolve(__dirname, 'new-chat.html'),
        collaborationProfileView: resolve(__dirname, 'collaboration-profile-view.html'),
        myPeople: resolve(__dirname, 'my-people.html'),
        personProfile: resolve(__dirname, 'person-profile.html'),
        journeys: resolve(__dirname, 'journeys.html'),
        nadiasNotes: resolve(__dirname, 'nadias-notes.html'),
      },
    },
  },
});
