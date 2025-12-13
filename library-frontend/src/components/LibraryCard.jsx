import React from 'react';
import { useNavigate } from 'react-router-dom'; 

const LibraryCard = ({ library }) => {
  const { id, name, location, seats, price, oldPrice, image, amenities, rating } = library;
  const navigate = useNavigate(); 

  const goToDetails = () => {
    navigate(`/libraries/${id}`);
  };

  return (
    <div 
      onClick={goToDetails}
      // FIXED: Removed 'dark:bg-gray-800' and 'dark:border-gray-700'. 
      // Kept 'bg-white' to ensure the card pops against the dark page background.
      className="group relative bg-white  rounded-2xl overflow-hidden shadow-lg hover:shadow-2xl transition-all duration-300 transform hover:-translate-y-1 border border-gray-100 cursor-pointer"
    >
      
      {/* --- Image Section --- */}
      <div className="relative h-48 overflow-hidden">
        <img 
          src={image} 
          alt={name} 
          className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-110"
        />
        
        {/* Seats Badge */}
        <div className="absolute top-3 right-3 bg-white/95 backdrop-blur-sm px-3 py-1 rounded-full flex items-center shadow-sm border border-red-100">
          <span className="relative flex h-2 w-2 mr-2">
            <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-red-400 opacity-75"></span>
            <span className="relative inline-flex rounded-full h-2 w-2 bg-red-500"></span>
          </span>
          <span className="text-xs font-bold text-red-600">
            {seats} Seats Left
          </span>
        </div>

        {/* Location Badge */}
        <div className="absolute bottom-3 left-3 bg-black/70 backdrop-blur-md px-3 py-1 rounded-lg">
          <p className="text-xs text-white font-medium flex items-center gap-1">
            📍 {location}
          </p>
        </div>
      </div>

      {/* --- Content Section --- */}
      <div className="p-5">
        
        {/* Title & Rating */}
        <div className="flex justify-between items-start mb-2">
          {/* FIXED: Removed 'dark:text-white' to keep text black */}
          <h3 className="text-lg font-bold text-gray-900 leading-tight">
            {name}
          </h3>
          <div className="flex items-center bg-yellow-100 px-2 py-1 rounded">
            <span className="text-yellow-500 mr-1 text-sm">★</span>
            <span className="text-xs font-bold text-yellow-700">{rating}</span>
          </div>
        </div>

        {/* Amenities Pills */}
        <div className="flex flex-wrap gap-2 mb-4">
          {amenities.slice(0, 3).map((item, index) => (
            // FIXED: Standardized colors to match white card theme
            <span key={index} className="px-2 py-1 bg-gray-100 text-gray-600 text-[10px] uppercase font-bold rounded border border-gray-200">
              {item}
            </span>
          ))}
        </div>

        {/* Divider */}
        <div className="h-px w-full bg-gray-100 my-4"></div>

        {/* Footer: Price & Button */}
        <div className="flex justify-between items-end">
          <div>
            <p className="text-xs text-gray-400 line-through mb-0.5">₹{oldPrice}/mo</p>
            {/* FIXED: Enforced blue text */}
            <p className="text-xl font-extrabold text-blue-600 leading-none">
              ₹{price}<span className="text-xs text-gray-500 font-normal">/month</span>
            </p>
          </div>
    
          {/* Action Button */}
          {/* FIXED: Enforced Black Button (bg-gray-900) with White Text */}
          <button 
            className="px-5 py-2.5 bg-gray-900 text-white text-sm font-bold rounded-xl hover:bg-black transition-colors shadow-lg"
          >
            Book Seat
          </button>
        </div>
      </div>
    </div>
  );
};

export default LibraryCard;