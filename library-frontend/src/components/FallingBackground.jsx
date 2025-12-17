import React, { useEffect, useState } from 'react';

const icons = {
  book: (
    <svg xmlns="http://www.w3.org/2000/svg" width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <path d="M4 19.5A2.5 2.5 0 0 1 6.5 17H20" />
      <path d="M6.5 2H20v20H6.5A2.5 2.5 0 0 1 4 19.5v-15A2.5 2.5 0 0 1 6.5 2z" />
    </svg>
  ),
  pen: (
    <svg xmlns="http://www.w3.org/2000/svg" width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <path d="M17 3a2.828 2.828 0 1 1 4 4L7.5 20.5 2 22l1.5-5.5L17 3z" />
    </svg>
  ),
  notebook: (
    <svg xmlns="http://www.w3.org/2000/svg" width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <path d="M2 3h6a4 4 0 0 1 4 4v14a3 3 0 0 0-3-3H2z" />
      <path d="M22 3h-6a4 4 0 0 0-4 4v14a3 3 0 0 1 3-3h7z" />
    </svg>
  )
};

const FallingBackground = () => {
  const [items, setItems] = useState([]);

  useEffect(() => {
    const newItems = Array.from({ length: 35 }).map((_, i) => {
      const types = Object.keys(icons);
      const type = types[Math.floor(Math.random() * types.length)];
      
      // Random drift (side-to-side movement) for natural falling effect
      const drift = Math.random() * 100 - 50; // -50px to +50px
      
      // Random delays for staggered effect
      const delay = Math.random() * 10; // 0-10 seconds
      
      // Random starting position
      const leftPosition = Math.random() * 100;
      
      const style = {
        left: `${leftPosition}%`,
        animationDelay: `${delay}s`,
        '--drift': `${drift}px`, // CSS variable for drift
      };
      
      // Using '300' shade to ensure they are bright/light enough on dark background
      const colors = [
        'text-rose-300',    // Red/Pinkish
        'text-amber-300',   // Yellow/Gold
        'text-emerald-300', // Green
        'text-sky-300',     // Bright Blue
        'text-violet-300'   // Purple
      ];
      
      const colorClass = colors[Math.floor(Math.random() * colors.length)];

      return { id: i, type, style, colorClass: `${colorClass}` };
    });
    setItems(newItems);
  }, []);

  return (
    <div className="fixed inset-0 pointer-events-none overflow-hidden z-0">
      {items.map((item) => (
        <div
          key={item.id}
          className={`absolute top-[-10%] animate-fall animate-spin-slow ${item.colorClass}`}
          style={item.style}
        >
          {icons[item.type]}
        </div>
      ))}
    </div>
  );
};

export default FallingBackground;