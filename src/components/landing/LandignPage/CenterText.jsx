import { Text } from "@react-three/drei";
import { useFrame, useThree } from "@react-three/fiber";
import { useRef } from "react";

export default function CenterText() {
  const groupRef = useRef();
  const { viewport, size } = useThree();
  const aspect = size.width / size.height;
  const isPortrait = aspect < 1;

  const animationTime = useRef(0);
  const animationDone = useRef(false);

  useFrame((_, delta) => {
    if (!groupRef.current) return;
    if (animationDone.current) return;

    animationTime.current += delta;
    const duration = 1;
    const progress = Math.min(animationTime.current / duration, 1);
    const ease = 1 - Math.pow(1 - progress, 3);

    const target = isPortrait ? 1.15 : 1;
    const start = 0.55;
    const scale = start + ease * (target - start);

    groupRef.current.scale.set(scale, scale, scale);
    if (progress === 1) animationDone.current = true;
  });

  const unit = Math.min(viewport.width, viewport.height);
  const mobileBoost = isPortrait ? 1.2 : 1;

  const titleSize = unit * 0.3 * mobileBoost;
  const mainSize = unit * 1.2 * mobileBoost;
  const subtextSize = unit * 0.25 * mobileBoost;

  const groupY = isPortrait ? viewport.height * 0.08 : 0;
  const groupZ = isPortrait ? -65 : -80;
  const mainText = isPortrait
    ? "Your Perfect\nSeat Awaits."
    : "Your Perfect Seat Awaits.";

  return (
    <group ref={groupRef} position={[0, groupY, groupZ]}>
      <Text
        font="fonts/Inter/static/Inter_18pt-Bold.ttf"
        fontSize={titleSize}
        textAlign="center"
        anchorX="center"
        anchorY="bottom"
        position={[0, mainSize * 0.6 + titleSize, 0]}
        color="#E50914"
        letterSpacing={0.2}
      >
        LIGHTS. CAMERA. ACTION.
      </Text>

      <Text
        font="fonts/Inter/static/Inter_18pt-BlackItalic.ttf"
        fontSize={mainSize}
        textAlign="center"
        letterSpacing={isPortrait ? -0.05 : -0.08}
        lineHeight={0.9}
        anchorX="center"
        anchorY="middle"
        position={[0, 0, 0]}
        color="white"
      >
        {mainText}
      </Text>

      <Text
        font="fonts/Inter/static/Inter_18pt-Regular.ttf"
        fontSize={subtextSize}
        maxWidth={viewport.width * (isPortrait ? 1.6 : 2)}
        textAlign="center"
        anchorX="center"
        anchorY="top"
        position={[0, -mainSize * (isPortrait ? 0.72 : 0.6), 0]}
        color="#cccccc"
        lineHeight={1.4}
      >
        From blockbuster premieres to indie gems {"\u2014"} book instantly and
        enjoy the magic of cinema without the hassle.
      </Text>
    </group>
  );
}
