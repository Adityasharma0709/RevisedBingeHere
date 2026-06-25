import { useEffect, useMemo, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { Clapperboard, LogOut, ShieldCheck, TicketPlus, Users } from "lucide-react";
import Loader from "../../components/Common/Loader.jsx";
import MovieSearch from "./MovieSearch.jsx";
import { createMovie } from "../../services/movie.service.js";
import "./AdminShell.css";
import "./AddMovie.css";

const parseStoredUser = () => {
  try {
    const storedUser = localStorage.getItem("user");
    return storedUser ? JSON.parse(storedUser) : null;
  } catch {
    return null;
  }
};

export default function AddMovie() {
  const navigate = useNavigate();
  const [currentUser] = useState(() => parseStoredUser());
  const [selectedMovie, setSelectedMovie] = useState(null);
  const [form, setForm] = useState({
    name: "",
    description: "",
    genre: "",
    duration: "",
    language: "",
    tmdbId: "",
  });
  const [isNowShowing, setIsNowShowing] = useState(false);
  const [isComingSoon, setIsComingSoon] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [status, setStatus] = useState({ type: "idle", message: "" });

  useEffect(() => {
    document.title = "BingeHere | Add Movie";
  }, []);

  const genreTags = useMemo(() => {
    return form.genre
      .split(",")
      .map((g) => g.trim())
      .filter(Boolean);
  }, [form.genre]);

  const selectedMeta = useMemo(() => {
    if (!selectedMovie) return null;

    const year = selectedMovie.releaseDate?.slice?.(0, 4) || "";
    return {
      title: selectedMovie.title || selectedMovie.name || "Selected Movie",
      year,
      poster: selectedMovie.poster,
    };
  }, [selectedMovie]);

  const resetAll = () => {
    setForm({ name: "", description: "", genre: "", duration: "", language: "", tmdbId: "" });
    setSelectedMovie(null);
    setIsNowShowing(false);
    setIsComingSoon(false);
  };

  const handleMovieSelect = async (movie) => {
    setSelectedMovie(movie);
    setStatus({ type: "idle", message: "" });

    try {
      const tmdbKey = import.meta.env.VITE_TMDB_KEY;
      if (tmdbKey) {
        // Fetch full details to get runtime, genres, etc.
        const res = await fetch(
          `https://api.themoviedb.org/3/movie/${movie.tmdbId}?api_key=${tmdbKey}&language=en-US`,
        );
        const data = await res.json();

        setForm({
          name: data.title || "",
          description: data.overview || "",
          genre: data.genres ? data.genres.map((g) => g.name).join(", ") : "",
          duration: data.runtime || "",
          language: data.original_language || "",
          tmdbId: data.id || movie.tmdbId,
        });
      } else {
        // Fallback to basic search info
        setForm({
          name: movie.title || "",
          description: movie.overview || "",
          genre: "",
          duration: "",
          language: movie.original_language || "",
          tmdbId: movie.tmdbId || "",
        });
      }
    } catch (err) {
      console.error("Failed to fetch full movie details:", err);
      setForm({
        name: movie.title || "",
        description: movie.overview || "",
        genre: "",
        duration: "",
        language: movie.original_language || "",
        tmdbId: movie.tmdbId || "",
      });
    }
  };

  const handleChange = (e) => {
    setStatus({ type: "idle", message: "" });
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const userId = currentUser?._id || currentUser?.id || localStorage.getItem("userId");

    if (!userId) {
      setStatus({
        type: "error",
        message: "Your admin session is missing. Please log in again.",
      });
      return;
    }

    if (!form.name.trim()) {
      setStatus({
        type: "error",
        message: "Movie name is required.",
      });
      return;
    }

    const movieData = {
      tmdbId: form.tmdbId,
      name: form.name.trim(),
      description: form.description?.trim?.() || "",
      genre: genreTags,
      duration: form.duration === "" ? undefined : Number(form.duration),
      language: form.language?.trim?.() || "",
      // The backend automatically overrides poster/banner using TMDB ID
      poster: selectedMovie?.poster || "backend-will-fetch",
      isNowShowing,
      isComingSoon,
    };

    try {
      setIsSubmitting(true);
      setStatus({ type: "idle", message: "" });
      await createMovie(movieData, userId);
      setStatus({ type: "success", message: "Movie added successfully." });
      resetAll();
    } catch (err) {
      setStatus({ type: "error", message: err.message || "Failed to add movie." });
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleLogout = () => {
    localStorage.removeItem("user");
    navigate("/auth");
  };

  return (
    <div className="admin-shell admin-add-movie">
      <Loader isLoading={isSubmitting} />

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
            <Clapperboard className="admin-brand-icon admin-movie-icon" size={40} />
            <div>
              <h1>Add Movie</h1>
              <div className="admin-meta">
                <TicketPlus size={14} /> Search TMDB and publish a movie entry
              </div>
            </div>
          </div>

          <div className="admin-actions">
            <Link to="/admin" className="action-btn secondary">
              <ShieldCheck size={18} /> Dashboard
            </Link>
            <Link to="/admin/create-theatre" className="action-btn secondary">
              Create Theatre
            </Link>
            <Link to="/admin/sunday-voting" className="action-btn secondary">
              Sunday Voting
            </Link>
          </div>
        </header>

        {status.message ? (
          <div className={`admin-banner ${status.type === "success" ? "success" : "error"}`}>
            {status.message}
          </div>
        ) : null}

        <section className="admin-movie-grid">
          <div className="content-card">
            <div className="card-header">
              <h2>Movie Details</h2>
              <span className="text-btn" aria-hidden="true">
                TMDB
              </span>
            </div>

            <div className="admin-add-movie-search">
              <p className="admin-hint">
                Start with a TMDB search to auto-fill title, description, runtime, and genres.
              </p>
              <MovieSearch onSelect={handleMovieSelect} />
            </div>

            <form onSubmit={handleSubmit} className="admin-form">
              <div className="form-grid">
                <div className="form-group full-width">
                  <label>Movie Name</label>
                  <input
                    type="text"
                    name="name"
                    value={form.name}
                    onChange={handleChange}
                    placeholder="Movie title"
                    required
                  />
                </div>

                <div className="form-group full-width">
                  <label>Description</label>
                  <textarea
                    name="description"
                    value={form.description}
                    onChange={handleChange}
                    rows={5}
                    placeholder="Short plot overview (optional)"
                  />
                </div>

                <div className="form-group">
                  <label>Genre</label>
                  <input
                    type="text"
                    name="genre"
                    value={form.genre}
                    onChange={handleChange}
                    placeholder="Action, Drama, Thriller"
                  />
                </div>

                <div className="form-group">
                  <label>Duration (minutes)</label>
                  <input
                    type="number"
                    name="duration"
                    value={form.duration}
                    onChange={handleChange}
                    placeholder="120"
                    min={0}
                  />
                </div>

                <div className="form-group">
                  <label>Language</label>
                  <input
                    type="text"
                    name="language"
                    value={form.language}
                    onChange={handleChange}
                    placeholder="en"
                  />
                </div>

                <div className="form-group">
                  <label>TMDB ID</label>
                  <input
                    type="number"
                    name="tmdbId"
                    value={form.tmdbId}
                    onChange={handleChange}
                    placeholder="Optional if not from TMDB"
                    min={0}
                  />
                </div>

                <div className="form-section">
                  <p className="title">Visibility</p>
                  <p className="subtitle">
                    Use these toggles to control whether the movie is highlighted in listings.
                  </p>
                </div>

                <div className="form-group full-width">
                  <div className="toggle-row" role="group" aria-label="Movie visibility toggles">
                    <label className={`pill-toggle ${isNowShowing ? "active" : ""}`}>
                      <input
                        type="checkbox"
                        checked={isNowShowing}
                        onChange={(e) => setIsNowShowing(e.target.checked)}
                      />
                      Now Showing
                    </label>
                    <label className={`pill-toggle ${isComingSoon ? "active" : ""}`}>
                      <input
                        type="checkbox"
                        checked={isComingSoon}
                        onChange={(e) => setIsComingSoon(e.target.checked)}
                      />
                      Coming Soon
                    </label>
                  </div>
                </div>
              </div>

              <div className="form-footer admin-movie-footer">
                <button
                  type="button"
                  className="action-btn secondary"
                  onClick={resetAll}
                  disabled={isSubmitting}
                >
                  Clear
                </button>
                <button type="submit" disabled={isSubmitting} className="submit-btn">
                  <TicketPlus size={18} />
                  {isSubmitting ? "Adding movie..." : "Add Movie"}
                </button>
              </div>
            </form>
          </div>

          <div className="content-card movie-preview-card">
            <div className="card-header">
              <h2>Preview</h2>
              <span className="text-btn" aria-hidden="true">
                Poster
              </span>
            </div>

            {selectedMeta ? (
              <div className="movie-preview">
                <img
                  src={selectedMeta.poster}
                  alt={selectedMeta.title}
                  className="movie-poster"
                  loading="lazy"
                />

                <div className="movie-preview-info">
                  <h3 title={selectedMeta.title}>{selectedMeta.title}</h3>
                  <p className="movie-sub">
                    {[selectedMeta.year, form.language].filter(Boolean).join(" • ") || "TMDB selection"}
                  </p>

                  {genreTags.length > 0 ? (
                    <div className="chip-row" aria-label="Genres">
                      {genreTags.slice(0, 6).map((tag) => (
                        <span key={tag} className="chip">
                          {tag}
                        </span>
                      ))}
                    </div>
                  ) : null}

                  <div className="movie-preview-meta">
                    <div>
                      <span className="key">Runtime</span>
                      <span className="val">
                        {form.duration ? `${form.duration} min` : "—"}
                      </span>
                    </div>
                    <div>
                      <span className="key">TMDB</span>
                      <span className="val">{form.tmdbId || "—"}</span>
                    </div>
                  </div>

                  <p className="movie-note">
                    Poster/banner are fetched automatically from TMDB on submit.
                  </p>
                </div>
              </div>
            ) : (
              <div className="movie-preview-empty">
                <p className="empty-title">No movie selected yet</p>
                <p className="empty-subtitle">
                  Search TMDB and pick a result to see the poster + auto-filled details here.
                </p>
              </div>
            )}
          </div>
        </section>
      </main>
    </div>
  );
}
