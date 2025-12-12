import React from 'react';
import { Link } from 'react-router-dom';
const LibraryCard = ({ library }) => {
  const { name, location, seats, price, oldPrice, image, amenities, rating } = library;

  return (
    <div className="group relative bg-white dark:bg-gray-800 rounded-2xl overflow-hidden shadow-lg hover:shadow-2xl transition-all duration-300 transform hover:-translate-y-1 border border-gray-100 dark:border-gray-700">
      
      {/* Image Section */}
      <div className="relative h-48 overflow-hidden">
        <img 
          src={image} 
          alt={name} 
          className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-110"
        />
        
        {/* Live Seat Badge (Top Right) */}
        <div className="absolute top-3 right-3 bg-white/90 dark:bg-black/80 backdrop-blur-sm px-3 py-1 rounded-full flex items-center shadow-sm border border-red-100 dark:border-red-900/50">
          <span className="relative flex h-2 w-2 mr-2">
            <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-red-400 opacity-75"></span>
            <span className="relative inline-flex rounded-full h-2 w-2 bg-red-500"></span>
          </span>
          <span className="text-xs font-bold text-red-600 dark:text-red-400">
            {seats} Seats Left
          </span>
        </div>

        {/* Location Badge (Bottom Left) */}
        <div className="absolute bottom-3 left-3 bg-black/60 backdrop-blur-md px-3 py-1 rounded-lg">
          <p className="text-xs text-white font-medium flex items-center">
            📍 {location}
          </p>
        </div>
      </div>

      {/* Content Section */}
      <div className="p-5">
        <div className="flex justify-between items-start mb-2">
          <h3 className="text-lg font-bold text-gray-900 dark:text-white leading-tight">
            {name}
          </h3>
          <div className="flex items-center bg-yellow-100 dark:bg-yellow-900/30 px-2 py-1 rounded">
            <span className="text-yellow-500 mr-1">★</span>
            <span className="text-xs font-bold text-yellow-700 dark:text-yellow-400">{rating}</span>
          </div>
        </div>

        {/* Amenities */}
        <div className="flex space-x-2 mb-4 text-gray-500 dark:text-gray-400 text-xs">
          {amenities.map((item, index) => (
            <span key={index} className="px-2 py-1 bg-gray-100 dark:bg-gray-700 rounded border border-gray-200 dark:border-gray-600">
              {item}
            </span>
          ))}
        </div>

        {/* Divider */}
        <div className="h-px w-full bg-gray-100 dark:bg-gray-700 my-4"></div>

        {/* Footer: Price & Action */}
        <div className="flex justify-between items-center">
          <div>
            <p className="text-xs text-gray-400 line-through">₹{oldPrice}/mo</p>
            <p className="text-xl font-extrabold text-blue-600 dark:text-blue-400">
              ₹{price}<span className="text-xs text-gray-500 dark:text-gray-400 font-normal">/month</span>
            </p>
          </div>
    
<Link 
  to={`/book/${library.id}`} 
  className="px-4 py-2 bg-gray-900 dark:bg-white text-white dark:text-black text-sm font-bold rounded-lg hover:bg-gray-800 dark:hover:bg-gray-200 transition-colors shadow-lg"
>
  Book Seat
</Link>
        </div>
      </div>
    </div>
  );
};

export default LibraryCard; 