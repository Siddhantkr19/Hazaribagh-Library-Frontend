import axios from 'axios';

const API_URL = 'http://localhost:8080/api/auth';

const uploadProfilePicture = async (userEmail, file) => {
  const formData = new FormData();
  formData.append('userEmail', userEmail); 
  formData.append('file', file);

  try {
    // FIX: Do NOT set Content-Type header manually. 
    // Let axios handle it to generate the correct 'boundary'.
    const response = await axios.put(`${API_URL}/upload-photo`, formData);
    
    return response.data;
  } catch (error) {
    throw error;
  }
};

export default {
  uploadProfilePicture,
};