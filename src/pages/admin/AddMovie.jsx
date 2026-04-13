import { useState } from "react";
import MovieSearch from "./MovieSearch.jsx";
import { createMovie } from "../../services/movie.service.js";
import "../css/addMovie.css";

export default function AddMovie() {
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

  const handleMovieSelect = async (movie) => {
    setSelectedMovie(movie);

    try {
      const tmdbKey = import.meta.env.VITE_TMDB_KEY;
      if (tmdbKey) {
        // Fetch full details to get runtime, genres, etc.
        const res = await fetch(`https://api.themoviedb.org/3/movie/${movie.tmdbId}?api_key=${tmdbKey}&language=en-US`);
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
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      // Parse the user object from local storage that AuthForm saves
      const userStr = localStorage.getItem("user");
      const userObj = userStr ? JSON.parse(userStr) : null;
      const userId = userObj?._id || userObj?.id || localStorage.getItem("userId");

      if (!userId) {
        alert("You must be logged in as an admin to add movies. No user ID found.");
        return;
      }

      const genreArray = form.genre
        .split(",")
        .map((g) => g.trim())
        .filter(Boolean);

      const movieData = {
        tmdbId: form.tmdbId,
        name: form.name,
        description: form.description,
        genre: genreArray,
        duration: Number(form.duration),
        language: form.language,
        // The backend automatically overrides poster/banner using TMDB ID
        poster: selectedMovie?.poster || "backend-will-fetch",
        isNowShowing,
        isComingSoon,
      };

      await createMovie(movieData, userId);
      alert("Movie added successfully!");

      // Reset
      setForm({ name: "", description: "", genre: "", duration: "", language: "", tmdbId: "" });
      setSelectedMovie(null);
      setIsNowShowing(false);
      setIsComingSoon(false);
    } catch (err) {
      alert(err.message);
    }
  };

  return (
    <div className="add-movie-container">
      <h2>Add Movie</h2>

      <div className="search-section">
        <p>Search TMDB to auto-fill details:</p>
        <MovieSearch onSelect={handleMovieSelect} />
      </div>

      {selectedMovie && (
        <div className="selected-movie-preview">
          <img src={selectedMovie.poster} alt={selectedMovie.title} className="poster-preview" />
          <p>Images will be automatically handled upon submission!</p>
        </div>
      )}

      <form className="movie-form" onSubmit={handleSubmit}>
        <div className="form-group">
          <label>Movie Name <span className="required">*</span></label>
          <input type="text" name="name" value={form.name} onChange={handleChange} required />
        </div>

        <div className="form-group">
          <label>Description</label>
          <textarea name="description" value={form.description} onChange={handleChange} rows="4" />
        </div>

        <div className="form-row">
          <div className="form-group">
            <label>Genre (comma separated)</label>
            <input type="text" name="genre" value={form.genre} onChange={handleChange} placeholder="Action, Drama..." />
          </div>

          <div className="form-group">
            <label>Duration (minutes)</label>
            <input type="number" name="duration" value={form.duration} onChange={handleChange} />
          </div>
        </div>

        <div className="form-row">
          <div className="form-group">
            <label>Language</label>
            <input type="text" name="language" value={form.language} onChange={handleChange} />
          </div>

          <div className="form-group">
            <label>TMDB ID</label>
            <input type="number" name="tmdbId" value={form.tmdbId} onChange={handleChange} placeholder="Optional if not from TMDB" />
          </div>
        </div>

        <div className="checkboxes">
          <label>
            <input type="checkbox" checked={isNowShowing} onChange={(e) => setIsNowShowing(e.target.checked)} />
            Now Showing
          </label>
          <label>
            <input type="checkbox" checked={isComingSoon} onChange={(e) => setIsComingSoon(e.target.checked)} />
            Coming Soon
          </label>
        </div>

        <button type="submit">Add Movie</button>
      </form>
    </div>
  );
}
