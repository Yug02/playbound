import React, { useEffect, useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import API from '../services/api';
import Toast from '../components/Toast';

const AdminDashboard = () => {
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [toast, setToast] = useState(null);
  const navigate = useNavigate();

  // Safety Check: Make sure the person here is actually an Admin
  const currentUser = JSON.parse(localStorage.getItem('user'));

  useEffect(() => {
    if (!currentUser || !currentUser.isAdmin) {
      navigate('/dashboard'); // Kick out normal users
      return;
    }
    fetchUsers();
  }, [navigate, currentUser]);

  const fetchUsers = async () => {
    try {
      const { data } = await API.get('/users');
      setUsers(data);
      setLoading(false);
    } catch (err) {
      setToast({ message: "Failed to load users", type: "error" });
      setLoading(false);
    }
  };

  const handleDeleteUser = async (id, name) => {
    const confirmDelete = window.confirm(`CRITICAL ACTION: Are you sure you want to ban/delete ${name}?`);
    if (confirmDelete) {
      try {
        await API.delete(`/users/${id}`);
        setToast({ message: `${name} has been removed.`, type: "success" });
        fetchUsers(); // Refresh the table
      } catch (err) {
        setToast({ message: "Failed to delete user", type: "error" });
      }
    }
  };

  if (loading) return <div className="min-h-screen bg-emerald-900 flex items-center justify-center font-bold text-emerald-400">Verifying Credentials...</div>;

  return (
    <div className="min-h-screen bg-emerald-900 p-4 md:p-8">
      <div className="max-w-6xl mx-auto">
        
        {/* Admin Header */}
        <header className="flex flex-col md:flex-row justify-between items-center mb-8 bg-white p-6 rounded-3xl shadow-2xl border border-emerald-100 gap-4">
          <div>
            <h1 className="text-3xl font-black text-red-600 uppercase tracking-widest">Admin Control</h1>
            <p className="text-emerald-600 font-medium italic">Manage Platform Users</p>
          </div>
          <Link to="/dashboard" className="bg-emerald-50 text-emerald-800 px-5 py-2.5 rounded-2xl font-bold hover:bg-emerald-200 transition shadow-sm">
            Return to App
          </Link>
        </header>

        {/* Data Table */}
        <div className="bg-white rounded-[2rem] shadow-2xl overflow-hidden border-4 border-emerald-800/20">
          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse">
              <thead>
                <tr className="bg-emerald-100 text-emerald-900 text-sm uppercase tracking-widest">
                  <th className="p-5 font-black">Name</th>
                  <th className="p-5 font-black">Email</th>
                  <th className="p-5 font-black">Location</th>
                  <th className="p-5 font-black">Role</th>
                  <th className="p-5 font-black text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-emerald-50">
                {users.map(u => (
                  <tr key={u._id} className="hover:bg-emerald-50/50 transition">
                    <td className="p-5 font-bold text-emerald-900">{u.name}</td>
                    <td className="p-5 text-emerald-600 text-sm">{u.email}</td>
                    <td className="p-5 text-emerald-600 text-sm font-medium">{u.location}</td>
                    <td className="p-5">
                      {u.isAdmin ? (
                        <span className="bg-purple-100 text-purple-700 px-3 py-1 rounded-lg text-[10px] font-black uppercase tracking-wider">Admin</span>
                      ) : (
                        <span className="bg-emerald-100 text-emerald-700 px-3 py-1 rounded-lg text-[10px] font-black uppercase tracking-wider">Player</span>
                      )}
                    </td>
                    <td className="p-5 text-right">
                      {!u.isAdmin && (
                        <button 
                          onClick={() => handleDeleteUser(u._id, u.name)}
                          className="bg-white text-red-500 border border-red-200 px-4 py-2 rounded-xl text-xs font-bold hover:bg-red-500 hover:text-white transition shadow-sm"
                        >
                          Ban / Delete
                        </button>
                      )}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </div>
      {toast && <Toast message={toast.message} type={toast.type} onClose={() => setToast(null)} />}
    </div>
  );
};

export default AdminDashboard;