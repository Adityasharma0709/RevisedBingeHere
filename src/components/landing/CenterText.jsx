import { Text } from "@react-three/drei";
import { useFrame, useThree } from "@react-three/fiber";
import { useRef } from "react";

export default function CenterText() {
  const textRef = useRef();
  const { viewport } = useThree();

  useFrame((state) => {
    const t = state.clock.elapsedTime;
    // Smooth cinematic easing
    const scale = 1 - Math.exp(-t * 2);
    textRef.current.scale.x = scale;
  });

  // Responsive font size calculation
  // Base size 25 on desktop (viewport ~35) -> ratio ~0.7
  const responsiveFontSize = Math.min(25, viewport.width * 0.7);

  return (
    <Text
      ref={textRef}
      font="fonts\Inter\static\Inter_18pt-BlackItalic.ttf"
      fontSize={responsiveFontSize}
      letterSpacing={-0.05}
      maxWidth={viewport.width * 0.9} // Ensure it doesn't overflow width
      lineHeight={0.8}
      color="white"
      anchorX="center"
      anchorY="middle"
      position={[0, 0, -60]}  // Behind cylinder
      outlineWidth={0}
      rotation={[0, 0, -0.1]} // Slight tilt
    >
      COLLABORATE
    </Text>
  );
}
