import { useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import "./css/Showtimes.css";
import { Navbar2 } from "../components/landing/LandingPage2/Navbar2";
export default function Showtimes() {
  const navigate = useNavigate();
  const { state } = useLocation();

  const dates = ["MON 02", "TUE 03", "WED 04", "THU 05", "FRI 06"];
  const locations = ["Bhubaneswar", "Cuttack", "Kolkata"];

  const [selectedDate, setSelectedDate] = useState(dates[0]);
  const [selectedLocation, setSelectedLocation] = useState(locations[0]);

  const movieName = state?.movie || "Selected Movie";
  const language = state?.language || "English";
  const runtime = state?.runtime
    ? `${Math.floor(state.runtime / 60)}h ${state.runtime % 60}m`
    : "N/A";
  const genres = state?.genres?.length ? state.genres.slice(0, 3) : ["Drama"];

  const theatreData = {
    Bhubaneswar: {
      "MON 02": [
        {
          name: "Cinepolis: Nexus Esplanade",
          location: "Bhubaneswar",
          shows: ["12:55 PM", "04:10 PM", "07:30 PM"],
        },
      ],
      "TUE 03": [
        {
          name: "Cinepolis: Nexus Esplanade",
          location: "Bhubaneswar",
          shows: ["12:55 PM", "04:10 PM", "07:30 PM"],
        },
      ],
      "WED 04": [
        {
          name: "Cinepolis: Nexus Esplanade",
          location: "Bhubaneswar",
          shows: ["12:55 PM", "04:10 PM", "07:30 PM"],
        },
      ],
      "THU 05": [
        {
          name: "Cinepolis: Nexus Esplanade",
          location: "Bhubaneswar",
          shows: ["12:55 PM", "04:10 PM", "07:30 PM"],
        },
      ],
      "FRI 06": [
        {
          name: "PVR: Esplanade",
          location: "Bhubaneswar",
          shows: ["12:55 PM", "04:10 PM", "07:30 PM"],
        },
        {
          name: "Cinepolis: Nexus Esplanade",
          location: "Bhubaneswar",
          shows: ["12:55 PM", "04:10 PM", "07:30 PM"],
        },
      ],
    },
    Cuttack: {
      "MON 02": [
        {
          name: "INOX: Cuttack Mall",
          location: "Cuttack",
          shows: ["01:00 PM", "04:30 PM", "08:00 PM"],
        },
      ],
      "TUE 03": [
        {
          name: "PVR: Cuttack Central",
          location: "Cuttack",
          shows: ["12:15 PM", "06:00 PM"],
        },
      ],
      "WED 04": [
        {
          name: "PVR: Cuttack Central",
          location: "Cuttack",
          shows: ["12:15 PM", "06:00 PM"],
        },
      ],
      "THU 05": [
        {
          name: "INOX: Cuttack Mall",
          location: "Cuttack",
          shows: ["11:00 AM", "03:45 PM"],
        },
      ],
      "FRI 06": [
        {
          name: "INOX: Cuttack Mall",
          location: "Cuttack",
          shows: ["11:00 AM", "03:45 PM"],
        },
        {
          name: "PVR: Cuttack Central",
          location: "Cuttack",
          shows: ["02:00 PM", "09:00 PM"],
        },
      ],
    },
    Kolkata: {
      "MON 02": [
        {
          name: "INOX: South City Mall",
          location: "Kolkata",
          shows: ["12:30 PM", "05:00 PM", "09:45 PM"],
        },
      ],
      "TUE 03": [
        {
          name: "PVR: Quest Mall",
          location: "Kolkata",
          shows: ["11:45 AM", "04:15 PM", "08:30 PM"],
        },
      ],
      "WED 04": [
        {
          name: "INOX: South City Mall",
          location: "Kolkata",
          shows: ["01:15 PM", "06:45 PM"],
        },
        {
          name: "PVR: Quest Mall",
          location: "Kolkata",
          shows: ["11:45 AM", "04:15 PM", "08:30 PM"],
        },
        {
          name: "INOX: South City Mall",
          location: "Kolkata",
          shows: ["12:30 PM", "05:00 PM", "09:45 PM"],
        },
      ],
      "THU 05": [
        {
          name: "INOX: South City Mall",
          location: "Kolkata",
          shows: ["12:30 PM", "05:00 PM", "09:45 PM"],
        },
        {
          name: "INOX: South City Mall",
          location: "Kolkata",
          shows: ["01:15 PM", "06:45 PM"],
        },
        {
          name: "PVR: Quest Mall",
          location: "Kolkata",
          shows: ["11:45 AM", "04:15 PM", "08:30 PM"],
        },
      ],
      "FRI 06": [],
    },
  };

  const theatres = theatreData[selectedLocation][selectedDate] || [];

  return (
    <div className="showtimes-page">
      {/* <nav className="showtimes-nav">
        <div className="logo">BingeHere</div>

        <div className="nav-search">
          <input placeholder="Search for Movies, Events, Plays..." />
        </div>

        <div className="nav-right">
          <select
            className="location-select"
            value={selectedLocation}
            onChange={(e) => setSelectedLocation(e.target.value)}
          >
            {locations.map((loc) => (
              <option key={loc}>{loc}</option>
            ))}
          </select>

          {menuOpen && (
            <div className="hamburger-menu">
              <div className="menu-item">Movies</div>
              <div className="menu-item">Events</div>
              <div className="menu-item">Plays</div>
              <div className="menu-item">Sports</div>
              <div className="menu-divider"></div>
              <div className="menu-item">Offers</div>
              <div className="menu-item">Gift Cards</div>
            </div>
          )}
        </div>
      </nav> */}
      {/* <Navbar2 /> */}
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
          <span>{selectedLocation}</span>
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
          {dates.map((date) => (
            <button
              key={date}
              className={date === selectedDate ? "date-btn active" : "date-btn"}
              onClick={() => setSelectedDate(date)}
            >
              {date}
            </button>
          ))}
        </div>
      </section>

      <section className="theatre-list">
        <div className="theatre-list-header">
          <h2>Theatres near you</h2>
          <span>{theatres.length} venues</span>
        </div>

        {theatres.length === 0 ? (
          <p className="empty-state">
            No shows available for this date and location.
          </p>
        ) : (
          theatres.map((theatre, idx) => (
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
                {theatre.shows.map((time) => (
                  <button
                    key={time}
                    className="time-btn"
                    onClick={() =>
                      navigate("/seats", {
                        state: {
                          movieId: state?.movieId,
                          movie: movieName,
                          language,
                          theatre: theatre.name,
                          location: theatre.location,
                          date: selectedDate,
                          time,
                        },
                      })
                    }
                  >
                    {time}
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
