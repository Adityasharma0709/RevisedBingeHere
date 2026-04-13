import { BrowserRouter, Routes, Route } from "react-router-dom";
import MovieDetailsContainer from "./pages/MovieDetailsContainer";
import FoodOrdering from "./pages/FoodOrdering";
import AuthForm from "./pages/AuthForm";
import LandingPage2 from "./pages/LandingPage2";
import LandingPage from "./pages/LandingPage";
import Showtimes from "./pages/Showtimes";
import SeatBooking from "./pages/SeatBooking";
import PaymentSummary from "./pages/PaymentSummary";
import AdminDashboard from "./pages/AdminDashboard";
import Profile from "./pages/Profile";
import ProtectedRoute from "./components/auth/ProtectedRoute";
import { Toaster } from "react-hot-toast";
import SundaySpecial from "./pages/SundayVoting";
import AddMovie from "./pages/admin/AddMovie";

function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<LandingPage />} />
        <Route path="/auth" element={<AuthForm />} />
        <Route
          path="/landing2"
          element={
            <ProtectedRoute>
              <LandingPage2 />
            </ProtectedRoute>
          }
        />
        <Route
          path="/movie/:movieId"
          element={
            <ProtectedRoute>
              <MovieDetailsContainer />
            </ProtectedRoute>
          }
        />
        <Route
          path="/showtimes"
          element={
            <ProtectedRoute>
              <Showtimes />
            </ProtectedRoute>
          }
        />
        <Route
          path="/seats"
          element={
            <ProtectedRoute>
              <SeatBooking />
            </ProtectedRoute>
          }
        />
        <Route
          path="/food-ordering"
          element={
            <ProtectedRoute>
              <FoodOrdering />
            </ProtectedRoute>
          }
        />
        <Route
          path="/payment-summary"
          element={
            <ProtectedRoute>
              <PaymentSummary />
            </ProtectedRoute>
          }
        />
        <Route
          path="/admin"
          element={
            <ProtectedRoute requireAdmin>
              <AdminDashboard />
            </ProtectedRoute>
          }
        />
        <Route
          path="/profile"
          element={
            <ProtectedRoute>
              <Profile />
            </ProtectedRoute>
          }
        />
        <Route
          path="/special"
          element={
            <ProtectedRoute>
              <SundaySpecial />
            </ProtectedRoute>
          }
        />
        <Route
          path="/movie/:movieId"
          element={
            <ProtectedRoute>
              <MovieDetailsContainer />
            </ProtectedRoute>
          }
        />
        <Route path="/seats" element={<SeatBooking />} />
        <Route path="/admin" element={<ProtectedRoute><AdminDashboard /></ProtectedRoute>} />
        <Route path="/admin/add-movie" element={<AddMovie />} />
      </Routes>
    </BrowserRouter>
  );
}

export default App;
