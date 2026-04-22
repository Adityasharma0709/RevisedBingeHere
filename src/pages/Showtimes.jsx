import { useEffect, useState, useMemo } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import { ArrowLeft } from "lucide-react";
import { getShowsByMovie } from "../services/show.service";
import Loader from "../components/Common/Loader.jsx";
import "./css/Showtimes.css";

export default function Showtimes() {
  const navigate = useNavigate();
  const { state } = useLocation();

  const [shows, setShows] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [selectedDate, setSelectedDate] = useState("");
  const [selectedLocation, setSelectedLocation] = useState("");

  const movieName = state?.movie || "Selected Movie";
  const language = state?.language || "English";
  const runtime = state?.runtime
    ? `${Math.floor(state.runtime / 60)}h ${state.runtime % 60}m`
    : "N/A";
  const genres = state?.genres?.length ? state.genres.slice(0, 3) : ["Drama"];

  // Safely extract YYYY-MM-DD in local time
  const getLocalDateString = (isoString) => {
    const d = new Date(isoString);
    if (isNaN(d)) return "";
    const yr = d.getFullYear();
    const mo = String(d.getMonth() + 1).padStart(2, "0");
    const da = String(d.getDate()).padStart(2, "0");
    return `${yr}-${mo}-${da}`;
  };

  // Fetch shows on mount
  useEffect(() => {
    const fetchShows = async () => {
      if (!state?.movieId) {
        setIsLoading(false);
        return;
      }
      try {
        setIsLoading(true);
        const data = await getShowsByMovie(state.movieId);
        setShows(data);

        // Extract unique locations and dates from data
        const uniqueLocations = [
          ...new Set(data.map((s) => s.theatre?.location?.city)),
        ].filter(Boolean);

        if (uniqueLocations.length > 0) {
          setSelectedLocation(uniqueLocations[0]);
        }
        // uniqueDate calculation and selection is now handled by useMemo and useEffect below
      } catch (err) {
        console.error("Failed to fetch shows:", err);
      } finally {
        setIsLoading(false);
      }
    };

    fetchShows();
  }, [state?.movieId]);

  // Derive dynamic dates and locations for the UI
  const locations = useMemo(() => {
    return [...new Set(shows.map((s) => s.theatre?.location?.city))].filter(
      Boolean,
    );
  }, [shows]);

  const dates = useMemo(() => {
    if (!selectedLocation) return [];
    return [
      ...new Set(
        shows
          .filter((s) => s.theatre?.location?.city === selectedLocation)
          .map((s) => getLocalDateString(s.startTime)),
      ),
    ].filter(Boolean).sort();
  }, [shows, selectedLocation]);

  // Adjust selectedDate when dates change (e.g., location changes)
  useEffect(() => {
    if (dates.length > 0 && !dates.includes(selectedDate)) {
      setSelectedDate(dates[0]);
    } else if (dates.length === 0) {
      setSelectedDate("");
    }
  }, [dates, selectedDate]);

  // Group shows by theatre for the current selection
  const theatresList = useMemo(() => {
    if (!selectedDate || !selectedLocation) return [];

    const filteredShows = shows.filter((s) => {
      const showDate = getLocalDateString(s.startTime);

      return (
        s.theatre?.location?.city === selectedLocation &&
        showDate === selectedDate
      );
    });

    const grouping = {};
    filteredShows.forEach((show) => {
      const theatreId = show.theatre._id;
      if (!grouping[theatreId]) {
        grouping[theatreId] = {
          id: theatreId,
          name: show.theatre.name,
          location: show.theatre.location.address || show.theatre.location.city,
          shows: [],
        };
      }
      grouping[theatreId].shows.push({
        id: show._id,
        time: new Date(show.startTime).toLocaleTimeString("en-US", {
          hour: "2-digit",
          minute: "2-digit",
          hour12: true,
        }),
      });
    });

    return Object.values(grouping);
  }, [shows, selectedDate, selectedLocation]);

  const formatDateLabel = (dateStr) => {
    const d = new Date(dateStr);
    const day = d
      .toLocaleDateString("en-US", { weekday: "short" })
      .toUpperCase();
    const date = d.getDate().toString().padStart(2, "0");
    return `${day} ${date}`;
  };

  return (
    <div className="showtimes-page">
      <Loader isLoading={isLoading} />
      <nav className="showtimes-nav">
        <button className="showtimes-back" onClick={() => navigate("/landing2")}>
          <ArrowLeft size={18} />
          Back
        </button>

        <div
          className="logo"
          onClick={() => navigate("/landing2")}
          style={{ cursor: "pointer" }}
        >
          BingeHere
        </div>

        <div className="nav-search">
          <input placeholder="Search for Movies, Events, Plays..." />
        </div>

        <div className="nav-right">
          <select
            className="location-select"
            value={selectedLocation}
            onChange={(e) => setSelectedLocation(e.target.value)}
          >
            {locations.length > 0 ? (
              locations.map((loc) => (
                <option key={loc} value={loc}>
                  {loc}
                </option>
              ))
            ) : (
              <option disabled>No locations available</option>
            )}
          </select>
        </div>
      </nav>

      <section className="movie-info">
        <div className="movie-info-glow" aria-hidden="true" />
        <p className="movie-eyebrow">Book your next show</p>
        <h1 className="movie-title">
          {movieName} <span>({language})</span>
        </h1>
        <p className="movie-subtitle">
          Pick a date, choose a theatre, and lock in the best seats before they
          are gone.
        </p>
        <div className="movie-tags">
          <span className="tag-primary">{runtime}</span>
          {genres.map((genre) => (
            <span key={genre}>{genre}</span>
          ))}
          <span>{selectedLocation || "Not selected"}</span>
        </div>
      </section>

      <section className="date-bar-section">
        <div className="section-heading">
          <h2>Available show dates</h2>
          <p>
            Tap a day to refresh theatres and show timings for{" "}
            {selectedLocation}.
          </p>
        </div>

        <div className="date-bar">
          {dates.length > 0 ? (
            dates.map((date) => (
              <button
                key={date}
                className={
                  date === selectedDate ? "date-btn active" : "date-btn"
                }
                onClick={() => setSelectedDate(date)}
              >
                {formatDateLabel(date)}
              </button>
            ))
          ) : (
            <p className="empty-state">No show dates available.</p>
          )}
        </div>
      </section>

      <section className="theatre-list">
        <div className="theatre-list-header">
          <h2>Theatres near you</h2>
          <span>{theatresList.length} venues</span>
        </div>

        {!isLoading && theatresList.length === 0 ? (
          <p className="empty-state">
            No shows available for this date and location.
          </p>
        ) : (
          theatresList.map((theatre, idx) => (
            <div className="theatre-card" key={idx}>
              <div className="theatre-info">
                <h3>{theatre.name}</h3>
                <p>{theatre.location}</p>
                <div className="theatre-badges">
                  <span>Fast filling</span>
                  <span>Instant booking</span>
                </div>
              </div>

              <div className="showtimes">
                {theatre.shows.map((show) => (
                  <button
                    key={show.id}
                    className="time-btn"
                    onClick={() =>
                      navigate("/seats", {
                        state: {
                          movieId: state?.movieId,
                          showId: show.id,
                          theatreId: theatre.id,
                          movie: movieName,
                          language,
                          theatre: theatre.name,
                          location: theatre.location,
                          date: formatDateLabel(selectedDate),
                          time: show.time,
                        },
                      })
                    }
                  >
                    {show.time}
                  </button>
                ))}
              </div>
            </div>
          ))
        )}
      </section>
    </div>
  );
}
