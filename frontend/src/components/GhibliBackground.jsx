import React from 'react';
// Ensure this path matches the image you downloaded!
import bgImage from '../assets/support-bg.png'; 

const GhibliBackground = () => {
  return (
    <div className="fixed inset-0 z-[-1] overflow-hidden bg-emerald-50">
      
      {/* Layer 1: The Optimized Static Ghibli Scene */}
      <img 
        src={bgImage} 
        alt="Ghibli Shared Shelter" 
        className="w-full h-full object-cover"
      />

      {/* Layer 2: The Soft Light Pulse (making it feel alive) */}
      <div className="absolute inset-0 bg-white/20 animate-ghibli-pulse"></div>

      {/* Layer 3: The Subtle Ghibli Rain Overlay (moving over the shelter) */}
      <div className="absolute inset-0 ghibli-rain-overlay opacity-60"></div>

      {/* Layer 4: Soft Emerald Overlay for better text readability */}
      <div className="absolute inset-0 bg-gradient-to-t from-emerald-50/70 via-transparent to-emerald-50/60 backdrop-blur-[1px]"></div>
    </div>
  );
};

export default GhibliBackground;