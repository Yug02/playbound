// src/App.jsx
import { BrowserRouter, Routes, Route, Link } from 'react-router-dom';
import Login from './pages/Login';
import Register from './pages/Register';
import Dashboard from './pages/Dashboard';
import Profile from './pages/Profile';
import AdminDashboard from './pages/AdminDashboard';

function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={
          <div className="min-h-screen bg-emerald-50 flex flex-col items-center justify-center text-center px-4">
            <div className="max-w-3xl">
              {/* Clean, Support/Partner Focused Title */}
              <h1 className="text-6xl md:text-7xl font-bold text-emerald-800 mb-6 font-sans tracking-tight">
                Play<span className="text-emerald-500">Bound</span>
              </h1>
              <p className="text-xl text-emerald-700 mb-10 leading-relaxed font-medium">
                The easiest way to find local partners for sports and games. <br/>
                Connect. Schedule. Play.
              </p>
              
              <div className="flex flex-col md:flex-row gap-4 justify-center">
                <Link 
                  to="/login" 
                  className="bg-emerald-600 text-white px-10 py-4 rounded-2xl font-bold text-lg hover:bg-emerald-700 transition shadow-xl shadow-emerald-200 active:scale-95"
                >
                  Find a Partner
                </Link>
                <Link 
                  to="/register" 
                  className="bg-white text-emerald-600 border-2 border-emerald-600 px-10 py-4 rounded-2xl font-bold text-lg hover:bg-emerald-50 transition active:scale-95"
                >
                  Create Account
                </Link>
              </div>
            </div>

            {/* Support / Trust Badges */}
            <div className="mt-20 grid grid-cols-1 md:grid-cols-3 gap-8 max-w-4xl border-t border-emerald-200 pt-10">
              <div>
                <h3 className="font-bold text-emerald-800 text-lg">Verified Players</h3>
                <p className="text-sm text-emerald-600">Connect with real players in your local area safely.</p>
              </div>
              <div>
                <h3 className="font-bold text-emerald-800 text-lg">Instant Matching</h3>
                <p className="text-sm text-emerald-600">Send requests and get responses in real-time.</p>
              </div>
              <div>
                <h3 className="font-bold text-emerald-800 text-lg">All Activities</h3>
                <p className="text-sm text-emerald-600">From Badminton to Chess, find a partner for anything.</p>
              </div>
            </div>
          </div>
        } />

        <Route path="/login" element={<Login />} />
        <Route path="/register" element={<Register />} />
        <Route path="/dashboard" element={<Dashboard />} />
        <Route path="/profile" element={<Profile />} />
        <Route path="/admin" element={<AdminDashboard />} />
      </Routes>
    </BrowserRouter>
  );
}

export default App;