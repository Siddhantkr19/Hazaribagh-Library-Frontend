import api from './api'; // ✅ IMPORT SHARED INSTANCE

// --- BOOKING ENDPOINTS ---
export const createOrderAPI = async (userEmail, libraryId) => {
  // api.post returns the wrapper { success: true, data: ... }
  // So 'response' IS the wrapper. 'response.data' is the actual Booking object.
  const response = await api.post(`/bookings/create-order?userEmail=${userEmail}`, {
    libraryId: libraryId
  });
  return response.data; // Return the Booking Object
};

export const verifyPaymentAPI = async (verificationData) => {
  const response = await api.post('/bookings/verify-payment', verificationData);
  return response.data; // Return the confirmed Booking
};

// --- FETCH LIBRARY DETAILS ---
export const getLibraryById = async (id) => {
  const response = await api.get(`/libraries/${id}`); 
  return response.data; // Return the Library Object
};

// --- CHECK IF USER EXISTS ---
export const checkUserByEmail = async (email) => {
  try {
    const response = await api.get(`/auth/check-email?email=${email}`);
    return response.data; // Returns true/false
  } catch (error) {
    console.error("Check email failed", error);
    return false;
  }
};

export default api;