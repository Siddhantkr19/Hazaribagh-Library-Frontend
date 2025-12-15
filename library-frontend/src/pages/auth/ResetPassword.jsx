import React, { useState, useEffect } from 'react';
import { useSearchParams, useNavigate } from 'react-router-dom';
import api from '../../services/api';

const ResetPassword = () => {
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();
  
  // Get Token from URL (e.g., ?token=xyz)
  const token = searchParams.get('token');

  const [newPassword, setNewPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState(null);
  const [error, setError] = useState(null);

  // Optional: Verify token immediately on load
  useEffect(() => {
    if (!token) {
        setError("Invalid link. No token found.");
    }
  }, [token]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (newPassword !== confirmPassword) {
      setError("Passwords do not match!");
      return;
    }

    setLoading(true);
    setError(null);
    setMessage(null);

    try {
      // Call Backend API to reset
      const response = await api.post('/auth/reset-password', {
        token: token,
        newPassword: newPassword
      });

      setMessage("Password changed successfully! Redirecting to login...");
      
      // Redirect after 2 seconds
      setTimeout(() => navigate('/login'), 2000);

    } catch (err) {
      setError(err.response?.data || "Failed to reset password. Link might be expired.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-900 px-4">
       <div className="absolute inset-0 z-0 pointer-events-none">
         <img src="/Background Image.jpg" alt="bg" className="w-full h-full object-cover opacity-30" />
         <div className="absolute inset-0 bg-black/70"></div>
      </div>

      <div className="relative z-10 w-full max-w-md bg-white/10 backdrop-blur-md border border-white/20 p-8 rounded-2xl shadow-2xl">
        <h2 className="text-2xl font-bold text-white mb-6 text-center">Set New Password</h2>

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
            <label className="block text-gray-300 text-sm font-medium mb-1">New Password</label>
            <input
              type="password"
              required
              value={newPassword}
              onChange={(e) => setNewPassword(e.target.value)}
              className="w-full px-4 py-3 rounded-xl bg-gray-800/50 border border-gray-600 text-white focus:ring-2 focus:ring-orange-500 outline-none"
              placeholder="••••••••"
            />
          </div>

          <div>
            <label className="block text-gray-300 text-sm font-medium mb-1">Confirm Password</label>
            <input
              type="password"
              required
              value={confirmPassword}
              onChange={(e) => setConfirmPassword(e.target.value)}
              className="w-full px-4 py-3 rounded-xl bg-gray-800/50 border border-gray-600 text-white focus:ring-2 focus:ring-orange-500 outline-none"
              placeholder="••••••••"
            />
          </div>

          <button
            type="submit"
            disabled={loading || !token}
            className={`w-full py-3 rounded-xl bg-gradient-to-r from-green-500 to-emerald-600 hover:from-green-600 hover:to-emerald-700 text-white font-bold transition-all ${loading ? 'opacity-50 cursor-not-allowed' : ''}`}
          >
            {loading ? "Updating..." : "Update Password"}
          </button>
        </form>
      </div>
    </div>
  );
};

export default ResetPassword;