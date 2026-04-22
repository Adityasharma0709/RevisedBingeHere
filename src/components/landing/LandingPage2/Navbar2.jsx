import { useEffect, useRef, useState } from "react";
import { useNavigate } from "react-router-dom";
import { LoaderCircle, Search } from "lucide-react";
import SideMenu from "../LandingPage2/sideMenu";
import { getMovies } from "../../../services/movie.service";

const Navbar2 = ({ location }) => {
  const navigate = useNavigate();
  const [isSearchOpen, setIsSearchOpen] = useState(false);
  const searchRef = useRef(null);

  const [searchQuery, setSearchQuery] = useState("");
  const [searchResults, setSearchResults] = useState([]);
  const [isSearching, setIsSearching] = useState(false);
  const [searchError, setSearchError] = useState("");

  const [allLocalMovies, setAllLocalMovies] = useState([]);

  // Fetch all local movies once to search against
  useEffect(() => {
    const fetchLocalMovies = async () => {
      try {
        const data = await getMovies();
        setAllLocalMovies(Array.isArray(data) ? data : []);
      } catch (err) {
        console.error("Failed to load local movies for search", err);
      }
    };
    fetchLocalMovies();
  }, []);

  useEffect(() => {
    const handleOutsideClick = (event) => {
      if (!searchRef.current?.contains(event.target)) {
        setIsSearchOpen(false);
      }
    };

    document.addEventListener("mousedown", handleOutsideClick);
    return () => document.removeEventListener("mousedown", handleOutsideClick);
  }, []);

  useEffect(() => {
    const trimmedQuery = searchQuery.trim().toLowerCase();

    if (trimmedQuery.length < 2) {
      setSearchResults([]);
      setSearchError("");
      setIsSearching(false);
      return;
    }

    setIsSearching(true);
    setSearchError("");

    // Simulate slight delay and filter local movies
    const timer = setTimeout(() => {
      const filtered = allLocalMovies.filter(
        (m) =>
          (m.name && m.name.toLowerCase().includes(trimmedQuery)) ||
          (m.title && m.title.toLowerCase().includes(trimmedQuery))
      );
      setSearchResults(filtered.slice(0, 8));
      setIsSearching(false);
    }, 200);

    return () => clearTimeout(timer);
  }, [searchQuery, allLocalMovies]);

  const handleSearchSelect = (movieId) => {
    setSearchQuery("");
    setSearchResults([]);
    setSearchError("");
    setIsSearchOpen(false);
    navigate(`/movie/${movieId}`);
  };

  const handleSearchSubmit = () => {
    if (searchResults.length > 0) {
      handleSearchSelect(searchResults[0]._id);
    }
  };

  const hasSearchState =
    isSearching ||
    Boolean(searchError) ||
    searchResults.length > 0 ||
    searchQuery.trim().length >= 2;

  return (
    <>
      <nav
        className="
          fixed top-0 left-0 w-full z-50
          px-6 py-4 md:px-10 md:py-5
          flex items-center justify-between
          bg-[#0b0f1a] border-b border-white/10
          transition-colors duration-300
        "
      >
        <div className="flex items-center gap-2 md:gap-4">
          <div
            onClick={() => navigate("/landing2")}
            className="text-xl md:text-2xl font-black tracking-wider cursor-pointer group select-none"
          >
            <span className="text-white group-hover:text-red-500 transition-colors duration-300 drop-shadow-md">
              Binge
            </span>
            <span className="text-red-600 group-hover:text-white transition-colors duration-300 drop-shadow-md">
              Here
            </span>
          </div>
          {location && (
            <div className="text-sm text-gray-400">
              {location.city}, {location.state}
            </div>
          )}
        </div>

        <div className="flex items-center gap-4 md:gap-6">
          <div ref={searchRef} className="relative w-[160px] sm:w-[280px] md:w-[360px]">
            <form
              onSubmit={(e) => {
                e.preventDefault();
                handleSearchSubmit();
              }}
              className="relative"
            >
              <Search
                size={18}
                className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400"
              />
              <input
                type="search"
                value={searchQuery}
                onChange={(e) => {
                  setSearchQuery(e.target.value);
                  setIsSearchOpen(true);
                }}
                onFocus={() => setIsSearchOpen(true)}
                placeholder="Search movies..."
                className="w-full rounded-full border border-white/10 bg-white/5 py-2.5 pl-11 pr-4 text-sm text-white outline-none transition focus:border-red-500/70 focus:bg-white/10"
              />
            </form>

            {isSearchOpen && hasSearchState && (
              <div className="absolute top-[calc(100%+10px)] w-full max-h-[420px] overflow-y-auto overflow-x-hidden rounded-2xl border border-white/10 bg-[#111827] shadow-2xl backdrop-blur-xl">
                {isSearching && (
                  <div className="flex items-center gap-2 px-4 py-3 text-sm text-slate-300">
                    <LoaderCircle size={16} className="animate-spin" />
                    Searching movies...
                  </div>
                )}

                {!isSearching && searchError && (
                  <p className="px-4 py-3 text-sm text-red-300">{searchError}</p>
                )}

                {!isSearching &&
                  !searchError &&
                  searchResults.length === 0 &&
                  searchQuery.trim().length >= 2 && (
                    <p className="px-4 py-3 text-sm text-slate-300">No movies found.</p>
                  )}

                {!isSearching &&
                  !searchError &&
                  searchResults.map((movie) => (
                    <button
                      key={movie._id}
                      type="button"
                      onClick={() => handleSearchSelect(movie._id)}
                      className="flex w-full items-center gap-3 border-t border-white/5 px-4 py-3 text-left transition hover:bg-white/5"
                    >
                      <img
                        src={movie.poster || "/no-poster.png"}
                        alt={movie.name || movie.title}
                        className="h-14 w-10 rounded object-cover"
                      />
                      <div className="min-w-0">
                        <p className="truncate text-sm font-semibold text-white">{movie.name || movie.title}</p>
                        <p className="text-xs text-slate-400">
                          {movie.release_date ? movie.release_date.slice(0, 4) : "-"} |{" "}
                          {(movie.language || "en").toUpperCase()}
                        </p>
                      </div>
                    </button>
                  ))}
              </div>
            )}
          </div>

          <div className="text-white hover:text-red-500 transition-colors cursor-pointer">
            <SideMenu />
          </div>
        </div>
      </nav>
    </>
  );
};

export { Navbar2 };
