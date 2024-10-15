import axios from 'axios';
import { isTokenExpired } from '../utils/auth';

const API = axios.create({
  baseURL: 'http://localhost:3000', // Replace with your backend URL
});

// Attach JWT token to every request if it exists and is not expired
API.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem('token');
    if (token && !isTokenExpired(token)) {
      config.headers['Authorization'] = `Bearer ${token}`;
    } else {
      // Optionally, remove the invalid/expired token
      localStorage.removeItem('token');
    }
    return config;
  },
  (error) => Promise.reject(error)
);

// Handle unauthorized and forbidden responses globally
API.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response && (error.response.status === 401 || error.response.status === 403)) {
      // Clear the token
      localStorage.removeItem('token');

      // Dispatch a logout event to be handled by AuthProvider
      window.dispatchEvent(new Event('logout'));
    }
    return Promise.reject(error);
  }
);

export default API;
