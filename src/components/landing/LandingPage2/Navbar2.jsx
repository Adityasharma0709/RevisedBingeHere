import { useEffect, useRef, useState } from "react";
import { useNavigate } from "react-router-dom";
import { LoaderCircle, Search } from "lucide-react";
import SideMenu from "../LandingPage2/sideMenu";

const IMG_92 = "https://image.tmdb.org/t/p/w92";

const Navbar2 = ({
  searchQuery,
  setSearchQuery,
  searchResults,
  isSearching = false,
  searchError = null,
  onSearchSubmit,
  onSearchSelect,
  location,
}) => {
  const navigate = useNavigate();
  const [isSearchOpen, setIsSearchOpen] = useState(false);
  const searchRef = useRef(null);

  const normalizedSearchQuery = typeof searchQuery === "string" ? searchQuery : "";
  const normalizedSearchResults = Array.isArray(searchResults) ? searchResults : [];

  useEffect(() => {
    const handleOutsideClick = (event) => {
      if (!searchRef.current?.contains(event.target)) {
        setIsSearchOpen(false);
      }
    };

    document.addEventListener("mousedown", handleOutsideClick);
    return () => document.removeEventListener("mousedown", handleOutsideClick);
  }, []);

  const hasSearchState =
    isSearching ||
    Boolean(searchError) ||
    normalizedSearchResults.length > 0 ||
    normalizedSearchQuery.trim().length >= 2;

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
                onSearchSubmit?.();
              }}
              className="relative"
            >
              <Search
                size={18}
                className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400"
              />
              <input
                type="search"
                value={normalizedSearchQuery}
                onChange={(e) => {
                  setSearchQuery?.(e.target.value);
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
                  normalizedSearchResults.length === 0 &&
                  normalizedSearchQuery.trim().length >= 2 && (
                    <p className="px-4 py-3 text-sm text-slate-300">No movies found.</p>
                  )}

                {!isSearching &&
                  !searchError &&
                  normalizedSearchResults.map((movie) => (
                    <button
                      key={movie.id}
                      type="button"
                      onClick={() => {
                        setIsSearchOpen(false);
                        onSearchSelect?.(movie.id);
                      }}
                      className="flex w-full items-center gap-3 border-t border-white/5 px-4 py-3 text-left transition hover:bg-white/5"
                    >
                      <img
                        src={movie.poster_path ? `${IMG_92}${movie.poster_path}` : "/no-poster.png"}
                        alt={movie.title}
                        className="h-14 w-10 rounded object-cover"
                      />
                      <div className="min-w-0">
                        <p className="truncate text-sm font-semibold text-white">{movie.title}</p>
                        <p className="text-xs text-slate-400">
                          {movie.release_date ? movie.release_date.slice(0, 4) : "Upcoming"} |{" "}
                          {(movie.original_language || "en").toUpperCase()}
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
