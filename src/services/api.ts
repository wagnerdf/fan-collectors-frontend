import axios from 'axios';
import { logout } from '../utils/auth';

const baseURL = import.meta.env.REACT_APP_API_URL;

if (!baseURL) {
  throw new Error(
    'VITE_API_URL não está definida. Verifique as variáveis de ambiente no painel da Vercel.'
  );
}

const api = axios.create({
  baseURL,
  withCredentials: true,
});

api.interceptors.request.use((config) => {
  const token = localStorage.getItem('fanCollectorsMediaToken');
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

api.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response?.status === 401) {
      console.warn('Token expirado ou inválido. Redirecionando para login...');
      logout();
      window.location.href = '/login?expired=true';
    }
    return Promise.reject(error);
  }
);

export default api;
