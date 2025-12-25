import axios from 'axios';


const adminApi = axios.create({
  baseURL: 'https://libhub-6izs.onrender.com/api', 
  headers: {
    'Content-Type': 'application/json',
  },
  withCredentials: true 
});

export default adminApi;