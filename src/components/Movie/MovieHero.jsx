import { motion, useScroll, useTransform } from "framer-motion";
import { FaPlay, FaStar, FaClock, FaCalendarAlt, FaTicketAlt } from "react-icons/fa";

const IMG_500 = "https://image.tmdb.org/t/p/w500";
const IMG_ORIGINAL = "https://image.tmdb.org/t/p/original";

const MovieHero = ({ movie, onWatchTrailer }) => {
  const { scrollY } = useScroll();
  const posterY = useTransform(scrollY, [0, 400], [0, -80]);
  const bgScale = useTransform(scrollY, [0, 400], [1, 1.15]);
  const textY = useTransform(scrollY, [0, 300], [0, -40]);

  const formatTime = (min) => {
    const h = Math.floor(min / 60);
    const m = min % 60;
    return `${h}h ${m}m`;
  };

  return (
    <section className="cinema-hero">
      <motion.div
        className="cinema-bg"
        style={{ scale: bgScale, backgroundImage: `url(${IMG_ORIGINAL}${movie.backdrop_path})` }}
      />
      <div className="cinema-overlay" />

      <div className="hero-content">
        <motion.div className="cinema-poster" style={{ y: posterY }}>
          <img src={`${IMG_500}${movie.poster_path}`} alt={movie.title} />
        </motion.div>

        <motion.div className="cinema-info" style={{ y: textY }}>
          <div className="glass-card">
            <h1 className="movie-title">{movie.title}</h1>

            <div className="format-badges">
              <span className="badge">2D</span>
              <span className="badge">3D</span>
              <span className="badge">IMAX</span>
              <span className="badge-lang">English</span>
              <span className="badge-lang">Hindi</span>
            </div>

            <div className="meta-row">
              <span className="rating-badge">
                <FaStar className="star-icon" /> {movie.vote_average?.toFixed(1)}
              </span>
              <span className="meta-item">
                <FaClock /> {movie.runtime ? formatTime(movie.runtime) : "N/A"}
              </span>
              <span className="meta-item">
                <FaCalendarAlt /> {movie.release_date?.split("-")[0]}
              </span>
            </div>

            <div className="genre-row">
              {movie.genres?.map((g) => (
                <span key={g.id} className="genre-pill">{g.name}</span>
              ))}
            </div>

            <p className="tagline">{movie.tagline}</p>

            <div className="action-buttons">
              <button className="btn-primary">
                <FaTicketAlt /> Book Tickets
              </button>
              <button className="btn-secondary" onClick={onWatchTrailer}>
                <FaPlay /> Watch Trailer
              </button>
            </div>
          </div>
        </motion.div>
      </div>
    </section>
  );
};

export default MovieHero;