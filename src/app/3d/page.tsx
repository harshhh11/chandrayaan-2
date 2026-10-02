'use client';

import React, { useState, useEffect, useRef, useMemo } from 'react';
import Link from 'next/link';
import * as THREE from 'three';
import { 
  Globe, Compass, Layers, Crosshair, Orbit, 
  Database, GitCompare, Maximize2, ShieldCheck, MapPin, 
  RotateCw, ZoomIn, ZoomOut, ArrowLeft, Sun, Eye, Activity,
  Sliders, Play, Pause, ChevronRight, Download, Sparkles, Navigation,
  Terminal, SlidersHorizontal, Focus, RefreshCw, Cpu, Radio, Shield, CornerDownRight
} from 'lucide-react';
import { EdolusTopNav } from '@/components/layout/EdolusTopNav';

interface LunarTarget {
  id: string;
  code: string;
  name: string;
  lat: number;
  lon: number;
  latStr: string;
  lonStr: string;
  elevation: string;
  depth: string;
  diameter: string;
  incidence: string;
  phaseAngle: string;
  instruments: string;
  sensorResolution: string;
  footprintId: string;
  description: string;
  rimWest: string;
  floorDepth: string;
  rimEast: string;
  color: string;
}

const TARGETS: LunarTarget[] = [
  {
    id: 'T1',
    code: 'BOGUSLAWSKY-01',
    name: 'BOGUSLAWSKY E CRATER',
    lat: -74.32,
    lon: 53.64,
    latStr: '74.32° S',
    lonStr: '53.64° E',
    elevation: '-3,240 m',
    depth: '3.8 km',
    diameter: '14.2 km',
    incidence: '61.4°',
    phaseAngle: '44.8°',
    instruments: 'OHRC 0.25m / TMC-2 / IIRS',
    sensorResolution: '0.25 m/px',
    footprintId: 'ch2_ohr_ncp_20250417T081230_d_img_d18',
    description: 'High-priority benchmark calibration site with multi-scale optical coverage and meter-scale boulder clusters.',
    rimWest: '+1.2 km',
    floorDepth: '-3.2 km',
    rimEast: '+1.4 km',
    color: '#00F0FF'
  },
  {
    id: 'T2',
    code: 'SHIV-SHAKTI-02',
    name: 'SHIV SHAKTI POINT (CH-3)',
    lat: -69.37,
    lon: 32.35,
    latStr: '69.37° S',
    lonStr: '32.35° E',
    elevation: '-1,820 m',
    depth: '1.2 km',
    diameter: 'Locus',
    incidence: '58.2°',
    phaseAngle: '39.6°',
    instruments: 'OHRC 0.25m / TMC-2 Stereo',
    sensorResolution: '0.25 m/px',
    footprintId: 'ch2_ohr_ncp_20250823T124500_d_img_d18',
    description: 'Chandrayaan-3 landing touchdown locus with multi-temporal pre- and post-landing high-res registration.',
    rimWest: '+0.4 km',
    floorDepth: '-1.8 km',
    rimEast: '+0.6 km',
    color: '#32D39A'
  },
  {
    id: 'T3',
    code: 'TYCHO-PEAK-03',
    name: 'TYCHO CRATER CENTRAL PEAK',
    lat: -43.35,
    lon: -11.36,
    latStr: '43.35° S',
    lonStr: '11.36° W',
    elevation: '+1,480 m',
    depth: '4.8 km',
    diameter: '85.0 km',
    incidence: '42.1°',
    phaseAngle: '28.3°',
    instruments: 'TMC-2 Triplet Stereo',
    sensorResolution: '5.0 m/px',
    footprintId: 'ch2_tmc_ndn_20250215T043000_d_img_d18',
    description: 'Copernican-age impact structure with central peak uplift and high-albedo ejecta ray systems.',
    rimWest: '+2.1 km',
    floorDepth: '-4.8 km',
    rimEast: '+2.4 km',
    color: '#FFB547'
  },
  {
    id: 'T4',
    code: 'SHACKLETON-04',
    name: 'SHACKLETON CRATER RIM',
    lat: -89.90,
    lon: 0.00,
    latStr: '89.90° S',
    lonStr: '0.00° E',
    elevation: '+1,200 m',
    depth: '4.2 km',
    diameter: '21.0 km',
    incidence: '88.5°',
    phaseAngle: '86.1°',
    instruments: 'IIRS Hyperspectral / DFRS',
    sensorResolution: '2.0 m/px',
    footprintId: 'ch2_iir_swr_20250110T192000_d_img_d18',
    description: 'Permanently shadowed south polar cold trap preserving cryogenic water-ice and volatiles.',
    rimWest: '+1.2 km',
    floorDepth: '-4.2 km',
    rimEast: '+1.1 km',
    color: '#A78BFA'
  },
  {
    id: 'T5',
    code: 'COPERNICUS-05',
    name: 'COPERNICUS CRATER',
    lat: 9.62,
    lon: -20.08,
    latStr: '9.62° N',
    lonStr: '20.08° W',
    elevation: '-3,800 m',
    depth: '3.8 km',
    diameter: '93.0 km',
    incidence: '35.0°',
    phaseAngle: '22.4°',
    instruments: 'OHRC 0.25m / TMC-2 / CLASS',
    sensorResolution: '0.25 m / 5m',
    footprintId: 'ch2_ohr_ncp_20250312T111500_d_img_d18',
    description: 'Terraced wall architecture with olivine and pyroxene exposures on the central peaks.',
    rimWest: '+1.8 km',
    floorDepth: '-3.8 km',
    rimEast: '+1.9 km',
    color: '#FF5C67'
  }
];

type RenderShaderMode = 'albedo' | 'elevation' | 'thermal' | 'radar';

export default function Scientific3DPlanetaryWorkstation() {
  const canvasContainerRef = useRef<HTMLDivElement>(null);
  const [selectedTarget, setSelectedTarget] = useState<LunarTarget>(TARGETS[0]);
  const [renderMode, setRenderMode] = useState<RenderShaderMode>('albedo');
  const [sunAngle, setSunAngle] = useState<number>(45);
  const [autoRotate, setAutoRotate] = useState<boolean>(true);
  const [showOrbit, setShowOrbit] = useState<boolean>(true);
  const [showFootprints, setShowFootprints] = useState<boolean>(true);
  const [showGrid, setShowGrid] = useState<boolean>(true);
  const [showSensorFrustum, setShowSensorFrustum] = useState<boolean>(true);
  
  // UI Panels state
  const [activeSidePanel, setActiveSidePanel] = useState<'targets' | 'layers' | 'shading' | 'none'>('none');
  const [hoveredTarget, setHoveredTarget] = useState<LunarTarget | null>(null);
  const [hoverScreenPos, setHoverScreenPos] = useState<{ x: number; y: number } | null>(null);
  const [currentTime, setCurrentTime] = useState('');

  // Three.js instances ref
  const sceneRef = useRef<{
    scene: THREE.Scene;
    camera: THREE.PerspectiveCamera;
    renderer: THREE.WebGLRenderer;
    moonMesh: THREE.Mesh;
    moonGroup: THREE.Group;
    satelliteGroup: THREE.Group;
    sunLight: THREE.DirectionalLight;
    orbitLine: THREE.Line;
    sensorFrustum: THREE.Mesh;
    markersGroup: THREE.Group;
    footprintsGroup: THREE.Group;
    gridGroup: THREE.Group;
    controls: {
      isDragging: boolean;
      prevMousePos: { x: number; y: number };
      targetRotX: number;
      targetRotY: number;
      rotX: number;
      rotY: number;
      targetZoom: number;
      zoom: number;
    };
  } | null>(null);

  // Live Mission Clock
  useEffect(() => {
    const updateTime = () => {
      const now = new Date();
      const utc = now.toISOString().replace('T', ' ').substring(0, 19) + ' UTC';
      setCurrentTime(utc);
    };
    updateTime();
    const interval = setInterval(updateTime, 1000);
    return () => clearInterval(interval);
  }, []);

  // Lat/Lon to Vector3 conversion on Unit Sphere
  const latLonToVector3 = (lat: number, lon: number, radius: number) => {
    const phi = (90 - lat) * (Math.PI / 180);
    const theta = (lon + 180) * (Math.PI / 180);
    const x = -(radius * Math.sin(phi) * Math.cos(theta));
    const z = radius * Math.sin(phi) * Math.sin(theta);
    const y = radius * Math.cos(phi);
    return new THREE.Vector3(x, y, z);
  };

  // High-Resolution Scientific Procedural Lunar Textures
  const createLunarTextures = () => {
    const width = 2048;
    const height = 1024;
    
    // 1. Scientific Albedo (Subtle grayscale basalt vs anorthosite highlands)
    const albedoCanvas = document.createElement('canvas');
    albedoCanvas.width = width;
    albedoCanvas.height = height;
    const ctxA = albedoCanvas.getContext('2d');
    if (ctxA) {
      // Base anorthosite highland
      ctxA.fillStyle = '#82878e';
      ctxA.fillRect(0, 0, width, height);

      // Lowland Maria Basalts
      const maria = [
        { x: 0.35, y: 0.40, rx: 190, ry: 130 }, // Oceanus Procellarum
        { x: 0.45, y: 0.32, rx: 130, ry: 95 },  // Mare Imbrium
        { x: 0.55, y: 0.36, rx: 95, ry: 80 },   // Mare Serenitatis
        { x: 0.60, y: 0.45, rx: 85, ry: 75 },   // Mare Tranquillitatis
        { x: 0.58, y: 0.58, rx: 75, ry: 65 },   // Mare Nectaris
        { x: 0.68, y: 0.48, rx: 80, ry: 70 },   // Mare Crisium
        { x: 0.46, y: 0.52, rx: 90, ry: 70 },   // Mare Nubium
        { x: 0.48, y: 0.64, rx: 70, ry: 55 },   // Mare Humorum
      ];

      maria.forEach(m => {
        const grad = ctxA.createRadialGradient(
          m.x * width, m.y * height, 15,
          m.x * width, m.y * height, m.rx
        );
        grad.addColorStop(0, 'rgba(38, 41, 46, 0.92)');
        grad.addColorStop(0.65, 'rgba(54, 58, 64, 0.78)');
        grad.addColorStop(1, 'rgba(130, 135, 142, 0)');
        ctxA.fillStyle = grad;
        ctxA.beginPath();
        ctxA.ellipse(m.x * width, m.y * height, m.rx, m.ry, 0, 0, Math.PI * 2);
        ctxA.fill();
      });

      // Ray Systems & Impact Craters
      const craters = [
        { x: 0.47, y: 0.74, r: 16, rays: true }, // Tycho
        { x: 0.44, y: 0.45, r: 18, rays: true }, // Copernicus
        { x: 0.39, y: 0.45, r: 12, rays: true }, // Kepler
        { x: 0.65, y: 0.91, r: 14, rays: false },// Boguslawsky
        { x: 0.50, y: 0.99, r: 15, rays: false },// Shackleton
      ];

      craters.forEach(c => {
        const cx = c.x * width;
        const cy = c.y * height;
        
        if (c.rays) {
          ctxA.strokeStyle = 'rgba(230, 235, 245, 0.28)';
          ctxA.lineWidth = 1.2;
          for (let i = 0; i < 28; i++) {
            const angle = (i / 28) * Math.PI * 2 + (Math.random() * 0.1);
            const len = 140 + Math.random() * 280;
            ctxA.beginPath();
            ctxA.moveTo(cx, cy);
            ctxA.lineTo(cx + Math.cos(angle) * len, cy + Math.sin(angle) * len);
            ctxA.stroke();
          }
        }

        ctxA.fillStyle = '#ffffff';
        ctxA.beginPath();
        ctxA.arc(cx, cy, c.r + 2, 0, Math.PI * 2);
        ctxA.fill();

        ctxA.fillStyle = '#1e2126';
        ctxA.beginPath();
        ctxA.arc(cx, cy, c.r - 2, 0, Math.PI * 2);
        ctxA.fill();
      });

      // Subtle fine micro-crater field
      ctxA.fillStyle = 'rgba(255,255,255,0.05)';
      for (let i = 0; i < 2000; i++) {
        const rx = Math.random() * width;
        const ry = Math.random() * height;
        const rr = 0.8 + Math.random() * 2.5;
        ctxA.beginPath();
        ctxA.arc(rx, ry, rr, 0, Math.PI * 2);
        ctxA.fill();
      }
    }
    const albedoTex = new THREE.CanvasTexture(albedoCanvas);

    // 2. Scientific Hypsometric Elevation Map
    const elevCanvas = document.createElement('canvas');
    elevCanvas.width = width;
    elevCanvas.height = height;
    const ctxE = elevCanvas.getContext('2d');
    if (ctxE) {
      const eGrad = ctxE.createLinearGradient(0, 0, 0, height);
      eGrad.addColorStop(0, '#4a154b'); // High northern terrains
      eGrad.addColorStop(0.2, '#1a365d');
      eGrad.addColorStop(0.5, '#0284c7');
      eGrad.addColorStop(0.7, '#059669');
      eGrad.addColorStop(0.85, '#d97706');
      eGrad.addColorStop(1, '#dc2626'); // South pole Aitken basin rim
      ctxE.fillStyle = eGrad;
      ctxE.fillRect(0, 0, width, height);

      // Lowland Basins (Deep Blue-Black)
      ctxE.fillStyle = 'rgba(10, 15, 30, 0.75)';
      ctxE.beginPath();
      ctxE.ellipse(0.45 * width, 0.38 * height, 250, 170, 0, 0, Math.PI * 2);
      ctxE.fill();
    }
    const elevTex = new THREE.CanvasTexture(elevCanvas);

    // 3. Thermal IR Radiance Map
    const thermalCanvas = document.createElement('canvas');
    thermalCanvas.width = width;
    thermalCanvas.height = height;
    const ctxT = thermalCanvas.getContext('2d');
    if (ctxT) {
      ctxT.fillStyle = '#04040c';
      ctxT.fillRect(0, 0, width, height);

      const tGrad = ctxT.createRadialGradient(
        0.5 * width, 0.5 * height, 10,
        0.5 * width, 0.5 * height, 520
      );
      tGrad.addColorStop(0, '#ffffff'); // 390 K equatorial subsolar point
      tGrad.addColorStop(0.3, '#ea580c');
      tGrad.addColorStop(0.6, '#7c2d12');
      tGrad.addColorStop(0.85, '#1e1b4b');
      tGrad.addColorStop(1, '#02020a'); // 40 K permanent polar shadows
      ctxT.fillStyle = tGrad;
      ctxT.fillRect(0, 0, width, height);
    }
    const thermalTex = new THREE.CanvasTexture(thermalCanvas);

    // 4. Radar SAR Rugosity Map
    const radarCanvas = document.createElement('canvas');
    radarCanvas.width = width;
    radarCanvas.height = height;
    const ctxR = radarCanvas.getContext('2d');
    if (ctxR) {
      ctxR.fillStyle = '#050c18';
      ctxR.fillRect(0, 0, width, height);

      ctxR.strokeStyle = 'rgba(0, 240, 255, 0.22)';
      ctxR.lineWidth = 1;
      for (let y = 0; y < height; y += 10) {
        ctxR.beginPath();
        ctxR.moveTo(0, y);
        for (let x = 0; x < width; x += 25) {
          ctxR.lineTo(x, y + Math.sin(x * 0.06 + y) * 3);
        }
        ctxR.stroke();
      }
    }
    const radarTex = new THREE.CanvasTexture(radarCanvas);

    return { albedoTex, elevTex, thermalTex, radarTex };
  };

  useEffect(() => {
    if (!canvasContainerRef.current) return;
    const container = canvasContainerRef.current;
    const width = container.clientWidth;
    const height = container.clientHeight;

    // SCENE & CAMERA (Cinematic 3D Scientific Viewport)
    const scene = new THREE.Scene();
    scene.background = new THREE.Color('#020409');

    const camera = new THREE.PerspectiveCamera(36, width / height, 0.1, 1000);
    camera.position.set(0, 0, 5.8);

    const renderer = new THREE.WebGLRenderer({ antialias: true, alpha: false, powerPreference: 'high-performance' });
    renderer.setSize(width, height);
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
    renderer.toneMapping = THREE.ACESFilmicToneMapping;
    renderer.toneMappingExposure = 1.35;
    renderer.shadowMap.enabled = true;
    renderer.shadowMap.type = THREE.PCFSoftShadowMap;

    container.innerHTML = '';
    container.appendChild(renderer.domElement);

    // SCIENTIFIC LIGHTING (Terminator Sun + Deep Space Ambience)
    const ambientLight = new THREE.AmbientLight(0x0a121e, 0.18);
    scene.add(ambientLight);

    const sunLight = new THREE.DirectionalLight(0xffffff, 4.2);
    sunLight.position.set(9, 4, 7);
    sunLight.castShadow = true;
    sunLight.shadow.mapSize.width = 2048;
    sunLight.shadow.mapSize.height = 2048;
    scene.add(sunLight);

    const earthAlbedoRim = new THREE.DirectionalLight(0x00f0ff, 0.35);
    earthAlbedoRim.position.set(-8, -3, -5);
    scene.add(earthAlbedoRim);

    // BACKGROUND STARFIELD
    const starGeo = new THREE.BufferGeometry();
    const starCount = 1400;
    const starPositions = new Float32Array(starCount * 3);
    for (let i = 0; i < starCount * 3; i += 3) {
      starPositions[i] = (Math.random() - 0.5) * 100;
      starPositions[i + 1] = (Math.random() - 0.5) * 100;
      starPositions[i + 2] = (Math.random() - 0.5) * 100;
    }
    starGeo.setAttribute('position', new THREE.BufferAttribute(starPositions, 3));
    const starMat = new THREE.PointsMaterial({ color: 0x94a3b8, size: 0.07, transparent: true, opacity: 0.75 });
    const stars = new THREE.Points(starGeo, starMat);
    scene.add(stars);

    // 3D HERO LUNAR GLOBE
    const moonGroup = new THREE.Group();
    scene.add(moonGroup);

    const { albedoTex, elevTex, thermalTex, radarTex } = createLunarTextures();

    const moonGeo = new THREE.SphereGeometry(2.1, 128, 128);
    const moonMat = new THREE.MeshStandardMaterial({
      map: albedoTex,
      roughness: 0.9,
      metalness: 0.05,
    });
    const moonMesh = new THREE.Mesh(moonGeo, moonMat);
    moonMesh.castShadow = true;
    moonMesh.receiveShadow = true;
    moonGroup.add(moonMesh);

    // BODY-FIXED LAT/LON GRATICULE GRID
    const gridGroup = new THREE.Group();
    moonGroup.add(gridGroup);

    // Parallels (Latitudes: -80, -60, -30, 0, 30, 60, 80)
    [-80, -60, -30, 0, 30, 60, 80].forEach(lat => {
      const radiusAtLat = 2.103 * Math.cos(lat * (Math.PI / 180));
      const yAtLat = 2.103 * Math.sin(lat * (Math.PI / 180));
      const circleGeo = new THREE.RingGeometry(radiusAtLat - 0.002, radiusAtLat, 96);
      const circleMat = new THREE.MeshBasicMaterial({ 
        color: lat === 0 ? 0x00f0ff : 0x64748b, 
        side: THREE.DoubleSide, 
        transparent: true, 
        opacity: lat === 0 ? 0.45 : 0.2 
      });
      const ring = new THREE.Mesh(circleGeo, circleMat);
      ring.rotation.x = Math.PI / 2;
      ring.position.y = yAtLat;
      gridGroup.add(ring);
    });

    // Meridians (Longitudes: 0, 30, 60, 90, 120, 150, 180, 210, 240, 270, 300, 330)
    [0, 30, 60, 90, 120, 150, 180, 210, 240, 270, 300, 330].forEach(lon => {
      const circleGeo = new THREE.RingGeometry(2.101, 2.103, 96);
      const circleMat = new THREE.MeshBasicMaterial({ 
        color: lon === 0 ? 0x00f0ff : 0x64748b, 
        side: THREE.DoubleSide, 
        transparent: true, 
        opacity: lon === 0 ? 0.45 : 0.18 
      });
      const ring = new THREE.Mesh(circleGeo, circleMat);
      ring.rotation.y = lon * (Math.PI / 180);
      gridGroup.add(ring);
    });

    // SCIENTIFIC TARGET MARKERS & HUD RETICLES
    const markersGroup = new THREE.Group();
    moonGroup.add(markersGroup);

    TARGETS.forEach(t => {
      const pos = latLonToVector3(t.lat, t.lon, 2.115);
      const markerGroup = new THREE.Group();
      markerGroup.position.copy(pos);
      markerGroup.lookAt(new THREE.Vector3(0, 0, 0));

      // Precision Center Crosshair Node
      const pinGeo = new THREE.SphereGeometry(0.025, 16, 16);
      const pinMat = new THREE.MeshBasicMaterial({ color: new THREE.Color(t.color) });
      const pin = new THREE.Mesh(pinGeo, pinMat);
      markerGroup.add(pin);

      // Outer Targeting HUD Reticle (Corner Brackets)
      const reticleGeo = new THREE.RingGeometry(0.05, 0.065, 32);
      const reticleMat = new THREE.MeshBasicMaterial({ 
        color: new THREE.Color(t.color), 
        side: THREE.DoubleSide, 
        transparent: true, 
        opacity: 0.7 
      });
      const reticle = new THREE.Mesh(reticleGeo, reticleMat);
      markerGroup.add(reticle);

      markerGroup.userData = { targetId: t.id, targetData: t };
      markersGroup.add(markerGroup);
    });

    // REMOTE-SENSING ACQUISITION FOOTPRINTS
    const footprintsGroup = new THREE.Group();
    moonGroup.add(footprintsGroup);

    // 1. OHRC 0.25m Ultra-High-Res Polygon over Boguslawsky E
    const ohrcPos = latLonToVector3(-74.32, 53.64, 2.108);
    const ohrcGeo = new THREE.PlaneGeometry(0.18, 0.28);
    const ohrcMat = new THREE.MeshBasicMaterial({ 
      color: 0x00f0ff, 
      side: THREE.DoubleSide, 
      transparent: true, 
      opacity: 0.4 
    });
    const ohrcMesh = new THREE.Mesh(ohrcGeo, ohrcMat);
    ohrcMesh.position.copy(ohrcPos);
    ohrcMesh.lookAt(new THREE.Vector3(0, 0, 0));
    footprintsGroup.add(ohrcMesh);

    // OHRC Bounding Line
    const ohrcLineGeo = new THREE.EdgesGeometry(ohrcGeo);
    const ohrcLineMat = new THREE.LineBasicMaterial({ color: 0x00f0ff, linewidth: 2 });
    const ohrcLine = new THREE.LineSegments(ohrcLineGeo, ohrcLineMat);
    ohrcMesh.add(ohrcLine);

    // 2. TMC-2 Stereo Triplet Swath
    const tmcPos = latLonToVector3(-43.35, -11.36, 2.106);
    const tmcGeo = new THREE.PlaneGeometry(0.35, 0.95);
    const tmcMat = new THREE.MeshBasicMaterial({ 
      color: 0x38bdf8, 
      side: THREE.DoubleSide, 
      transparent: true, 
      opacity: 0.28 
    });
    const tmcMesh = new THREE.Mesh(tmcGeo, tmcMat);
    tmcMesh.position.copy(tmcPos);
    tmcMesh.lookAt(new THREE.Vector3(0, 0, 0));
    footprintsGroup.add(tmcMesh);

    const tmcLineGeo = new THREE.EdgesGeometry(tmcGeo);
    const tmcLineMat = new THREE.LineBasicMaterial({ color: 0x38bdf8 });
    const tmcLine = new THREE.LineSegments(tmcLineGeo, tmcLineMat);
    tmcMesh.add(tmcLine);

    // 3. IIRS Hyperspectral Polar Swath
    const iirsPos = latLonToVector3(-89.90, 0, 2.106);
    const iirsGeo = new THREE.PlaneGeometry(0.24, 0.5);
    const iirsMat = new THREE.MeshBasicMaterial({ 
      color: 0xf59e0b, 
      side: THREE.DoubleSide, 
      transparent: true, 
      opacity: 0.32 
    });
    const iirsMesh = new THREE.Mesh(iirsGeo, iirsMat);
    iirsMesh.position.copy(iirsPos);
    iirsMesh.lookAt(new THREE.Vector3(0, 0, 0));
    footprintsGroup.add(iirsMesh);

    const iirsLineGeo = new THREE.EdgesGeometry(iirsGeo);
    const iirsLineMat = new THREE.LineBasicMaterial({ color: 0xf59e0b });
    const iirsLine = new THREE.LineSegments(iirsLineGeo, iirsLineMat);
    iirsMesh.add(iirsLine);

    // 100 KM POLAR ORBITAL TRAJECTORY ARC
    const orbitRadius = 2.52;
    const orbitPoints = [];
    for (let i = 0; i <= 128; i++) {
      const theta = (i / 128) * Math.PI * 2;
      orbitPoints.push(new THREE.Vector3(
        orbitRadius * Math.sin(theta) * 0.12,
        orbitRadius * Math.cos(theta),
        orbitRadius * Math.sin(theta) * 0.99
      ));
    }
    const orbitGeo = new THREE.BufferGeometry().setFromPoints(orbitPoints);
    const orbitMat = new THREE.LineDashedMaterial({
      color: 0x00f0ff,
      dashSize: 0.07,
      gapSize: 0.035,
      transparent: true,
      opacity: 0.7
    });
    const orbitLine = new THREE.Line(orbitGeo, orbitMat);
    orbitLine.computeLineDistances();
    scene.add(orbitLine);

    // CHANDRAYAAN-2 SPACECRAFT BUS & OPTICAL FRUSTUM
    const satelliteGroup = new THREE.Group();
    scene.add(satelliteGroup);

    // Satellite Main Gold Thermal Foil Body
    const satBodyGeo = new THREE.BoxGeometry(0.1, 0.1, 0.14);
    const satBodyMat = new THREE.MeshStandardMaterial({ color: 0xd4af37, metalness: 0.95, roughness: 0.15 });
    const satBody = new THREE.Mesh(satBodyGeo, satBodyMat);
    satBody.castShadow = true;
    satelliteGroup.add(satBody);

    // Solar Wings
    const panelGeo = new THREE.BoxGeometry(0.3, 0.09, 0.008);
    const panelMat = new THREE.MeshStandardMaterial({ color: 0x1e3a8a, metalness: 0.85, roughness: 0.25 });
    const leftPanel = new THREE.Mesh(panelGeo, panelMat);
    leftPanel.position.set(-0.22, 0, 0);
    satelliteGroup.add(leftPanel);

    const rightPanel = new THREE.Mesh(panelGeo, panelMat);
    rightPanel.position.set(0.22, 0, 0);
    satelliteGroup.add(rightPanel);

    // Optical Sensor Frustum Scanning Beam
    const coneGeo = new THREE.ConeGeometry(0.38, 0.72, 16, 1, true);
    const coneMat = new THREE.MeshBasicMaterial({
      color: 0x00f0ff,
      transparent: true,
      opacity: 0.2,
      side: THREE.DoubleSide
    });
    const sensorFrustum = new THREE.Mesh(coneGeo, coneMat);
    sensorFrustum.position.set(0, -0.36, 0);
    sensorFrustum.rotation.x = Math.PI;
    satelliteGroup.add(sensorFrustum);

    // INTERACTIVE CONTROLS
    const controls = {
      isDragging: false,
      prevMousePos: { x: 0, y: 0 },
      targetRotX: 0.35,
      targetRotY: 0.9,
      rotX: 0.35,
      rotY: 0.9,
      targetZoom: 5.8,
      zoom: 5.8,
    };

    const handleMouseDown = (e: MouseEvent) => {
      controls.isDragging = true;
      controls.prevMousePos = { x: e.clientX, y: e.clientY };
    };

    const handleMouseMove = (e: MouseEvent) => {
      if (!controls.isDragging) return;
      const deltaX = e.clientX - controls.prevMousePos.x;
      const deltaY = e.clientY - controls.prevMousePos.y;
      controls.targetRotY += deltaX * 0.005;
      controls.targetRotX += deltaY * 0.005;
      controls.targetRotX = Math.max(-Math.PI / 2 + 0.08, Math.min(Math.PI / 2 - 0.08, controls.targetRotX));
      controls.prevMousePos = { x: e.clientX, y: e.clientY };
    };

    const handleMouseUp = () => {
      controls.isDragging = false;
    };

    const handleWheel = (e: WheelEvent) => {
      e.preventDefault();
      controls.targetZoom += e.deltaY * 0.0035;
      controls.targetZoom = Math.max(3.2, Math.min(9.0, controls.targetZoom));
    };

    const handleResize = () => {
      if (!canvasContainerRef.current) return;
      const w = canvasContainerRef.current.clientWidth;
      const h = canvasContainerRef.current.clientHeight;
      camera.aspect = w / h;
      camera.updateProjectionMatrix();
      renderer.setSize(w, h);
    };

    const domElem = renderer.domElement;
    domElem.addEventListener('mousedown', handleMouseDown);
    window.addEventListener('mousemove', handleMouseMove);
    window.addEventListener('mouseup', handleMouseUp);
    domElem.addEventListener('wheel', handleWheel, { passive: false });
    window.addEventListener('resize', handleResize);

    // ANIMATION TICK
    let animationFrameId: number;
    let orbitAngle = 0;

    const animate = () => {
      animationFrameId = requestAnimationFrame(animate);

      // Damped camera rotation & zoom
      controls.rotX += (controls.targetRotX - controls.rotX) * 0.08;
      controls.rotY += (controls.targetRotY - controls.rotY) * 0.08;
      controls.zoom += (controls.targetZoom - controls.zoom) * 0.08;

      if (autoRotate && !controls.isDragging) {
        controls.targetRotY += 0.0015;
      }

      moonGroup.rotation.x = controls.rotX;
      moonGroup.rotation.y = controls.rotY;
      camera.position.z = controls.zoom;

      // Satellite polar orbit sweep
      orbitAngle += 0.007;
      const satY = orbitRadius * Math.cos(orbitAngle);
      const satZ = orbitRadius * Math.sin(orbitAngle) * 0.99;
      const satX = orbitRadius * Math.sin(orbitAngle) * 0.12;
      satelliteGroup.position.set(satX, satY, satZ);
      satelliteGroup.lookAt(new THREE.Vector3(0, 0, 0));

      renderer.render(scene, camera);
    };

    animate();

    sceneRef.current = {
      scene,
      camera,
      renderer,
      moonMesh,
      moonGroup,
      satelliteGroup,
      sunLight,
      orbitLine,
      sensorFrustum,
      markersGroup,
      footprintsGroup,
      gridGroup,
      controls
    };

    return () => {
      cancelAnimationFrame(animationFrameId);
      domElem.removeEventListener('mousedown', handleMouseDown);
      window.removeEventListener('mousemove', handleMouseMove);
      window.removeEventListener('mouseup', handleMouseUp);
      domElem.removeEventListener('wheel', handleWheel);
      window.removeEventListener('resize', handleResize);
      renderer.dispose();
    };
  }, []);

  // Update Surface Textures upon Render Mode change
  useEffect(() => {
    if (!sceneRef.current) return;
    const { moonMesh } = sceneRef.current;
    const { albedoTex, elevTex, thermalTex, radarTex } = createLunarTextures();

    if (renderMode === 'albedo') {
      (moonMesh.material as THREE.MeshStandardMaterial).map = albedoTex;
      (moonMesh.material as THREE.MeshStandardMaterial).roughness = 0.9;
    } else if (renderMode === 'elevation') {
      (moonMesh.material as THREE.MeshStandardMaterial).map = elevTex;
      (moonMesh.material as THREE.MeshStandardMaterial).roughness = 0.55;
    } else if (renderMode === 'thermal') {
      (moonMesh.material as THREE.MeshStandardMaterial).map = thermalTex;
      (moonMesh.material as THREE.MeshStandardMaterial).roughness = 0.45;
    } else if (renderMode === 'radar') {
      (moonMesh.material as THREE.MeshStandardMaterial).map = radarTex;
      (moonMesh.material as THREE.MeshStandardMaterial).roughness = 0.35;
    }
    (moonMesh.material as THREE.MeshStandardMaterial).needsUpdate = true;
  }, [renderMode]);

  // Update Sun Directional Light from Azimuth Slider
  useEffect(() => {
    if (!sceneRef.current) return;
    const rad = (sunAngle * Math.PI) / 180;
    sceneRef.current.sunLight.position.set(Math.cos(rad) * 11, 4, Math.sin(rad) * 11);
  }, [sunAngle]);

  // Layer Toggles
  useEffect(() => {
    if (!sceneRef.current) return;
    sceneRef.current.orbitLine.visible = showOrbit;
    sceneRef.current.satelliteGroup.visible = showOrbit;
    sceneRef.current.footprintsGroup.visible = showFootprints;
    sceneRef.current.gridGroup.visible = showGrid;
    sceneRef.current.sensorFrustum.visible = showSensorFrustum;
  }, [showOrbit, showFootprints, showGrid, showSensorFrustum]);

  // Target Fly-To Orientation
  const flyToTarget = (target: LunarTarget) => {
    setSelectedTarget(target);
    if (!sceneRef.current) return;
    const { controls } = sceneRef.current;
    const phi = target.lat * (Math.PI / 180);
    const theta = -(target.lon + 180) * (Math.PI / 180);
    
    controls.targetRotX = phi;
    controls.targetRotY = theta + Math.PI / 2;
    controls.targetZoom = 4.4;
  };

  const resetCameraView = () => {
    if (!sceneRef.current) return;
    const { controls } = sceneRef.current;
    controls.targetRotX = 0.35;
    controls.targetRotY = 0.9;
    controls.targetZoom = 5.8;
  };

  return (
    <div className="h-screen w-screen overflow-hidden bg-[#020409] text-[#E2E8F0] font-sans flex flex-col select-none">
      
      {/* 1. TOP SCIENTIFIC COMMAND & NAVIGATION BAR */}
      <header className="h-11 border-b border-white/10 bg-[#040812] px-4 flex items-center justify-between z-40 text-xs font-mono shrink-0">
        
        {/* Left: EDOLUS Brand & Workstation Status */}
        <div className="flex items-center gap-4">
          <Link href="/dashboard" className="flex items-center gap-2 text-white hover:text-[#00F0FF] transition-colors">
            <span className="font-extrabold tracking-[0.25em] text-white text-[13px]">EDOLUS</span>
            <span className="text-[9px] text-[#00F0FF] tracking-widest uppercase">// 3D PLANETARY LAB</span>
          </Link>
          <div className="h-3.5 w-[1px] bg-white/10" />
          <div className="flex items-center gap-2 text-[10px] text-slate-400">
            <span className="w-1.5 h-1.5 rounded-full bg-[#00F0FF] animate-pulse" />
            <span className="tracking-widest uppercase">SPACECRAFT: CHANDRAYAAN-2 (ISRO-PDS4)</span>
          </div>
        </div>

        {/* Center: Minimalist Technical Nav Links */}
        <nav className="hidden md:flex items-center gap-6 text-[11px] tracking-wider text-slate-400">
          <Link href="/dashboard" className="hover:text-white transition-colors">MISSION</Link>
          <Link href="/datasets" className="hover:text-white transition-colors">DATASETS</Link>
          <Link href="/correspondence" className="hover:text-white transition-colors">CORRESPONDENCE</Link>
          <Link href="/reports" className="hover:text-white transition-colors">REPORTS</Link>
          <span className="text-[#00F0FF] font-bold border-b border-[#00F0FF] pb-0.5">3D ANALYSIS</span>
          <Link href="/analytics" className="hover:text-white transition-colors">ANALYTICS</Link>
        </nav>

        {/* Right: Scientific Search / Coordinate Lookup & UTC Time */}
        <div className="flex items-center gap-3">
          <div className="flex items-center gap-2 px-2.5 py-1 rounded bg-[#07111E] border border-white/10 text-[10px] text-slate-300 w-56 sm:w-64">
            <span className="text-[#00F0FF]">⌕</span>
            <input 
              type="text" 
              placeholder="SEARCH TARGET / IMAGE / COORD" 
              className="bg-transparent border-none outline-none text-[10px] font-mono text-slate-200 placeholder:text-slate-500 w-full"
            />
            <kbd className="text-[8px] bg-white/10 px-1 py-0.5 rounded text-slate-400">⌘K</kbd>
          </div>
          <div className="hidden lg:block text-[10px] text-slate-400 border-l border-white/10 pl-3">
            {currentTime}
          </div>
        </div>
      </header>

      {/* 2. MAIN SCIENTIFIC WORKSPACE (VIEWPORT + HUD + MISSION DATA RAIL) */}
      <div className="flex-1 relative flex overflow-hidden">
        
        {/* 2A. LEFT NARROW CONTEXTUAL TOOL HUD (Floating Scientific Instrument Rail) */}
        <div className="absolute top-4 left-4 z-30 flex flex-col gap-1.5 p-1 bg-[#060B14]/90 backdrop-blur-md border border-white/10 rounded-lg text-slate-400 text-[10px] font-mono shadow-2xl">
          
          <button
            onClick={() => setActiveSidePanel(activeSidePanel === 'targets' ? 'none' : 'targets')}
            className={`p-2 rounded flex flex-col items-center gap-1 transition-all ${
              activeSidePanel === 'targets'
                ? 'bg-[#00F0FF]/15 text-[#00F0FF] border-l-2 border-[#00F0FF]'
                : 'hover:bg-white/5 hover:text-white'
            }`}
            title="Target Loci Selector"
          >
            <Focus className="w-4 h-4" />
            <span className="text-[8px] tracking-wider">TARGETS</span>
          </button>

          <button
            onClick={() => setShowFootprints(!showFootprints)}
            className={`p-2 rounded flex flex-col items-center gap-1 transition-all ${
              showFootprints 
                ? 'text-[#00F0FF] bg-[#00F0FF]/10' 
                : 'hover:bg-white/5 hover:text-white'
            }`}
            title="Toggle Sensor Footprints (OHRC/TMC/IIRS)"
          >
            <Layers className="w-4 h-4" />
            <span className="text-[8px] tracking-wider">SWATHS</span>
          </button>

          <button
            onClick={() => setActiveSidePanel(activeSidePanel === 'shading' ? 'none' : 'shading')}
            className={`p-2 rounded flex flex-col items-center gap-1 transition-all ${
              activeSidePanel === 'shading'
                ? 'bg-[#00F0FF]/15 text-[#00F0FF] border-l-2 border-[#00F0FF]'
                : 'hover:bg-white/5 hover:text-white'
            }`}
            title="Planetary Shading & False-Color Mode"
          >
            <Eye className="w-4 h-4" />
            <span className="text-[8px] tracking-wider">SHADING</span>
          </button>

          <button
            onClick={() => setShowGrid(!showGrid)}
            className={`p-2 rounded flex flex-col items-center gap-1 transition-all ${
              showGrid ? 'text-[#00F0FF] bg-[#00F0FF]/10' : 'hover:bg-white/5 hover:text-white'
            }`}
            title="Toggle Body-Fixed Graticule Grid"
          >
            <Compass className="w-4 h-4" />
            <span className="text-[8px] tracking-wider">GRID</span>
          </button>

          <button
            onClick={() => setShowOrbit(!showOrbit)}
            className={`p-2 rounded flex flex-col items-center gap-1 transition-all ${
              showOrbit ? 'text-[#00F0FF] bg-[#00F0FF]/10' : 'hover:bg-white/5 hover:text-white'
            }`}
            title="Toggle 100km Orbit Trajectory"
          >
            <Orbit className="w-4 h-4" />
            <span className="text-[8px] tracking-wider">ORBIT</span>
          </button>

          <div className="h-[1px] bg-white/10 my-0.5" />

          <button
            onClick={resetCameraView}
            className="p-2 rounded hover:bg-white/5 hover:text-white flex flex-col items-center gap-1"
            title="Reset Camera Orientation"
          >
            <RefreshCw className="w-4 h-4" />
            <span className="text-[8px] tracking-wider">RESET</span>
          </button>
        </div>

        {/* 2B. CONTEXTUAL DRAWER (When Left Tool HUD item is clicked) */}
        {activeSidePanel === 'targets' && (
          <div className="absolute top-4 left-20 z-30 w-72 bg-[#060B14]/95 backdrop-blur-md border border-white/10 rounded-lg p-3 text-xs font-mono shadow-2xl space-y-2">
            <div className="flex items-center justify-between border-b border-white/10 pb-1.5 text-[#00F0FF] text-[10px] font-bold tracking-wider">
              <span>LUNAR TARGET REGIONS</span>
              <span>{TARGETS.length} SITES</span>
            </div>
            <div className="space-y-1 max-h-96 overflow-y-auto pr-1">
              {TARGETS.map(t => (
                <button
                  key={t.id}
                  onClick={() => {
                    flyToTarget(t);
                    setActiveSidePanel('none');
                  }}
                  className={`w-full p-2 rounded text-left transition-all flex items-center justify-between border ${
                    selectedTarget.id === t.id
                      ? 'bg-[#00F0FF]/15 border-[#00F0FF]/60 text-white'
                      : 'bg-[#02050B]/60 border-white/5 text-slate-400 hover:text-white hover:border-white/20'
                  }`}
                >
                  <div>
                    <div className="text-[11px] font-bold">{t.name}</div>
                    <div className="text-[9px] text-slate-500">{t.latStr} • {t.lonStr}</div>
                  </div>
                  <span className="text-[9px] font-mono text-[#00F0FF]">{t.sensorResolution}</span>
                </button>
              ))}
            </div>
          </div>
        )}

        {activeSidePanel === 'shading' && (
          <div className="absolute top-4 left-20 z-30 w-64 bg-[#060B14]/95 backdrop-blur-md border border-white/10 rounded-lg p-3 text-xs font-mono shadow-2xl space-y-2">
            <div className="text-[#00F0FF] text-[10px] font-bold tracking-wider border-b border-white/10 pb-1.5">
              PLANETARY SHADING PIPELINE
            </div>
            <div className="space-y-1">
              {[
                { id: 'albedo', label: 'VISUAL ALBEDO (GRAYSCALE)', desc: 'Photometric calibrated basalt & anorthosite' },
                { id: 'elevation', label: 'ELEVATION HYPSOMETRIC', desc: 'False-color topological DEM gradient' },
                { id: 'thermal', label: 'THERMAL IR RADIANCE', desc: 'Cryogenic polar cold traps (40K-390K)' },
                { id: 'radar', label: 'RADAR SAR RUGOSITY', desc: 'Surface backscatter roughness' },
              ].map(mode => (
                <button
                  key={mode.id}
                  onClick={() => {
                    setRenderMode(mode.id as RenderShaderMode);
                    setActiveSidePanel('none');
                  }}
                  className={`w-full p-2 rounded text-left transition-all border ${
                    renderMode === mode.id
                      ? 'bg-[#00F0FF]/15 border-[#00F0FF]/60 text-white'
                      : 'bg-[#02050B]/60 border-white/5 text-slate-400 hover:text-white'
                  }`}
                >
                  <div className="text-[10px] font-bold">{mode.label}</div>
                  <div className="text-[8px] text-slate-500 mt-0.5">{mode.desc}</div>
                </button>
              ))}
            </div>
          </div>
        )}

        {/* 2C. 3D CENTRAL WEBGL CANVAS (Hero Lunar Globe Dominating Viewport) */}
        <div className="flex-1 relative h-full w-full">
          <div 
            ref={canvasContainerRef} 
            className="w-full h-full cursor-grab active:cursor-grabbing bg-[#020409]"
          />

          {/* SUBTLE HUD RETICLE OVER SELECTED TARGET (Technical Coordinates & Reticle) */}
          <div className="absolute top-4 right-96 pointer-events-none hidden xl:flex flex-col items-end text-right font-mono text-[10px] text-slate-400 space-y-0.5 bg-[#040812]/70 p-2.5 rounded border border-white/10 backdrop-blur-sm">
            <div className="flex items-center gap-1.5 text-[#00F0FF] font-bold">
              <Crosshair className="w-3.5 h-3.5" />
              <span>TARGET LOCK: {selectedTarget.code}</span>
            </div>
            <div>LAT: <span className="text-white font-bold">{selectedTarget.latStr}</span> | LON: <span className="text-white font-bold">{selectedTarget.lonStr}</span></div>
            <div>ELEVATION: <span className="text-[#00F0FF]">{selectedTarget.elevation}</span> | RES: <span className="text-[#32D39A]">{selectedTarget.sensorResolution}</span></div>
            <div>INCIDENCE: <span className="text-amber-400">{selectedTarget.incidence}</span> | PHASE: <span className="text-white">{selectedTarget.phaseAngle}</span></div>
          </div>

          {/* VIEWPORT SCIENTIFIC AXES & COORD WATERMARK */}
          <div className="absolute bottom-14 left-20 pointer-events-none text-[9px] font-mono text-slate-500 flex items-center gap-4">
            <div>COORDINATE SYSTEM: <span className="text-slate-300">LUNAR BODY-FIXED (IAU 2015)</span></div>
            <div>•</div>
            <div>EPHEMERIS: <span className="text-slate-300">DE421 / SPICE KERNEL</span></div>
          </div>

          {/* 2D. SLIM MISSION-CONTROL TELEMETRY & LIGHTING STRIP (Docked at Viewport Bottom) */}
          <div className="absolute bottom-0 left-0 right-0 h-11 bg-[#040812]/95 backdrop-blur-md border-t border-white/10 px-4 sm:px-6 flex items-center justify-between z-30 font-mono text-[11px] text-slate-300">
            
            {/* Telemetry metrics */}
            <div className="flex items-center gap-4 sm:gap-6 overflow-x-auto py-1">
              <div className="flex items-center gap-2">
                <span className="text-slate-500 text-[9px]">SUN AZIMUTH:</span>
                <input
                  type="range"
                  min="0"
                  max="360"
                  value={sunAngle}
                  onChange={(e) => setSunAngle(Number(e.target.value))}
                  className="w-20 sm:w-28 accent-[#FFB547] cursor-pointer"
                />
                <span className="text-amber-400 font-bold">{sunAngle}°</span>
              </div>

              <div className="h-3 w-[1px] bg-white/10 hidden sm:block" />

              <div className="hidden md:flex items-center gap-1.5">
                <span className="text-slate-500 text-[9px]">ILLUMINATION:</span>
                <span className="text-slate-200 font-bold">72.4%</span>
              </div>

              <div className="h-3 w-[1px] bg-white/10 hidden md:block" />

              <div className="hidden lg:flex items-center gap-1.5">
                <span className="text-slate-500 text-[9px]">ALTITUDE:</span>
                <span className="text-[#00F0FF] font-bold">100.24 km</span>
              </div>

              <div className="h-3 w-[1px] bg-white/10 hidden lg:block" />

              <div className="hidden xl:flex items-center gap-1.5">
                <span className="text-slate-500 text-[9px]">ORBIT:</span>
                <span className="text-slate-200">90.0° POLAR (CH-2)</span>
              </div>
            </div>

            {/* Controls */}
            <div className="flex items-center gap-2 shrink-0">
              <button
                onClick={() => setAutoRotate(!autoRotate)}
                className={`px-2.5 py-1 rounded text-[10px] font-mono border transition-all flex items-center gap-1.5 ${
                  autoRotate
                    ? 'bg-[#32D39A]/15 border-[#32D39A]/50 text-[#32D39A]'
                    : 'bg-white/5 border-white/10 text-slate-400'
                }`}
              >
                {autoRotate ? <Pause className="w-3 h-3" /> : <Play className="w-3 h-3" />}
                <span>AUTO-ROTATION {autoRotate ? 'ON' : 'OFF'}</span>
              </button>
            </div>
          </div>
        </div>

        {/* 2E. RIGHT MISSION DATA RAIL (Aerospace Scientific Telemetry Console) */}
        <div className="w-80 lg:w-96 bg-[#040812] border-l border-white/10 flex flex-col z-30 shrink-0 overflow-y-auto">
          
          {/* Target Header Block */}
          <div className="p-4 border-b border-white/10 space-y-2 bg-[#060B16]">
            <div className="flex items-center justify-between text-[9px] font-mono tracking-widest text-slate-400 uppercase">
              <div className="flex items-center gap-1.5">
                <span className="w-2 h-2 rounded-full bg-[#00F0FF] animate-pulse" />
                <span>PLANETARY TARGET TELEMETRY</span>
              </div>
              <span className="text-[#00F0FF]">{selectedTarget.code}</span>
            </div>
            
            <h2 className="text-base font-extrabold text-white tracking-tight font-sans">
              {selectedTarget.name}
            </h2>
            
            <p className="text-[11px] text-slate-400 font-sans leading-relaxed">
              {selectedTarget.description}
            </p>
          </div>

          {/* Technical Telemetry Data Matrix */}
          <div className="p-4 border-b border-white/10 space-y-3 font-mono text-xs">
            <div className="text-[9px] tracking-widest text-slate-500 uppercase">
              GEODETIC READOUT & OPTICAL PROPERTIES
            </div>

            <div className="grid grid-cols-2 gap-x-4 gap-y-2.5 bg-[#02050B] p-3 rounded border border-white/5">
              <div>
                <span className="text-[9px] text-slate-500 block uppercase">LATITUDE</span>
                <span className="text-white font-bold text-xs">{selectedTarget.latStr}</span>
              </div>
              <div>
                <span className="text-[9px] text-slate-500 block uppercase">LONGITUDE</span>
                <span className="text-white font-bold text-xs">{selectedTarget.lonStr}</span>
              </div>
              <div>
                <span className="text-[9px] text-slate-500 block uppercase">ELEVATION RELIEF</span>
                <span className="text-[#00F0FF] font-bold text-xs">{selectedTarget.elevation}</span>
              </div>
              <div>
                <span className="text-[9px] text-slate-500 block uppercase">CRATER DEPTH</span>
                <span className="text-white font-bold text-xs">{selectedTarget.depth}</span>
              </div>
              <div>
                <span className="text-[9px] text-slate-500 block uppercase">DIAMETER</span>
                <span className="text-white font-bold text-xs">{selectedTarget.diameter}</span>
              </div>
              <div>
                <span className="text-[9px] text-slate-500 block uppercase">BEST RESOLUTION</span>
                <span className="text-[#32D39A] font-bold text-xs">{selectedTarget.sensorResolution}</span>
              </div>
              <div className="col-span-2 pt-1 border-t border-white/5">
                <span className="text-[9px] text-slate-500 block uppercase">OPTICAL SENSORS</span>
                <span className="text-slate-300 text-xs">{selectedTarget.instruments}</span>
              </div>
              <div className="col-span-2">
                <span className="text-[9px] text-slate-500 block uppercase">ACQUISITION FOOTPRINT ID</span>
                <span className="text-slate-400 text-[10px] truncate block">{selectedTarget.footprintId}</span>
              </div>
            </div>
          </div>

          {/* TOPOGRAPHIC CROSS-SECTION (LALT Laser Altimeter / TMC Stereo Plot) */}
          <div className="p-4 border-b border-white/10 space-y-2 font-mono text-xs">
            <div className="flex items-center justify-between text-[9px] tracking-widest text-slate-500 uppercase">
              <span>TOPOGRAPHIC PROFILE (LALT-DEM)</span>
              <span className="text-[#00F0FF]">1:1000 SCALE</span>
            </div>

            {/* Scientific Plotting Instrument Surface */}
            <div className="bg-[#02050B] p-2.5 rounded border border-white/10 space-y-2">
              <div className="h-20 w-full relative flex items-end">
                {/* Plot Grids */}
                <div className="absolute inset-0 grid grid-cols-4 grid-rows-3 opacity-15 pointer-events-none">
                  <div className="border-r border-b border-[#00F0FF]" />
                  <div className="border-r border-b border-[#00F0FF]" />
                  <div className="border-r border-b border-[#00F0FF]" />
                  <div className="border-b border-[#00F0FF]" />
                  <div className="border-r border-b border-[#00F0FF]" />
                  <div className="border-r border-b border-[#00F0FF]" />
                  <div className="border-r border-b border-[#00F0FF]" />
                  <div className="border-b border-[#00F0FF]" />
                  <div className="border-r border-[#00F0FF]" />
                  <div className="border-r border-[#00F0FF]" />
                  <div className="border-r border-[#00F0FF]" />
                  <div />
                </div>

                <svg className="w-full h-full overflow-visible" viewBox="0 0 100 40" preserveAspectRatio="none">
                  <defs>
                    <linearGradient id="sciElevGrad" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="0%" stopColor="#00F0FF" stopOpacity="0.3" />
                      <stop offset="100%" stopColor="#00F0FF" stopOpacity="0.0" />
                    </linearGradient>
                  </defs>
                  <path
                    d="M 0 12 Q 18 16, 32 10 Q 38 38, 50 38 Q 62 38, 68 10 Q 82 16, 100 12 L 100 40 L 0 40 Z"
                    fill="url(#sciElevGrad)"
                  />
                  <path
                    d="M 0 12 Q 18 16, 32 10 Q 38 38, 50 38 Q 62 38, 68 10 Q 82 16, 100 12"
                    fill="none"
                    stroke="#00F0FF"
                    strokeWidth="1.5"
                  />
                  {/* Central floor target tick */}
                  <line x1="50" y1="0" x2="50" y2="40" stroke="#FF5C67" strokeWidth="0.8" strokeDasharray="2,2" />
                </svg>
              </div>

              <div className="flex justify-between text-[8px] font-mono text-slate-400">
                <span>WEST RIM ({selectedTarget.rimWest})</span>
                <span className="text-[#FF5C67]">FLOOR ({selectedTarget.floorDepth})</span>
                <span>EAST RIM ({selectedTarget.rimEast})</span>
              </div>
            </div>
          </div>

          {/* Quick Target Switcher Rail */}
          <div className="p-4 border-b border-white/10 space-y-2 font-mono text-xs">
            <div className="text-[9px] tracking-widest text-slate-500 uppercase">
              QUICK TARGET SELECTION
            </div>
            <div className="grid grid-cols-2 gap-1.5">
              {TARGETS.map(t => (
                <button
                  key={t.id}
                  onClick={() => flyToTarget(t)}
                  className={`p-1.5 rounded text-[10px] text-left truncate transition-all border ${
                    selectedTarget.id === t.id
                      ? 'bg-[#00F0FF]/15 border-[#00F0FF] text-white font-bold'
                      : 'bg-[#02050B] border-white/5 text-slate-400 hover:text-white hover:border-white/20'
                  }`}
                >
                  <span className="w-1.5 h-1.5 rounded-full inline-block mr-1.5" style={{ backgroundColor: t.color }} />
                  {t.name.split(' ')[0]}
                </button>
              ))}
            </div>
          </div>

          {/* Compact Scientific Action Controls */}
          <div className="p-4 space-y-2 font-mono text-xs mt-auto">
            <Link
              href="/correspondence"
              className="w-full py-2.5 rounded bg-[#00F0FF]/20 hover:bg-[#00F0FF]/30 border border-[#00F0FF]/60 text-[#00F0FF] hover:text-white font-bold text-[11px] uppercase tracking-wider flex items-center justify-center gap-2 transition-all shadow-[0_0_15px_rgba(0,240,255,0.15)]"
            >
              <GitCompare className="w-3.5 h-3.5" />
              <span>RUN CORRESPONDENCE →</span>
            </Link>

            <Link
              href="/reports"
              className="w-full py-2 rounded bg-white/5 hover:bg-white/10 border border-white/10 text-slate-300 hover:text-white text-[10px] uppercase tracking-wider flex items-center justify-center gap-2 transition-all"
            >
              <Database className="w-3.5 h-3.5 text-[#00F0FF]" />
              <span>GENERATE PDS4 SCIENTIFIC REPORT</span>
            </Link>
          </div>

        </div>

      </div>
    </div>
  );
}
