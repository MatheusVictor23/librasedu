// src/api/axiosConfig.js
import axios from 'axios';

const api = axios.create({
  baseURL: 'http://localhost:3000/api',
});

// Intercetor de Requisições
api.interceptors.request.use(
  (config) => {
    // Pega o token do localStorage
    const token = localStorage.getItem('authToken');
    if (token) {
      // Anexa o token ao cabeçalho de Autorização
      config.headers['Authorization'] = `Bearer ${token}`;
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

export default api;