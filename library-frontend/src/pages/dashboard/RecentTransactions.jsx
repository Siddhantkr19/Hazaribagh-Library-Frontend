import React from 'react';
import { Link } from 'react-router-dom';

const RecentTransactions = ({ bookings }) => {
  if (!bookings || bookings.length === 0) return null;

  return (
    <div>
      <div className="flex justify-between items-end mb-4 px-1">
        <h2 className="text-xs font-bold text-gray-500 dark:text-gray-400 uppercase tracking-wider">Recent Transactions</h2>
        <Link to="/history" className="text-xs font-bold text-blue-600 dark:text-blue-400 hover:text-blue-500">View All</Link>
      </div>
      <div className="bg-white dark:bg-white/10 backdrop-blur-md rounded-2xl border border-gray-200 dark:border-white/10 overflow-hidden">
        {bookings.slice(0, 3).map((booking, idx) => (
          <div key={idx} className="flex justify-between items-center p-4 border-b border-gray-100 dark:border-white/10 last:border-0 hover:bg-gray-50 dark:hover:bg-white/5 transition-colors">
            <div className="flex items-center gap-4">
              <div className="p-2 bg-green-100 dark:bg-green-500/20 rounded-full text-green-600 dark:text-green-400">
                <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round"><polyline points="20 6 9 17 4 12"></polyline></svg>
              </div>
              <div>
                <p className="font-bold text-gray-900 dark:text-white text-sm">Monthly Subscription</p>
                <p className="text-xs text-gray-500 dark:text-gray-400">{new Date(booking.bookingDate).toLocaleDateString()}</p>
              </div>
            </div>
            <span className="font-mono font-bold text-gray-900 dark:text-white">₹{booking.amountPaid || "350"}</span>
          </div>
        ))}
      </div>
    </div>
  );
};

export default RecentTransactions;