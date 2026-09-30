'use client';

import React, { useRef, useMemo } from 'react';
import { useFrame } from '@react-three/fiber';
import * as THREE from 'three';

interface OrbitalPathProps {
  scrollProgress?: number;
}

export const OrbitalPath: React.FC<OrbitalPathProps> = () => {
  const orbitLineRef = useRef<THREE.Line>(null);
  const nodesGroupRef = useRef<THREE.Group>(null);
  const pulseRingsRef = useRef<THREE.Group>(null);

  // Generate scientific orbital elliptical trajectory curve
  const { lineGeometry, points } = useMemo(() => {
    const pts: THREE.Vector3[] = [];
    const count = 180;
    const a = 12.8; // Semi-major axis
    const b = 11.2; // Semi-minor axis
    
    for (let i = 0; i <= count; i++) {
      const theta = (i / count) * Math.PI * 2;
      const x = Math.cos(theta) * a - 8.5;
      const y = Math.sin(theta) * b * 0.7 - 7.5;
      const z = Math.sin(theta) * 6.5 - 7.0;
      pts.push(new THREE.Vector3(x, y, z));
    }
    const geom = new THREE.BufferGeometry().setFromPoints(pts);
    return { lineGeometry: geom, points: pts };
  }, []);

  // Constellation telemetry nodes along the orbit
  const constellationNodes = useMemo(() => {
    const nodes = [];
    const step = Math.floor(points.length / 10);
    for (let i = 0; i < points.length; i += step) {
      if (points[i]) {
        nodes.push({
          pos: points[i],
          id: `node-${i}`,
          label: `SAT-${100 + i}`,
        });
      }
    }
    return nodes;
  }, [points]);

  // Constellation laser connection lines between orbital satellites (matching screenshot 2 & 5)
  const laserLinksGeometry = useMemo(() => {
    const pts: THREE.Vector3[] = [];
    // Network mesh around satellite
    const satPos = new THREE.Vector3(2.4, 0.8, 0);
    const target1 = new THREE.Vector3(5.5, 3.2, -3.0);
    const target2 = new THREE.Vector3(6.8, -0.5, -4.0);
    const target3 = new THREE.Vector3(4.2, -2.8, -2.5);
    const target4 = new THREE.Vector3(7.2, 1.8, -5.0);

    // Sat to constellation relays
    pts.push(satPos, target1);
    pts.push(target1, target4);
    pts.push(target4, target2);
    pts.push(satPos, target2);
    pts.push(target2, target3);
    pts.push(target1, target2);

    return new THREE.BufferGeometry().setFromPoints(pts);
  }, []);

  useFrame((state) => {
    const t = state.clock.getElapsedTime();
    if (nodesGroupRef.current) {
      nodesGroupRef.current.rotation.y = t * 0.01;
    }
    if (pulseRingsRef.current) {
      pulseRingsRef.current.children.forEach((child, i) => {
        const scale = 1 + (Math.sin(t * 2 + i) * 0.5 + 0.5) * 0.4;
        child.scale.set(scale, scale, scale);
      });
    }
  });

  return (
    <group>
      {/* 1. Thin scientific orbital trajectory ellipse */}
      <primitive
        object={
          new THREE.Line(
            lineGeometry,
            new THREE.LineBasicMaterial({
              color: '#38bdf8',
              transparent: true,
              opacity: 0.28,
              linewidth: 1,
            })
          )
        }
        ref={orbitLineRef}
      />

      {/* 2. Constellation Laser Interlinks (Screenshot 2 & 5 style) */}
      <primitive
        object={
          new THREE.LineSegments(
            laserLinksGeometry,
            new THREE.LineDashedMaterial({
              color: '#60a5fa',
              transparent: true,
              opacity: 0.35,
              dashSize: 0.3,
              gapSize: 0.15,
            })
          )
        }
      />

      {/* 3. Constellation Node Beacons */}
      <group ref={nodesGroupRef}>
        {[
          new THREE.Vector3(5.5, 3.2, -3.0),
          new THREE.Vector3(6.8, -0.5, -4.0),
          new THREE.Vector3(4.2, -2.8, -2.5),
          new THREE.Vector3(7.2, 1.8, -5.0),
        ].map((pos, idx) => (
          <group key={`node-beacon-${idx}`} position={pos}>
            {/* Center node point */}
            <mesh>
              <sphereGeometry args={[0.06, 8, 8]} />
              <meshBasicMaterial color="#ffffff" />
            </mesh>
            {/* Outer halo */}
            <mesh>
              <sphereGeometry args={[0.18, 8, 8]} />
              <meshBasicMaterial color="#38bdf8" transparent opacity={0.3} />
            </mesh>
          </group>
        ))}
      </group>

      {/* 4. Active telemetry crosshairs on orbit */}
      {constellationNodes.slice(0, 4).map((node, i) => (
        <group key={node.id} position={node.pos}>
          <mesh>
            <sphereGeometry args={[0.04, 6, 6]} />
            <meshBasicMaterial color="#38bdf8" transparent opacity={0.6} />
          </mesh>
        </group>
      ))}
    </group>
  );
};
