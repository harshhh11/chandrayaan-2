'use client';

import React, { useRef, useMemo } from 'react';
import { useFrame } from '@react-three/fiber';
import * as THREE from 'three';
import { createEarthTextures } from '@/lib/textureGenerator';

// Custom Rayleigh Atmospheric Rim Glow Shader
const AtmosphereShader = {
  vertexShader: `
    varying vec3 vNormal;
    varying vec3 vPosition;
    void main() {
      vNormal = normalize(normalMatrix * normal);
      vPosition = (modelViewMatrix * vec4(position, 1.0)).xyz;
      gl_Position = projectionMatrix * modelViewMatrix * vec4(position, 1.0);
    }
  `,
  fragmentShader: `
    varying vec3 vNormal;
    varying vec3 vPosition;
    uniform vec3 uColor;
    uniform float uIntensity;
    uniform float uPower;
    
    void main() {
      vec3 viewDir = normalize(-vPosition);
      float rim = 1.0 - max(0.0, dot(viewDir, vNormal));
      float atmosphere = pow(rim, uPower) * uIntensity;
      
      // Electric cyan/blue haze
      gl_FragColor = vec4(uColor, atmosphere);
    }
  `
};

export const Earth: React.FC<{ scrollProgress?: number }> = () => {
  const earthRef = useRef<THREE.Group>(null);
  const surfaceMeshRef = useRef<THREE.Mesh>(null);
  const cloudsMeshRef = useRef<THREE.Mesh>(null);
  const atmosphereRef = useRef<THREE.Mesh>(null);

  // Generate procedural high-res textures
  const { dayMap, specMap, cloudsMap, nightMap } = useMemo(() => {
    return createEarthTextures();
  }, []);

  // Custom Earth material with day/night and specularity
  const earthMaterial = useMemo(() => {
    if (!dayMap) return new THREE.MeshStandardMaterial({ color: '#0f2b48' });

    const mat = new THREE.MeshStandardMaterial({
      map: dayMap,
      roughness: 0.45,
      metalness: 0.1,
      roughnessMap: specMap,
      emissiveMap: nightMap,
      emissive: new THREE.Color('#ffcc77'),
      emissiveIntensity: 0.85,
    });
    return mat;
  }, [dayMap, specMap, nightMap]);

  const cloudsMaterial = useMemo(() => {
    if (!cloudsMap) return new THREE.MeshStandardMaterial({ transparent: true, opacity: 0 });
    return new THREE.MeshStandardMaterial({
      map: cloudsMap,
      transparent: true,
      opacity: 0.82,
      blending: THREE.AdditiveBlending,
      depthWrite: false,
    });
  }, [cloudsMap]);

  const atmosphereMaterial = useMemo(() => {
    return new THREE.ShaderMaterial({
      vertexShader: AtmosphereShader.vertexShader,
      fragmentShader: AtmosphereShader.fragmentShader,
      uniforms: {
        uColor: { value: new THREE.Color('#38bdf8') },
        uIntensity: { value: 1.4 },
        uPower: { value: 2.8 },
      },
      blending: THREE.AdditiveBlending,
      side: THREE.BackSide,
      transparent: true,
      depthWrite: false,
    });
  }, []);

  const innerAtmosphereMaterial = useMemo(() => {
    return new THREE.ShaderMaterial({
      vertexShader: AtmosphereShader.vertexShader,
      fragmentShader: AtmosphereShader.fragmentShader,
      uniforms: {
        uColor: { value: new THREE.Color('#60a5fa') },
        uIntensity: { value: 0.9 },
        uPower: { value: 4.5 },
      },
      blending: THREE.AdditiveBlending,
      side: THREE.FrontSide,
      transparent: true,
      depthWrite: false,
    });
  }, []);

  // Slow orbital rotation
  useFrame((_, delta) => {
    if (surfaceMeshRef.current) {
      surfaceMeshRef.current.rotation.y += delta * 0.015;
    }
    if (cloudsMeshRef.current) {
      cloudsMeshRef.current.rotation.y += delta * 0.022;
    }
  });

  return (
    <group ref={earthRef} position={[-8.5, -7.5, -8]} rotation={[0.3, 0.4, -0.2]}>
      {/* 1. Earth Solid Surface Globe */}
      <mesh ref={surfaceMeshRef} receiveShadow castShadow>
        <sphereGeometry args={[11.5, 64, 64]} />
        <primitive object={earthMaterial} attach="material" />
      </mesh>

      {/* 2. Swirling Cloud Layer */}
      <mesh ref={cloudsMeshRef}>
        <sphereGeometry args={[11.58, 64, 64]} />
        <primitive object={cloudsMaterial} attach="material" />
      </mesh>

      {/* 3. Inner Atmospheric Rim Glow */}
      <mesh>
        <sphereGeometry args={[11.62, 64, 64]} />
        <primitive object={innerAtmosphereMaterial} attach="material" />
      </mesh>

      {/* 4. Outer Atmospheric Halo Backside Scatter */}
      <mesh ref={atmosphereRef}>
        <sphereGeometry args={[12.6, 64, 64]} />
        <primitive object={atmosphereMaterial} attach="material" />
      </mesh>

      {/* 5. Delicate Aurora / Atmosphere Horizon Arc */}
      <mesh position={[0, 0, 0]} rotation={[0.4, 0.2, 0]}>
        <ringGeometry args={[11.65, 12.2, 90]} />
        <meshBasicMaterial
          color="#38bdf8"
          transparent
          opacity={0.18}
          side={THREE.DoubleSide}
          blending={THREE.AdditiveBlending}
        />
      </mesh>
    </group>
  );
};
