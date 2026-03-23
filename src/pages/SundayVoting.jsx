import React, { useState } from "react";
import { Clock, Ticket, Trophy, Info, Search, PlusCircle } from "lucide-react";
import toast, { Toaster } from "react-hot-toast";


// Mock Data: Initial pool. In a real app, this comes from your database.
const initialMovies = [
  {
    id: 157336, // TMDB ID for Interstellar
    title: "Interstellar",
    genre: "Sci-Fi / Drama", // TMDB usually returns genre IDs, you'd map these in production
    year: "2014",
    poster: "https://image.tmdb.org/t/p/w500/gEU2QlsUU613Q1XoK6dKi5gZ521.jpg",
    votes: 342,
  },
  {
    id: 155, // TMDB ID for The Dark Knight
    title: "The Dark Knight",
    genre: "Action / Crime",
    year: "2008",
    poster: "https://image.tmdb.org/t/p/w500/qJ2tW6WMUDux911r6m7haRef0WH.jpg",
    votes: 415,
  }
];
<Toaster
  position="top-center"
  toastOptions={{
    style: {
      background: "#0a192f",
      color: "#fff",
      border: "1px solid #800000"
    }
  }}
/>

const SundayVoting = () => {
  const [movies, setMovies] = useState(initialMovies);
  const [userVote, setUserVote] = useState(null);

  // TMDB Search State
  const [searchQuery, setSearchQuery] = useState("");
  const [searchResults, setSearchResults] = useState([]);
  const [isSearching, setIsSearching] = useState(false);
  const [nominations, setNominations] = useState([]);  // hidden pool

  // Sorting for the leaderboard
  const sortedMovies = [...movies].sort((a, b) => b.votes - a.votes);

  const handleVote = (id) => {
    if (userVote) return;

    setMovies(movies.map(movie =>
      movie.id === id ? { ...movie, votes: movie.votes + 1 } : movie
    ));

    setUserVote(id);

    toast.success("Thanks for voting! Your vote has been recorded 🎟️", {
      id: "vote-toast"
    });
  };

  const searchTMDB = async (e) => {
    e.preventDefault();
    if (!searchQuery.trim()) return;

    setIsSearching(true);
    // REPLACE WITH YOUR ACTUAL TMDB API KEY
    const TMDB_API_KEY = "f8d8af9b93211b253d70ae529ad78ce1";

    try {
      const response = await fetch(
        `https://api.themoviedb.org/3/search/movie?api_key=${TMDB_API_KEY}&query=${encodeURIComponent(searchQuery)}&include_adult=false`
      );
      const data = await response.json();
      setSearchResults(data.results.slice(0, 4)); // Get top 4 results
    } catch (error) {
      console.error("Error fetching from TMDB:", error);
    } finally {
      setIsSearching(false);
    }
  };

  const handleNominationVote = (id) => {
    setNominations(prev => {
      const updated = prev.map(movie =>
        movie.id === id ? { ...movie, votes: movie.votes + 1 } : movie
      );

      const promoted = updated.find(m => m.id === id && m.votes >= 100);
      toast.success("Movie unlocked! It is now in the Sunday voting list.");


      if (promoted) {
        setMovies(prevMovies => [...prevMovies, promoted]);
        return updated.filter(m => m.id !== id);
      }
      toast.success("Your vote has been recorded 👍");

      return updated;
    });
  };

  const handleNominate = (tmdbMovie) => {

    if (movies.some(m => m.id === tmdbMovie.id)) {
      toast("This movie is already in the voting pool!");
      return;
    }

    const newMovie = {
      id: tmdbMovie.id,
      title: tmdbMovie.title,
      genre: "Nominated",
      year: tmdbMovie.release_date ? tmdbMovie.release_date.substring(0, 4) : "N/A",
      poster: tmdbMovie.poster_path
        ? `https://image.tmdb.org/t/p/w500${tmdbMovie.poster_path}`
        : "https://via.placeholder.com/500x750?text=No+Poster",
      votes: 1
    };

    setNominations([...nominations, newMovie]);
    setUserVote(newMovie.id);

    toast(
      `🎬 ${newMovie.title} nominated! Current votes: 1. It will appear in voting once it reaches 100 votes.`,
      {
        id: "nomination-toast",
        duration: 5000,
        icon: "🍿"
      }
    );

    setSearchResults([]);
    setSearchQuery("");
  };

  return (
    <div className="min-h-screen bg-black text-white font-sans pb-12">

      <Toaster />

      {/* HERO SECTION */}
      <div className="relative w-full py-16 px-6 flex flex-col items-center justify-center text-center bg-gradient-to-b from-[#800000]/40 to-black">
        <h1 className="text-4xl md:text-6xl font-extrabold tracking-tight mb-4">
          The <span className="text-[#800000]">Sunday Classic</span>
        </h1>
        <p className="text-gray-300 max-w-2xl text-lg mb-4">
          Alternate Sundays. One exclusive show: <strong>6:30 PM - 9:30 PM</strong>.
        </p>
        <p className="text-gray-400 max-w-2xl text-sm mb-8">
          Voting opens on Saturday 13 days prior and lasts for exactly 48 hours. Nominate your favorite or back an existing contender.
        </p>

        {/* Mock Countdown */}
        <div className="flex items-center gap-3 bg-[#0a192f] border border-[#0a192f] rounded-lg px-6 py-3 shadow-lg">
          <Clock className="text-[#800000]" size={24} />
          <div className="text-left">
            <p className="text-xs text-gray-400 uppercase tracking-wider">Voting Window Closes In</p>
            <p className="text-xl font-bold font-mono text-white">47:15:22</p>
          </div>
        </div>
      </div>

      {/* LEADERBOARD (VOTING POOL) */}
      <div className="max-w-7xl mx-auto px-6 mt-8">
        <h2 className="text-2xl font-bold mb-6 border-b border-[#0a192f] pb-2">Current Contenders</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
          {sortedMovies.map((movie, index) => {
            const isLeader = index === 0 && movie.votes > 0;
            const hasVotedForThis = userVote === movie.id;

            return (
              <div
                key={movie.id}
                className={`relative bg-[#0a192f] rounded-xl overflow-hidden shadow-2xl transition-all duration-300 ${isLeader ? "ring-2 ring-[#800000] scale-105 transform z-10" : "hover:scale-105"
                  }`}
              >
                {isLeader && (
                  <div className="absolute top-0 left-0 w-full bg-[#800000] text-white text-xs font-bold py-1 flex justify-center items-center gap-1 z-20">
                    <Trophy size={14} /> Current Leader
                  </div>
                )}
                <div className="relative h-80 w-full">
                  <img src={movie.poster} alt={movie.title} className="w-full h-full object-cover opacity-80" />
                  <div className="absolute inset-0 bg-gradient-to-t from-[#0a192f] via-transparent to-transparent"></div>
                </div>
                <div className="p-5 relative">
                  <h2 className="text-xl font-bold mb-1 line-clamp-1">{movie.title}</h2>
                  <p className="text-xs text-gray-400 mb-4">{movie.year} • {movie.genre}</p>

                  <div className="mb-4 text-center">
                    <span className="text-2xl font-bold text-white">{movie.votes}</span>
                    <span className="text-sm text-gray-400 ml-2">Votes</span>
                  </div>

                  {userVote ? (
                    <button
                      disabled
                      className={`w-full py-3 rounded-lg font-semibold flex items-center justify-center gap-2 transition-all ${hasVotedForThis ? "bg-green-600 text-white" : "bg-gray-800 text-gray-500 cursor-not-allowed"
                        }`}
                    >
                      {hasVotedForThis ? "Voted Successfully" : "Voting Locked"}
                    </button>
                  ) : (
                    <button
                      onClick={() => handleVote(movie.id)}
                      className="w-full py-3 bg-transparent border border-[#800000] text-white rounded-lg font-semibold hover:bg-[#800000] transition-colors flex items-center justify-center gap-2"
                    >
                      <Ticket size={18} /> Cast Vote
                    </button>
                  )}
                </div>
              </div>
            );
          })}
        </div>



        {/* NOMINATION SECTION */}
        {!userVote && (
          <div className="mt-16 bg-[#0a192f]/30 border border-[#0a192f] rounded-xl p-8 max-w-4xl mx-auto">
            <h3 className="text-2xl font-bold mb-2 text-center">Don't see your favorite?</h3>
            <p className="text-gray-400 text-center mb-6">Search the TMDB database to nominate a movie. Nominating automatically casts your vote for it.</p>

            <form onSubmit={searchTMDB} className="flex gap-2 max-w-2xl mx-auto mb-8">
              <div className="relative flex-1">
                <input
                  type="text"
                  placeholder="Search for a movie to nominate..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="w-full bg-[#172a45] text-white border border-gray-700 rounded-lg pl-10 pr-4 py-3 focus:outline-none focus:border-[#800000]"
                />
                <Search className="absolute left-3 top-3.5 text-gray-400" size={20} />
              </div>
              <button
                type="submit"
                className="bg-[#800000] text-white px-6 py-3 rounded-lg font-semibold hover:bg-red-900 transition flex items-center gap-2"
              >
                {isSearching ? "Searching..." : "Search"}
              </button>
            </form>

            {nominations.length > 0 && (
              <div className="mt-12">
                <h2 className="text-xl font-bold mb-4">Community Nominations</h2>

                {nominations.map(movie => (
                  <div key={movie.id} className="flex justify-between bg-[#172a45] p-3 rounded mb-2">
                    <span>{movie.title}</span>

                    <button
                      onClick={() => handleNominationVote(movie.id)}
                      className="text-sm bg-[#800000] px-3 py-1 rounded"
                    >
                      Upvote ({movie.votes})
                    </button>
                  </div>
                ))}
              </div>
            )}


            {/* TMDB Search Results */}
            {searchResults.length > 0 && (
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                {searchResults.map((result) => (
                  <div key={result.id} className="bg-[#172a45] rounded-lg p-3 flex gap-4 items-center">
                    <img
                      src={result.poster_path ? `https://image.tmdb.org/t/p/w200${result.poster_path}` : "https://via.placeholder.com/200x300?text=No+Poster"}
                      alt={result.title}
                      className="w-16 h-24 object-cover rounded"
                    />
                    <div className="flex-1">
                      <h4 className="font-bold text-white line-clamp-1">{result.title}</h4>
                      <p className="text-xs text-gray-400 mb-2">{result.release_date ? result.release_date.substring(0, 4) : "N/A"}</p>
                      <button
                        onClick={() => handleNominate(result)}
                        className="text-xs bg-transparent border border-[#800000] text-white px-3 py-1.5 rounded hover:bg-[#800000] transition flex items-center gap-1"
                      >
                        <PlusCircle size={14} /> Nominate & Vote
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        )}

        {/* Info Banner */}
        <div className="mt-12 bg-[#0a192f]/50 border border-[#0a192f] rounded-xl p-6 flex items-start gap-4 max-w-3xl mx-auto">
          <Info className="text-[#800000] flex-shrink-0 mt-1" />
          <p className="text-sm text-gray-400 leading-relaxed">
            <strong className="text-white">The Rules:</strong> One vote per user. Once cast, your vote is locked. The movie with the most votes when the 48-hour window closes will be locked in for the alternate Sunday show. Tickets will be available immediately after the poll concludes.
          </p>
        </div>
      </div>
    </div>
  );
};

export default SundayVoting;