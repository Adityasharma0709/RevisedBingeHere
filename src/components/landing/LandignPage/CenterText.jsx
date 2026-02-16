import { Text } from "@react-three/drei";
import { useFrame, useThree } from "@react-three/fiber";
import { useRef } from "react";

export default function CenterText() {
  const textRef = useRef();
  const { viewport } = useThree();

  const animationTime = useRef(0);
  const animationDone = useRef(false);

  useFrame((state, delta) => {
    if (!textRef.current || animationDone.current) return;

    animationTime.current += delta;

    const duration = 1;
    let progress = Math.min(animationTime.current / duration, 1);

    const ease = 1 - Math.pow(1 - progress, 3);

    const target = 2.8;

    const scale = 0.5 + ease * (target - 0.5);

    textRef.current.scale.y = scale;
    textRef.current.scale.x = scale;

    if (progress === 1) animationDone.current = true;
  });

  // ✅ Responsive font sizing
  const base = Math.min(viewport.width, viewport.height);
  const fontSize = base ;

  return (
    <Text
      ref={textRef}
      font="fonts/Inter/static/Inter_18pt-BlackItalic.ttf"
      fontSize={fontSize}
      maxWidth={viewport.width * 0.9} // ✅ forces wrapping
      textAlign="center"
      letterSpacing={-0.08}
      lineHeight={0.9}
      anchorX="center"
      anchorY="middle"
      position={[0, 0, -80]}
      color="white"
    >
      Binge Here
    </Text>
  );
}
