// Vitor h. Lemes

import axios from 'axios';

const apiClient = axios.create({
  // A baseURL aponta para a raiz do servidor de desenvolvimento.
  // Graças ao proxy que configuramos no arquivo 'vite.config.ts',
  // qualquer chamada para '/api/...' será automaticamente redirecionada
  // para o nosso gateway em Go (http://api-gateway-go:8080).
  baseURL: '/',
  headers: {
    'Content-Type': 'application/json',
  },
});

export default apiClient;