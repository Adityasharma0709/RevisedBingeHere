import { Play, ArrowRight, Sparkles } from "lucide-react";

function Card({ title }) {
  return (
    <div className="card w-screen min-h-screen bg-emerald-600 flex items-center justify-center relative overflow-hidden px-4 py-20 md:py-0">
      <div className="container mx-auto flex flex-col md:flex-row items-center justify-between gap-12 md:gap-8 px-4 md:px-12">
        {/* Left side — media */}
        <div className="relative w-full md:w-1/2 flex justify-center items-center">
          {/* Orange brush circle */}
          <div className="absolute w-[300px] h-[300px] md:w-[520px] md:h-[520px] bg-[#f26d2b] rounded-full blur-2xl opacity-60 animate-pulse" />

          {/* Image / video card */}
          <div className="relative w-full max-w-[320px] md:max-w-[420px] aspect-[4/5] bg-black overflow-hidden shadow-2xl rounded-2xl group cursor-pointer transition-transform duration-500 hover:scale-[1.02] border border-white/10">
            <img
              src="shelter.jpg"
              alt="preview"
              className="w-full h-full object-cover transition-opacity duration-500 group-hover:opacity-80"
            />

            {/* Play button */}
            <div className="absolute inset-0 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-all duration-300 bg-black/40">
              <button className="w-20 h-20 bg-white/20 backdrop-blur-md flex items-center justify-center rounded-full hover:bg-white/30 transition-colors border border-white/30">
                <Play className="w-8 h-8 text-white fill-white ml-1" />
              </button>
            </div>
          </div>
        </div>

        {/* Right side — text */}
        <div className="w-full md:w-1/2 flex flex-col items-center md:items-start text-center md:text-left z-10">
          <div className="flex items-center gap-2 mb-4">
            <Sparkles className="text-[#f26d2b] w-6 h-6" />
            <span className="text-[#f26d2b] font-bold tracking-widest text-sm uppercase">Featured Content</span>
          </div>

          <h1 className="text-5xl md:text-7xl lg:text-[100px] font-black leading-[0.9] text-white tracking-tighter mb-6">
            YOUR <br className="hidden md:block" />
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-white to-white/50">
              NEXUS
            </span>
          </h1>

          <div className="w-24 h-1 bg-[#f26d2b] mb-8" />

          <p className="text-lg md:text-xl text-white/80 max-w-lg leading-relaxed mb-10 font-medium">
            Join a Nexus of Curators & Artists, built on collaboration.
            No gatekeeping, just pure, open creativity waiting to be unleashed.
          </p>

          <button className="group flex items-center gap-3 px-8 py-4 bg-white text-black rounded-full font-bold hover:bg-[#f26d2b] hover:text-white transition-all duration-300 shadow-lg hover:shadow-[#f26d2b]/50">
            <span>Explore Now</span>
            <ArrowRight className="w-5 h-5 transition-transform duration-300 group-hover:translate-x-1" />
          </button>
        </div>
      </div>
    </div>
  );
}

export default Card;
