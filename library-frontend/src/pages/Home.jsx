import React, { useState, useEffect , useRef } from 'react';

import LibrarySearch from '../components/LibrarySearch';
import LibraryCard from '../components/LibraryCard';
import WelcomeOffer from '../components/WelcomeOffer';
import { Link } from 'react-router-dom';
import axios from 'axios';

const Home = () => {

 const [trendingLibraries, setTrendingLibraries] = useState([]);
  const [searchResults, setSearchResults] = useState(null); // null means "no search active"
  const [loading, setLoading] = useState(true);
  
  // Ref to auto-scroll to results
  const resultsRef = useRef(null);



  const [text, setText] = useState('');
  const [isDeleting, setIsDeleting] = useState(false);
  const [loopNum, setLoopNum] = useState(0);
  const [typingSpeed, setTypingSpeed] = useState(150);


  const phrases = ["Focus Zone", "Best Library", "Study Space"];
  
  const gradients = [
    "from-purple-400 to-pink-400",
    "from-amber-200 to-yellow-500",
    "from-cyan-300 to-blue-500",
    "from-lime-300 to-emerald-400",
    "from-fuchsia-300 to-violet-400",
    "from-red-400 to-orange-400"
  ];

const SkeletonCard = () => (
  <div className="bg-gray-800/50 rounded-xl overflow-hidden border border-white/5 shadow-xl">
    <div className="h-48 bg-gray-700 animate-pulse"></div> {/* Image Placeholder */}
    <div className="p-5 space-y-3">
      <div className="h-6 bg-gray-700 rounded w-3/4 animate-pulse"></div> {/* Title */}
      <div className="h-4 bg-gray-700 rounded w-1/2 animate-pulse"></div> {/* Location */}
      <div className="flex justify-between pt-4">
        <div className="h-8 bg-gray-700 rounded w-20 animate-pulse"></div>
        <div className="h-8 bg-gray-700 rounded w-20 animate-pulse"></div>
      </div>
    </div>
  </div>
);
const [isSearching, setIsSearching] = useState(false);
 const currentGradient = gradients[loopNum % gradients.length];
  useEffect(() => {
    const handleTyping = () => {
      const i = loopNum % phrases.length;
      const fullText = phrases[i];
      setText(isDeleting ? fullText.substring(0, text.length - 1) : fullText.substring(0, text.length + 1));
      setTypingSpeed(isDeleting ? 50 : 150);
      if (!isDeleting && text === fullText) { setTimeout(() => setIsDeleting(true), 2000); } 
      else if (isDeleting && text === '') { setIsDeleting(false); setLoopNum(loopNum + 1); }
    };
    const timer = setTimeout(handleTyping, typingSpeed);
    return () => clearTimeout(timer);
  }, [text, isDeleting, loopNum]);

  // --- HELPER: MAPPER FUNCTION ---
  const mapBackendDataToFrontend = (data) => {
    return data.map(lib => ({
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
  };
  
 // --- 2. INITIAL FETCH (Populates Trending Only) ---
  useEffect(() => {
    const fetchTrendingLibraries = async () => {
      try {
        const response = await axios.get('http://localhost:8080/api/libraries');
        const formattedData = mapBackendDataToFrontend(response.data);
        setTrendingLibraries(formattedData.slice(0, 5)); // Keep distinct
        setLoading(false);
      } catch (error) {
        console.error("Failed to fetch trending libraries", error);
        setLoading(false);
      }
    };
    fetchTrendingLibraries();
  }, []);


 // --- UPDATED SEARCH HANDLER ---
  const handleSearchResults = (data) => {
    const formattedData = mapBackendDataToFrontend(data);
    setSearchResults(formattedData);
    setIsSearching(false); // Stop loading
    
    // Scroll to results
    setTimeout(() => {
        resultsRef.current?.scrollIntoView({ behavior: 'smooth', block: 'start' });
    }, 100);
  };

  // --- 4. CLEAR SEARCH ---
  const clearSearch = () => {
    setSearchResults(null);
  };
  return (
    <div className="min-h-screen bg-gray-900 dark:bg-gray-900 transition-colors duration-300">
      
      {/* SECTION 1: HERO */}
      <div className="relative min-h-[90vh] flex flex-col justify-center overflow-hidden pb-10">
        <div className="absolute inset-0 z-0">
          <img 
            src="Background Image.jpg" 
            alt="Hazaribagh Study Center" 
            className="w-full h-full object-cover brightness-95"
          />
          <div className="absolute inset-0 bg-black/40"></div>
        </div>
      
        
        {/* --- GRID CONTAINER --- */}
        <div className="relative z-10 w-full max-w-7xl mx-auto px-6 grid grid-cols-1 lg:grid-cols-2 gap-8 items-center mt-24">
          
          {/* --- LEFT COLUMN: Text + Search --- */}
          <div className="text-center lg:text-left">
            <h1 className="text-4xl sm:text-6xl font-extrabold tracking-tight drop-shadow-2xl mb-6 h-auto sm:h-32 leading-tight">
              <span className="text-transparent bg-clip-text bg-gradient-to-r from-rose-300 to-orange-300">
                Find Your
              </span> <br className="hidden sm:block" />
              
              <span className={`text-transparent bg-clip-text bg-gradient-to-r ${currentGradient} transition-all duration-500`}>
                {text}
              </span>
            </h1>

            <p className="max-w-2xl text-lg text-gray-200 font-medium mb-8 drop-shadow-md mx-auto lg:mx-0">
              Join 1000+ students booking the best private libraries in Hazaribagh.
            </p>
            <div className="w-full max-w-xl mx-auto lg:mx-0">
              <LibrarySearch onSearch={handleSearchResults} />
            </div>
            {/* MOVED SEARCH BAR INSIDE LEFT COLUMN */}
           
          </div>
     
          {/* --- RIGHT COLUMN: Welcome Offer --- */}
          <div className="hidden lg:flex justify-end pr-8">
            
             <div className="w-full max-w-sm">
                <WelcomeOffer />
             </div>
          </div>

        </div>
      </div>



     {/* ================= SECTION 2: SEARCH RESULTS ================= */}
      {/* Logic: Show if we have results OR if we are currently searching */}
      {(searchResults || isSearching) && (
        <div ref={resultsRef} className="relative z-20 py-12 bg-gray-900/95 border-y border-white/10 backdrop-blur-lg">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                
                {/* Header */}
                <div className="flex justify-between items-center mb-8">
                    <div>
                        <h2 className="text-2xl font-bold text-white flex items-center gap-2">
                            <span className="text-blue-500">🔍</span> Search Results
                        </h2>
                        {/* Only show count if we are NOT loading */}
                        {!isSearching && searchResults && (
                            <p className="text-gray-400 text-sm mt-1">
                                Found <span className="text-white font-bold">{searchResults.length}</span> libraries.
                            </p>
                        )}
                    </div>
                    
                    {/* Only show Clear button if we have results and not loading */}
                    {!isSearching && (
                         <button onClick={clearSearch} className="px-4 py-2 bg-red-500/20 text-red-400 hover:bg-red-500 hover:text-white rounded-lg text-sm font-bold border border-red-500/30 transition-all">✕ Clear Search</button>
                    )}
                </div>

                {/* Results Grid - Handles Loading State */}
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8">
                    {isSearching ? (
                        // 1. SHOW SKELETONS IF LOADING
                        <>
                            <SkeletonCard />
                            <SkeletonCard />
                            <SkeletonCard />
                        </>
                    ) : searchResults && searchResults.length > 0 ? (
                        // 2. SHOW REAL CARDS IF DATA EXISTS
                        searchResults.map((lib) => (
                            <div key={`search-${lib.id}`} className="transform hover:scale-[1.02] transition-transform duration-300">
                                <LibraryCard library={lib} />
                            </div>
                        ))
                    ) : (
                        // 3. SHOW EMPTY STATE
                        <div className="col-span-3 text-center py-10 bg-white/5 rounded-2xl border border-dashed border-white/20">
                            <p className="text-xl text-gray-400">No libraries found.</p>
                            <p className="text-sm text-gray-500 mt-2">Try searching for "Matwari", "Korrah" or a different price.</p>
                        </div>
                    )}
                </div>
            </div>
        </div>
      )}

      {/* SECTION 3: FEATURED LIBRARIES */}
     
      <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16  ">
        
        <div className="flex justify-between items-end mb-8">
          <div>
            <h2 className="text-3xl font-bold text-gray-200 dark:text-white">Trending Libraries</h2>
            <p className="text-gray-500 dark:text-gray-400 mt-1">Most popular among students in Hazaribagh</p>
          </div>
            
         <Link to="/libraries" className="text-blue-600 dark:text-blue-400 font-bold hover:underline">View All &rarr;</Link>
        </div>

       {/* --- SCROLLING CONTAINER --- */}
        <div className="relative w-full overflow-hidden">
        
          <div className="animate-scroll flex gap-8 px-4 w-max">
            
            {/* ORIGINAL SET OF CARDS */}
            <div className="flex gap-8">
              {trendingLibraries.map((lib) => (
                <div key={`orig-${lib.id}`} className="w-[350px]"> {/* Fixed Width for Cards in Slider */}
                   <LibraryCard library={lib} />
                </div>
              ))}
            </div>

            {/* DUPLICATE SET OF CARDS (For Loop Effect) */}
            <div className="flex gap-8">
              {trendingLibraries.map((lib) => (
                <div key={`dup-${lib.id}`} className="w-[350px]">
                   <LibraryCard library={lib} />
                </div>
              ))}
            </div>
             {/* TRIPLICATE SET (Optional, ensures no gaps on wide screens) */}
             <div className="flex gap-8">
              {trendingLibraries.map((lib) => (
                <div key={`tri-${lib.id}`} className="w-[350px]">
                   <LibraryCard library={lib} />
                </div>
              ))}
            </div>

          </div>
        </div>
      </div>

    </div>
  );
};

export default Home;