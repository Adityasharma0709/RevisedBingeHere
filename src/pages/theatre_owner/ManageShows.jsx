import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import {
  ArrowLeft,
  Clapperboard,
  Calendar,
  Clock,
  Layout,
  Save,
  Plus,
  Ticket,
} from "lucide-react";
import { getTheatresByOwner } from "../../services/theatre.services";
import { getMovies } from "../../services/movie.service";
import { createShow } from "../../services/show.service";
import Loader from "../../components/Common/Loader.jsx";
import toast from "react-hot-toast";
import "./ManageShows.css";

const ManageShows = () => {
  const navigate = useNavigate();
  const [isLoading, setIsLoading] = useState(true);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [user, setUser] = useState(null);

  const [theatre, setTheatre] = useState(null);
  const [movies, setMovies] = useState([]);

  const [formData, setFormData] = useState({
    movie: "",
    screen: "",
    date: "",
    time: "",
    price: 200,
  });

  useEffect(() => {
    const storedUser = localStorage.getItem("user");
    if (storedUser) {
      const parsedUser = JSON.parse(storedUser);
      setUser(parsedUser);
      loadInitialData(parsedUser._id);
    } else {
      navigate("/auth");
    }
  }, [navigate]);

  const loadInitialData = async (userId) => {
    try {
      setIsLoading(true);
      const [theatreData, moviesData] = await Promise.all([
        getTheatresByOwner(userId),
        getMovies(),
      ]);

      if (Array.isArray(theatreData) && theatreData.length > 0) {
        setTheatre(theatreData[0]);
      } else if (theatreData && !Array.isArray(theatreData)) {
        setTheatre(theatreData);
      }

      setMovies(Array.isArray(moviesData) ? moviesData : []);
    } catch (error) {
      toast.error("Failed to load data for show creation");
    } finally {
      setIsLoading(false);
    }
  };

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (
      !formData.movie ||
      !formData.screen ||
      !formData.date ||
      !formData.time
    ) {
      toast.error("Please fill in all show details");
      return;
    }

    // Combine date and time into ISO string
    const localDateTime = new Date(`${formData.date}T${formData.time}`);
    const startTimeStr = localDateTime.toISOString();
    const endDate = new Date(localDateTime.getTime() + 2.5 * 60 * 60 * 1000);
    const showPayload = {
      movie: formData.movie,
      theatre: theatre._id,
      screen: formData.screen,
      startTime: startTimeStr,
      endTime: endDate.toISOString(),
      price: parseInt(formData.price),
    };

    try {
      setIsSubmitting(true);
      await createShow(showPayload, user._id);
      toast.success("Show created successfully! 🎉");
      navigate("/owner/dashboard");
    } catch (error) {
      toast.error(error.message || "Failed to create show");
    } finally {
      setIsSubmitting(false);
    }
  };

  if (isLoading) return <Loader isLoading={true} />;

  return (
    <div className="manage-shows-page">
      <header className="page-header">
        <button
          className="back-btn"
          onClick={() => navigate("/owner/dashboard")}
        >
          <ArrowLeft size={18} /> Dashboard
        </button>
        <h1>Schedule New Show</h1>
        <p>Assign a movie to a screen and set the timings.</p>
      </header>

      <main className="shows-container">
        <div className="card floating">
          <div className="card-header">
            <Plus className="text-amber" size={24} />
            <h2>Show Configuration</h2>
          </div>

          <form onSubmit={handleSubmit} className="show-form">
            <div className="form-grid">
              <div className="form-group full-width">
                <label>
                  <Clapperboard size={14} /> Select Movie
                </label>
                <select
                  name="movie"
                  value={formData.movie}
                  onChange={handleChange}
                  required
                >
                  <option value="">Choose a movie...</option>
                  {movies.map((movie) => (
                    <option key={movie._id} value={movie._id}>
                      {movie.name || movie.title}
                    </option>
                  ))}
                </select>
              </div>

              <div className="form-group">
                <label>
                  <Layout size={14} /> Assign Screen
                </label>
                <select
                  name="screen"
                  value={formData.screen}
                  onChange={handleChange}
                  required
                >
                  <option value="">Choose a screen...</option>
                  {theatre?.screens?.map((screen) => (
                    <option key={screen._id} value={screen._id}>
                      {screen.name}
                    </option>
                  ))}
                </select>
              </div>

              <div className="form-group">
                <label>
                  <Ticket size={14} /> Ticket Price (INR)
                </label>
                <input
                  type="number"
                  name="price"
                  value={formData.price}
                  onChange={handleChange}
                  min="0"
                  required
                />
              </div>

              <div className="form-group">
                <label>
                  <Calendar size={14} /> Date
                </label>
                <input
                  type="date"
                  name="date"
                  value={formData.date}
                  onChange={handleChange}
                  required
                />
              </div>

              <div className="form-group">
                <label>
                  <Clock size={14} /> Start Time
                </label>
                <input
                  type="time"
                  name="time"
                  value={formData.time}
                  onChange={handleChange}
                  required
                />
              </div>
            </div>

            <div className="form-footer">
              <p className="hint">
                The end time will be automatically calculated based on average
                movie duration.
              </p>
              <button
                type="submit"
                className="submit-btn"
                disabled={isSubmitting}
              >
                <Save size={18} />{" "}
                {isSubmitting ? "Processing..." : "Create Show"}
              </button>
            </div>
          </form>
        </div>
      </main>
    </div>
  );
};

export default ManageShows;
