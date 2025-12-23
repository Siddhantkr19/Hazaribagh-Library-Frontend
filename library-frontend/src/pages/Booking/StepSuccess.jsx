import React from 'react';
import { useNavigate, useOutletContext } from 'react-router-dom';
import { Check, Home, ArrowRight } from 'lucide-react';

const StepSuccess = () => {
  const { library } = useOutletContext();
  const navigate = useNavigate();

  return (
    <div className="animate-in zoom-in fade-in duration-500 text-center flex flex-col justify-center h-full">
        
        {/* Success Icon Animation */}
        <div className="relative mx-auto mb-8">
            <div className="absolute inset-0 bg-green-500 blur-[40px] opacity-20 rounded-full"></div>
            <div className="w-24 h-24 bg-gradient-to-br from-green-500 to-emerald-600 rounded-full flex items-center justify-center relative shadow-2xl shadow-green-500/30">
                <Check className="w-12 h-12 text-white stroke-[3]" />
            </div>
        </div>
        
        {/* ✅ FIX: Text Colors */}
        <h2 className="text-4xl font-bold text-gray-900 dark:text-white mb-3">Booking Confirmed!</h2>
        <p className="text-gray-600 dark:text-gray-400 mb-8 text-lg">
            You have successfully booked a seat at <br/>
            <strong className="text-blue-600 dark:text-white">{library.name}</strong>
        </p>

        {/* Ticket Stub Visual */}
        {/* ✅ FIX: Ticket Background (White vs Dark Glass) */}
        <div className="bg-gray-50 dark:bg-white/5 border border-gray-200 dark:border-white/10 rounded-2xl p-6 mb-8 text-left relative overflow-hidden group shadow-sm">
            <div className="absolute top-0 right-0 w-20 h-20 bg-blue-500/10 rounded-bl-full"></div>
            
            <p className="text-xs text-gray-500 uppercase tracking-widest mb-1">Status</p>
            <div className="flex items-center gap-2 mb-4">
                <div className="w-2 h-2 rounded-full bg-green-500 animate-pulse"></div>
                <span className="text-green-600 dark:text-green-400 font-bold">Active Subscription</span>
            </div>
            
            {/* ✅ FIX: Dashed Line Color */}
            <div className="h-px bg-gray-200 dark:bg-white/10 mb-4 border-dashed border-b border-gray-300 dark:border-white/20"></div>
            
            <div className="flex justify-between items-center text-sm">
                <span className="text-gray-500 dark:text-gray-400">Library ID</span>
                <span className="font-mono text-gray-900 dark:text-white font-bold">#{library.id}</span>
            </div>
        </div>

        {/* Action Buttons */}
        <div className="flex flex-col gap-3">
            <button 
                onClick={() => navigate('/dashboard')} 
                className="w-full py-4 bg-blue-600 hover:bg-blue-700 text-white font-bold rounded-xl transition-all shadow-lg shadow-blue-600/20 flex items-center justify-center gap-2"
            >
                Go to Dashboard <Home className="w-5 h-5" />
            </button>
            
            <button 
                onClick={() => navigate('/')} 
                className="w-full py-4 bg-transparent hover:bg-gray-100 dark:hover:bg-white/5 text-gray-600 dark:text-gray-300 font-bold rounded-xl transition-all flex items-center justify-center gap-2"
            >
                Back to Home <ArrowRight className="w-4 h-4" />
            </button>
        </div>
    </div>
  );
};

export default StepSuccess;