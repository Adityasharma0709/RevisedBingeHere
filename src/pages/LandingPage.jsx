import { Canvas, useThree } from "@react-three/fiber";
import { OrbitControls } from "@react-three/drei";
import Cylinder from "../components/landing/LandignPage/Cylinder";
import CenterText from "../components/landing/LandignPage/CenterText";
// import RectangleBackground from "../components/landing/RectangleBackground";
import ScrollCards from "../components/landing/LandignPage/ScrollCards";
import { useEffect } from "react";
import { Navbar2 } from "../components/landing/LandignPage/Navbar";
function ResponsiveCamera() {
  const { camera, size } = useThree();

  useEffect(() => {
    const aspect = size.width / size.height;

    // Base settings for desktop (16:9 or wider)
    // We want to maintain the specific view of the cylinder

    if (aspect < 1) {
      // Portrait mode (Mobile)
      // Increase FOV significantly to fit the wide cylinder in a narrow view
      // And move it back slightly
      camera.fov = 80 + (1 - aspect) * 20; // Increases as it gets narrower
      camera.position.z = 45 + (1 - aspect) * 10;
    } else if (aspect < 1.5) {
      // Tablet / squarish windows
      camera.fov = 65;
      camera.position.z = 35;
    } else {
      // Desktop / Wide
      camera.fov = 60;
      camera.position.z = 30;
    }

    camera.updateProjectionMatrix();
  }, [size, camera]);

  return null;
}

export default function App() {
  return (
    <>
      <Navbar2 />

      {/* Fixed hero - stays in background */}
      <div className="bg-black w-full h-dvh fixed inset-0 z-0">
        <Canvas camera={{ position: [0, 0, 30], fov: 25 }}>
          <ResponsiveCamera />
          <ambientLight intensity={1} />
          {/* <Cylinder /> */}
          <CenterText />
        </Canvas>
      </div>

      {/* 1. This spacer allows the user to see the Hero 
         before the cards start coming up. 
      */}
      <div className="h-screen" />

      {/* 2. Added relative and z-10 to ensure it 
         scrolls OVER the fixed Three.js background. 
      */}
      <div className="relative z-10">
        <ScrollCards />
      </div>

      {/* 3. A final spacer or content section so the 
         last card can "stick" while this moves over it. 
      */}
      <div className="relative z-20 bg-white h-screen flex items-center justify-center">
        <h2 className="text-black text-4xl">Final Section Content</h2>
      </div>
    </>
  );
}
