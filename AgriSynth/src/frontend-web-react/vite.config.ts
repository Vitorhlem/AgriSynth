// Generated typescript
// 2025
// Vitor (usuário) & Gemini
// AgriSynth
// 01/08/2025 - CORRIGIDO
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