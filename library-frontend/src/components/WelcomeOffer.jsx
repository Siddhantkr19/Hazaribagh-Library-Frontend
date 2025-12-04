import React, { useState, useEffect } from 'react';

const WelcomeOffer = () => {
  const [showOffer, setShowOffer] = useState(false);

  useEffect(() => {
    // Check if the user has already claimed the offer in local storage
    const hasSeenOffer = localStorage.getItem('hasSeenWelcomeOffer');
    
    if (!hasSeenOffer) {
      // If not, show the offer after a small delay (e.g., 1 second)
      const timer = setTimeout(() => {
        setShowOffer(true);
      }, 1000);
      return () => clearTimeout(timer);
    }
  }, []);

  const handleClaim = () => {
    // Save that the user has seen the offer so it doesn't appear again
    localStorage.setItem('hasSeenWelcomeOffer', 'true');
    setShowOffer(false);
    // Add logic here to actually apply the discount/offer to their account
    alert("Offer Claimed! Check your dashboard.");
  };

  const handleClose = () => {
    // Optionally save it even if they close it, or let it show again next time
    localStorage.setItem('hasSeenWelcomeOffer', 'true');
    setShowOffer(false);
  };

  if (!showOffer) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/70 backdrop-blur-sm p-4 animate-in fade-in duration-300">
      <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-2xl max-w-md w-full overflow-hidden border border-yellow-500/30 transform scale-100 transition-all">
        
        {/* Header with decorative background */}
        <div className="bg-gradient-to-r from-yellow-400 to-orange-500 p-6 text-center relative overflow-hidden">
          <div className="absolute top-0 left-0 w-full h-full bg-white/10 rotate-12 scale-150 transform origin-bottom-left"></div>
          <h2 className="text-3xl font-extrabold text-white relative z-10 drop-shadow-md">
            🎉 Student Exclusive!
          </h2>
          <p className="text-yellow-50 font-medium mt-1 relative z-10">
            First-time Login Special
          </p>
        </div>

        {/* Content */}
        <div className="p-6 text-center">
          <p className="text-gray-600 dark:text-gray-300 text-lg mb-6">
            Welcome to the platform! Since this is your first time here, you've unlocked a special reward:
          </p>
          
          <div className="bg-gray-100 dark:bg-gray-700 p-4 rounded-xl border border-dashed border-gray-400 mb-6">
            <span className="text-2xl font-bold text-gray-800 dark:text-white block">
              FREE EVENT PASS
            </span>
            <span className="text-sm text-gray-500 dark:text-gray-400">
              + Premium Notes Access
            </span>
          </div>

          <button 
            onClick={handleClaim}
            className="w-full py-3 px-6 bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700 text-white text-lg font-bold rounded-xl shadow-lg transform transition hover:-translate-y-1 hover:shadow-xl"
          >
            Claim My Offer 🚀
          </button>
          
          <button 
            onClick={handleClose}
            className="mt-4 text-sm text-gray-400 hover:text-gray-600 dark:hover:text-gray-200 underline"
          >
            No thanks, I'll pass
          </button>
        </div>
      </div>
    </div>
  );
};

export default WelcomeOffer;