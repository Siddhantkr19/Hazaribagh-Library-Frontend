import React from 'react';
import { Link } from 'react-router-dom';

const Dashboard = () => {
  // Mock Student Data
  const student = {
    name: "Siddhant Kumar",
    id: "LIB-2025-883",
    email: "siddhant@university.com",
    activePlan: {
      library: "Focus Point Library",
      location: "Matwari, Hazaribagh",
      plan: "Monthly AC Seat",
      startDate: "2023-12-04",
      expiryDate: "2024-01-04",
      daysLeft: 29,
      seatNumber: "A-45",
      status: "Active"
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900 pt-24 pb-12 px-4 sm:px-6 lg:px-8 font-sans">
      <div className="max-w-4xl mx-auto">
        
        {/* Header Section */}
        <div className="flex flex-col md:flex-row md:items-center justify-between mb-8 gap-4">
          <div>
            <h1 className="text-3xl font-bold text-gray-900 dark:text-white">Student Dashboard</h1>
            <p className="text-gray-500 dark:text-gray-400">Manage your subscriptions and access digital ID.</p>
          </div>
          <Link to="/" className="px-5 py-2 bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-lg text-sm font-semibold hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors text-gray-700 dark:text-gray-200 shadow-sm">
            Find New Library
          </Link>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          
          {/* LEFT COLUMN: Digital ID Card (The "Ticket") */}
          <div className="md:col-span-2 space-y-6">
            
            {/* Active Subscription Card */}
            <div className="bg-white dark:bg-gray-800 rounded-2xl p-6 shadow-xl border border-gray-100 dark:border-gray-700 relative overflow-hidden">
              {/* Green Active Status Banner */}
              <div className="absolute top-0 right-0 bg-green-500 text-white text-xs font-bold px-4 py-1 rounded-bl-xl shadow-md">
                ● ACTIVE
              </div>

              <h2 className="text-xs font-bold text-gray-400 uppercase tracking-wider mb-4">Current Subscription</h2>
              
              <div className="flex flex-col sm:flex-row gap-6">
                {/* Library Image */}
                <img 
                  src="https://images.unsplash.com/photo-1521587760476-6c12a4b040da?q=80&w=2670&auto=format&fit=crop" 
                  alt="Library" 
                  className="w-full sm:w-32 h-32 rounded-xl object-cover shadow-md"
                />
                
                {/* Details */}
                <div className="flex-1">
                  <h3 className="text-2xl font-bold text-gray-900 dark:text-white mb-1">{student.activePlan.library}</h3>
                  <p className="text-gray-500 dark:text-gray-400 text-sm mb-4">📍 {student.activePlan.location}</p>
                  
                  <div className="grid grid-cols-2 gap-4">
                    <div className="bg-gray-50 dark:bg-gray-700/50 p-3 rounded-lg border border-gray-100 dark:border-gray-600">
                      <span className="text-xs text-gray-500 dark:text-gray-400 block">Seat Number</span>
                      <span className="font-mono text-lg font-bold text-blue-600 dark:text-blue-400">{student.activePlan.seatNumber}</span>
                    </div>
                    <div className="bg-gray-50 dark:bg-gray-700/50 p-3 rounded-lg border border-gray-100 dark:border-gray-600">
                      <span className="text-xs text-gray-500 dark:text-gray-400 block">Days Left</span>
                      <span className="font-mono text-lg font-bold text-green-600 dark:text-green-400">{student.activePlan.daysLeft} Days</span>
                    </div>
                  </div>
                </div>
              </div>

              {/* Progress Bar */}
              <div className="mt-6">
                <div className="flex justify-between text-xs text-gray-400 mb-1">
                  <span>Started: {student.activePlan.startDate}</span>
                  <span>Expires: {student.activePlan.expiryDate}</span>
                </div>
                <div className="w-full bg-gray-200 dark:bg-gray-700 rounded-full h-2.5">
                  <div className="bg-blue-600 h-2.5 rounded-full" style={{ width: '15%' }}></div>
                </div>
              </div>

              {/* Action Buttons */}
              <div className="mt-6 flex gap-3">
                <button className="flex-1 py-2.5 bg-gray-900 dark:bg-white text-white dark:text-black font-bold rounded-xl text-sm hover:opacity-90 transition-opacity">
                  Download Receipt
                </button>
                <button className="px-4 py-2.5 bg-red-50 text-red-600 dark:bg-red-900/20 dark:text-red-400 font-bold rounded-xl text-sm hover:bg-red-100 dark:hover:bg-red-900/40 transition-colors">
                  Report Issue
                </button>
              </div>
            </div>

            {/* Previous History (Placeholder) */}
            <div className="bg-white dark:bg-gray-800 rounded-2xl p-6 shadow-sm border border-gray-100 dark:border-gray-700">
              <h3 className="font-bold text-gray-900 dark:text-white mb-4">Payment History</h3>
              <div className="space-y-3">
                <div className="flex justify-between items-center py-2 border-b border-gray-100 dark:border-gray-700 last:border-0">
                  <div className="flex items-center gap-3">
                    <div className="bg-green-100 dark:bg-green-900/30 p-2 rounded-lg text-green-600">✓</div>
                    <div>
                      <p className="font-medium text-gray-800 dark:text-white text-sm">Monthly Subscription</p>
                      <p className="text-xs text-gray-500">Dec 04, 2025</p>
                    </div>
                  </div>
                  <span className="font-bold text-gray-900 dark:text-white">-₹350</span>
                </div>
              </div>
            </div>
          </div>

          {/* RIGHT COLUMN: Profile Card */}
          <div className="space-y-6">
            <div className="bg-gradient-to-b from-blue-600 to-blue-800 rounded-2xl p-6 text-white text-center shadow-lg relative overflow-hidden">
              <div className="absolute top-0 left-0 w-full h-full bg-white/5 rotate-45 transform scale-150 origin-top-left"></div>
              
              <div className="relative z-10">
                <div className="w-20 h-20 bg-white rounded-full mx-auto p-1 mb-3 shadow-md">
                  <img src="https://api.dicebear.com/7.x/avataaars/svg?seed=Siddhant" alt="Profile" className="w-full h-full rounded-full" />
                </div>
                <h2 className="text-xl font-bold">{student.name}</h2>
                <p className="text-blue-200 text-sm mb-4">{student.email}</p>
                <div className="bg-white/20 rounded-lg p-2 backdrop-blur-sm inline-block">
                  <p className="text-xs font-mono tracking-wider">ID: {student.id}</p>
                </div>
              </div>
            </div>

            <div className="bg-white dark:bg-gray-800 rounded-2xl p-6 shadow-sm border border-gray-100 dark:border-gray-700">
              <h3 className="font-bold text-gray-900 dark:text-white mb-4 text-sm uppercase tracking-wide">Quick Links</h3>
              <ul className="space-y-2 text-sm text-gray-600 dark:text-gray-300">
                <li className="p-2 hover:bg-gray-50 dark:hover:bg-gray-700 rounded cursor-pointer">👤 Edit Profile</li>
                <li className="p-2 hover:bg-gray-50 dark:hover:bg-gray-700 rounded cursor-pointer">💳 Manage Payments</li>
                <li className="p-2 hover:bg-gray-50 dark:hover:bg-gray-700 rounded cursor-pointer text-red-500">🚪 Logout</li>
              </ul>
            </div>
          </div>

        </div>
      </div>
    </div>
  );
};

export default Dashboard;