import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import API from '../services/api';
import GhibliModal from '../components/GhibliModal';
import GhibliBackground from '../components/GhibliBackground'; // <-- Importing the background

const Register = () => {
  const [formData, setFormData] = useState({ name: '', email: '', password: '', location: '' });
  const [loading, setLoading] = useState(false);
  const [modal, setModal] = useState({ isOpen: false, title: '', message: '', type: 'info' });

  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      const { data } = await API.post('/users/register', formData);
      localStorage.setItem('token', data.token);
      localStorage.setItem('user', JSON.stringify(data));
      navigate('/dashboard');
    } catch (err) {
      setModal({
        isOpen: true,
        title: "Registration Failed",
        message: err.response?.data?.message || "There was an issue creating your account. Please try again.",
        type: "error"
      });
    } finally {
      setLoading(false);
    }
  };

  return (
    // Updated container: removed static gradients, added relative positioning
    <div className="min-h-screen flex items-center justify-center p-6 relative overflow-hidden">
      
      {/* Our Animated Ghibli Background Layer */}
      <GhibliBackground />

      {/* The Register Card with glassmorphism (bg-white/95 + backdrop-blur) */}
      <div className="bg-white/95 p-10 rounded-[2.5rem] shadow-2xl w-full max-w-md border border-emerald-50 backdrop-blur-sm relative z-10 animate-bounce-in mt-10 mb-10">
        <div className="text-center mb-8">
          <h2 className="text-4xl font-black text-emerald-900 tracking-tighter">Join PlayBound</h2>
          <p className="text-emerald-500 font-medium italic mt-2">Find players nearby instantly.</p>
        </div>

        <form onSubmit={handleSubmit} className="space-y-5">
          <div>
            <label className="block text-xs font-black text-emerald-900 uppercase ml-2 mb-2 tracking-widest">Full Name</label>
            <input 
              type="text" className="w-full p-4 bg-emerald-50 border border-emerald-100 rounded-2xl outline-none focus:ring-2 focus:ring-emerald-500 transition-all" 
              placeholder="e.g. Yug Lakhera" onChange={(e) => setFormData({...formData, name: e.target.value})} required 
            />
          </div>
          <div>
            <label className="block text-xs font-black text-emerald-900 uppercase ml-2 mb-2 tracking-widest">Email Address</label>
            <input 
              type="email" className="w-full p-4 bg-emerald-50 border border-emerald-100 rounded-2xl outline-none focus:ring-2 focus:ring-emerald-500 transition-all" 
              placeholder="player@example.com" onChange={(e) => setFormData({...formData, email: e.target.value})} required 
            />
          </div>
          <div>
            <label className="block text-xs font-black text-emerald-900 uppercase ml-2 mb-2 tracking-widest">Password</label>
            <input 
              type="password" className="w-full p-4 bg-emerald-50 border border-emerald-100 rounded-2xl outline-none focus:ring-2 focus:ring-emerald-500 transition-all" 
              placeholder="••••••••" onChange={(e) => setFormData({...formData, password: e.target.value})} required 
            />
          </div>
          <div>
            <label className="block text-xs font-black text-emerald-900 uppercase ml-2 mb-2 tracking-widest">City / Region</label>
            <input 
              type="text" className="w-full p-4 bg-emerald-50 border border-emerald-100 rounded-2xl outline-none focus:ring-2 focus:ring-emerald-500 transition-all" 
              placeholder="e.g. Rewa" onChange={(e) => setFormData({...formData, location: e.target.value})} required 
            />
          </div>
          <button 
            type="submit" 
            disabled={loading}
            className="w-full bg-emerald-600 text-white font-black uppercase tracking-widest py-4 mt-2 rounded-2xl hover:bg-emerald-700 transition shadow-lg shadow-emerald-200 active:scale-95 disabled:opacity-50"
          >
            {loading ? "Creating..." : "Create Account"}
          </button>
        </form>

        <p className="mt-8 text-center text-sm font-medium text-emerald-600">
          Already a player? <Link to="/login" className="text-emerald-800 font-black hover:underline underline-offset-4">Log in here</Link>
        </p>
      </div>

      {/* The Global Error/Info Modal */}
      <GhibliModal 
        isOpen={modal.isOpen} 
        title={modal.title} 
        message={modal.message} 
        type={modal.type} 
        confirmText="Understood"
        onCancel={() => setModal({ ...modal, isOpen: false })} 
      />
    </div>
  );
};

export default Register;