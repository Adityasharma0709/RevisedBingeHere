import { Canvas, useThree } from "@react-three/fiber";
import { OrbitControls } from "@react-three/drei";
import Cylinder from "../components/landing/Cylinder";
import CenterText from "../components/landing/CenterText";
import RectangleBackground from "../components/landing/RectangleBackground";
import ScrollCards from "../components/landing/ScrollCards";
import { useEffect } from "react";

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
      <div className="bg-amber-600 w-full h-[100dvh] fixed inset-0">
        <Canvas camera={{ position: [0, 0, 30], fov: 60 }} className="touch-none">
          <ResponsiveCamera />
          <ambientLight intensity={1} />
          <Cylinder />
          <CenterText />
          {/* <RectangleBackground /> */}
          {/* <OrbitControls enableZoom={false} /> */}
        </Canvas>
        <div className="absolute inset-0 pointer-events-none">
          <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[80vw] h-[80vw] bg-[#f26d2b] rounded-full blur-[100px] opacity-40 mix-blend-overlay" />
        </div>
      </div>
      <div>
        {/* Scroll cards */}
        <ScrollCards />
      </div>
    </>
  );
}
