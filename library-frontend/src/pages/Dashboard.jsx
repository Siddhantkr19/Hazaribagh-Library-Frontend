import React, { useEffect, useState, useRef } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import bookingApi from '../services/bookingApi';
import profilePictureService from '../services/profilePicture';
// import profilePictureService from '../services/profilePicture';

const Dashboard = () => {
const { user, login, logout } = useAuth(); // Destructure login
  const navigate = useNavigate();
  const fileInputRef = useRef(null);
  
  const [activeBookings, setActiveBookings] = useState([]);
  const [loading, setLoading] = useState(true);
const [uploading, setUploading] = useState(false);
  // 1. Protect Route
  useEffect(() => {
    if (!user) {
      navigate('/login');
    }
  }, [user, navigate]);

  // 2. Fetch Data
  useEffect(() => {
    const fetchDashboardData = async () => {
      if (!user?.email) return;

      try {
        const response = await bookingApi.get(`/bookings/dashboard?userEmail=${user.email}`);
        setActiveBookings(response.data);
      } catch (err) {
        console.error("Failed to fetch dashboard data:", err);
      } finally {
        setLoading(false);
      }
    };

    fetchDashboardData();
  }, [user]);

 // Inside Dashboard component
const handleLogout = async () => {
    try {
        // 1. Call server to clear cookie
        await bookingApi.post('/auth/logout'); // Ensure you use the correct API instance
    } catch (error) {
        console.error("Logout failed on server", error);
    } 
    // 2. Perform client-side cleanup regardless of server error
    logout(); 
};

  if (!user) return null;

const handleImageChange = async (event) => {
    const file = event.target.files[0];
    if (!file) return;

    // Validate file type
    if (!file.type.match('image.*')) {
      alert("Please select a valid image (JPG, PNG)");
      return;
    }

    setUploading(true);

    try {
      // Use the service you created
      const updatedUser = await profilePictureService.uploadProfilePicture(user.email, file);

      // Update Local Context with new User Data so image updates instantly
      login(updatedUser); 
      alert("Profile picture updated successfully!");

    } catch (error) {
      console.error("Upload failed", error);
      alert("Failed to upload image. Please try again.");
    } finally {
      setUploading(false);
    }
  };

  // ADDED: Trigger hidden file input
  const triggerFileInput = () => {
    fileInputRef.current.click();
  };

  // ADDED: Helper to construct image URL
const getProfileImage = () => {
    if (!user.profilePicture) return null;
    
    // If it's already a full URL (e.g. from Google or previous upload), use it
    if (user.profilePicture.startsWith("http")) return user.profilePicture;
    
    // Otherwise, prepend the backend URL (assuming it serves static files)
    return `http://localhost:8080${user.profilePicture}`; 
  };
  if (!user) return null;
  return (
    <div className="min-h-screen bg-gradient-to-br from-orange-50 via-pink-50 to-white dark:bg-gray-900 text-gray-900 dark:text-gray-100 pt-24 pb-12 px-4 sm:px-6 lg:px-8 font-sans transition-colors duration-300">
      
      {/* Background Decor */}
      <div className="fixed inset-0 z-0 pointer-events-none">
        <div className="absolute top-0 right-0 w-[500px] h-[500px] bg-blue-600/10 rounded-full blur-3xl"></div>
        <div className="absolute bottom-0 left-0 w-[500px] h-[500px] bg-orange-600/10 rounded-full blur-3xl"></div>
      </div>

      <div className="relative max-w-6xl mx-auto z-10">
        
        {/* HEADER SECTION */}
        <div className="flex flex-col md:flex-row md:items-center justify-between mb-8 gap-4">
          <div>
            <h1 className="text-3xl font-extrabold text-white">Student Dashboard</h1>
            <p className="text-gray-400 mt-1">
              Welcome back, <span className="text-orange-400 font-bold">{user.name}</span>!
            </p>
          </div>
          <Link to="/" className="px-6 py-2.5 bg-white text-gray-900 border border-white/20 rounded-xl text-sm font-bold hover:bg-gray-200 transition-all shadow-lg flex items-center gap-2">
            <span>+</span> Find New Library
          </Link>
        </div>

        
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 items-start">
          
          {/* --- LEFT COLUMN: SCROLLABLE CONTENT --- */}
          <div className="lg:col-span-2 space-y-8">
            
            {/* 1. Active Subscriptions */}
            <div>
              <h2 className="text-xs font-bold text-gray-400 uppercase tracking-wider mb-4 ml-1">Active Subscriptions</h2>
              
              {loading ? (
                <div className="bg-white/10 backdrop-blur-md rounded-2xl p-8 text-center animate-pulse border border-white/10">
                  <div className="h-4 bg-white/10 rounded w-1/3 mx-auto mb-4"></div>
                  <div className="h-32 bg-white/5 rounded w-full"></div>
                </div>
              ) : activeBookings.length > 0 ? (
                activeBookings.map((booking) => (
                  <div key={booking.bookingId} className="bg-white/10 backdrop-blur-md rounded-2xl p-6 shadow-xl border border-white/10 relative overflow-hidden group hover:border-orange-500/30 transition-all mb-4">
                    
                    <div className={`absolute top-0 right-0 text-white text-[10px] font-bold px-4 py-1 rounded-bl-xl shadow-md ${booking.status === 'CONFIRMED' ? 'bg-green-500' : 'bg-red-500'}`}>
                      ● {booking.status || "ACTIVE"}
                    </div>

                    <div className="flex flex-col sm:flex-row gap-6">
                      <div className="w-full sm:w-32 h-32 bg-black/20 rounded-xl overflow-hidden flex items-center justify-center text-4xl border border-white/5">
                         📚
                      </div>
                      <div className="flex-1">
                        <h3 className="text-2xl font-bold text-white mb-1">{booking.libraryName}</h3>
                        <p className="text-gray-300 text-sm mb-4 flex items-center gap-1">
                          📍 {booking.libraryAddress}
                        </p>
                        <div className="grid grid-cols-2 gap-4">
                          <div className="bg-black/20 p-3 rounded-lg border border-white/5">
                            <span className="text-[10px] text-gray-400 block uppercase tracking-wide">Seat Number</span>
                            <span className="font-mono text-xl font-bold text-blue-400">{booking.seatNumber}</span>
                          </div>
                          <div className="bg-black/20 p-3 rounded-lg border border-white/5">
                            <span className="text-[10px] text-gray-400 block uppercase tracking-wide">Expires In</span>
                            <span className="font-mono text-xl font-bold text-green-400">{booking.daysRemaining} Days</span>
                          </div>
                        </div>
                      </div>
                    </div>

                    <div className="mt-6 pt-4 border-t border-white/10 flex justify-between items-center text-xs text-gray-400">
                       <p>Owner Contact: <span className="text-white font-mono">{booking.libraryOwnerContact}</span></p>
                       <button className="text-orange-400 hover:text-orange-300 font-bold flex items-center gap-1">Download Receipt <span>↓</span></button>
                    </div>
                  </div>
                ))
              ) : (
                <div className="bg-white/5 border-2 border-dashed border-white/10 rounded-2xl p-10 text-center flex flex-col items-center justify-center">
                  <div className="w-16 h-16 bg-white/10 rounded-full flex items-center justify-center text-3xl mb-4">🪑</div>
                  <h3 className="text-lg font-bold text-white">No Active Seat</h3>
                  <p className="text-gray-400 text-sm mb-6 max-w-xs">You haven't booked a study space yet.</p>
                  <Link to="/" className="px-6 py-2 bg-orange-500 hover:bg-orange-600 text-white font-bold rounded-lg transition-colors shadow-lg">Book a Seat Now</Link>
                </div>
              )}
            </div>

            {/* 2. Recent Transactions (Limited Preview) */}
            {activeBookings.length > 0 && (
              <div>
                <div className="flex justify-between items-end mb-4 px-1">
                  <h2 className="text-xs font-bold text-gray-400 uppercase tracking-wider">Recent Transactions</h2>
                  <Link to="/history" className="text-xs font-bold text-blue-400 hover:text-blue-300">View All</Link>
                </div>
                <div className="bg-white/10 backdrop-blur-md rounded-2xl border border-white/10 overflow-hidden">
                  {activeBookings.slice(0, 3).map((booking, idx) => (
                    <div key={idx} className="flex justify-between items-center p-4 border-b border-white/10 last:border-0 hover:bg-white/5 transition-colors">
                      <div className="flex items-center gap-4">
                        <div className="p-2 bg-green-500/20 rounded-full text-green-400">
                          <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round"><polyline points="20 6 9 17 4 12"></polyline></svg>
                        </div>
                        <div>
                          <p className="font-bold text-white text-sm">Monthly Subscription</p>
                          <p className="text-xs text-gray-400">{new Date(booking.bookingDate).toLocaleDateString()}</p>
                        </div>
                      </div>
                      <span className="font-mono font-bold text-white">₹{booking.amountPaid || "350"}</span>
                    </div>
                  ))}
                </div>
              </div>
            )}

          </div>

          {/* --- RIGHT COLUMN: PROFILE & SETTINGS --- */}
        
        <div className="lg:col-span-1 space-y-6 sticky top-28">
            
    
            
            {/* PROFILE CARD WITH CAMERA UPLOAD */}
            <div className="bg-gradient-to-br from-orange-500 to-red-600 rounded-2xl p-6 text-white text-center shadow-2xl relative overflow-hidden group border border-white/10">
              
              {/* Profile Image Container */}
              <div className="relative w-24 h-24 mx-auto mb-4 group/image">
                <div className="w-full h-full rounded-full border-4 border-white/30 shadow-lg overflow-hidden bg-white/20 flex items-center justify-center text-3xl font-bold">
                  {getProfileImage() ? (
                    <img src={getProfileImage()} alt="Profile" className="w-full h-full object-cover" />
                  ) : (
                    user.name ? user.name.charAt(0).toUpperCase() : 'U'
                  )}
                </div>

                {/* Camera Icon Overlay (Clickable) */}
                <div 
                  onClick={triggerFileInput}
                  className="absolute inset-0 bg-black/40 rounded-full flex items-center justify-center opacity-0 group-hover/image:opacity-100 transition-opacity cursor-pointer"
                >
                  {uploading ? (
                    <div className="animate-spin rounded-full h-6 w-6 border-b-2 border-white"></div>
                  ) : (
                    <svg className="w-8 h-8 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M3 9a2 2 0 012-2h.93a2 2 0 001.664-.89l.812-1.22A2 2 0 0110.07 4h3.86a2 2 0 011.664.89l.812 1.22A2 2 0 0018.07 7H19a2 2 0 012 2v9a2 2 0 01-2 2H5a2 2 0 01-2-2V9z" /><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M15 13a3 3 0 11-6 0 3 3 0 016 0z" /></svg>
                  )}
                </div>

                {/* Hidden File Input */}
                <input 
                  type="file" 
                  ref={fileInputRef} 
                  onChange={handleImageChange} 
                  accept="image/png, image/jpeg, image/jpg"
                  className="hidden" 
                />
              </div>

              <h2 className="text-xl font-bold tracking-tight">{user.name}</h2>
              <p className="text-white/80 text-xs mb-4 font-mono">{user.email}</p>
              
              <div className="bg-black/20 rounded-lg p-2 backdrop-blur-sm inline-block border border-white/10">
                <p className="text-[10px] uppercase tracking-widest opacity-70 mb-1">Phone</p>
                <p className="text-sm font-mono font-bold tracking-wider">{user.phoneNumber}</p>
              </div>
            </div>
            {/* Quick Actions */}
            <div className="bg-white/10 backdrop-blur-md rounded-2xl p-2 shadow-lg border border-white/10">
              <div className="p-3 border-b border-white/10">
                <h3 className="font-bold text-gray-300 text-xs uppercase tracking-wide">Settings</h3>
              </div>
              <ul className="text-sm text-gray-300">
              
              
                <Link to="/history">
                  <li className="p-3 hover:bg-white/10 rounded-xl cursor-pointer flex items-center gap-3 transition-colors">
                    <span>💳</span> Payment History
                  </li>
                </Link>
               {/* [CHANGED] Connected Logout to Backend */}
                <li onClick={handleLogout} className="p-3 hover:bg-red-500/20 text-red-400 rounded-xl cursor-pointer flex items-center gap-3 transition-colors font-bold mt-1">
                  <span>🚪</span> Logout
                </li>
              </ul>
            </div>

          </div>

        </div>
      </div>
    </div>
  );
};

export default Dashboard;