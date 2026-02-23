import { useEffect, useState } from "react";
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

  const categories = [
    { name: "Movies", color: "bg-red-500" },
    { name: "Events", color: "bg-blue-500" },
    { name: "Sports", color: "bg-green-500" },
    { name: "Plays", color: "bg-yellow-500" },
  ];

  const premiereMovies = [
    {
      title: "Saw X",
      language: "English",
      poster:
        "https://assets-in.bmscdn.com/discovery-catalog/events/tr:w-400,h-600,bg-CCCCCC:l-image,i-discovery-catalog@@icons@@bms_premiere_v1.png,t-false,lfo-bottom_left,l-end/et00363723-lslvgbmpbl-portrait.jpg",
    },
    {
      title: "Blackmail",
      language: "Tamil",
      poster:
        "https://assets-in.bmscdn.com/discovery-catalog/events/tr:w-400,h-600,bg-CCCCCC:l-image,i-discovery-catalog@@icons@@bms_premiere_v1.png,t-false,lfo-bottom_left,l-end/et00452580-avxwmqbpfa-portrait.jpg",
    },
    {
      title: "The Internship",
      language: "English",
      poster:
        "https://assets-in.bmscdn.com/discovery-catalog/events/tr:w-400,h-600,bg-CCCCCC:l-image,i-discovery-catalog@@icons@@bms_premiere_v1.png,t-false,lfo-bottom_left,l-end/et00482510-gawdctkxzh-portrait.jpg",
    },
    {
      title: "Anaconda",
      language: "English",
      poster:
        "https://assets-in.bmscdn.com/discovery-catalog/events/tr:w-400,h-600,bg-CCCCCC:l-image,i-discovery-catalog@@icons@@bms_premiere_v1.png,t-false,lfo-bottom_left,l-end/et00448751-cpyhcaemzh-portrait.jpg",
    },
    {
      title: "Christmas Karma",
      language: "English",
      poster:
        "https://assets-in.bmscdn.com/discovery-catalog/events/tr:w-400,h-600,bg-CCCCCC:l-image,i-discovery-catalog@@icons@@bms_premiere_v1.png,t-false,lfo-bottom_left,l-end/et00463857-qbjwmggljk-portrait.jpg",
    },
  ];

  const [trendingMovies, setTrendingMovies] = useState([]);

  // 🔹 Premiere carousel state
  const [premiereIndex, setPremiereIndex] = useState(0);
  const cardWidth = 200; // approx width of one PremiereCard
  const visibleCards = 5;
  const maxIndex = premiereMovies.length - visibleCards;

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

  return (
    <div className="bg-gray-50 min-h-screen font-sans text-gray-800">
      {/* NAVBAR */}
      <Navbar2 />

      {/* HERO */}
      <CategoryBar />
      {/* <BannerCarousel /> */}
      <WindowCarousel />

      {/* CATEGORIES */}
      <section className="py-12 px-6">
        <h2 className="text-2xl font-bold mb-6 text-center">
          Browse by Category
        </h2>

        <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
          {categories.map((cat) => (
            <div
              key={cat.name}
              className={`${cat.color} h-24 rounded-lg flex items-center justify-center text-white text-lg font-semibold cursor-pointer hover:scale-105 transition`}
            >
              {cat.name}
            </div>
          ))}
        </div>
      </section>


      {/* TRENDING MOVIES (CAROUSEL) */}
      <section className="py-8 px-6 bg-white relative overflow-hidden">
        <div className="flex justify-between items-center mb-4">
          <h2 className="text-2xl font-bold">Trending Movies</h2>
          <span className="text-red-500 cursor-pointer text-sm font-semibold">
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
            className="absolute left-0 top-1/2 -translate-y-1/2 bg-black/50 text-white w-10 h-10 rounded-full flex items-center justify-center"
          >
            {"<"}
          </button>

          <button
            onClick={nextTrending}
            className="absolute right-0 top-1/2 -translate-y-1/2 bg-black/50 text-white w-10 h-10 rounded-full flex items-center justify-center"
          >
            {">"}
          </button>
        </div>
      </section>

      {/* PREMIERES (CAROUSEL) */}
      <section className="bg-[#2b3149] py-10 px-6 relative overflow-hidden">
        <div className="mb-6">
          <h2 className="text-white text-2xl font-bold">Premieres</h2>
          <p className="text-gray-300 text-sm">
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
                key={movie.title}
                title={movie.title}
                language={movie.language}
                poster={movie.poster}
              />
            ))}
          </div>

          <button
            onClick={prevPremiere}
            className="absolute left-0 top-1/2 -translate-y-1/2 bg-black/50 text-white w-10 h-10 rounded-full flex items-center justify-center"
          >
            ‹
          </button>

          <button
            onClick={nextPremiere}
            className="absolute right-0 top-1/2 -translate-y-1/2 bg-black/50 text-white w-10 h-10 rounded-full flex items-center justify-center"
          >
            ›
          </button>
        </div>
      </section>

      {/* FOOTER */}
      <footer className="bg-gray-800 text-white py-6 text-center">
        <p className="text-sm">© 2026 BingeHere. All Rights Reserved.</p>
      </footer>
    </div>
  );
}

export default App;
