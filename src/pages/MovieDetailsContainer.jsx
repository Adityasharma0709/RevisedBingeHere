import { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import MovieDetails from "./MovieDetails";
import { getMovieById } from "../services/movie.service";
import Loader from "../components/Common/Loader.jsx";

const API_KEY = import.meta.env.VITE_TMDB_KEY;
const BASE_URL = "https://api.themoviedb.org/3";

const MovieDetailsContainer = () => {
  const { movieId } = useParams();
  const navigate = useNavigate();
  const [movie, setMovie] = useState(null);
  const [cast, setCast] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchData = async () => {
      if (!movieId) return;
      try {
        const isMongoId = /^[a-f\d]{24}$/i.test(movieId);

        let movieData;
        let castData = { cast: [] };

        if (isMongoId) {
          const localMovie = await getMovieById(movieId);
          const rawMovie = localMovie.movie || localMovie.data || localMovie;

          if (rawMovie.tmdbId) {
            const movieRes = await fetch(
              `${BASE_URL}/movie/${rawMovie.tmdbId}?api_key=${API_KEY}&language=en-US`,
            );
            movieData = await movieRes.json();
            movieData.localId = rawMovie._id; // Inject local ID for booking

            const castRes = await fetch(
              `${BASE_URL}/movie/${rawMovie.tmdbId}/credits?api_key=${API_KEY}`,
            );
            const castDataTmdb = await castRes.json();
            castData = { cast: castDataTmdb.cast || [] };
          } else {
            movieData = {
              id: rawMovie._id,
              localId: rawMovie._id,
              title: rawMovie.name,
              overview: rawMovie.description || "No overview available.",
              runtime: rawMovie.duration || 0,
              release_date: rawMovie.createdAt?.split("T")[0] || "N/A",
              vote_average: rawMovie.ratings || rawMovie.totalReviews || 0,
              backdrop_path: rawMovie.poster,
              poster_path: rawMovie.poster,
              original_language: rawMovie.language || "EN",
              genres: rawMovie.genre?.map((g, i) => ({ id: i, name: g })) || [],
              tagline: rawMovie.description
                ? rawMovie.description.substring(0, 50) + "..."
                : "",
            };
            castData = { cast: rawMovie.cast || [] };
          }
        } else {
          const movieRes = await fetch(
            `${BASE_URL}/movie/${movieId}?api_key=${API_KEY}&language=en-US`,
          );
          movieData = await movieRes.json();

          const castRes = await fetch(
            `${BASE_URL}/movie/${movieId}/credits?api_key=${API_KEY}`,
          );
          castData = await castRes.json();
        }

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

  useEffect(() => {
    if (movie?.title || movie?.name) {
      document.title = movie.title || movie.name;
    }

    return () => {
      document.title = "BingeHere";
    };
  }, [movie]);

  return (
    <>
      <Loader isLoading={loading} />
      {!loading && !movie && (
        <div className="flex flex-col items-center justify-center min-h-screen text-white">
          <h2 className="text-2xl font-bold">Movie not found</h2>
          <button
            onClick={() => navigate("/")}
            className="mt-4 px-6 py-2 bg-red-600 rounded-full hover:bg-red-700 transition"
          >
            Go back home
          </button>
        </div>
      )}
      {movie && <MovieDetails movie={movie} cast={cast} />}
    </>
  );
};

export default MovieDetailsContainer;
