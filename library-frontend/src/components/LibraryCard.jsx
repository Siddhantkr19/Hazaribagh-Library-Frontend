import React from 'react';
import { useNavigate } from 'react-router-dom'; 
import { FaWifi, FaGlassWater, FaBolt, FaChair, FaStar, FaCar } from "react-icons/fa6"; 
import { TbAirConditioning, TbAirConditioningDisabled } from "react-icons/tb";
import { MdOutlineSecurity, MdMeetingRoom } from "react-icons/md";
import { BiCctv } from "react-icons/bi";

const LibraryCard = ({ library }) => {
  // Destructure with safe defaults
  const { 
    id, 
    name, 
    locationTag,   // ✅ CORRECT: Matches DTO
    totalSeats,    // ✅ CORRECT: Matches DTO
    offerPrice,    // ✅ CORRECT: Matches DTO
    originalPrice, // ✅ CORRECT: Matches DTO
    images = [],   // ✅ CORRECT: Array of strings
    amenities = [], 
    averageRating, 
    totalReviews 
  } = library;

  const navigate = useNavigate(); 

  // ✅ HELPER: Optimize Cloudinary Image URL
  const getOptimizedImageUrl = (url) => {
    if (!url || !url.includes('cloudinary.com')) return url; 
    return url.replace('/upload/', '/upload/w_400,h_300,c_fill,q_auto,f_auto/');
  };

  // ✅ HELPER: Cleans "Dirty" Java Data
  const getAmenityConfig = (amenityItem) => {
    let rawName = amenityItem.name || amenityItem;
    if (typeof rawName === 'string' && rawName.includes('NAME=')) {
        const match = rawName.match(/NAME=([^,)]+)/i);
        if (match) rawName = match[1];
    }
    const lowerText = rawName ? rawName.toString().toLowerCase().trim() : '';

    if (lowerText.includes('wifi') || lowerText.includes('wi-fi')) 
        return { icon: <FaWifi />, label: 'WiFi', color: 'text-blue-500 dark:text-blue-400' };
    if (lowerText.includes('non ac') || lowerText.includes('non-ac')) 
        return { icon: <TbAirConditioningDisabled />, label: 'Non AC', color: 'text-gray-500 dark:text-gray-400' };
    if (lowerText.includes('ac') || lowerText.includes('air conditioning')) 
        return { icon: <TbAirConditioning />, label: 'AC', color: 'text-cyan-600 dark:text-cyan-300' };
    if (lowerText.includes('water')) 
        return { icon: <FaGlassWater />, label: 'RO Water', color: 'text-blue-600 dark:text-blue-300' };
    if (lowerText.includes('power') || lowerText.includes('backup')) 
        return { icon: <FaBolt />, label: 'Backup', color: 'text-yellow-600 dark:text-yellow-400' };
    if (lowerText.includes('cctv')) 
        return { icon: <BiCctv />, label: 'CCTV', color: 'text-red-500 dark:text-red-300' };
    if (lowerText.includes('security')) 
        return { icon: <MdOutlineSecurity />, label: 'Security', color: 'text-green-600 dark:text-green-300' };
    if (lowerText.includes('discussion') || lowerText.includes('room')) 
        return { icon: <MdMeetingRoom />, label: 'Room', color: 'text-purple-600 dark:text-purple-300' };
    if (lowerText.includes('parking')) 
        return { icon: <FaCar />, label: 'Parking', color: 'text-gray-500 dark:text-gray-300' };

    return { icon: <FaChair />, label: rawName, color: 'text-gray-500 dark:text-gray-300' };
  };

  const displayRating = (averageRating && averageRating > 0) ? Number(averageRating).toFixed(1) : "N/A";
  
  // ✅ Get the main image using the helper
  const mainImage = images.length > 0 ? getOptimizedImageUrl(images[0]) : null;

  return (
    <div 
      onClick={() => navigate(`/libraries/${id}`)}
      className="group relative h-full w-full bg-white dark:bg-gray-900 border border-gray-200 dark:border-white/10 rounded-2xl overflow-hidden hover:border-blue-500/50 transition-all duration-300 hover:shadow-2xl hover:shadow-gray-200 dark:hover:shadow-blue-500/10 hover:-translate-y-2 cursor-pointer"
    >
      <div className="relative w-full h-full bg-white dark:bg-gray-900/95 backdrop-blur-xl rounded-2xl overflow-hidden flex flex-col">
      
        {/* --- Image Section --- */}
        <div className="relative h-48 flex-shrink-0 overflow-hidden">
          <div className="absolute inset-0 bg-gradient-to-t from-gray-900 via-transparent to-transparent opacity-0 dark:opacity-80 z-10" />
          
          {/* 🛠️ FIX 1: Use mainImage instead of 'image' */}
          {mainImage ? (
            <img 
              src={mainImage} 
              alt={name} 
              className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110"
            />
          ) : (
             // Fallback if no image exists
            <div className="w-full h-full flex items-center justify-center bg-gray-200 dark:bg-gray-800 text-gray-400">
               No Image
            </div>
          )}
          
          {/* Seats Left Badge */}
          <div className="absolute top-3 left-3 z-20 bg-white/90 dark:bg-black/60 backdrop-blur-md border border-red-200 dark:border-red-500/30 px-3 py-1 rounded-full flex items-center gap-2 shadow-lg">
            <span className="relative flex h-2 w-2">
              <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-red-400 opacity-75"></span>
              <span className="relative inline-flex rounded-full h-2 w-2 bg-red-500"></span>
            </span>
            {/* 🛠️ FIX 2: Use totalSeats instead of 'seats' */}
            <span className="text-xs font-bold text-gray-800 dark:text-white tracking-wide">{totalSeats} Left</span>
          </div>

          <div className="absolute top-3 right-3 z-20 bg-white/90 dark:bg-black/60 backdrop-blur-md border border-yellow-200 dark:border-yellow-500/30 px-2.5 py-1 rounded-lg flex items-center gap-1.5 shadow-lg">
            <FaStar className="text-yellow-500 text-xs" />
            <span className="text-xs font-bold text-gray-800 dark:text-white">
                {displayRating}
            </span>
          </div>

          <div className="absolute bottom-3 left-3 z-20">
            <div className="flex items-center gap-1 bg-blue-600/90 backdrop-blur-md px-2.5 py-1 rounded-lg border border-blue-400/30 shadow-lg">
              <span className="text-xs">📍</span>
              {/* 🛠️ FIX 3: Use locationTag instead of 'location' */}
              <span className="text-xs font-bold text-white uppercase tracking-wide">{locationTag}</span>
            </div>
          </div>
        </div>

        {/* --- Content Section --- */}
        <div className="p-5 relative z-20 flex flex-col flex-grow">
          
          <div className="flex justify-between items-start mb-3">
            <h3 className="text-lg font-bold text-gray-900 dark:text-white group-hover:text-blue-600 dark:group-hover:text-blue-400 transition-colors line-clamp-1">
              {name}
            </h3>
            
            <div className="flex items-center gap-1 bg-gray-100 dark:bg-white/5 border border-gray-200 dark:border-white/10 px-2 py-1 rounded-lg">
              <span className="text-yellow-500 dark:text-yellow-400 text-xs">★</span>
              <span className="text-xs font-bold text-gray-700 dark:text-gray-200">
                {displayRating}
              </span>
              {totalReviews > 0 && (
                <span className="text-[10px] text-gray-400 ml-0.5">({totalReviews})</span>
              )}
            </div>
          </div>

          {/* Amenities List */}
          <div className="flex flex-wrap gap-2 mb-5">
            {amenities.slice(0, 3).map((item, index) => {
               const config = getAmenityConfig(item);
               return (
                <span key={index} className="flex items-center gap-1.5 px-2.5 py-1 bg-gray-50 dark:bg-white/5 border border-gray-200 dark:border-white/10 rounded-md hover:bg-gray-100 dark:hover:bg-white/10 transition-colors">
                  <span className={`text-sm ${config.color}`}>{config.icon}</span>
                  <span className="text-gray-600 dark:text-gray-300 text-[10px] font-semibold uppercase tracking-wide">{config.label}</span>
                </span>
               );
            })}
            {amenities.length > 3 && (
                <span className="px-2 py-1 text-[10px] text-gray-500 dark:text-gray-500 font-medium">+{amenities.length - 3} more</span>
            )}
          </div>

          {/* Footer */}
          <div className="mt-auto">
            <div className="h-px w-full bg-gray-200 dark:bg-white/10 mb-4"></div>

            <div className="flex justify-between items-center">
              <div className="flex flex-col">
                {/* 🛠️ FIX 4: Use originalPrice instead of 'oldPrice' */}
                <span className="text-xs text-gray-400 dark:text-gray-500 line-through">₹{originalPrice}</span>
                <div className="flex items-baseline gap-1">
                  <span className="text-xl font-black text-gray-900 dark:text-transparent dark:bg-clip-text dark:bg-gradient-to-r dark:from-blue-400 dark:to-cyan-300">
                    {/* 🛠️ FIX 5: Use offerPrice instead of 'price' */}
                    ₹{offerPrice}
                  </span>
                  <span className="text-xs text-gray-500 dark:text-gray-400 font-medium">/mo</span>
                </div>
              </div>
              
              <button className="px-5 py-2.5 rounded-xl bg-gradient-to-r from-orange-500 to-red-600 hover:from-orange-600 hover:to-red-700 text-white text-sm font-bold shadow-lg shadow-orange-500/20 hover:-translate-y-0.5 transition-all">
                Book Seat
              </button>
            </div>
          </div>
          
        </div>
      </div>
    </div>
  );
};

export default LibraryCard;