import React, { useEffect, useState, useRef } from 'react';
import { Link, useNavigate } from 'react-router-dom';
// ✅ FIX: Go up TWO levels (../../) because we are now in src/pages/dashboard/
import { useAuth } from '../../context/AuthContext'; 
import bookingApi from '../../services/bookingApi'; 
import profilePictureService from '../../services/profilePicture';
import axios from 'axios';

// Import New Sub-Components
import ActiveSubscriptions from './ActiveSubscriptions';
import RecentTransactions from './RecentTransactions';
import ProfileCard from './ProfileCard';
import QuickActions from './QuickActions';
import HelpModal from './HelpModal';

const Dashboard = () => {
  const { user, login, logout } = useAuth(); 
  const navigate = useNavigate();
  const fileInputRef = useRef(null);
  
  const [activeBookings, setActiveBookings] = useState([]);
  const [loading, setLoading] = useState(true);
  const [uploading, setUploading] = useState(false);
  const [uploadStatus, setUploadStatus] = useState(null);

  // Help Modal States
  const [showHelpModal, setShowHelpModal] = useState(false);
  const [helpSubject, setHelpSubject] = useState("Refund Request");
  const [helpMessage, setHelpMessage] = useState("");
  const [isSendingHelp, setIsSendingHelp] = useState(false);

  useEffect(() => {
    if (!user) {
      navigate('/login');
    }
  }, [user, navigate]);

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

  const handleLogout = async () => {
    try {
        await bookingApi.post('/auth/logout'); 
    } catch (error) {
        console.error("Logout failed on server", error);
    } 
    logout(); 
  };

  const handleImageChange = async (event) => {
    const file = event.target.files[0];
    if (!file) return;
    setUploadStatus(null);

    if (!file.type.match('image.*')) {
        setUploadStatus({ type: 'error', msg: "Invalid file format. Use JPG or PNG." });
        return;
    }
    if (file.size > 5 * 1024 * 1024) {
        setUploadStatus({ type: 'error', msg: "File is too large (Max 5MB)." });
        return;
    }

    setUploading(true);
    try {
        const updatedUser = await profilePictureService.uploadProfilePicture(user.email, file);
        login({ ...updatedUser, profilePicture: updatedUser.profilePicture });
        setUploadStatus({ type: 'success', msg: "Photo updated successfully!" });
        setTimeout(() => setUploadStatus(null), 3000);
    } catch (error) {
        console.error("Upload failed", error);
        setUploadStatus({ type: 'error', msg: "Upload failed. Please try again." });
    } finally {
        setUploading(false);
        if (fileInputRef.current) fileInputRef.current.value = "";
    }
  };

  const triggerFileInput = () => {
    fileInputRef.current.click();
  };

  const handleHelpSubmit = async (e) => {
    e.preventDefault();
    if (!helpMessage.trim()) return;

    setIsSendingHelp(true);
    try {
        await axios.post('http://localhost:8080/api/help/submit', {
            userEmail: user.email,
            subject: helpSubject,
            message: helpMessage,
            bookingId: activeBookings.length > 0 ? activeBookings[0].bookingId : null 
        }, {
             headers: { 'Authorization': `Bearer ${localStorage.getItem('token')}` }
        });

        alert("Ticket submitted successfully! Admin will review your request.");
        setShowHelpModal(false);
        setHelpMessage("");
    } catch (error) {
        console.error("Help submit error", error);
        alert("Failed to send request. Please try again.");
    } finally {
        setIsSendingHelp(false);
    }
  };

  if (!user) return null;

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900 text-gray-900 dark:text-gray-100 pt-24 pb-12 px-4 sm:px-6 lg:px-8 font-sans transition-colors duration-300">
      
      {/* Background Decor */}
      <div className="fixed inset-0 z-0 pointer-events-none opacity-0 dark:opacity-100 transition-opacity">
        <div className="absolute top-0 right-0 w-[500px] h-[500px] bg-blue-600/10 rounded-full blur-3xl"></div>
        <div className="absolute bottom-0 left-0 w-[500px] h-[500px] bg-orange-600/10 rounded-full blur-3xl"></div>
      </div>

      <div className="relative max-w-6xl mx-auto z-10">
        
        {/* HEADER SECTION */}
        <div className="flex flex-col md:flex-row md:items-center justify-between mb-8 gap-4">
          <div>
            <h1 className="text-3xl font-extrabold text-gray-900 dark:text-white">Student Profile</h1>
            <p className="text-gray-500 dark:text-gray-400 mt-1">
              Welcome back, <span className="text-orange-500 font-bold">{user.name}</span>!
            </p>
          </div>
          <Link to="/" className="px-6 py-2.5 bg-white dark:bg-white/10 text-gray-900 dark:text-white border border-gray-200 dark:border-white/20 rounded-xl text-sm font-bold hover:bg-gray-100 dark:hover:bg-white/20 transition-all shadow-md flex items-center gap-2">
            <span>+</span> Find New Library
          </Link>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 items-start">
          
          {/* LEFT COLUMN */}
          <div className="lg:col-span-2 space-y-8">
            <ActiveSubscriptions bookings={activeBookings} loading={loading} />
            <RecentTransactions bookings={activeBookings} />
          </div>

          {/* RIGHT COLUMN */}
          <div className="lg:col-span-1 space-y-6 sticky top-28">
            <ProfileCard 
              user={user} 
              uploading={uploading} 
              uploadStatus={uploadStatus} 
              handleImageChange={handleImageChange}
              triggerFileInput={triggerFileInput}
              fileInputRef={fileInputRef}
            />
            <QuickActions 
              handleLogout={handleLogout} 
              setShowHelpModal={setShowHelpModal} 
            />
          </div>

        </div>
      </div>

      <HelpModal 
        showHelpModal={showHelpModal}
        setShowHelpModal={setShowHelpModal}
        helpSubject={helpSubject}
        setHelpSubject={setHelpSubject}
        helpMessage={helpMessage}
        setHelpMessage={setHelpMessage}
        handleHelpSubmit={handleHelpSubmit}
        isSendingHelp={isSendingHelp}
      />
    </div>
  );
};

export default Dashboard;