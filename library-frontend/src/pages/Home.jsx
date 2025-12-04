import React from 'react';
import FallingBackground from '../components/FallingBackground';
import LibrarySearch from '../components/LibrarySearch';
import LibraryCard from '../components/LibraryCard'; // <--- Import the card

const Home = () => {
  // Fake Data for Hazaribagh Libraries
  const libraries = [
    {
      id: 1,
      name: "Focus Point Library",
      location: "Matwari, Hazaribagh",
      seats: 3,
      price: 350,
      oldPrice: 400,
      rating: 4.8,
      amenities: ["AC", "WiFi", "RO Water"],
      image: "https://images.unsplash.com/photo-1521587760476-6c12a4b040da?q=80&w=2670&auto=format&fit=crop"
    },
    {
      id: 2,
      name: "Scholar's Den",
      location: "Korrah, Near Chowk",
      seats: 12,
      price: 350,
      oldPrice: 450,
      rating: 4.5,
      amenities: ["WiFi", "Power Backup", "Locker"],
      image: "https://images.unsplash.com/photo-1568667256549-094345857637?q=80&w=2515&auto=format&fit=crop"
    },
    {
      id: 3,
      name: "Silent Zone Study Center",
      location: "Babu Gaon",
      seats: 5,
      price: 350,
      oldPrice: 400,
      rating: 4.9,
      amenities: ["AC", "Discussion Room", "Coffee"],
      image: "https://images.unsplash.com/photo-1497366216548-37526070297c?q=80&w=2669&auto=format&fit=crop"
    }
  ];

  return (
    // Use flex-col to stack sections vertically
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900 transition-colors duration-300">
      
      {/* SECTION 1: HERO (Search & Background) */}
      <div className="relative h-[80vh] flex flex-col items-center justify-center overflow-hidden">
        <div className="absolute inset-0 z-0">
          <img 
            src="https://images.unsplash.com/photo-1497633762265-9d179a990aa6?q=80&w=2673&auto=format&fit=crop" 
            alt="Hazaribagh Study Center" 
            className="w-full h-full object-cover"
          />
          <div className="absolute inset-0 bg-black/60"></div>
        </div>
        <FallingBackground />
        
        <div className="relative z-10 w-full max-w-7xl mx-auto px-4 flex flex-col items-center text-center mt-16">
          <h1 className="text-4xl sm:text-6xl font-extrabold tracking-tight text-white drop-shadow-2xl mb-4">
            Find Your <span className="text-transparent bg-clip-text bg-gradient-to-r from-blue-300 to-indigo-300">Focus Zone</span>
          </h1>
          <p className="max-w-2xl text-lg text-gray-200 font-medium mb-8 drop-shadow-md">
            Join 1000+ students booking the best private libraries in Hazaribagh.
          </p>
          <LibrarySearch />
        </div>
      </div>

      {/* SECTION 2: FEATURED LIBRARIES */}
      <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
        <div className="flex justify-between items-end mb-8">
          <div>
            <h2 className="text-3xl font-bold text-gray-900 dark:text-white">Trending Spaces</h2>
            <p className="text-gray-500 dark:text-gray-400 mt-1">Most popular among students in Hazaribagh</p>
          </div>
          <a href="#" className="text-blue-600 dark:text-blue-400 font-bold hover:underline">View All &rarr;</a>
        </div>

        {/* The Grid of Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {libraries.map((lib) => (
            <LibraryCard key={lib.id} library={lib} />
          ))}
        </div>
      </div>

    </div>
  );
};

export default Home;