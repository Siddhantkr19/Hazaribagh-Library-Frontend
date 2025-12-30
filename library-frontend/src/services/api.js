import axios from 'axios';

const api = axios.create({
 baseURL: import.meta.env.VITE_API_BASE_URL, // General Base URL
  withCredentials: true, // [CRITICAL] This sends the HttpOnly Cookie to the Backend
  headers: {
    'Content-Type': 'application/json',
  },
});

export default api;