'use client';

import React, { useEffect, useRef } from 'react';
import * as THREE from 'three';
import { createEarthTextures, createSolarPanelTexture, createThermalFoilTexture } from '@/lib/textureGenerator';

interface SpaceSceneProps {
  scrollProgress: number;
}

export const SpaceScene: React.FC<SpaceSceneProps> = ({ scrollProgress }) => {
  const containerRef = useRef<HTMLDivElement>(null);
  const scrollRef = useRef(scrollProgress);
  scrollRef.current = scrollProgress;

  useEffect(() => {
    if (!containerRef.current) return;

    // ========================================================
    // 1. THREE.JS SCENE, CAMERA, HIGH-DYNAMIC RENDERER
    // ========================================================
    const scene = new THREE.Scene();
    scene.background = new THREE.Color('#02040a');

    const camera = new THREE.PerspectiveCamera(
      38,
      window.innerWidth / window.innerHeight,
      0.1,
      1000
    );
    // Initial camera position for the giant diagonal composition
    camera.position.set(0.0, 0.0, 7.2);

    const renderer = new THREE.WebGLRenderer({
      antialias: true,
      alpha: true,
      powerPreference: 'high-performance',
    });
    renderer.setSize(window.innerWidth, window.innerHeight);
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
    renderer.toneMapping = THREE.ACESFilmicToneMapping;
    renderer.toneMappingExposure = 1.35;
    renderer.shadowMap.enabled = true;
    renderer.shadowMap.type = THREE.PCFSoftShadowMap;

    containerRef.current.appendChild(renderer.domElement);

    // ========================================================
    // 2. LIGHTING SETUP (Direct Space Sun + Earth Albedo Rim)
    // ========================================================
    const ambientLight = new THREE.AmbientLight(0x0c1e38, 0.25);
    scene.add(ambientLight);

    // High intensity direct Sunlight from top-right / front
    const sunLight = new THREE.DirectionalLight(0xffffff, 4.0);
    sunLight.position.set(16, 14, 8);
    sunLight.castShadow = true;
    sunLight.shadow.mapSize.width = 2048;
    sunLight.shadow.mapSize.height = 2048;
    scene.add(sunLight);

    // Brilliant Electric Blue Earth Albedo Bounce Light (from lower left)
    const earthAlbedo = new THREE.DirectionalLight(0x38bdf8, 2.2);
    earthAlbedo.position.set(-10, -8, -3);
    scene.add(earthAlbedo);

    // Backside Rim Light for solar panel edge highlights
    const rimLight = new THREE.DirectionalLight(0x60a5fa, 1.2);
    rimLight.position.set(-14, 6, -10);
    scene.add(rimLight);

    // ========================================================
    // 3. EARTH GLOBE & RADIANT ATMOSPHERIC HORIZON
    // ========================================================
    const earthGroup = new THREE.Group();
    // Position Earth in the lower left background to match screenshot horizon
    earthGroup.position.set(-9.2, -6.8, -7.5);
    earthGroup.rotation.set(0.35, 0.45, -0.25);
    scene.add(earthGroup);

    const { dayMap, specMap, cloudsMap, nightMap } = createEarthTextures();

    // Solid Earth sphere
    const earthMat = new THREE.MeshStandardMaterial({
      map: dayMap || undefined,
      roughness: 0.4,
      metalness: 0.15,
      roughnessMap: specMap || undefined,
      emissiveMap: nightMap || undefined,
      emissive: new THREE.Color('#ffcc77'),
      emissiveIntensity: 0.9,
    });
    const earthMesh = new THREE.Mesh(new THREE.SphereGeometry(12.0, 64, 64), earthMat);
    earthMesh.receiveShadow = true;
    earthGroup.add(earthMesh);

    // Atmospheric Cloud Swirls
    const cloudsMat = new THREE.MeshStandardMaterial({
      map: cloudsMap || undefined,
      transparent: true,
      opacity: 0.85,
      blending: THREE.AdditiveBlending,
      depthWrite: false,
    });
    const cloudsMesh = new THREE.Mesh(new THREE.SphereGeometry(12.08, 64, 64), cloudsMat);
    earthGroup.add(cloudsMesh);

    // Radiant Rayleigh Atmospheric Scattering Shader (Electric Blue Horizon Glow)
    const atmosphereMat = new THREE.ShaderMaterial({
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
          gl_FragColor = vec4(uColor, atmosphere);
        }
      `,
      uniforms: {
        uColor: { value: new THREE.Color('#38bdf8') },
        uIntensity: { value: 1.8 },
        uPower: { value: 2.5 },
      },
      blending: THREE.AdditiveBlending,
      side: THREE.BackSide,
      transparent: true,
      depthWrite: false,
    });
    const atmosphereMesh = new THREE.Mesh(new THREE.SphereGeometry(13.2, 64, 64), atmosphereMat);
    earthGroup.add(atmosphereMesh);

    // Inner Horizon Atmospheric Rim
    const innerAtmoMat = new THREE.ShaderMaterial({
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
          gl_FragColor = vec4(uColor, atmosphere);
        }
      `,
      uniforms: {
        uColor: { value: new THREE.Color('#60a5fa') },
        uIntensity: { value: 1.1 },
        uPower: { value: 3.8 },
      },
      blending: THREE.AdditiveBlending,
      side: THREE.FrontSide,
      transparent: true,
      depthWrite: false,
    });
    const innerAtmoMesh = new THREE.Mesh(new THREE.SphereGeometry(12.12, 64, 64), innerAtmoMat);
    earthGroup.add(innerAtmoMesh);

    // ========================================================
    // 4. GIANT SATELLITE WITH ACCORDION FOLDING SOLAR WING
    // (Exact Match to Reference Screenshots 2 & 3)
    // ========================================================
    const satGroup = new THREE.Group();
    // Position satellite dramatically across the upper-center to lower-right
    satGroup.position.set(1.4, 0.4, 0.2);
    satGroup.rotation.set(0.38, -0.62, 0.22);
    satGroup.scale.set(1.35, 1.35, 1.35); // Enormous cinematic scale
    scene.add(satGroup);

    const solarTexture = createSolarPanelTexture();
    const goldFoilTexture = createThermalFoilTexture(true);
    const silverFoilTexture = createThermalFoilTexture(false);

    // High quality metallic materials
    const solarMat = new THREE.MeshStandardMaterial({
      map: solarTexture || undefined,
      roughness: 0.18,
      metalness: 0.9,
      color: new THREE.Color('#a5c8f5'),
      bumpMap: solarTexture || undefined,
      bumpScale: 0.03,
    });
    const solarBackMat = new THREE.MeshStandardMaterial({
      color: new THREE.Color('#0f172a'),
      roughness: 0.5,
      metalness: 0.8,
    });
    const frameMat = new THREE.MeshStandardMaterial({
      color: new THREE.Color('#334155'),
      metalness: 0.92,
      roughness: 0.2,
    });
    const goldFoilMat = new THREE.MeshStandardMaterial({
      map: goldFoilTexture || undefined,
      color: new THREE.Color('#e5ad35'),
      metalness: 0.94,
      roughness: 0.3,
      bumpMap: goldFoilTexture || undefined,
      bumpScale: 0.04,
    });
    const silverFoilMat = new THREE.MeshStandardMaterial({
      map: silverFoilTexture || undefined,
      color: new THREE.Color('#cbd5e1'),
      metalness: 0.9,
      roughness: 0.28,
    });
    const goldHardwareMat = new THREE.MeshStandardMaterial({
      color: new THREE.Color('#fbbf24'),
      metalness: 0.98,
      roughness: 0.15,
    });
    const opticsLensMat = new THREE.MeshPhysicalMaterial({
      color: new THREE.Color('#0284c7'),
      metalness: 0.1,
      roughness: 0.02,
      transmission: 0.85,
      thickness: 0.6,
      ior: 1.55,
      reflectivity: 0.95,
    });
    const emissiveCyanMat = new THREE.MeshBasicMaterial({ color: new THREE.Color('#38bdf8') });
    const emissiveGreenMat = new THREE.MeshBasicMaterial({ color: new THREE.Color('#4ade80') });

    // 4.1 Main Spacecraft Chassis (Bus on the Right)
    const busGroup = new THREE.Group();
    busGroup.position.set(1.2, -0.4, 0);
    satGroup.add(busGroup);

    const busChassis = new THREE.Mesh(new THREE.BoxGeometry(1.6, 3.4, 1.5), silverFoilMat);
    busChassis.castShadow = true;
    busChassis.receiveShadow = true;
    busGroup.add(busChassis);

    // Frame Border
    const busFrame = new THREE.Mesh(new THREE.BoxGeometry(1.64, 3.44, 1.54), frameMat);
    busGroup.add(busFrame);

    // Gold Thermal Blanket Panels
    const goldPanel1 = new THREE.Mesh(new THREE.PlaneGeometry(1.3, 1.5), goldFoilMat);
    goldPanel1.position.set(0.83, 0.45, 0);
    goldPanel1.rotation.set(0, Math.PI / 2, 0);
    busGroup.add(goldPanel1);

    const goldPanel2 = new THREE.Mesh(new THREE.PlaneGeometry(1.3, 1.1), goldFoilMat);
    goldPanel2.position.set(0.83, -0.85, 0);
    goldPanel2.rotation.set(0, Math.PI / 2, 0);
    busGroup.add(goldPanel2);

    // 4.2 Primary Telescope & Hyperspectral Payload (Earth-facing bottom)
    const payloadGroup = new THREE.Group();
    payloadGroup.position.set(0, -1.75, 0.2);
    payloadGroup.rotation.set(Math.PI / 2, 0, 0);
    busGroup.add(payloadGroup);

    const barrel = new THREE.Mesh(new THREE.CylinderGeometry(0.55, 0.62, 1.0, 32), frameMat);
    barrel.castShadow = true;
    payloadGroup.add(barrel);

    const lensRing = new THREE.Mesh(new THREE.TorusGeometry(0.55, 0.05, 16, 32), goldHardwareMat);
    lensRing.position.set(0, -0.51, 0);
    payloadGroup.add(lensRing);

    const lens = new THREE.Mesh(new THREE.CircleGeometry(0.52, 32), opticsLensMat);
    lens.position.set(0, -0.48, 0);
    payloadGroup.add(lens);

    // Star Tracker Dual Cameras
    const starTracker1 = new THREE.Mesh(new THREE.CylinderGeometry(0.12, 0.15, 0.4, 16), frameMat);
    starTracker1.position.set(0.65, -0.2, 0.5);
    starTracker1.rotation.set(0.3, 0.2, 0);
    payloadGroup.add(starTracker1);

    // 4.3 High-Gain Parabolic Communications Dish
    const dishGroup = new THREE.Group();
    dishGroup.position.set(0.9, 1.2, 0.4);
    dishGroup.rotation.set(0.4, 0.5, 0);
    busGroup.add(dishGroup);

    const dish = new THREE.Mesh(
      new THREE.SphereGeometry(0.7, 32, 16, 0, Math.PI * 2, 0, Math.PI * 0.36),
      goldHardwareMat
    );
    dish.position.set(0.35, 0.3, 0);
    dish.rotation.set(0, 0, -Math.PI / 4);
    dish.castShadow = true;
    dishGroup.add(dish);

    // 4.4 Status Beacons
    const beacon = new THREE.Mesh(new THREE.SphereGeometry(0.05, 12, 12), emissiveGreenMat);
    beacon.position.set(0, 1.72, 0.75);
    busGroup.add(beacon);

    const beaconLight = new THREE.PointLight(0x4ade80, 1.5, 4);
    beaconLight.position.set(0, 1.72, 0.75);
    busGroup.add(beaconLight);

    // 4.5 ACCORDION ZIG-ZAG FOLDING SOLAR ARRAY (Exact Match to Screenshot 2 & 3)
    const solarWingGroup = new THREE.Group();
    solarWingGroup.position.set(-0.85, 0.1, 0);
    satGroup.add(solarWingGroup);

    const panelCount = 7;
    const panelWidth = 0.95;
    const panelHeight = 2.4;
    const foldAngle = 0.22; // ~12.5 degrees accordion fold for sharp corrugated steps

    let currentX = 0;
    let currentZ = 0;

    for (let i = 0; i < panelCount; i++) {
      const isFoldForward = i % 2 === 0;
      const angleY = isFoldForward ? foldAngle : -foldAngle;

      const pGroup = new THREE.Group();
      pGroup.position.set(currentX - panelWidth / 2, 0, currentZ);
      pGroup.rotation.set(0, angleY, 0);

      // Front Photovoltaic Silicon Cell Plate
      const pFront = new THREE.Mesh(new THREE.BoxGeometry(panelWidth, panelHeight, 0.03), solarMat);
      pFront.position.set(0, 0, 0.018);
      pFront.castShadow = true;
      pFront.receiveShadow = true;
      pGroup.add(pFront);

      // Back Carbon Composite Substrate
      const pBack = new THREE.Mesh(new THREE.BoxGeometry(panelWidth, panelHeight, 0.03), solarBackMat);
      pBack.position.set(0, 0, -0.018);
      pGroup.add(pBack);

      // Frame Rail
      const pFrame = new THREE.Mesh(new THREE.BoxGeometry(panelWidth + 0.02, panelHeight + 0.02, 0.045), frameMat);
      pGroup.add(pFrame);

      // Gold Stepped Hinge Joint
      const hingeTop = new THREE.Mesh(new THREE.CylinderGeometry(0.04, 0.04, 0.22, 12), goldHardwareMat);
      hingeTop.position.set(-panelWidth / 2, 0.8, 0);
      pGroup.add(hingeTop);

      const hingeBot = new THREE.Mesh(new THREE.CylinderGeometry(0.04, 0.04, 0.22, 12), goldHardwareMat);
      hingeBot.position.set(-panelWidth / 2, -0.8, 0);
      pGroup.add(hingeBot);

      solarWingGroup.add(pGroup);

      // Advance accordion coordinate
      currentX -= panelWidth * Math.cos(foldAngle);
      currentZ += (isFoldForward ? 1 : -1) * panelWidth * Math.sin(foldAngle);
    }

    // ========================================================
    // 5. ORBITAL PATH & CONSTELLATION INTER-SATELLITE LINKS
    // ========================================================
    const orbitPts: THREE.Vector3[] = [];
    for (let i = 0; i <= 180; i++) {
      const theta = (i / 180) * Math.PI * 2;
      const x = Math.cos(theta) * 13.5 - 9.2;
      const y = Math.sin(theta) * 11.8 * 0.7 - 6.8;
      const z = Math.sin(theta) * 6.8 - 6.5;
      orbitPts.push(new THREE.Vector3(x, y, z));
    }
    const orbitLine = new THREE.Line(
      new THREE.BufferGeometry().setFromPoints(orbitPts),
      new THREE.LineBasicMaterial({ color: '#38bdf8', transparent: true, opacity: 0.3 })
    );
    scene.add(orbitLine);

    // Constellation Laser Links (Screenshot 1 & 2 Style)
    const laserPts = [
      new THREE.Vector3(2.2, 0.4, 0.2),
      new THREE.Vector3(5.8, 2.8, -2.5),
      new THREE.Vector3(5.8, 2.8, -2.5),
      new THREE.Vector3(7.4, 1.2, -4.5),
      new THREE.Vector3(7.4, 1.2, -4.5),
      new THREE.Vector3(6.5, -1.2, -3.5),
      new THREE.Vector3(2.2, 0.4, 0.2),
      new THREE.Vector3(6.5, -1.2, -3.5),
      new THREE.Vector3(6.5, -1.2, -3.5),
      new THREE.Vector3(4.0, -3.2, -2.0),
    ];
    const laserMesh = new THREE.LineSegments(
      new THREE.BufferGeometry().setFromPoints(laserPts),
      new THREE.LineBasicMaterial({ color: '#60a5fa', transparent: true, opacity: 0.35 })
    );
    scene.add(laserMesh);

    // Node Beacons
    [
      new THREE.Vector3(5.8, 2.8, -2.5),
      new THREE.Vector3(7.4, 1.2, -4.5),
      new THREE.Vector3(6.5, -1.2, -3.5),
      new THREE.Vector3(4.0, -3.2, -2.0),
    ].forEach((pos) => {
      const nodeG = new THREE.Group();
      nodeG.position.copy(pos);
      const dot = new THREE.Mesh(new THREE.SphereGeometry(0.06, 8, 8), new THREE.MeshBasicMaterial({ color: '#ffffff' }));
      const halo = new THREE.Mesh(new THREE.SphereGeometry(0.18, 8, 8), new THREE.MeshBasicMaterial({ color: '#38bdf8', transparent: true, opacity: 0.35 }));
      nodeG.add(dot);
      nodeG.add(halo);
      scene.add(nodeG);
    });

    // ========================================================
    // 6. DEEP SPACE STARFIELD
    // ========================================================
    const starCount = 1000;
    const starPos = new Float32Array(starCount * 3);
    const starCol = new Float32Array(starCount * 3);
    for (let i = 0; i < starCount; i++) {
      const theta = Math.random() * Math.PI * 2;
      const phi = Math.acos(Math.random() * 2 - 1);
      const dist = 70 + Math.random() * 90;
      starPos[i * 3] = dist * Math.sin(phi) * Math.cos(theta);
      starPos[i * 3 + 1] = dist * Math.sin(phi) * Math.sin(theta);
      starPos[i * 3 + 2] = dist * Math.cos(phi);

      const temp = Math.random();
      if (temp > 0.85) {
        starCol[i * 3] = 0.75;
        starCol[i * 3 + 1] = 0.88;
        starCol[i * 3 + 2] = 1.0;
      } else {
        const b = 0.4 + Math.random() * 0.6;
        starCol[i * 3] = b;
        starCol[i * 3 + 1] = b;
        starCol[i * 3 + 2] = b;
      }
    }
    const starGeom = new THREE.BufferGeometry();
    starGeom.setAttribute('position', new THREE.BufferAttribute(starPos, 3));
    starGeom.setAttribute('color', new THREE.BufferAttribute(starCol, 3));
    const starPoints = new THREE.Points(
      starGeom,
      new THREE.PointsMaterial({ size: 1.1, vertexColors: true, transparent: true, opacity: 0.8, sizeAttenuation: false })
    );
    scene.add(starPoints);

    // ========================================================
    // 7. MOUSE PARALLAX & CINEMATIC WAYPOINTS
    // ========================================================
    let mouseX = 0;
    let mouseY = 0;
    const handleMouseMove = (e: MouseEvent) => {
      mouseX = (e.clientX / window.innerWidth) * 2 - 1;
      mouseY = -(e.clientY / window.innerHeight) * 2 + 1;
    };
    window.addEventListener('mousemove', handleMouseMove);

    // Waypoints matching the reel camera trajectory:
    // 0.0: Hero wide diagonal composition (Screenshots 2 & 3)
    // 0.30: Close-up on Spacecraft Avionics & AI Chip (Screenshot 1)
    // 0.60: Sweep along Accordion Solar Panels & Constellation Links
    // 0.85: Planetary Earth Horizon & Global Coverage
    // 1.00: Mission Terminal Gateway
    const waypoints = [
      { progress: 0.0, camPos: new THREE.Vector3(0.0, 0.0, 7.2), lookAt: new THREE.Vector3(0.6, 0.1, 0) },
      { progress: 0.30, camPos: new THREE.Vector3(2.4, -0.3, 3.6), lookAt: new THREE.Vector3(2.5, -0.2, 0.2) },
      { progress: 0.60, camPos: new THREE.Vector3(-0.6, 1.2, 4.8), lookAt: new THREE.Vector3(0.4, 0.4, -0.3) },
      { progress: 0.85, camPos: new THREE.Vector3(-1.8, -0.8, 8.2), lookAt: new THREE.Vector3(-1.2, -1.0, -1.5) },
      { progress: 1.00, camPos: new THREE.Vector3(0.6, 0.3, 6.2), lookAt: new THREE.Vector3(1.0, 0.3, 0) },
    ];

    const currentLookAt = new THREE.Vector3(0.6, 0.1, 0);

    // ========================================================
    // 8. RENDER LOOP (60-120 FPS Cinematic Inertia)
    // ========================================================
    let reqId: number;
    const clock = new THREE.Clock();

    const animate = () => {
      reqId = requestAnimationFrame(animate);
      const delta = clock.getDelta();
      const t = clock.getElapsedTime();

      // Earth & Cloud slow atmospheric drift
      earthMesh.rotation.y += delta * 0.012;
      cloudsMesh.rotation.y += delta * 0.018;

      // Subtle satellite floating inertia
      satGroup.position.y = 0.4 + Math.sin(t * 0.35) * 0.06;
      satGroup.position.x = 1.4 + Math.cos(t * 0.25) * 0.05;
      satGroup.rotation.x = THREE.MathUtils.damp(satGroup.rotation.x, 0.38 - mouseY * 0.12, 2.0, delta);
      satGroup.rotation.y = THREE.MathUtils.damp(satGroup.rotation.y, -0.62 + mouseX * 0.15, 2.0, delta);

      dishGroup.rotation.y = Math.sin(t * 0.12) * 0.22;
      dishGroup.rotation.x = 0.4 + Math.cos(t * 0.18) * 0.08;
      beaconLight.intensity = Math.sin(t * 3.5) > 0.3 ? 1.5 : 0.1;

      // Camera Interpolation based on Scroll
      const p = Math.max(0, Math.min(1, scrollRef.current));
      let segIdx = 0;
      for (let i = 0; i < waypoints.length - 1; i++) {
        if (p >= waypoints[i].progress && p <= waypoints[i + 1].progress) {
          segIdx = i;
          break;
        }
      }
      const w1 = waypoints[segIdx];
      const w2 = waypoints[segIdx + 1] || waypoints[segIdx];
      const segRange = w2.progress - w1.progress || 1;
      const localT = (p - w1.progress) / segRange;
      const easeT = 0.5 - 0.5 * Math.cos(localT * Math.PI);

      const targetCamPos = new THREE.Vector3().lerpVectors(w1.camPos, w2.camPos, easeT);
      const targetLookAt = new THREE.Vector3().lerpVectors(w1.lookAt, w2.lookAt, easeT);

      // Subtle mouse parallax
      targetCamPos.x += mouseX * 0.3;
      targetCamPos.y += mouseY * 0.2;

      camera.position.x = THREE.MathUtils.damp(camera.position.x, targetCamPos.x, 3.5, delta);
      camera.position.y = THREE.MathUtils.damp(camera.position.y, targetCamPos.y, 3.5, delta);
      camera.position.z = THREE.MathUtils.damp(camera.position.z, targetCamPos.z, 3.5, delta);

      currentLookAt.x = THREE.MathUtils.damp(currentLookAt.x, targetLookAt.x, 3.5, delta);
      currentLookAt.y = THREE.MathUtils.damp(currentLookAt.y, targetLookAt.y, 3.5, delta);
      currentLookAt.z = THREE.MathUtils.damp(currentLookAt.z, targetLookAt.z, 3.5, delta);

      camera.lookAt(currentLookAt);

      renderer.render(scene, camera);
    };

    animate();

    const handleResize = () => {
      camera.aspect = window.innerWidth / window.innerHeight;
      camera.updateProjectionMatrix();
      renderer.setSize(window.innerWidth, window.innerHeight);
    };
    window.addEventListener('resize', handleResize);

    return () => {
      cancelAnimationFrame(reqId);
      window.removeEventListener('mousemove', handleMouseMove);
      window.removeEventListener('resize', handleResize);
      if (containerRef.current && renderer.domElement) {
        containerRef.current.removeChild(renderer.domElement);
      }
      renderer.dispose();
    };
  }, []);

  return <div ref={containerRef} className="fixed inset-0 w-full h-full pointer-events-none z-0" />;
};
