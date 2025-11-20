import axios from 'axios';

// Backend adresimiz
const api = axios.create({
  baseURL: 'http://localhost:5000/api',
  headers: {
    'Content-Type': 'application/json',
  },
});

// HER İSTEKTEN ÖNCE ÇALIŞAN KOD (Interceptor)
// Eğer cebimizde (localStorage) bir token varsa, onu backend'e gönderilecek mektubun içine koy.
api.interceptors.request.use((config) => {
  const token = localStorage.getItem('authToken');
  if (token) {
    config.headers['x-auth-token'] = token;
  }
  return config;
});

export default api;