import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import MovieDetails from "./MovieDetails";

const API_KEY = import.meta.env.VITE_TMDB_KEY;
const BASE_URL = "https://api.themoviedb.org/3";

const MovieDetailsContainer = () => {
  const { movieId } = useParams();
  const [movie, setMovie] = useState(null);
  const [cast, setCast] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchData = async () => {
      if (!movieId) return;
      try {
        const movieRes = await fetch(
          `${BASE_URL}/movie/${movieId}?api_key=${API_KEY}&language=en-US`
        );
        const movieData = await movieRes.json();

        const castRes = await fetch(
          `${BASE_URL}/movie/${movieId}/credits?api_key=${API_KEY}`
        );
        const castData = await castRes.json();

        setMovie(movieData);
        setCast(castData.cast || []);
      } catch (err) {
        console.error("Failed to fetch movie details:", err);
      } finally {
        setLoading(false);
      }
    };

    setLoading(true);
    fetchData();
  }, [movieId]);

  if (loading || !movie) return <p>Loading...</p>;

  return <MovieDetails movie={movie} cast={cast} />;
};

export default MovieDetailsContainer;
