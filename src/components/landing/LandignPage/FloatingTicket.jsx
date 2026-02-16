
import { Float, Text, useTexture } from "@react-three/drei";
import { useMemo, useRef } from "react";
import * as THREE from "three";
import { useFrame } from "@react-three/fiber";

// 1x1 transparent pixel for fallback when no textureUrl is provided
const FALLBACK_TEXTURE = "data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAAEAAAABCAQAAAC1HAwCAAAAC0lEQVR42mNkYAAAAAYAAjCB0C8AAAAASUVORK5CYII=";

function TicketMesh({ color, opacity, textureUrl, shape, extrudeSettings }) {
    // Always call useTexture to ensure hook consistency. Use fallback if no URL.
    const texture = useTexture(textureUrl || FALLBACK_TEXTURE);

    // Configure texture mapping if a real texture is used
    if (textureUrl) {
        texture.wrapS = texture.wrapT = THREE.RepeatWrapping;
        // Map uv coordinates (-2..2, -1..1) to (0..1, 0..1)
        // For a shape of width 4 and height 2, centered at (0,0)
        texture.repeat.set(1 / 4, 1 / 2);
        texture.offset.set(0.5, 0.5);
        texture.anisotropy = 16; // Improve texture quality at oblique angles
    }

    return (
        <mesh>
            <extrudeGeometry args={[shape, extrudeSettings]} />
            <meshStandardMaterial
                color={textureUrl ? "white" : color} // Use white if textured so texture shows its true colors
                map={textureUrl ? texture : null}
                metalness={0.1}
                roughness={0.6}
                side={THREE.DoubleSide}
                transparent={opacity < 1 || !!textureUrl} // Enable transparency for texture alpha or prop opacity
                opacity={opacity}
            />

            {/* Only show text and dash if NO texture is provided */}
            {!textureUrl && (
                <>
                    {/* Text on the ticket */}
                    <group position={[0, 0, 0.08]}>
                        <Text
                            position={[0, 0.4, 0]}
                            fontSize={0.4}
                            color="white"
                            font="fonts/Inter/static/Inter_18pt-Bold.ttf"
                            anchorX="center"
                            anchorY="middle"
                            fillOpacity={opacity}
                        >
                            ADMIT ONE
                        </Text>
                        <Text
                            position={[0, -0.2, 0]}
                            fontSize={0.2}
                            color="white"
                            font="fonts/Inter/static/Inter_18pt-Regular.ttf"
                            anchorX="center"
                            anchorY="middle"
                            fillOpacity={opacity}
                        >
                            MOVIE NIGHT
                        </Text>
                        {/* Dashed Line */}
                        <mesh position={[0, -0.6, 0]}>
                            <planeGeometry args={[3, 0.02]} />
                            <meshBasicMaterial color="white" opacity={0.5 * opacity} transparent />
                        </mesh>
                    </group>

                    {/* Backside Text (optional, mirrored) */}
                    <group position={[0, 0, -0.08]} rotation={[0, Math.PI, 0]}>
                        <Text
                            position={[0, 0, 0]}
                            fontSize={0.3}
                            color="white"
                            anchorX="center"
                            anchorY="middle"
                            fillOpacity={opacity}
                        >
                            BINGEHERE
                        </Text>
                    </group>
                </>
            )}
        </mesh>
    );
}

export default function FloatingTicket({
    position = [0, 0, 0],
    rotation = [0, 0, 0],
    scale = 1,
    color = "#E50914",
    opacity = 1,
    scrollSpeed = 5,
    textureUrl = null // New prop for texture URL
}) {
    const groupRef = useRef();

    const shape = useMemo(() => {
        const s = new THREE.Shape();
        const w = 4;
        const h = 2;
        const notchRadius = 0.4;

        // Draw shape with notches
        // Start Top Left
        s.moveTo(-w / 2, h / 2);
        // Top Right
        s.lineTo(w / 2, h / 2);
        // Right Notch Top
        s.lineTo(w / 2, notchRadius);
        // Right Notch Arc (inward - counter-clockwise)
        s.absarc(w / 2, 0, notchRadius, Math.PI / 2, -Math.PI / 2, false);
        // Right Bottom
        s.lineTo(w / 2, -h / 2);
        // Bottom Left
        s.lineTo(-w / 2, -h / 2);
        // Left Notch Bottom
        s.lineTo(-w / 2, -notchRadius);
        // Left Notch Arc (inward - counter-clockwise)
        s.absarc(-w / 2, 0, notchRadius, -Math.PI / 2, Math.PI / 2, false);

        return s;
    }, []);

    const extrudeSettings = useMemo(() => ({
        depth: 0.1,
        bevelEnabled: true,
        bevelThickness: 0.05,
        bevelSize: 0.05,
        bevelSegments: 3
    }), []);

    useFrame(() => {
        if (groupRef.current) {
            const scrollY = window.scrollY || 0;
            // Parallax effect: move up/down based on scroll
            // Normalized scroll (roughly 0 to 1 per screen height)
            const normalized = scrollY / (window.innerHeight || 1);

            // Move up as we scroll down
            groupRef.current.position.y = normalized * scrollSpeed;

            // Optional: Add slight rotation based on scroll
            groupRef.current.rotation.z = normalized * 0.2;
        }
    });

    return (
        <group ref={groupRef}>
            <Float
                speed={2}
                rotationIntensity={0.5}
                floatIntensity={0.5}
                position={position}
                rotation={rotation}
                scale={scale}
            >
                <TicketMesh
                    shape={shape}
                    extrudeSettings={extrudeSettings}
                    color={color}
                    opacity={opacity}
                    textureUrl={textureUrl}
                />
            </Float>
        </group>
    );
}
