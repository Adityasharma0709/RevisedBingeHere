import { motion } from "framer-motion";

const IMG_500 = "https://image.tmdb.org/t/p/w500";

// This component is generic! You can pass it a title and a list of items.
const MovieRail = ({ title, movies }) => {
  if (!movies || movies.length === 0) return null;

  return (
    <section className="cinema-similar">
      <h2>{title}</h2>
      <div className="similar-row">
        {movies.map((m) => (
          <motion.div key={m.id} className="similar-card" whileHover={{ scale: 1.05 }}>
            <img
              src={m.poster_path ? `${IMG_500}${m.poster_path}` : "/no-poster.png"}
              alt={m.title}
            />
            <span className="similar-title">{m.title}</span>
          </motion.div>
        ))}
      </div>
    </section>
  );
};

export default MovieRail;