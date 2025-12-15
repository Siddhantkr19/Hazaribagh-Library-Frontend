import React, { useState , useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';

import api from '../../services/api';

const Signup = () => {
  const navigate = useNavigate();
 const { user } = useAuth();
  // --- [FIX] AUTO-REDIRECT ---
  useEffect(() => {
    if (user) {
      navigate('/dashboard');
    }
  }, [user, navigate]);
  //
  
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    phone: '',
    password: '',
    confirmPassword: ''
  });

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [success, setSuccess] = useState(false); 
const [showPassword, setShowPassword] = useState(false);
  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
    if (error) setError(null);
  };

  // Handler to close the modal when clicking outside
  const handleOverlayClick = (e) => {
    if (e.target.id === 'auth-overlay') {
      navigate('/');
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (formData.password !== formData.confirmPassword) {
      setError("Passwords do not match!");
      return;
    }

    setLoading(true);
    setError(null);

    try {
      const payload = {
        name: formData.name,
        email: formData.email,
        password: formData.password,
        phoneNumber: formData.phone,
        role: "Student",
        profilePicture: null
      };

      await api.post('/auth/register', payload);
      setSuccess(true); // Show success message instead of redirecting immediately

    } catch (err) {
      console.error("Signup Error:", err);
      setError(err.response?.data?.message || "Registration failed. Try again.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div 
      id="auth-overlay" // ID for detecting clicks
      onClick={handleOverlayClick}
      className="relative min-h-screen flex items-center justify-center overflow-hidden bg-gray-900 py-10 cursor-pointer" // Add cursor-pointer to indicate clickable background
    >
      
      {/* BACKGROUND */}
      <div className="absolute inset-0 z-0 pointer-events-none">
        <img src="/Background Image.jpg" alt="Library Background" className="w-full h-full object-cover opacity-50" />
        <div className="absolute inset-0 bg-black/60"></div>
      </div>
   
      {/* CARD - Stop propagation to prevent closing when clicking inside */}
      <div 
        className="relative z-10 w-full max-w-lg px-4 cursor-default"
        onClick={(e) => e.stopPropagation()} 
      >
        <div className="bg-white/10 backdrop-blur-lg border border-white/20 rounded-3xl shadow-2xl p-8 animate-in fade-in slide-in-from-bottom-8 duration-500">
          
          {success ? (
            // Success Message View
            <div className="text-center py-10">
              <div className="mx-auto flex items-center justify-center h-16 w-16 rounded-full bg-green-100 mb-6">
                <svg className="h-8 w-8 text-green-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 13l4 4L19 7" />
                </svg>
              </div>
              <h2 className="text-3xl font-extrabold text-white mb-4">Account Created!</h2>
              <p className="text-gray-300 mb-8">Your account has been successfully created. You can now log in to start booking.</p>
              <Link 
                to="/login" 
                className="inline-block w-full py-3.5 rounded-xl bg-green-600 hover:bg-green-700 text-white font-bold text-lg shadow-lg transition-all transform hover:-translate-y-0.5"
              >
                Go to Login
              </Link>
            </div>
          ) : (
            // Signup Form View
            <>
              <div className="text-center mb-6">
                <h1 className="text-3xl font-extrabold text-orange-400 mb-2">Create Account</h1>
                <p className="text-gray-300 text-sm">Join LibHub and start booking your seat.</p>
              </div>

              {error && (
                <div className="mb-4 p-3 bg-red-500/20 border border-red-500/50 rounded-lg text-red-200 text-xs text-center">
                  {error}
                </div>
              )}

              <form onSubmit={handleSubmit} className="space-y-4">
                
                {/* Full Name */}
                <div>
                  <label className="block text-xs font-medium text-gray-300 mb-1">Full Name</label>
                  <input 
                    name="name"
                    value={formData.name}
                    onChange={handleChange}
                    type="text" 
                    required
                    className="w-full px-4 py-3 rounded-lg bg-gray-800/50 border border-gray-600 text-white focus:ring-2 focus:ring-blue-500 outline-none" 
                    placeholder="Rahul Kumar" 
                  />
                </div>

                {/* Email & Phone Grid */}
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-xs font-medium text-gray-300 mb-1">Email</label>
                    <input 
                      name="email"
                      value={formData.email}
                      onChange={handleChange}
                      type="email" 
                      required
                      className="w-full px-4 py-3 rounded-lg bg-gray-800/50 border border-gray-600 text-white focus:ring-2 focus:ring-blue-500 outline-none" 
                      placeholder="rahul@gmail.com" 
                    />
                  </div>
                  <div>
                    <label className="block text-xs font-medium text-gray-300 mb-1">Phone Number</label>
                    <input 
                      name="phone"
                      value={formData.phone}
                      onChange={handleChange}
                      type="tel" 
                      // required
                      className="w-full px-4 py-3 rounded-lg bg-gray-800/50 border border-gray-600 text-white focus:ring-2 focus:ring-blue-500 outline-none" 
                      placeholder="9988776655" 
                    />
                  </div>
                </div>

                {/* Password */}
              {/* Password Field (Eye Logic) */}
                <div className="relative">
                  <label className="block text-xs font-medium text-gray-300 mb-1">Password</label>
                  <div className="relative">
                    <input name="password" value={formData.password} onChange={handleChange} type={showPassword ? "text" : "password"} required className="w-full px-4 py-3 rounded-lg bg-gray-800/50 border border-gray-600 text-white focus:ring-2 focus:ring-blue-500 outline-none pr-10" placeholder="Create strong password" />
                    <button type="button" onClick={() => setShowPassword(!showPassword)} className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-white focus:outline-none">
                      {showPassword ? (
                        <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M17.94 17.94A10.07 10.07 0 0 1 12 20c-7 0-11-8-11-8a18.45 18.45 0 0 1 5.06-5.94M9.9 4.24A9.12 9.12 0 0 1 12 4c7 0 11 8 11 8a18.5 18.5 0 0 1-2.16 3.19m-6.72-1.07a3 3 0 1 1-4.24-4.24"></path><line x1="1" y1="1" x2="23" y2="23"></line></svg>
                      ) : (
                        <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z"></path><circle cx="12" cy="12" r="3"></circle></svg>
                      )}
                    </button>
                  </div>
                </div>

                {/* Confirm Password Field (Eye Logic) */}
                <div className="relative">
                  <label className="block text-xs font-medium text-gray-300 mb-1">Confirm Password</label>
                  <div className="relative">
                    <input name="confirmPassword" value={formData.confirmPassword} onChange={handleChange} type={showPassword? "text" : "password"} required className="w-full px-4 py-3 rounded-lg bg-gray-800/50 border border-gray-600 text-white focus:ring-2 focus:ring-blue-500 outline-none pr-10" placeholder="Repeat password" />
                    <button type="button" onClick={() => setShowPassword(!showPassword)} className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-white focus:outline-none">
                      {showPassword ? (
                        <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M17.94 17.94A10.07 10.07 0 0 1 12 20c-7 0-11-8-11-8a18.45 18.45 0 0 1 5.06-5.94M9.9 4.24A9.12 9.12 0 0 1 12 4c7 0 11 8 11 8a18.5 18.5 0 0 1-2.16 3.19m-6.72-1.07a3 3 0 1 1-4.24-4.24"></path><line x1="1" y1="1" x2="23" y2="23"></line></svg>
                      ) : (
                        <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z"></path><circle cx="12" cy="12" r="3"></circle></svg>
                      )}
                    </button>
                  </div>
                </div>

                <button 
                  disabled={loading}
                  className={`w-full py-3.5 mt-2 rounded-xl bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-500 hover:to-indigo-500 text-white font-bold text-lg shadow-lg transform transition hover:-translate-y-0.5 ${loading ? 'opacity-50 cursor-not-allowed' : ''}`}
                >
                  {loading ? "Creating Account..." : "Sign Up"}
                </button>
              </form>

              {/* Social Login Section */}
              <div className="relative my-6">
                <div className="absolute inset-0 flex items-center"><div className="w-full border-t border-gray-600"></div></div>
                <div className="relative flex justify-center text-xs uppercase"><span className="px-2 bg-transparent text-gray-400">Or</span></div>
              </div>

            {/* // ✅ NEW CODE (Link to Backend) */}
<a 
  href="http://localhost:8080/oauth2/authorization/google"
  className="w-full flex items-center justify-center gap-3 px-4 py-3 border border-gray-600 rounded-xl hover:bg-white/5 transition-all text-white font-medium text-sm"
>
  <img src="https://www.svgrepo.com/show/475656/google-color.svg" alt="Google" className="w-5 h-5" />
  Sign up with Google
</a>

              <p className="mt-6 text-center text-sm text-gray-400">
                Already have an account?{' '}
                <Link to="/login" className="font-bold text-blue-400 hover:text-blue-300 transition-colors">
                  Login here
                </Link>
              </p>
            </>
          )}
        </div>
      </div>
    </div>
  );
};

export default Signup;