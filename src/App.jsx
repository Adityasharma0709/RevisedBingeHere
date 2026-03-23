import { BrowserRouter, Routes, Route } from "react-router-dom";
import MovieDetailsContainer from "./pages/MovieDetailsContainer";
import FoodOrdering from "./pages/FoodOrdering";
import AuthForm from "./pages/AuthForm";
import LandingPage2 from "./pages/LandingPage2";
import LandingPage from "./pages/LandingPage";
import Showtimes from "./pages/Showtimes";
import SeatBooking from "./pages/SeatBooking";
import AdminDashboard from "./pages/AdminDashboard";
import { Toaster } from "react-hot-toast";
import SundaySpecial from "./pages/SundayVoting";

function App() {
  return (
    <>
      <Toaster
        position="top-center"
        reverseOrder={false}
        toastOptions={{
          style: {
            background: "#111",
            color: "#fff",
            border: "1px solid #ff3d00"
          }
        }}
      />

      <BrowserRouter>
        <Routes>
          <Route path="/special" element = {<SundaySpecial/>}/>
          <Route path="/" element={<LandingPage />} />
          <Route path="/auth" element={<AuthForm />} />
          <Route path="/landing2" element={<LandingPage2 />} />
          <Route path="/movie/:movieId" element={<MovieDetailsContainer />} />
          <Route path="/showtimes" element={<Showtimes />} />
          <Route path="/seats" element={<SeatBooking />} />
          <Route path="/admin" element={<AdminDashboard />} />
        </Routes>
      </BrowserRouter>
    </>
  );
}

export default App;