// 2025
// Vitor
// AgriSynth
// 01/08/2025
//
// DESCRIÇÃO: Arquivo de configuração para o Vite.
// Define plugins, o servidor de desenvolvimento e o proxy para a API.

import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [react()],
  server: {
    host: true, 
    port: 5173,
    proxy: {
      '/api': {
        target: 'http://api-gateway-go:8080',
        changeOrigin: true,
      },
    },
  },
})
