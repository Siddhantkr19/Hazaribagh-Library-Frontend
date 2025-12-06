import React, { useState } from 'react'; // 1. Added useState
import { Link, useNavigate } from 'react-router-dom'; // 2. Added useNavigate
import FallingBackground from '../../components/FallingBackground';
import api from '../../services/api';

const Signup = () => {
  const navigate = useNavigate();

  // 3. ADDED STATE (Required to store input)
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    phone: '',
    password: '',
    confirmPassword: ''
  });

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  // 4. ADDED HANDLER (To update state when typing)
  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
    if (error) setError(null);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    // Validation
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

      await api.post('/register', payload);

      console.log("Signup Success");
      alert("Account created successfully! Please login.");
      navigate('/login'); 

    } catch (err) {
      console.error("Signup Error:", err);
      setError(err.response?.data?.message || "Registration failed. Try again.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="relative min-h-screen flex items-center justify-center overflow-hidden bg-gray-900 py-10">
      
      {/* BACKGROUND */}
      <div className="absolute inset-0 z-0">
        <img src="/Background Image.jpg" alt="Library Background" className="w-full h-full object-cover opacity-50" />
        <div className="absolute inset-0 bg-black/60"></div>
      </div>
      <FallingBackground />

      {/* CARD */}
      <div className="relative z-10 w-full max-w-lg px-4">
        <div className="bg-white/10 backdrop-blur-lg border border-white/20 rounded-3xl shadow-2xl p-8 animate-in fade-in slide-in-from-bottom-8 duration-500">
          
          <div className="text-center mb-6">
            <h1 className="text-3xl font-extrabold text-orange-400 mb-2">Create Account</h1>
            <p className="text-gray-300 text-sm">Join LibHub and start booking your seat.</p>
          </div>

          {/* Error Message Display */}
          {error && (
            <div className="mb-4 p-3 bg-red-500/20 border border-red-500/50 rounded-lg text-red-200 text-xs text-center">
              {error}
            </div>
          )}

          {/* 5. CONNECTED FORM (Added onSubmit) */}
          <form onSubmit={handleSubmit} className="space-y-4">
            
            {/* Full Name */}
            <div>
              <label className="block text-xs font-medium text-gray-300 mb-1">Full Name</label>
              <input 
                name="name" // Linked to state
                value={formData.name} // Linked to state
                onChange={handleChange} // Linked to handler
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
                  required
                  className="w-full px-4 py-3 rounded-lg bg-gray-800/50 border border-gray-600 text-white focus:ring-2 focus:ring-blue-500 outline-none" 
                  placeholder="9988776655" 
                />
              </div>
            </div>

            {/* Password */}
            <div>
              <label className="block text-xs font-medium text-gray-300 mb-1">Password</label>
              <input 
                name="password"
                value={formData.password}
                onChange={handleChange}
                type="password" 
                required
                className="w-full px-4 py-3 rounded-lg bg-gray-800/50 border border-gray-600 text-white focus:ring-2 focus:ring-blue-500 outline-none" 
                placeholder="Create strong password" 
              />
            </div>

            {/* Confirm Password */}
            <div>
              <label className="block text-xs font-medium text-gray-300 mb-1">Confirm Password</label>
              <input 
                name="confirmPassword"
                value={formData.confirmPassword}
                onChange={handleChange}
                type="password" 
                required
                className="w-full px-4 py-3 rounded-lg bg-gray-800/50 border border-gray-600 text-white focus:ring-2 focus:ring-blue-500 outline-none" 
                placeholder="Repeat password" 
              />
            </div>

            <button 
              disabled={loading}
              className={`w-full py-3.5 mt-2 rounded-xl bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-500 hover:to-indigo-500 text-white font-bold text-lg shadow-lg transform transition hover:-translate-y-0.5 ${loading ? 'opacity-50 cursor-not-allowed' : ''}`}
            >
              {loading ? "Creating Account..." : "Sign Up"}
            </button>
          </form>

          {/* ... Social Login Section Remains Same ... */}
          <div className="relative my-6">
            <div className="absolute inset-0 flex items-center"><div className="w-full border-t border-gray-600"></div></div>
            <div className="relative flex justify-center text-xs uppercase"><span className="px-2 bg-transparent text-gray-400">Or</span></div>
          </div>

          <button className="w-full flex items-center justify-center gap-3 px-4 py-3 border border-gray-600 rounded-xl hover:bg-white/5 transition-all text-white font-medium text-sm">
            <img src="https://www.svgrepo.com/show/475656/google-color.svg" alt="Google" className="w-5 h-5" />
            Sign up with Google
          </button>

          <p className="mt-6 text-center text-sm text-gray-400">
            Already have an account?{' '}
            <Link to="/login" className="font-bold text-blue-400 hover:text-blue-300 transition-colors">
              Login here
            </Link>
          </p>

        </div>
      </div>
    </div>
  );
};

export default Signup;