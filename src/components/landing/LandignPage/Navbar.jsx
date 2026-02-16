import SideMenu from "../LandingPage2/sideMenu";
import Dropdown from "../LandingPage2/Dropdown";
import { Search } from "lucide-react";
import { useState } from "react";
import LoginModal from "../../loginModal";

const Navbar = () => {
  const [isRegisterOpen, setIsRegisterOpen] = useState(false);

  return (
    <>
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
                placeholder="Search for Movies..."
                className="w-full border border-gray-300 rounded-md pl-10 pr-4 py-1.5 text-sm focus:outline-none"
              />
              <span className="absolute left-3 top-2 text-gray-400">
                <Search />
              </span>
            </div>
          </div>

          {/* RIGHT */}
          <div className="flex items-center gap-3">
            <span className="hidden md:flex items-center gap-1 text-sm cursor-pointer">
              <Dropdown />
            </span>

            {/* 🔥 Sign in button opens modal */}
            <button
              className="bg-red-500 text-white text-xs md:text-sm px-3 py-1.5 rounded"
              onClick={() => setIsRegisterOpen(true)}
            >
              Sign in
            </button>

            <span className="text-xl cursor-pointer">
              <SideMenu />
            </span>
          </div>
        </div>

        {/* Mobile Search */}
        <div className="sm:hidden px-3 pb-2">
          <input
            type="text"
            placeholder="Search movies..."
            className="w-full border border-gray-300 rounded-md px-3 py-1.5 text-sm"
          />
        </div>
      </nav>

      {/* 🔥 Modal rendered here */}
      <LoginModal
        isRegisterOpen={isRegisterOpen}
        setIsRegisterOpen={setIsRegisterOpen}
      />
    </>
  );
};
function Navbar2() {
  return (
    <nav
      className="
   fixed top-0 left-0 w-full
   z-50
   flex items-center justify-between
   px-8 py-4
   text-white
   backdrop-blur-md
   bg-black/20
 "
    >
      {/* Logo */}{" "}
      <div className="text-lg font-semibold tracking-wide">Nexus </div>
      {/* Auth buttons */}
      <div className="flex gap-4 items-center">
        <button
          className="
      px-5 py-2
      border border-white/40
      rounded-full
      hover:bg-white/10
      transition
    "
        >
          Sign in
        </button>

        <button
          className="
      px-5 py-2
      bg-white text-black
      rounded-full
      font-medium
      hover:bg-white/90
      transition
    "
        >
          Register
        </button>
      </div>
    </nav>
  );
}

export { Navbar, Navbar2 };
