const PremiereCard = ({ title, language, poster, onClick }) => {
  return (
    <div
      className="min-w-[180px] max-w-[180px] cursor-pointer"
      onClick={onClick}
      role="button"
      tabIndex={0}
      onKeyDown={(e) => {
        if (e.key === "Enter" || e.key === " ") onClick?.();
      }}
    >
      <div className="relative rounded-xl overflow-hidden">
        {/* Premiere Tag */}
        <span className="absolute bottom-2 left-2 bg-red-500 text-white text-xs px-2 py-1 rounded">
          PREMIERE
        </span>

        <img
          src={poster}
          alt={title}
          className="w-full h-[270px] object-cover"
        />
      </div>

      <h3 className="mt-2 text-sm font-semibold text-white truncate">
        {title}
      </h3>
      <p className="text-xs text-gray-300">{language}</p>
    </div>
  );
};

export default PremiereCard;
