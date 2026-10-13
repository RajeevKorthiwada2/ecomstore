import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

// During local dev, the frontend runs on :5173 and the backend on :8080.
// This proxy lets the React app call "/api/..." without hardcoding the
// backend URL or hitting CORS issues in dev mode.
export default defineConfig({
  plugins: [react()],
  server: {
    port: 5173,
    proxy: {
      '/api': {
        target: 'http://localhost:8080',
        changeOrigin: true,
      },
    },
  },
})
