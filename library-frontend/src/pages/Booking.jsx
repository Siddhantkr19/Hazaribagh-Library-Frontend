import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { createOrderAPI, verifyPaymentAPI } from '../services/bookingApi';
import { MapPin, Wifi, Zap, Coffee, ShieldCheck, CheckCircle, Loader2, ArrowRight } from 'lucide-react';

const Booking = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const { user, login } = useAuth(); // Assuming login function is available in context to update local state if needed

  // State Management
  const [step, setStep] = useState('loading'); // 'loading' | 'login' | 'payment' | 'success'
  const [isProcessing, setIsProcessing] = useState(false);
  const [library, setLibrary] = useState(null);
  
  // Login Form State
  const [email, setEmail] = useState('');

  // Pricing State
  const [priceDetails] = useState({
    basePrice: 400,
    discount: 50, // Highlight the discount
    finalPrice: 350
  });

  // [EFFECT] 1. Load Data & Check Auth
  useEffect(() => {
    // Simulate fetching library details
    setTimeout(() => {
      setLibrary({
        id: id,
        name: "Focus Point Library",
        location: "Matwari, Hazaribagh",
        image: "https://images.unsplash.com/photo-1497366216548-37526070297c?q=80&w=2301&auto=format&fit=crop",
        rating: 4.8,
        amenities: ["High-Speed Wifi", "AC", "Power Backup", "Water"]
      });
      
      // Determine initial step based on Auth
      if (user) {
        setStep('payment');
      } else {
        setStep('login');
      }
    }, 800); // Small artificial delay for smooth loading animation
  }, [user, id]);

  // [ACTION] Handle Login (Frontend Simulation for Flow)
  const handleLoginSubmit = (e) => {
    e.preventDefault();
    setIsProcessing(true);
    // In a real app, you would call your Login API here
    setTimeout(() => {
        setIsProcessing(false);
        // Navigate to login page usually, but for this flow we might just redirect
        navigate('/login', { state: { returnUrl: `/book/${id}` } });
    }, 1000);
  };

  // [ACTION] 2. Handle Payment (The Real Razorpay Flow)
  const handlePayment = async () => {
    if (!user || !library) return alert("User or Library not found");

    setIsProcessing(true);

    try {
      // A. Call Backend to Create Order
      const orderData = await createOrderAPI(user.email, library.id);
      
      // B. Razorpay Options
      const options = {
        key: "rzp_test_RsHxpfN8FVqy1g", // [YOUR KEY ID]
        amount: orderData.amountPaid * 100, 
        currency: "INR",
        name: "LibHub",
        description: `Month Access - ${library.name}`,
        image: "https://cdn-icons-png.flaticon.com/512/2232/2232688.png", // Library Icon
        order_id: orderData.razorpayOrderId, 
        
        // C. Success Handler
        handler: async function (response) {
            try {
                const verificationData = {
                    razorpayOrderId: response.razorpay_order_id,
                    razorpayPaymentId: response.razorpay_payment_id,
                    razorpaySignature: response.razorpay_signature,
                    userEmail: user.email
                };

                // D. Verify on Backend
                await verifyPaymentAPI(verificationData);
                
                // E. Success!
                setIsProcessing(false);
                setStep('success');

            } catch (verifyError) {
                alert("Payment Verification Failed. Please contact support.");
                console.error(verifyError);
                setIsProcessing(false);
            }
        },
        prefill: {
            name: user.name || "Student",
            email: user.email,
            contact: "" 
        },
        theme: {
            color: "#4F46E5" // Indigo-600 to match new UI
        }
      };

      const rzp1 = new window.Razorpay(options);
      rzp1.on('payment.failed', function (response){
        alert("Payment Failed: " + response.error.description);
        setIsProcessing(false);
      });
      rzp1.open();

    } catch (error) {
      console.error("Payment Initiation Failed:", error);
      alert("Could not start payment. Please check your connection.");
      setIsProcessing(false);
    }
  };

  // --- LOADING STATE ---
  if (step === 'loading' || !library) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="flex flex-col items-center space-y-4">
          <Loader2 className="w-10 h-10 text-indigo-600 animate-spin" />
          <p className="text-gray-500 font-medium">Preparing your study space...</p>
        </div>
      </div>
    );
  }

  // --- SUCCESS STATE (Ticket View) ---
  if (step === 'success') {
    return (
      <div className="min-h-screen bg-gradient-to-br from-indigo-50 to-blue-50 flex items-center justify-center p-4">
        <div className="bg-white w-full max-w-md rounded-3xl shadow-2xl overflow-hidden relative animate-in zoom-in duration-500">
          {/* Confetti / Decoration Background */}
          <div className="absolute top-0 left-0 w-full h-32 bg-green-500"></div>
          
          <div className="relative pt-12 px-8 pb-8 text-center">
            <div className="w-20 h-20 bg-white rounded-full flex items-center justify-center mx-auto mb-4 shadow-lg ring-4 ring-green-100">
              <CheckCircle className="w-10 h-10 text-green-500" />
            </div>
            
            <h2 className="text-3xl font-extrabold text-gray-900 mb-2">You're In!</h2>
            <p className="text-gray-500 mb-8">Your seat at <strong>{library.name}</strong> has been confirmed for the next 30 days.</p>

            {/* Ticket Stub */}
            <div className="bg-gray-50 rounded-xl border border-dashed border-gray-300 p-6 mb-8 text-left relative">
               {/* Cutout circles for ticket effect */}
               <div className="absolute -left-3 top-1/2 w-6 h-6 bg-white border-r border-gray-300 rounded-full transform -translate-y-1/2"></div>
               <div className="absolute -right-3 top-1/2 w-6 h-6 bg-white border-l border-gray-300 rounded-full transform -translate-y-1/2"></div>
               
               <div className="flex justify-between items-center mb-4">
                 <span className="text-xs font-bold text-gray-400 uppercase tracking-wider">Library</span>
                 <span className="text-sm font-bold text-gray-800">{library.name}</span>
               </div>
               <div className="flex justify-between items-center mb-4">
                 <span className="text-xs font-bold text-gray-400 uppercase tracking-wider">Plan</span>
                 <span className="text-sm font-bold text-indigo-600">Monthly Access</span>
               </div>
               <div className="flex justify-between items-center">
                 <span className="text-xs font-bold text-gray-400 uppercase tracking-wider">Amount</span>
                 <span className="text-lg font-extrabold text-gray-900">₹{priceDetails.finalPrice}</span>
               </div>
            </div>

            <button 
              onClick={() => navigate('/dashboard')} 
              className="w-full bg-gray-900 text-white font-bold py-4 rounded-xl hover:bg-gray-800 transition-all shadow-lg hover:shadow-xl transform hover:-translate-y-1"
            >
              Go to Dashboard
            </button>
          </div>
        </div>
      </div>
    );
  }

  // --- MAIN SPLIT LAYOUT ---
  return (
    <div className="min-h-screen bg-gray-100 py-12 px-4 sm:px-6 lg:px-8 font-sans flex items-center justify-center">
      <div className="max-w-6xl w-full bg-white rounded-[2rem] shadow-2xl overflow-hidden flex flex-col md:flex-row min-h-[650px]">
        
        {/* --- LEFT SIDE: THE EXPERIENCE (Visuals) --- */}
        <div className="w-full md:w-5/12 relative bg-gray-900 text-white p-8 md:p-12 flex flex-col justify-between overflow-hidden">
          {/* Background Image with Overlay */}
          <div className="absolute inset-0 z-0">
            <img src={library.image} alt="Library" className="w-full h-full object-cover opacity-60" />
            <div className="absolute inset-0 bg-gradient-to-t from-gray-900 via-gray-900/40 to-transparent"></div>
          </div>

          <div className="relative z-10">
            <div className="inline-flex items-center gap-2 bg-white/20 backdrop-blur-md px-3 py-1 rounded-full text-xs font-bold border border-white/10 mb-6">
              <span className="w-2 h-2 bg-green-400 rounded-full animate-pulse"></span>
              Live Booking
            </div>
            <h1 className="text-4xl font-extrabold mb-2 leading-tight">{library.name}</h1>
            <div className="flex items-center text-gray-300 text-sm">
              <MapPin className="w-4 h-4 mr-1" />
              {library.location}
            </div>
          </div>

          <div className="relative z-10 space-y-6">
             {/* Amenities Badges */}
             <div className="flex flex-wrap gap-2">
                {library.amenities.map((item, index) => (
                    <span key={index} className="px-3 py-1.5 bg-black/30 backdrop-blur-sm rounded-lg text-xs font-medium border border-white/10 flex items-center gap-1.5">
                        {item.includes('Wifi') && <Wifi className="w-3 h-3 text-cyan-400" />}
                        {item.includes('AC') && <Zap className="w-3 h-3 text-yellow-400" />}
                        {item.includes('Water') && <Coffee className="w-3 h-3 text-blue-400" />}
                        {item}
                    </span>
                ))}
             </div>

             <div className="p-4 rounded-xl bg-white/10 backdrop-blur-md border border-white/10">
                <p className="text-xs text-gray-400 uppercase tracking-widest font-bold mb-1">Student Perks</p>
                <p className="text-sm font-light">"Includes access to discussion rooms, quiet zones, and high-speed internet for uninterrupted study sessions."</p>
             </div>
          </div>
        </div>

        {/* --- RIGHT SIDE: THE ACTION (Form/Payment) --- */}
        <div className="w-full md:w-7/12 p-8 md:p-12 bg-white flex flex-col justify-center">
            
            {/* Header Steps */}
            <div className="flex items-center gap-4 mb-8 text-sm font-medium">
                <span className={`flex items-center gap-2 ${step === 'login' ? 'text-indigo-600' : 'text-gray-400'}`}>
                    <span className="w-6 h-6 rounded-full border-2 flex items-center justify-center text-xs border-current">1</span>
                    Login
                </span>
                <div className="w-8 h-[1px] bg-gray-200"></div>
                <span className={`flex items-center gap-2 ${step === 'payment' ? 'text-indigo-600' : 'text-gray-400'}`}>
                    <span className="w-6 h-6 rounded-full border-2 flex items-center justify-center text-xs border-current">2</span>
                    Payment
                </span>
            </div>

            {step === 'login' ? (
                /* LOGIN VIEW */
                <div className="animate-in fade-in slide-in-from-right-8 duration-500 max-w-md mx-auto w-full">
                    <h2 className="text-2xl font-bold text-gray-900 mb-2">Secure your spot.</h2>
                    <p className="text-gray-500 mb-8">Login to continue with your booking.</p>
                    
                    <div className="space-y-4">
                        <button 
                            onClick={() => navigate('/login')}
                            className="w-full py-3.5 px-4 bg-indigo-600 hover:bg-indigo-700 text-white font-semibold rounded-xl transition-all flex items-center justify-center gap-2 shadow-lg shadow-indigo-200"
                        >
                            Log in with Email <ArrowRight className="w-4 h-4" />
                        </button>
                        <p className="text-center text-sm text-gray-500 mt-4">
                            Don't have an account? <span onClick={() => navigate('/signup')} className="text-indigo-600 font-bold cursor-pointer hover:underline">Sign up free</span>
                        </p>
                    </div>
                </div>
            ) : (
                /* PAYMENT VIEW */
                <div className="animate-in fade-in slide-in-from-bottom-8 duration-500 max-w-md mx-auto w-full">
                    <h2 className="text-2xl font-bold text-gray-900 mb-6">Order Summary</h2>

                    {/* Price Card */}
                    <div className="bg-gray-50 rounded-2xl p-6 border border-gray-100 mb-6 space-y-3">
                        <div className="flex justify-between items-center text-gray-600">
                            <span>Monthly Subscription</span>
                            <span className="font-medium">₹{priceDetails.basePrice}</span>
                        </div>
                        <div className="flex justify-between items-center text-green-600 bg-green-50 px-3 py-1 rounded-lg border border-green-100">
                            <span className="flex items-center gap-1.5 text-sm font-bold"><Zap className="w-3 h-3 fill-current" /> Student Discount</span>
                            <span className="font-bold">- ₹{priceDetails.discount}</span>
                        </div>
                        <div className="border-t border-gray-200 pt-3 mt-2 flex justify-between items-center">
                            <span className="text-lg font-bold text-gray-900">Total Payable</span>
                            <span className="text-2xl font-extrabold text-indigo-600">₹{priceDetails.finalPrice}</span>
                        </div>
                    </div>

                    {/* ================= ADD THIS BLOCK HERE ================= */}
                    <div className="bg-blue-50 border border-blue-100 rounded-xl p-4 flex items-center gap-3 mb-6">
                        <div className="p-2 bg-blue-500 text-white rounded-lg">
                            {/* Armchair Icon SVG */}
                            <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M19 9V6a2 2 0 0 0-2-2H7a2 2 0 0 0-2 2v3"/><path d="M3 16a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2v-5a2 2 0 0 0-4 0v2H7v-2a2 2 0 0 0-4 0Z"/><path d="M5 18v2"/><path d="M19 18v2"/></svg>
                        </div>
                        <div>
                            {/* Updated colors to be visible on white background */}
                            <p className="text-sm font-bold text-gray-900">Seat Assignment</p>
                            <p className="text-xs text-blue-700">
                                System will automatically assign the best available seat (e.g., Seat-1, Seat-2) instantly after payment.
                            </p>
                        </div>
                    </div>

                    <div className="mb-8">
                        <h3 className="text-xs font-bold text-gray-400 uppercase tracking-wider mb-3">Payment Method</h3>
                        <div className="p-4 border-2 border-indigo-600 bg-indigo-50/50 rounded-xl flex items-center justify-between cursor-pointer shadow-sm relative overflow-hidden">
                            <div className="absolute right-0 top-0 bg-indigo-600 text-white text-[10px] px-2 py-0.5 rounded-bl-lg font-bold">PREFERRED</div>
                            <div className="flex items-center gap-3">
                                <div className="w-10 h-10 bg-white rounded-full flex items-center justify-center shadow-sm">
                                    <ShieldCheck className="w-5 h-5 text-indigo-600" />
                                </div>
                                <div>
                                    <p className="font-bold text-gray-900 text-sm">Razorpay Secure</p>
                                    <p className="text-xs text-gray-500">UPI, Cards, NetBanking</p>
                                </div>
                            </div>
                            <div className="w-5 h-5 rounded-full border-[5px] border-indigo-600"></div>
                        </div>
                    </div>

                    <button 
                        onClick={handlePayment}
                        disabled={isProcessing}
                        className="w-full py-4 bg-gray-900 hover:bg-black text-white font-bold rounded-xl transition-all shadow-xl hover:shadow-2xl hover:scale-[1.01] active:scale-[0.98] flex items-center justify-center gap-2 disabled:opacity-70 disabled:cursor-not-allowed"
                    >
                        {isProcessing ? (
                            <>
                                <Loader2 className="w-5 h-5 animate-spin" /> Processing...
                            </>
                        ) : (
                            `Pay ₹${priceDetails.finalPrice} & Book`
                        )}
                    </button>

                    <p className="text-center text-xs text-gray-400 mt-4 flex items-center justify-center gap-1">
                        <ShieldCheck className="w-3 h-3" /> 100% Secure Transaction via Razorpay
                    </p>
                </div>
            )}
        </div>

      </div>
    </div>
  );
};

export default Booking;