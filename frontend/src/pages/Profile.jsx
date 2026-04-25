import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import API from '../services/api';

const Profile = () => {
  const [formData, setFormData] = useState({
    name: '',
    location: '',
    skillLevel: 'beginner',
    preferredGames: '',
    availability: 'Weekends',
    locationType: 'Local ground'
  });
  const [loading, setLoading] = useState(true);
  const [updating, setUpdating] = useState(false);
  const [message, setMessage] = useState({ type: '', text: '' });
  
  // --- NEW: Custom Modal State ---
  const [showModal, setShowModal] = useState(false);
  const [modalError, setModalError] = useState('');
  
  const navigate = useNavigate();

  useEffect(() => {
    const fetchProfile = async () => {
      try {
        const { data } = await API.get('/users/profile');
        setFormData({
          name: data.name || '',
          location: data.location || '',
          skillLevel: data.skillLevel || 'beginner',
          preferredGames: data.preferredGames ? data.preferredGames.join(', ') : '',
          availability: data.availability || 'Weekends',
          locationType: data.locationType || 'Local ground'
        });
        setLoading(false);
      } catch (err) {
        if (err.response?.status === 401) {
          localStorage.clear();
          navigate('/login');
        }
        setLoading(false);
      }
    };
    fetchProfile();
  }, [navigate]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setUpdating(true);
    try {
      const gamesArray = formData.preferredGames.split(',').map(g => g.trim()).filter(g => g !== "");
      await API.put('/users/profile', { ...formData, preferredGames: gamesArray });
      setMessage({ type: 'success', text: 'Profile updated successfully! ✨' });
      
      const storedUser = JSON.parse(localStorage.getItem('user'));
      localStorage.setItem('user', JSON.stringify({ ...storedUser, name: formData.name }));
    } catch (err) {
      setMessage({ type: 'error', text: 'Failed to update profile.' });
    } finally {
      setUpdating(false);
    }
  };

  // --- NEW: Custom Delete Handlers ---
  const handleDeleteClick = () => {
    setModalError(''); // Clear any old errors
    setShowModal(true); // Open our custom Ghibli modal
  };

  const executeDelete = async () => {
    try {
      await API.delete('/users/profile');
      localStorage.clear();
      window.location.href = '/';
    } catch (err) {
      // If the backend throws the Admin error, we catch it here!
      setModalError(err.response?.data?.message || "Failed to delete account. The spirits are confused.");
    }
  };

  if (loading) return <div className="min-h-screen bg-emerald-50 flex items-center justify-center font-bold text-emerald-600">Loading...</div>;

  return (
    <div className="min-h-screen bg-emerald-50 p-6 relative">
      <div className="max-w-2xl mx-auto bg-white rounded-2xl shadow-xl p-8 border border-emerald-100">
        <div className="flex justify-between items-center mb-8">
          <h2 className="text-3xl font-bold text-emerald-800 tracking-tight">Edit Profile</h2>
          <button onClick={() => navigate('/dashboard')} className="text-emerald-600 font-bold hover:underline underline-offset-4">← Dashboard</button>
        </div>

        {message.text && (
          <div className={`mb-6 p-4 rounded-xl text-center font-bold ${message.type === 'success' ? 'bg-green-100 text-green-700' : 'bg-red-100 text-red-700'}`}>
            {message.text}
          </div>
        )}
        
        <form onSubmit={handleSubmit} className="space-y-5">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
            <div>
              <label className="block text-sm font-bold text-emerald-700 mb-1">Full Name</label>
              <input type="text" className="w-full p-3 border border-emerald-200 rounded-xl outline-none focus:ring-2 focus:ring-emerald-500" value={formData.name} onChange={(e) => setFormData({...formData, name: e.target.value})} required />
            </div>
            <div>
              <label className="block text-sm font-bold text-emerald-700 mb-1">City / Region</label>
              <input type="text" className="w-full p-3 border border-emerald-200 rounded-xl outline-none focus:ring-2 focus:ring-emerald-500" value={formData.location} onChange={(e) => setFormData({...formData, location: e.target.value})} required />
            </div>
          </div>

          <div>
            <label className="block text-sm font-bold text-emerald-700 mb-1">Games (comma separated)</label>
            <input type="text" className="w-full p-3 border border-emerald-200 rounded-xl outline-none focus:ring-2 focus:ring-emerald-500" placeholder="Cricket, Chess, Badminton" value={formData.preferredGames} onChange={(e) => setFormData({...formData, preferredGames: e.target.value})} />
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-5 border-t border-emerald-50 pt-5 mt-5">
            <div>
              <label className="block text-sm font-bold text-emerald-700 mb-1">Skill Level</label>
              <select className="w-full p-3 border border-emerald-200 rounded-xl outline-none focus:ring-2 focus:ring-emerald-500" value={formData.skillLevel} onChange={(e) => setFormData({...formData, skillLevel: e.target.value})}>
                <option value="beginner">Beginner</option>
                <option value="intermediate">Intermediate</option>
                <option value="advanced">Advanced</option>
              </select>
            </div>
            
            <div>
              <label className="block text-sm font-bold text-emerald-700 mb-1">Availability</label>
              <select className="w-full p-3 border border-emerald-200 rounded-xl outline-none focus:ring-2 focus:ring-emerald-500" value={formData.availability} onChange={(e) => setFormData({...formData, availability: e.target.value})}>
                <option value="Anytime">Anytime</option>
                <option value="Weekends">Weekends</option>
                <option value="Weekdays">Weekdays</option>
                <option value="Mornings">Mornings</option>
                <option value="Evenings">Evenings</option>
              </select>
            </div>

            <div>
              <label className="block text-sm font-bold text-emerald-700 mb-1">Location Type</label>
              <select className="w-full p-3 border border-emerald-200 rounded-xl outline-none focus:ring-2 focus:ring-emerald-500" value={formData.locationType} onChange={(e) => setFormData({...formData, locationType: e.target.value})}>
                <option value="Home">Home</option>
                <option value="Society clubhouse">Society clubhouse</option>
                <option value="Local ground">Local ground</option>
              </select>
            </div>
          </div>

          <button type="submit" disabled={updating} className="w-full py-4 mt-4 bg-emerald-600 text-white font-bold rounded-xl hover:bg-emerald-700 shadow-lg disabled:bg-emerald-300 transition">
            {updating ? "Saving..." : "Save Changes"}
          </button>
        </form>

        <div className="mt-12 pt-8 border-t border-red-50 text-center">
          {/* Changed this button to trigger our custom modal instead of window.confirm */}
          <button onClick={handleDeleteClick} className="text-red-400 text-sm font-medium hover:text-red-600 transition-colors underline underline-offset-4">
            Delete My Account Permanently
          </button>
        </div>
      </div>

      {/* --- NEW: THE GHIBLI STYLE ACTION MODAL --- */}
      {showModal && (
        <div className="fixed inset-0 bg-emerald-900/40 backdrop-blur-sm flex items-center justify-center p-4 z-50">
          <div className="bg-white max-w-md w-full rounded-[2.5rem] p-8 shadow-2xl border border-emerald-100 text-center animate-bounce-in">
            <div className="text-5xl mb-4">🍃</div>
            
            {/* If there's an error (like the Admin warning), show it here */}
            {modalError ? (
               <>
                 <h3 className="text-xl font-black text-red-500 uppercase tracking-widest mb-2">Wait a moment!</h3>
                 <p className="text-emerald-800 font-medium italic mb-6 leading-relaxed bg-red-50 p-4 rounded-2xl border border-red-100">
                   {modalError}
                 </p>
                 <button onClick={() => setShowModal(false)} className="w-full bg-emerald-600 text-white font-bold py-3 rounded-2xl hover:bg-emerald-700 transition shadow-lg">
                   Understood
                 </button>
               </>
            ) : (
               /* If no error yet, show the confirmation screen */
               <>
                 <h3 className="text-xl font-black text-emerald-900 uppercase tracking-widest mb-2">Leaving so soon?</h3>
                 <p className="text-emerald-600 font-medium italic mb-6">Are you absolutely sure you want to permanently delete your account and all your data?</p>
                 <div className="flex gap-3">
                   <button onClick={executeDelete} className="flex-1 bg-red-500 text-white font-bold py-3 rounded-2xl hover:bg-red-600 transition shadow-lg active:scale-95">
                     Yes, Delete
                   </button>
                   <button onClick={() => setShowModal(false)} className="flex-1 bg-emerald-50 text-emerald-700 font-bold py-3 rounded-2xl hover:bg-emerald-100 transition">
                     Stay
                   </button>
                 </div>
               </>
            )}
          </div>
        </div>
      )}

    </div>
  );
};

export default Profile;