import { useEffect, useMemo, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";

import { Navbar2 } from "../components/landing/LandingPage2/Navbar2";
import MovieCard from "../components/landing/LandingPage2/MovieCard";
import Loader from "../components/Common/Loader.jsx";
import { fetchMoviesByLocationAndCategory } from "../services/movie.service";

const MoviesByLocationCategory = () => {
  const navigate = useNavigate();
  const { category } = useParams();

  const decodedCategory = useMemo(() => {
    try {
      return decodeURIComponent(category || "");
    } catch {
      return category || "";
    }
  }, [category]);

  const [movies, setMovies] = useState([]);
  const [location, setLocation] = useState({ city: "", state: "" });
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    let isActive = true;

    const fetchMovies = async () => {
      setLoading(true);
      setError("");

      try {
        const userStr = localStorage.getItem("user");
        const userObj = userStr ? JSON.parse(userStr) : null;
        const userId =
          userObj?._id ||
          userObj?.id ||
          userObj?.userId ||
          localStorage.getItem("userId") ||
          "";

        const data = await fetchMoviesByLocationAndCategory(decodedCategory, userId);

        if (!isActive) return;

        setMovies(Array.isArray(data?.movies) ? data.movies : []);
        const city = data?.city || "";
        const state =
          data?.theatres && data.theatres[0] && data.theatres[0].location
            ? data.theatres[0].location.state
            : "";
        setLocation({ city, state });
      } catch (err) {
        if (!isActive) return;
        setMovies([]);
        setError(err?.message || "Failed to fetch movies.");
      } finally {
        if (isActive) setLoading(false);
      }
    };

    if (decodedCategory) {
      fetchMovies();
    } else {
      setMovies([]);
      setError("Category is required.");
      setLoading(false);
    }

    return () => {
      isActive = false;
    };
  }, [decodedCategory]);

  return (
    <div className="bg-[#0b0f1a] min-h-screen font-sans text-slate-100">
      <Loader isLoading={loading} />
      <Navbar2 location={location} />

      <main className="pt-24 pb-10 px-6 md:px-10">
        <div className="flex flex-col gap-3 sm:flex-row sm:items-end sm:justify-between">
          <div>
            <p className="text-xs uppercase tracking-[0.3em] text-slate-400">
              Browse
            </p>
            <h1 className="mt-2 text-3xl font-bold text-white">
              {decodedCategory}
            </h1>
            <p className="mt-1 text-sm text-slate-300">
              {location?.city ? `Movies near ${location.city}` : "Movies near you"}
            </p>
          </div>

          <button
            type="button"
            onClick={() => navigate(-1)}
            className="inline-flex items-center justify-center rounded-full border border-white/10 bg-white/5 px-5 py-2 text-sm font-semibold text-slate-100 transition hover:bg-white/10"
          >
            Back
          </button>
        </div>

        {error ? (
          <div className="mt-8 rounded-2xl border border-rose-400/20 bg-rose-500/10 p-5 text-rose-100">
            {error}
          </div>
        ) : (
          <section className="mt-8">
            {movies.length === 0 ? (
              <div className="rounded-2xl border border-white/10 bg-white/5 p-6 text-slate-300">
                No movies found for this category in your location.
              </div>
            ) : (
              <div className="flex flex-wrap gap-4">
                {movies.map((movie) => (
                  <MovieCard
                    key={movie._id}
                    title={movie.name}
                    poster={movie.poster}
                    promoted={movie.ratings >= 7}
                    onClick={() => navigate(`/movie/${movie._id}`)}
                  />
                ))}
              </div>
            )}
          </section>
        )}
      </main>
    </div>
  );
};

export default MoviesByLocationCategory;

