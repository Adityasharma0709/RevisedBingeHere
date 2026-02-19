import { useRef, useMemo } from 'react';
import { useTexture } from '@react-three/drei';
import * as THREE from 'three';
import { useFrame } from '@react-three/fiber';

const vertexShader = `
  varying vec2 vUv;
  uniform float uBend;
  
  void main() {
    vUv = uv;
    vec3 pos = position;
    
    // Simple quadratic bend: Z displacement is proportional to Y squared
    // This creates a "U" shape or a simple curl depending on the axis
    // Adjusting to curl mainly along the vertical axis
    
    // Calculate normalized Y from -1.0 to 1.0 (assuming plane height is centered)
    // Actually standard plane buffer is usually -height/2 to height/2
    
    float y = pos.y;
    
    // Apply bend
    // As uBend increases, the Z position moves back/forward based on height
    // pos.z += pow(pos.y, 2.0) * uBend * 0.1; 
    
    // Let's try a sine wave curl for a more "rolling" feel, or just a simple bend
    pos.z += sin(pos.y * 2.0 + uBend) * 0.5; // Dynamic ripple?
    
    // Let's stick to a simple parabolic bend for "stress" look
    pos.z = pos.z + (pos.y * pos.y) * uBend;

    gl_Position = projectionMatrix * modelViewMatrix * vec4(pos, 1.0);
  }
`;

const fragmentShader = `
  uniform sampler2D uTexture;
  varying vec2 vUv;

  void main() {
    vec4 tex = texture2D(uTexture, vUv);
    gl_FragColor = tex;
  }
`;

export default function BentPoster({ url, ...props }) {
    const meshRef = useRef();
    const texture = useTexture(url);

    // Create shader material
    const material = useMemo(() => {
        return new THREE.ShaderMaterial({
            vertexShader,
            fragmentShader,
            uniforms: {
                uTime: { value: 0 },
                uBend: { value: 0 },
                uTexture: { value: texture }
            },
            side: THREE.DoubleSide,
            transparent: true,
        });
    }, [texture]);

    return (
        <mesh ref={meshRef} {...props}>
            <planeGeometry args={[3, 4.5, 32, 32]} />
            <primitive object={material} attach="material" />
        </mesh>
    );
}
