import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';

const Booking = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  
  // State for the interactive flow
  const [step, setStep] = useState('login'); // 'login' | 'payment' | 'success'
  const [loading, setLoading] = useState(false);
  const [email, setEmail] = useState('');

  // Fake Library Data (In real app, fetch by ID)
  const library = {
    name: "Focus Point Library",
    location: "Matwari, Hazaribagh",
    image: "https://images.unsplash.com/photo-1521587760476-6c12a4b040da?q=80&w=2670&auto=format&fit=crop",
    price: 400,
    discount: 50 // The First-Time User discount
  };

  // Handle Login Simulation
  const handleLogin = (e) => {
    e.preventDefault();
    if (!email) return alert("Please enter an email");
    
    setLoading(true);
    // Simulate API delay
    setTimeout(() => {
      setLoading(false);
      setStep('payment'); // Move to Payment Step
    }, 1500);
  };

  // Handle Payment Simulation
  const handlePayment = () => {
    setLoading(true);
    // Simulate Razorpay processing
    setTimeout(() => {
      setLoading(false);
      setStep('success'); // Show Success Receipt
    }, 2000);
  };

  // --- VIEW 3: SUCCESS / RECEIPT ---
  if (step === 'success') {
    return (
      <div className="min-h-screen bg-gray-900 flex items-center justify-center p-4">
        <div className="bg-white rounded-3xl p-8 max-w-md w-full text-center animate-in zoom-in duration-300">
          <div className="w-20 h-20 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-6">
            <svg className="w-10 h-10 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 13l4 4L19 7"></path></svg>
          </div>
          <h2 className="text-3xl font-bold text-gray-900 mb-2">Booking Confirmed!</h2>
          <p className="text-gray-500 mb-6">Your seat at <span className="font-bold">{library.name}</span> is reserved.</p>
          
          <div className="bg-gray-50 p-4 rounded-xl border border-dashed border-gray-300 mb-6 text-sm">
            <div className="flex justify-between mb-2"><span>Transaction ID:</span><span className="font-mono text-gray-700">PID_992837</span></div>
            <div className="flex justify-between mb-2"><span>Date:</span><span>{new Date().toLocaleDateString()}</span></div>
            <div className="flex justify-between font-bold text-lg pt-2 border-t border-gray-200"><span>Amount Paid:</span><span>₹{library.price - library.discount}</span></div>
          </div>

          <button onClick={() => navigate('/dashboard')} className="w-full bg-gray-900 text-white font-bold py-3 rounded-xl hover:bg-gray-800 transition-all">
            Go to Dashboard
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen pt-20 px-4 sm:px-6 lg:px-8 bg-gray-50 dark:bg-gray-900 flex items-center justify-center font-sans">
      <div className="max-w-6xl w-full bg-white dark:bg-gray-800 rounded-3xl shadow-2xl overflow-hidden flex flex-col md:flex-row min-h-[600px] transition-all duration-500">
        
        {/* --- LEFT SIDE: LOGIC (Login or Payment Methods) --- */}
        <div className="w-full md:w-1/2 p-8 md:p-12 flex flex-col justify-center border-r border-gray-100 dark:border-gray-700 relative">
          
          {step === 'login' ? (
            /* VIEW 1: LOGIN FORM */
            <div className="animate-in fade-in slide-in-from-left-4 duration-500">
              <h2 className="text-3xl font-extrabold text-gray-900 dark:text-white mb-2">Student Login</h2>
              <p className="text-gray-500 dark:text-gray-400 mb-8">Enter your details to unlock the <span className="text-green-600 font-bold">₹50 First-Time Discount</span>.</p>
              
              <form onSubmit={handleLogin} className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Email Address</label>
                  <input 
                    type="email" 
                    required
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    className="w-full px-4 py-3 rounded-lg border border-gray-300 dark:border-gray-600 dark:bg-gray-700 dark:text-white focus:ring-2 focus:ring-blue-500 outline-none" 
                    placeholder="student@university.com" 
                  />
                </div>
                <button 
                  disabled={loading}
                  className="w-full bg-blue-600 text-white font-bold py-3 rounded-xl hover:bg-blue-700 transition-all shadow-lg shadow-blue-500/30 flex justify-center items-center"
                >
                  {loading ? "Verifying..." : "Verify & Continue →"}
                </button>
              </form>
            </div>
          ) : (
            /* VIEW 2: PAYMENT METHOD SELECTION */
            <div className="animate-in fade-in slide-in-from-right-4 duration-500">
              <div className="flex items-center mb-6 cursor-pointer" onClick={() => setStep('login')}>
                <span className="text-blue-500 text-sm font-bold">← Back</span>
              </div>
              <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-6">Select Payment Method</h2>
              
              <div className="space-y-3">
                <div className="p-4 border-2 border-blue-500 bg-blue-50 dark:bg-blue-900/20 rounded-xl flex items-center justify-between cursor-pointer">
                  <div className="flex items-center">
                    <span className="w-4 h-4 rounded-full border-4 border-blue-600 mr-3"></span>
                    <span className="font-bold text-gray-800 dark:text-white">UPI / QR Code</span>
                  </div>
                  <span className="text-xs bg-blue-100 text-blue-700 px-2 py-1 rounded font-bold">FASTEST</span>
                </div>
                <div className="p-4 border border-gray-200 dark:border-gray-600 rounded-xl flex items-center opacity-60">
                  <span className="w-4 h-4 rounded-full border border-gray-400 mr-3"></span>
                  <span className="text-gray-800 dark:text-white">Credit / Debit Card</span>
                </div>
              </div>

              <div className="mt-8 p-4 bg-gray-50 dark:bg-gray-700/50 rounded-lg text-xs text-gray-500 dark:text-gray-400">
                Logged in as: <span className="font-bold text-gray-700 dark:text-gray-200">{email}</span>
              </div>
            </div>
          )}
        </div>

        {/* --- RIGHT SIDE: SUMMARY & PAY BUTTON --- */}
        <div className="w-full md:w-1/2 bg-gray-50 dark:bg-gray-800/50 p-8 md:p-12 flex flex-col justify-center relative">
          <div className="relative z-10">
            <h3 className="text-xl font-bold text-gray-900 dark:text-white mb-6">Booking Summary</h3>
            
            <div className="bg-white dark:bg-gray-700 p-4 rounded-xl shadow-sm mb-6 flex gap-4 items-center">
              <img src={library.image} className="w-20 h-20 rounded-lg object-cover" alt="Library" />
              <div>
                <h4 className="font-bold text-gray-800 dark:text-white">{library.name}</h4>
                <p className="text-xs text-gray-500 dark:text-gray-300">{library.location}</p>
                <span className="text-xs bg-green-100 text-green-700 px-2 py-0.5 rounded mt-1 inline-block">AC Seat</span>
              </div>
            </div>

            <div className="space-y-3 text-sm text-gray-600 dark:text-gray-300 mb-8 border-t border-gray-200 dark:border-gray-600 pt-4">
              <div className="flex justify-between">
                <span>Monthly Subscription</span>
                <span className="font-medium">₹{library.price}</span>
              </div>
              
              {/* Conditional Discount Display */}
              <div className={`flex justify-between text-green-600 dark:text-green-400 transition-all duration-500 ${step === 'login' ? 'opacity-50 blur-[2px]' : 'opacity-100'}`}>
                <span>First-Time User Discount</span>
                <span className="font-medium">- ₹{library.discount}</span>
              </div>
              
              <div className="flex justify-between font-bold text-lg text-gray-900 dark:text-white pt-2 border-t border-gray-200 dark:border-gray-600">
                <span>Total to Pay</span>
                <span>₹{step === 'login' ? library.price : (library.price - library.discount)}</span>
              </div>
            </div>

            {/* THE PAY BUTTON - Only active in Step 2 */}
            <button 
              onClick={handlePayment}
              disabled={step === 'login' || loading}
              className={`w-full py-4 rounded-xl font-bold text-lg shadow-xl transition-all flex justify-center items-center ${
                step === 'login' 
                  ? 'bg-gray-300 text-gray-500 cursor-not-allowed' 
                  : 'bg-green-600 hover:bg-green-700 text-white transform hover:scale-[1.02]'
              }`}
            >
              {loading 
                ? <span className="animate-pulse">Processing...</span> 
                : step === 'login' ? "Login to Unlock Payment" : `Pay ₹${library.price - library.discount} via Razorpay`
              }
            </button>

            <div className="flex items-center gap-2 text-xs text-gray-400 mt-4 justify-center">
              <span>🔒 Secure Payment via Razorpay (Test Mode)</span>
            </div>

          </div>
        </div>

      </div>
    </div>
  );
};

export default Booking;