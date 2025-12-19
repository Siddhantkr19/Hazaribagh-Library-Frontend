import React, { useEffect, useState, useRef } from 'react';

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
  const mousePos = useRef({ x: -1000, y: -1000 });

  useEffect(() => {
    const newItems = Array.from({ length: 30 }).map((_, i) => {
      const types = Object.keys(icons);
      const type = types[Math.floor(Math.random() * types.length)];
      
      // Reduced drift slightly for cleaner vertical fall
      const drift = Math.random() * 60 - 30; 
      const delay = Math.random() * 15; 
      const leftPosition = Math.random() * 100;
      
      const style = {
        left: `${leftPosition}%`,
        animationDelay: `${delay}s`,
        '--drift': `${drift}px`, 
      };
      
      const colors = [
        'text-rose-300', 'text-amber-300', 'text-emerald-300', 
        'text-sky-300', 'text-violet-300'
      ];
      const colorClass = colors[Math.floor(Math.random() * colors.length)];

      return { id: i, type, style, colorClass };
    });
    setItems(newItems);
  }, []);

  useEffect(() => {
    const handleMouseMove = (e) => {
      mousePos.current = { x: e.clientX, y: e.clientY };
    };
    window.addEventListener('mousemove', handleMouseMove);
    return () => window.removeEventListener('mousemove', handleMouseMove);
  }, []);

  return (
    <div className="fixed inset-0 pointer-events-none z-50 overflow-hidden">
      {items.map((item) => (
        <RepelItem 
          key={item.id} 
          item={item} 
          mousePos={mousePos} 
        />
      ))}
    </div>
  );
};

// --- NEW SMOOTH PHYSICS LOGIC ---
const RepelItem = ({ item, mousePos }) => {
  const repelRef = useRef(null); 
  const itemRef = useRef(null);  
  
  // We store the current offset (x, y) here
  const currentOffset = useRef({ x: 0, y: 0 });

  useEffect(() => {
    let animationFrameId;

    const updatePhysics = () => {
      if (!itemRef.current || !repelRef.current) return;

      // 1. Get Positions
      const rect = itemRef.current.getBoundingClientRect();
      const centerX = rect.left + rect.width / 2;
      const centerY = rect.top + rect.height / 2;

      // 2. Vector: Icon MINUS Mouse (This direction ensures Repulsion)
      const dx = centerX - mousePos.current.x; 
      const dy = centerY - mousePos.current.y;
      
      const distance = Math.sqrt(dx * dx + dy * dy);

      // 3. Settings for "Gentle" Feel
      const radius = 400;     // Large radius so it starts reacting early/smoothly
      const maxPush = 150;    // Max pixels it will move away (don't push too far)
      const smoothing = 0.08; // LOWER = Smoother/Slower. HIGHER = Snappier. 0.08 is buttery.

      let targetX = 0;
      let targetY = 0;

      // 4. Calculate Target Position
      if (distance < radius) {
        // Calculate intensity (0 to 1)
        // (radius - distance) / radius means: 0 at the edge, 1 at the center
        const intensity = (radius - distance) / radius;
        
        // Easing: intensity * intensity makes the start very soft and the center stronger
        const easeIntensity = intensity * intensity; 

        // Normalize direction and apply force
        // We add strict checks to avoid dividing by zero
        if (distance > 0) {
            targetX = (dx / distance) * easeIntensity * maxPush;
            targetY = (dy / distance) * easeIntensity * maxPush;
        }
      }

      // 5. LERP (Linear Interpolation)
      // Instead of velocity (which bounces), we just slide 8% of the way to the target every frame
      currentOffset.current.x += (targetX - currentOffset.current.x) * smoothing;
      currentOffset.current.y += (targetY - currentOffset.current.y) * smoothing;

      // 6. Apply Transform
      repelRef.current.style.transform = `translate3d(${currentOffset.current.x}px, ${currentOffset.current.y}px, 0)`;

      animationFrameId = requestAnimationFrame(updatePhysics);
    };

    updatePhysics();
    return () => cancelAnimationFrame(animationFrameId);
  }, []); 

  return (
    // Layer 1: The Fall (CSS)
    <div
      ref={itemRef}
      className={`absolute animate-fall ${item.colorClass}`}
      style={{
        ...item.style,
        top: '-10%', // Start slightly above screen
      }}
    >
      {/* Layer 2: The Repulsion (JS) */}
      <div ref={repelRef} className="will-change-transform">
        
        {/* Layer 3: The Spin (CSS) */}
        <div className="animate-spin-slow">
           {icons[item.type]}
        </div>

      </div>
    </div>
  );
};

export default FallingBackground;