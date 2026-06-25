import { Star } from "lucide-react";

const MovieCard = ({ title, poster, promoted, isSundaySpecial, onClick }) => {
  return (
    <div
      className={`min-w-[180px] max-w-[180px] cursor-pointer relative group transition-transform ${isSundaySpecial ? 'hover:scale-105' : ''}`}
      onClick={onClick}
      role="button"
      tabIndex={0}
      onKeyDown={(e) => {
        if (e.key === "Enter" || e.key === " ") onClick?.();
      }}
    >
      <div className={`relative rounded-xl overflow-hidden ${isSundaySpecial ? 'ring-2 ring-amber-400 ring-offset-2 ring-offset-[#0b0f1a] shadow-[0_0_15px_rgba(251,191,36,0.5)]' : ''}`}>
        {isSundaySpecial && (
          <div className="absolute top-0 left-0 w-full h-full bg-gradient-to-t from-amber-900/50 via-transparent to-transparent z-10 pointer-events-none"></div>
        )}
        
        {isSundaySpecial && (
          <div className="absolute top-2 right-2 bg-gradient-to-r from-amber-500 to-amber-600 text-white text-[10px] uppercase font-black px-2 py-1 rounded shadow-lg z-20 flex items-center gap-1 border border-amber-300/50">
            <Star size={10} fill="white" /> SUNDAY SPECIAL
          </div>
        )}

        {!isSundaySpecial && promoted && (
          <span className="absolute top-2 left-2 bg-red-500 text-white text-xs px-2 py-1 rounded z-20">
            PROMOTED
          </span>
        )}

        <img
          src={poster}
          alt={title}
          className="w-full h-[270px] object-cover relative z-0"
        />
      </div>

      <h3 className={`mt-3 text-sm font-semibold truncate ${isSundaySpecial ? 'text-amber-400' : ''}`}>{title}</h3>
    </div>
  );
};

export default MovieCard;
