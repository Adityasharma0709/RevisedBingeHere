
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

    useFrame((state) => {
        if (groupRef.current) {
            const scrollY = window.scrollY || 0;
            // Parallax effect: move up/down based on scroll
            // Normalized scroll (roughly 0 to 1 per screen height)
            const normalized = scrollY / (window.innerHeight || 1);

            const { pointer } = state;

            // Scroll-based position
            const scrollYPos = normalized * scrollSpeed;

            // Pointer-based parallax (interactive floating)
            // We'll move slightly against the pointer or with it. 
            // Let's move WITH it to feel "light" and loosely connected.
            const pointerX = pointer.x * 2;
            const pointerY = pointer.y * 2;

            // Apply smooth interpolation to blending scroll and pointer
            // Note: mixing absolute scroll with lerped pointer needs care.
            // But since scroll is usually smooth enough or we want instant response, 
            // we will just add them. To make pointer smooth, we could use a stored vector, 
            // but direct assignment is often fine for simple effects.
            // Let's add slight lerp for the pointer part by using current position.

            // However, groupRef.current.position.x is 0 initially.
            // simple approach:

            groupRef.current.position.x += (pointerX - groupRef.current.position.x) * 0.1;

            // For Y, we combine scroll (instant/absolute) and pointer (lerped).
            // This is tricky because lerping "current" which includes scroll will maintain scroll momentum? 
            // No, if we set it every frame.
            // Let's just set it directly for reliability with scroll, and maybe lerp the pointer part if needed.
            // Or just direct assignment for responsiveness.

            groupRef.current.position.y = scrollYPos + (pointer.y * 2);
            // If we want smooth pointer on Y, we'd need to track it separately. 
            // For now, direct assignment check.

            // Add slight rotation based on scroll and pointer
            const targetRot = normalized * 0.2 + (pointer.x * 0.1);
            groupRef.current.rotation.z += (targetRot - groupRef.current.rotation.z) * 0.1;
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
