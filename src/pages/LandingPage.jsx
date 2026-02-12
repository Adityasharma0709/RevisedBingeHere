import "./css/LandingPage.css";
import { useState } from "react";
import LoginModal from "../components/loginModal";

export default function App() {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isRegisterOpen, setIsRegisterOpen] = useState(false);
  const [name, setname] = useState("");
  const [phone, setphone] = useState("");
  const [email, setemail] = useState("");

  // validation
  const nameIsValid = /^[A-Za-z]*$/.test(name); // Only letters
  const phoneDigits = phone.replace(/\D/g, "");
  const phoneIsValid = phoneDigits.length === 10;

  return (
    <div className="min-h-screen w-full bg-(--apnabackground) overflow-x-hidden">
      {/* Main Container */}
      <div className="relative w-full overflow-hidden">
        {/* Navbar */}
        <nav className="relative z-10 flex items-center justify-between px-4 md:px-12 py-4">
          {/* Logo */}
          <div className="flex items-center gap-2 text-white px-4 py-2 rounded-xl font-bold text-sm bg-gradient-to-r from-[#0f172a] to-[#334155]">
            <div className="w-6 h-6 grid place-items-center rounded-lg bg-white/20">
              <img src="/fav-removebg.png" alt="logo" />
            </div>
            <span>BingeHere</span>
          </div>

          {/* Mobile Buttons */}
          <div className="flex md:hidden gap-2">
            <button
              className="px-4 py-2 rounded-full bg-[#b91c1c] text-white text-xs font-bold"
              onClick={() => setIsModalOpen(true)}
            >
              LOG IN
            </button>
            <button
              className="px-4 py-2 rounded-full bg-[#1f2937] text-white text-xs font-bold"
              onClick={() => setIsRegisterOpen(true)}
            >
              REGISTER
            </button>
          </div>

          {/* Desktop Links */}
          <div className="hidden md:flex items-center gap-10">
            <a className="text-sm font-semibold text-slate-500 hover:text-slate-700">
              About
            </a>
            <a className="text-sm font-semibold text-slate-500 hover:text-slate-700">
              Service
            </a>
            <a className="text-sm font-semibold text-slate-500 hover:text-slate-700">
              Contact
            </a>
          </div>
        </nav>

        {/* Hero Section */}
        <section
          className="
  grid grid-cols-1 md:grid-cols-2
  px-6 md:px-16
  pt-6 pb-12
  gap-10
  items-center
"
        >
          {/* Left */}
          <div className="flex flex-col justify-center text-center md:text-left">
            <h1 className="text-[38px] md:text-[64px] leading-tight font-extrabold text-[#b0b0b4]">
              MOVIE <br /> BOOKING
            </h1>

            <p className="mt-4 max-w-md mx-auto md:mx-0 text-slate-500 text-sm">
              Book your favorite movies in seconds! Discover latest releases,
              pick your seats & enjoy smooth booking.
            </p>

            <div className="mt-7 hidden md:flex gap-4">
              <button
                className="px-8 py-3 rounded-full bg-[#b91c1c] text-white font-bold text-xs"
                onClick={() => setIsModalOpen(true)}
              >
                LOG IN
              </button>
              <button
                className="px-8 py-3 rounded-full bg-[#1f2937] text-white font-bold text-xs"
                onClick={() => setIsRegisterOpen(true)}
              >
                REGISTER
              </button>
            </div>
          </div>
          <LoginModal
            isModalOpen={isModalOpen}
            setIsModalOpen={setIsModalOpen}
            isRegisterOpen={isRegisterOpen}
            setIsRegisterOpen={setIsRegisterOpen}
          />

          {/* Right */}
          <div className="flex justify-center items-center">
            <img
              src="/landing2.png"
              alt="hero"
              className="
        w-[85%]
        sm:w-[70%]
        md:w-full
        max-w-[520px]
        object-contain
      "
            />
          </div>
        </section>
      </div>
    </div>
  );
}
