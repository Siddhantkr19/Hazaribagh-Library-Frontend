import React from 'react';
import { useNavigate, useOutletContext } from 'react-router-dom';
import { CheckCircle } from 'lucide-react';

const StepSuccess = () => {
  const { library } = useOutletContext();
  const navigate = useNavigate();

  return (
    <div className="animate-in zoom-in duration-500 text-center h-full flex flex-col justify-center">
        <div className="w-20 h-20 bg-green-500/20 rounded-full flex items-center justify-center mx-auto mb-6 ring-4 ring-green-500/10">
            <CheckCircle className="w-10 h-10 text-green-500" />
        </div>
        
        <h2 className="text-3xl font-bold text-white mb-2">You're In!</h2>
        <p className="text-gray-400 mb-8">
            Your seat at <strong className="text-white">{library.name}</strong> has been confirmed.
        </p>

        <div className="bg-gradient-to-r from-green-100 to-emerald-100 dark:bg-gray-800 rounded-xl p-4 border border-green-300 dark:border-dashed dark:border-gray-600 mb-8 shadow-sm">
            <p className="text-xs text-gray-500 uppercase tracking-widest mb-1">Status</p>
            <p className="text-green-400 font-bold">Active & Paid</p>
        </div>

        <button 
            onClick={() => navigate('/dashboard')} 
            className="w-full py-3 bg-blue-600 text-white font-bold rounded-xl hover:bg-blue-700 transition-all shadow-lg shadow-blue-500/20"
        >
            Go to Dashboard
        </button>
    </div>
  );
};

export default StepSuccess;