import React, { useEffect, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { Building2, Clapperboard, Plus, LogOut, Layout, Calendar, Users, MapPin, Trophy, Star } from "lucide-react";
import { getTheatresByOwner } from "../../services/theatre.services";
import { getSundayWinner } from "../../services/sundayVoting.service";
import Loader from "../../components/Common/Loader.jsx";
import toast from "react-hot-toast";
import "./OwnerDashboard.css";

const OwnerDashboard = () => {
  const navigate = useNavigate();
  const [theatre, setTheatre] = useState(null);
  const [sundayWinner, setSundayWinner] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  const [user, setUser] = useState(null);

  useEffect(() => {
    const storedUser = localStorage.getItem("user");
    if (storedUser) {
      const parsedUser = JSON.parse(storedUser);
      setUser(parsedUser);
      fetchTheatreData(parsedUser._id);
    } else {
      navigate("/auth");
    }
  }, [navigate]);

  const fetchTheatreData = async (userId) => {
    try {
      setIsLoading(true);
      const [data, winner] = await Promise.all([
        getTheatresByOwner(userId),
        getSundayWinner().catch(() => null)
      ]);
      
      // Assuming return is an array, pick the first one
      if (Array.isArray(data) && data.length > 0) {
        setTheatre(data[0]);
      } else if (data && !Array.isArray(data)) {
        setTheatre(data);
      }

      if (winner) {
        setSundayWinner(winner);
      }
    } catch (error) {
      console.error("Error fetching theatre:", error);
      toast.error("Failed to load theatre data");
    } finally {
      setIsLoading(false);
    }
  };

  const handleLogout = () => {
    localStorage.removeItem("user");
    navigate("/auth");
  };

  if (isLoading) return <Loader isLoading={true} />;

  if (!theatre) {
    return (
      <div className="owner-empty-state">
        <Building2 size={64} className="icon-empty" />
        <h2>No Theatre Assigned</h2>
        <p>You don't have any theatre associated with your account yet.</p>
        <button className="logout-btn" onClick={handleLogout}>
          <LogOut size={18} /> Logout
        </button>
      </div>
    );
  }

  return (
    <div className="owner-dashboard">
      <nav className="owner-nav">
        <div className="nav-left">
          <div className="logo">BingeHere <span>Owner</span></div>
        </div>
        <div className="nav-right">
          <div className="user-info">
            <Users size={18} /> {user?.name}
          </div>
          <button className="logout-icon-btn" onClick={handleLogout}>
            <LogOut size={18} />
          </button>
        </div>
      </nav>

      <main className="owner-main">
        <header className="owner-header">
          <div className="theatre-brand">
            <Building2 className="brand-icon" size={40} />
            <div>
              <h1>{theatre.name}</h1>
              <div className="location">
                <MapPin size={14} /> {theatre.location?.city}, {theatre.location?.state}
              </div>
            </div>
          </div>
          <div className="quick-actions">
            <Link to="/owner/screens" className="action-btn secondary">
              <Layout size={18} /> Manage Screens
            </Link>
            <Link to="/owner/shows" className="action-btn primary">
              <Plus size={18} /> Add New Show
            </Link>
          </div>
        </header>

        <section className="stats-grid">
          <div className="stat-card">
            <Layout className="stat-icon blue" size={24} />
            <div className="stat-info">
              <span className="label">Total Screens</span>
              <span className="value">{theatre.screens?.length || 0}</span>
            </div>
          </div>
          <div className="stat-card">
            <Calendar className="stat-icon red" size={24} />
            <div className="stat-info">
              <span className="label">Active Shows</span>
              <span className="value">Manage inside</span>
            </div>
          </div>
          <div className="stat-card">
            <Clapperboard className="stat-icon amber" size={24} />
            <div className="stat-info">
              <span className="label">Listed Movies</span>
              <span className="value">Browse all</span>
            </div>
          </div>
        </section>

        <section className="dashboard-content">
          {sundayWinner && (
            <div className="content-card relative overflow-hidden ring-1 ring-amber-500/50 shadow-[0_0_20px_rgba(245,158,11,0.15)]" style={{ background: "linear-gradient(145deg, #1e1b4b 0%, #0f172a 100%)" }}>
              <div className="absolute top-0 right-0 w-64 h-64 bg-amber-500 opacity-20 blur-[100px] rounded-full pointer-events-none"></div>
              <div className="card-header border-b border-amber-500/20 pb-4 mb-4 relative z-10">
                <h2 className="flex items-center gap-2 text-amber-400 font-black"><Trophy className="text-amber-500" /> Sunday Special Winner</h2>
                <span className="text-xs uppercase bg-amber-500/20 text-amber-300 px-2 py-1 rounded font-bold tracking-widest border border-amber-500/30">Action Required</span>
              </div>
              <div className="flex gap-6 items-center relative z-10">
                <img src={sundayWinner.poster} alt={sundayWinner.title} className="w-24 h-36 object-cover rounded shadow-lg border border-amber-500/30" />
                <div className="flex-1">
                  <h3 className="text-2xl font-bold text-white mb-2">{sundayWinner.title || sundayWinner.name}</h3>
                  <p className="text-slate-300 text-sm mb-4">This movie won the community voting! Schedule a show to give your users what they asked for.</p>
                  <button 
                    onClick={() => navigate("/owner/shows", { state: { prefillMovie: sundayWinner._id } })}
                    className="bg-amber-500 hover:bg-amber-600 text-amber-950 px-5 py-2.5 rounded-lg font-bold flex items-center gap-2 transition-colors shadow-lg"
                  >
                    <Calendar size={18} /> Schedule Sunday Show
                  </button>
                </div>
              </div>
            </div>
          )}

          <div className="content-card">
            <div className="card-header">
              <h2>Recent Activities</h2>
              <button className="text-btn">View All</button>
            </div>
            <div className="activity-list">
              <p className="empty-msg">No recent activities found.</p>
            </div>
          </div>

          <div className="content-card">
            <div className="card-header">
              <h2>Your Screens</h2>
              <Link to="/owner/screens" className="text-btn">New Screen</Link>
            </div>
            <div className="screen-list">
              {theatre.screens?.length > 0 ? (
                theatre.screens.map((screen, idx) => (
                  <div key={idx} className="screen-item">
                    <div className="screen-icon"><Layout size={16} /></div>
                    <div className="screen-details">
                      <span className="name">{screen.name || `Screen ${idx + 1}`}</span>
                      <span className="seats">{screen.totalSeats || 0} Seats</span>
                    </div>
                  </div>
                ))
              ) : (
                <p className="empty-msg">No screens added yet.</p>
              )}
            </div>
          </div>
        </section>
      </main>
    </div>
  );
};

export default OwnerDashboard;
