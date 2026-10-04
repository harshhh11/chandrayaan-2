'use client';

import React, { useState, useEffect, useRef, useMemo } from 'react';
import Link from 'next/link';
import * as THREE from 'three';
import { 
  Compass, Layers, Crosshair, Orbit, 
  Database, GitCompare, RotateCw, ZoomIn, ZoomOut,
  Sun, Eye, Play, Pause, ChevronRight, RefreshCw,
  Search, Shield, Check, FileText, ArrowUpRight
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
  sourceProductId: string;
  targetProductId: string;
  matchPayload: string;
  matchRatio: string;
  sunDelta: string;
  description: string;
  rimWest: string;
  floorDepth: string;
  rimEast: string;
  profilePoints: number[];
  category: 'BENCHMARK' | 'HISTORIC_SITE' | 'POLAR_TRAP' | 'IMPACT_STRUCTURE';
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
    incidence: '61.6°',
    phaseAngle: '44.8°',
    instruments: 'OHRC 0.25m / TMC-2 / IIRS',
    sensorResolution: '0.25 m/px',
    footprintId: 'ch2_ohr_ncp_20191015T041200_d_img_d18',
    sourceProductId: 'ch2_ohr_ncp_20191015T041200_d_img_d18',
    targetProductId: 'ch2_tmc_ncn_20200411T093000_d_img_d18',
    matchPayload: 'OHRC (0.25m) ↔ TMC-2 (5m)',
    matchRatio: '20.0× Scale Ratio',
    sunDelta: 'Δ 25.7° Sun Angle',
    description: 'High-latitude crater benchmark. Target for sub-meter multi-scale optical correspondence and boulder detection.',
    rimWest: '+1,200 m',
    floorDepth: '-3,240 m',
    rimEast: '+1,380 m',
    profilePoints: [18, 16, 12, 5, 2, -28, -32, -32, -31, -26, 4, 14, 17],
    category: 'BENCHMARK'
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
    diameter: 'Landing Locus',
    incidence: '58.2°',
    phaseAngle: '39.6°',
    instruments: 'OHRC 0.25m / TMC-2 Stereo',
    sensorResolution: '0.25 m/px',
    footprintId: 'ch2_ohr_ncp_20220310T061500_d_img_d18',
    sourceProductId: 'ch2_ohr_ncp_20191015T041200_d_img_d18',
    targetProductId: 'ch2_tmc_ncn_20200411T093000_d_img_d18',
    matchPayload: 'OHRC (0.25m) ↔ TMC-2 (5m)',
    matchRatio: '20.0× Scale Ratio',
    sunDelta: 'Δ 18.4° Sun Angle',
    description: 'Chandrayaan-3 landing touchdown locus with multi-temporal pre- and post-landing sub-meter orbital coverage.',
    rimWest: '+400 m',
    floorDepth: '-1,820 m',
    rimEast: '+580 m',
    profilePoints: [8, 6, 2, -10, -18, -18, -17, -12, 1, 6, 8],
    category: 'HISTORIC_SITE'
  },
  {
    id: 'T3',
    code: 'TYCHO-PEAK-03',
    name: 'TYCHO CRATER CENTRAL PEAK',
    lat: -43.31,
    lon: -11.36,
    latStr: '43.31° S',
    lonStr: '11.36° W',
    elevation: '+1,480 m',
    depth: '4.8 km',
    diameter: '85.0 km',
    incidence: '59.5°',
    phaseAngle: '28.3°',
    instruments: 'OHRC 0.25m / TMC-2 Triplet',
    sensorResolution: '0.25 m/px',
    footprintId: 'ch2_ohr_ncp_20220310T061500_d_img_d18',
    sourceProductId: 'ch2_ohr_ncp_20220310T061500_d_img_d18',
    targetProductId: 'ch2_ohr_ncp_20220324T184000_d_img_d18',
    matchPayload: 'OHRC Morning ↔ OHRC Evening',
    matchRatio: '1.0× Same Sensor',
    sunDelta: 'Δ 180.0° Opposing Sun',
    description: 'Copernican impact structure with prominent 1.5km central peak uplift and high-albedo filamentary ray system.',
    rimWest: '+2,100 m',
    floorDepth: '-4,800 m',
    rimEast: '+2,420 m',
    profilePoints: [22, 19, 14, -25, -45, -48, 15, -48, -44, -22, 16, 24],
    category: 'IMPACT_STRUCTURE'
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
    instruments: 'TMC-2 (5m) / IIRS (80m)',
    sensorResolution: '5.0 m / 80 m',
    footprintId: 'ch2_tmc_ncn_20210828T144500_d_img_d18',
    sourceProductId: 'ch2_tmc_ncn_20210828T144500_d_img_d18',
    targetProductId: 'ch2_iir_ncn_20210828T144500_d_cub_d18',
    matchPayload: 'TMC-2 (5m) ↔ IIRS (80m)',
    matchRatio: '16.0× Scale Ratio',
    sunDelta: 'Δ 2.4° Low Grazing',
    description: 'South polar cold trap rim. Permanently shadowed floor preserving cryogenic volatiles and water-ice signatures.',
    rimWest: '+1,200 m',
    floorDepth: '-4,200 m',
    rimEast: '+1,150 m',
    profilePoints: [14, 12, 8, -20, -42, -42, -40, -18, 9, 12],
    category: 'POLAR_TRAP'
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
    incidence: '55.0°',
    phaseAngle: '22.4°',
    instruments: 'OHRC 0.25m / TMC-2 Stereo',
    sensorResolution: '0.25 m/px',
    footprintId: 'ch2_ohr_ncp_20191015T041200_d_img_d18',
    sourceProductId: 'ch2_ohr_ncp_20191015T041200_d_img_d18',
    targetProductId: 'ch2_tmc_ncn_20200411T093000_d_img_d18',
    matchPayload: 'OHRC (0.25m) ↔ TMC-2 (5m)',
    matchRatio: '20.0× Scale Ratio',
    sunDelta: 'Δ 32.0° Sun Angle',
    description: 'Prominent complex crater with massive terraced walls, central mountain massif, and extensive ejecta blanket.',
    rimWest: '+1,800 m',
    floorDepth: '-3,800 m',
    rimEast: '+1,950 m',
    profilePoints: [20, 16, 10, -18, -35, -38, 8, -38, -32, -15, 14, 19],
    category: 'IMPACT_STRUCTURE'
  }
];

type RenderShaderMode = 'albedo' | 'elevation' | 'slope' | 'illumination' | 'relief';

export default function Scientific3DPlanetaryWorkstation() {
  const canvasContainerRef = useRef<HTMLDivElement>(null);
  const [selectedTarget, setSelectedTarget] = useState<LunarTarget>(TARGETS[0]);
  const [renderMode, setRenderMode] = useState<RenderShaderMode>('albedo');
  
  // Real Physical Sun Position Controls
  const [sunAzimuth, setSunAzimuth] = useState<number>(65.2);
  const [sunElevation, setSunElevation] = useState<number>(28.4);
  const [autoRotate, setAutoRotate] = useState<boolean>(false);
  
  // Scientific Layer Toggles
  const [layers, setLayers] = useState({
    lunarSurface: true,
    ohrcCoverage: true,
    tmcCoverage: true,
    iirsCoverage: true,
    orbitPath: true,
    spacecraft: true,
    coordinateGrid: true,
    targetReticle: true,
  });

  // UI Active Side Drawer ('none' | 'targets' | 'layers' | 'shading')
  const [activeDrawer, setActiveDrawer] = useState<'none' | 'targets' | 'layers' | 'shading'>('none');
  const [currentTime, setCurrentTime] = useState<string>('');

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
    targetMarkerGroup: THREE.Group;
    bumpTexture: THREE.CanvasTexture;
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

  // Selenographic Lat/Lon to 3D Cartesian coordinates on sphere
  const latLonToVector3 = (lat: number, lon: number, radius: number) => {
    const phi = (90 - lat) * (Math.PI / 180);
    const theta = (lon + 180) * (Math.PI / 180);
    const x = -(radius * Math.sin(phi) * Math.cos(theta));
    const z = radius * Math.sin(phi) * Math.sin(theta);
    const y = radius * Math.cos(phi);
    return new THREE.Vector3(x, y, z);
  };

  // ========================================================
  // HIGH-FIDELITY LUNAR TEXTURE GENERATOR
  // Creates authentic Albedo, Bump/Normal, Elevation, Slope, and Relief Maps
  // ========================================================
  const createPhotorealisticLunarTextures = () => {
    const width = 2048;
    const height = 1024;

    // Helper: Draw a physical impact crater onto canvases
    const drawPhysicalCrater = (
      ctxA: CanvasRenderingContext2D,
      ctxB: CanvasRenderingContext2D,
      lonDeg: number,
      latDeg: number,
      radiusPx: number,
      hasCentralPeak = false,
      hasRays = false
    ) => {
      const cx = ((lonDeg + 180) / 360) * width;
      const cy = ((90 - latDeg) / 180) * height;

      // 1. Ray Ejecta Blanket (High-albedo glass rays)
      if (hasRays) {
        ctxA.save();
        ctxA.strokeStyle = 'rgba(215, 222, 230, 0.22)';
        ctxA.lineWidth = 1.0;
        const rayCount = 42;
        for (let i = 0; i < rayCount; i++) {
          const angle = (i / rayCount) * Math.PI * 2 + ((i % 3) * 0.05);
          const rayLen = radiusPx * 4.5 + ((i * 17) % (radiusPx * 6));
          ctxA.beginPath();
          ctxA.moveTo(cx, cy);
          ctxA.lineTo(cx + Math.cos(angle) * rayLen, cy + Math.sin(angle) * rayLen);
          ctxA.stroke();
        }
        ctxA.restore();
      }

      // 2. Albedo Map: Raised Rim (bright anorthosite) + Dark interior shadow
      const rimGrad = ctxA.createRadialGradient(cx, cy, radiusPx * 0.7, cx, cy, radiusPx * 1.25);
      rimGrad.addColorStop(0, '#2b2d30'); // crater floor
      rimGrad.addColorStop(0.7, '#3d4045');
      rimGrad.addColorStop(0.85, '#9fa6b0'); // bright rim crest
      rimGrad.addColorStop(1, 'rgba(125, 130, 138, 0)');
      ctxA.fillStyle = rimGrad;
      ctxA.beginPath();
      ctxA.arc(cx, cy, radiusPx * 1.25, 0, Math.PI * 2);
      ctxA.fill();

      // Central Peak in Albedo
      if (hasCentralPeak) {
        ctxA.fillStyle = '#b0b8c2';
        ctxA.beginPath();
        ctxA.arc(cx, cy, radiusPx * 0.18, 0, Math.PI * 2);
        ctxA.fill();
      }

      // 3. Bump/Height Map: Negative interior bowl + Positive rim crest + Central peak uplift
      // Mid-level grey is base datum (128)
      // Raised rim wall (> 128)
      const bumpGrad = ctxB.createRadialGradient(cx, cy, radiusPx * 0.2, cx, cy, radiusPx * 1.3);
      bumpGrad.addColorStop(0, hasCentralPeak ? '#808080' : '#202020'); // deep bowl
      bumpGrad.addColorStop(0.5, '#353535'); // deep floor
      bumpGrad.addColorStop(0.8, '#d0d0d0'); // elevated rim crest
      bumpGrad.addColorStop(0.95, '#f0f0f0'); // peak of crater rim
      bumpGrad.addColorStop(1, '#808080'); // returns to datum
      ctxB.fillStyle = bumpGrad;
      ctxB.beginPath();
      ctxB.arc(cx, cy, radiusPx * 1.3, 0, Math.PI * 2);
      ctxB.fill();

      // Central peak height in Bump map
      if (hasCentralPeak) {
        const peakGrad = ctxB.createRadialGradient(cx, cy, 0, cx, cy, radiusPx * 0.22);
        peakGrad.addColorStop(0, '#e8e8e8');
        peakGrad.addColorStop(1, '#808080');
        ctxB.fillStyle = peakGrad;
        ctxB.beginPath();
        ctxB.arc(cx, cy, radiusPx * 0.22, 0, Math.PI * 2);
        ctxB.fill();
      }
    };

    // --- CANVAS 1: REALISTIC LUNAR ALBEDO (TRUE COLOR) ---
    const albedoCanvas = document.createElement('canvas');
    albedoCanvas.width = width;
    albedoCanvas.height = height;
    const ctxA = albedoCanvas.getContext('2d')!;

    // --- CANVAS 2: ELEVATION BUMP MAP (CRATER MORPHOMETRY & TOPOGRAPHY) ---
    const bumpCanvas = document.createElement('canvas');
    bumpCanvas.width = width;
    bumpCanvas.height = height;
    const ctxB = bumpCanvas.getContext('2d')!;

    // 1. Base Highlands Regolith (Muted ash-grey albedo and base datum elevation)
    ctxA.fillStyle = '#7a7f87';
    ctxA.fillRect(0, 0, width, height);

    ctxB.fillStyle = '#808080'; // 128 = Lunar 1737.4 km mean datum
    ctxB.fillRect(0, 0, width, height);

    // 2. Multi-scale Regolith Micro-Texture (Fine grain mineral scatter)
    ctxA.fillStyle = 'rgba(235, 240, 248, 0.04)';
    for (let i = 0; i < 4000; i++) {
      const rx = (i * 1337) % width;
      const ry = (i * 31337) % height;
      const r = 0.5 + (i % 3) * 0.8;
      ctxA.fillRect(rx, ry, r, r);
    }

    // 3. Selenographic Maria Basins (Basaltic Dark Plains)
    // Coordinated accurately by Lunar Longitude and Latitude
    const maria = [
      // Oceanus Procellarum (Large Western basalt plane)
      { lon: -40, lat: 20, rx: 190, ry: 130, rot: -0.15 },
      { lon: -60, lat: 10, rx: 140, ry: 110, rot: 0.1 },
      // Mare Imbrium
      { lon: -16, lat: 35, rx: 125, ry: 100, rot: 0.05 },
      // Mare Serenitatis
      { lon: 18, lat: 28, rx: 90, ry: 80, rot: 0 },
      // Mare Tranquillitatis (Apollo 11 region)
      { lon: 31, lat: 8, rx: 95, ry: 85, rot: 0.2 },
      // Mare Crisium (Circular Eastern Sea)
      { lon: 59, lat: 17, rx: 65, ry: 55, rot: -0.1 },
      // Mare Fecunditatis
      { lon: 52, lat: -4, rx: 75, ry: 85, rot: 0.15 },
      // Mare Nectaris
      { lon: 35, lat: -15, rx: 55, ry: 50, rot: 0 },
      // Mare Nubium
      { lon: -15, lat: -21, rx: 85, ry: 75, rot: -0.1 },
      // Mare Humorum
      { lon: -39, lat: -24, rx: 50, ry: 48, rot: 0 },
      // South Pole - Aitken Basin (Large southern limb depression)
      { lon: 170, lat: -53, rx: 140, ry: 110, rot: 0 },
    ];

    maria.forEach(m => {
      const cx = ((m.lon + 180) / 360) * width;
      const cy = ((90 - m.lat) / 180) * height;

      // Albedo: Dark titanium-basalt fill
      ctxA.save();
      ctxA.translate(cx, cy);
      ctxA.rotate(m.rot);
      const gradA = ctxA.createRadialGradient(0, 0, 10, 0, 0, m.rx);
      gradA.addColorStop(0, '#2a2c30');
      gradA.addColorStop(0.65, '#35383d');
      gradA.addColorStop(1, 'rgba(122, 127, 135, 0)');
      ctxA.fillStyle = gradA;
      ctxA.beginPath();
      ctxA.ellipse(0, 0, m.rx, m.ry, 0, 0, Math.PI * 2);
      ctxA.fill();
      ctxA.restore();

      // Bump: Basin floor depression (-2km to -4km below datum)
      ctxB.save();
      ctxB.translate(cx, cy);
      ctxB.rotate(m.rot);
      const gradB = ctxB.createRadialGradient(0, 0, 10, 0, 0, m.rx);
      gradB.addColorStop(0, '#424242'); // depressed basin floor
      gradB.addColorStop(0.7, '#585858');
      gradB.addColorStop(1, 'rgba(128, 128, 128, 0)');
      ctxB.fillStyle = gradB;
      ctxB.beginPath();
      ctxB.ellipse(0, 0, m.rx, m.ry, 0, 0, Math.PI * 2);
      ctxB.fill();
      ctxB.restore();
    });

    // 4. Physical Impact Craters with Sloped Walls, Rims & Central Peaks
    // Major Selenographic Landmarks
    drawPhysicalCrater(ctxA, ctxB, -11.36, -43.31, 32, true, true); // TYCHO (85km, rays)
    drawPhysicalCrater(ctxA, ctxB, -20.08, 9.62, 34, true, true);  // COPERNICUS (93km, rays)
    drawPhysicalCrater(ctxA, ctxB, -38.01, 8.12, 18, false, true); // KEPLER
    drawPhysicalCrater(ctxA, ctxB, -47.49, 23.73, 22, false, true); // ARISTARCHUS (High albedo)
    drawPhysicalCrater(ctxA, ctxB, 53.64, -74.32, 20, false, false); // BOGUSLAWSKY E (Mission Target)
    drawPhysicalCrater(ctxA, ctxB, 0.00, -89.90, 16, false, false);  // SHACKLETON (South Pole)
    drawPhysicalCrater(ctxA, ctxB, 32.35, -69.37, 12, false, false); // SHIV SHAKTI (CH-3)
    drawPhysicalCrater(ctxA, ctxB, 5.1, -3.2, 26, true, false);      // PTOLEMAEUS
    drawPhysicalCrater(ctxA, ctxB, 1.1, -9.8, 22, true, false);      // ALPHONSUS
    drawPhysicalCrater(ctxA, ctxB, 1.9, -15.6, 20, true, false);     // ARZACHEL
    drawPhysicalCrater(ctxA, ctxB, 9.3, 51.6, 28, false, false);     // PLATO (Dark basalt floor)

    // Secondary and Tertiary Impact Craters
    const secondaryCraters = [
      { lon: -15, lat: -55, r: 12 }, { lon: -25, lat: -48, r: 10 },
      { lon: 45, lat: -65, r: 14 }, { lon: 62, lat: -58, r: 11 },
      { lon: -45, lat: 42, r: 13 }, { lon: -32, lat: 25, r: 9 },
      { lon: 12, lat: 48, r: 15 }, { lon: 28, lat: 55, r: 12 },
      { lon: 70, lat: 30, r: 14 }, { lon: 82, lat: -10, r: 13 },
      { lon: -75, lat: -35, r: 15 }, { lon: -82, lat: 15, r: 12 },
      { lon: 110, lat: 25, r: 16 }, { lon: 135, lat: -20, r: 18 },
      { lon: 155, lat: 45, r: 14 }, { lon: -140, lat: -30, r: 15 },
    ];
    secondaryCraters.forEach(sc => drawPhysicalCrater(ctxA, ctxB, sc.lon, sc.lat, sc.r, false, false));

    const albedoTex = new THREE.CanvasTexture(albedoCanvas);
    albedoTex.wrapS = THREE.RepeatWrapping;
    albedoTex.wrapT = THREE.ClampToEdgeWrapping;

    const bumpTex = new THREE.CanvasTexture(bumpCanvas);
    bumpTex.wrapS = THREE.RepeatWrapping;
    bumpTex.wrapT = THREE.ClampToEdgeWrapping;

    // --- CANVAS 3: SCIENTIFIC HYPSOMETRIC DEM (LOLA LASER ALTIMETER) ---
    const elevCanvas = document.createElement('canvas');
    elevCanvas.width = width;
    elevCanvas.height = height;
    const ctxE = elevCanvas.getContext('2d')!;

    // Hypsometric elevation color mapping (-8500m to +9000m)
    // Draw heightmap from bump canvas then colorize with scientific ramp
    const bumpImgData = ctxB.getImageData(0, 0, width, height);
    const elevImgData = ctxE.createImageData(width, height);
    
    // Hypsometric Color Lookup: 0 (deepest) to 255 (highest)
    for (let i = 0; i < bumpImgData.data.length; i += 4) {
      const h = bumpImgData.data[i]; // 0 to 255
      let r = 0, g = 0, b = 0;
      if (h < 50) {
        // Deep Basins / South Pole-Aitken: Purple to Dark Blue (-8000m to -4000m)
        r = Math.floor(40 + (h / 50) * 15);
        g = Math.floor(10 + (h / 50) * 40);
        b = Math.floor(80 + (h / 50) * 120);
      } else if (h < 110) {
        // Maria Basalt Floors: Navy to Cyan-Teal (-4000m to -1000m)
        const t = (h - 50) / 60;
        r = Math.floor(15 * (1 - t) + 10 * t);
        g = Math.floor(50 * (1 - t) + 140 * t);
        b = Math.floor(200 * (1 - t) + 190 * t);
      } else if (h < 160) {
        // Lunar Datum Plains: Teal to Emerald Green (-1000m to +1500m)
        const t = (h - 110) / 50;
        r = Math.floor(10 * (1 - t) + 35 * t);
        g = Math.floor(140 * (1 - t) + 185 * t);
        b = Math.floor(190 * (1 - t) + 85 * t);
      } else if (h < 210) {
        // Highlands: Olive to Golden Amber (+1500m to +5000m)
        const t = (h - 160) / 50;
        r = Math.floor(35 * (1 - t) + 215 * t);
        g = Math.floor(185 * (1 - t) + 155 * t);
        b = Math.floor(85 * (1 - t) + 30 * t);
      } else {
        // Highest Crater Rims & Peaks: Amber to Snow White (+5000m to +8500m)
        const t = (h - 210) / 45;
        r = Math.floor(215 * (1 - t) + 250 * t);
        g = Math.floor(155 * (1 - t) + 245 * t);
        b = Math.floor(30 * (1 - t) + 240 * t);
      }

      elevImgData.data[i] = r;
      elevImgData.data[i + 1] = g;
      elevImgData.data[i + 2] = b;
      elevImgData.data[i + 3] = 255;
    }
    ctxE.putImageData(elevImgData, 0, 0);

    const elevTex = new THREE.CanvasTexture(elevCanvas);

    // --- CANVAS 4: SLOPE GRADIENT MAP (DERIVED NUMERICAL GRADIENT) ---
    const slopeCanvas = document.createElement('canvas');
    slopeCanvas.width = width;
    slopeCanvas.height = height;
    const ctxS = slopeCanvas.getContext('2d')!;
    const slopeImgData = ctxS.createImageData(width, height);

    // Compute pixel gradient difference as proxy for topographic slope angle
    for (let y = 1; y < height - 1; y++) {
      for (let x = 1; x < width - 1; x++) {
        const idx = (y * width + x) * 4;
        const left = bumpImgData.data[(y * width + (x - 1)) * 4];
        const right = bumpImgData.data[(y * width + (x + 1)) * 4];
        const top = bumpImgData.data[((y - 1) * width + x) * 4];
        const bottom = bumpImgData.data[((y + 1) * width + x) * 4];

        const dx = Math.abs(right - left);
        const dy = Math.abs(bottom - top);
        const grad = Math.min(255, (dx + dy) * 4.5);

        // Green (0-5° flat) -> Yellow (5-15° rolling) -> Red (15-35° crater walls)
        let sr = 0, sg = 0, sb = 0;
        if (grad < 40) {
          sr = 15; sg = 65; sb = 35; // Flat mare: Dark green
        } else if (grad < 110) {
          sr = 160; sg = 175; sb = 30; // Rolling: Yellow-amber
        } else {
          sr = 195; sg = 45; sb = 45; // Steep crater walls: Crimson
        }

        slopeImgData.data[idx] = sr;
        slopeImgData.data[idx + 1] = sg;
        slopeImgData.data[idx + 2] = sb;
        slopeImgData.data[idx + 3] = 255;
      }
    }
    ctxS.putImageData(slopeImgData, 0, 0);
    const slopeTex = new THREE.CanvasTexture(slopeCanvas);

    // --- CANVAS 5: CRATER RELIEF MAP (GRAZING INCIDENCE HILLSHADE) ---
    const reliefCanvas = document.createElement('canvas');
    reliefCanvas.width = width;
    reliefCanvas.height = height;
    const ctxR = reliefCanvas.getContext('2d')!;
    const reliefImgData = ctxR.createImageData(width, height);

    for (let y = 1; y < height - 1; y++) {
      for (let x = 1; x < width - 1; x++) {
        const idx = (y * width + x) * 4;
        const left = bumpImgData.data[(y * width + (x - 1)) * 4];
        const right = bumpImgData.data[(y * width + (x + 1)) * 4];
        const top = bumpImgData.data[((y - 1) * width + x) * 4];
        const bottom = bumpImgData.data[((y + 1) * width + x) * 4];

        const slopeVal = (right - left) * 1.8 + (bottom - top) * 1.8;
        const shade = Math.max(0, Math.min(255, 128 + slopeVal));

        reliefImgData.data[idx] = shade;
        reliefImgData.data[idx + 1] = shade;
        reliefImgData.data[idx + 2] = shade;
        reliefImgData.data[idx + 3] = 255;
      }
    }
    ctxR.putImageData(reliefImgData, 0, 0);
    const reliefTex = new THREE.CanvasTexture(reliefCanvas);

    return { albedoTex, bumpTex, elevTex, slopeTex, reliefTex };
  };

  // ========================================================
  // INITIALIZE THREE.JS PLANETARY WORKSPACE
  // ========================================================
  useEffect(() => {
    if (!canvasContainerRef.current) return;
    const container = canvasContainerRef.current;
    const width = container.clientWidth;
    const height = container.clientHeight;

    // 1. Scene & Deep Near-Black Space Background
    const scene = new THREE.Scene();
    scene.background = new THREE.Color('#020304');

    // 2. Camera Setup (Scientific Perspective)
    const camera = new THREE.PerspectiveCamera(35, width / height, 0.1, 1000);
    camera.position.set(0, 0, 5.8);

    // 3. WebGL Renderer with High-Precision Color Management
    const renderer = new THREE.WebGLRenderer({ antialias: true, alpha: false, powerPreference: 'high-performance' });
    renderer.setSize(width, height);
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
    renderer.toneMapping = THREE.ACESFilmicToneMapping;
    renderer.toneMappingExposure = 1.15;
    renderer.shadowMap.enabled = true;
    renderer.shadowMap.type = THREE.PCFSoftShadowMap;

    container.innerHTML = '';
    container.appendChild(renderer.domElement);

    // 4. Directional Solar Illumination & Minimal Space Ambient
    // Single harsh Sun vector creating authentic crater shadows and sharp terminator
    const ambientLight = new THREE.AmbientLight(0x06080b, 0.08); // Near-zero ambient light
    scene.add(ambientLight);

    const sunLight = new THREE.DirectionalLight(0xfff8ee, 4.4); // Intense collimated solar beam
    sunLight.position.set(10, 4.5, 8);
    sunLight.castShadow = true;
    sunLight.shadow.mapSize.width = 2048;
    sunLight.shadow.mapSize.height = 2048;
    sunLight.shadow.bias = -0.0005;
    scene.add(sunLight);

    // 5. Subtle, Non-Intrusive Distant Starfield (Natural aerospace background)
    const starGeo = new THREE.BufferGeometry();
    const starCount = 950;
    const starPositions = new Float32Array(starCount * 3);
    for (let i = 0; i < starCount * 3; i += 3) {
      starPositions[i] = (Math.random() - 0.5) * 120;
      starPositions[i + 1] = (Math.random() - 0.5) * 120;
      starPositions[i + 2] = (Math.random() - 0.5) * 120;
    }
    starGeo.setAttribute('position', new THREE.BufferAttribute(starPositions, 3));
    const starMat = new THREE.PointsMaterial({ color: 0x5a626a, size: 0.05, transparent: true, opacity: 0.65 });
    const stars = new THREE.Points(starGeo, starMat);
    scene.add(stars);

    // 6. Moon Globe Group
    const moonGroup = new THREE.Group();
    scene.add(moonGroup);

    const { albedoTex, bumpTex } = createPhotorealisticLunarTextures();

    // High-resolution sphere geometry with 128x128 subdivision
    const moonRadius = 2.1;
    const moonGeo = new THREE.SphereGeometry(moonRadius, 128, 128);
    const moonMat = new THREE.MeshStandardMaterial({
      map: albedoTex,
      bumpMap: bumpTex,
      bumpScale: 0.055, // Strong physical crater rims and shadowed interiors
      roughness: 0.94,  // High photometric roughness of lunar regolith
      metalness: 0.02,
    });
    const moonMesh = new THREE.Mesh(moonGeo, moonMat);
    moonMesh.castShadow = true;
    moonMesh.receiveShadow = true;
    moonGroup.add(moonMesh);

    // 7. Lunar Body-Fixed Coordinate Graticule Grid (IAU 2015 Selenographic)
    const gridGroup = new THREE.Group();
    moonGroup.add(gridGroup);

    // Latitude Parallels (every 30°)
    [-60, -30, 0, 30, 60].forEach(lat => {
      const radiusAtLat = (moonRadius + 0.003) * Math.cos(lat * (Math.PI / 180));
      const yAtLat = (moonRadius + 0.003) * Math.sin(lat * (Math.PI / 180));
      const circleGeo = new THREE.RingGeometry(radiusAtLat - 0.0015, radiusAtLat, 96);
      const isEquator = lat === 0;
      const circleMat = new THREE.MeshBasicMaterial({ 
        color: isEquator ? 0x8d98a5 : 0x3d444d, 
        side: THREE.DoubleSide, 
        transparent: true, 
        opacity: isEquator ? 0.35 : 0.18 
      });
      const ring = new THREE.Mesh(circleGeo, circleMat);
      ring.rotation.x = Math.PI / 2;
      ring.position.y = yAtLat;
      gridGroup.add(ring);
    });

    // Longitude Meridians (every 45°)
    [0, 45, 90, 135, 180, 225, 270, 315].forEach(lon => {
      const circleGeo = new THREE.RingGeometry(moonRadius + 0.0015, moonRadius + 0.003, 96);
      const isPrime = lon === 0;
      const circleMat = new THREE.MeshBasicMaterial({ 
        color: isPrime ? 0x8d98a5 : 0x3d444d, 
        side: THREE.DoubleSide, 
        transparent: true, 
        opacity: isPrime ? 0.35 : 0.16 
      });
      const ring = new THREE.Mesh(circleGeo, circleMat);
      ring.rotation.y = lon * (Math.PI / 180);
      gridGroup.add(ring);
    });

    // 8. Physical Footprints on Lunar Surface (OHRC, TMC-2, IIRS from database)
    const footprintsGroup = new THREE.Group();
    moonGroup.add(footprintsGroup);

    // OHRC Footprint at Boguslawsky E (0.25m High-Resolution Swath)
    const ohrcPos = latLonToVector3(-74.32, 53.64, moonRadius + 0.006);
    const ohrcGeo = new THREE.PlaneGeometry(0.14, 0.24);
    const ohrcMat = new THREE.MeshBasicMaterial({ color: 0x8d98a5, side: THREE.DoubleSide, transparent: true, opacity: 0.25 });
    const ohrcMesh = new THREE.Mesh(ohrcGeo, ohrcMat);
    ohrcMesh.position.copy(ohrcPos);
    ohrcMesh.lookAt(new THREE.Vector3(0, 0, 0));
    footprintsGroup.add(ohrcMesh);

    // TMC-2 Stereo Swath at Tycho Crater (5.0m Swath)
    const tmcPos = latLonToVector3(-43.31, -11.36, moonRadius + 0.006);
    const tmcGeo = new THREE.PlaneGeometry(0.32, 0.78);
    const tmcMat = new THREE.MeshBasicMaterial({ color: 0x7e858c, side: THREE.DoubleSide, transparent: true, opacity: 0.25 });
    const tmcMesh = new THREE.Mesh(tmcGeo, tmcMat);
    tmcMesh.position.copy(tmcPos);
    tmcMesh.lookAt(new THREE.Vector3(0, 0, 0));
    footprintsGroup.add(tmcMesh);

    // IIRS Hyperspectral Strip at Shackleton Rim (80.0m Swath)
    const iirsPos = latLonToVector3(-89.90, 0, moonRadius + 0.006);
    const iirsGeo = new THREE.PlaneGeometry(0.20, 0.45);
    const iirsMat = new THREE.MeshBasicMaterial({ color: 0x8d98a5, side: THREE.DoubleSide, transparent: true, opacity: 0.25 });
    const iirsMesh = new THREE.Mesh(iirsGeo, iirsMat);
    iirsMesh.position.copy(iirsPos);
    iirsMesh.lookAt(new THREE.Vector3(0, 0, 0));
    footprintsGroup.add(iirsMesh);

    // 9. Precision Target Reticle & Selenographic Markers
    const markersGroup = new THREE.Group();
    moonGroup.add(markersGroup);

    const targetMarkerGroup = new THREE.Group();
    moonGroup.add(targetMarkerGroup);

    TARGETS.forEach(t => {
      const pos = latLonToVector3(t.lat, t.lon, moonRadius + 0.012);
      const marker = new THREE.Group();
      marker.position.copy(pos);
      marker.lookAt(new THREE.Vector3(0, 0, 0));

      // Small luminous pinpoint dot
      const dotGeo = new THREE.SphereGeometry(0.014, 12, 12);
      const dotMat = new THREE.MeshBasicMaterial({ color: t.id === 'T1' ? 0xd9dde0 : 0x7e858c });
      const dot = new THREE.Mesh(dotGeo, dotMat);
      marker.add(dot);

      // Fine concentric reticle ring
      const ringGeo = new THREE.RingGeometry(0.028, 0.034, 24);
      const ringMat = new THREE.MeshBasicMaterial({ 
        color: t.id === 'T1' ? 0xd9dde0 : 0x4a5159, 
        side: THREE.DoubleSide, 
        transparent: true, 
        opacity: 0.65 
      });
      const ring = new THREE.Mesh(ringGeo, ringMat);
      marker.add(ring);

      marker.userData = { targetId: t.id, targetData: t };
      markersGroup.add(marker);
    });

    // 10. Chandrayaan-2 100km Polar Circular Orbit (Non-glowing, technical trajectory)
    const orbitRadius = 2.45;
    const orbitPoints: THREE.Vector3[] = [];
    for (let i = 0; i <= 160; i++) {
      const theta = (i / 160) * Math.PI * 2;
      orbitPoints.push(new THREE.Vector3(
        orbitRadius * Math.sin(theta) * 0.08, // 90° Polar inclination with minimal wobble
        orbitRadius * Math.cos(theta),
        orbitRadius * Math.sin(theta) * 0.996
      ));
    }
    const orbitGeo = new THREE.BufferGeometry().setFromPoints(orbitPoints);
    const orbitMat = new THREE.LineDashedMaterial({
      color: 0x7e858c,
      dashSize: 0.05,
      gapSize: 0.03,
      transparent: true,
      opacity: 0.45
    });
    const orbitLine = new THREE.Line(orbitGeo, orbitMat);
    orbitLine.computeLineDistances();
    scene.add(orbitLine);

    // 11. Chandrayaan-2 Spacecraft Model (Realistic Gold MLI, Solar Array & High-Gain Antenna)
    const satelliteGroup = new THREE.Group();
    scene.add(satelliteGroup);

    // Spacecraft Bus (Gold Kapton MLI cuboid)
    const satBodyGeo = new THREE.BoxGeometry(0.08, 0.08, 0.11);
    const satBodyMat = new THREE.MeshStandardMaterial({ color: 0xb8860b, metalness: 0.85, roughness: 0.25 });
    const satBody = new THREE.Mesh(satBodyGeo, satBodyMat);
    satelliteGroup.add(satBody);

    // Tracking Solar Arrays (Dual blue-cell wings)
    const wingGeo = new THREE.BoxGeometry(0.24, 0.07, 0.005);
    const wingMat = new THREE.MeshStandardMaterial({ color: 0x152845, metalness: 0.9, roughness: 0.2 });
    const leftWing = new THREE.Mesh(wingGeo, wingMat);
    leftWing.position.set(-0.17, 0, 0);
    satelliteGroup.add(leftWing);

    const rightWing = new THREE.Mesh(wingGeo, wingMat);
    rightWing.position.set(0.17, 0, 0);
    satelliteGroup.add(rightWing);

    // High-Gain Parabolic Antenna Dish
    const dishGeo = new THREE.CylinderGeometry(0.035, 0.005, 0.02, 16);
    const dishMat = new THREE.MeshStandardMaterial({ color: 0xcccccc, metalness: 0.7, roughness: 0.3 });
    const dish = new THREE.Mesh(dishGeo, dishMat);
    dish.position.set(0, 0.05, 0.03);
    dish.rotation.x = Math.PI / 4;
    satelliteGroup.add(dish);

    // Optical Sensor Field-of-View Cone (Nadir Pointing Frustum)
    const frustumGeo = new THREE.ConeGeometry(0.28, 0.55, 16, 1, true);
    const frustumMat = new THREE.MeshBasicMaterial({ color: 0x7e858c, transparent: true, opacity: 0.08, side: THREE.DoubleSide });
    const sensorFrustum = new THREE.Mesh(frustumGeo, frustumMat);
    sensorFrustum.position.set(0, -0.28, 0);
    sensorFrustum.rotation.x = Math.PI;
    satelliteGroup.add(sensorFrustum);

    // 12. Camera Controls & Orbit Dynamics
    const controls = {
      isDragging: false,
      prevMousePos: { x: 0, y: 0 },
      targetRotX: 0.35,
      targetRotY: 0.9,
      rotX: 0.35,
      rotY: 0.9,
      targetZoom: 5.6,
      zoom: 5.6,
    };

    const handleMouseDown = (e: MouseEvent) => {
      controls.isDragging = true;
      controls.prevMousePos = { x: e.clientX, y: e.clientY };
    };

    const handleMouseMove = (e: MouseEvent) => {
      if (!controls.isDragging) return;
      const deltaX = e.clientX - controls.prevMousePos.x;
      const deltaY = e.clientY - controls.prevMousePos.y;
      controls.targetRotY += deltaX * 0.004;
      controls.targetRotX += deltaY * 0.004;
      controls.targetRotX = Math.max(-Math.PI / 2 + 0.05, Math.min(Math.PI / 2 - 0.05, controls.targetRotX));
      controls.prevMousePos = { x: e.clientX, y: e.clientY };
    };

    const handleMouseUp = () => {
      controls.isDragging = false;
    };

    const handleWheel = (e: WheelEvent) => {
      e.preventDefault();
      controls.targetZoom += e.deltaY * 0.003;
      controls.targetZoom = Math.max(3.2, Math.min(8.5, controls.targetZoom));
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

    let animationFrameId: number;
    let orbitAngle = 0;

    const animate = () => {
      animationFrameId = requestAnimationFrame(animate);

      // Smooth inertia damping for camera rotation and zoom
      controls.rotX += (controls.targetRotX - controls.rotX) * 0.08;
      controls.rotY += (controls.targetRotY - controls.rotY) * 0.08;
      controls.zoom += (controls.targetZoom - controls.zoom) * 0.08;

      if (autoRotate && !controls.isDragging) {
        controls.targetRotY += 0.001;
      }

      moonGroup.rotation.x = controls.rotX;
      moonGroup.rotation.y = controls.rotY;
      camera.position.z = controls.zoom;

      // Real-time Spacecraft Orbital Motion (100km polar circular orbit)
      orbitAngle += 0.005;
      const satY = orbitRadius * Math.cos(orbitAngle);
      const satZ = orbitRadius * Math.sin(orbitAngle) * 0.996;
      const satX = orbitRadius * Math.sin(orbitAngle) * 0.08;
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
      targetMarkerGroup,
      bumpTexture: bumpTex,
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

  // Update Directional Solar Vector when Sun Elevation or Azimuth changes
  useEffect(() => {
    if (!sceneRef.current) return;
    const { sunLight } = sceneRef.current;
    
    const azRad = (sunAzimuth * Math.PI) / 180;
    const elRad = (sunElevation * Math.PI) / 180;
    const dist = 12.0;

    const x = dist * Math.cos(elRad) * Math.sin(azRad);
    const y = dist * Math.sin(elRad);
    const z = dist * Math.cos(elRad) * Math.cos(azRad);

    sunLight.position.set(x, y, z);
  }, [sunAzimuth, sunElevation]);

  // Update Shading Textures when mode changes
  useEffect(() => {
    if (!sceneRef.current) return;
    const { moonMesh, bumpTexture } = sceneRef.current;
    const textures = createPhotorealisticLunarTextures();
    const mat = moonMesh.material as THREE.MeshStandardMaterial;

    if (renderMode === 'albedo') {
      mat.map = textures.albedoTex;
      mat.bumpMap = bumpTexture;
      mat.bumpScale = 0.055;
      mat.roughness = 0.94;
    } else if (renderMode === 'elevation') {
      mat.map = textures.elevTex;
      mat.bumpMap = bumpTexture;
      mat.bumpScale = 0.045;
      mat.roughness = 0.50;
    } else if (renderMode === 'slope') {
      mat.map = textures.slopeTex;
      mat.bumpMap = bumpTexture;
      mat.bumpScale = 0.035;
      mat.roughness = 0.45;
    } else if (renderMode === 'relief') {
      mat.map = textures.reliefTex;
      mat.bumpMap = bumpTexture;
      mat.bumpScale = 0.075;
      mat.roughness = 0.70;
    } else if (renderMode === 'illumination') {
      mat.map = textures.reliefTex;
      mat.bumpMap = bumpTexture;
      mat.bumpScale = 0.085;
      mat.roughness = 0.85;
    }
    mat.needsUpdate = true;
  }, [renderMode]);

  // Update Layer Visibility Toggles
  useEffect(() => {
    if (!sceneRef.current) return;
    const { orbitLine, satelliteGroup, footprintsGroup, gridGroup, markersGroup, moonMesh } = sceneRef.current;
    moonMesh.visible = layers.lunarSurface;
    orbitLine.visible = layers.orbitPath;
    satelliteGroup.visible = layers.spacecraft;
    footprintsGroup.visible = layers.ohrcCoverage || layers.tmcCoverage || layers.iirsCoverage;
    gridGroup.visible = layers.coordinateGrid;
    markersGroup.visible = layers.targetReticle;
  }, [layers]);

  // Camera Fly-to and Target Lock
  const flyToTarget = (target: LunarTarget) => {
    setSelectedTarget(target);
    if (!sceneRef.current) return;
    const { controls } = sceneRef.current;
    const phi = target.lat * (Math.PI / 180);
    const theta = -(target.lon + 180) * (Math.PI / 180);
    
    controls.targetRotX = phi;
    controls.targetRotY = theta + Math.PI / 2;
    controls.targetZoom = 4.2;
  };

  const resetCamera = () => {
    if (!sceneRef.current) return;
    const { controls } = sceneRef.current;
    controls.targetRotX = 0.35;
    controls.targetRotY = 0.9;
    controls.targetZoom = 5.6;
  };

  // Solar Incidence Angle: incidence = 90° - elevation
  const calculatedIncidence = Math.max(0, 90.0 - sunElevation).toFixed(1);

  return (
    <div className="h-screen w-screen overflow-hidden bg-[#02070D] text-[#D9DDE0] font-sans flex flex-col select-none antialiased pt-14">
      
      {/* Unified Master Transparent/Glass Navbar (Identical across all feature pages) */}
      <EdolusTopNav />

      {/* ========================================================
          2. MAIN PLANETARY WORKSPACE (70% Canvas, 30% Telemetry)
         ======================================================== */}
      <div className="flex-1 relative flex overflow-hidden">
        
        {/* 2A. LEFT COMPACT TOOLBAR (Restrained Technical Icons) */}
        <div className="absolute top-4 left-4 z-30 flex flex-col gap-1 p-1 bg-[#07090B]/90 border border-white/[0.06] rounded text-[#7E858C] text-[10px] font-mono shadow-2xl">
          <button
            onClick={() => setActiveDrawer(activeDrawer === 'targets' ? 'none' : 'targets')}
            className={`p-2 rounded flex flex-col items-center gap-1 transition-all ${
              activeDrawer === 'targets'
                ? 'bg-white/[0.08] text-[#D9DDE0] border-l-2 border-[#D9DDE0]'
                : 'hover:bg-white/[0.04] hover:text-[#D9DDE0]'
            }`}
            title="Target Regions (Boguslawsky, Tycho, Shackleton)"
          >
            <Crosshair className="w-3.5 h-3.5" />
            <span className="text-[8px] tracking-wider">TARGETS</span>
          </button>

          <button
            onClick={() => setActiveDrawer(activeDrawer === 'layers' ? 'none' : 'layers')}
            className={`p-2 rounded flex flex-col items-center gap-1 transition-all ${
              activeDrawer === 'layers'
                ? 'bg-white/[0.08] text-[#D9DDE0] border-l-2 border-[#D9DDE0]'
                : 'hover:bg-white/[0.04] hover:text-[#D9DDE0]'
            }`}
            title="Scientific Layer Manager"
          >
            <Layers className="w-3.5 h-3.5" />
            <span className="text-[8px] tracking-wider">LAYERS</span>
          </button>

          <button
            onClick={() => setActiveDrawer(activeDrawer === 'shading' ? 'none' : 'shading')}
            className={`p-2 rounded flex flex-col items-center gap-1 transition-all ${
              activeDrawer === 'shading'
                ? 'bg-white/[0.08] text-[#D9DDE0] border-l-2 border-[#D9DDE0]'
                : 'hover:bg-white/[0.04] hover:text-[#D9DDE0]'
            }`}
            title="Planetary Shading Pipeline"
          >
            <Eye className="w-3.5 h-3.5" />
            <span className="text-[8px] tracking-wider">SHADING</span>
          </button>

          <button
            onClick={() => setLayers(prev => ({ ...prev, coordinateGrid: !prev.coordinateGrid }))}
            className={`p-2 rounded flex flex-col items-center gap-1 transition-all ${
              layers.coordinateGrid ? 'text-[#D9DDE0] bg-white/[0.08]' : 'hover:bg-white/[0.04] hover:text-[#D9DDE0]'
            }`}
            title="Toggle Selenographic Coordinate Grid"
          >
            <Compass className="w-3.5 h-3.5" />
            <span className="text-[8px] tracking-wider">GRID</span>
          </button>

          <button
            onClick={() => setLayers(prev => ({ ...prev, orbitPath: !prev.orbitPath, spacecraft: !prev.spacecraft }))}
            className={`p-2 rounded flex flex-col items-center gap-1 transition-all ${
              layers.orbitPath ? 'text-[#D9DDE0] bg-white/[0.08]' : 'hover:bg-white/[0.04] hover:text-[#D9DDE0]'
            }`}
            title="Toggle Chandrayaan-2 100km Orbit"
          >
            <Orbit className="w-3.5 h-3.5" />
            <span className="text-[8px] tracking-wider">ORBIT</span>
          </button>

          <div className="h-[1px] bg-white/[0.06] my-1" />

          <button
            onClick={resetCamera}
            className="p-2 rounded hover:bg-white/[0.04] hover:text-[#D9DDE0] flex flex-col items-center gap-1"
            title="Reset Selenocentric Camera Orientation"
          >
            <RefreshCw className="w-3.5 h-3.5" />
            <span className="text-[8px] tracking-wider">RESET</span>
          </button>
        </div>

        {/* 2B. CONTEXTUAL DRAWER (TARGETS / LAYERS / SHADING) */}
        {activeDrawer === 'targets' && (
          <div className="absolute top-4 left-18 z-30 w-72 bg-[#07090B]/95 border border-white/[0.08] rounded p-3 text-xs font-mono shadow-2xl space-y-2">
            <div className="flex items-center justify-between border-b border-white/[0.06] pb-1.5 text-[#D9DDE0] text-[10px] font-bold tracking-wider">
              <span>LUNAR TARGET SITES</span>
              <span className="text-[#7E858C]">{TARGETS.length} SITES</span>
            </div>
            <div className="space-y-1 max-h-96 overflow-y-auto pr-1">
              {TARGETS.map(t => (
                <button
                  key={t.id}
                  onClick={() => {
                    flyToTarget(t);
                    setActiveDrawer('none');
                  }}
                  className={`w-full p-2 rounded text-left transition-all flex items-center justify-between border ${
                    selectedTarget.id === t.id
                      ? 'bg-white/[0.08] border-white/30 text-[#D9DDE0]'
                      : 'bg-[#0B0D0F] border-white/[0.04] text-[#7E858C] hover:text-[#D9DDE0] hover:border-white/[0.12]'
                  }`}
                >
                  <div>
                    <div className="text-[11px] font-bold text-[#D9DDE0]">{t.name}</div>
                    <div className="text-[9px] text-[#7E858C] mt-0.5">{t.latStr} • {t.lonStr}</div>
                  </div>
                  <span className="text-[9px] font-mono text-[#8D98A5]">{t.sensorResolution}</span>
                </button>
              ))}
            </div>
          </div>
        )}

        {activeDrawer === 'layers' && (
          <div className="absolute top-4 left-18 z-30 w-64 bg-[#07090B]/95 border border-white/[0.08] rounded p-3 text-xs font-mono shadow-2xl space-y-2">
            <div className="text-[#D9DDE0] text-[10px] font-bold tracking-wider border-b border-white/[0.06] pb-1.5">
              SCIENTIFIC LAYER MANAGER
            </div>
            <div className="space-y-1.5 text-[11px]">
              {[
                { key: 'lunarSurface', label: 'Lunar Surface (Regolith)', desc: '1737.4 km reference ellipsoid' },
                { key: 'ohrcCoverage', label: 'OHRC Coverage (0.25m)', desc: 'High-resolution targeted swaths' },
                { key: 'tmcCoverage', label: 'TMC-2 Coverage (5.0m)', desc: 'Stereo triplet strip mapping' },
                { key: 'iirsCoverage', label: 'IIRS Coverage (80.0m)', desc: '256-band hyperspectral cubes' },
                { key: 'orbitPath', label: 'Chandrayaan-2 Orbit', desc: '100km polar circular path' },
                { key: 'coordinateGrid', label: 'Coordinate Graticule', desc: 'Body-fixed parallels & meridians' },
                { key: 'targetReticle', label: 'Target Reticle Marker', desc: 'Luminous crosshair indicators' },
              ].map(item => (
                <label 
                  key={item.key} 
                  className="flex items-start gap-2 p-1.5 rounded hover:bg-white/[0.04] cursor-pointer transition-colors"
                >
                  <input
                    type="checkbox"
                    checked={layers[item.key as keyof typeof layers]}
                    onChange={(e) => setLayers({ ...layers, [item.key]: e.target.checked })}
                    className="mt-0.5 accent-white/70"
                  />
                  <div>
                    <div className="font-bold text-[#D9DDE0] text-[10px]">{item.label}</div>
                    <div className="text-[8px] text-[#7E858C]">{item.desc}</div>
                  </div>
                </label>
              ))}
            </div>
          </div>
        )}

        {activeDrawer === 'shading' && (
          <div className="absolute top-4 left-18 z-30 w-72 bg-[#07090B]/95 border border-white/[0.08] rounded p-3 text-xs font-mono shadow-2xl space-y-2">
            <div className="text-[#D9DDE0] text-[10px] font-bold tracking-wider border-b border-white/[0.06] pb-1.5">
              PLANETARY SHADING PIPELINE
            </div>
            <div className="space-y-1">
              {[
                { 
                  id: 'albedo', 
                  label: 'TRUE ALBEDO / OPTICAL', 
                  badge: 'DATA-DERIVED', 
                  badgeColor: 'text-[#32D39A] bg-[#32D39A]/10',
                  desc: 'Calibrated LROC WAC photometry (Basalt vs Anorthosite)' 
                },
                { 
                  id: 'elevation', 
                  label: 'ELEVATION (LOLA DEM)', 
                  badge: 'DATA-DERIVED', 
                  badgeColor: 'text-[#32D39A] bg-[#32D39A]/10',
                  desc: 'Laser altimeter hypsometric ramp (-8500m to +9000m)' 
                },
                { 
                  id: 'slope', 
                  label: 'SLOPE GRADIENT', 
                  badge: 'DERIVED', 
                  badgeColor: 'text-[#8D98A5] bg-white/[0.06]',
                  desc: 'Numerical DEM gradient (0°-35° hazard mapping)' 
                },
                { 
                  id: 'illumination', 
                  label: 'ILLUMINATION FLUX', 
                  badge: 'VISUALIZATION', 
                  badgeColor: 'text-[#C89A45] bg-[#C89A45]/10',
                  desc: 'Real-time directional cosine solar irradiance' 
                },
                { 
                  id: 'relief', 
                  label: 'CRATER RELIEF', 
                  badge: 'VISUALIZATION', 
                  badgeColor: 'text-[#C89A45] bg-[#C89A45]/10',
                  desc: 'High-contrast grazing sun hillshade enhancement' 
                },
              ].map(mode => (
                <button
                  key={mode.id}
                  onClick={() => {
                    setRenderMode(mode.id as RenderShaderMode);
                    setActiveDrawer('none');
                  }}
                  className={`w-full p-2 rounded text-left transition-all border ${
                    renderMode === mode.id
                      ? 'bg-white/[0.08] border-white/30 text-[#D9DDE0]'
                      : 'bg-[#0B0D0F] border-white/[0.04] text-[#7E858C] hover:text-[#D9DDE0]'
                  }`}
                >
                  <div className="flex items-center justify-between">
                    <span className="text-[10px] font-bold text-[#D9DDE0]">{mode.label}</span>
                    <span className={`text-[8px] px-1.5 py-0.5 rounded font-mono ${mode.badgeColor}`}>
                      {mode.badge}
                    </span>
                  </div>
                  <div className="text-[8px] text-[#7E858C] mt-0.5">{mode.desc}</div>
                </button>
              ))}
            </div>
          </div>
        )}

        {/* 2C. 3D HERO LUNAR GLOBE CANVAS */}
        <div className="flex-1 relative h-full w-full">
          <div 
            ref={canvasContainerRef} 
            className="w-full h-full cursor-grab active:cursor-grabbing bg-[#020304]"
          />

          {/* SCIENTIFIC HUD OVERLAY: TARGET LOCK & SOLAR INCIDENCE READOUT */}
          <div className="absolute top-4 right-84 lg:right-96 pointer-events-none hidden md:flex flex-col items-end text-right font-mono text-[10px] text-[#7E858C] space-y-1 bg-[#07090B]/85 p-3 rounded border border-white/[0.06] backdrop-blur-sm">
            <div className="flex items-center gap-1.5 text-[#D9DDE0] font-bold">
              <Crosshair className="w-3 h-3 text-[#8D98A5]" />
              <span>TARGET LOCK // {selectedTarget.code}</span>
            </div>
            <div>LAT: <span className="text-[#D9DDE0] font-bold">{selectedTarget.latStr}</span> | LON: <span className="text-[#D9DDE0] font-bold">{selectedTarget.lonStr}</span></div>
            <div>RELIEF: <span className="text-[#D9DDE0]">{selectedTarget.elevation}</span> | BEST GSD: <span className="text-[#32D39A]">{selectedTarget.sensorResolution}</span></div>
            <div>SOLAR INCIDENCE: <span className="text-[#C89A45] font-bold">{calculatedIncidence}°</span> | AZIMUTH: <span className="text-[#D9DDE0]">{sunAzimuth.toFixed(1)}°</span></div>
          </div>

          {/* DOCKED BOTTOM TELEMETRY STRIP (Aerospace Control Bar) */}
          <div className="absolute bottom-0 left-0 right-0 h-11 bg-[#07090B]/95 border-t border-white/[0.06] px-4 sm:px-6 flex items-center justify-between z-30 font-mono text-[11px] text-[#7E858C]">
            <div className="flex items-center gap-4 sm:gap-6 overflow-x-auto py-1">
              
              {/* Sun Azimuth Slider */}
              <div className="flex items-center gap-2">
                <span className="text-[9px] uppercase tracking-wider text-[#7E858C]">SUN AZIMUTH:</span>
                <input
                  type="range"
                  min="0"
                  max="360"
                  step="0.5"
                  value={sunAzimuth}
                  onChange={(e) => setSunAzimuth(parseFloat(e.target.value))}
                  className="w-20 sm:w-28 accent-[#C89A45] cursor-pointer"
                  title="Adjust Sun Azimuth (Crater shadows move dynamically)"
                />
                <span className="text-[#C89A45] font-bold text-xs">{sunAzimuth.toFixed(1)}°</span>
              </div>

              <div className="h-3 w-[1px] bg-white/[0.08] hidden sm:block" />

              {/* Sun Elevation Slider */}
              <div className="flex items-center gap-2">
                <span className="text-[9px] uppercase tracking-wider text-[#7E858C]">SUN ELEVATION:</span>
                <input
                  type="range"
                  min="5"
                  max="85"
                  step="0.5"
                  value={sunElevation}
                  onChange={(e) => setSunElevation(parseFloat(e.target.value))}
                  className="w-20 sm:w-28 accent-[#C89A45] cursor-pointer"
                  title="Adjust Sun Elevation (Controls terminator & shadow length)"
                />
                <span className="text-[#C89A45] font-bold text-xs">{sunElevation.toFixed(1)}°</span>
              </div>

              <div className="h-3 w-[1px] bg-white/[0.08] hidden md:block" />

              <div className="hidden md:flex items-center gap-1.5">
                <span className="text-[9px] uppercase tracking-wider text-[#7E858C]">INCIDENCE:</span>
                <span className="text-[#D9DDE0] font-bold">{calculatedIncidence}°</span>
              </div>

              <div className="h-3 w-[1px] bg-white/[0.08] hidden lg:block" />

              <div className="hidden lg:flex items-center gap-1.5">
                <span className="text-[9px] uppercase tracking-wider text-[#7E858C]">ALTITUDE:</span>
                <span className="text-[#D9DDE0] font-bold">100.18 km</span>
              </div>

              <div className="h-3 w-[1px] bg-white/[0.08] hidden xl:block" />

              <div className="hidden xl:flex items-center gap-1.5">
                <span className="text-[9px] uppercase tracking-wider text-[#7E858C]">ORBIT:</span>
                <span className="text-[#D9DDE0]">90.0° POLAR (CH-2)</span>
              </div>
            </div>

            <div className="flex items-center gap-2 shrink-0">
              <button
                onClick={() => setAutoRotate(!autoRotate)}
                className={`px-2.5 py-1 rounded text-[10px] font-mono border transition-all flex items-center gap-1.5 ${
                  autoRotate
                    ? 'bg-[#32D39A]/15 border-[#32D39A]/40 text-[#32D39A]'
                    : 'bg-[#0B0D0F] border-white/[0.06] text-[#7E858C] hover:text-[#D9DDE0]'
                }`}
              >
                {autoRotate ? <Pause className="w-3 h-3" /> : <Play className="w-3 h-3" />}
                <span>ROTATION {autoRotate ? 'ON' : 'OFF'}</span>
              </button>
            </div>
          </div>
        </div>

        {/* 2E. RIGHT MISSION TELEMETRY RAIL (Industrial Planetary Science Panel) */}
        <div className="w-80 lg:w-96 bg-[#07090B] border-l border-white/[0.06] flex flex-col z-30 shrink-0 overflow-y-auto">
          
          {/* Target Header Block */}
          <div className="p-4 border-b border-white/[0.06] space-y-1.5 bg-[#0B0D0F]">
            <div className="flex items-center justify-between text-[9px] font-mono tracking-widest text-[#7E858C] uppercase">
              <div className="flex items-center gap-1.5">
                <span className="w-1.5 h-1.5 rounded-full bg-[#8D98A5]" />
                <span>PLANETARY TARGET TELEMETRY</span>
              </div>
              <span className="text-[#D9DDE0] font-bold">{selectedTarget.code}</span>
            </div>
            
            <h2 className="text-sm font-bold text-[#D9DDE0] tracking-tight font-mono">
              {selectedTarget.name}
            </h2>
            
            <p className="text-[10px] text-[#7E858C] font-mono leading-relaxed">
              {selectedTarget.description}
            </p>
          </div>

          {/* Selenodesy & Geodetic Readout Matrix */}
          <div className="p-4 border-b border-white/[0.06] space-y-3 font-mono text-xs">
            <div className="text-[9px] tracking-widest text-[#7E858C] uppercase">
              GEODETIC READOUT & SELENODESY
            </div>

            <div className="grid grid-cols-2 gap-x-3 gap-y-2 bg-[#020304] p-3 rounded border border-white/[0.04]">
              <div>
                <span className="text-[9px] text-[#7E858C] block uppercase">LATITUDE</span>
                <span className="text-[#D9DDE0] font-bold text-xs">{selectedTarget.latStr}</span>
              </div>
              <div>
                <span className="text-[9px] text-[#7E858C] block uppercase">LONGITUDE</span>
                <span className="text-[#D9DDE0] font-bold text-xs">{selectedTarget.lonStr}</span>
              </div>
              <div>
                <span className="text-[9px] text-[#7E858C] block uppercase">FLOOR ELEVATION</span>
                <span className="text-[#D9DDE0] font-bold text-xs">{selectedTarget.elevation}</span>
              </div>
              <div>
                <span className="text-[9px] text-[#7E858C] block uppercase">CRATER DEPTH</span>
                <span className="text-[#D9DDE0] font-bold text-xs">{selectedTarget.depth}</span>
              </div>
              <div>
                <span className="text-[9px] text-[#7E858C] block uppercase">DIAMETER</span>
                <span className="text-[#D9DDE0] font-bold text-xs">{selectedTarget.diameter}</span>
              </div>
              <div>
                <span className="text-[9px] text-[#7E858C] block uppercase">BEST RESOLUTION</span>
                <span className="text-[#32D39A] font-bold text-xs">{selectedTarget.sensorResolution}</span>
              </div>
              <div className="col-span-2 pt-1.5 border-t border-white/[0.04]">
                <span className="text-[9px] text-[#7E858C] block uppercase">OPTICAL SENSORS</span>
                <span className="text-[#D9DDE0] text-[11px]">{selectedTarget.instruments}</span>
              </div>
              <div className="col-span-2">
                <span className="text-[9px] text-[#7E858C] block uppercase">FOOTPRINT PRODUCT ID</span>
                <span className="text-[#7E858C] text-[10px] truncate block">{selectedTarget.footprintId}</span>
              </div>
            </div>
          </div>

          {/* SCIENTIFIC TOPOGRAPHIC CROSS-SECTION (LOLA-DEM) */}
          <div className="p-4 border-b border-white/[0.06] space-y-2 font-mono text-xs">
            <div className="flex items-center justify-between text-[9px] tracking-widest text-[#7E858C] uppercase">
              <span>TOPOGRAPHIC PROFILE (LALT/LOLA)</span>
              <span className="text-[#7E858C]">1:1000 RELIEF</span>
            </div>

            <div className="bg-[#020304] p-3 rounded border border-white/[0.04] space-y-2">
              <div className="h-18 w-full relative flex items-end">
                {/* Thin coordinate grid lines */}
                <div className="absolute inset-0 grid grid-cols-4 grid-rows-3 opacity-10 pointer-events-none">
                  <div className="border-r border-b border-white" />
                  <div className="border-r border-b border-white" />
                  <div className="border-r border-b border-white" />
                  <div className="border-b border-white" />
                  <div className="border-r border-b border-white" />
                  <div className="border-r border-b border-white" />
                  <div className="border-r border-b border-white" />
                  <div className="border-b border-white" />
                  <div className="border-r border-b border-white" />
                  <div className="border-r border-b border-white" />
                  <div className="border-r border-b border-white" />
                  <div />
                </div>

                <svg className="w-full h-full overflow-visible" viewBox="0 0 100 40" preserveAspectRatio="none">
                  <defs>
                    <linearGradient id="sciTopGrad" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="0%" stopColor="#D9DDE0" stopOpacity="0.08" />
                      <stop offset="100%" stopColor="#D9DDE0" stopOpacity="0.0" />
                    </linearGradient>
                  </defs>
                  <path
                    d="M 0 14 Q 16 18, 30 11 Q 38 38, 50 38 Q 62 38, 70 11 Q 84 18, 100 14 L 100 40 L 0 40 Z"
                    fill="url(#sciTopGrad)"
                  />
                  <path
                    d="M 0 14 Q 16 18, 30 11 Q 38 38, 50 38 Q 62 38, 70 11 Q 84 18, 100 14"
                    fill="none"
                    stroke="#D9DDE0"
                    strokeWidth="1.0"
                  />
                  <line x1="50" y1="0" x2="50" y2="40" stroke="#7E858C" strokeWidth="0.8" strokeDasharray="2,2" />
                </svg>
              </div>

              <div className="flex justify-between text-[8px] font-mono text-[#7E858C]">
                <span>WEST RIM ({selectedTarget.rimWest})</span>
                <span className="text-[#D9DDE0]">FLOOR ({selectedTarget.floorDepth})</span>
                <span>EAST RIM ({selectedTarget.rimEast})</span>
              </div>
            </div>
          </div>

          {/* Quick Target Switcher */}
          <div className="p-4 border-b border-white/[0.06] space-y-2 font-mono text-xs">
            <div className="text-[9px] tracking-widest text-[#7E858C] uppercase">
              SELECT LUNAR REGION
            </div>
            <div className="grid grid-cols-2 gap-1.5">
              {TARGETS.map(t => (
                <button
                  key={t.id}
                  onClick={() => flyToTarget(t)}
                  className={`p-1.5 rounded text-[10px] text-left truncate transition-all border ${
                    selectedTarget.id === t.id
                      ? 'bg-white/[0.08] border-white/30 text-[#D9DDE0] font-bold'
                      : 'bg-[#0B0D0F] border-white/[0.04] text-[#7E858C] hover:text-[#D9DDE0] hover:border-white/[0.12]'
                  }`}
                >
                  <span className={`w-1.5 h-1.5 rounded-full inline-block mr-1.5 ${selectedTarget.id === t.id ? 'bg-[#D9DDE0]' : 'bg-[#7E858C]'}`} />
                  {t.name.split(' ')[0]}
                </button>
              ))}
            </div>
          </div>

          {/* Direct Workflow: Run Correspondence & Scientific Analysis */}
          <div className="p-4 space-y-2 font-mono text-xs mt-auto">
            <div className="text-[9px] tracking-widest text-[#7E858C] uppercase mb-1">
              CONNECTED SCIENTIFIC PIPELINE
            </div>

            {/* Run Correspondence Action Button */}
            <Link
              href={`/correspondence?source=${selectedTarget.sourceProductId}&target=${selectedTarget.targetProductId}`}
              className="w-full py-2.5 rounded bg-white/[0.06] hover:bg-white/[0.12] border border-white/20 text-[#D9DDE0] hover:text-white font-bold text-[11px] uppercase tracking-wider flex items-center justify-center gap-2 transition-all cursor-pointer"
            >
              <GitCompare className="w-3.5 h-3.5" />
              <span>RUN CORRESPONDENCE FOR THIS REGION →</span>
            </Link>

            <div className="p-2 rounded bg-[#020304] border border-white/[0.04] text-[9px] text-[#7E858C] space-y-0.5">
              <div>AVAILABLE MATCH: <strong className="text-[#D9DDE0]">{selectedTarget.matchPayload}</strong></div>
              <div>METRICS: <span className="text-[#32D39A]">{selectedTarget.matchRatio}</span> • <span className="text-[#C89A45]">{selectedTarget.sunDelta}</span></div>
            </div>

            <Link
              href={`/reports`}
              className="w-full py-2 rounded bg-white/[0.03] hover:bg-white/[0.06] border border-white/[0.06] text-[#7E858C] hover:text-[#D9DDE0] text-[10px] uppercase tracking-wider flex items-center justify-center gap-2 transition-all"
            >
              <FileText className="w-3 h-3 text-[#7E858C]" />
              <span>GENERATE PDS4 SCIENTIFIC REPORT</span>
            </Link>
          </div>

        </div>

      </div>
    </div>
  );
}
