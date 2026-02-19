import { Canvas, useThree } from "@react-three/fiber";
import { OrbitControls } from "@react-three/drei";
import Cylinder from "../components/landing/LandignPage/Cylinder";
import CenterText from "../components/landing/LandignPage/CenterText";
import FloatingTicket from "../components/landing/LandignPage/FloatingTicket";
// import RectangleBackground from "../components/landing/RectangleBackground";
import ScrollCards from "../components/landing/LandignPage/ScrollCards";
import { useEffect } from "react";
import { Navbar } from "../components/landing/LandignPage/Navbar";
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
      <Navbar />

      {/* Fixed hero - stays in background */}
      <div className="bg-black w-full h-dvh fixed inset-0 z-0">
        <Canvas camera={{ position: [0, 0, 30], fov: 25 }}>
          <ResponsiveCamera />
          <ambientLight intensity={1} />
          {/* <Cylinder /> */}
          <CenterText />

          {/* Front Tickets - Distributed */}
          <FloatingTicket position={[18, 10, -75]} rotation={[0.1, -0.2, 0.1]} scale={6} scrollSpeed={15} textureUrl="/ticket.png" />
          <FloatingTicket position={[-18, -12, -70]} rotation={[-0.1, 0.2, -0.1]} scale={7} color="#E50914" scrollSpeed={12} textureUrl="/ticket.png" />
          <FloatingTicket position={[24, -15, -60]} rotation={[0.2, 0.1, 0.5]} scale={8} color="#D81F26" scrollSpeed={18} textureUrl="/ticket.png" />
          <FloatingTicket position={[-22, 18, -65]} rotation={[0, 0, 0.4]} scale={6.5} scrollSpeed={14} textureUrl="/ticket.png" />

          {/* Far Side Tickets */}
          <FloatingTicket position={[-35, 20, -80]} rotation={[0.2, 0.3, 0]} scale={5} scrollSpeed={8} textureUrl="/ticket.png" />
          <FloatingTicket position={[-42, -8, -90]} rotation={[-0.2, 0.1, -0.2]} scale={6} opacity={0.6} scrollSpeed={6} textureUrl="/ticket.png" />
          <FloatingTicket position={[-38, 12, -100]} rotation={[0.4, 0.4, -0.1]} scale={4} opacity={0.4} scrollSpeed={4} textureUrl="/ticket.png" />

          <FloatingTicket position={[32, 16, -85]} rotation={[-0.1, -0.3, 0.1]} scale={5} scrollSpeed={9} textureUrl="/ticket.png" />
          <FloatingTicket position={[40, -10, -95]} rotation={[0.1, -0.1, 0.3]} scale={4} opacity={0.5} scrollSpeed={5} textureUrl="/ticket.png" />
          <FloatingTicket position={[28, -22, -70]} rotation={[0, 0, -0.4]} scale={6} scrollSpeed={16} textureUrl="/ticket.png" />
          <FloatingTicket position={[45, 22, -105]} rotation={[-0.3, -0.2, 0]} scale={3} opacity={0.3} scrollSpeed={3} textureUrl="/ticket.png" />

          {/* Background Tickets - Scattered */}
          <FloatingTicket position={[-8, 15, -90]} rotation={[0.5, 0.5, 0]} scale={3} opacity={0.4} color="#B81D24" scrollSpeed={5} textureUrl="/ticket.png" />
          <FloatingTicket position={[15, 5, -100]} rotation={[-0.2, -0.4, 0.2]} scale={2.5} opacity={0.3} color="#800000" scrollSpeed={3} textureUrl="/ticket.png" />
          <FloatingTicket position={[-15, -8, -95]} rotation={[0.3, 0, -0.3]} scale={3} opacity={0.3} scrollSpeed={4} textureUrl="/ticket.png" />
          <FloatingTicket position={[5, -18, -85]} rotation={[-0.1, 0.1, 0.1]} scale={3.5} opacity={0.5} scrollSpeed={6} textureUrl="/ticket.png" />
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
