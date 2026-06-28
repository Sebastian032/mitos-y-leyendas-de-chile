import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import tailwindcss from '@tailwindcss/vite' // <-- Agrega esta importación

export default defineConfig({
  plugins: [
    react(),
    tailwindcss() // <-- Agrega el plugin aquí para activar Tailwind v4
  ],
  server: {
    watch: {
      usePolling: true,
      interval: 100
    },
    host: true,
    port: 5173
  }
})