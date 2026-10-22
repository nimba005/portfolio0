import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';

export default defineConfig({
  plugins: [react()],
  build: {
    // Hashed build output lives apart from public/assets so render.yaml can cache it as immutable.
    assetsDir: 'static',
  },
});
