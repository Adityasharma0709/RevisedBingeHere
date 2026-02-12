import SideMenu from "./sideMenu";
import Dropdown from "./Dropdown";
import { Search } from "lucide-react";
const Navbar = () => {
  return (
    <nav className="w-full bg-white border-b shadow-sm">
      <div className="max-w-7xl mx-auto flex items-center justify-between px-3 py-2 gap-3">

        {/* LEFT */}
        <div className="flex items-center gap-3 flex-1">

          {/* Logo */}
          <div className="text-lg md:text-2xl font-bold whitespace-nowrap">
            <span className="text-black">Binge</span>
            <span className="text-red-600">here</span>
          </div>

          {/* Search */}
          <div className="relative flex-1 hidden sm:block items-center">
            <input
              type="text"
              placeholder="Search for Movies, Events, Plays, Sports and Activities"
              className="w-full border border-gray-300 rounded-md pl-10 pr-4 py-1.5 text-sm focus:outline-none"
            />
            <span className="absolute left-3 top-2 text-gray-400"><Search/></span>
          </div>
        </div>

        {/* RIGHT */}
        <div className="flex items-center gap-3">

          <span className="hidden md:flex items-center gap-1 text-sm cursor-pointer">
            <Dropdown/>
          </span>

          <button className="bg-red-500 text-white text-xs md:text-sm px-3 py-1.5 rounded">
            Sign in
            
          </button>

          <span className="text-xl cursor-pointer"><SideMenu /></span>
        </div>

      </div>

      {/* Mobile Search */}
      <div className="sm:hidden px-3 pb-2">
        <input
          type="text"
          placeholder="Search movies, events..."
          className="w-full border border-gray-300 rounded-md px-3 py-1.5 text-sm"
        />
      </div>
    </nav>
  );
};

export default Navbar;
