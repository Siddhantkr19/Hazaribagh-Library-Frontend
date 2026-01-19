import axios from 'axios';

const api = axios.create({
  baseURL: import.meta.env.VITE_API_BASE_URL,
  withCredentials: true,
  headers: {
    'Content-Type': 'application/json',
  },
});

// ✅ RESPONSE INTERCEPTOR (The Magic Unwrap)
api.interceptors.response.use(
  (response) => {
    // 1. If Backend sent { success: true, data: ... }, return the whole object
    // This matches your existing code structure: response.data
    if (response.data && response.data.success === true) {
      return response.data; 
    }
    // 2. For non-wrapped responses (like binary files), return as is
    return response;
  },
  (error) => {
    // 3. Simplify Errors
    if (error.response && error.response.data) {
      // If backend sent { success: false, message: "Invalid Password" }
      // We reject with JUST the string "Invalid Password"
      const message = error.response.data.message || "Something went wrong";
      return Promise.reject(message);
    }
    return Promise.reject(error.message || "Network Error");
  }
);

export default api;