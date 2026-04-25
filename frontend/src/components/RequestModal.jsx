import React, { useState } from 'react';
import API from '../services/api';

const RequestModal = ({ player, onClose }) => {
  // Pre-fill the game with their first preferred game, if they have one
  const [game, setGame] = useState(player?.preferredGames?.[0] || '');
  const [proposedTime, setProposedTime] = useState('');
  const [message, setMessage] = useState('');
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      await API.post('/requests', {
        receiverId: player._id,
        game,
        proposedTime,
        message
      });
      // Tell the Dashboard the invite was actually sent
      onClose('sent'); 
    } catch (err) {
      console.error(err);
      alert(err.response?.data?.message || "Failed to send invite");
    } finally {
      setLoading(false);
    }
  };

  if (!player) return null;

  return (
    <div className="fixed inset-0 bg-emerald-900/40 backdrop-blur-sm flex items-center justify-center p-4 z-[100]">
      <div className="bg-white max-w-md w-full rounded-[2.5rem] p-8 shadow-2xl border border-emerald-100 animate-bounce-in">
        <div className="text-center mb-6">
          <div className="text-4xl mb-2">⚔️</div>
          <h3 className="text-2xl font-black text-emerald-900 tracking-tight">Challenge {player.name}</h3>
          <p className="text-emerald-500 font-medium italic mt-1 text-sm">Send a play request</p>
        </div>

        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block text-xs font-black text-emerald-900 uppercase ml-2 mb-2 tracking-widest">Select Game</label>
            <select 
              required
              className="w-full p-4 bg-emerald-50/50 border border-emerald-100 rounded-2xl outline-none focus:ring-2 focus:ring-emerald-500 font-bold text-emerald-800 cursor-pointer"
              value={game}
              onChange={(e) => setGame(e.target.value)}
            >
              <option value="" disabled>Choose a game</option>
              {player.preferredGames?.map((g, i) => (
                <option key={i} value={g}>{g}</option>
              ))}
            </select>
          </div>

          <div>
            <label className="block text-xs font-black text-emerald-900 uppercase ml-2 mb-2 tracking-widest">Proposed Time</label>
            <input 
              type="text" 
              required
              placeholder="e.g. Tomorrow at 5 PM" 
              className="w-full p-4 bg-emerald-50/50 border border-emerald-100 rounded-2xl outline-none focus:ring-2 focus:ring-emerald-500 text-emerald-800"
              value={proposedTime}
              onChange={(e) => setProposedTime(e.target.value)}
            />
          </div>

          <div>
            <label className="block text-xs font-black text-emerald-900 uppercase ml-2 mb-2 tracking-widest">Message (Optional)</label>
            <textarea 
              placeholder="Hey! Let's play a match..." 
              rows="2"
              className="w-full p-4 bg-emerald-50/50 border border-emerald-100 rounded-2xl outline-none focus:ring-2 focus:ring-emerald-500 text-emerald-800 resize-none"
              value={message}
              onChange={(e) => setMessage(e.target.value)}
            ></textarea>
          </div>

          <div className="flex gap-3 mt-6">
            <button 
              type="button" 
              onClick={() => onClose('cancelled')} // Tell the Dashboard it was cancelled
              className="flex-1 bg-emerald-50 text-emerald-700 font-bold py-3 rounded-2xl hover:bg-emerald-100 transition shadow-sm active:scale-95"
            >
              Cancel
            </button>
            <button 
              type="submit" 
              disabled={loading}
              className="flex-1 bg-emerald-600 text-white font-bold py-3 rounded-2xl hover:bg-emerald-700 transition shadow-lg active:scale-95 disabled:opacity-50"
            >
              {loading ? 'Sending...' : 'Send Invite'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default RequestModal;