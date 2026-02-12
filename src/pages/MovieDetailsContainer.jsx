import { useEffect, useState } from "react";
import MovieDetails from "./MovieDetails";

const API_KEY = import.meta.env.VITE_TMDB_KEY;
const BASE_URL = "https://api.themoviedb.org/3";

const MovieDetailsContainer = () => {
  const movieId = 205022; // Chennai Express

  const [movie, setMovie] = useState(null);
  const [cast, setCast] = useState([]);

  useEffect(() => {
    const fetchData = async () => {
      const movieRes = await fetch(
        `${BASE_URL}/movie/${movieId}?api_key=${API_KEY}&language=en-US`
      );
      const movieData = await movieRes.json();

      const castRes = await fetch(
        `${BASE_URL}/movie/${movieId}/credits?api_key=${API_KEY}`
      );
      const castData = await castRes.json();

      setMovie(movieData);
      setCast(castData.cast);
    };

    fetchData();
  }, []);

if (!movie || !cast.length) return <p>Loading...</p>;

  return <MovieDetails movie={movie} cast={cast} />;
};

export default MovieDetailsContainer;
