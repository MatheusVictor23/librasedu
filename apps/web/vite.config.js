import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import path from 'path' // 1. Importe o 'path'

export default defineConfig({
  plugins: [react()],
  server: {
    host: true,
    watch: {
      usePolling: true,
    },
  },
  // 2. Adicione esta seção
  resolve: {
    alias: {
      "@": path.resolve(__dirname, "./src"),
    },
  },
})