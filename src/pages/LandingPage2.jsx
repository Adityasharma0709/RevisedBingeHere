import { useState } from "react";

import BannerCarousel from "../components/landing/BannerCarousel";
import CategoryBar from "../components/landing/category";
import Navbar from "../components/landing/Navbar";
import WindowCarousel from "../components/landing/WindowCarousel";
import MovieCard from "../components/landing/MovieCard";
import PremiereCard from "../components/landing/PremierCard";

function App() {
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

  const movies = [
    {
      title: "Mardaani 3",
      poster:
        "https://m.media-amazon.com/images/M/MV5BZDE3NjQ5NDgtYzM0MC00NDBjLTk2NDYtOTY4ZTE2MjZjYWE5XkEyXkFqcGc@._V1_.jpg",
      promoted: true,
    },
    {
      title: "Pushpa: The Rule - Part 2",
      poster:
        "https://m.media-amazon.com/images/M/MV5BMmU0YjI0ZGMtMDY0ZC00ZmM5LWJiYmEtMzI1ZmZhZWNjZTU3XkEyXkFqcGc@._V1_.jpg",
      promoted: false,
    },
    {
      title: "The Shawshank Redemption",
      poster:
        "https://image.tmdb.org/t/p/w500/5KCVkau1HEl7ZzfPsKAPM0sMiKc.jpg",
      promoted: true,
    },
    {
      title: "Dream Girl 2",
      poster:
        "https://m.media-amazon.com/images/M/MV5BMTMzNzYzNzctNWIyNC00NDRhLWFkNGMtMzYxOTA2ZjgwYzFhXkEyXkFqcGc@._V1_QL75_UY281_CR2,0,190,281_.jpg",
      promoted: false,
    },
    {
      title: "Animal",
      poster:
        "https://m.media-amazon.com/images/M/MV5BODk2NWVkMDMtZWY3NC00YzJiLTlkMWEtZWZkZjZlY2ZjNmU5XkEyXkFqcGc@._V1_.jpg",
      promoted: false,
    },
    {
      title: "Border 2",
      poster:
        "https://m.media-amazon.com/images/M/MV5BNmRkNTQyYWMtZDRiYS00NThiLWFhYWQtOGY3YTEyMGU5MGYyXkEyXkFqcGc@._V1_.jpg",
      promoted: false,
    },
    {
      title: "Dhurandhar",
      poster:
        "https://m.media-amazon.com/images/M/MV5BMzFiNTVkZjYtM2I3Yi00MGNjLWEyYTAtMGViNGExZmMzMGMzXkEyXkFqcGc@._V1_QL75_UY281_CR18,0,190,281_.jpg",
      promoted: false,
    },
  ];

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

  return (
    <div className="bg-gray-50 min-h-screen font-sans text-gray-800">
      {/* NAVBAR */}
      <Navbar />

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

      {/* RECOMMENDED MOVIES */}
      <section className="py-8 px-6 bg-white">
        <div className="flex justify-between items-center mb-4">
          <h2 className="text-2xl font-bold">Recommended Movies</h2>
          <span className="text-red-500 cursor-pointer text-sm font-semibold">
            See All →
          </span>
        </div>

        <div className="flex gap-4 overflow-x-auto scrollbar-hide pb-2">
          {movies.map((movie) => (
            <MovieCard
              key={movie.title}
              title={movie.title}
              poster={movie.poster}
              promoted={movie.promoted}
            />
          ))}
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
        <p className="text-sm">© 2026 BookMyShow Clone. All Rights Reserved.</p>
      </footer>
    </div>
  );
}

export default App;
