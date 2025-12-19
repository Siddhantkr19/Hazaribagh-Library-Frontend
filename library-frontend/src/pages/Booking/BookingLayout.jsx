import React, { useState, useEffect } from 'react';
import { useParams, Outlet, useNavigate } from 'react-router-dom';
import { getLibraryById } from '../../services/bookingApi';
import { MapPin, Wifi, Zap, Coffee, Loader2 } from 'lucide-react';

const BookingLayout = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [library, setLibrary] = useState(null);

  useEffect(() => {
    const fetchLib = async () => {
      try {
        const data = await getLibraryById(id);
        const formatted = {
            id: data.id,
            name: data.name,
            location: data.locationTag || "Hazaribagh",
            image: data.images?.[0] || "https://images.unsplash.com/photo-1497366216548-37526070297c",
            rating: 4.8,
            amenities: data.amenities || ["WiFi", "AC"],
            offerPrice: data.offerPrice
        };
        setLibrary(formatted);
      } catch (err) {
        console.error(err);
        navigate('/libraries'); // Redirect if failed
      }
    };
    fetchLib();
  }, [id, navigate]);

  if (!library) {
    return (
      <div className="min-h-screen bg-gray-900 flex items-center justify-center">
        <Loader2 className="w-12 h-12 text-blue-500 animate-spin" />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-900 py-8 px-4 sm:px-6 lg:px-8 flex items-center justify-center relative overflow-hidden">
      
      {/* Background Blobs */}
      <div className="absolute top-[-10%] left-[-10%] w-96 h-96 bg-blue-600/20 rounded-full blur-[100px]"></div>
      <div className="absolute bottom-[-10%] right-[-10%] w-96 h-96 bg-purple-600/20 rounded-full blur-[100px]"></div>

      <div className="relative z-10 max-w-5xl w-full bg-gray-800/50 backdrop-blur-xl border border-white/10 rounded-[2rem] shadow-2xl overflow-hidden flex flex-col md:flex-row min-h-[600px]">
        
        {/* === LEFT SIDE: STATIC VISUALS === */}
        <div className="w-full md:w-1/2 relative h-64 md:h-auto">
            <img src={library.image} alt={library.name} className="w-full h-full object-cover" />
            <div className="absolute inset-0 bg-gradient-to-t from-gray-900 via-gray-900/60 to-transparent"></div>
            
            <div className="absolute bottom-0 left-0 p-8 w-full">
                <div className="inline-block px-3 py-1 bg-green-500/20 text-green-400 border border-green-500/30 rounded-full text-xs font-bold mb-4">
                    ⚡ Fast Filling
                </div>
                <h1 className="text-3xl md:text-4xl font-extrabold text-white mb-2 leading-tight">{library.name}</h1>
                <p className="text-gray-300 flex items-center gap-2 mb-6">
                    <MapPin className="w-4 h-4 text-blue-400" /> {library.location}
                </p>

                {/* Amenities */}
                <div className="flex flex-wrap gap-2">
                    {library.amenities.slice(0,4).map((am, i) => (
                        <span key={i} className="px-2.5 py-1 bg-white/10 border border-white/10 rounded-md text-xs text-gray-300 backdrop-blur-md">
                            {am}
                        </span>
                    ))}
                </div>
            </div>
        </div>

        {/* === RIGHT SIDE: DYNAMIC STEPS (OUTLET) === */}
        <div className="w-full md:w-1/2 p-8 md:p-10 flex flex-col justify-center bg-gray-900/40">
            {/* The Outlet renders StepEmail, StepPayment, or StepSuccess based on route */}
            <Outlet context={{ library }} />
        </div>

      </div>
    </div>
  );
};

export default BookingLayout;