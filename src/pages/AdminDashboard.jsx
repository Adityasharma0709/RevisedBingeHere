import { useEffect, useMemo, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import {
  Building2,
  Clapperboard,
  LogOut,
  MapPin,
  Plus,
  RefreshCcw,
  ShieldCheck,
  Trophy,
  Users,
} from "lucide-react";
import Loader from "../components/Common/Loader.jsx";
import { getTheatres } from "../services/theatre.services";
import "./admin/AdminShell.css";

const parseStoredUser = () => {
  try {
    const storedUser = localStorage.getItem("user");
    return storedUser ? JSON.parse(storedUser) : null;
  } catch {
    return null;
  }
};

const AdminDashboard = () => {
  const navigate = useNavigate();
  const [currentUser] = useState(() => parseStoredUser());
  const [theatres, setTheatres] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [status, setStatus] = useState({ type: "idle", message: "" });

  const loadTheatres = async () => {
    try {
      setIsLoading(true);
      const theatreData = await getTheatres();
      setTheatres(Array.isArray(theatreData) ? theatreData : []);
      setStatus({ type: "idle", message: "" });
    } catch (error) {
      setStatus({
        type: "error",
        message: error.message || "Unable to load theatres right now.",
      });
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    document.title = "BingeHere | Admin";
    loadTheatres();
  }, []);

  const stats = useMemo(() => {
    const cities = new Set();
    let ownersAssigned = 0;

    theatres.forEach((theatre) => {
      const city = theatre?.location?.city?.trim();
      if (city) cities.add(city.toLowerCase());
      if (theatre?.owner) ownersAssigned += 1;
    });

    return [
      {
        label: "Active Theatres",
        value: theatres.length,
        helper: "",
        icon: Building2,
        tone: "amber",
      },
      {
        label: "Cities Covered",
        value: cities.size,
        helper: "Based on theatre locations",
        icon: MapPin,
        tone: "blue",
      },
      {
        label: "Owners Assigned",
        value: ownersAssigned,
        helper: "Theatres linked to an owner",
        icon: Users,
        tone: "red",
      },
    ];
  }, [theatres]);

  const handleLogout = () => {
    localStorage.removeItem("user");
    navigate("/auth");
  };

  const getOwnerLabel = (theatre) => {
    if (typeof theatre.owner === "string") {
      return theatre.owner;
    }

    return (
      theatre.owner?.name ||
      theatre.owner?.email ||
      theatre.owner?._id ||
      "Not assigned"
    );
  };

  return (
    <div className="admin-shell">
      <Loader isLoading={isLoading} />

      <nav className="admin-nav">
        <div className="nav-left">
          <Link to="/" className="logo" aria-label="Go to landing page">
            BingeHere <span>Admin</span>
          </Link>
        </div>

        <div className="admin-nav-right">
          <div className="admin-user-info">
            <Users size={18} /> {currentUser?.name || "Admin"}
          </div>
          <button
            type="button"
            className="admin-logout-icon-btn"
            onClick={handleLogout}
            aria-label="Logout"
          >
            <LogOut size={18} />
          </button>
        </div>
      </nav>

      <main className="admin-main">
        <header className="admin-header">
          <div className="admin-brand">
            <ShieldCheck className="admin-brand-icon" size={40} />
            <div>
              <h1>Admin Dashboard</h1>
              <div className="admin-meta">
                <Building2 size={14} /> Manage theatres, owners, and movies
              </div>
            </div>
          </div>

          <div className="admin-actions">
            <Link to="/admin/create-theatre" className="action-btn primary">
              <Plus size={18} /> Create Theatre
            </Link>
            <Link to="/admin/add-movie" className="action-btn secondary">
              <Clapperboard size={18} /> Add Movie
            </Link>
            <button
              type="button"
              onClick={loadTheatres}
              className="action-btn secondary"
              disabled={isLoading}
            >
              <RefreshCcw size={18} /> Refresh
            </button>
          </div>
        </header>

        {status.type === "error" && status.message ? (
          <div className="admin-banner error">{status.message}</div>
        ) : null}

        <section className="stats-grid">
          {stats.map((item) => {
            const Icon = item.icon;
            return (
              <div key={item.label} className="stat-card">
                <div className={`stat-icon ${item.tone}`}>
                  <Icon size={24} />
                </div>
                <div className="stat-info">
                  <span className="label">{item.label}</span>
                  <span className="value">{item.value}</span>
                  <span className="helper">{item.helper}</span>
                </div>
              </div>
            );
          })}
        </section>

        <section className="dashboard-content">
          <div className="content-card">
            <div className="card-header">
              <h2>Theatres</h2>
              <button
                type="button"
                onClick={loadTheatres}
                className="text-btn"
                disabled={isLoading}
              >
                Refresh
              </button>
            </div>

            {isLoading ? null : theatres.length === 0 ? (
              <p className="empty-msg">No theatres yet.</p>
            ) : (
              <div className="admin-list">
                {theatres.map((theatre) => (
                  <div key={theatre._id} className="admin-list-item">
                    <div>
                      <h3>{theatre.name}</h3>
                      <p>
                        {[
                          theatre?.location?.address,
                          theatre?.location?.city,
                          theatre?.location?.state,
                        ]
                          .filter(Boolean)
                          .join(", ")}
                      </p>
                    </div>
                    <div className="admin-list-meta">
                      <div>Owner: {getOwnerLabel(theatre)}</div>
                      <div>Screens: {theatre.screens?.length || 0}</div>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>

          <div className="content-card">
            <div className="card-header">
              <h2>Admin Tools</h2>
              <span className="text-btn" aria-hidden="true">
                Sunday Voting
              </span>
            </div>

            <div className="content-actions">
              <Link to="/admin/create-theatre" className="action-btn primary">
                <Plus size={18} /> Create Theatre
              </Link>
              <Link to="/admin/add-movie" className="action-btn secondary">
                <Clapperboard size={18} /> Add Movie
              </Link>
              <Link to="/admin/sunday-voting" className="action-btn secondary">
                <Trophy size={18} /> Sunday Voting
              </Link>
              <button
                type="button"
                onClick={loadTheatres}
                className="action-btn secondary"
                disabled={isLoading}
              >
                <RefreshCcw size={18} /> Refresh Theatres
              </button>
            </div>
          </div>
        </section>
      </main>
    </div>
  );
};

export default AdminDashboard;
