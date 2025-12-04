import React, { useState } from 'react';

const LibrarySearch = () => {
  const [activeTab, setActiveTab] = useState('location'); // 'location' or 'budget'

  return (
    <div className="w-full max-w-3xl mx-auto mt-10 p-2 bg-white/10 backdrop-blur-md border border-white/20 rounded-2xl shadow-2xl animate-in fade-in slide-in-from-bottom-8 duration-700">
      
      {/* Tabs to switch between Location and Budget search */}
      <div className="flex space-x-2 p-1 mb-2">
        <button 
          onClick={() => setActiveTab('location')}
          className={`flex-1 py-2 px-4 rounded-xl text-sm font-bold transition-all ${
            activeTab === 'location' 
              ? 'bg-blue-600 text-white shadow-lg' 
              : 'text-gray-300 hover:bg-white/5 hover:text-white'
          }`}
        >
          📍 By Location
        </button>
        <button 
          onClick={() => setActiveTab('budget')}
          className={`flex-1 py-2 px-4 rounded-xl text-sm font-bold transition-all ${
            activeTab === 'budget' 
              ? 'bg-emerald-600 text-white shadow-lg' 
              : 'text-gray-300 hover:bg-white/5 hover:text-white'
          }`}
        >
          💰 By Budget
        </button>
      </div>

      {/* Input Field Section */}
      <div className="relative flex items-center bg-white rounded-xl overflow-hidden shadow-inner">
        
        {/* Search Icon */}
        <div className="pl-4 text-gray-400">
          <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
          </svg>
        </div>

        {/* Dynamic Input based on Tab */}
        <input 
          type="text" 
          placeholder={activeTab === 'location' ? "Search 'Matwari', 'Korrah', 'Babu Gaon'..." : "Enter max price (e.g. 400)"}
          className="w-full py-4 px-4 text-gray-800 text-lg font-medium outline-none placeholder-gray-400"
        />

        {/* Search Button */}
        <button className="hidden sm:block m-1 px-8 py-3 bg-gray-900 text-white font-bold rounded-lg hover:bg-gray-800 transition-colors">
          Search
        </button>
      </div>

      {/* Quick Filters / Tags */}
      <div className="mt-3 flex flex-wrap gap-2 justify-center sm:justify-start px-2">
        <span className="text-xs text-gray-300 font-medium uppercase tracking-wider py-1">Popular:</span>
        {['Matwari', 'Korrah', 'Babu Gaon', 'Indrapuri'].map((loc) => (
          <button key={loc} className="px-3 py-1 text-xs font-semibold rounded-full bg-white/10 text-white border border-white/10 hover:bg-white/20 transition-all">
            {loc}
          </button>
        ))}
      </div>
    </div>
  );
};

export default LibrarySearch;