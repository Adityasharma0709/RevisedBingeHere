const CategoryBar = () => {
  const leftItems = ["Movies", "Stream", "Events", "Plays", "Sports", "Activities"];
  const rightItems = ["ListYourShow", "Corporates", "Offers", "Gift Cards"];

  return (
    <div className="w-full bg-[#f5f5f5] border-b">
      <div className="max-w-7xl mx-auto flex justify-between px-3 py-2 text-sm">

        {/* Left scrollable */}
        <div className="flex gap-5 overflow-x-auto scrollbar-hide whitespace-nowrap">
          {leftItems.map(item => (
            <span key={item} className="cursor-pointer hover:text-red-600">
              {item}
            </span>
          ))}
        </div>

        {/* Right hidden on mobile */}
        <div className="hidden md:flex gap-6 text-gray-600">
          {rightItems.map(item => (
            <span key={item} className="cursor-pointer hover:text-red-600">
              {item}
            </span>
          ))}
        </div>

      </div>
    </div>
  );
};

export default CategoryBar;
