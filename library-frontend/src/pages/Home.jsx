import React, { useState, useEffect } from 'react';
import FallingBackground from '../components/FallingBackground';
import LibrarySearch from '../components/LibrarySearch';
import LibraryCard from '../components/LibraryCard';
import WelcomeOffer from '../components/WelcomeOffer';

const Home = () => {
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

  const currentGradient = gradients[loopNum % gradients.length];
  
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
      name: "Scholar's Den",
      location: "Korrah, Near Chowk",
      seats: 12,
      price: 500,
      oldPrice: 550,
      rating: 4.5,
      amenities: ["WiFi", "Power Backup", "Locker"],
      image: "https://images.unsplash.com/photo-1568667256549-094345857637?q=80&w=2515&auto=format&fit=crop"
    },
    {
      id: 3,
      name: "Silent Zone Study Center",
      location: "Babu Gaon",
      seats: 5,
      price: 550,
      oldPrice: 600,
      rating: 4.9,
      amenities: ["AC", "Discussion Room", "Coffee"],
      image: "https://images.unsplash.com/photo-1497366216548-37526070297c?q=80&w=2669&auto=format&fit=crop"
    }
  ];

  return (
    <div className="min-h-screen bg-gray-500 dark:bg-gray-900 transition-colors duration-300">
      
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
        <FallingBackground />
        
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
               <LibrarySearch />
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

      {/* SECTION 2: FEATURED LIBRARIES */}
     
      <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
        
        <div className="flex justify-between items-end mb-8">
          <div>
            <h2 className="text-3xl font-bold text-gray-900 dark:text-white">Trending Libraries</h2>
            <p className="text-gray-500 dark:text-gray-400 mt-1">Most popular among students in Hazaribagh</p>
          </div>
            
          <a href="#" className="text-blue-600 dark:text-blue-400 font-bold hover:underline">View All &rarr;</a>
        </div>

       {/* --- SCROLLING CONTAINER --- */}
        <div className="relative w-full overflow-hidden">
          {/* The Wrapper that moves (animate-scroll defined in index.css) */}
          <div className="animate-scroll flex gap-8 px-4 w-max">
            
            {/* ORIGINAL SET OF CARDS */}
            <div className="flex gap-8">
              {libraries.map((lib) => (
                <div key={`orig-${lib.id}`} className="w-[350px]"> {/* Fixed Width for Cards in Slider */}
                   <LibraryCard library={lib} />
                </div>
              ))}
            </div>

            {/* DUPLICATE SET OF CARDS (For Loop Effect) */}
            <div className="flex gap-8">
              {libraries.map((lib) => (
                <div key={`dup-${lib.id}`} className="w-[350px]">
                   <LibraryCard library={lib} />
                </div>
              ))}
            </div>
             {/* TRIPLICATE SET (Optional, ensures no gaps on wide screens) */}
             <div className="flex gap-8">
              {libraries.map((lib) => (
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