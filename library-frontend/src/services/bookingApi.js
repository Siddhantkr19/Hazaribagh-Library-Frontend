import axios from 'axios';

// This specific instance talks ONLY to the Booking Controller
const bookingApi = axios.create({
  baseURL: 'http://localhost:8080/api/bookings', 
  headers: {
    'Content-Type': 'application/json',
  },
});

export default bookingApi;