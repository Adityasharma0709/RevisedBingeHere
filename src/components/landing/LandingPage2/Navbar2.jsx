import { useNavigate } from "react-router-dom";
import SideMenu from "../LandingPage2/sideMenu";

const Navbar2 = () => {
  const navigate = useNavigate();

  return (
    <>
      <nav
        className="
          fixed top-0 left-0 w-full z-50
          px-6 py-4 md:px-10 md:py-5
          flex items-center justify-between
          backdrop-blur-xl border-b border-white/5
          transition-all duration-300
        "
      >
        {/* LEFT: Logo */}
        <div className="flex items-center gap-2 md:gap-4">
          <div className="text-xl md:text-2xl font-black tracking-wider cursor-pointer group select-none">
            <span className="text-white group-hover:text-red-500 transition-colors duration-300 drop-shadow-md">Binge</span>
            <span className="text-red-600 group-hover:text-white transition-colors duration-300 drop-shadow-md">Here</span>
          </div>
        </div>


        {/* RIGHT: Actions */}
        <div className="flex items-center gap-4 md:gap-6">
  


          {/* Side Menu */}
          <div className="text-white hover:text-red-500 transition-colors cursor-pointer">
            <SideMenu />
          </div>
        </div>
      </nav>


    </>
  );
};

export { Navbar2 };
