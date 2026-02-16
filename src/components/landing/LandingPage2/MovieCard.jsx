const MovieCard = ({ title, poster, promoted }) => {
  return (
    <div className="min-w-[180px] max-w-[180px] cursor-pointer">
      <div className="relative rounded-xl overflow-hidden">
        {promoted && (
          <span className="absolute top-2 left-2 bg-red-500 text-white text-xs px-2 py-1 rounded">
            PROMOTED
          </span>
        )}

        <img
          src={poster}
          alt={title}
          className="w-full h-[270px] object-cover"
        />
      </div>

      <h3 className="mt-2 text-sm font-semibold truncate">{title}</h3>
    </div>
  );
};

export default MovieCard;
