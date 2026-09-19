import axios from 'axios';

// HARDCODE the production backend API base URL directly (no process.env or VITE_ variables)
const PRODUCTION_API = 'https://balaji-tent-house-backend.onrender.com/api';

// In local browser development (localhost/127.0.0.1), use relative '/api' which Vite dev server proxies.
// In production (e.g. deployed on Vercel at *.vercel.app), use the hardcoded production Render URL directly.
const isLocal =
  typeof window !== 'undefined' &&
  (window.location.hostname === 'localhost' || window.location.hostname === '127.0.0.1');

export const api = axios.create({
  baseURL: isLocal ? '/api' : PRODUCTION_API,
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
