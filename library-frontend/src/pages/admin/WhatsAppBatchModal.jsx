import React, { useState, useEffect } from 'react';
import { X, MessageCircle, Check, Copy } from 'lucide-react';
import { toast } from 'react-hot-toast';
import api from '../../services/adminApi'; // <--- USE THIS// Adjust path if needed

const WhatsAppBatchModal = ({ isOpen, onClose }) => {
  const [students, setStudents] = useState([]);
  const [loading, setLoading] = useState(true);

  // Fetch only expiring students when modal opens
  useEffect(() => {
    if (isOpen) {
      fetchExpiringStudents();
    }
  }, [isOpen]);

  const fetchExpiringStudents = async () => {
    setLoading(true);
    try {
      // Reuse your stats or bookings endpoint, 
      // OR better: Create a dedicated filter in frontend or backend.
      // For now, let's fetch ALL bookings and filter in JS (Quickest way)
      const { data } = await api.get('/admin/bookings');
      
      const today = new Date();
      const threeDaysLater = new Date();
      threeDaysLater.setDate(today.getDate() + 3);

      const expiringList = data.filter(booking => {
        if (!booking.validUntil || booking.status !== 'CONFIRMED') return false;
        const expiryDate = new Date(booking.validUntil);
        return expiryDate > today && expiryDate <= threeDaysLater;
      });

      setStudents(expiringList);
    } catch (error) {
      console.error(error);
      toast.error("Failed to load list");
    } finally {
      setLoading(false);
    }
  };

  const sendOne = (phone, name, daysLeft, id) => {
    if (!phone) return toast.error("No phone number");

    // Clean number
    let cleanNumber = phone.replace(/\D/g, '');
    if (cleanNumber.length === 10) cleanNumber = "91" + cleanNumber;

    const message = `Hi ${name}, urgent reminder from LibHub. Your seat expires in about ${daysLeft} days. Please renew soon!`;
    const url = `https://wa.me/${cleanNumber}?text=${encodeURIComponent(message)}`;
    
    // Open WhatsApp
    window.open(url, '_blank');

    // Mark as "Sent" visually in the list
    setStudents(prev => prev.map(s => s.id === id ? { ...s, sent: true } : s));
  };

  const copyAllNumbers = () => {
    const numbers = students
      .map(s => s.user?.phoneNumber)
      .filter(n => n)
      .join(',');
    navigator.clipboard.writeText(numbers);
    toast.success("Copied all numbers to clipboard!");
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/80 backdrop-blur-sm p-4 animate-in fade-in">
      <div className="bg-gray-900 border border-white/10 w-full max-w-2xl h-[80vh] flex flex-col rounded-2xl shadow-2xl">
        
        {/* Header */}
        <div className="p-6 border-b border-white/10 flex justify-between items-center bg-gray-800/50 rounded-t-2xl">
          <div>
            <h2 className="text-xl font-bold text-white flex items-center gap-2">
              <MessageCircle className="text-green-400" /> WhatsApp Batch Sender
            </h2>
            <p className="text-gray-400 text-xs mt-1">
              Found {students.length} students expiring in 3 days.
            </p>
          </div>
          <button onClick={onClose} className="p-2 hover:bg-white/10 rounded-full text-gray-400">
            <X size={20} />
          </button>
        </div>

        {/* Toolbar */}
        <div className="p-4 bg-gray-900 border-b border-white/10 flex gap-3">
            <button 
                onClick={copyAllNumbers}
                className="flex-1 py-2 bg-gray-800 hover:bg-gray-700 text-white rounded-lg text-sm font-medium border border-white/10 flex items-center justify-center gap-2"
            >
                <Copy size={16} /> Copy All Numbers
            </button>
            <div className="flex-1 flex items-center justify-center text-xs text-gray-500">
                (Use "WA Sender" Chrome Extension for full auto)
            </div>
        </div>

        {/* List */}
        <div className="flex-1 overflow-y-auto p-4 space-y-2">
          {loading ? (
            <p className="text-center text-gray-500 mt-10">Scanning bookings...</p>
          ) : students.length === 0 ? (
            <div className="text-center text-gray-500 mt-10">
                <Check className="mx-auto mb-2 text-green-500" />
                No pending reminders!
            </div>
          ) : (
            students.map((booking) => {
                // Calculate Exact Days Left
                const daysLeft = Math.ceil((new Date(booking.validUntil) - new Date()) / (1000 * 60 * 60 * 24));
                
                return (
                  <div 
                    key={booking.id} 
                    className={`flex items-center justify-between p-4 rounded-xl border transition-all ${
                        booking.sent 
                        ? 'bg-green-900/10 border-green-500/30 opacity-60' 
                        : 'bg-white/5 border-white/10 hover:bg-white/10'
                    }`}
                  >
                    <div className="flex items-center gap-3">
                        <div className={`w-2 h-2 rounded-full ${booking.sent ? 'bg-green-500' : 'bg-red-500 animate-pulse'}`} />
                        <div>
                            <p className="font-bold text-gray-200">{booking.user?.name}</p>
                            <p className="text-xs text-gray-500">{booking.user?.phoneNumber || "No Number"}</p>
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
                                className="px-4 py-2 bg-green-600 hover:bg-green-500 text-white text-sm font-bold rounded-lg flex items-center gap-2 shadow-lg shadow-green-900/20"
                            >
                                Send <MessageCircle size={16} />
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