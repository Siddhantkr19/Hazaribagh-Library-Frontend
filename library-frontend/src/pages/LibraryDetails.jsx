import React, { useEffect, useState } from 'react';
import { useParams, Link, useNavigate } from 'react-router-dom';
import axios from 'axios';

const LibraryDetails = () => {
  const { id } = useParams(); 
  const navigate = useNavigate(); 
  
  const [library, setLibrary] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchLibraryDetails = async () => {
      try {
        const response = await axios.get(`http://localhost:8080/api/libraries/${id}`);
        setLibrary(response.data);
        setLoading(false);
      } catch (err) {
        console.error("Error fetching library details:", err);
        setError("Failed to load library details.");
        setLoading(false);
      }
    };

    fetchLibraryDetails();
  }, [id]);

  if (loading) return <div className="min-h-screen pt-24 flex items-center justify-center text-gray-600 dark:text-white">Loading details...</div>;
  if (error) return <div className="min-h-screen pt-24 flex items-center justify-center text-red-500">{error}</div>;
  if (!library) return null;

  const mainImage = (library.images && library.images.length > 0) 
    ? library.images[0] 
    : "https://images.unsplash.com/photo-1521587760476-6c12a4b040da?q=80&w=2670&auto=format&fit=crop";

  return (
    // ✅ FIX: Dynamic Background for Light/Dark Mode
    <div className="min-h-screen pt-28 pb-12 px-4 sm:px-6 lg:px-8 bg-gray-50 dark:bg-gray-900 transition-colors duration-300">
      
      <div className="relative z-10 max-w-6xl mx-auto">
        
        {/* Navigation Breadcrumb */}
        <Link to="/libraries" className="text-gray-500 dark:text-gray-400 hover:text-blue-600 dark:hover:text-white mb-6 inline-flex items-center gap-2 transition-colors font-medium">
          &larr; Back to Libraries
        </Link>

        {/* --- MAIN CONTENT GRID --- */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12">
          
          {/* LEFT COLUMN: Images */}
          <div className="space-y-4">
            <div className="rounded-3xl overflow-hidden shadow-2xl border border-gray-200 dark:border-gray-700 h-96 relative group">
               <img 
                 src={mainImage} 
                 alt={library.name} 
                 className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-105" 
               />
               <div className="absolute top-4 left-4 bg-white/90 dark:bg-black/60 backdrop-blur-md px-4 py-1 rounded-full text-sm font-bold border border-gray-200 dark:border-white/10 text-gray-900 dark:text-white shadow-lg">
                 📍 {library.locationTag || "Hazaribagh"}
               </div>
            </div>
            
            {/* Gallery Preview */}
            {library.images && library.images.length > 1 && (
                <div className="flex gap-4 overflow-x-auto pb-2 scrollbar-hide">
                    {library.images.slice(1).map((img, idx) => (
                        <img key={idx} src={img} alt="Gallery" className="w-24 h-24 rounded-xl object-cover border border-gray-200 dark:border-gray-700 cursor-pointer hover:opacity-80 transition-opacity shadow-sm" />
                    ))}
                </div>
            )}
          </div>

          {/* RIGHT COLUMN: Details */}
          <div className="bg-white dark:bg-gray-800/50 backdrop-blur-xl p-8 rounded-3xl border border-gray-100 dark:border-gray-700 shadow-xl shadow-gray-200/50 dark:shadow-none">
            
            {/* ✅ FIX: Title Color */}
            <h1 className="text-4xl font-extrabold text-gray-900 dark:text-white mb-2">{library.name}</h1>
            <p className="text-gray-500 dark:text-gray-400 text-lg mb-6 flex items-center gap-2">
               🗺️ {library.address || "Address not available"}
            </p>

            {/* Price Card */}
            <div className="bg-blue-50 dark:bg-gray-900/80 rounded-2xl p-6 mb-8 border border-blue-100 dark:border-gray-700 flex justify-between items-center">
                <div>
                    <p className="text-gray-400 dark:text-gray-500 text-sm line-through">₹{library.originalPrice}</p>
                    {/* ✅ FIX: Price Color */}
                    <p className="text-3xl font-bold text-blue-600 dark:text-green-400">₹{library.offerPrice}<span className="text-sm text-gray-500 dark:text-gray-400">/mo</span></p>
                </div>
                <div className="text-right">
                    <p className="text-sm text-orange-500 dark:text-orange-400 font-bold mb-1">Limited Seats!</p>
                    <div className="bg-orange-100 dark:bg-orange-500/20 text-orange-600 dark:text-orange-300 px-3 py-1 rounded-lg text-xs font-bold border border-orange-200 dark:border-orange-500/30">
                        {library.totalSeats} Seats Total
                    </div>
                </div>
            </div>

            {/* Info Grid */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-6 mb-8">
                {/* ✅ FIX: Info Boxes Colors */}
                <div className="bg-gray-50 dark:bg-gray-700/30 p-4 rounded-xl border border-gray-100 dark:border-gray-600/50">
                    <p className="text-xs text-gray-500 dark:text-gray-400 uppercase tracking-wide mb-1">Opening Hours</p>
                    <p className="text-gray-900 dark:text-white font-semibold">🕒 {library.openingHours || "6 AM - 10 PM"}</p>
                </div>
                <div className="bg-gray-50 dark:bg-gray-700/30 p-4 rounded-xl border border-gray-100 dark:border-gray-600/50">
                    <p className="text-xs text-gray-500 dark:text-gray-400 uppercase tracking-wide mb-1">Owner Contact</p>
                    <p className="text-gray-900 dark:text-white font-semibold">📞 {library.ownerContact || "Not Available"}</p>
                </div>
            </div>

            {/* Amenities List */}
            <div className="mb-8">
                <h3 className="text-xl font-bold text-gray-900 dark:text-white mb-4">Amenities</h3>
                <div className="flex flex-wrap gap-3">
                    {library.amenities && library.amenities.length > 0 ? (
                        library.amenities.map((item, index) => (
                            <span key={index} className="px-3 py-1.5 bg-blue-50 dark:bg-blue-600/20 text-blue-600 dark:text-blue-300 rounded-lg text-sm font-medium border border-blue-100 dark:border-blue-500/30">
                                ✓ {item}
                            </span>
                        ))
                    ) : (
                        <span className="text-gray-500">No specific amenities listed.</span>
                    )}
                </div>
            </div>

            {/* Action Button */}
            <button 
                onClick={() => navigate(`/book/${library.id}`)}
                className="w-full py-4 bg-gradient-to-r from-orange-500 to-red-600 hover:from-orange-600 hover:to-red-700 text-white font-bold text-xl rounded-xl shadow-lg shadow-orange-500/20 transform transition hover:-translate-y-1 active:scale-95"
            >
                Book My Seat Now
            </button>

          </div>
        </div>
      </div>
    </div>
  );
};

export default LibraryDetails;