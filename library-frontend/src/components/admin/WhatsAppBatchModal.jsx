import React, { useState, useEffect } from 'react';
import { X, MessageCircle, Check, Copy, Loader2 } from 'lucide-react';
import { toast } from 'react-hot-toast';
import api from '../../services/adminApi'; // <--- Using the correct Admin API

const WhatsAppBatchModal = ({ isOpen, onClose }) => {
  const [students, setStudents] = useState([]);
  const [loading, setLoading] = useState(true);

  // 1. Fetch Bookings when modal opens
  useEffect(() => {
    if (isOpen) {
      fetchExpiringStudents();
    }
  }, [isOpen]);

  const fetchExpiringStudents = async () => {
    setLoading(true);
    try {
      // Fetch ALL bookings using your existing endpoint
      const { data } = await api.get('/admin/bookings');
      
      const today = new Date();
      const warningDate = new Date();
      warningDate.setDate(today.getDate() + 5); // Warning for next 5 days

      // Filter Logic: Confirmed + Expiring Soon
      const expiringList = data.filter(booking => {
        if (!booking.validUntil || booking.status !== 'CONFIRMED') return false;
        const expiryDate = new Date(booking.validUntil);
        // Check if expiry is in the future but within warning range
        return expiryDate > today && expiryDate <= warningDate;
      });

      setStudents(expiringList);
    } catch (error) {
      console.error(error);
      toast.error("Failed to load student list.");
    } finally {
      setLoading(false);
    }
  };

  const sendOne = (phone, name, daysLeft, id) => {
    if (!phone) return toast.error("No phone number");

    // Clean number (remove spaces, -)
    let cleanNumber = phone.replace(/\D/g, '');
    // Default to India (91) if missing
    if (cleanNumber.length === 10) cleanNumber = "91" + cleanNumber;

    const message = `Hi ${name}, gentle reminder from LibHub. Your library seat expires in ${daysLeft} days. Please renew to keep your spot!`;
    
    // Create WhatsApp Link
    const url = `https://wa.me/${cleanNumber}?text=${encodeURIComponent(message)}`;
    
    // Open in New Tab
    window.open(url, '_blank');

    // Mark as "Sent" visually (Green checkmark)
    setStudents(prev => prev.map(s => s.id === id ? { ...s, sent: true } : s));
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/80 backdrop-blur-sm p-4 animate-in fade-in">
      <div className="bg-gray-900 border border-white/10 w-full max-w-2xl h-[80vh] flex flex-col rounded-2xl shadow-2xl">
        
        {/* Header */}
        <div className="p-6 border-b border-white/10 flex justify-between items-center bg-gray-800/50 rounded-t-2xl">
          <div>
            <h2 className="text-xl font-bold text-white flex items-center gap-2">
              <MessageCircle className="text-green-400" /> WhatsApp Reminders
            </h2>
            <p className="text-gray-400 text-xs mt-1">
              {students.length} students expiring in the next 5 days.
            </p>
          </div>
          <button onClick={onClose} className="p-2 hover:bg-white/10 rounded-full text-gray-400">
            <X size={20} />
          </button>
        </div>

        {/* List */}
        <div className="flex-1 overflow-y-auto p-4 space-y-2">
          {loading ? (
            <div className="flex flex-col items-center justify-center h-40 gap-3 text-gray-500">
               <Loader2 className="animate-spin text-blue-500" />
               <p>Scanning bookings...</p>
            </div>
          ) : students.length === 0 ? (
            <div className="text-center text-gray-500 mt-10 p-10 border border-dashed border-white/10 rounded-xl">
                <Check className="mx-auto mb-2 text-green-500" size={32} />
                <p>No subscriptions expiring soon!</p>
            </div>
          ) : (
            students.map((booking) => {
                // Calculate Days Left
                const daysLeft = Math.ceil((new Date(booking.validUntil) - new Date()) / (1000 * 60 * 60 * 24));
                
                return (
                  <div 
                    key={booking.id} 
                    className={`flex items-center justify-between p-4 rounded-xl border transition-all ${
                        booking.sent 
                        ? 'bg-green-900/10 border-green-500/30' 
                        : 'bg-white/5 border-white/10 hover:bg-white/10'
                    }`}
                  >
                    <div className="flex items-center gap-3">
                        <div className={`w-2 h-2 rounded-full ${booking.sent ? 'bg-green-500' : 'bg-red-500 animate-pulse'}`} />
                        <div>
                            <p className="font-bold text-gray-200">{booking.user?.name}</p>
                            <p className="text-xs text-gray-500">{booking.user?.phoneNumber || "No Phone"}</p>
                        </div>
                    </div>

                    <div className="flex items-center gap-4">
                        <span className="text-xs font-mono text-orange-400 bg-orange-400/10 px-2 py-1 rounded">
                            {daysLeft} Days Left
                        </span>
                        
                        {booking.sent ? (
                            <span className="text-green-500 flex items-center gap-1 text-sm font-bold">
                                <Check size={16} /> Sent
                            </span>
                        ) : (
                            <button 
                                onClick={() => sendOne(booking.user?.phoneNumber, booking.user?.name, daysLeft, booking.id)}
                                className="px-4 py-2 bg-green-600 hover:bg-green-500 text-white text-sm font-bold rounded-lg flex items-center gap-2 shadow-lg hover:shadow-green-500/20 transition-all"
                            >
                                Open WhatsApp <MessageCircle size={16} />
                            </button>
                        )}
                    </div>
                  </div>
                );
            })
          )}
        </div>
      </div>
    </div>
  );
};

export default WhatsAppBatchModal;