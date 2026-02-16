import { useState } from "react";

const BannerCarousel = () => {
const banners = [
  // Hollywood
  "https://image.tmdb.org/t/p/original/xDMIl84Qo5Tsu62c9DGWhmPI67A.jpg", // Avengers
  "https://image.tmdb.org/t/p/original/8YFL5QQVPy3AgrEQxNYVSgiPEbe.jpg", // Avatar
  "https://image.tmdb.org/t/p/original/r7XifzvtezNt31ypvsmb6Oqxw49.jpg", // John Wick
  "https://image.tmdb.org/t/p/original/hZkgoQYus5vegHoetLkCJzb17zJ.jpg", // Interstellar

  // Indian (Bollywood & South)
  "https://image.tmdb.org/t/p/original/ctMserH8g2SeOAnCw5gFjdQF8mo.jpg", // RRR
  "https://image.tmdb.org/t/p/original/z7A4jJtZ3Gx0NypQFvZb7BeMyrZ.jpg", // Jawan
  "https://image.tmdb.org/t/p/original/gPbM0MK8CP8A174rmUwGsADNYKD.jpg", // Pathaan
  "https://image.tmdb.org/t/p/original/1N3y7xG0zC2Vzz9vGvB9MvdnC5n.jpg", // KGF

  // Upcoming
  "https://image.tmdb.org/t/p/original/4HodYYKEIsGOdinkGi2Ucz6X9i0.jpg", // Dune 2
  "https://image.tmdb.org/t/p/original/b6IRp6Pl2Fsq37r9jFhGoLtaqHm.jpg", // Deadpool 3
  "https://image.tmdb.org/t/p/original/z7A4jJtZ3Gx0NypQFvZb7BeMyrZ.jpg", // Indian upcoming style
];


  const [index, setIndex] = useState(0);

  const prev = () => setIndex((index - 1 + banners.length) % banners.length);
  const next = () => setIndex((index + 1) % banners.length);

  return (
    <div className="w-full bg-[#f2f2f2] py-4">
      <div className="max-w-7xl mx-auto px-3 relative">
        <div className="relative overflow-hidden rounded-xl bg-black aspect-[16/5] max-h-[420px]">
          <img
            src={banners[index]}
            alt="banner"
            className="w-full h-full object-cover object-center"
          />

          <button
            onClick={prev}
            className="absolute left-4 top-1/2 -translate-y-1/2 bg-black/40 text-white w-9 h-9 rounded-full"
          >
            ❮
          </button>

          <button
            onClick={next}
            className="absolute right-4 top-1/2 -translate-y-1/2 bg-black/40 text-white w-9 h-9 rounded-full"
          >
            ❯
          </button>
        </div>
      </div>
    </div>
  );
};

export default BannerCarousel;
