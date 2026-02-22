import { Text } from "@react-three/drei";
import { useFrame, useThree } from "@react-three/fiber";
import { useRef } from "react";

export default function CenterText() {
  const groupRef = useRef();
  const { viewport } = useThree();

  const animationTime = useRef(0);
  const animationDone = useRef(false);

  useFrame((state, delta) => {
    if (!groupRef.current) return;

    if (!animationDone.current) {
      animationTime.current += delta;
      const duration = 1;
      let progress = Math.min(animationTime.current / duration, 1);
      const ease = 1 - Math.pow(1 - progress, 3);
      const target = 1; // Scale target for the group
      const scale = 0.5 + ease * (target - 0.5);

      groupRef.current.scale.set(scale, scale, scale);

      if (progress === 1) animationDone.current = true;
      if (progress === 1) animationDone.current = true;
    }
  });

  // ✅ Responsive font sizing based on proper design principles
  // We use viewport height as primary constraint for text blocks to prevent vertical overflow
  const unit = Math.min(viewport.width, viewport.height); // Base unit

  // Typographic Scale (Golden Ratio-ish or Modular)
  const titleSize = unit * 0.3;     // Small kicker
  const mainSize = unit * 1.2;      // Hero display
  const subtextSize = unit * 0.25;  // Readable body

  return (
    <group ref={groupRef} position={[0, 0, -80]}>
      {/* 1. Kicker: Lights. Camera. Action. */}
      {/* High contrast, tracking for elegance */}
      <Text
        font="fonts/Inter/static/Inter_18pt-Bold.ttf"
        fontSize={titleSize}
        textAlign="center"
        anchorX="center"
        anchorY="bottom"
        position={[0, mainSize * 0.6 + titleSize, 0]} // Positioned relative to main text
        color="#E50914"
        letterSpacing={0.2} // Wide tracking for "cinematic" feel
      >
        LIGHTS. CAMERA. ACTION.
      </Text>

      {/* 2. Main: Your Perfect Seat Awaits. */}
      <Text
        font="fonts/Inter/static/Inter_18pt-BlackItalic.ttf"
        fontSize={mainSize}
        textAlign="center"
        letterSpacing={-0.08} // Tight tracking for display impact
        lineHeight={0.9}
        anchorX="center"
        anchorY="middle"
        position={[0, 0, 0]} // Center visual anchor
        color="white"
      >
        Your Perfect Seat Awaits.
      </Text>

      {/* 3. Subtext */}
      {/* Constrained width for readability (approx 60-75 chars per line) */}
      <Text
        font="fonts/Inter/static/Inter_18pt-Regular.ttf"
        fontSize={subtextSize}
        maxWidth={viewport.width*2} // Max width in world units
        textAlign="center"
        anchorX="center"
        anchorY="top"
        position={[0, -mainSize * 0.6, 0]}
        color="#cccccc" // Lower contrast for hierarchy
        lineHeight={1.4}
      >
        From blockbuster premieres to indie gems — book instantly and enjoy the magic of cinema without the hassle.
      </Text>
    </group>
  );
}
