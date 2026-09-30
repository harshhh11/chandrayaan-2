'use client';

import React, { useRef, useMemo } from 'react';
import { useFrame } from '@react-three/fiber';
import * as THREE from 'three';
import { createSolarPanelTexture, createThermalFoilTexture } from '@/lib/textureGenerator';

interface SatelliteProps {
  scrollProgress?: number;
  mouse?: { x: number; y: number };
}

export const Satellite: React.FC<SatelliteProps> = ({ mouse }) => {
  const satelliteGroup = useRef<THREE.Group>(null);
  const solarWingGroup = useRef<THREE.Group>(null);
  const dishRef = useRef<THREE.Group>(null);
  const pulseLightRef = useRef<THREE.PointLight>(null);

  // Textures
  const solarTexture = useMemo(() => createSolarPanelTexture(), []);
  const goldFoilTexture = useMemo(() => createThermalFoilTexture(true), []);
  const silverFoilTexture = useMemo(() => createThermalFoilTexture(false), []);

  // Materials
  const materials = useMemo(() => {
    return {
      solarPanel: new THREE.MeshStandardMaterial({
        map: solarTexture,
        roughness: 0.22,
        metalness: 0.85,
        color: new THREE.Color('#90b4e0'),
        bumpMap: solarTexture,
        bumpScale: 0.02,
      }),
      solarBack: new THREE.MeshStandardMaterial({
        color: new THREE.Color('#151b23'),
        roughness: 0.6,
        metalness: 0.7,
      }),
      busFrame: new THREE.MeshStandardMaterial({
        color: new THREE.Color('#2d3748'),
        metalness: 0.9,
        roughness: 0.25,
      }),
      goldFoil: new THREE.MeshStandardMaterial({
        map: goldFoilTexture,
        color: new THREE.Color('#dfa938'),
        metalness: 0.92,
        roughness: 0.35,
        bumpMap: goldFoilTexture,
        bumpScale: 0.04,
      }),
      silverFoil: new THREE.MeshStandardMaterial({
        map: silverFoilTexture,
        color: new THREE.Color('#d1d5db'),
        metalness: 0.88,
        roughness: 0.3,
      }),
      carbonFiber: new THREE.MeshStandardMaterial({
        color: new THREE.Color('#111827'),
        roughness: 0.5,
        metalness: 0.5,
      }),
      opticsLens: new THREE.MeshPhysicalMaterial({
        color: new THREE.Color('#0369a1'),
        metalness: 0.1,
        roughness: 0.05,
        transmission: 0.8,
        thickness: 0.5,
        ior: 1.52,
        reflectivity: 0.9,
      }),
      goldAntenna: new THREE.MeshStandardMaterial({
        color: new THREE.Color('#eab308'),
        metalness: 0.95,
        roughness: 0.2,
      }),
      emissiveCyan: new THREE.MeshBasicMaterial({
        color: new THREE.Color('#38bdf8'),
      }),
      emissiveGreen: new THREE.MeshBasicMaterial({
        color: new THREE.Color('#4ade80'),
      }),
      thrusterGlow: new THREE.MeshBasicMaterial({
        color: new THREE.Color('#06b6d4'),
      }),
    };
  }, [solarTexture, goldFoilTexture, silverFoilTexture]);

  // Frame animation: Floating inertia, solar alignment, beacon pulsing
  useFrame((state, delta) => {
    if (satelliteGroup.current) {
      const t = state.clock.getElapsedTime();

      // Subtle natural orbital floating wobble
      satelliteGroup.current.position.y = 0.8 + Math.sin(t * 0.4) * 0.08;
      satelliteGroup.current.position.x = 2.4 + Math.cos(t * 0.3) * 0.06;

      // Mouse responsive parallax inertia
      if (mouse) {
        const targetRotX = 0.35 - mouse.y * 0.15;
        const targetRotY = -0.55 + mouse.x * 0.18;
        satelliteGroup.current.rotation.x = THREE.MathUtils.damp(
          satelliteGroup.current.rotation.x,
          targetRotX,
          2.5,
          delta
        );
        satelliteGroup.current.rotation.y = THREE.MathUtils.damp(
          satelliteGroup.current.rotation.y,
          targetRotY,
          2.5,
          delta
        );
      }
    }

    // Slow satellite communication dish tracking
    if (dishRef.current) {
      const t = state.clock.getElapsedTime();
      dishRef.current.rotation.y = Math.sin(t * 0.15) * 0.25;
      dishRef.current.rotation.x = 0.4 + Math.cos(t * 0.2) * 0.1;
    }

    // Beacon light pulse
    if (pulseLightRef.current) {
      const t = state.clock.getElapsedTime();
      pulseLightRef.current.intensity = (Math.sin(t * 3.5) > 0.3 ? 1.5 : 0.1);
    }
  });

  // Construct the multi-segmented solar panel array (5 folding panels)
  const panelCount = 5;
  const panelWidth = 1.1;
  const panelHeight = 2.2;
  const panelGap = 0.08;

  return (
    <group ref={satelliteGroup} position={[2.4, 0.8, 0]} rotation={[0.35, -0.55, 0.18]} scale={[0.92, 0.92, 0.92]}>
      {/* ========================================================
          1. MAIN SPACECRAFT BUS (Avionics & Payload Housing)
          ======================================================== */}
      <group position={[0, 0, 0]}>
        {/* Central Core Chassis */}
        <mesh position={[0, 0, 0]} castShadow receiveShadow>
          <boxGeometry args={[1.5, 3.2, 1.4]} />
          <primitive object={materials.silverFoil} attach="material" />
        </mesh>

        {/* Structural Carbon Frame Rails */}
        <mesh position={[0, 0, 0]}>
          <boxGeometry args={[1.54, 3.24, 1.44]} />
          <primitive object={materials.busFrame} attach="material" />
        </mesh>

        {/* Gold Thermal MLI Blanket Insets */}
        <mesh position={[0.76, 0.4, 0]} rotation={[0, Math.PI / 2, 0]}>
          <planeGeometry args={[1.2, 1.4]} />
          <primitive object={materials.goldFoil} attach="material" />
        </mesh>
        <mesh position={[0.76, -0.8, 0]} rotation={[0, Math.PI / 2, 0]}>
          <planeGeometry args={[1.2, 1.0]} />
          <primitive object={materials.goldFoil} attach="material" />
        </mesh>

        {/* Radiator Panels with cooling fins */}
        <mesh position={[-0.76, 0, 0]} rotation={[0, -Math.PI / 2, 0]}>
          <boxGeometry args={[1.2, 2.8, 0.05]} />
          <primitive object={materials.busFrame} attach="material" />
        </mesh>

        {/* ========================================================
            2. HIGH-RESOLUTION OPTICAL / SAR SENSOR PAYLOAD (Earth facing)
            ======================================================== */}
        {/* Main Primary Optical Telescope Aperture */}
        <group position={[0, -1.65, 0.2]} rotation={[Math.PI / 2, 0, 0]}>
          {/* Telescope Housing Barrel */}
          <mesh castShadow>
            <cylinderGeometry args={[0.52, 0.58, 0.9, 32]} />
            <primitive object={materials.busFrame} attach="material" />
          </mesh>
          {/* Bezel Ring */}
          <mesh position={[0, -0.46, 0]}>
            <torusGeometry args={[0.52, 0.05, 16, 32]} />
            <primitive object={materials.goldAntenna} attach="material" />
          </mesh>
          {/* Primary Optical Glass Lens */}
          <mesh position={[0, -0.42, 0]}>
            <circleGeometry args={[0.48, 32]} />
            <primitive object={materials.opticsLens} attach="material" />
          </mesh>

          {/* Secondary Hyperspectral Sensor Pod */}
          <mesh position={[0.65, -0.2, 0]}>
            <cylinderGeometry args={[0.22, 0.24, 0.6, 24]} />
            <primitive object={materials.silverFoil} attach="material" />
          </mesh>
          <mesh position={[0.65, -0.51, 0]}>
            <circleGeometry args={[0.2, 24]} />
            <primitive object={materials.opticsLens} attach="material" />
          </mesh>

          {/* Star Tracker Dual Navigation Cameras */}
          <mesh position={[-0.6, -0.1, 0.4]} rotation={[0.2, 0.2, 0]}>
            <cylinderGeometry args={[0.12, 0.14, 0.35, 16]} />
            <primitive object={materials.busFrame} attach="material" />
          </mesh>
          <mesh position={[-0.6, -0.1, -0.4]} rotation={[-0.2, 0.2, 0]}>
            <cylinderGeometry args={[0.12, 0.14, 0.35, 16]} />
            <primitive object={materials.busFrame} attach="material" />
          </mesh>
        </group>

        {/* ========================================================
            3. HIGH-GAIN COMMUNICATION DISH & TELEMETRY BOOMS
            ======================================================== */}
        <group ref={dishRef} position={[0.85, 1.1, 0.4]} rotation={[0.4, 0.5, 0]}>
          {/* Gimbal Arm Joint */}
          <mesh position={[0, 0, 0]}>
            <cylinderGeometry args={[0.06, 0.06, 0.4, 16]} />
            <primitive object={materials.busFrame} attach="material" />
          </mesh>
          {/* Parabolic Antenna Dish Reflector */}
          <mesh position={[0.3, 0.25, 0]} rotation={[0, 0, -Math.PI / 4]} castShadow>
            <sphereGeometry args={[0.65, 32, 16, 0, Math.PI * 2, 0, Math.PI * 0.35]} />
            <primitive object={materials.goldAntenna} attach="material" />
          </mesh>
          {/* Feed Horn */}
          <mesh position={[0.45, 0.4, 0]} rotation={[0, 0, -Math.PI / 4]}>
            <coneGeometry args={[0.08, 0.3, 16]} />
            <primitive object={materials.busFrame} attach="material" />
          </mesh>
        </group>

        {/* Long Telemetry Antenna Mast */}
        <group position={[-0.75, 1.4, -0.4]} rotation={[-0.3, 0, 0.4]}>
          <mesh>
            <cylinderGeometry args={[0.015, 0.025, 2.2, 12]} />
            <primitive object={materials.busFrame} attach="material" />
          </mesh>
          <mesh position={[0, 1.1, 0]}>
            <sphereGeometry args={[0.05, 12, 12]} />
            <primitive object={materials.emissiveCyan} attach="material" />
          </mesh>
        </group>

        {/* ========================================================
            4. RCS ATTITUDE THRUSTERS & ION ENGINE
            ======================================================== */}
        {/* Ion Propulsion Thruster with Cyan Glow Nozzle */}
        <group position={[0, 1.65, 0]} rotation={[Math.PI, 0, 0]}>
          <mesh>
            <cylinderGeometry args={[0.35, 0.25, 0.45, 24]} />
            <primitive object={materials.busFrame} attach="material" />
          </mesh>
          {/* Thruster Plume Core */}
          <mesh position={[0, 0.25, 0]}>
            <cylinderGeometry args={[0.22, 0.02, 0.6, 16]} />
            <primitive object={materials.thrusterGlow} attach="material" />
          </mesh>
        </group>

        {/* 4 Corner RCS Quad Thruster Blocks */}
        {[-0.8, 0.8].map((x, i) =>
          [-1.4, 1.4].map((y, j) => (
            <group key={`rcs-${i}-${j}`} position={[x, y, 0]}>
              <mesh>
                <boxGeometry args={[0.15, 0.15, 0.15]} />
                <primitive object={materials.busFrame} attach="material" />
              </mesh>
              {/* Micro thruster nozzles */}
              <mesh position={[x > 0 ? 0.1 : -0.1, 0, 0]} rotation={[0, 0, x > 0 ? -Math.PI / 2 : Math.PI / 2]}>
                <coneGeometry args={[0.04, 0.09, 8]} />
                <primitive object={materials.goldAntenna} attach="material" />
              </mesh>
            </group>
          ))
        )}

        {/* ========================================================
            5. STATUS BEACONS & TECHNICAL LIGHTING
            ======================================================== */}
        {/* Flashing Navigation Beacon */}
        <mesh position={[0, 1.62, 0.7]}>
          <sphereGeometry args={[0.04, 12, 12]} />
          <primitive object={materials.emissiveGreen} attach="material" />
        </mesh>
        <pointLight ref={pulseLightRef} position={[0, 1.62, 0.7]} color="#4ade80" intensity={1.2} distance={3} />

        {/* Data Link Indicator */}
        <mesh position={[0.76, 0, 0.6]}>
          <sphereGeometry args={[0.03, 8, 8]} />
          <primitive object={materials.emissiveCyan} attach="material" />
        </mesh>
      </group>

      {/* ========================================================
          6. LARGE MULTI-SEGMENT SOLAR WING ARRAY (Reference Match)
          ======================================================== */}
      {/* Left Wing Extension (Extending outwards diagonally like in reel) */}
      <group ref={solarWingGroup} position={[-0.8, 0.1, 0]} rotation={[0, 0, 0.08]}>
        {/* Main Root Yoke & Boom Truss */}
        <mesh position={[-0.45, 0, 0]} rotation={[0, 0, Math.PI / 2]}>
          <cylinderGeometry args={[0.06, 0.06, 0.9, 16]} />
          <primitive object={materials.carbonFiber} attach="material" />
        </mesh>
        <mesh position={[-0.88, 0, 0]}>
          <boxGeometry args={[0.15, 0.25, 0.15]} />
          <primitive object={materials.busFrame} attach="material" />
        </mesh>

        {/* 5 Folding Solar Panel Segments */}
        {Array.from({ length: panelCount }).map((_, idx) => {
          const panelX = -1.0 - (idx * (panelWidth + panelGap)) - (panelWidth / 2);
          return (
            <group key={`panel-${idx}`} position={[panelX, 0, 0]}>
              {/* Front Solar Cell Plate */}
              <mesh position={[0, 0, 0.02]} castShadow receiveShadow>
                <boxGeometry args={[panelWidth, panelHeight, 0.03]} />
                <primitive object={materials.solarPanel} attach="material" />
              </mesh>

              {/* Backside Dark Shield */}
              <mesh position={[0, 0, -0.015]}>
                <boxGeometry args={[panelWidth, panelHeight, 0.03]} />
                <primitive object={materials.solarBack} attach="material" />
              </mesh>

              {/* Panel Edge Framing */}
              <mesh position={[0, 0, 0]}>
                <boxGeometry args={[panelWidth + 0.02, panelHeight + 0.02, 0.04]} />
                <primitive object={materials.busFrame} attach="material" />
              </mesh>

              {/* Inter-Panel Gold Hinges */}
              {idx < panelCount - 1 && (
                <group position={[-(panelWidth / 2) - (panelGap / 2), 0, 0]}>
                  <mesh position={[0, 0.6, 0]}>
                    <cylinderGeometry args={[0.035, 0.035, 0.18, 12]} />
                    <primitive object={materials.goldAntenna} attach="material" />
                  </mesh>
                  <mesh position={[0, -0.6, 0]}>
                    <cylinderGeometry args={[0.035, 0.035, 0.18, 12]} />
                    <primitive object={materials.goldAntenna} attach="material" />
                  </mesh>
                </group>
              )}
            </group>
          );
        })}
      </group>
    </group>
  );
};
