import { useState } from "react";
import LandingPage from "./pages/LandingPage";
import MovieDetails from "./pages/MovieDetails";
import MovieDetailsContainer from "./pages/MovieDetailsContainer";
import FoodOrdering from "./pages/FoodOrdering";
import AuthForm from "./pages/AuthForm";
import LandingPage2 from "./pages/LandingPage2";
import LandingPage from './pages/LandingPage'
import { Canvas } from "@react-three/fiber";
import { OrbitControls } from "@react-three/drei";
function App() {
  return <>
    {/* <SeatSelection/> */}
    {/* <h1 class="text-3xl font-bold underline">    Hello world!  </h1> */}
    <LandingPage/>
  </>
}

export default App;
