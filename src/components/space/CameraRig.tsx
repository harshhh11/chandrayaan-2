'use client';

import React, { useRef } from 'react';
import { useFrame, useThree } from '@react-three/fiber';
import * as THREE from 'three';

interface CameraRigProps {
  scrollProgress: number;
  mouse: { x: number; y: number };
}

export const CameraRig: React.FC<CameraRigProps> = ({ scrollProgress, mouse }) => {
  const { camera } = useThree();
  const currentLookAt = useRef(new THREE.Vector3(0.6, 0.2, 0));

  // Cinematic 5-stage camera track waypoints
  const waypoints = [
    // 0: HERO ORBITAL VIEW (Matches Screenshots 1, 3, 4)
    {
      progress: 0.0,
      camPos: new THREE.Vector3(0.2, 0.1, 7.6),
      lookAt: new THREE.Vector3(0.8, 0.2, 0),
    },
    // 1: SENSOR & OPTICS CLOSE-UP (OBSERVE)
    {
      progress: 0.25,
      camPos: new THREE.Vector3(2.1, -0.4, 4.2),
      lookAt: new THREE.Vector3(2.3, -0.2, 0.2),
    },
    // 2: SOLAR ARRAY & CONSTELLATION NODES (UNDERSTAND)
    {
      progress: 0.50,
      camPos: new THREE.Vector3(-0.4, 1.4, 5.4),
      lookAt: new THREE.Vector3(0.6, 0.5, -0.4),
    },
    // 3: GLOBAL CURVATURE & HORIZON (INTELLIGENCE)
    {
      progress: 0.75,
      camPos: new THREE.Vector3(-1.4, -0.8, 8.8),
      lookAt: new THREE.Vector3(-1.0, -1.2, -1.5),
    },
    // 4: MISSION GATEWAY & PLATFORM TRANSITION
    {
      progress: 1.0,
      camPos: new THREE.Vector3(0.8, 0.4, 6.6),
      lookAt: new THREE.Vector3(1.2, 0.4, 0),
    },
  ];

  useFrame((_, delta) => {
    // Determine segment between waypoints based on scrollProgress (0 to 1)
    const p = Math.max(0, Math.min(1, scrollProgress));
    
    let segmentIndex = 0;
    for (let i = 0; i < waypoints.length - 1; i++) {
      if (p >= waypoints[i].progress && p <= waypoints[i + 1].progress) {
        segmentIndex = i;
        break;
      }
    }

    const w1 = waypoints[segmentIndex];
    const w2 = waypoints[segmentIndex + 1] || waypoints[segmentIndex];
    const segmentRange = w2.progress - w1.progress || 1;
    const localT = (p - w1.progress) / segmentRange;
    
    // Smooth cosine easing for luxury camera movements
    const easeT = 0.5 - 0.5 * Math.cos(localT * Math.PI);

    // Interpolate target camera position
    const targetCamPos = new THREE.Vector3().lerpVectors(w1.camPos, w2.camPos, easeT);
    const targetLookAt = new THREE.Vector3().lerpVectors(w1.lookAt, w2.lookAt, easeT);

    // Apply subtle mouse parallax
    targetCamPos.x += mouse.x * 0.35;
    targetCamPos.y += mouse.y * 0.25;

    // Smooth dampening towards target (luxury motion damping)
    camera.position.x = THREE.MathUtils.damp(camera.position.x, targetCamPos.x, 3.5, delta);
    camera.position.y = THREE.MathUtils.damp(camera.position.y, targetCamPos.y, 3.5, delta);
    camera.position.z = THREE.MathUtils.damp(camera.position.z, targetCamPos.z, 3.5, delta);

    currentLookAt.current.x = THREE.MathUtils.damp(currentLookAt.current.x, targetLookAt.x, 3.5, delta);
    currentLookAt.current.y = THREE.MathUtils.damp(currentLookAt.current.y, targetLookAt.y, 3.5, delta);
    currentLookAt.current.z = THREE.MathUtils.damp(currentLookAt.current.z, targetLookAt.z, 3.5, delta);

    camera.lookAt(currentLookAt.current);
  });

  return null;
};
