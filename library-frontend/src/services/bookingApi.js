import axios from 'axios';

// Base Axios Instance
const api = axios.create({
  baseURL: 'http://localhost:8080/api', // Changed to base API
  headers: { 'Content-Type': 'application/json' },
  withCredentials: true
});

// --- BOOKING ENDPOINTS ---
export const createOrderAPI = async (userEmail, libraryId) => {
  const response = await api.post(`/bookings/create-order?userEmail=${userEmail}`, {
    libraryId: libraryId
  });
  return response.data;
};

export const verifyPaymentAPI = async (verificationData) => {
  const response = await api.post('/bookings/verify-payment', verificationData);
  return response.data;
};

// --- NEW: FETCH LIBRARY DETAILS ---
export const getLibraryById = async (id) => {
  // Assuming your backend has this endpoint. If not, use the logic from AllLibraries to findByID
  const response = await api.get(`/libraries/${id}`); 
  // If your backend only has /libraries, you might need to fetch all and find one, but getting by ID is better.
  return response.data;
};

// --- NEW: CHECK IF USER EXISTS ---
export const checkUserByEmail = async (email) => {
  // You need to create this endpoint in your AuthController on Backend
  // Example: @GetMapping("/check-email") public boolean checkEmail(@RequestParam String email) ...
  try {
    const response = await api.get(`/auth/check-email?email=${email}`);
    return response.data; // Should return { exists: true/false } or just boolean
  } catch (error) {
    console.error("Check email failed", error);
    return false; // Assume false or handle error
  }
};

export default api;