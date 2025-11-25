import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

// https://vite.dev/config/
export default defineConfig({
  plugins: [react()],
  server: {
    host: true, // Allow access from network
    port: 5173, // Default Vite port
    strictPort: false, // Allow other ports if 5173 is taken
  },
  preview: {
    host: true, // Allow access from network in preview mode
    port: 4173, // Default Vite preview port
  },
})
