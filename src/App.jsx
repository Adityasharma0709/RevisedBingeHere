import { BrowserRouter, Routes, Route } from "react-router-dom";
import MovieDetailsContainer from "./pages/MovieDetailsContainer";
import FoodOrdering from "./pages/FoodOrdering";
import AuthForm from "./pages/AuthForm";
import LandingPage2 from "./pages/LandingPage2";
import LandingPage from "./pages/LandingPage";
import MoviesByLocationCategory from "./pages/MoviesByLocationCategory";
import Showtimes from "./pages/Showtimes";
import SeatBooking from "./pages/SeatBooking";
import PaymentSummary from "./pages/PaymentSummary";
import AdminDashboard from "./pages/AdminDashboard";
import Profile from "./pages/Profile";
import YourOrders from "./pages/YourOrders";
import Support from "./pages/Support";
import ProtectedRoute from "./components/auth/ProtectedRoute";
import PublicRoute from "./components/auth/PublicRoute";
import { Toaster } from "react-hot-toast";
import SundaySpecial from "./pages/SundayVoting";
import AddMovie from "./pages/admin/AddMovie";
import CreateTheatre from "./pages/admin/CreateTheatre";
import OwnerDashboard from "./pages/theatre_owner/OwnerDashboard";
import ManageScreens from "./pages/theatre_owner/ManageScreens";
import ManageShows from "./pages/theatre_owner/ManageShows";

function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<LandingPage />} />
        <Route
          path="/auth"
          element={
            <PublicRoute>
              <AuthForm />
            </PublicRoute>
          }
        />
        <Route
          path="/dashboard"
          element={
            <ProtectedRoute>
              <LandingPage2 />
            </ProtectedRoute>
          }
        />
        <Route
          path="/movies/by-location/:category"
          element={
            <ProtectedRoute>
              <MoviesByLocationCategory />
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
          path="/admin/create-theatre"
          element={
            <ProtectedRoute requireAdmin>
              <CreateTheatre />
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
          path="/orders"
          element={
            <ProtectedRoute>
              <YourOrders />
            </ProtectedRoute>
          }
        />
        <Route
          path="/support"
          element={
            <ProtectedRoute>
              <Support />
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

        {/* Theatre Owner Routes */}
        <Route
          path="/owner/dashboard"
          element={
            <ProtectedRoute requireOwner>
              <OwnerDashboard />
            </ProtectedRoute>
          }
        />
        <Route
          path="/owner/screens"
          element={
            <ProtectedRoute requireOwner>
              <ManageScreens />
            </ProtectedRoute>
          }
        />
        <Route
          path="/owner/shows"
          element={
            <ProtectedRoute requireOwner>
              <ManageShows />
            </ProtectedRoute>
          }
        />
      </Routes>
    </BrowserRouter>
  );
}

export default App;
