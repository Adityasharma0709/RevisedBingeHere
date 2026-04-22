import React, { useState, useEffect } from "react";
import {
  Search,
  PlusCircle,
  Rocket,
  Clock,
  BarChart3,
  Film,
} from "lucide-react";
import toast, { Toaster } from "react-hot-toast";
import {
  getAdminSessionStats,
  adminAddMovie,
} from "../../services/sundayVoting.service";

const AdminSundayVoting = () => {
  const [sessionData, setSessionData] = useState(null);
  const [loading, setLoading] = useState(true);

  // TMDB Search
  const [searchQuery, setSearchQuery] = useState("");
  const [searchResults, setSearchResults] = useState([]);
  const [isSearching, setIsSearching] = useState(false);

  // Auth User
  const storedUser = localStorage.getItem("user");
  const user = storedUser ? JSON.parse(storedUser) : null;
  const userId = user ? user._id : null;

  useEffect(() => {
    fetchSessionStats();
  }, []);

  const fetchSessionStats = async () => {
    try {
      setLoading(true);
      const data = await getAdminSessionStats(userId);
      setSessionData(data);
    } catch (error) {
      console.error("Failed to fetch session stats:", error);
    } finally {
      setLoading(false);
    }
  };

  const searchTMDB = async (e) => {
    if (e) e.preventDefault();
    if (!searchQuery.trim()) return;

    setIsSearching(true);
    const TMDB_API_KEY = import.meta.env.VITE_TMDB_KEY;

    if (!TMDB_API_KEY) {
      toast.error("TMDB API key is missing in .env");
      setIsSearching(false);
      return;
    }

    try {
      const response = await fetch(
        `https://api.themoviedb.org/3/search/movie?api_key=${TMDB_API_KEY}&query=${encodeURIComponent(searchQuery)}&include_adult=false`,
      );
      const data = await response.json();
      setSearchResults(data.results.slice(0, 5));
    } catch (error) {
      toast.error("Error searching TMDB.");
    } finally {
      setIsSearching(false);
    }
  };

  const handleAddMovie = async (tmdbMovie) => {
    const payload = {
      tmdbId: tmdbMovie.id,
      title: tmdbMovie.title,
      year: tmdbMovie.release_date
        ? tmdbMovie.release_date.substring(0, 4)
        : "N/A",
      poster: tmdbMovie.poster_path
        ? `https://image.tmdb.org/t/p/w500${tmdbMovie.poster_path}`
        : "https://via.placeholder.com/500x750?text=No+Poster",
      genre: "Classic", // We default to Classic for admin injected movies
    };

    const loadingToast = toast.loading("Adding movie to active session...");
    try {
      await adminAddMovie(payload, userId);
      toast.success(`${tmdbMovie.title} added successfully!`, {
        id: loadingToast,
      });

      // Clear search and refresh stats
      setSearchResults([]);
      setSearchQuery("");
      fetchSessionStats();
    } catch (error) {
      toast.error(error.message || "Failed to add movie.", {
        id: loadingToast,
      });
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-[#07111f] text-slate-100 flex items-center justify-center">
        <div className="animate-pulse flex items-center gap-2">
          <Clock className="text-amber-300" /> Connecting to Sunday Voting...
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#07111f] text-slate-100 p-8">
      <Toaster position="top-center" />
      <div className="max-w-6xl mx-auto space-y-8">
        {/* Header section */}
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-black text-white flex items-center gap-3">
              <BarChart3 className="text-amber-300" size={32} />
              Sunday Voting Management
            </h1>
            <p className="text-slate-400 mt-1">
              Manage the current 15-day cycle. Add new classics or monitor
              votes.
            </p>
          </div>
          {sessionData?.active && (
            <div className="bg-white/10 border border-white/20 rounded-lg px-4 py-2 text-sm text-slate-300 flex items-center gap-2">
              <Clock size={16} className="text-rose-400" />
              Closes: {new Date(sessionData.closingTime).toLocaleString()}
            </div>
          )}
        </div>

        {/* Action / Search Section */}
        <div className="bg-[#0b1424] border border-white/10 rounded-[28px] p-8 shadow-2xl">
          <h2 className="text-xl font-bold text-white mb-4 flex items-center gap-2">
            <Film className="text-blue-400" /> Seed Contenders
          </h2>
          <p className="text-sm text-slate-400 mb-6">
            Search and instantly add movies to the current voting session.
          </p>

          <form onSubmit={searchTMDB} className="flex gap-3 mb-6">
            <div className="relative flex-1">
              <Search
                className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-500"
                size={20}
              />
              <input
                type="text"
                placeholder="Search TMDB for a classic movie..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full bg-[#07111f] text-white border border-white/10 rounded-xl pl-12 pr-4 py-4 focus:outline-none focus:border-amber-300/40 focus:ring-2 focus:ring-amber-300/20"
              />
            </div>
            <button
              type="submit"
              className="bg-amber-300 hover:bg-amber-400 text-amber-900 px-8 py-4 rounded-xl font-bold transition-all shadow-lg"
            >
              {isSearching ? "Searching..." : "Search DB"}
            </button>
          </form>

          {/* Search Results */}
          {searchResults.length > 0 && (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {searchResults.map((result) => (
                <div
                  key={result.id}
                  className="bg-[#111c31] border border-white/5 rounded-xl p-3 flex gap-4 items-center"
                >
                  <img
                    src={
                      result.poster_path
                        ? `https://image.tmdb.org/t/p/w200${result.poster_path}`
                        : "https://via.placeholder.com/200x300?text=No+Poster"
                    }
                    alt={result.title}
                    className="w-12 h-16 object-cover rounded bg-black"
                  />
                  <div className="flex-1 min-w-0 pr-2">
                    <h4 className="font-bold text-white text-sm truncate">
                      {result.title}
                    </h4>
                    <p className="text-xs text-slate-400">
                      {result.release_date
                        ? result.release_date.substring(0, 4)
                        : "N/A"}
                    </p>
                  </div>
                  <button
                    type="button"
                    onClick={() => handleAddMovie(result)}
                    className="text-sm bg-gradient-to-r from-amber-400 to-amber-500 hover:from-amber-500 hover:to-amber-600 text-amber-950 font-bold px-4 py-2 rounded-lg shadow-md transition-all flex items-center gap-1"
                  >
                    <PlusCircle size={14} /> Add Movie
                  </button>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Dashboard Stats */}
        {sessionData?.active ? (
          <div className="grid gap-8 lg:grid-cols-2">
            {/* Contenders */}
            <div className="bg-[#0b1424] border border-white/10 rounded-[28px] p-6 lg:p-8">
              <h2 className="text-xl font-bold text-white mb-2 flex items-center gap-2">
                <Rocket className="text-green-400" /> Visible Contenders
              </h2>
              <p className="text-xs text-slate-400 mb-6">
                Movies you've added or communities pushed past 100 votes.
              </p>

              {sessionData.contenders?.length === 0 ? (
                <div className="p-8 text-center border border-dashed border-white/5 rounded-xl text-slate-500">
                  No contenders yet. Use the search above to add the first
                  movie.
                </div>
              ) : (
                <div className="space-y-4">
                  {sessionData.contenders
                    ?.sort((a, b) => b.votes - a.votes)
                    .map((movie, index) => (
                      <div
                        key={movie.tmdbId}
                        className="flex items-center gap-4 bg-[#111c31] border border-white/5 rounded-xl p-3 relative overflow-hidden group hover:border-amber-300/30 transition-colors"
                      >
                        {index === 0 && movie.votes > 0 && (
                          <div className="absolute top-0 left-0 w-1 h-full bg-amber-400 z-10"></div>
                        )}
                        <img
                          src={movie.poster}
                          alt={movie.title}
                          className="w-12 h-16 object-cover rounded relative z-10"
                        />
                        <div className="flex-1 min-w-0 relative z-10">
                          <div className="flex items-center gap-2">
                            <h3 className="font-bold text-white truncate">
                              {movie.title}
                            </h3>
                            {movie.addedByAdmin && (
                              <span className="bg-blue-500/20 text-blue-300 text-[9px] px-2 py-0.5 rounded-full uppercase tracking-widest font-bold">
                                Admin Pick
                              </span>
                            )}
                          </div>
                          <p className="text-xs text-slate-400">{movie.year}</p>
                        </div>
                        <div className="bg-[#07111f] px-5 py-2 rounded-lg text-center relative z-10 shadow-inner">
                          <span className="block text-2xl font-black text-amber-300">
                            {movie.votes}
                          </span>
                          <span className="text-[10px] uppercase tracking-wider text-slate-500 font-semibold block mt-0.5">
                            Votes
                          </span>
                        </div>
                      </div>
                    ))}
                </div>
              )}
            </div>

            {/* Nominations (Hidden) */}
            <div className="bg-[#0b1424] border border-white/10 rounded-[28px] p-6 lg:p-8">
              <h2 className="text-xl font-bold text-white mb-2 flex items-center gap-2">
                <Search className="text-rose-400" /> Private Nominations
              </h2>
              <p className="text-xs text-slate-400 mb-6">
                User-nominated movies safely growing votes below the 100
                threshold.
              </p>

              {sessionData.nominations?.length === 0 ? (
                <div className="p-8 text-center border border-dashed border-white/5 rounded-xl text-slate-500">
                  No hidden community nominations right now.
                </div>
              ) : (
                <div className="space-y-4">
                  {sessionData.nominations
                    ?.sort((a, b) => b.votes - a.votes)
                    .map((movie) => (
                      <div
                        key={movie.tmdbId}
                        className="flex items-center gap-4 bg-[#111c31] border border-white/5 rounded-xl p-3 opacity-80 hover:opacity-100 transition-opacity"
                      >
                        <img
                          src={movie.poster}
                          alt={movie.title}
                          className="w-12 h-16 object-cover rounded grayscale hover:grayscale-0 transition-all"
                        />
                        <div className="flex-1 min-w-0">
                          <h3 className="font-bold text-slate-300 truncate">
                            {movie.title}
                          </h3>
                          <p className="text-xs text-slate-500">{movie.year}</p>
                        </div>
                        <div className="bg-[#07111f] border border-dashed border-white/10 px-4 py-2 rounded-lg text-center w-[85px]">
                          <span className="block text-lg font-bold text-slate-300">
                            {movie.votes}/100
                          </span>
                          <span className="text-[9px] uppercase tracking-wider text-slate-500 mt-1 block">
                            Progress
                          </span>
                        </div>
                      </div>
                    ))}
                </div>
              )}
            </div>
          </div>
        ) : (
          <div className="bg-rose-500/10 border border-rose-500/20 rounded-2xl p-6 text-center">
            <p className="text-rose-200">
              No active session found. Add a movie above to trigger a new
              session!
            </p>
          </div>
        )}
      </div>
    </div>
  );
};

export default AdminSundayVoting;
