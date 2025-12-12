import React from 'react';
import LibraryCard from '../components/LibraryCard';
import Navbar from '../components/Navbar'; // Assuming you want the navbar here too

const AllLibraries = () => {
  // Mock Data - In real app, fetch this from API
  const allLibraries = [
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
      id: 8,
      name: "Scholar's Den",
      location: "Korrah, Near Chowk",
      seats: 12,
      price: 400,
      oldPrice: 450,
      rating: 4.5,
      amenities: ["WiFi", "Power Backup", "Locker"],
      image: "https://images.unsplash.com/photo-1568667256549-094345857637?q=80&w=2515&auto=format&fit=crop"
    },
    {
      id: 5,
      name: "Silent Zone Study Center",
      location: "Babu Gaon",
      seats: 5,
      price: 450,
      oldPrice: 500,
      rating: 4.9,
      amenities: ["AC", "Discussion Room", "Coffee"],
      image: "https://images.unsplash.com/photo-1497366216548-37526070297c?q=80&w=2669&auto=format&fit=crop"
    },
    {
      id: 2,
      name: "Knowledge Hub",
      location: "Indrapuri",
      seats: 8,
      price: 380,
      oldPrice: 420,
      rating: 4.6,
      amenities: ["WiFi", "Newspaper", "Parking"],
      image: "https://images.unsplash.com/photo-1507842217121-ca1904a5e1a1?q=80&w=2670&auto=format&fit=crop"
    },
    // Add more dummy data here to test scrolling/grid
  ];

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900 transition-colors duration-300">
      <Navbar /> {/* Ensure Navbar is imported */}
      
      <div className="pt-28 pb-12 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Header */}
        <div className="mb-10 text-center">
          <h1 className="text-4xl font-extrabold text-gray-900 dark:text-white mb-4">
            Explore All Libraries
          </h1>
          <p className="text-lg text-gray-600 dark:text-gray-400 max-w-2xl mx-auto">
            Browse through our verified list of study spaces in Hazaribagh. Find the perfect environment for your preparation.
          </p>
        </div>

        {/* Filters (Optional Placeholder) */}
        <div className="flex flex-wrap justify-center gap-4 mb-12">
           <button className="px-4 py-2 rounded-full bg-blue-600 text-white font-medium text-sm shadow-md hover:bg-blue-700 transition-all">All</button>
           <button className="px-4 py-2 rounded-full bg-white dark:bg-gray-800 text-gray-700 dark:text-gray-300 border border-gray-200 dark:border-gray-700 font-medium text-sm hover:bg-gray-50 dark:hover:bg-gray-700 transition-all">Matwari</button>
           <button className="px-4 py-2 rounded-full bg-white dark:bg-gray-800 text-gray-700 dark:text-gray-300 border border-gray-200 dark:border-gray-700 font-medium text-sm hover:bg-gray-50 dark:hover:bg-gray-700 transition-all">Korrah</button>
           <button className="px-4 py-2 rounded-full bg-white dark:bg-gray-800 text-gray-700 dark:text-gray-300 border border-gray-200 dark:border-gray-700 font-medium text-sm hover:bg-gray-50 dark:hover:bg-gray-700 transition-all">Under ₹400</button>
        </div>

        {/* Libraries Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8">
          {allLibraries.map((lib, index) => (
            <div key={lib.id} className="relative">
              {/* Numbering Badge */}
              <div className="absolute -top-4 -left-4 w-10 h-10 bg-gray-900 dark:bg-white text-white dark:text-gray-900 rounded-full flex items-center justify-center font-bold text-lg shadow-lg z-10 border-4 border-gray-50 dark:border-gray-900">
                {index + 1}
              </div>
              
              <LibraryCard library={lib} />
            </div>
          ))}
        </div>

      </div>
    </div>
  );
};

export default AllLibraries;