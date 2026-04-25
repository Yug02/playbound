import React from 'react';
import { Link } from 'react-router-dom';

const Landing = () => {
  return (
    <div className="min-h-screen bg-gradient-to-br from-emerald-50 via-white to-emerald-100 flex flex-col items-center justify-center p-6 overflow-hidden relative">
      
      {/* Decorative Floating Elements (Ghibli Aesthetic) */}
      <div className="absolute top-20 left-10 w-32 h-32 bg-emerald-200/30 rounded-full blur-3xl animate-pulse"></div>
      <div className="absolute bottom-20 right-10 w-48 h-48 bg-emerald-300/20 rounded-full blur-3xl animate-pulse delay-700"></div>

      <main className="max-w-4xl w-full text-center z-10">
        <div className="mb-6 inline-block bg-white px-6 py-2 rounded-full border border-emerald-100 shadow-sm animate-bounce-in">
          <span className="text-emerald-600 font-bold text-xs uppercase tracking-[0.2em]">Connect • Play • Belong</span>
        </div>

        <h1 className="text-6xl md:text-8xl font-black text-emerald-900 tracking-tighter mb-6 leading-none">
          Play<span className="text-emerald-500">Bound</span>
        </h1>

        <p className="text-xl md:text-2xl text-emerald-800/70 font-medium italic mb-12 max-w-2xl mx-auto leading-relaxed">
          Like a summer breeze through the grass, find your next teammate in a world built for players. 
        </p>

        <div className="flex flex-col md:flex-row gap-6 justify-center items-center">
          <Link 
            to="/register" 
            className="group relative bg-emerald-600 text-white px-12 py-5 rounded-[2rem] font-black uppercase tracking-widest text-sm shadow-2xl shadow-emerald-200 hover:bg-emerald-700 hover:-translate-y-1 transition-all duration-300 overflow-hidden"
          >
            <span className="relative z-10">Join Community</span>
            <div className="absolute inset-0 bg-white/10 translate-y-full group-hover:translate-y-0 transition-transform duration-300"></div>
          </Link>

          <Link 
            to="/login" 
            className="bg-white text-emerald-900 px-12 py-5 rounded-[2rem] font-black uppercase tracking-widest text-sm border-2 border-emerald-100 hover:border-emerald-500 transition-all duration-300 shadow-lg active:scale-95"
          >
            Sign In
          </Link>
        </div>
      </main>

      {/* Footer Branding */}
      <footer className="absolute bottom-10 text-emerald-400 font-bold text-xs uppercase tracking-widest">
        Designed by <span className="text-emerald-600">Yug Lakhera</span> • 2026
      </footer>
    </div>
  );
};

export default Landing;