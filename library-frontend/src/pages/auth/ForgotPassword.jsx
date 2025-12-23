import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import api from '../../services/api';

const ForgotPassword = () => {
  const [email, setEmail] = useState('');
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState(null);
  const [error, setError] = useState(null);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setMessage(null);
    setError(null);

    try {
      // Call the Backend API we created
      const response = await api.post('/auth/forgot-password', { email });
      setMessage(response.data); // "Password reset link sent..."
    } catch (err) {
      setError(err.response?.data || "Failed to send email. Try again.");
    } finally {
      setLoading(false);
    }
  };

  return (
    // ✅ FIX: Dynamic Background (Light vs Dark)
    <div className="min-h-screen flex items-center justify-center bg-gray-50 dark:bg-gray-900 px-4 transition-colors duration-300 relative overflow-hidden">
      
      {/* Background Image (Dark Mode Only / Reduced Opacity in Light Mode) */}
      <div className="absolute inset-0 z-0 pointer-events-none">
         <img src="/Background Image.jpg" alt="bg" className="w-full h-full object-cover opacity-10 dark:opacity-40 transition-opacity duration-300" />
         <div className="absolute inset-0 bg-white/30 dark:bg-black/60 backdrop-blur-[2px]"></div>
      </div>

      {/* Card Container */}
      {/* ✅ FIX: Glassy White (Light) vs Glassy Dark (Dark) */}
      <div className="relative z-10 w-full max-w-md bg-white/80 dark:bg-white/10 backdrop-blur-xl border border-white/50 dark:border-white/10 p-8 rounded-3xl shadow-2xl animate-in fade-in zoom-in duration-500">
        
        <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-2 text-center">Reset Password</h2>
        <p className="text-gray-600 dark:text-gray-300 text-sm mb-6 text-center">
          Enter your email and we'll send you a link to reset your password.
        </p>

        {message && (
          <div className="mb-4 p-3 bg-green-100 dark:bg-green-500/20 border border-green-200 dark:border-green-500/50 rounded-lg text-green-700 dark:text-green-400 text-sm text-center font-medium">
            {message}
          </div>
        )}

        {error && (
          <div className="mb-4 p-3 bg-red-100 dark:bg-red-500/20 border border-red-200 dark:border-red-500/50 rounded-lg text-red-600 dark:text-red-400 text-sm text-center font-medium">
            {error}
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block text-gray-700 dark:text-gray-300 text-sm font-medium mb-1">Email Address</label>
            <input
              type="email"
              required
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              // ✅ FIX: Input Styling for Light/Dark
              className="w-full px-4 py-3 rounded-xl bg-white dark:bg-gray-800/50 border border-gray-300 dark:border-gray-600 text-gray-900 dark:text-white placeholder-gray-400 dark:placeholder-gray-500 focus:ring-2 focus:ring-orange-500 outline-none transition-all shadow-sm"
              placeholder="student@example.com"
            />
          </div>

          <button
            type="submit"
            disabled={loading}
            className={`w-full py-3 rounded-xl bg-orange-500 hover:bg-orange-600 text-white font-bold transition-all shadow-lg transform hover:-translate-y-0.5 ${loading ? 'opacity-50 cursor-not-allowed' : ''}`}
          >
            {loading ? "Sending..." : "Send Reset Link"}
          </button>
        </form>

        <div className="mt-6 text-center">
          <Link to="/login" className="text-gray-600 dark:text-gray-400 hover:text-orange-500 dark:hover:text-white text-sm transition-colors font-medium">
            &larr; Back to Login
          </Link>
        </div>
      </div>
    </div>
  );
};

export default ForgotPassword;