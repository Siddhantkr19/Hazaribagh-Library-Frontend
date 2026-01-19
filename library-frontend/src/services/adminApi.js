import api from './api'; // ✅ Import shared instance

// --- DASHBOARD STATS ---
export const getDashboardStats = async () => {
  // Interceptor returns { success: true, data: { ... } }
  const response = await api.get('/admin/stats');
  // We return response.data (The actual Stats object)
  return response.data;
};

// --- ALL BOOKINGS ---
export const getAllBookings = async () => {
  const response = await api.get('/admin/bookings');
  return response.data; // Returns List<Booking>
};

// --- TRIGGER REMINDERS ---
export const triggerReminders = async () => {
  const response = await api.post('/admin/trigger-reminders');
  return response.message; // Returns "Reminders sent successfully"
};

// --- REVENUE GRAPH ---
export const getRevenueGraphData = async () => {
  const response = await api.get('/admin/revenue-graph');
  return response.data;
};

// --- GET ALL STUDENTS ---
export const getAllStudents = async () => {
  const response = await api.get('/admin/students');
  return response.data;
};

// --- OFFLINE BOOKING ---
export const createOfflineBooking = async (bookingData) => {
  const response = await api.post('/admin/book-offline', bookingData);
  return response.message;
};

// --- CANCEL BOOKING ---
export const cancelBooking = async (bookingId) => {
  const response = await api.put(`/admin/bookings/${bookingId}/cancel`);
  return response.message;
};

// --- DOWNLOAD REPORT (SPECIAL CASE) ---
// PDF downloads are binary, so we need specific config
export const downloadPaymentReport = async (filters) => {
  const response = await api.get('/admin/reports/payments', {
    params: filters,
    responseType: 'blob', // Important for PDF
  });
  // For blobs, the interceptor passes the whole response object
  return response.data; 
};
// ✅ ADD THIS AT THE BOTTOM TO FIX THE ERROR
const adminApi = {
  getDashboardStats,
  getAllBookings,
  triggerReminders,
  getRevenueGraphData,
  getAllStudents,
  createOfflineBooking,
  cancelBooking,
  downloadPaymentReport
};

export default adminApi;