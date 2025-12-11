import React, { useEffect, useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from "../../context/AuthContext"; 
import bookingApi from "../../services/bookingApi";


const PaymentHistory = () => {
  const { user } = useAuth();
  const navigate = useNavigate();
  const [history, setHistory] = useState([]);
  const [loading, setLoading] = useState(true);

  // Protect Route
  useEffect(() => {
    if (!user) navigate('/login');
  }, [user, navigate]);

  // Fetch Full History
  useEffect(() => {
    const fetchHistory = async () => {
      if (!user?.email) return;
      try {
        // Re-using the dashboard endpoint for now since it returns bookings.
        // Ideally, you'd have a specific /history endpoint if the data differs.
        const response = await bookingApi.get(`/dashboard?userEmail=${user.email}`);
        setHistory(response.data);
      } catch (err) {
        console.error("Failed to fetch history:", err);
      } finally {
        setLoading(false);
      }
    };
    fetchHistory();
  }, [user]);

  if (!user) return null;

  return (
    <div className="min-h-screen bg-gray-900 text-gray-100 pt-24 pb-12 px-4 sm:px-6 lg:px-8 font-sans">
      <div className="max-w-5xl mx-auto">
        
        {/* Header */}
        <div className="flex items-center gap-4 mb-8">
          <Link to="/dashboard" className="p-2 bg-white/10 rounded-full hover:bg-white/20 transition-all">
            <svg className="w-5 h-5 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M15 19l-7-7 7-7"/></svg>
          </Link>
          <div>
            <h1 className="text-3xl font-extrabold text-white">Payment History</h1>
            <p className="text-gray-400 text-sm">View all your past transactions and receipts.</p>
          </div>
        </div>

        {/* Transactions List */}
        <div className="bg-white/5 backdrop-blur-md border border-white/10 rounded-2xl overflow-hidden">
          {loading ? (
            <div className="p-8 text-center text-gray-400 animate-pulse">Loading transactions...</div>
          ) : history.length > 0 ? (
            <table className="w-full text-left border-collapse">
              <thead>
                <tr className="border-b border-white/10 bg-white/5">
                  <th className="p-4 text-xs font-bold text-gray-400 uppercase tracking-wider">Date</th>
                  <th className="p-4 text-xs font-bold text-gray-400 uppercase tracking-wider">Library</th>
                  <th className="p-4 text-xs font-bold text-gray-400 uppercase tracking-wider">Plan</th>
                  <th className="p-4 text-xs font-bold text-gray-400 uppercase tracking-wider">Amount</th>
                  <th className="p-4 text-xs font-bold text-gray-400 uppercase tracking-wider">Status</th>
                  <th className="p-4 text-xs font-bold text-gray-400 uppercase tracking-wider text-right">Action</th>
                </tr>
              </thead>
             <tbody className="divide-y divide-white/5">
  {history.map((item) => (
    <tr key={item.bookingId} className="hover:bg-white/5 transition-colors">
      
      {/* 1. DATE & TIME COLUMN */}
      <td className="p-4">
        <div className="flex flex-col">
          <span className="text-sm text-white font-medium">
            {new Date(item.bookingDate).toLocaleDateString()}
          </span>
          <span className="text-xs text-gray-500 font-mono mt-0.5">
            {/* CHANGED: Added 'hour12: true' to force AM/PM */}
            {new Date(item.bookingDate).toLocaleTimeString([], { 
              hour: '2-digit', 
              minute: '2-digit', 
              hour12: true 
            })}
          </span>
        </div>
      </td>

      <td className="p-4 text-sm text-gray-300 font-medium">
        {item.libraryName}
      </td>
      <td className="p-4 text-sm text-gray-400">
        Monthly Seat ({item.seatNumber})
      </td>
      <td className="p-4 text-sm font-bold text-white">
        ₹{item.amountPaid || "350"}
      </td>
      <td className="p-4">
        <span className={`px-2 py-1 text-[10px] font-bold rounded-md ${item.status === 'CONFIRMED' ? 'bg-green-500/20 text-green-400' : 'bg-red-500/20 text-red-400'}`}>
          {item.status}
        </span>
      </td>
      <td className="p-4 text-right">
        <button className="text-xs font-bold text-blue-400 hover:text-blue-300 underline">
          View Receipt
        </button>
      </td>
    </tr>
  ))}
</tbody>
            </table>
          ) : (
            <div className="p-10 text-center text-gray-400">
              No transaction history found.
            </div>
          )}
        </div>

      </div>
    </div>
  );
};

export default PaymentHistory;