import React from 'react';
import { useNavigate } from 'react-router-dom'; 
import { FaWifi, FaGlassWater, FaBolt, FaChair } from "react-icons/fa6"; 
import { TbAirConditioning, TbAirConditioningDisabled } from "react-icons/tb";
import { MdOutlineSecurity, MdMeetingRoom } from "react-icons/md";
import { BiCctv } from "react-icons/bi";

const LibraryCard = ({ library }) => {
  const { id, name, location, seats, price, oldPrice, image, amenities, rating } = library;
  const navigate = useNavigate(); 

  // Helper function remains the same...
  const getAmenityConfig = (text) => {
    const lowerText = text.toLowerCase();
    if (lowerText.includes('wifi')) return { icon: <FaWifi />, label: 'WiFi', color: 'text-blue-400' };
    if (lowerText.includes('non ac')) return { icon: <TbAirConditioningDisabled />, label: 'Non AC', color: 'text-gray-400' };
    if (lowerText.includes('ac')) return { icon: <TbAirConditioning />, label: 'AC', color: 'text-cyan-300' };
    if (lowerText.includes('water')) return { icon: <FaGlassWater />, label: 'RO Water', color: 'text-blue-300' };
    if (lowerText.includes('power') || lowerText.includes('backup')) return { icon: <FaBolt />, label: 'Backup', color: 'text-yellow-400' };
    if (lowerText.includes('cctv')) return { icon: <BiCctv />, label: 'CCTV', color: 'text-red-300' };
    if (lowerText.includes('security')) return { icon: <MdOutlineSecurity />, label: 'Security', color: 'text-green-300' };
    if (lowerText.includes('discussion')) return { icon: <MdMeetingRoom />, label: 'Room', color: 'text-purple-300' };
    return { icon: <FaChair />, label: text, color: 'text-gray-300' };
  };

  return (
    <div 
      onClick={() => navigate(`/libraries/${id}`)}
      // Outer Container (Gradient Border)
      className="group relative h-full w-full bg-white dark:bg-gray-900/60 backdrop-blur-xl border border-blue-200 dark:border-white/10 rounded-2xl overflow-hidden hover:border-blue-500/50 transition-all duration-300 hover:shadow-2xl hover:shadow-blue-400/30 dark:hover:shadow-blue-500/10 hover:-translate-y-2 cursor-pointer"
    >
      {/* FIX 1: Removed the self-closing '/' before the >. Now this div wraps the content. */}
      <div className="relative w-full h-full bg-white dark:bg-gray-900/95 backdrop-blur-xl rounded-2xl overflow-hidden flex flex-col">
      
        {/* --- Image Section --- */}
        <div className="relative h-48 flex-shrink-0 overflow-hidden">
          <div className="absolute inset-0 bg-gradient-to-t from-gray-900 via-transparent to-transparent opacity-80 z-10" />
          <img 
            src={image} 
            alt={name} 
            className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110"
          />
          
          <div className="absolute top-3 right-3 z-20 bg-black/60 backdrop-blur-md border border-red-500/30 px-3 py-1 rounded-full flex items-center gap-2 shadow-lg">
            <span className="relative flex h-2 w-2">
              <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-red-400 opacity-75"></span>
              <span className="relative inline-flex rounded-full h-2 w-2 bg-red-500"></span>
            </span>
            <span className="text-xs font-bold text-white tracking-wide">{seats} Left</span>
          </div>

          <div className="absolute bottom-3 left-3 z-20">
            <div className="flex items-center gap-1 bg-blue-600/90 backdrop-blur-md px-2.5 py-1 rounded-lg border border-blue-400/30 shadow-lg">
              <span className="text-xs">📍</span>
              <span className="text-xs font-bold text-white uppercase tracking-wide">{location}</span>
            </div>
          </div>
        </div>

        {/* --- Content Section --- */}
        {/* FIX 2: Fixed typo 'lex' -> 'flex' so flex-col works */}
        <div className="p-5 relative z-20 flex flex-col flex-grow">
          
          <div className="flex justify-between items-start mb-3">
            <h3 className="text-lg font-bold text-white group-hover:text-blue-400 transition-colors line-clamp-1">
              {name}
            </h3>
            <div className="flex items-center gap-1 bg-white/5 border border-white/10 px-2 py-1 rounded-lg">
              <span className="text-yellow-400 text-xs">★</span>
              <span className="text-xs font-bold text-gray-200">{rating}</span>
            </div>
          </div>

          {/* Amenities */}
          <div className="flex flex-wrap gap-2 mb-5">
            {amenities.slice(0, 3).map((item, index) => {
               const config = getAmenityConfig(item);
               return (
                <span key={index} className="flex items-center gap-1.5 px-2.5 py-1 bg-white/5 border border-white/10 rounded-md hover:bg-white/10 transition-colors">
                  <span className={`text-sm ${config.color}`}>{config.icon}</span>
                  <span className="text-gray-300 text-[10px] font-semibold uppercase tracking-wide">{config.label}</span>
                </span>
               );
            })}
            {amenities.length > 3 && (
                <span className="px-2 py-1 text-[10px] text-gray-500 font-medium">+{amenities.length - 3} more</span>
            )}
          </div>

          {/* Footer (Pushed to bottom using mt-auto) */}
          <div className="mt-auto">
            <div className="h-px w-full bg-gradient-to-r from-transparent via-white/10 to-transparent mb-4"></div>

            <div className="flex justify-between items-center">
              <div className="flex flex-col">
                <span className="text-xs text-gray-500 line-through">₹{oldPrice}</span>
                <div className="flex items-baseline gap-1">
                  <span className="text-xl font-black text-transparent bg-clip-text bg-gradient-to-r from-blue-400 to-cyan-300">
                    ₹{price}
                  </span>
                  <span className="text-xs text-gray-400 font-medium">/mo</span>
                </div>
              </div>
              
              <button className="px-5 py-2.5 rounded-xl bg-gradient-to-r from-yellow-400 to-orange-500 hover:from-blue-500 hover:to-indigo-500 text-white text-sm font-bold shadow-lg shadow-blue-500/20 hover:shadow-blue-500/40 hover:-translate-y-0.5 transition-all">
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