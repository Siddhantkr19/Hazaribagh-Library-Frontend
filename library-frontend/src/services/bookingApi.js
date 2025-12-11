import axios from 'axios';


const bookingApi = axios.create({
  baseURL: 'http://localhost:8080/api/bookings', 
  headers: {
    'Content-Type': 'application/json',
  },
});

export default bookingApi;