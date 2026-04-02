import { useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import "./css/Showtimes.css";

export default function Showtimes() {
  const navigate = useNavigate();
  const { state } = useLocation();

  const dates = ["MON 02", "TUE 03", "WED 04", "THU 05", "FRI 06"];
  const locations = ["Bhubaneswar", "Cuttack", "Kolkata"];

  const [selectedDate, setSelectedDate] = useState(dates[0]);
  const [selectedLocation, setSelectedLocation] = useState(locations[0]);
  const [menuOpen, setMenuOpen] = useState(false);
  const [showSignIn, setShowSignIn] = useState(false);

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
      <nav className="showtimes-nav">
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

          <button className="sign-in-btn" onClick={() => setShowSignIn(true)}>
            Sign in
          </button>

          <div className="menu-icon" onClick={() => setMenuOpen(!menuOpen)}>
            Menu
          </div>

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
      </nav>

      {showSignIn && (
        <div className="signin-overlay" onClick={() => setShowSignIn(false)}>
          <div className="signin-modal" onClick={(e) => e.stopPropagation()}>
            <h2>Sign in</h2>

            <form className="signin-form">
              <input type="email" placeholder="Email" required />
              <input type="password" placeholder="Password" required />
              <button type="submit">Continue</button>
            </form>

            <p className="signin-footer">
              New to BingeHere? <span>Create account</span>
            </p>
          </div>
        </div>
      )}

      <section className="movie-info">
        <h1>
          {movieName} <span>({language})</span>
        </h1>
        <div className="movie-tags">
          <span>{runtime}</span>
          {genres.map((genre) => (
            <span key={genre}>{genre}</span>
          ))}
        </div>
      </section>

      <section className="date-bar">
        {dates.map((date) => (
          <button
            key={date}
            className={date === selectedDate ? "date-btn active" : "date-btn"}
            onClick={() => setSelectedDate(date)}
          >
            {date}
          </button>
        ))}
      </section>

      <section className="theatre-list">
        {theatres.length === 0 ? (
          <p style={{ color: "#777", fontSize: "14px" }}>
            No shows available for this date and location.
          </p>
        ) : (
          theatres.map((theatre, idx) => (
            <div className="theatre-card" key={idx}>
              <div className="theatre-info">
                <h3>{theatre.name}</h3>
                <p>{theatre.location}</p>
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
