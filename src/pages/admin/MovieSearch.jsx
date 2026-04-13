/* eslint-disable react-hooks/immutability */
import { useState } from "react";
import { searchMovies } from "../../services/movie.service.js";

export default function MovieSearch({ onSelect }) {
  const [query, setQuery] = useState("");
  const [results, setResults] = useState([]);

  let timeout;

  const handleSearch = (value) => {
    setQuery(value);

    clearTimeout(timeout);

    timeout = setTimeout(async () => {
      if (value.length < 2) return;

      const data = await searchMovies(value);
      setResults(data);
    }, 300);
  };

  return (
    <div className="search-box">
      <input
        type="text"
        placeholder="Search movie..."
        value={query}
        onChange={(e) => handleSearch(e.target.value)}
      />

      <div className="dropdown">
        {results.map((movie) => (
          <div
            key={movie.tmdbId}
            className="dropdown-item"
            onClick={() => {
              onSelect(movie);
              setQuery(movie.title);
              setResults([]);
            }}
          >
            <img src={movie.poster} alt="" />
            <span>
              {movie.title} ({movie.releaseDate?.slice(0, 4)})
            </span>
          </div>
        ))}
      </div>
    </div>
  );
}