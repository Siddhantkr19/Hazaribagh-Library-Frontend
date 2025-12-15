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
    <div className="min-h-screen flex items-center justify-center bg-gray-900 px-4">
      {/* Background Image (Optional) */}
      <div className="absolute inset-0 z-0 pointer-events-none">
         <img src="/Background Image.jpg" alt="bg" className="w-full h-full object-cover opacity-30" />
         <div className="absolute inset-0 bg-black/70"></div>
      </div>

      <div className="relative z-10 w-full max-w-md bg-white/10 backdrop-blur-md border border-white/20 p-8 rounded-2xl shadow-2xl">
        <h2 className="text-2xl font-bold text-white mb-2 text-center">Reset Password</h2>
        <p className="text-gray-400 text-sm mb-6 text-center">
          Enter your email and we'll send you a link to reset your password.
        </p>

        {message && (
          <div className="mb-4 p-3 bg-green-500/20 border border-green-500/50 rounded-lg text-green-400 text-sm text-center">
            {message}
          </div>
        )}

        {error && (
          <div className="mb-4 p-3 bg-red-500/20 border border-red-500/50 rounded-lg text-red-400 text-sm text-center">
            {error}
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block text-gray-300 text-sm font-medium mb-1">Email Address</label>
            <input
              type="email"
              required
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="w-full px-4 py-3 rounded-xl bg-gray-800/50 border border-gray-600 text-white focus:ring-2 focus:ring-orange-500 outline-none"
              placeholder="student@example.com"
            />
          </div>

          <button
            type="submit"
            disabled={loading}
            className={`w-full py-3 rounded-xl bg-orange-500 hover:bg-orange-600 text-white font-bold transition-all ${loading ? 'opacity-50 cursor-not-allowed' : ''}`}
          >
            {loading ? "Sending..." : "Send Reset Link"}
          </button>
        </form>

        <div className="mt-6 text-center">
          <Link to="/login" className="text-gray-400 hover:text-white text-sm">
            &larr; Back to Login
          </Link>
        </div>
      </div>
    </div>
  );
};

export default ForgotPassword;