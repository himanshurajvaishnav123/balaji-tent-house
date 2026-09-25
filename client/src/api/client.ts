import axios from 'axios';

// Dynamically use Vite environment variable with local fallback
const baseURL = import.meta.env.VITE_API_URL || 'http://localhost:5000/api';

export const api = axios.create({
  baseURL,
  withCredentials: true,
});

// Interceptor to attach Bearer token if stored (handles cross-domain cookie restrictions seamlessly)
api.interceptors.request.use((config) => {
  const token = localStorage.getItem('btk_token');
  if (token && config.headers) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});
