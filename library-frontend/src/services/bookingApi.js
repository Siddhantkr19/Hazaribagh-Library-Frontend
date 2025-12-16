import axios from 'axios';

// Create Axios Instance
const bookingApi = axios.create({
  baseURL: 'http://localhost:8080/api/bookings', 
  headers: {
    'Content-Type': 'application/json',
  },
  withCredentials: true // [IMPORTANT] Needed to send Cookies (JWT) to backend
});

// 1. Create Order (Step 1 of Flow)
export const createOrderAPI = async (userEmail, libraryId) => {
  // We send the email and library ID as query params/body
  const response = await bookingApi.post(`/create-order?userEmail=${userEmail}`, {
    libraryId: libraryId
  });
  return response.data; // Returns orderId, amount, key, etc.
};

// 2. Verify Payment (Step 2 of Flow)
export const verifyPaymentAPI = async (verificationData) => {
  const response = await bookingApi.post('/verify-payment', verificationData);
  return response.data; // Returns confirmed booking
};

export default bookingApi;