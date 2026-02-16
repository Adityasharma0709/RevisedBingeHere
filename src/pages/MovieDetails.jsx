import { useEffect, useState } from "react";
import Lenis from "@studio-freight/lenis";
import "./css/MovieDetails.css"; // KEEP THIS IMPORT HERE

// Component Imports
import MovieHero from "../components/Movie/MovieHero";
import TrailerModal from "../components/Movie/TrailerModal";
import ReviewSection from "../components/Movie/ReviewSection";
import MovieRail from "../components/Movie/MovieRail";
import CastSection from "../components/Movie/CastSection"; 

const API_KEY = import.meta.env.VITE_TMDB_KEY;

const SAMPLE_REVIEWS = [
  {
    id: 101,
    author: "Rohan_Movies",
    author_details: { rating: 9 },
    content: "Absolutely mind-blowing visuals! A must-watch in IMAX."
  },
  {
    id: 102,
    author: "CinemaAddict",
    author_details: { rating: 8 },
    content: "Solid performance. One of the better releases this year."
  }
];

const MovieDetails = ({ movie, cast }) => {
  const [trailerKey, setTrailerKey] = useState(null);
  const [showTrailer, setShowTrailer] = useState(false);
  const [reviews, setReviews] = useState(SAMPLE_REVIEWS);
  const [similarMovies, setSimilarMovies] = useState([]);

  // Smooth Scroll
  useEffect(() => {
    const lenis = new Lenis({ smooth: true });
    function raf(time) {
      lenis.raf(time);
      requestAnimationFrame(raf);
    }
    requestAnimationFrame(raf);
    return () => lenis.destroy();
  }, []);

  // Fetch Similar Movies
  useEffect(() => {
    const fetchExtras = async () => {
      try {
        const res = await fetch(
          `https://api.themoviedb.org/3/movie/${movie.id}/similar?api_key=${API_KEY}&language=en-US&page=1`
        );
        const data = await res.json();
        setSimilarMovies(data.results.slice(0, 6));
      } catch (err) {
        console.error("Error fetching extras:", err);
      }
    };
    if (movie?.id) fetchExtras();
  }, [movie]);

  // Trailer Logic
  const handleWatchTrailer = async () => {
    if (trailerKey) {
      setShowTrailer(true);
      return;
    }
    try {
      const res = await fetch(
        `https://api.themoviedb.org/3/movie/${movie.id}/videos?api_key=${API_KEY}&language=en-US`
      );
      const data = await res.json();
      const trailer = data.results.find(
        (v) => v.site === "YouTube" && v.type === "Trailer"
      );
      const key = trailer ? trailer.key : data.results[0]?.key;
      if (key) {
        setTrailerKey(key);
        setShowTrailer(true);
      } else {
        alert("No trailer available.");
      }
    } catch (e) {
      console.error(e);
    }
  };

  return (
    <div className="cinema-page">
      <TrailerModal 
        show={showTrailer} 
        trailerKey={trailerKey} 
        onClose={() => setShowTrailer(false)} 
      />

      <MovieHero 
        movie={movie} 
        onWatchTrailer={handleWatchTrailer} 
      />

      <ReviewSection 
        overview={movie.overview} 
        reviews={reviews} 
      />

      {/* New Cast Component */}
      <CastSection cast={cast} />

      <MovieRail 
        title="You Might Also Like" 
        movies={similarMovies} 
      />
    </div>
  );
};

export default MovieDetails;