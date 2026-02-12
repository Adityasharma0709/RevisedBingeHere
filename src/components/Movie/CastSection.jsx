import { motion } from "framer-motion";

const IMG_500 = "https://image.tmdb.org/t/p/w500";

const CastSection = ({ cast }) => {
  if (!cast || cast.length === 0) return null;

  return (
    <section className="cinema-cast">
      <h2>Top Cast</h2>
      <div className="cast-row">
        {cast.slice(0, 8).map((actor) => (
          <motion.div
            className="cast-item"
            key={actor.id}
            whileHover={{ y: -10 }}
          >
            <div className="cast-img-wrapper">
              <img
                src={
                  actor.profile_path
                    ? `${IMG_500}${actor.profile_path}`
                    : "/no-profile.png"
                }
                alt={actor.name}
              />
            </div>
            <span className="actor-name">{actor.name}</span>
            <span className="character-name">{actor.character}</span>
          </motion.div>
        ))}
      </div>
    </section>
  );
};

export default CastSection;