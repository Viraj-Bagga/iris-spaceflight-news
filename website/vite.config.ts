import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import tailwindcss from '@tailwindcss/vite'

// https://vite.dev/config/
export default defineConfig({
  // GitHub Pages serves the site from /<repo>/; the Pages workflow sets this.
  base: process.env.BASE_PATH ?? '/',
  plugins: [react(), tailwindcss()],
})
