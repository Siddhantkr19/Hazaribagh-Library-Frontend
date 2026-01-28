import React from 'react';

const Loading = () => {
  return (
    <div className="flex flex-col items-center justify-center min-h-screen bg-gray-50 dark:bg-gray-900 z-50">
      <div className="relative">
        {/* Outer Ring */}
        <div className="w-16 h-16 rounded-full border-4 border-gray-200 dark:border-gray-700"></div>
        {/* Spinning Inner Ring */}
        <div className="absolute top-0 left-0 w-16 h-16 rounded-full border-4 border-orange-500 border-t-transparent animate-spin"></div>
      </div>
      <p className="mt-4 text-gray-600 dark:text-gray-400 font-medium animate-pulse">
        Loading your dashboard...
      </p>
    </div>
  );
};

export default Loading;