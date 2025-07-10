import axios from 'axios';
import { logout } from '../utils/auth';

const api = axios.create({
  baseURL: 'http://localhost:8080/fanCollectorsMedia',
});

// Adiciona o token em todas as requisições
api.interceptors.request.use((config) => {
  const token = localStorage.getItem('fanCollectorsMediaToken');
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

// Trata erros de resposta (como token expirado)
api.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response?.status === 401) {
      console.warn('Token expirado ou inválido. Redirecionando para login...');
      logout(); // remove token do localStorage
      window.location.href = '/login?expired=true'; // redireciona com aviso
    }
    return Promise.reject(error);
  }
);

export default api;



