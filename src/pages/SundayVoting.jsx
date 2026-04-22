import React, { useState, useEffect } from "react";
import {
  Clock,
  Ticket,
  Trophy,
  Info,
  Search,
  PlusCircle,
  AlertCircle,
} from "lucide-react";
import toast, { Toaster } from "react-hot-toast";
import {
  getActiveSession,
  castVote,
  nominateMovie,
} from "../services/sundayVoting.service";

// We keep a simple fallback if the backend hasn't populated yet, but mostly rely on the api.
const SundayVoting = () => {
  const [movies, setMovies] = useState([]);
  const [userVote, setUserVote] = useState(null);

  // Timer State
  const [closingTime, setClosingTime] = useState(null);
  const [timeLeft, setTimeLeft] = useState({
    total: 0,
    hours: "00",
    minutes: "00",
    seconds: "00",
  });
  const [isVotingClosed, setIsVotingClosed] = useState(false);
  const [loading, setLoading] = useState(true);

  // TMDB Search State
  const [searchQuery, setSearchQuery] = useState("");
  const [searchResults, setSearchResults] = useState([]);
  const [isSearching, setIsSearching] = useState(false);

  // Auth User
  const storedUser = localStorage.getItem("user");
  const user = storedUser ? JSON.parse(storedUser) : null;
  const userId = user ? user._id : null;

  useEffect(() => {
    fetchSession();
  }, []);

  useEffect(() => {
    if (!closingTime) return;

    const timer = setInterval(() => {
      const remaining = calculateTimeRemaining(closingTime);
      setTimeLeft(remaining);

      if (remaining.total <= 0) {
        setIsVotingClosed(true);
        clearInterval(timer);
      } else {
        setIsVotingClosed(false);
      }
    }, 1000);

    return () => clearInterval(timer);
  }, [closingTime]);

  const fetchSession = async () => {
    try {
      setLoading(true);
      const data = await getActiveSession(userId);
      setMovies(data.contenders || []);
      setUserVote(data.userVote || null);
      if (data.closingTime) {
        setClosingTime(data.closingTime);
        const initialRemaining = calculateTimeRemaining(data.closingTime);
        setTimeLeft(initialRemaining);
        setIsVotingClosed(initialRemaining.total <= 0);
      }
    } catch (error) {
      console.error("Failed to fetch session:", error);
      // Optional: Maybe toast.error("Could not load voting session")
    } finally {
      setLoading(false);
    }
  };

  const calculateTimeRemaining = (endTime) => {
    if (!endTime)
      return { total: 0, hours: "00", minutes: "00", seconds: "00" };
    const total = Date.parse(endTime) - Date.parse(new Date());
    if (total <= 0)
      return { total: 0, hours: "00", minutes: "00", seconds: "00" };

    const seconds = Math.floor((total / 1000) % 60);
    const minutes = Math.floor((total / 1000 / 60) % 60);
    const hours = Math.floor(total / (1000 * 60 * 60));

    return {
      total,
      hours: hours.toString().padStart(2, "0"),
      minutes: minutes.toString().padStart(2, "0"),
      seconds: seconds.toString().padStart(2, "0"),
    };
  };

  const sortedMovies = [...movies].sort((a, b) => b.votes - a.votes);

  const handleVote = async (id) => {
    if (!userId) {
      toast.error("Please log in to vote.");
      return;
    }
    if (userVote || isVotingClosed) return;

    const loadingToast = toast.loading("Casting your vote...");
    try {
      await castVote(id, userId);

      // Update UI optimistically
      setMovies(
        movies.map((movie) =>
          movie.tmdbId === id ? { ...movie, votes: movie.votes + 1 } : movie,
        ),
      );
      setUserVote(id);

      toast.success("Thanks for voting! Your vote has been recorded 🎟️", {
        id: loadingToast,
      });
    } catch (error) {
      toast.error(error.message || "Failed to submit vote.", {
        id: loadingToast,
      });
    }
  };

  const searchTMDB = async (e) => {
    e.preventDefault();
    if (!searchQuery.trim()) return;

    setIsSearching(true);
    // Uses API key from environment variables
    const TMDB_API_KEY = import.meta.env.VITE_TMDB_KEY;

    if (!TMDB_API_KEY) {
      toast.error(
        "TMDB API key is missing. Please add VITE_TMDB_API_KEY in .env",
      );
      setIsSearching(false);
      return;
    }

    try {
      const response = await fetch(
        `https://api.themoviedb.org/3/search/movie?api_key=${TMDB_API_KEY}&query=${encodeURIComponent(searchQuery)}&include_adult=false`,
      );
      const data = await response.json();
      setSearchResults(data.results.slice(0, 4));
    } catch (error) {
      console.error("Error fetching from TMDB:", error);
      toast.error("Error searching TMDB. Please try again later.");
    } finally {
      setIsSearching(false);
    }
  };

  const handleNominate = async (tmdbMovie) => {
    if (!userId) {
      toast.error("Please log in to nominate a movie.");
      return;
    }
    if (userVote) {
      toast.error("You have already cast your vote this session!");
      return;
    }

    const payload = {
      tmdbId: tmdbMovie.id,
      title: tmdbMovie.title,
      year: tmdbMovie.release_date
        ? tmdbMovie.release_date.substring(0, 4)
        : "N/A",
      poster: tmdbMovie.poster_path
        ? `https://image.tmdb.org/t/p/w500${tmdbMovie.poster_path}`
        : "https://via.placeholder.com/500x750?text=No+Poster",
    };

    const loadingToast = toast.loading("Submitting your nomination...");
    try {
      await nominateMovie(payload, userId);

      // We don't append to movies list immediately because rules say it becomes visible when votes > 100.
      setUserVote(tmdbMovie.id);

      toast.success(
        `🎬 ${tmdbMovie.title} nominated! Your vote has been cast. It will appear globally once it crosses 100 votes.`,
        {
          id: loadingToast,
          duration: 6000,
          icon: "🍿",
        },
      );

      setSearchResults([]);
      setSearchQuery("");
      // Refresh the session in case the nominated movie just crossed 100 votes and should become visible
      fetchSession();
    } catch (error) {
      toast.error(error.message || "Failed to nominate movie.", {
        id: loadingToast,
      });
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-black flex items-center justify-center">
        <div className="text-white text-xl animate-pulse">
          Loading Voting Session...
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-black text-white font-sans pb-12">
      <Toaster
        position="top-center"
        toastOptions={{
          style: {
            background: "#0a192f",
            color: "#fff",
            border: "1px solid #800000",
          },
        }}
      />

      {/* HERO SECTION */}
      <div className="relative w-full py-16 px-6 flex flex-col items-center justify-center text-center bg-gradient-to-b from-[#800000]/40 to-black">
        <h1 className="text-4xl md:text-6xl font-extrabold tracking-tight mb-4">
          The <span className="text-[#800000]">Sunday Classic</span>
        </h1>
        <p className="text-gray-300 max-w-2xl text-lg mb-4">
          Alternate Sundays. One exclusive show:{" "}
          <strong>6:30 PM - 9:30 PM</strong>.
        </p>
        <p className="text-gray-400 max-w-2xl text-sm mb-8">
          Voting opens on Saturday 13 days prior and lasts for exactly 24 hours.
          Nominate your favorite or back an existing contender.
        </p>

        {/* Voting Status / Countdown */}
        {isVotingClosed ? (
          <div className="flex items-center gap-3 bg-red-900/50 border border-red-500 rounded-lg px-6 py-4 shadow-lg text-red-200">
            <AlertCircle size={28} />
            <div className="text-left">
              <p className="text-xl font-bold uppercase tracking-wider">
                Voting is Closed
              </p>
              <p className="text-sm">Results are being finalized.</p>
            </div>
          </div>
        ) : (
          <div className="flex items-center gap-3 bg-[#0a192f] border border-[#0a192f] rounded-lg px-6 py-3 shadow-lg">
            <Clock className="text-[#800000]" size={24} />
            <div className="text-left">
              <p className="text-xs text-gray-400 uppercase tracking-wider">
                Voting Window Closes In
              </p>
              <p className="text-xl font-bold font-mono text-white">
                {timeLeft.hours}:{timeLeft.minutes}:{timeLeft.seconds}
              </p>
            </div>
          </div>
        )}
      </div>

      {/* LEADERBOARD (VOTING POOL) */}
      <div className="max-w-7xl mx-auto px-6 mt-8">
        <h2 className="text-2xl font-bold mb-6 border-b border-[#0a192f] pb-2">
          Current Contenders
        </h2>

        {sortedMovies.length === 0 ? (
          <div className="text-center text-gray-400 py-10 bg-[#0a192f]/30 rounded-xl border border-[#0a192f]">
            No contenders visible yet. Be the first to search and nominate a
            movie below!
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
            {sortedMovies.map((movie, index) => {
              const isLeader = index === 0 && movie.votes > 0;
              const hasVotedForThis = userVote === movie.tmdbId;

              return (
                <div
                  key={movie.tmdbId}
                  className={`flex flex-col relative bg-[#0a192f] rounded-xl overflow-hidden shadow-2xl transition-all duration-300 ${
                    isLeader
                      ? "ring-2 ring-[#800000] scale-105 transform z-10"
                      : "hover:scale-105"
                  }`}
                >
                  {isLeader && (
                    <div className="absolute top-0 left-0 w-full bg-[#800000] text-white text-xs font-bold py-1 flex justify-center items-center gap-1 z-20 shadow-md border-b flex-shrink-0 border-red-900">
                      <Trophy size={14} /> Current Leader
                    </div>
                  )}
                  <div className="relative h-80 w-full flex-shrink-0">
                    <img
                      src={movie.poster}
                      alt={movie.title}
                      className="w-full h-full object-cover opacity-80"
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-[#0a192f] via-[#0a192f]/20 to-transparent"></div>
                  </div>
                  <div className="p-5 flex flex-col flex-grow relative bg-[#0a192f]">
                    <h2 className="text-xl font-bold mb-1 line-clamp-1">
                      {movie.title}
                    </h2>
                    <p className="text-xs text-gray-400 mb-4">
                      {movie.year} • {movie.genre || "Feature"}
                    </p>

                    <div className="mb-4 text-center mt-auto">
                      <span className="text-3xl font-bold text-white tracking-widest">
                        {movie.votes}
                      </span>
                      <span className="text-xs text-gray-400 ml-2 uppercase tracking-widest block mt-1">
                        Votes
                      </span>
                    </div>

                    {isVotingClosed ? (
                      <button
                        disabled
                        className="mt-auto w-full py-3 rounded-lg font-semibold flex items-center justify-center gap-2 bg-gray-800 text-gray-500 cursor-not-allowed opacity-70 border border-gray-700"
                      >
                        Voting Closed
                      </button>
                    ) : userVote ? (
                      <button
                        disabled
                        className={`mt-auto w-full py-3 rounded-lg font-semibold flex items-center justify-center gap-2 transition-all shadow-md ${
                          hasVotedForThis
                            ? "bg-gradient-to-r from-green-600 to-green-500 text-white shadow-green-900/50"
                            : "bg-gray-800 text-gray-500 cursor-not-allowed"
                        }`}
                      >
                        {hasVotedForThis ? "✓ Voted" : "Voting Locked"}
                      </button>
                    ) : (
                      <button
                        onClick={() => handleVote(movie.tmdbId)}
                        className="mt-auto w-full py-3 bg-transparent border border-[#800000] text-[#ff4d4d] rounded-lg font-semibold hover:bg-[#800000] hover:text-white transition-all flex items-center justify-center gap-2 hover:shadow-[0_0_15px_rgba(128,0,0,0.5)]"
                      >
                        <Ticket size={18} /> Cast Vote
                      </button>
                    )}
                  </div>
                </div>
              );
            })}
          </div>
        )}

        {/* NOMINATION SECTION */}
        {!userVote && !isVotingClosed && (
          <div className="mt-20 bg-gradient-to-br from-[#0a192f]/80 to-black border border-gray-800 rounded-2xl p-8 max-w-4xl mx-auto shadow-2xl relative overflow-hidden">
            <div className="absolute top-0 right-0 w-64 h-64 bg-[#800000] rounded-full mix-blend-multiply filter blur-3xl opacity-10 blur-xl z-0 pointer-events-none"></div>

            <div className="relative z-10">
              <h3 className="text-3xl font-extrabold mb-3 text-center bg-clip-text text-transparent bg-gradient-to-r from-white to-gray-400">
                Don't see your favorite?
              </h3>
              <p className="text-gray-400 text-center mb-8 text-sm max-w-2xl mx-auto">
                Search the TMDB database to nominate a movie. Nominating
                automatically casts your 1 vote. Once a movie receives 100
                nominations, it will appear on the leaderboard!
              </p>

              <form
                onSubmit={searchTMDB}
                className="flex gap-3 max-w-2xl mx-auto mb-10"
              >
                <div className="relative flex-1 group">
                  <input
                    type="text"
                    placeholder="Search for a movie title..."
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    className="w-full bg-[#112240] text-white border border-gray-700 rounded-xl pl-12 pr-4 py-4 focus:outline-none focus:border-[#800000] focus:ring-1 focus:ring-[#800000] transition-all shadow-inner placeholder-gray-500"
                  />
                  <Search
                    className="absolute left-4 top-4 text-gray-500 group-focus-within:text-[#800000] transition-colors"
                    size={22}
                  />
                </div>
                <button
                  type="submit"
                  className="bg-[#800000] text-white px-8 py-4 rounded-xl font-bold hover:bg-red-900 transition-all shadow-lg flex items-center justify-center gap-2 whitespace-nowrap min-w-[140px]"
                >
                  {isSearching ? "Searching..." : "Search"}
                </button>
              </form>

              {/* TMDB Search Results */}
              {searchResults.length > 0 && (
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  {searchResults.map((result) => (
                    <div
                      key={result.id}
                      className="bg-[#112240]/80 border border-gray-800 rounded-xl p-3 flex gap-4 items-center hover:bg-[#1a365d] transition-colors shadow-md"
                    >
                      <div className="w-16 h-24 rounded overflow-hidden flex-shrink-0 bg-gray-900 border border-gray-800">
                        <img
                          src={
                            result.poster_path
                              ? `https://image.tmdb.org/t/p/w200${result.poster_path}`
                              : "https://via.placeholder.com/200x300?text=No+Poster"
                          }
                          alt={result.title}
                          className="w-full h-full object-cover"
                        />
                      </div>
                      <div className="flex-1 min-w-0 pr-2">
                        <h4
                          className="font-bold text-white text-lg truncate mb-1"
                          title={result.title}
                        >
                          {result.title}
                        </h4>
                        <p className="text-xs text-gray-400 mb-3 font-medium tracking-wide">
                          {result.release_date
                            ? result.release_date.substring(0, 4)
                            : "N/A"}
                        </p>
                        <button
                          onClick={() => handleNominate(result)}
                          className="w-full text-sm bg-transparent border border-[#800000] text-white px-4 py-2 rounded-lg hover:bg-[#800000] transition flex items-center justify-center gap-2"
                        >
                          <PlusCircle size={15} /> Nominate Movie
                        </button>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
          </div>
        )}

        {/* Info Banner */}
        <div className="mt-12 bg-[#0a192f]/50 border border-[#0a192f] rounded-xl p-6 flex items-start gap-4 max-w-3xl mx-auto">
          <Info className="text-[#800000] flex-shrink-0 mt-1" />
          <p className="text-sm text-gray-400 leading-relaxed">
            <strong className="text-white">The Rules:</strong> One vote per
            user. Once cast, your vote is locked. The movie with the most votes
            when the 24-hour window closes will be locked in for the alternate
            Sunday show. Tickets will be available immediately after the poll
            concludes.
          </p>
        </div>
      </div>
    </div>
  );
};

export default SundayVoting;
