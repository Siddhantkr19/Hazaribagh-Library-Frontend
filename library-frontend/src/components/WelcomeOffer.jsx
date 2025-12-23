import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext'; 
import api from '../services/api'; 

const WelcomeOffer = () => {
  const [isVisible, setIsVisible] = useState(true);
  const { user } = useAuth();
  const navigate = useNavigate();

  // --- 1. SMART ELIGIBILITY CHECK ---
  useEffect(() => {
    const checkEligibility = async () => {
      // Case A: User is Guest -> Always Show
      if (!user) {
        setIsVisible(true);
        return;
      }

      // Case B: User is Logged In -> Ask Backend
      try {
        const response = await api.get(`/bookings/check-eligibility?userEmail=${user.email}`);
        setIsVisible(response.data); 
      } catch (error) {
        console.error("Failed to check offer eligibility", error);
        setIsVisible(true);
      }
    };

    checkEligibility();
  }, [user]);

  // --- 2. HANDLERS ---
  const handleClaim = () => {
    if (!user) {
        navigate("/signup");
    } else {
        navigate("/"); 
    }
  };

  const handleClose = () => {
    setIsVisible(false);
  };

  if (!isVisible) return null;

  return (
    // ✅ FIX: Wrapper handles Light vs Dark transparency
    <div className="w-full max-w-sm mx-auto 
      bg-white dark:bg-gray-900/90 
      border border-gray-200 dark:border-white/10 
      backdrop-blur-xl rounded-2xl overflow-hidden shadow-2xl 
      transform transition-all hover:scale-[1.02] duration-500 
      animate-in fade-in slide-in-from-bottom-8 relative z-40">
      
      {/* --- HEADER --- */}
      <div className="bg-gradient-to-r from-yellow-400 to-orange-600 p-6 text-center relative overflow-hidden">
        
        {/* Close Button */}
        <button 
          onClick={handleClose}
          className="absolute top-3 right-3 z-20 p-1.5 rounded-full bg-black/10 text-white/80 hover:text-white hover:bg-black/30 transition-all backdrop-blur-sm"
          aria-label="Close offer"
        >
          <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
            <line x1="18" y1="6" x2="6" y2="18"></line>
            <line x1="6" y1="6" x2="18" y2="18"></line>
          </svg>
        </button>

        {/* Decorative Background Circle */}
        <div className="absolute top-0 left-0 w-full h-full bg-white/10 rotate-12 scale-150 transform origin-bottom-left pointer-events-none"></div>
        
        {/* Title */}
        <h2 className="text-3xl font-extrabold text-white relative z-10 drop-shadow-md">
          🎉 Student Exclusive!
        </h2>
        
        {/* Tagline Badge */}
        <div className="relative z-10 mt-3">
          <span className="inline-block bg-white/20 border border-white/40 backdrop-blur-md rounded-full px-4 py-1 text-white font-extrabold text-xs uppercase tracking-widest shadow-lg">
            Special Offer for New Students
          </span>
        </div>
      </div>

      {/* --- BODY: Dynamic Background --- */}
      {/* ✅ FIX: Light mode uses White bg with dark text */}
      <div className="p-6 bg-white dark:bg-gray-900 text-center relative">
        
        <p className="text-gray-600 dark:text-gray-300 text-sm mb-6 leading-relaxed font-medium">
          {user 
            ? `Hello ${user.name}! Use your one-time discount now:` 
            : "Welcome to LibHub! Create your account today to unlock exclusive rewards:"}
        </p>
        
        {/* The Reward Box */}
        {/* ✅ FIX: Light mode uses blue-tinted box, Dark mode uses dark-gray box */}
        <div className="bg-blue-50 dark:bg-gray-800 p-4 rounded-xl border-2 border-dashed border-blue-200 dark:border-gray-600 mb-6 shadow-inner relative group overflow-hidden">
           {/* Hover Effect */}
           <div className="absolute inset-0 bg-blue-500/5 group-hover:bg-blue-500/10 transition-colors duration-300"></div>
           
           {/* Text Colors */}
           <span className="text-2xl font-black text-gray-900 dark:text-white block drop-shadow-sm relative z-10 tracking-tight">
             4 DAYS FREE TRIAL
           </span>
           <span className="text-xs font-bold text-blue-600 dark:text-blue-400 uppercase tracking-wide relative z-10 mt-1 block">
             + Full Access to AC & WiFi
           </span>
        </div>

        {/* CTA Button */}
        <button 
          onClick={handleClaim}
          className="w-full py-3.5 px-6 bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-500 hover:to-indigo-500 text-white font-bold rounded-xl shadow-lg shadow-blue-600/20 transition-all transform hover:-translate-y-1 active:scale-95"
        >
          {user ? "Book Now & Save 🚀" : "Claim Offer 🚀"}
        </button>
        
        <p className="mt-4 text-[10px] text-gray-400 font-medium">
          *Valid for new Hazaribagh students only. Terms apply.
        </p>
      </div>
    </div>
  );
};

export default WelcomeOffer;