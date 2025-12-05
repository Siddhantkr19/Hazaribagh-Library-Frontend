import React, { useState } from 'react'; // <--- 1. Import useState

const WelcomeOffer = () => {
  // <--- 2. Add state to control visibility
  const [isVisible, setIsVisible] = useState(true);

  const handleClaim = () => {
    alert("Redirecting to Signup...");
  };

  // <--- 3. Add close handler
  const handleClose = () => {
    setIsVisible(false);
  };

  // <--- 4. If not visible, don't render anything
  if (!isVisible) {
    return null;
  }

  return (
    // Added 'relative' class to container to ensure button positioning is correct within card
    <div className="w-full max-w-sm mx-auto bg-white/10 backdrop-blur-md border border-white/20 rounded-2xl overflow-hidden shadow-2xl transform transition-all hover:scale-[1.02] duration-300 relative">
      
      {/* Header with decorative background */}
      <div className="bg-gradient-to-r from-yellow-400 to-orange-500 p-6 text-center relative overflow-hidden">
        
        {/* --- NEW: CLOSE BUTTON (Cross Icon) --- */}
        <button 
          onClick={handleClose}
          className="absolute top-3 right-3 z-20 p-1 rounded-full bg-black/10 text-white/70 hover:text-white hover:bg-black/20 transition-all backdrop-blur-sm"
          aria-label="Close offer"
        >
          <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
            <line x1="18" y1="6" x2="6" y2="18"></line>
            <line x1="6" y1="6" x2="18" y2="18"></line>
          </svg>
        </button>
        {/* -------------------------------------- */}

        {/* Decorative Circle */}
        <div className="absolute top-0 left-0 w-full h-full bg-white/10 rotate-12 scale-150 transform origin-bottom-left"></div>
        
        <h2 className="text-3xl font-extrabold text-white relative z-10 drop-shadow-md">
          🎉 Student Exclusive!
        </h2>
        
        {/* Bold & Light Color Tag for First User */}
        <div className="relative z-10 mt-3">
          <span className="inline-block bg-white/20 border border-white/40 backdrop-blur-sm rounded-full px-4 py-1 text-white font-extrabold text-xs uppercase tracking-widest shadow-sm">
            Special Offer for New Students
          </span>
        </div>

      </div>

      {/* Content */}
      <div className="p-6 bg-gray-900/80 text-center">
        <p className="text-gray-200 text-sm mb-6 leading-relaxed font-medium">
          Welcome to LibHub! Create your account today to unlock your exclusive rewards:
        </p>
        
        {/* The Reward Box */}
        <div className="bg-gradient-to-b from-gray-800 to-gray-900 p-4 rounded-xl border border-dashed border-gray-600 mb-6 shadow-inner relative group">
           <div className="absolute inset-0 bg-blue-500/5 rounded-xl group-hover:bg-blue-500/10 transition-colors"></div>
           
           <span className="text-2xl font-black text-white block drop-shadow-lg relative z-10">
             4 DAYS FREE TRAIL
           </span>
           <span className="text-xs font-bold text-blue-300 uppercase tracking-wide relative z-10">
             + With All Facilities
           </span>
        </div>

        <button 
          onClick={handleClaim}
          className="w-full py-3.5 px-6 bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-500 hover:to-indigo-500 text-white font-bold rounded-xl shadow-lg shadow-blue-600/40 transition-all transform hover:-translate-y-1"
        >
          Claim  Offer 🚀
        </button>
        
        <p className="mt-4 text-[10px] text-gray-400 font-medium">
          *Valid for new Hazaribagh students only.
        </p>
      </div>
    </div>
  );
};

export default WelcomeOffer;