import axios from 'axios';

const api = axios.create({
  baseURL: "http://localhost:8080/fanCollectorsMedia",
});

api.interceptors.request.use((config) => {
  const token = localStorage.getItem('fanCollectorsMediaToken');
  if (token && config.headers) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

export default api;

