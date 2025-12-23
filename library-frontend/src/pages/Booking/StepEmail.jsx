import React, { useState, useEffect } from 'react';
import { useNavigate, useOutletContext } from 'react-router-dom';
import { User, Loader2, ArrowRight, Mail } from 'lucide-react';
import { checkUserByEmail } from '../../services/bookingApi';
import { useAuth } from '../../context/AuthContext';

const StepEmail = () => {
  const { library } = useOutletContext();
  const navigate = useNavigate();
  const { user } = useAuth();

  const [emailInput, setEmailInput] = useState('');
  const [isChecking, setIsChecking] = useState(false);

  useEffect(() => {
    if (user) {
        navigate(`/book/${library.id}/payment`, { replace: true });
    }
  }, [user, navigate, library.id]);

  const handleEmailCheck = async (e) => {
    e.preventDefault();
    if(!emailInput) return;

    setIsChecking(true);
    try {
        const exists = await checkUserByEmail(emailInput);
        setIsChecking(false);

        // LOGIC: If user exists -> Login. If false -> Signup.
        const nextPath = exists ? '/login' : '/signup';
        
        navigate(nextPath, { 
            state: { 
                email: emailInput, 
                returnUrl: `/book/${library.id}/payment` 
            } 
        });

    } catch (error) {
        console.warn("Check failed", error);
        navigate('/login', { state: { returnUrl: `/book/${library.id}/payment` } });
    }
  };

  return (
    <div className="animate-in slide-in-from-right-8 fade-in duration-500">
        
        {/* Progress Dots */}
        <div className="flex gap-2 mb-8">
            <div className="w-8 h-1.5 rounded-full bg-blue-600 shadow-[0_0_10px_rgba(59,130,246,0.5)]"></div>
            {/* ✅ FIX: Inactive Dot Color (Gray vs White/10) */}
            <div className="w-8 h-1.5 rounded-full bg-gray-200 dark:bg-white/10"></div>
        </div>

        {/* ✅ FIX: Text Colors (Dark vs Light) */}
        <h2 className="text-3xl font-bold text-gray-900 dark:text-white mb-3">Your Details</h2>
        <p className="text-gray-600 dark:text-gray-400 mb-8 text-sm leading-relaxed">
            Enter your email to check availability and lock your seat at <span className="text-blue-600 dark:text-blue-400 font-semibold">{library.name}</span>.
        </p>

        <form onSubmit={handleEmailCheck} className="space-y-6">
            <div className="space-y-2">
                {/* ✅ FIX: Label Color */}
                <label className="text-xs font-bold text-gray-700 dark:text-gray-500 uppercase tracking-wider ml-1">Email Address</label>
                <div className="relative group">
                    <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
                        {/* ✅ FIX: Icon Color */}
                        <Mail className="h-5 w-5 text-gray-400 dark:text-gray-500 group-focus-within:text-blue-500 transition-colors" />
                    </div>
                    {/* ✅ FIX: Input Backgrounds & Borders */}
                    <input 
                        type="email" 
                        required
                        placeholder="student@example.com"
                        value={emailInput}
                        onChange={(e) => setEmailInput(e.target.value)}
                        className="w-full pl-11 pr-4 py-4 bg-gray-50 dark:bg-black/20 border border-gray-200 dark:border-white/10 rounded-xl text-gray-900 dark:text-white placeholder-gray-400 dark:placeholder-gray-600 focus:border-blue-500 focus:bg-white dark:focus:bg-blue-900/10 focus:ring-1 focus:ring-blue-500 outline-none transition-all"
                    />
                </div>
            </div>

            <button 
                type="submit" 
                disabled={isChecking}
                className="w-full py-4 bg-blue-600 hover:bg-blue-700 text-white font-bold rounded-xl transition-all shadow-lg shadow-blue-600/20 flex items-center justify-center gap-2 group"
            >
                {isChecking ? (
                    <Loader2 className="animate-spin w-5 h-5" />
                ) : (
                    <>
                        Continue <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
                    </>
                )}
            </button>
        </form>
    </div>
  );
};

export default StepEmail;