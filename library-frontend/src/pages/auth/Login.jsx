import React, { useState , useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext'; 
import api from '../../services/api';

const Login = () => {
  const navigate = useNavigate();
  const { login , user } = useAuth(); 

useEffect(() => {
    if (user) {
     
      if (user.role === 'ADMIN' || user.role === 'Admin') {
        navigate('/admin');
      } else {
        navigate('/dashboard');
      }
    }
  }, [user, navigate]);

  // 1. STATE
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
const [successMessage, setSuccessMessage] = useState('');
const [showPassword, setShowPassword] = useState(false);
  // 2. CLOSE HANDLER (Click outside)
  const handleOverlayClick = (e) => {
    if (e.target.id === 'login-overlay') {
      navigate('/');
    }
  };

 // 3. LOGIN HANDLER
  const handleLogin = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError(null);
    setSuccessMessage('');

    try {
      const response = await api.post('/auth/login', { 
          email: email, 
          password: password 
      });
      
      if (response.data) {
        setSuccessMessage("Login Successful! Redirecting...");
        login(response.data); 
      
        setTimeout(() => {
          
          const userRole = response.data.role; 
          
          if (userRole === 'ADMIN' || userRole === 'Admin') {
            navigate('/admin'); 
          } else {
            navigate('/dashboard'); 
          }
        }, 1000);
        // -------------------------------
      } 

    } catch (err) {
      console.error("Login Error:", err);
      if (err.response && err.response.status === 403) {
          setError("Invalid password or email.");
      } else {
          setError("Login failed. Please try again.");
      }
      setLoading(false);
    }
  };

  return (
    <div 
      id="login-overlay"
      onClick={handleOverlayClick}
      className="relative min-h-screen flex items-center justify-center overflow-hidden bg-gradient-to-br from-blue-100 via-purple-50 to-white dark:bg-gray-900 cursor-pointer transition-colors duration-300"
    >
      
      {/* BACKGROUND */}
      <div className="absolute inset-0 z-0 pointer-events-none">
        <img src="/Background Image.jpg" alt="Library Background" className="w-full h-full object-cover opacity-50" />
        <div className="absolute inset-0 bg-black/60"></div>
      </div>
     

      {/* CARD */}
      <div 
        className="relative z-10 w-full max-w-md px-4 cursor-default"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="bg-white/10 backdrop-blur-lg border border-white/20 rounded-3xl shadow-2xl p-8 sm:p-10 animate-in fade-in zoom-in duration-500">
          
          <div className="text-center mb-8">
            <h1 className="text-3xl font-extrabold text-white mb-2">Welcome Back!</h1>
            <p className="text-gray-300 text-sm">Login to continue your study journey.</p>
          </div>

          {/* Error Message */}
          {error && (
            <div className="mb-4 p-3 bg-red-500/20 border border-red-500/50 rounded-lg text-red-200 text-xs text-center">
              {error}
            </div>
          )}
        {successMessage && (
            <div className="mb-4 p-3 bg-green-500/20 border border-green-500/50 rounded-lg text-green-500 text-md text-center font-bold animate-pulse">
              {successMessage}
            </div>
          )}
          <form onSubmit={handleLogin} className="space-y-5">
            <div>
              <label className="block text-sm font-medium text-gray-300 mb-1.5">Email Address</label>
              <input 
                type="email" 
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
                className="w-full px-4 py-3 rounded-xl bg-white dark:bg-gray-800/50 border border-blue-300 dark:border-gray-600 text-gray-800 dark:text-white placeholder-gray-500 dark:placeholder-gray-500 focus:ring-2 focus:ring-orange-500 focus:border-transparent outline-none transition-all shadow-sm"
                placeholder="student@example.com"
              />
            </div>

           <div className="relative">
                <input 
                  // --- CHANGE: Dynamic Type ---
                  type={showPassword ? "text" : "password"} 
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  required
                  className="w-full px-4 py-3 rounded-xl bg-white dark:bg-gray-800/50 border border-blue-300 dark:border-gray-600 text-gray-800 dark:text-white placeholder-gray-500 dark:placeholder-gray-500 focus:ring-2 focus:ring-orange-500 focus:border-transparent outline-none transition-all pr-10 shadow-sm"
                  placeholder="••••••••"
                />
                
                {/* --- CHANGE: Eye Icon Button --- */}
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-white transition-colors focus:outline-none"
                >
                  {showPassword ? (
                    // Eye Off Icon (Hide)
                    <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                      <path d="M17.94 17.94A10.07 10.07 0 0 1 12 20c-7 0-11-8-11-8a18.45 18.45 0 0 1 5.06-5.94M9.9 4.24A9.12 9.12 0 0 1 12 4c7 0 11 8 11 8a18.5 18.5 0 0 1-2.16 3.19m-6.72-1.07a3 3 0 1 1-4.24-4.24"></path>
                      <line x1="1" y1="1" x2="23" y2="23"></line>
                    </svg>
                  ) : (
                    // Eye Icon (Show)
                    <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                      <path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z"></path>
                      <circle cx="12" cy="12" r="3"></circle>
                    </svg>
                  )}
                </button>
              </div>
            
<div className="flex justify-end mt-2">
    <Link 
      to="/forgot-password" 
      className="text-sm text-orange-400 hover:text-orange-300 hover:underline transition-colors"
    >
      Forgot Password?
    </Link>
</div>

            <button 
              disabled={loading}
              className={`w-full py-3.5 rounded-xl bg-gradient-to-r from-orange-500 to-red-500 hover:from-orange-600 hover:to-red-600 text-white font-bold text-lg shadow-lg transform transition hover:-translate-y-0.5 ${loading ? 'opacity-50 cursor-not-allowed' : ''}`}
            >
              {loading ? "Checking..." : "Sign In"}
            </button>
          </form>

          <div className="relative my-6">
            <div className="absolute inset-0 flex items-center"><div className="w-full border-t border-gray-600"></div></div>
            <div className="relative flex justify-center text-xs uppercase"><span className="px-2 bg-transparent text-gray-400">Or continue with</span></div>
          </div>

         <a 
  href="http://localhost:8080/oauth2/authorization/google"
  className="w-full flex items-center justify-center gap-3 px-4 py-3 border border-gray-600 rounded-xl hover:bg-white/5 transition-all text-white font-medium text-sm"
>
  <img src="https://www.svgrepo.com/show/475656/google-color.svg" alt="Google" className="w-5 h-5" />
  Login with Google
</a>

          <p className="mt-8 text-center text-sm text-gray-400">
            Don't have an account?{' '}
            <Link to="/signup" className="font-bold text-orange-400 hover:text-orange-300 transition-colors">
              Create Account
            </Link>
          </p>

        </div>
      </div>
    </div>
  );
};

export default Login;