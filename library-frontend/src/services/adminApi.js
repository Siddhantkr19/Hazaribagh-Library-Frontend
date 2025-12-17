import axios from 'axios';

// Create a generic Axios Instance for Admin & General calls
const adminApi = axios.create({
  baseURL: 'http://localhost:8080/api', // Points to the ROOT of your API
  headers: {
    'Content-Type': 'application/json',
  },
  withCredentials: true // [IMPORTANT] Needed to send Cookies (JWT) to backend
});

export default adminApi;