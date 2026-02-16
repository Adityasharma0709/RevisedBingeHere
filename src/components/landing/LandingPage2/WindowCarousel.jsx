import { useState, useEffect } from "react";

const banners = [
  "https://assets-in.bmscdn.com/iedb/movies/images/mobile/listing/xxlarge/king-et00455480-1769617085.jpg",
  "https://assets-in.bmscdn.com/iedb/movies/images/mobile/listing/xxlarge/kantara-a-legend-chapter-1-et00377351-1760336092.jpg",
  "https://assets-in.bmscdn.com/iedb/movies/images/mobile/listing/xxlarge/mardaani-3-et00424340-1769673744.jpg",
  "https://assets-in.bmscdn.com/iedb/movies/images/mobile/listing/xxlarge/mayasabha--the-hall-of-illusion-et00472022-1764308067.jpg",
  "https://m.media-amazon.com/images/M/MV5BZGViMTg3MjYtMDc3Yy00NTVlLTgxM2YtNDc4MzUxMGVlNjVhXkEyXkFqcGc@._V1_.jpg",
  "https://assets-in.bmscdn.com/iedb/movies/images/mobile/listing/xxlarge/dhurandhar-part-2-et00478890-1767353118.jpg"
];


const extended = [banners[banners.length - 1], ...banners, banners[0]];

const PromoCarousel = () => {
  // start from index 2 (so banners[1] is centered visually)
  const [index, setIndex] = useState(2);
  const [transition, setTransition] = useState(true);

  const slide = 60; // center width %

  const next = () => setIndex((prev) => prev + 1);
  const prev = () => setIndex((prev) => prev - 1);

  useEffect(() => {
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
  }, [index]);

  useEffect(() => {
    if (!transition) {
      requestAnimationFrame(() => setTransition(true));
    }
  }, [transition]);

  return (
    <div className="w-full bg-[#f2f2f2] py-15">
      <div className="max-w-7xl mx-auto relative">

        {/* Viewport */}
        <div className="overflow-hidden px-[10%]">
          <div
            className={`flex ${transition ? "transition-transform duration-700 ease-in-out" : ""}`}
            style={{ transform: `translateX(-${index * slide}%)` }}
          >
            {extended.map((img, i) => (
              <div key={i} className="shrink-0 w-[60%] px-2">
                <div className="rounded-2xl overflow-hidden aspect-[16/8] bg-black">
                  <img
                    src={img}
                    alt="banner"
                    className="w-full h-full object-cover"
                  />
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Left */}
        <button
          onClick={prev}
          className="absolute left-4 top-1/2 -translate-y-1/2 bg-black/40 text-white w-10 h-10 rounded-full"
        >
          ‹
        </button>

        {/* Right */}
        <button
          onClick={next}
          className="absolute right-4 top-1/2 -translate-y-1/2 bg-black/40 text-white w-10 h-10 rounded-full"
        >
          ›
        </button>

      </div>
    </div>
  );
};

export default PromoCarousel;
