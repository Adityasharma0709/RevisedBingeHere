import { useRef } from "react";
import { useFrame } from "@react-three/fiber";
import { useTexture } from "@react-three/drei";

export default function CurvedRibbon() {
  const group = useRef();

  const textures = useTexture([
    "/Avengers.jpg",
    "/Avataar.jpg",
    "/28Years.jpg",
    "/shelter.jpg",
  ]);

  const radius = 7;       // bigger radius = flatter arc
  const spread = Math.PI / 1.2; // smaller spread = smoother ribbon

  useFrame((state) => {
    const t = state.clock.elapsedTime;

    group.current.position.y = Math.sin(t * 0.8) * 0.4;
    group.current.rotation.y = Math.sin(t * 0.25) * 0.1;
  });

  return (
    <group ref={group} rotation={[0.25, -0.5, 0]}>
      {textures.map((tex, i) => {
        const angle =
          (i - (textures.length - 1) / 2) *
          (spread / textures.length);

        const x = Math.sin(angle) * radius;
        const z = Math.cos(angle) * radius;

        return (
          <mesh
            key={i}
            position={[x, 0, z]}
            rotation={[0, angle * 0.5, 0]} // 👈 key fix
          >
            <planeGeometry args={[6, 9]} />
            <meshBasicMaterial map={tex} />
          </mesh>
        );
      })}
    </group>
  );
}
