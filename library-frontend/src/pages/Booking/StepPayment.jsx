import React, { useState } from 'react';
import { useNavigate, useOutletContext } from 'react-router-dom';
import { ShieldCheck, Loader2, Zap } from 'lucide-react';
import { createOrderAPI, verifyPaymentAPI } from '../../services/bookingApi';
import { useAuth } from '../../context/AuthContext';

const StepPayment = () => {
  const { library } = useOutletContext();
  const { user } = useAuth();
  const navigate = useNavigate();
  const [isProcessing, setIsProcessing] = useState(false);

  // Pricing Logic
  const basePrice = library.offerPrice || 400;
  const discount = 50; 
  const finalPrice = basePrice - discount;

  const handlePayment = async () => {
    if (!user) return alert("Please login first");
    setIsProcessing(true);

    try {
      const orderData = await createOrderAPI(user.email, library.id);
      
      const options = {
        key: "rzp_test_RsHxpfN8FVqy1g", // Use Env var in real app
        amount: orderData.amountPaid * 100,
        currency: "INR",
        name: "LibHub",
        description: `Seat at ${library.name}`,
        order_id: orderData.razorpayOrderId,
        handler: async function (response) {
            try {
                await verifyPaymentAPI({
                    razorpayOrderId: response.razorpay_order_id,
                    razorpayPaymentId: response.razorpay_payment_id,
                    razorpaySignature: response.razorpay_signature,
                    userEmail: user.email
                });
                // Navigate to Success Page
                navigate(`/book/${library.id}/success`);
            } catch (err) {
                alert("Verification Failed");
            } finally {
                setIsProcessing(false);
            }
        },
        theme: { color: "#2563EB" }
      };

      const rzp = new window.Razorpay(options);
      rzp.on('payment.failed', () => setIsProcessing(false));
      rzp.open();

    } catch (error) {
      console.error(error);
      setIsProcessing(false);
    }
  };

  return (
    <div className="animate-in slide-in-from-right-4 fade-in duration-300">
        {/* Progress Bar */}
        <div className="flex items-center gap-3 mb-8">
            <div className="h-1 flex-1 rounded-full bg-green-500"></div>
            <div className="h-1 flex-1 rounded-full bg-blue-500"></div>
        </div>

        <div className="flex justify-between items-end mb-6">
            <h2 className="text-2xl font-bold text-white">Order Summary</h2>
            <span className="text-xs text-green-400 bg-green-500/10 px-2 py-1 rounded border border-green-500/20">Saved ₹{discount}</span>
        </div>

        <div className="bg-gray-800/50 rounded-2xl p-5 border border-white/5 space-y-4 mb-6">
            <div className="flex justify-between text-gray-400 text-sm">
                <span>Base Price</span>
                <span className="line-through">₹{basePrice}</span>
            </div>
            <div className="h-px bg-white/10 my-2"></div>
            <div className="flex justify-between items-center">
                <span className="text-white font-medium">Total Payable</span>
                <span className="text-3xl font-extrabold text-transparent bg-clip-text bg-gradient-to-r from-blue-400 to-indigo-400">₹{finalPrice}</span>
            </div>
        </div>

        <div className="bg-blue-500/10 border border-blue-500/20 p-4 rounded-xl flex gap-3 mb-8">
            <ShieldCheck className="w-5 h-5 text-blue-400 flex-shrink-0" />
            <div>
                <p className="text-white text-sm font-bold">Secure Payment</p>
                <p className="text-gray-400 text-xs">Protected by Razorpay Encryption.</p>
            </div>
        </div>

        <button 
            onClick={handlePayment}
            disabled={isProcessing}
            className="w-full py-4 bg-white text-gray-900 font-bold rounded-xl hover:bg-gray-100 transition-all shadow-xl flex items-center justify-center gap-2"
        >
            {isProcessing ? <Loader2 className="animate-spin w-5 h-5" /> : `Pay ₹${finalPrice} & Book`}
        </button>
    </div>
  );
};

export default StepPayment;