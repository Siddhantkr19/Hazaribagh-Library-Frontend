import axios from 'axios';

// Ensure this matches your backend URL exactly
const API_URL = 'https://libhub-6izs.onrender.com/api/auth';

const uploadProfilePicture = async (userEmail, file) => {
  const formData = new FormData();
  formData.append('userEmail', userEmail); 
  formData.append('file', file);

  // 1. GET THE TOKEN (This is the missing key)
  // Ensure 'token' is the exact key name you used in your Login.jsx
  const token = localStorage.getItem('token'); 

  try {
    // 2. SEND REQUEST WITH TOKEN IN HEADER
    const response = await axios.put(`${API_URL}/upload-photo`, formData, {
      headers: {
        'Authorization': `Bearer ${token}`, 
        // Axios handles Content-Type for FormData automatically
      }
    });
    
    return response.data;
  } catch (error) {
    console.error("Upload Service Error:", error.response || error);
    throw error;
  }
};

export default {
  uploadProfilePicture,
};