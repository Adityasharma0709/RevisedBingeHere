/* eslint-disable react-hooks/immutability */
import { useEffect, useRef, useState } from "react";
import { searchMovies } from "../../services/movie.service.js";

export default function MovieSearch({ onSelect }) {
  const [query, setQuery] = useState("");
  const [results, setResults] = useState([]);
  const timeoutRef = useRef(null);
  const abortRef = useRef(null);

  useEffect(() => {
    return () => {
      if (timeoutRef.current) clearTimeout(timeoutRef.current);
      abortRef.current?.abort?.();
    };
  }, []);

  const handleSearch = (value) => {
    setQuery(value);

    if (timeoutRef.current) clearTimeout(timeoutRef.current);
    abortRef.current?.abort?.();

    timeoutRef.current = setTimeout(async () => {
      if (value.trim().length < 2) {
        setResults([]);
        return;
      }

      try {
        abortRef.current = new AbortController();
        const data = await searchMovies(value, abortRef.current.signal);
        setResults(Array.isArray(data) ? data : []);
      } catch (error) {
        if (error?.name === "AbortError") return;
        setResults([]);
      }
    }, 300);
  };

  return (
    <div className="search-box">
      <input
        type="text"
        placeholder="Search TMDB movie..."
        value={query}
        onChange={(e) => handleSearch(e.target.value)}
      />

      {results.length > 0 ? (
        <div className="dropdown" role="listbox" aria-label="Movie search results">
          {results.map((movie) => (
            <button
              key={movie.tmdbId}
              type="button"
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
            </button>
          ))}
        </div>
      ) : null}
    </div>
  );
}
