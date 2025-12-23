import React, { useState, useEffect } from 'react';
import { X, Check, Loader2 } from 'lucide-react';
import { toast } from 'react-hot-toast';
import api from '../../services/adminApi'; 

const OfflineBookingModal = ({ isOpen, onClose }) => {
  const [loading, setLoading] = useState(false);
  const [libraries, setLibraries] = useState([]);
  
  const [formData, setFormData] = useState({
    studentEmail: '',
    libraryId: '',
    seatNumber: '',
    amountPaid: '',
    durationDays: 30 
  });

  useEffect(() => {
    if (isOpen) {
      const fetchLibs = async () => {
        try {
          const { data } = await api.get('/libraries');
          setLibraries(data);
        } catch (error) {
          console.error("Could not load libraries");
        }
      };
      fetchLibs();
    }
  }, [isOpen]);

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);

    try {
      // ✅ FIX: URL must be EXACTLY '/admin/book-offline'
      await api.post('/admin/book-offline', {
        studentEmail: formData.studentEmail,
        libraryId: Number(formData.libraryId),
        seatNumber: formData.seatNumber,
        amountPaid: Number(formData.amountPaid),
        durationDays: Number(formData.durationDays)
      });

      toast.success("Booking Created Successfully!");
      onClose();
      setFormData({ studentEmail: '', libraryId: '', seatNumber: '', amountPaid: '', durationDays: 30 });
      
    } catch (error) {
      console.error("Booking Error:", error);
      const errMsg = error.response?.data?.message || error.response?.data || "Failed to create booking.";
      toast.error(typeof errMsg === 'string' ? errMsg : "Failed to create booking");
    } finally {
      setLoading(false);
    }
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-sm animate-in fade-in duration-200">
      <div className="bg-gray-900 border border-white/10 w-full max-w-md p-6 rounded-2xl shadow-2xl relative">
        <div className="flex justify-between items-center mb-6">
          <h2 className="text-xl font-bold text-white">Add Offline Booking</h2>
          <button onClick={onClose} className="p-2 hover:bg-white/10 rounded-full text-gray-400 transition-colors">
            <X size={20} />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block text-xs font-medium text-gray-400 mb-1">Student Email</label>
            <input required type="email" name="studentEmail" placeholder="student@example.com" value={formData.studentEmail} onChange={handleChange} className="w-full bg-black/20 border border-white/10 rounded-xl px-4 py-3 text-white focus:border-blue-500 focus:outline-none transition-colors" />
          </div>

          <div>
            <label className="block text-xs font-medium text-gray-400 mb-1">Select Library</label>
            <select required name="libraryId" value={formData.libraryId} onChange={handleChange} className="w-full bg-black/20 border border-white/10 rounded-xl px-4 py-3 text-white focus:border-blue-500 focus:outline-none appearance-none">
              <option value="">-- Choose a Branch --</option>
              {libraries.map(lib => (
                <option key={lib.id} value={lib.id} className="bg-gray-900">
                  {lib.name} ({lib.address})
                </option>
              ))}
            </select>
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-medium text-gray-400 mb-1">Seat Number</label>
              <input type="text" name="seatNumber" placeholder="e.g. A-12" value={formData.seatNumber} onChange={handleChange} className="w-full bg-black/20 border border-white/10 rounded-xl px-4 py-3 text-white focus:border-blue-500 focus:outline-none"/>
            </div>
            <div>
              <label className="block text-xs font-medium text-gray-400 mb-1">Amount Paid (₹)</label>
              <input required type="number" name="amountPaid" placeholder="₹" value={formData.amountPaid} onChange={handleChange} className="w-full bg-black/20 border border-white/10 rounded-xl px-4 py-3 text-white focus:border-blue-500 focus:outline-none"/>
            </div>
          </div>

          <div>
              <label className="block text-xs font-medium text-gray-400 mb-1">Duration (Days)</label>
              <input required type="number" name="durationDays" value={formData.durationDays} onChange={handleChange} className="w-full bg-black/20 border border-white/10 rounded-xl px-4 py-3 text-white focus:border-blue-500 focus:outline-none"/>
          </div>

          <button type="submit" disabled={loading} className="w-full mt-6 bg-blue-600 hover:bg-blue-500 text-white font-bold py-3 rounded-xl flex items-center justify-center gap-2 transition-all">
            {loading ? <Loader2 className="animate-spin" size={20} /> : <Check size={20} />}
            {loading ? "Processing..." : "Confirm Booking"}
          </button>
        </form>
      </div>
    </div>
  );
};

export default OfflineBookingModal;