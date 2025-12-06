import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import FallingBackground from '../../components/FallingBackground';
import api from '../../services/api';
import { useAuth } from '../../context/AuthContext'; // Import Auth Context

const Login = () => {
  const navigate = useNavigate();
  const { login } = useAuth(); // Access login function from context

  // 1. STATE
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState(''); // Added password state (though backend might only check email for now)
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

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

    try {
      // Since you don't have a dedicated /login POST endpoint that returns a token yet,
      // we will simulate login by checking if the user profile exists via email.
      // Ideally, you should create a POST /api/auth/login endpoint in Java.
      
      const response = await api.get(`/profile?userEmail=${email}`);
      
      if (response.data) {
        // Success! User found.
        login(response.data); // Save user to global context
        alert(`Welcome back, ${response.data.name}!`);
        navigate('/dashboard'); // Redirect to Dashboard
      } else {
        setError("User not found. Please create an account.");
      }

    } catch (err) {
      console.error("Login Error:", err);
      setError("Invalid credentials or user does not exist.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div 
      id="login-overlay"
      onClick={handleOverlayClick}
      className="relative min-h-screen flex items-center justify-center overflow-hidden bg-gray-900 cursor-pointer"
    >
      
      {/* BACKGROUND */}
      <div className="absolute inset-0 z-0 pointer-events-none">
        <img src="/Background Image.jpg" alt="Library Background" className="w-full h-full object-cover opacity-50" />
        <div className="absolute inset-0 bg-black/60"></div>
      </div>
      <FallingBackground />

      {/* CARD */}
      <div 
        className="relative z-10 w-full max-w-md px-4 cursor-default"
        onClick={(e) => e.stopPropagation()} // Prevent close when clicking inside
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

          <form onSubmit={handleLogin} className="space-y-5">
            <div>
              <label className="block text-sm font-medium text-gray-300 mb-1.5">Email Address</label>
              <input 
                type="email" 
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
                className="w-full px-4 py-3 rounded-xl bg-gray-800/50 border border-gray-600 text-white placeholder-gray-500 focus:ring-2 focus:ring-orange-500 focus:border-transparent outline-none transition-all"
                placeholder="student@example.com"
              />
            </div>

            <div>
              <div className="flex justify-between items-center mb-1.5">
                <label className="block text-sm font-medium text-gray-300">Password</label>
                <a href="#" className="text-xs font-bold text-orange-400 hover:text-orange-300">Forgot?</a>
              </div>
              <input 
                type="password" 
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
                className="w-full px-4 py-3 rounded-xl bg-gray-800/50 border border-gray-600 text-white placeholder-gray-500 focus:ring-2 focus:ring-orange-500 focus:border-transparent outline-none transition-all"
                placeholder="••••••••"
              />
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

          <button className="w-full flex items-center justify-center gap-3 px-4 py-3 border border-gray-600 rounded-xl hover:bg-white/5 transition-all text-white font-medium text-sm">
            <img src="https://www.svgrepo.com/show/475656/google-color.svg" alt="Google" className="w-5 h-5" />
            Login with Google
          </button>

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