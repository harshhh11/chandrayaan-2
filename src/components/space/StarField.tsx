'use client';

import React, { useMemo } from 'react';
import * as THREE from 'three';

export const StarField: React.FC = () => {
  // Generate realistic sparse starfield with natural astronomical magnitude distribution
  const { positions, colors, sizes } = useMemo(() => {
    const count = 1200;
    const pos = new Float32Array(count * 3);
    const col = new Float32Array(count * 3);
    const sz = new Float32Array(count);

    for (let i = 0; i < count; i++) {
      // Distribute in a large outer sphere
      const theta = Math.random() * Math.PI * 2;
      const phi = Math.acos(Math.random() * 2 - 1);
      const dist = 60 + Math.random() * 80;

      pos[i * 3] = dist * Math.sin(phi) * Math.cos(theta);
      pos[i * 3 + 1] = dist * Math.sin(phi) * Math.sin(theta);
      pos[i * 3 + 2] = dist * Math.cos(phi);

      // Star color temperatures: mostly crisp white, subtle cold blue, slight warm amber
      const temp = Math.random();
      if (temp > 0.85) {
        // Cold blue star
        col[i * 3] = 0.7;
        col[i * 3 + 1] = 0.85;
        col[i * 3 + 2] = 1.0;
        sz[i] = 1.2 + Math.random() * 1.5;
      } else if (temp < 0.1) {
        // Warm golden star
        col[i * 3] = 1.0;
        col[i * 3 + 1] = 0.9;
        col[i * 3 + 2] = 0.7;
        sz[i] = 1.0 + Math.random() * 1.2;
      } else {
        // Crisp white / dim stars
        const b = 0.5 + Math.random() * 0.5;
        col[i * 3] = b;
        col[i * 3 + 1] = b;
        col[i * 3 + 2] = b;
        sz[i] = 0.8 + Math.random() * 1.0;
      }
    }

    return { positions: pos, colors: col, sizes: sz };
  }, []);

  const pointsGeometry = useMemo(() => {
    const geom = new THREE.BufferGeometry();
    geom.setAttribute('position', new THREE.BufferAttribute(positions, 3));
    geom.setAttribute('color', new THREE.BufferAttribute(colors, 3));
    geom.setAttribute('size', new THREE.BufferAttribute(sizes, 1));
    return geom;
  }, [positions, colors, sizes]);

  return (
    <group>
      <points geometry={pointsGeometry}>
        <pointsMaterial
          size={1.2}
          vertexColors
          transparent
          opacity={0.85}
          sizeAttenuation={false}
        />
      </points>

      {/* Very faint deep space ambient haze in upper corner */}
      <mesh position={[20, 20, -50]}>
        <planeGeometry args={[100, 100]} />
        <meshBasicMaterial
          color="#061226"
          transparent
          opacity={0.3}
          blending={THREE.AdditiveBlending}
          depthWrite={false}
        />
      </mesh>
    </group>
  );
};
