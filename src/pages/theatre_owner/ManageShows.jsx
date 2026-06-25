import React, { useState, useEffect } from "react";
import { useNavigate, useLocation } from "react-router-dom";
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

  const location = useLocation();
  const prefillMovie = location.state?.prefillMovie || "";

  const [formData, setFormData] = useState({
    movie: prefillMovie,
    screen: "",
    date: "",
    time: "",
  });

  const [pricing, setPricing] = useState({});

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
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });

    if (name === "screen") {
      const selectedScreen = theatre?.screens?.find((s) => s._id === value);
      if (selectedScreen && selectedScreen.seatLayout) {
        const newPricing = {};
        const segments = [
          ...new Set(selectedScreen.seatLayout.map((row) => row.row)),
        ];
        segments.forEach((seg) => {
          newPricing[seg] = 200; // default price
        });
        setPricing(newPricing);
      } else {
        setPricing({});
      }
    }
  };

  const handlePriceChange = (segment, value) => {
    setPricing({
      ...pricing,
      [segment]: value,
    });
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
    const pricingArray = Object.keys(pricing).map((segment) => ({
      segment,
      price: parseInt(pricing[segment]) || 0,
    }));

    const showPayload = {
      movie: formData.movie,
      theatre: theatre._id,
      screen: formData.screen,
      startTime: startTimeStr,
      endTime: endDate.toISOString(),
      pricing: pricingArray,
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

              {Object.keys(pricing).length > 0 && (
                <div className="form-group full-width pricing-section">
                  <label>
                    <Ticket size={14} /> Segment Pricing (INR)
                  </label>
                  <div
                    className="pricing-grid"
                    style={{
                      display: "grid",
                      gridTemplateColumns:
                        "repeat(auto-fit, minmax(150px, 1fr))",
                      gap: "1rem",
                      marginTop: "0.5rem",
                    }}
                  >
                    {Object.keys(pricing).map((segment) => (
                      <div key={segment} className="pricing-item">
                        <span
                          style={{
                            fontSize: "0.85rem",
                            color: "#94a3b8",
                            display: "block",
                            marginBottom: "0.4rem",
                          }}
                        >
                          {segment}
                        </span>
                        <input
                          type="number"
                          value={pricing[segment]}
                          onChange={(e) =>
                            handlePriceChange(segment, e.target.value)
                          }
                          min="0"
                          style={{
                            width: "100%",
                            background: "rgba(255,255,255,0.05)",
                            border: "1px solid rgba(255,255,255,0.1)",
                            padding: "0.8rem",
                            borderRadius: "10px",
                            color: "white",
                          }}
                          required
                        />
                      </div>
                    ))}
                  </div>
                </div>
              )}

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
