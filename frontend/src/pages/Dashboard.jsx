import React, { useEffect, useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import API from '../services/api';
import RequestModal from '../components/RequestModal';
import Toast from '../components/Toast';

const Dashboard = () => {
  const navigate = useNavigate();
  const [players, setPlayers] = useState([]);
  const [requests, setRequests] = useState([]);
  const [selectedPlayer, setSelectedPlayer] = useState(null);
  const [user] = useState(JSON.parse(localStorage.getItem('user')));
  
  const [searchTerm, setSearchTerm] = useState('');
  const [locationFilter, setLocationFilter] = useState('');
  const [skillFilter, setSkillFilter] = useState('');
  const [availabilityFilter, setAvailabilityFilter] = useState('');
  
  const [isSearching, setIsSearching] = useState(false);
  const [toast, setToast] = useState(null);

  const showToast = (message, type = 'success') => {
    setToast({ message, type });
  };

  const handleLogout = () => {
    localStorage.clear();
    navigate('/login');
  };

  const fetchData = async () => {
    setIsSearching(true);
    try {
      const playersRes = await API.get('/users/search', {
        params: {
          game: searchTerm,
          skillLevel: skillFilter,
          location: locationFilter,
          availability: availabilityFilter
        }
      });
      const requestsRes = await API.get('/requests');
      setPlayers(playersRes.data);
      setRequests(requestsRes.data);
    } catch (err) { 
      if (err.response?.status === 401) {
        handleLogout();
      }
    } finally {
      setIsSearching(false);
    }
  };

  useEffect(() => {
    const delayDebounceFn = setTimeout(() => {
      fetchData();
    }, 300);
    return () => clearTimeout(delayDebounceFn);
  }, [searchTerm, skillFilter, locationFilter, availabilityFilter]);

  const handleStatusUpdate = async (requestId, status) => {
    try {
      await API.put(`/requests/${requestId}`, { status });
      showToast(`Invite ${status}!`);
      fetchData();
    } catch (err) { 
      showToast("Failed to update status", "error"); 
    }
  };

  return (
    <div className="min-h-screen bg-emerald-50 p-4 md:p-8 relative z-0">
      
      <div className="absolute inset-0 ghibli-rain-overlay opacity-30 z-[-1] pointer-events-none"></div>

      <div className="max-w-7xl mx-auto">
        
        {/* Header */}
        <header className="flex flex-col md:flex-row justify-between items-center mb-8 bg-white/90 backdrop-blur-sm p-6 rounded-3xl shadow-sm border border-emerald-100 gap-4">
          <div className="text-center md:text-left">
            <h1 className="text-3xl font-bold text-emerald-800 tracking-tight">
              Play<span className="text-emerald-500">Bound</span>
            </h1>
            <p className="text-emerald-600 font-medium italic">
              Welcome back, <span className="text-emerald-900 font-bold">{user?.name || "Player"}</span>
            </p>
          </div>
          
          <div className="flex flex-wrap gap-3 justify-center md:justify-end">
            {user?.isAdmin && (
              <Link to="/admin" className="bg-purple-50 text-purple-700 px-5 py-2.5 rounded-2xl font-bold hover:bg-purple-100 transition shadow-sm border border-purple-100">
                Admin Panel
              </Link>
            )}
            <Link to="/profile" className="bg-emerald-50 text-emerald-700 px-5 py-2.5 rounded-2xl font-bold hover:bg-emerald-100 transition shadow-sm">My Profile</Link>
            <button onClick={handleLogout} className="bg-red-50 text-red-500 px-5 py-2.5 rounded-2xl font-bold hover:bg-red-100 transition shadow-sm">Logout</button>
          </div>
        </header>

        {/* 4-Part Search Bar */}
        <div className="bg-white/90 backdrop-blur-sm p-5 rounded-3xl shadow-md border border-emerald-100 mb-8 flex flex-col md:flex-row gap-4 items-center">
          <div className="flex-1 w-full text-emerald-800">
            <input 
              type="text" 
              placeholder="Game (e.g. Football)" 
              className="w-full p-4 bg-emerald-50/50 border border-emerald-100 rounded-2xl outline-none focus:ring-2 focus:ring-emerald-500"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
          </div>
          <div className="flex-1 w-full text-emerald-800">
            <input 
              type="text" 
              placeholder="City / Region" 
              className="w-full p-4 bg-emerald-50/50 border border-emerald-100 rounded-2xl outline-none focus:ring-2 focus:ring-emerald-500"
              value={locationFilter}
              onChange={(e) => setLocationFilter(e.target.value)}
            />
          </div>
          <div className="w-full md:w-48">
            <select 
              className="w-full p-4 bg-emerald-50/50 border border-emerald-100 rounded-2xl text-emerald-700 font-bold cursor-pointer"
              value={availabilityFilter}
              onChange={(e) => setAvailabilityFilter(e.target.value)}
            >
              <option value="">Any Time</option>
              <option value="Weekends">Weekends</option>
              <option value="Weekdays">Weekdays</option>
              <option value="Mornings">Mornings</option>
              <option value="Evenings">Evenings</option>
            </select>
          </div>
          <div className="w-full md:w-48">
            <select 
              className="w-full p-4 bg-emerald-50/50 border border-emerald-100 rounded-2xl text-emerald-700 font-bold cursor-pointer"
              value={skillFilter}
              onChange={(e) => setSkillFilter(e.target.value)}
            >
              <option value="">All Skills</option>
              <option value="beginner">Beginner</option>
              <option value="intermediate">Intermediate</option>
              <option value="advanced">Advanced</option>
            </select>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">
          
          {/* Match Activity Sidebar */}
          <div className="lg:col-span-1">
            <h2 className="text-sm font-black text-emerald-900 mb-4 px-2 uppercase tracking-widest">Match Activity</h2>
            <div className="bg-white/90 backdrop-blur-sm p-5 rounded-[2rem] shadow-md border border-emerald-100 max-h-[600px] overflow-y-auto">
              {requests.length > 0 ? requests.map((req) => (
                <div key={req._id} className="mb-4 p-4 rounded-2xl bg-emerald-50/40 border border-emerald-50 last:mb-0">
                  <div className="flex justify-between items-start mb-2">
                    <span className="text-[10px] font-black text-emerald-400 uppercase tracking-tighter">
                      {req.sender?._id === user?._id ? 'Outgoing' : 'Incoming'}
                    </span>
                    <span className={`text-[10px] font-bold px-2 py-0.5 rounded-full ${
                      req.status === 'accepted' ? 'bg-emerald-500 text-white' : 
                      req.status === 'declined' ? 'bg-red-400 text-white' : 'bg-orange-400 text-white'
                    }`}>
                      {req.status}
                    </span>
                  </div>
                  
                  <p className="text-sm font-bold text-emerald-900">
                    {req.sender?._id === user?._id ? (req.receiver?.name || "Deleted User") : (req.sender?.name || "Deleted User")}
                  </p>
                  
                  <p className="text-[11px] text-emerald-600 font-medium italic">
                    {req.game} • {req.proposedTime}
                  </p>

                  {req.message && (
                    <div className="mt-2 p-2 bg-white/50 rounded-lg border border-emerald-50">
                      <p className="text-[11px] text-emerald-800 leading-relaxed italic">
                        "{req.message}"
                      </p>
                    </div>
                  )}
                  
                  {req.receiver?._id === user?._id && req.status === 'pending' && (
                    <div className="flex gap-2 mt-3">
                      <button onClick={() => handleStatusUpdate(req._id, 'accepted')} className="flex-1 bg-emerald-600 text-white py-1.5 rounded-lg text-xs font-bold hover:bg-emerald-700 transition">Accept</button>
                      <button onClick={() => handleStatusUpdate(req._id, 'declined')} className="flex-1 bg-white border border-emerald-200 text-emerald-600 py-1.5 rounded-lg text-xs font-bold hover:bg-emerald-50 transition">Decline</button>
                    </div>
                  )}
                </div>
              )) : <p className="text-center py-10 text-emerald-400 font-medium italic text-sm">No activity yet.</p>}
            </div>
          </div>

          {/* Discovery Grid */}
          <div className="lg:col-span-3">
            <h2 className="text-sm font-black text-emerald-900 mb-4 px-2 uppercase tracking-widest">Find Players</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              
              {isSearching ? (
                <div className="text-center py-24 bg-white/90 backdrop-blur-sm rounded-[2.5rem] border-2 border-dashed border-emerald-100 col-span-full">
                  <p className="text-emerald-500 font-bold animate-pulse">Searching for partners...</p>
                </div>
              ) : players.length > 0 ? (
                players.map((player) => (
                  <div key={player._id} className="bg-white/90 backdrop-blur-sm p-7 rounded-[2.5rem] shadow-md border border-emerald-50 hover:shadow-xl hover:-translate-y-1 transition-all duration-300 group">
                    <div className="flex items-center gap-5 mb-5">
                      <div className="w-16 h-16 bg-emerald-600 rounded-3xl flex items-center justify-center text-white font-bold text-3xl shadow-lg">
                        {player.name?.[0] || "?"}
                      </div>
                      <div>
                        <h3 className="font-bold text-emerald-900 text-xl tracking-tight">{player.name}</h3>
                        <div className="flex items-center gap-2 mt-1">
                          <span className="text-[10px] bg-emerald-100 text-emerald-700 px-3 py-1 rounded-lg font-black uppercase">{player.skillLevel}</span>
                          <span className="text-xs text-emerald-500 font-bold">{player.location}</span>
                        </div>
                      </div>
                    </div>

                    <div className="flex flex-wrap gap-2 mb-4 bg-emerald-50/50 p-3 rounded-2xl border border-emerald-50">
                       <span className="text-xs text-emerald-700 font-medium">🕒 {player.availability || 'Weekends'}</span>
                       <span className="text-xs text-emerald-700 font-medium">📍 {player.locationType || 'Local ground'}</span>
                    </div>

                    <div className="flex flex-wrap gap-2 mb-6">
                      {player.preferredGames?.map((game, i) => (
                        <span key={i} className="bg-emerald-50/80 text-emerald-600 text-[11px] px-3 py-1.5 rounded-xl border border-emerald-100 font-bold italic">#{game}</span>
                      ))}
                    </div>
                    <button onClick={() => setSelectedPlayer(player)} className="w-full bg-emerald-600 text-white py-4 rounded-2xl font-black text-sm uppercase tracking-widest hover:bg-emerald-700 transition shadow-lg active:scale-95">Challenge Player</button>
                  </div>
                ))
              ) : (
                <div className="text-center py-24 bg-white/90 backdrop-blur-sm rounded-[2.5rem] border-2 border-dashed border-red-100 col-span-full">
                  <span className="text-4xl mb-4 block">🏜️</span>
                  <p className="text-red-400 font-bold uppercase tracking-widest text-sm">No players found</p>
                  <p className="text-gray-400 text-xs mt-2 italic">Try adjusting your filters.</p>
                </div>
              )}

            </div>
          </div>
        </div>

        {/* Modal & Toast rendering */}
        {selectedPlayer && (
          <RequestModal 
            player={selectedPlayer} 
            onClose={(status) => { 
              setSelectedPlayer(null); 
              
              if (status === 'sent') {
                fetchData(); 
                showToast("Invite Sent!", "success"); 
              } else if (status === 'cancelled') {
                // Do not show the toast if they just clicked cancel
              }
            }} 
          />
        )}

        {toast && (
          <Toast message={toast.message} type={toast.type} onClose={() => setToast(null)} />
        )}

      </div>
    </div>
  );
};

export default Dashboard;