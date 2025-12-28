import api from './api'; // ✅ Use your configured axios instance

const uploadProfilePicture = async (userEmail, file) => {
  const formData = new FormData();
  formData.append('userEmail', userEmail); 
  formData.append('file', file);

  try {
    // ✅ No manual token needed. 
    // The browser automatically sends the 'libhub-token-v3' cookie!
    const response = await api.put('/auth/upload-photo', formData, {
      headers: {
        // We leave 'Authorization' out completely
        'Content-Type': 'multipart/form-data',
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