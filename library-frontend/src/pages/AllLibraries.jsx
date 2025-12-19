import React, { useState, useEffect } from 'react';
import axios from 'axios'; 
import LibraryCard from '../components/LibraryCard';
// import Navbar from '../components/Navbar'; // Uncomment if you use it inside

const AllLibraries = () => {
  // 1. STATE MANAGEMENT
  const [libraries, setLibraries] = useState([]);       // Stores RAW data from backend
  const [filteredData, setFilteredData] = useState([]); // Stores FILTERED data to show
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  // Search & Filter State
  const [searchQuery, setSearchQuery] = useState('');   // User text input
  const [activeFilter, setActiveFilter] = useState('All'); // 'All', 'Matwari', 'Korrah', 'Under 400'

  // 2. FETCH DATA (Run once on mount)
  useEffect(() => {
    const fetchLibraries = async () => {
      try {
        const response = await axios.get('http://localhost:8080/api/libraries');
        
        const formattedData = response.data.map(lib => ({
            id: lib.id,
            name: lib.name,
            location: lib.locationTag || lib.address || "Hazaribagh", 
            seats: lib.totalSeats || 0,
            price: lib.offerPrice,
            oldPrice: lib.originalPrice,
            rating: 4.5, 
            amenities: lib.amenities || ["WiFi", "AC"], 
            image: (lib.images && lib.images.length > 0) 
                   ? lib.images[0] 
                   : "https://images.unsplash.com/photo-1521587760476-6c12a4b040da?q=80&w=2670&auto=format&fit=crop"
        }));

        setLibraries(formattedData);
        setFilteredData(formattedData); // Initially, show everything
        setLoading(false);
      } catch (err) {
        console.error("Error fetching libraries:", err);
        setError("Failed to load libraries.");
        setLoading(false);
      }
    };

    fetchLibraries();
  }, []);

  // 3. FILTERING LOGIC (Runs whenever Search or Filter changes)
  useEffect(() => {
    let result = libraries;

    // A. Apply Category Filter (Matwari, Korrah, Price)
    if (activeFilter === 'Matwari') {
        result = result.filter(lib => lib.location.toLowerCase().includes('matwari'));
    } else if (activeFilter === 'Korrah') {
        result = result.filter(lib => lib.location.toLowerCase().includes('korrah'));
    } else if (activeFilter === 'Under 400') {
        result = result.filter(lib => lib.price <= 400);
    } else if (activeFilter === 'AC') {
        result = result.filter(lib => lib.amenities.includes('AC'));
    }

    // B. Apply Search Text (Name or Location)
    if (searchQuery) {
        const lowerQuery = searchQuery.toLowerCase();
        result = result.filter(lib => 
            lib.name.toLowerCase().includes(lowerQuery) || 
            lib.location.toLowerCase().includes(lowerQuery)
        );
    }

    setFilteredData(result);

  }, [searchQuery, activeFilter, libraries]); // Re-run when these change

  // --- HELPER TO RENDER FILTER BUTTONS ---
  const FilterButton = ({ label, value }) => (
    <button 
      onClick={() => setActiveFilter(value)}
      className={`px-5 py-2 rounded-full font-medium text-sm transition-all shadow-sm border ${
        activeFilter === value 
          ? 'bg-blue-600 text-white border-blue-600 shadow-blue-500/30' 
          : 'bg-gray-800 text-gray-300 border-gray-700 hover:bg-gray-700 hover:text-white'
      }`}
    >
      {label}
    </button>
  );

  return (
    <div className="min-h-screen bg-gray-900 dark:bg-gray-900 transition-colors duration-300 font-sans">
      
      {/* Background Component placeholder */}
      <div className="absolute inset-0 z-0"></div>

      {/* Main Content */}
      <div className="relative z-10 pt-28 pb-12 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Header */}
        <div className="mb-8 text-center animate-in fade-in slide-in-from-bottom-8 duration-700">
          <h1 className="text-4xl font-extrabold text-white mb-4">
            Explore All Libraries
          </h1>
          <p className="text-lg text-gray-400 max-w-2xl mx-auto">
            Browse through our verified list of study spaces in Hazaribagh.
          </p>
        </div>

        {/* --- SEARCH & FILTERS SECTION --- */}
        <div className="max-w-4xl mx-auto mb-12 space-y-6">
            
            {/* 1. Search Bar */}
            <div className="relative group">
                <div className="absolute -inset-0.5 bg-gradient-to-r from-blue-600 to-cyan-600 rounded-xl opacity-30 group-hover:opacity-60 blur transition duration-500"></div>
                <div className="relative flex items-center bg-gray-800 rounded-xl overflow-hidden border border-gray-700">
                    <span className="pl-4 text-gray-400">
                        <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                        </svg>
                    </span>
                    <input 
                        type="text"
                        placeholder="Search by library name, location..."
                        value={searchQuery}
                        onChange={(e) => setSearchQuery(e.target.value)}
                        className="w-full py-3.5 px-4 bg-transparent text-white placeholder-gray-500 outline-none text-base"
                    />
                    {searchQuery && (
                        <button onClick={() => setSearchQuery('')} className="pr-4 text-gray-500 hover:text-white">✕</button>
                    )}
                </div>
            </div>

            {/* 2. Filter Buttons */}
            <div className="flex flex-wrap justify-center gap-3">
               <FilterButton label="All" value="All" />
               <FilterButton label="📍 Matwari" value="Matwari" />
               <FilterButton label="📍 Korrah" value="Korrah" />
               <FilterButton label="💰 Under ₹400" value="Under 400" />
               <FilterButton label="❄️ AC" value="AC" />
            </div>
        </div>

        {/* --- RESULTS SECTION --- */}
        {/* Loading / Error States */}
        {loading && (
             <div className="text-center py-20">
                 <div className="animate-spin h-8 w-8 border-4 border-blue-500 border-t-transparent rounded-full mx-auto mb-4"></div>
                 <p className="text-gray-400">Loading libraries...</p>
             </div>
        )}
        
        {error && <div className="text-center text-red-400 py-10">{error}</div>}

        {/* Libraries Grid */}
        {!loading && !error && (
            <>
                {filteredData.length > 0 ? (
                    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8">
                        {filteredData.map((lib, index) => (
                            <div key={lib.id} className="relative animate-in fade-in zoom-in duration-500" style={{ animationDelay: `${index * 100}ms` }}>
                                
                                {/* Numbering Badge */}
                                <div className="absolute -top-3 -left-3 w-8 h-8 bg-gray-800 text-white border border-gray-700 rounded-full flex items-center justify-center font-bold text-sm shadow-xl z-10">
                                    {index + 1}
                                </div>
                                
                                <LibraryCard library={lib} />
                            </div>
                        ))}
                    </div>
                ) : (
                    // Empty State if no match found
                    <div className="text-center py-16 bg-white/5 rounded-3xl border border-dashed border-white/10">
                        <div className="text-4xl mb-4">🔍</div>
                        <h3 className="text-xl font-bold text-white mb-2">No libraries found</h3>
                        <p className="text-gray-400">
                            We couldn't find any libraries matching "{searchQuery}" or the selected filters.
                        </p>
                        <button 
                            onClick={() => {setSearchQuery(''); setActiveFilter('All');}}
                            className="mt-6 px-6 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition"
                        >
                            Clear Filters
                        </button>
                    </div>
                )}
            </>
        )}

      </div>
    </div>
  );
};

export default AllLibraries;