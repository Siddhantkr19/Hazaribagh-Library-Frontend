import React, { useState, useEffect } from 'react';
import { useNavigate, useOutletContext } from 'react-router-dom';
import { User, Loader2, ArrowRight } from 'lucide-react';
import { checkUserByEmail } from '../../services/bookingApi';
import { useAuth } from '../../context/AuthContext';

const StepEmail = () => {
  const { library } = useOutletContext(); // Get data from Layout
  const navigate = useNavigate();
  const { user } = useAuth(); // Check if already logged in

  const [emailInput, setEmailInput] = useState('');
  const [isChecking, setIsChecking] = useState(false);

  // If user is already logged in, skip this step
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

        // Logic: If user exists -> Login. If new -> Signup.
        // We pass the "returnUrl" so they come back to the payment page after login.
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
    <div className="animate-in slide-in-from-right-4 fade-in duration-300">
        
        {/* Progress Bar */}
        <div className="flex items-center gap-3 mb-8">
            <div className="h-1 flex-1 rounded-full bg-blue-500"></div>
            <div className="h-1 flex-1 rounded-full bg-gray-700"></div>
        </div>

        <h2 className="text-2xl font-bold text-white mb-2">Let's get started</h2>
        <p className="text-gray-400 mb-8 text-sm">Enter your email to secure your seat at {library.name}.</p>

        <form onSubmit={handleEmailCheck} className="space-y-4">
            <div className="space-y-1">
                <label className="text-xs font-bold text-gray-500 uppercase tracking-wider">Email Address</label>
                <div className="relative">
                    <User className="absolute left-4 top-1/2 transform -translate-y-1/2 text-gray-500 w-5 h-5" />
                    <input 
                        type="email" 
                        required
                        placeholder="student@example.com"
                        value={emailInput}
                        onChange={(e) => setEmailInput(e.target.value)}
                        className="w-full pl-12 pr-4 py-4 bg-gray-800 border border-gray-700 rounded-xl text-white focus:ring-2 focus:ring-blue-500 outline-none transition-all"
                    />
                </div>
            </div>

            <button 
                type="submit" 
                disabled={isChecking}
                className="w-full py-4 bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-500 hover:to-indigo-500 text-white font-bold rounded-xl transition-all shadow-lg flex items-center justify-center gap-2"
            >
                {isChecking ? <Loader2 className="animate-spin w-5 h-5" /> : <>Continue <ArrowRight className="w-5 h-5" /></>}
            </button>
        </form>
    </div>
  );
};

export default StepEmail;