import { BrowserRouter, Routes, Route } from "react-router-dom";
import MovieDetailsContainer from "./pages/MovieDetailsContainer";
import FoodOrdering from "./pages/FoodOrdering";
import AuthForm from "./pages/AuthForm";
import LandingPage2 from "./pages/LandingPage2";
import LandingPage from "./pages/LandingPage";
import Showtimes from "./pages/Showtimes";
import SeatBooking from "./pages/SeatBooking";
import PaymentSummary from "./pages/PaymentSummary";

function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<LandingPage />} />
        <Route path="/auth" element={<AuthForm />} />
        <Route path="/landing2" element={<LandingPage2 />} />
        <Route path="/movie/:movieId" element={<MovieDetailsContainer />} />
        <Route path="/showtimes" element={<Showtimes />} />
        <Route path="/seats" element={<SeatBooking />} />
        <Route path="/food-ordering" element={<FoodOrdering />} />
        <Route path="/payment-summary" element={<PaymentSummary />} />
      </Routes>
    </BrowserRouter>
  );
}

export default App;
