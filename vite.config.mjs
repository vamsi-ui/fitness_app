// vite.config.mjs (or if using .js with "type": "module" in package.json)
import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';

export default defineConfig({
  plugins: [react()],
});
