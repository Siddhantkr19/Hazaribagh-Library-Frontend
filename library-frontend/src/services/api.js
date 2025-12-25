import axios from 'axios';

const api = axios.create({
  baseURL: 'https://libhub-6izs.onrender.com/api', // General Base URL
  withCredentials: true, // [CRITICAL] This sends the HttpOnly Cookie to the Backend
  headers: {
    'Content-Type': 'application/json',
  },
});

export default api;