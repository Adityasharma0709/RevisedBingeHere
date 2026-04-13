import { useEffect, useMemo, useState } from "react";
import { useNavigate } from "react-router-dom";

const PromoCarousel = () => {
  const navigate = useNavigate();
  const API_KEY = import.meta.env.VITE_TMDB_KEY;
  const BASE_URL = "https://api.themoviedb.org/3";
  const IMG_ORIGINAL = "https://image.tmdb.org/t/p/original";

  const [banners, setBanners] = useState([]);

  const extended = useMemo(() => {
    if (banners.length === 0) return [];
    return [banners[banners.length - 1], ...banners, banners[0]];
  }, [banners]);

  // start from index 2 (so banners[1] is centered visually)
  const [index, setIndex] = useState(2);
  const [transition, setTransition] = useState(true);

  const slide = 60; // center width %

  const next = () => setIndex((prev) => prev + 1);
  const prev = () => setIndex((prev) => prev - 1);

  useEffect(() => {
    const fetchBanners = async () => {
      if (!API_KEY) {
        console.error("Missing VITE_TMDB_KEY in environment.");
        return;
      }

      try {
        const res = await fetch(
          `${BASE_URL}/trending/movie/week?api_key=${API_KEY}&language=en-US&page=1`
        );
        const data = await res.json();
        const images =
          data?.results
            ?.filter((m) => m.backdrop_path)
            .slice(0, 8)
            .map((m) => ({
              id: m.id,
              img: `${IMG_ORIGINAL}${m.backdrop_path}`,
              title: m.title || m.name || "Movie",
            })) || [];
        setBanners(images);
        setIndex(2);
      } catch (err) {
        console.error("Failed to fetch banner images:", err);
      }
    };

    fetchBanners();
  }, [API_KEY]);

  useEffect(() => {
    if (extended.length === 0) return;
    if (index === extended.length - 1) {
      setTimeout(() => {
        setTransition(false);
        setIndex(1);
      }, 700);
    }
    if (index === 0) {
      setTimeout(() => {
        setTransition(false);
        setIndex(extended.length - 2);
      }, 700);
    }
  }, [index, extended.length]);

  useEffect(() => {
    if (!transition) {
      requestAnimationFrame(() => setTransition(true));
    }
  }, [transition]);

  if (extended.length === 0) {
    return (
      <div className="w-full bg-[#0b0f1a] py-15">
        <div className="max-w-7xl mx-auto relative h-[240px]" />
      </div>
    );
  }

  return (
    <div className="w-full bg-[#0b0f1a] py-15">
      <div className="max-w-7xl mx-auto relative">
        {/* Viewport */}
        <div className="overflow-hidden px-[10%]">
          <div
            className={`flex ${
              transition ? "transition-transform duration-700 ease-in-out" : ""
            }`}
            style={{ transform: `translateX(-${index * slide}%)` }}
          >
            {extended.map((item, i) => (
              <div key={i} className="shrink-0 w-[60%] px-2">
                <div className="rounded-2xl overflow-hidden aspect-[16/8] bg-black ring-1 ring-white/10 shadow-xl shadow-black/40">
                  <img
                    src={item.img}
                    alt={item.title}
                    className="w-full h-full object-cover cursor-pointer"
                    onClick={() => navigate(`/movie/${item.id}`)}
                  />
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Left */}
        <button
          onClick={prev}
          className="absolute left-4 top-1/2 -translate-y-1/2 bg-black/60 text-white w-10 h-10 rounded-full ring-1 ring-white/10 hover:bg-black/80 transition"
        >
          {"<"}
        </button>

        {/* Right */}
        <button
          onClick={next}
          className="absolute right-4 top-1/2 -translate-y-1/2 bg-black/60 text-white w-10 h-10 rounded-full ring-1 ring-white/10 hover:bg-black/80 transition"
        >
          {">"}
        </button>
      </div>
    </div>
  );
};

export default PromoCarousel;
