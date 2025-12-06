import axios from 'axios';

// Create an Axios instance with your backend base URL
const api = axios.create({
  baseURL: 'http://localhost:8080/api/auth', // Change this if your Spring Boot runs on a different port
  headers: {
    'Content-Type': 'application/json',
  },
});

export default api;