import tailwindcss from '@tailwindcss/vite'
import react from '@vitejs/plugin-react'
import { defineConfig } from 'vite'

// https://vite.dev/config/
export default defineConfig({
  plugins: [react(), tailwindcss()],
  server: {
    // Forward /api requests to Spring Boot so the browser sees one origin (no CORS needed)
    proxy: {
      '/api': 'http://localhost:8080',
    },
  },
})
