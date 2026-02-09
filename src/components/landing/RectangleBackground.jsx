import { useTexture } from "@react-three/drei";
import * as THREE from "three";
import { useRef } from "react";
import { useFrame, useThree } from "@react-three/fiber";
import React from "react";

function RectangleBackground() {
  const { viewport } = useThree();

  if (!viewport?.width || !viewport?.height) {
    return null;
  }

  return (
    <mesh position={[0, 0, -45]}>
      <planeGeometry args={[viewport.width , viewport.height ]} />

      <meshPhysicalMaterial
        transmission={1}     // glass effect
        roughness={0.15}     // blur strength
        thickness={0.5}      // glass depth
        transparent
        opacity={0.2}
        color="#847c7cff"      // dark tint
      />
    </mesh>
  );
}

export default RectangleBackground;
