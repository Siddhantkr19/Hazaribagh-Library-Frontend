import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';

const Navbar = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      setScrolled(window.scrollY > 20);
    };
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  return (
    <nav className={`fixed w-full z-50 transition-all duration-300 ${
      scrolled 
        ? 'bg-gray-900/80 backdrop-blur-lg border-b border-white/10 py-3' 
        : 'bg-transparent py-5'
    }`}>
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center">
          
          {/* BRANDING: Logo with Icon */}
          <Link to="/" className="flex items-center gap-3 group">
            <div className="bg-blue-600 p-2 rounded-lg text-white shadow-lg shadow-blue-500/20 transform group-hover:rotate-3 transition-transform">
              {/* Simple Book Icon */}
              <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <path d="M4 19.5A2.5 2.5 0 0 1 6.5 17H20" />
                <path d="M6.5 2H20v20H6.5A2.5 2.5 0 0 1 4 19.5v-15A2.5 2.5 0 0 1 6.5 2z" />
              </svg>
            </div>
            <div className="flex flex-col">
              <span className="text-xl font-bold text-white leading-none tracking-tight">
                Lib<span className="text-blue-400">Connect</span>
              </span>
              <span className="text-[10px] text-gray-400 uppercase tracking-widest leading-none mt-1">Hazaribagh</span>
            </div>
          </Link>

          {/* DESKTOP NAV: Centered Floating Pill */}
          <div className="hidden md:flex items-center space-x-1 bg-white/5 backdrop-blur-md px-2 py-1.5 rounded-full border border-white/10 shadow-xl">
            <Link to="/" className="px-5 py-1.5 text-sm font-medium text-white bg-white/10 rounded-full shadow-inner transition-all">
              Home
            </Link>
            <a href="#libraries" className="px-5 py-1.5 text-sm font-medium text-gray-300 hover:text-white hover:bg-white/5 rounded-full transition-all">
              Browse Libraries
            </a>
            <a href="#about" className="px-5 py-1.5 text-sm font-medium text-gray-300 hover:text-white hover:bg-white/5 rounded-full transition-all">
              How it Works
            </a>
          </div>

          {/* AUTH BUTTONS: Marketplace Style */}
          <div className="hidden md:flex items-center gap-5">
            <Link to="#" className="text-xs font-semibold text-gray-400 hover:text-white transition-colors uppercase tracking-wide">
              Partner Login
            </Link>
            <Link to="#" className="px-6 py-2.5 bg-blue-600 hover:bg-blue-500 text-white text-sm font-bold rounded-xl shadow-lg shadow-blue-600/20 transition-all transform hover:-translate-y-0.5">
              Student Sign In
            </Link>
          </div>

          {/* MOBILE TOGGLE */}
          <div className="md:hidden">
            <button onClick={() => setIsOpen(!isOpen)} className="text-white p-2">
              <svg className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                {isOpen ? (
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                ) : (
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
                )}
              </svg>
            </button>
          </div>
        </div>
      </div>

      {/* MOBILE MENU */}
      <div className={`md:hidden absolute w-full bg-gray-900/95 backdrop-blur-xl border-b border-gray-800 transition-all duration-300 ${
        isOpen ? 'opacity-100 translate-y-0' : 'opacity-0 -translate-y-4 pointer-events-none'
      }`}>
        <div className="px-4 py-6 space-y-4">
          <Link to="/" className="block text-lg font-medium text-white hover:text-blue-400">Home</Link>
          <a href="#libraries" className="block text-lg font-medium text-gray-300 hover:text-white">Browse Libraries</a>
          <a href="#about" className="block text-lg font-medium text-gray-300 hover:text-white">How it Works</a>
          <div className="pt-4 border-t border-gray-800 flex flex-col gap-3">
            <Link to="#" className="w-full py-3 text-center text-gray-400 font-medium border border-gray-700 rounded-xl hover:bg-gray-800 hover:text-white">
              Library Owner Login
            </Link>
            <Link to="#" className="w-full py-3 text-center bg-blue-600 text-white font-bold rounded-xl hover:bg-blue-500 shadow-lg shadow-blue-900/20">
              Student Sign In
            </Link>
          </div>
        </div>
      </div>
    </nav>
  );
};

export default Navbar;