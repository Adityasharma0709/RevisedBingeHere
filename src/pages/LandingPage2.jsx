




import { useEffect, useState } from "react";
import { ArrowRight } from "lucide-react";
import { useNavigate } from "react-router-dom";

import CategoryBar from "../components/landing/LandingPage2/category";
import {Navbar2} from "../components/landing/LandingPage2/Navbar2";
import WindowCarousel from "../components/landing/LandingPage2/WindowCarousel";
import MovieCard from "../components/landing/LandingPage2/MovieCard";
import PremiereCard from "../components/landing/LandingPage2/PremierCard";

function App() {
  const navigate = useNavigate();
  const API_KEY = import.meta.env.VITE_TMDB_KEY;
  const BASE_URL = "https://api.themoviedb.org/3";
  const IMG_500 = "https://image.tmdb.org/t/p/w500";

  useEffect(() => {
    document.title = "BingeHere";
  }, []);

  const categories = [
    { name: "Comedy", color: "bg-red-500" },
    { name: "Action", color: "bg-blue-500" },
    { name: "Adventure", color: "bg-green-500" },
    { name: "Thriller", color: "bg-yellow-500" },
  ];

  const [premiereMovies, setPremiereMovies] = useState([]);

  const [trendingMovies, setTrendingMovies] = useState([]);

  // ðŸ”¹ Premiere carousel state
  const [premiereIndex, setPremiereIndex] = useState(0);
  const cardWidth = 200; // approx width of one PremiereCard
  const visibleCards = 5;
  const maxIndex = Math.max(0, premiereMovies.length - visibleCards);

  const nextPremiere = () => {
    setPremiereIndex((prev) => (prev >= maxIndex ? 0 : prev + 1));
  };

  const prevPremiere = () => {
    setPremiereIndex((prev) => (prev <= 0 ? maxIndex : prev - 1));
  };

  // Trending carousel state
  const [trendingIndex, setTrendingIndex] = useState(0);
  const trendingMaxIndex = Math.max(0, trendingMovies.length - visibleCards);

  const nextTrending = () => {
    setTrendingIndex((prev) => (prev >= trendingMaxIndex ? 0 : prev + 1));
  };

  const prevTrending = () => {
    setTrendingIndex((prev) => (prev <= 0 ? trendingMaxIndex : prev - 1));
  };

  useEffect(() => {
    const fetchTrending = async () => {
      if (!API_KEY) {
        console.error("Missing VITE_TMDB_KEY in environment.");
        return;
      }

      try {
        const res = await fetch(
          `${BASE_URL}/trending/movie/week?api_key=${API_KEY}&language=en-US&page=1`
        );
        const data = await res.json();
        setTrendingMovies(data?.results || []);
      } catch (err) {
        console.error("Failed to fetch trending movies:", err);
      }
    };

    fetchTrending();
  }, [API_KEY]);

  useEffect(() => {
    const fetchPremieres = async () => {
      if (!API_KEY) return;
      try {
        const res = await fetch(
          `${BASE_URL}/movie/upcoming?api_key=${API_KEY}&language=en-US&page=1`
        );
        const data = await res.json();
        setPremiereMovies(data?.results || []);
      } catch (err) {
        console.error("Failed to fetch premiere movies:", err);
      }
    };

    fetchPremieres();
  }, [API_KEY]);

  return (
    <div className="bg-[#0b0f1a] min-h-screen font-sans text-slate-100">
      {/* NAVBAR */}
      <Navbar2 />

      {/* HERO */}
      <CategoryBar />
      {/* <BannerCarousel /> */}
      <WindowCarousel />

      {/* CATEGORIES */}
      <section className="py-12 px-6">
        <h2 className="text-2xl font-bold mb-6 text-center text-slate-100">
          Browse by Category
        </h2>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {categories.map((cat) => (
            <div
              key={cat.name}
              className="cursor-pointer group hover:scale-105 transition-transform duration-300"
            >
              <div
                className={`relative ${cat.color} text-white px-6 py-4 shadow-2xl flex items-center gap-4 overflow-hidden`}
                style={{
                  maskImage: `radial-gradient(circle at 0 50%, transparent 10px, black 11px),
                              radial-gradient(circle at 100% 50%, transparent 10px, black 11px)`,
                  maskComposite: "intersect",
                  WebkitMaskImage: `radial-gradient(circle at 0 50%, transparent 10px, black 11px),
                                    radial-gradient(circle at 100% 50%, transparent 10px, black 11px)`,
                  WebkitMaskComposite: "source-in",
                }}
              >
                <div className="absolute left-[70%] top-2 bottom-2 border-l-2 border-dashed border-white/30" />

                <div className="flex flex-col items-start pr-14">
                  <span className="text-[10px] uppercase tracking-widest text-white/70 font-bold">
                    Category
                  </span>
                  <span className="text-2xl font-black tracking-tighter uppercase">
                    {cat.name}
                  </span>
                </div>

                <div className="absolute right-4 top-1/2 -translate-y-1/2 group-hover:translate-x-1 transition-transform">
                  <div className="bg-white/20 p-2 rounded-full">
                    <ArrowRight size={20} />
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>
      </section>


      {/* TRENDING MOVIES (CAROUSEL) */}
      <section className="py-8 px-6 bg-[#0f172a] relative overflow-hidden border-y border-white/5">
        <div className="flex justify-between items-center mb-4">
          <h2 className="text-2xl font-bold">Trending Movies</h2>
          <span className="text-rose-400 cursor-pointer text-sm font-semibold">
            See All
          </span>
        </div>

        <div className="relative">
          <div
            className="flex gap-4 transition-transform duration-500 ease-in-out"
            style={{
              transform: `translateX(-${trendingIndex * cardWidth}px)`,
            }}
          >
            {trendingMovies.map((movie) => (
              <MovieCard
                key={movie.id}
                title={movie.title}
                poster={
                  movie.poster_path
                    ? `${IMG_500}${movie.poster_path}`
                    : "/no-poster.png"
                }
                promoted={movie.vote_average >= 7.5}
                onClick={() => navigate(`/movie/${movie.id}`)}
              />
            ))}
          </div>

          <button
            onClick={prevTrending}
            className="absolute left-0 top-1/2 -translate-y-1/2 bg-black/60 text-white w-10 h-10 rounded-full flex items-center justify-center ring-1 ring-white/10 hover:bg-black/80 transition"
          >
            {"<"}
          </button>

          <button
            onClick={nextTrending}
            className="absolute right-0 top-1/2 -translate-y-1/2 bg-black/60 text-white w-10 h-10 rounded-full flex items-center justify-center ring-1 ring-white/10 hover:bg-black/80 transition"
          >
            {">"}
          </button>
        </div>
      </section>

      {/* PREMIERES (CAROUSEL) */}
      <section className="bg-[#131a2e] py-10 px-6 relative overflow-hidden border-t border-white/5">
        <div className="mb-6">
          <h2 className="text-white text-2xl font-bold">Premieres</h2>
          <p className="text-slate-300 text-sm">
            Brand new releases every Friday
          </p>
        </div>

        <div className="relative">
          <div
            className="flex justify-center gap-4 transition-transform duration-500 ease-in-out"
            style={{
              transform: `translateX(-${premiereIndex * cardWidth}px)`,
            }}
          >
            {premiereMovies.map((movie) => (
              <PremiereCard
                key={movie.id}
                title={movie.title}
                language={movie.original_language?.toUpperCase() || "EN"}
                poster={
                  movie.poster_path
                    ? `${IMG_500}${movie.poster_path}`
                    : "/no-poster.png"
                }
                onClick={() => navigate(`/movie/${movie.id}`)}
              />
            ))}
          </div>

          <button
            onClick={prevPremiere}
            className="absolute left-0 top-1/2 -translate-y-1/2 bg-black/60 text-white w-10 h-10 rounded-full flex items-center justify-center ring-1 ring-white/10 hover:bg-black/80 transition"
          >
            {"<"}
          </button>

          <button
            onClick={nextPremiere}
            className="absolute right-0 top-1/2 -translate-y-1/2 bg-black/60 text-white w-10 h-10 rounded-full flex items-center justify-center ring-1 ring-white/10 hover:bg-black/80 transition"
          >
            {">"}
          </button>
        </div>
      </section>

      {/* FOOTER */}
      <footer className="bg-[#0b0f1a] text-slate-400 py-6 text-center border-t border-white/5">
        <p className="text-sm">© 2026 BingeHere. All Rights Reserved.</p>
      </footer>
    </div>
  );
}

export default App;


