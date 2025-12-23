import React, { useEffect, useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from "../../context/AuthContext"; 
import bookingApi from "../../services/bookingApi";
const PaymentHistory = () => {
  const { user } = useAuth();
  const navigate = useNavigate();
  const [history, setHistory] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!user) navigate('/login');
  }, [user, navigate]);

  useEffect(() => {
    const fetchHistory = async () => {
      if (!user?.email) return;
      try {
        const response = await bookingApi.get(`/bookings/dashboard?userEmail=${user.email}`);
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
    // ✅ FIX: Dynamic Background (Light vs Dark)
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900 text-gray-900 dark:text-gray-100 pt-24 pb-12 px-4 sm:px-6 lg:px-8 font-sans transition-colors duration-300">
      
      <div className="max-w-5xl mx-auto">
        
        {/* Header */}
        <div className="flex items-center gap-4 mb-8">
          <Link to="/dashboard" className="p-2 bg-white dark:bg-white/10 rounded-full hover:bg-gray-100 dark:hover:bg-white/20 transition-all shadow-sm border border-gray-200 dark:border-white/10">
            <svg className="w-5 h-5 text-gray-700 dark:text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M15 19l-7-7 7-7"/></svg>
          </Link>
          <div>
            <h1 className="text-3xl font-extrabold text-gray-900 dark:text-white">Payment History</h1>
            <p className="text-gray-500 dark:text-gray-400 text-sm">View all your past transactions.</p>
          </div>
        </div>

        {/* Table Card */}
        {/* ✅ FIX: Card Background (White vs Glassy Dark) */}
        <div className="bg-white dark:bg-white/5 backdrop-blur-md border border-gray-200 dark:border-white/10 rounded-2xl overflow-hidden shadow-lg">
          
          {loading ? (
            <div className="p-8 text-center text-gray-500 dark:text-gray-400 animate-pulse">Loading transactions...</div>
          ) : history.length > 0 ? (
            <div className="overflow-x-auto">
                <table className="w-full text-left border-collapse">
                <thead>
                    <tr className="border-b border-gray-200 dark:border-white/10 bg-gray-50 dark:bg-white/5">
                    <th className="p-4 text-xs font-bold text-gray-500 dark:text-gray-400 uppercase tracking-wider">Date</th>
                    <th className="p-4 text-xs font-bold text-gray-500 dark:text-gray-400 uppercase tracking-wider">Library</th>
                    <th className="p-4 text-xs font-bold text-gray-500 dark:text-gray-400 uppercase tracking-wider">Plan</th>
                    <th className="p-4 text-xs font-bold text-gray-500 dark:text-gray-400 uppercase tracking-wider">Amount</th>
                    <th className="p-4 text-xs font-bold text-gray-500 dark:text-gray-400 uppercase tracking-wider">Status</th>
                    <th className="p-4 text-xs font-bold text-gray-500 dark:text-gray-400 uppercase tracking-wider text-right">Transaction ID</th>
                    </tr>
                </thead>
                <tbody className="divide-y divide-gray-100 dark:divide-white/5">
                    {history.map((item) => (
                    <tr key={item.bookingId} className="hover:bg-gray-50 dark:hover:bg-white/5 transition-colors">
                        <td className="p-4">
                        <div className="flex flex-col">
                            <span className="text-sm text-gray-900 dark:text-white font-medium">
                            {new Date(item.bookingDate).toLocaleDateString()}
                            </span>
                            <span className="text-xs text-gray-500 dark:text-gray-500 font-mono mt-0.5">
                            {new Date(item.bookingDate).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit', hour12: true })}
                            </span>
                        </div>
                        </td>
                        <td className="p-4 text-sm text-gray-700 dark:text-gray-300 font-medium">{item.libraryName}</td>
                        <td className="p-4 text-sm text-gray-600 dark:text-gray-400">Monthly Seat ({item.seatNumber || "TBD"})</td>
                        <td className="p-4 text-sm font-bold text-gray-900 dark:text-white">₹{item.amountPaid || "0"}</td>
                        <td className="p-4">
                        <span className={`px-2 py-1 text-[10px] font-bold rounded-md border ${
                            item.status === 'CONFIRMED' 
                            ? 'bg-green-100 dark:bg-green-500/20 text-green-700 dark:text-green-400 border-green-200 dark:border-green-500/30' 
                            : 'bg-yellow-100 dark:bg-yellow-500/20 text-yellow-700 dark:text-yellow-400 border-yellow-200 dark:border-yellow-500/30'
                        }`}>
                            {item.status}
                        </span>
                        </td>
                        
                        <td className="p-4 text-right">
                            <span className="font-mono text-xs text-gray-600 dark:text-gray-400 bg-gray-100 dark:bg-black/20 px-2 py-1 rounded select-all cursor-text border border-gray-200 dark:border-white/10">
                                {item.paymentId || item.razorpayOrderId || "N/A"}
                            </span>
                        </td>
                    </tr>
                    ))}
                </tbody>
                </table>
            </div>
          ) : (
            <div className="p-10 text-center text-gray-500 dark:text-gray-400">No transaction history found.</div>
          )}
        </div>
      </div>
    </div>
  );
};

export default PaymentHistory;