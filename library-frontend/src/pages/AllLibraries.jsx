import React, { useState, useEffect } from 'react';
import axios from 'axios'; // Import Axios
import LibraryCard from '../components/LibraryCard';
import Navbar from '../components/Navbar'; 


const AllLibraries = () => {
  // 1. STATE: Hold the list of libraries from the backend
  const [libraries, setLibraries] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  // 2. FETCH & MAP DATA
  useEffect(() => {
    const fetchLibraries = async () => {
      try {
        const response = await axios.get('http://localhost:8080/api/libraries');
        
        // --- CRITICAL STEP: MAP BACKEND DATA TO FRONTEND PROPS ---
        const formattedData = response.data.map(lib => ({
            id: lib.id,
            name: lib.name,
            // Backend "locationTag" or "address" -> Frontend "location"
            location: lib.locationTag || lib.address || "Hazaribagh", 
            // Backend "totalSeats" -> Frontend "seats"
            seats: lib.totalSeats || 0,
            // Backend "offerPrice" -> Frontend "price"
            price: lib.offerPrice,
            // Backend "originalPrice" -> Frontend "oldPrice"
            oldPrice: lib.originalPrice,
            rating: 4.5, // Hardcoded for now if backend doesn't have it
            amenities: lib.amenities || ["WiFi", "AC"], 
            // Backend "images" (Array) -> Frontend "image" (String)
            image: (lib.images && lib.images.length > 0) 
                   ? lib.images[0] 
                   : "https://images.unsplash.com/photo-1521587760476-6c12a4b040da?q=80&w=2670&auto=format&fit=crop"
        }));

        setLibraries(formattedData);
        setLoading(false);
      } catch (err) {
        console.error("Error fetching libraries:", err);
        setError("Failed to load libraries.");
        setLoading(false);
      }
    };

    fetchLibraries();
  }, []);

  return (

       
    
    <div className="min-h-screen bg-gray-900 dark:bg-gray-900 transition-colors duration-300">
      
   {/* 2. Background Component (Positioned absolutely behind content) */}
      <div className="absolute inset-0 z-0">
     
      </div>

      {/* 3. Navbar (High z-index to stay clickable) */}
      
      
      {/* 4. Main Content (z-10 to sit above background) */}
      <div className="relative z-10 pt-28 pb-12 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="mb-10 text-center">
          <h1 className="text-4xl font-extrabold text-white mb-4">
            Explore All Libraries
          </h1>
          <p className="text-lg text-gray-400 max-w-2xl mx-auto">
            Browse through our verified list of study spaces in Hazaribagh.
          </p>
        </div>

        {/* Filters */}
        <div className="flex flex-wrap justify-center gap-4 mb-12">
           <button className="px-4 py-2 rounded-full bg-blue-600 text-white font-medium text-sm shadow-md hover:bg-blue-700 transition-all">All</button>
           <button className="px-4 py-2 rounded-full bg-gray-800 text-gray-300 border border-gray-700 font-medium text-sm hover:bg-gray-700 transition-all">Matwari</button>
           <button className="px-4 py-2 rounded-full bg-gray-800 text-gray-300 border border-gray-700 font-medium text-sm hover:bg-gray-700 transition-all">Korrah</button>
           <button className="px-4 py-2 rounded-full bg-gray-800 text-gray-300 border border-gray-700 font-medium text-sm hover:bg-gray-700 transition-all">Under ₹400</button>
        </div>

        {/* Loading / Error States */}
        {loading && <div className="text-center text-white">Loading libraries...</div>}
        {error && <div className="text-center text-red-400">{error}</div>}

        {/* Libraries Grid */}
        {!loading && !error && (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8">
            {libraries.map((lib, index) => (
                <div key={lib.id} className="relative">
                {/* Numbering Badge */}
                <div className="absolute -top-4 -left-4 w-10 h-10 bg-white text-gray-900 rounded-full flex items-center justify-center font-bold text-lg shadow-lg z-10 border-4 border-gray-900">
                    {index + 1}
                </div>
                
                {/* PASS THE TRANSFORMED DATA TO THE CARD */}
                <LibraryCard library={lib} />
                </div>
            ))}
            </div>
        )}

      </div>
    </div>
    

  );
};

export default AllLibraries;