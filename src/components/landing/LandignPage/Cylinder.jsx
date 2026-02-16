import { useTexture } from "@react-three/drei";
import * as THREE from "three";
import { useRef } from "react";
import { useFrame, useThree } from "@react-three/fiber";

const Cylinder = () => {
  let tex = useTexture("combined.png");
  const meshRef = useRef();
  const { viewport } = useThree();

  useFrame(() => {
    meshRef.current.rotation.y += 0.003;
  });

  // Reverted to fixed radius as per request
  const radius = 40;

  // Adjust position on mobile to fit the view (move it further back)
  const isMobile = viewport.width < 10;
  const responsiveZ = isMobile ? -60 : -50;

  return (
    <mesh
      ref={meshRef}
      rotation={[
        0.1, // tilt backward (X axis)
        2.4, // facing angle (Y axis)
        0, // diagonal slant (Z axis)
      ]}
      position={[0, -2, responsiveZ-10]}
    >
      <cylinderGeometry args={[radius, radius, 30, 30, 60, true]} />
      <meshStandardMaterial transparent map={tex} side={THREE.DoubleSide} />
      <meshStandardMaterial transparent map={tex} side={THREE.DoubleSide} />
    </mesh>
  );
};

export default Cylinder;
