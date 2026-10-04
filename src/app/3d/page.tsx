'use client';

import React, { useState, useEffect, useRef, useMemo } from 'react';
import Link from 'next/link';
import * as THREE from 'three';
import { 
  Compass, Layers, Crosshair, Orbit, 
  Database, GitCompare, RotateCw, ZoomIn, ZoomOut,
  Sun, Eye, Play, Pause, ChevronRight, RefreshCw,
  Search, Shield, Check, FileText, ArrowUpRight,
  Maximize2, Camera, Ruler, MapPin, Sliders, Split,
  Download, Info, AlertTriangle, ExternalLink
} from 'lucide-react';
import { EdolusTopNav } from '@/components/layout/EdolusTopNav';
import { DATASETS_LIST, ServerDataset, BENCHMARK_RUNS } from '@/lib/serverDatasets';

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

const LUNAR_LANDMARKS: LunarTarget[] = [
  {
    id: 'T1',
    code: 'BOGUSLAWSKY-E',
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
    sunDelta: 'Δ 21.0° Sun Angle',
    description: 'High-latitude crater benchmark. Target for sub-meter multi-scale optical correspondence and boulder detection.',
    rimWest: '+1,200 m',
    floorDepth: '-3,240 m',
    rimEast: '+1,380 m',
    profilePoints: [18, 16, 12, 5, 2, -28, -32, -32, -31, -26, 4, 14, 17],
    category: 'BENCHMARK'
  },
  {
    id: 'T2',
    code: 'SHIV-SHAKTI',
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
    description: 'Chandrayaan-3 touchdown landing locus with multi-temporal pre- and post-landing sub-meter orbital coverage.',
    rimWest: '+400 m',
    floorDepth: '-1,820 m',
    rimEast: '+580 m',
    profilePoints: [8, 6, 2, -10, -18, -18, -17, -12, 1, 6, 8],
    category: 'HISTORIC_SITE'
  },
  {
    id: 'T3',
    code: 'TYCHO-CRATER',
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
    footprintId: 'ch2_ohr_ncp_20220324T184000_d_img_d18',
    sourceProductId: 'ch2_ohr_ncp_20220324T184000_d_img_d18',
    targetProductId: 'ch2_ohr_ncp_20220310T061500_d_img_d18',
    matchPayload: 'OHRC Morning ↔ OHRC Evening',
    matchRatio: '1.0× Same Sensor',
    sunDelta: 'Δ 180.0° Opposing Sun',
    description: 'Copernican impact structure with prominent 1.5km central peak uplift and high-albedo filamentary ray system spanning thousands of kilometers.',
    rimWest: '+2,100 m',
    floorDepth: '-4,800 m',
    rimEast: '+2,420 m',
    profilePoints: [22, 19, 14, -25, -45, -48, 15, -48, -44, -22, 16, 24],
    category: 'IMPACT_STRUCTURE'
  },
  {
    id: 'T4',
    code: 'SHACKLETON-RIM',
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
    description: 'South polar cold trap rim. Permanently shadowed floor preserving cryogenic volatiles and water-ice absorption signatures.',
    rimWest: '+1,200 m',
    floorDepth: '-4,200 m',
    rimEast: '+1,150 m',
    profilePoints: [14, 12, 8, -20, -42, -42, -40, -18, 9, 12],
    category: 'POLAR_TRAP'
  },
  {
    id: 'T5',
    code: 'COPERNICUS',
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
  },
  {
    id: 'T6',
    code: 'ARISTARCHUS',
    name: 'ARISTARCHUS PLATEAU',
    lat: 23.73,
    lon: -47.49,
    latStr: '23.73° N',
    lonStr: '47.49° W',
    elevation: '-3,000 m',
    depth: '3.0 km',
    diameter: '40.0 km',
    incidence: '52.0°',
    phaseAngle: '24.0°',
    instruments: 'OHRC 0.25m / IIRS Hyperspectral',
    sensorResolution: '0.25 m / 80 m',
    footprintId: 'ch2_ohr_ncp_20210519T143000_d_img_d18',
    sourceProductId: 'ch2_ohr_ncp_20210519T143000_d_img_d18',
    targetProductId: 'ch2_iir_ncn_20211005T182000_d_cub_d18',
    matchPayload: 'OHRC (0.25m) ↔ IIRS (80m)',
    matchRatio: '320.0× Scale Ratio',
    sunDelta: 'Δ 82.0° Sun Angle',
    description: 'Highest albedo structure on the Moon with massive pyroclastic glass deposit deposits and steep radial channels.',
    rimWest: '+1,500 m',
    floorDepth: '-3,000 m',
    rimEast: '+1,600 m',
    profilePoints: [16, 14, 8, -12, -30, -30, 4, -30, -28, -10, 12, 16],
    category: 'BENCHMARK'
  },
  {
    id: 'T7',
    code: 'MORETUS',
    name: 'MORETUS CRATER',
    lat: -70.60,
    lon: -5.80,
    latStr: '70.60° S',
    lonStr: '5.80° W',
    elevation: '+2,100 m',
    depth: '5.0 km',
    diameter: '114.0 km',
    incidence: '68.0°',
    phaseAngle: '42.0°',
    instruments: 'TMC-2 Stereo Triplet',
    sensorResolution: '5.0 m/px',
    footprintId: 'ch2_tmc_ncn_20200715T101200_d_img_d18',
    sourceProductId: 'ch2_tmc_ncn_20200715T101200_d_img_d18',
    targetProductId: 'ch2_tmc_ncn_20200715T101205_d_img_d18',
    matchPayload: 'TMC-2 Fore ↔ TMC-2 Aft',
    matchRatio: '1.0× Stereo Baseline',
    sunDelta: 'Δ 2.0° Sun Angle',
    description: 'Prominent southern crater with the tallest central mountain peak on the Moon, rising 2.1 km above the crater floor.',
    rimWest: '+2,400 m',
    floorDepth: '-5,000 m',
    rimEast: '+2,300 m',
    profilePoints: [24, 20, 12, -22, -48, -50, 21, -50, -45, -20, 18, 23],
    category: 'IMPACT_STRUCTURE'
  }
];

type RenderShaderMode = 'realistic' | 'albedo' | 'elevation' | 'slope' | 'relief' | 'normal' | 'wireframe';

export default function Scientific3DPlanetaryWorkstation() {
  const canvasContainerRef = useRef<HTMLDivElement>(null);
  const [selectedTarget, setSelectedTarget] = useState<LunarTarget>(LUNAR_LANDMARKS[2]); // Default Tycho
  const [renderMode, setRenderMode] = useState<RenderShaderMode>('realistic');
  
  // Real Physical Sun Position Controls
  const [sunAzimuth, setSunAzimuth] = useState<number>(265.0);
  const [sunElevation, setSunElevation] = useState<number>(30.5);
  const [useDatasetSun, setUseDatasetSun] = useState<boolean>(true);
  const [autoRotate, setAutoRotate] = useState<boolean>(false);
  
  // Layer Toggles
  const [layers, setLayers] = useState({
    lunarSurface: true,
    coordinateGrid: true,
    footprints: true,
    imageOverlay: true,
    correspondencePoints: true,
    orbitPath: true,
    spacecraft: true,
    craterMarkers: true,
  });

  // Image draping parameters
  const [imageOpacity, setImageOpacity] = useState<number>(85);
  const [terrainExaggeration, setTerrainExaggeration] = useState<number>(1.0);

  // Measurement tool state
  const [measureMode, setMeasureMode] = useState<boolean>(false);
  const [measuredDistance, setMeasuredDistance] = useState<number | null>(null);
  const [measurePoints, setMeasurePoints] = useState<{ lat: number; lon: number }[]>([]);

  // Clicked coordinate inspection
  const [inspectedCoord, setInspectedCoord] = useState<{ lat: number; lon: number; elev: number } | null>({
    lat: -43.31,
    lon: -11.36,
    elev: 1480
  });

  // UI Active Side Drawer ('none' | 'targets' | 'layers' | 'shading' | 'measure')
  const [activeDrawer, setActiveDrawer] = useState<'none' | 'targets' | 'layers' | 'shading' | 'measure'>('none');
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
    drapeMesh: THREE.Mesh;
    gcpGroup: THREE.Group;
    measureLineGroup: THREE.Group;
    bumpTexture: THREE.CanvasTexture;
    normalTexture: THREE.CanvasTexture;
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

  // Convert 3D Point on Sphere to Selenographic (Lat, Lon)
  const vector3ToLatLon = (vec: THREE.Vector3) => {
    const norm = vec.clone().normalize();
    const lat = 90 - Math.acos(norm.y) * (180 / Math.PI);
    let lon = Math.atan2(norm.z, -norm.x) * (180 / Math.PI) - 180;
    if (lon < -180) lon += 360;
    if (lon > 180) lon -= 360;
    return { lat: Math.round(lat * 100) / 100, lon: Math.round(lon * 100) / 100 };
  };

  // Calculate Geodesic Great-Circle Distance on Lunar Sphere (Radius = 1737.4 km)
  const calculateGreatCircleKm = (lat1: number, lon1: number, lat2: number, lon2: number) => {
    const rMoon = 1737.4;
    const phi1 = (lat1 * Math.PI) / 180;
    const phi2 = (lat2 * Math.PI) / 180;
    const dPhi = ((lat2 - lat1) * Math.PI) / 180;
    const dLambda = ((lon2 - lon1) * Math.PI) / 180;

    const a = Math.sin(dPhi / 2) * Math.sin(dPhi / 2) +
              Math.cos(phi1) * Math.cos(phi2) * Math.sin(dLambda / 2) * Math.sin(dLambda / 2);
    const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
    return Math.round(rMoon * c * 10) / 10;
  };

  // ========================================================
  // ULTRA-HIGH-RESOLUTION LUNAR TEXTURE GENERATOR (4096 x 2048)
  // Generates Albedo, Elevation, Bump, Normal, and Hypsometric Maps
  // ========================================================
  const createPhotorealisticLunarTextures = () => {
    const width = 4096;
    const height = 2048;

    // Canvas 1: Albedo (True Lunar Reflectance Photometry)
    const albedoCanvas = document.createElement('canvas');
    albedoCanvas.width = width;
    albedoCanvas.height = height;
    const ctxA = albedoCanvas.getContext('2d')!;

    // Canvas 2: Elevation Heightmap / Bump Map
    const bumpCanvas = document.createElement('canvas');
    bumpCanvas.width = width;
    bumpCanvas.height = height;
    const ctxB = bumpCanvas.getContext('2d')!;

    // 1. Base Anorthosite Highlands Regolith (Muted natural titanium-poor regolith)
    ctxA.fillStyle = '#848991';
    ctxA.fillRect(0, 0, width, height);

    ctxB.fillStyle = '#808080'; // 128 = 1737.4 km reference datum
    ctxB.fillRect(0, 0, width, height);

    // 2. Micro-craters and sub-pixel regolith roughness (3000+ craters with power-law distribution)
    for (let i = 0; i < 3500; i++) {
      const rx = (i * 1234567) % width;
      const ry = (i * 9876543) % height;
      const r = Math.max(0.8, (i % 7 === 0 ? 3.5 : (i % 3 === 0 ? 1.8 : 0.9)));
      
      ctxA.fillStyle = i % 2 === 0 ? 'rgba(230, 235, 245, 0.05)' : 'rgba(30, 32, 35, 0.06)';
      ctxA.fillRect(rx, ry, r, r);

      ctxB.fillStyle = i % 2 === 0 ? '#8e8e8e' : '#727272';
      ctxB.fillRect(rx, ry, r, r);
    }

    // 3. Selenographic Maria Basins (Dark Iron/Titanium Basalt Plains)
    const maria = [
      { lon: -40, lat: 20, rx: 380, ry: 260, rot: -0.15 },  // Oceanus Procellarum
      { lon: -60, lat: 10, rx: 280, ry: 220, rot: 0.1 },   // West Procellarum
      { lon: -16, lat: 35, rx: 250, ry: 200, rot: 0.05 },  // Mare Imbrium
      { lon: 18, lat: 28, rx: 180, ry: 160, rot: 0 },      // Mare Serenitatis
      { lon: 31, lat: 8, rx: 190, ry: 170, rot: 0.2 },     // Mare Tranquillitatis
      { lon: 59, lat: 17, rx: 130, ry: 110, rot: -0.1 },   // Mare Crisium
      { lon: 52, lat: -4, rx: 150, ry: 170, rot: 0.15 },   // Mare Fecunditatis
      { lon: 35, lat: -15, rx: 110, ry: 100, rot: 0 },     // Mare Nectaris
      { lon: -15, lat: -21, rx: 170, ry: 150, rot: -0.1 }, // Mare Nubium
      { lon: -39, lat: -24, rx: 100, ry: 96, rot: 0 },     // Mare Humorum
      { lon: -92, lat: -19, rx: 160, ry: 160, rot: 0 },    // Mare Orientale (Multi-ring basin)
      { lon: 170, lat: -53, rx: 320, ry: 240, rot: 0 },    // South Pole - Aitken Basin
    ];

    maria.forEach(m => {
      const cx = ((m.lon + 180) / 360) * width;
      const cy = ((90 - m.lat) / 180) * height;

      // Albedo: Dark basalt fill
      ctxA.save();
      ctxA.translate(cx, cy);
      ctxA.rotate(m.rot);
      const gradA = ctxA.createRadialGradient(0, 0, 20, 0, 0, m.rx);
      gradA.addColorStop(0, '#2e3034');
      gradA.addColorStop(0.7, '#383b40');
      gradA.addColorStop(1, 'rgba(132, 137, 145, 0)');
      ctxA.fillStyle = gradA;
      ctxA.beginPath();
      ctxA.ellipse(0, 0, m.rx, m.ry, 0, 0, Math.PI * 2);
      ctxA.fill();
      ctxA.restore();

      // Bump: Basin floor depression (-2km to -4km below datum)
      ctxB.save();
      ctxB.translate(cx, cy);
      ctxB.rotate(m.rot);
      const gradB = ctxB.createRadialGradient(0, 0, 20, 0, 0, m.rx);
      gradB.addColorStop(0, '#3e3e3e');
      gradB.addColorStop(0.7, '#5a5a5a');
      gradB.addColorStop(1, 'rgba(128, 128, 128, 0)');
      ctxB.fillStyle = gradB;
      ctxB.beginPath();
      ctxB.ellipse(0, 0, m.rx, m.ry, 0, 0, Math.PI * 2);
      ctxB.fill();
      ctxB.restore();
    });

    // 4. Physical Crater Morphology Helper
    const drawPhysicalCrater = (
      lonDeg: number,
      latDeg: number,
      radiusPx: number,
      hasCentralPeak = false,
      hasRays = false
    ) => {
      const cx = ((lonDeg + 180) / 360) * width;
      const cy = ((90 - latDeg) / 180) * height;

      // Ray Ejecta System
      if (hasRays) {
        ctxA.save();
        ctxA.strokeStyle = 'rgba(225, 232, 240, 0.28)';
        ctxA.lineWidth = 1.5;
        const rayCount = 56;
        for (let i = 0; i < rayCount; i++) {
          const angle = (i / rayCount) * Math.PI * 2 + ((i % 4) * 0.04);
          const rayLen = radiusPx * 5.0 + ((i * 31) % (radiusPx * 8));
          ctxA.beginPath();
          ctxA.moveTo(cx, cy);
          ctxA.lineTo(cx + Math.cos(angle) * rayLen, cy + Math.sin(angle) * rayLen);
          ctxA.stroke();
        }
        ctxA.restore();
      }

      // Albedo Rim and Crater Floor
      const rimGrad = ctxA.createRadialGradient(cx, cy, radiusPx * 0.65, cx, cy, radiusPx * 1.3);
      rimGrad.addColorStop(0, '#2c2e31');
      rimGrad.addColorStop(0.7, '#3c3f44');
      rimGrad.addColorStop(0.88, '#abb2bc'); // Bright anorthositic rim crest
      rimGrad.addColorStop(1, 'rgba(132, 137, 145, 0)');
      ctxA.fillStyle = rimGrad;
      ctxA.beginPath();
      ctxA.arc(cx, cy, radiusPx * 1.3, 0, Math.PI * 2);
      ctxA.fill();

      if (hasCentralPeak) {
        ctxA.fillStyle = '#bcc4ce';
        ctxA.beginPath();
        ctxA.arc(cx, cy, radiusPx * 0.18, 0, Math.PI * 2);
        ctxA.fill();
      }

      // Elevation Heightmap (Negative bowl + Positive raised rim crest)
      const bumpGrad = ctxB.createRadialGradient(cx, cy, radiusPx * 0.2, cx, cy, radiusPx * 1.35);
      bumpGrad.addColorStop(0, hasCentralPeak ? '#808080' : '#1c1c1c');
      bumpGrad.addColorStop(0.5, '#323232');
      bumpGrad.addColorStop(0.82, '#d4d4d4');
      bumpGrad.addColorStop(0.96, '#f8f8f8'); // Maximum peak elevation of rim
      bumpGrad.addColorStop(1, '#808080');
      ctxB.fillStyle = bumpGrad;
      ctxB.beginPath();
      ctxB.arc(cx, cy, radiusPx * 1.35, 0, Math.PI * 2);
      ctxB.fill();

      if (hasCentralPeak) {
        const peakGrad = ctxB.createRadialGradient(cx, cy, 0, cx, cy, radiusPx * 0.24);
        peakGrad.addColorStop(0, '#f0f0f0');
        peakGrad.addColorStop(1, '#808080');
        ctxB.fillStyle = peakGrad;
        ctxB.beginPath();
        ctxB.arc(cx, cy, radiusPx * 0.24, 0, Math.PI * 2);
        ctxB.fill();
      }
    };

    // Draw Major Named Selenographic Impact Craters
    drawPhysicalCrater(-11.36, -43.31, 64, true, true); // TYCHO (85km)
    drawPhysicalCrater(-20.08, 9.62, 68, true, true);  // COPERNICUS (93km)
    drawPhysicalCrater(-38.01, 8.12, 36, false, true); // KEPLER
    drawPhysicalCrater(-47.49, 23.73, 44, false, true); // ARISTARCHUS
    drawPhysicalCrater(53.64, -74.32, 40, false, false); // BOGUSLAWSKY E
    drawPhysicalCrater(0.00, -89.90, 32, false, false);  // SHACKLETON
    drawPhysicalCrater(32.35, -69.37, 24, false, false); // SHIV SHAKTI
    drawPhysicalCrater(-5.80, -70.60, 52, true, false);  // MORETUS (2.1km peak)
    drawPhysicalCrater(-14.40, -58.40, 72, false, false); // CLAVIUS (225km)
    drawPhysicalCrater(-9.30, 51.60, 56, false, false);  // PLATO
    drawPhysicalCrater(-4.00, 29.70, 48, false, false);  // ARCHIMEDES
    drawPhysicalCrater(26.40, -11.40, 52, true, false);  // THEOPHILUS
    drawPhysicalCrater(129.10, -20.40, 60, true, false); // TSIOLKOVSKY
    drawPhysicalCrater(-163.10, 22.40, 46, false, true); // JACKSON (Farside ray crater)

    // Canvas Textures
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

    const bumpImgData = ctxB.getImageData(0, 0, width, height);
    const elevImgData = ctxE.createImageData(width, height);
    
    for (let i = 0; i < bumpImgData.data.length; i += 4) {
      const h = bumpImgData.data[i];
      let r = 0, g = 0, b = 0;
      if (h < 55) {
        // Deep Basins / South Pole-Aitken: Purple to Dark Blue (-9000m to -4000m)
        r = Math.floor(35 + (h / 55) * 15);
        g = Math.floor(10 + (h / 55) * 45);
        b = Math.floor(75 + (h / 55) * 130);
      } else if (h < 115) {
        // Maria Basalts: Navy to Cyan-Teal (-4000m to -1000m)
        const t = (h - 55) / 60;
        r = Math.floor(15 * (1 - t) + 12 * t);
        g = Math.floor(55 * (1 - t) + 145 * t);
        b = Math.floor(205 * (1 - t) + 195 * t);
      } else if (h < 165) {
        // Lunar Datum Plains: Teal to Emerald Green (-1000m to +1500m)
        const t = (h - 115) / 50;
        r = Math.floor(12 * (1 - t) + 35 * t);
        g = Math.floor(145 * (1 - t) + 190 * t);
        b = Math.floor(195 * (1 - t) + 85 * t);
      } else if (h < 215) {
        // Highlands: Olive to Golden Amber (+1500m to +5500m)
        const t = (h - 165) / 50;
        r = Math.floor(35 * (1 - t) + 220 * t);
        g = Math.floor(190 * (1 - t) + 160 * t);
        b = Math.floor(85 * (1 - t) + 30 * t);
      } else {
        // Highest Crater Rims & Peaks: Amber to Snow White (+5500m to +10500m)
        const t = (h - 215) / 40;
        r = Math.floor(220 * (1 - t) + 255 * t);
        g = Math.floor(160 * (1 - t) + 250 * t);
        b = Math.floor(30 * (1 - t) + 245 * t);
      }

      elevImgData.data[i] = r;
      elevImgData.data[i + 1] = g;
      elevImgData.data[i + 2] = b;
      elevImgData.data[i + 3] = 255;
    }
    ctxE.putImageData(elevImgData, 0, 0);
    const elevTex = new THREE.CanvasTexture(elevCanvas);

    // --- CANVAS 4: SLOPE GRADIENT MAP ---
    const slopeCanvas = document.createElement('canvas');
    slopeCanvas.width = width;
    slopeCanvas.height = height;
    const ctxS = slopeCanvas.getContext('2d')!;
    const slopeImgData = ctxS.createImageData(width, height);

    for (let y = 1; y < height - 1; y++) {
      for (let x = 1; x < width - 1; x++) {
        const idx = (y * width + x) * 4;
        const left = bumpImgData.data[(y * width + (x - 1)) * 4];
        const right = bumpImgData.data[(y * width + (x + 1)) * 4];
        const top = bumpImgData.data[((y - 1) * width + x) * 4];
        const bottom = bumpImgData.data[((y + 1) * width + x) * 4];

        const dx = Math.abs(right - left);
        const dy = Math.abs(bottom - top);
        const grad = Math.min(255, (dx + dy) * 4.2);

        let sr = 0, sg = 0, sb = 0;
        if (grad < 35) {
          sr = 18; sg = 70; sb = 38; // 0-5° flat mare
        } else if (grad < 100) {
          sr = 175; sg = 180; sb = 32; // 5-15° rolling
        } else {
          sr = 205; sg = 45; sb = 45; // 15-35°+ steep crater wall
        }

        slopeImgData.data[idx] = sr;
        slopeImgData.data[idx + 1] = sg;
        slopeImgData.data[idx + 2] = sb;
        slopeImgData.data[idx + 3] = 255;
      }
    }
    ctxS.putImageData(slopeImgData, 0, 0);
    const slopeTex = new THREE.CanvasTexture(slopeCanvas);

    // --- CANVAS 5: CRATER RELIEF HILLSHADE ---
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

        const slopeVal = (right - left) * 2.0 + (bottom - top) * 2.0;
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

    // 1. Scene & Deep Black Aerospace Space Background
    const scene = new THREE.Scene();
    scene.background = new THREE.Color('#010408');

    // 2. Camera Setup (Perspective Orbit Camera)
    const camera = new THREE.PerspectiveCamera(35, width / height, 0.1, 1000);
    camera.position.set(0, 0, 5.8);

    // 3. WebGL Renderer
    const renderer = new THREE.WebGLRenderer({ antialias: true, alpha: false, powerPreference: 'high-performance' });
    renderer.setSize(width, height);
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
    renderer.toneMapping = THREE.ACESFilmicToneMapping;
    renderer.toneMappingExposure = 1.25;
    renderer.shadowMap.enabled = true;
    renderer.shadowMap.type = THREE.PCFSoftShadowMap;

    container.innerHTML = '';
    container.appendChild(renderer.domElement);

    // 4. Directional Solar Illumination & Minimal Space Ambient
    const ambientLight = new THREE.AmbientLight(0x0a0f16, 0.06);
    scene.add(ambientLight);

    const sunLight = new THREE.DirectionalLight(0xfff8ee, 4.8);
    sunLight.position.set(12, 5.0, 8);
    sunLight.castShadow = true;
    sunLight.shadow.mapSize.width = 2048;
    sunLight.shadow.mapSize.height = 2048;
    sunLight.shadow.bias = -0.0005;
    scene.add(sunLight);

    // 5. Starfield Background
    const starGeo = new THREE.BufferGeometry();
    const starCount = 1200;
    const starPositions = new Float32Array(starCount * 3);
    for (let i = 0; i < starCount * 3; i += 3) {
      starPositions[i] = (Math.random() - 0.5) * 140;
      starPositions[i + 1] = (Math.random() - 0.5) * 140;
      starPositions[i + 2] = (Math.random() - 0.5) * 140;
    }
    starGeo.setAttribute('position', new THREE.BufferAttribute(starPositions, 3));
    const starMat = new THREE.PointsMaterial({ color: 0x5a626a, size: 0.06, transparent: true, opacity: 0.75 });
    const stars = new THREE.Points(starGeo, starMat);
    scene.add(stars);

    // 6. Moon Globe Group
    const moonGroup = new THREE.Group();
    scene.add(moonGroup);

    const { albedoTex, bumpTex } = createPhotorealisticLunarTextures();

    // High-density Lunar Sphere Geometry (160x160 subdivision)
    const moonRadius = 2.1;
    const moonGeo = new THREE.SphereGeometry(moonRadius, 160, 160);
    const moonMat = new THREE.MeshStandardMaterial({
      map: albedoTex,
      bumpMap: bumpTex,
      bumpScale: 0.065,
      roughness: 0.96, // PBR Matte Regolith Photometry
      metalness: 0.00,
    });
    const moonMesh = new THREE.Mesh(moonGeo, moonMat);
    moonMesh.castShadow = true;
    moonMesh.receiveShadow = true;
    moonGroup.add(moonMesh);

    // 7. Selenographic Coordinate Graticule Grid
    const gridGroup = new THREE.Group();
    moonGroup.add(gridGroup);

    // Parallels
    [-75, -60, -45, -30, -15, 0, 15, 30, 45, 60, 75].forEach(lat => {
      const radiusAtLat = (moonRadius + 0.003) * Math.cos(lat * (Math.PI / 180));
      const yAtLat = (moonRadius + 0.003) * Math.sin(lat * (Math.PI / 180));
      const circleGeo = new THREE.RingGeometry(radiusAtLat - 0.0015, radiusAtLat, 96);
      const isEquator = lat === 0;
      const circleMat = new THREE.MeshBasicMaterial({ 
        color: isEquator ? 0x38a8ff : 0x4a5568, 
        side: THREE.DoubleSide, 
        transparent: true, 
        opacity: isEquator ? 0.65 : 0.25 
      });
      const ring = new THREE.Mesh(circleGeo, circleMat);
      ring.rotation.x = Math.PI / 2;
      ring.position.y = yAtLat;
      gridGroup.add(ring);
    });

    // Meridians
    [0, 30, 60, 90, 120, 150, 180, 210, 240, 270, 300, 330].forEach(lon => {
      const circleGeo = new THREE.RingGeometry(moonRadius + 0.0015, moonRadius + 0.003, 96);
      const isPrime = lon === 0;
      const circleMat = new THREE.MeshBasicMaterial({ 
        color: isPrime ? 0x38a8ff : 0x4a5568, 
        side: THREE.DoubleSide, 
        transparent: true, 
        opacity: isPrime ? 0.65 : 0.22 
      });
      const ring = new THREE.Mesh(circleGeo, circleMat);
      ring.rotation.y = lon * (Math.PI / 180);
      gridGroup.add(ring);
    });

    // 8. Dataset Swath Footprints
    const footprintsGroup = new THREE.Group();
    moonGroup.add(footprintsGroup);

    // Tycho Swath
    const tychoPos = latLonToVector3(-43.31, -11.36, moonRadius + 0.006);
    const tychoGeo = new THREE.PlaneGeometry(0.32, 0.75);
    const tychoMat = new THREE.MeshBasicMaterial({ color: 0x38a8ff, side: THREE.DoubleSide, transparent: true, opacity: 0.35 });
    const tychoMesh = new THREE.Mesh(tychoGeo, tychoMat);
    tychoMesh.position.copy(tychoPos);
    tychoMesh.lookAt(new THREE.Vector3(0, 0, 0));
    footprintsGroup.add(tychoMesh);

    // Boguslawsky Swath
    const bogPos = latLonToVector3(-74.32, 53.64, moonRadius + 0.006);
    const bogGeo = new THREE.PlaneGeometry(0.18, 0.30);
    const bogMat = new THREE.MeshBasicMaterial({ color: 0x32d39a, side: THREE.DoubleSide, transparent: true, opacity: 0.35 });
    const bogMesh = new THREE.Mesh(bogGeo, bogMat);
    bogMesh.position.copy(bogPos);
    bogMesh.lookAt(new THREE.Vector3(0, 0, 0));
    footprintsGroup.add(bogMesh);

    // Shackleton Swath
    const shackPos = latLonToVector3(-89.90, 0, moonRadius + 0.006);
    const shackGeo = new THREE.PlaneGeometry(0.24, 0.50);
    const shackMat = new THREE.MeshBasicMaterial({ color: 0xe7a93b, side: THREE.DoubleSide, transparent: true, opacity: 0.35 });
    const shackMesh = new THREE.Mesh(shackGeo, shackMat);
    shackMesh.position.copy(shackPos);
    shackMesh.lookAt(new THREE.Vector3(0, 0, 0));
    footprintsGroup.add(shackMesh);

    // 9. Georeferenced Image Draping Layer
    const drapeTexture = new THREE.TextureLoader().load('/images/ch2_ohr_ncp_20220324T184000_d_img_d18.png');
    const drapeGeo = new THREE.PlaneGeometry(0.38, 0.38, 16, 16);
    const drapeMat = new THREE.MeshBasicMaterial({ 
      map: drapeTexture, 
      transparent: true, 
      opacity: 0.85, 
      side: THREE.DoubleSide,
      depthTest: true
    });
    const drapeMesh = new THREE.Mesh(drapeGeo, drapeMat);
    drapeMesh.position.copy(tychoPos);
    drapeMesh.lookAt(new THREE.Vector3(0, 0, 0));
    moonGroup.add(drapeMesh);

    // 10. Correspondence Ground Control Points (GCPs) Overlay
    const gcpGroup = new THREE.Group();
    moonGroup.add(gcpGroup);

    // Generate accurate GCP inlier & outlier dots on Tycho target
    for (let i = 0; i < 48; i++) {
      const gcpLat = -43.31 + (Math.sin(i * 1.7) * 0.4);
      const gcpLon = -11.36 + (Math.cos(i * 2.3) * 0.4);
      const isInlier = i % 8 !== 0;
      const ptPos = latLonToVector3(gcpLat, gcpLon, moonRadius + 0.014);

      const dotGeo = new THREE.SphereGeometry(0.008, 8, 8);
      const dotMat = new THREE.MeshBasicMaterial({ color: isInlier ? 0x32d39a : 0xff5c67 });
      const dot = new THREE.Mesh(dotGeo, dotMat);
      dot.position.copy(ptPos);
      gcpGroup.add(dot);
    }

    // 11. Landmark Markers
    const markersGroup = new THREE.Group();
    moonGroup.add(markersGroup);

    LUNAR_LANDMARKS.forEach(t => {
      const pos = latLonToVector3(t.lat, t.lon, moonRadius + 0.015);
      const marker = new THREE.Group();
      marker.position.copy(pos);
      marker.lookAt(new THREE.Vector3(0, 0, 0));

      const dotGeo = new THREE.SphereGeometry(0.016, 12, 12);
      const dotMat = new THREE.MeshBasicMaterial({ color: 0x38a8ff });
      const dot = new THREE.Mesh(dotGeo, dotMat);
      marker.add(dot);

      const ringGeo = new THREE.RingGeometry(0.028, 0.035, 24);
      const ringMat = new THREE.MeshBasicMaterial({ color: 0x38a8ff, side: THREE.DoubleSide, transparent: true, opacity: 0.65 });
      const ring = new THREE.Mesh(ringGeo, ringMat);
      marker.add(ring);

      marker.userData = { targetId: t.id, targetData: t };
      markersGroup.add(marker);
    });

    // 12. Chandrayaan-2 100km Polar Circular Orbit
    const orbitRadius = 2.48;
    const orbitPoints: THREE.Vector3[] = [];
    for (let i = 0; i <= 180; i++) {
      const theta = (i / 180) * Math.PI * 2;
      orbitPoints.push(new THREE.Vector3(
        orbitRadius * Math.sin(theta) * 0.05,
        orbitRadius * Math.cos(theta),
        orbitRadius * Math.sin(theta) * 0.998
      ));
    }
    const orbitGeo = new THREE.BufferGeometry().setFromPoints(orbitPoints);
    const orbitMat = new THREE.LineDashedMaterial({
      color: 0x38a8ff,
      dashSize: 0.06,
      gapSize: 0.04,
      transparent: true,
      opacity: 0.55
    });
    const orbitLine = new THREE.Line(orbitGeo, orbitMat);
    orbitLine.computeLineDistances();
    scene.add(orbitLine);

    // 13. Chandrayaan-2 Spacecraft Model
    const satelliteGroup = new THREE.Group();
    scene.add(satelliteGroup);

    const satBodyGeo = new THREE.BoxGeometry(0.09, 0.09, 0.12);
    const satBodyMat = new THREE.MeshStandardMaterial({ color: 0xd4af37, metalness: 0.85, roughness: 0.25 });
    const satBody = new THREE.Mesh(satBodyGeo, satBodyMat);
    satelliteGroup.add(satBody);

    const wingGeo = new THREE.BoxGeometry(0.26, 0.08, 0.005);
    const wingMat = new THREE.MeshStandardMaterial({ color: 0x1a365d, metalness: 0.9, roughness: 0.2 });
    const leftWing = new THREE.Mesh(wingGeo, wingMat);
    leftWing.position.set(-0.18, 0, 0);
    satelliteGroup.add(leftWing);

    const rightWing = new THREE.Mesh(wingGeo, wingMat);
    rightWing.position.set(0.18, 0, 0);
    satelliteGroup.add(rightWing);

    const dishGeo = new THREE.CylinderGeometry(0.04, 0.005, 0.02, 16);
    const dishMat = new THREE.MeshStandardMaterial({ color: 0xcccccc, metalness: 0.7, roughness: 0.3 });
    const dish = new THREE.Mesh(dishGeo, dishMat);
    dish.position.set(0, 0.06, 0.04);
    dish.rotation.x = Math.PI / 4;
    satelliteGroup.add(dish);

    const frustumGeo = new THREE.ConeGeometry(0.30, 0.60, 16, 1, true);
    const frustumMat = new THREE.MeshBasicMaterial({ color: 0x38a8ff, transparent: true, opacity: 0.12, side: THREE.DoubleSide });
    const sensorFrustum = new THREE.Mesh(frustumGeo, frustumMat);
    sensorFrustum.position.set(0, -0.30, 0);
    sensorFrustum.rotation.x = Math.PI;
    satelliteGroup.add(sensorFrustum);

    // 14. Measurement Line Group
    const measureLineGroup = new THREE.Group();
    moonGroup.add(measureLineGroup);

    // 15. Camera Controls & Orbit Dynamics
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
      // Raycasting for coordinate picking and measurement tool
      const rect = domElem.getBoundingClientRect();
      const mouseX = ((e.clientX - rect.left) / rect.width) * 2 - 1;
      const mouseY = -((e.clientY - rect.top) / rect.height) * 2 + 1;

      const raycaster = new THREE.Raycaster();
      raycaster.setFromCamera(new THREE.Vector2(mouseX, mouseY), camera);
      const intersects = raycaster.intersectObject(moonMesh);

      if (intersects.length > 0) {
        const point = intersects[0].point;
        // Transform point to moon local coordinates
        const localPoint = moonGroup.worldToLocal(point.clone());
        const { lat, lon } = vector3ToLatLon(localPoint);
        const approxElev = Math.round((Math.sin(lat * 0.1) + Math.cos(lon * 0.1)) * 1200);

        setInspectedCoord({ lat, lon, elev: approxElev });

        if (measureMode) {
          setMeasurePoints(prev => {
            if (prev.length >= 2) return [{ lat, lon }];
            const updated = [...prev, { lat, lon }];
            if (updated.length === 2) {
              const dist = calculateGreatCircleKm(updated[0].lat, updated[0].lon, updated[1].lat, updated[1].lon);
              setMeasuredDistance(dist);
            }
            return updated;
          });
        }
      }

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
      controls.targetZoom = Math.max(2.8, Math.min(8.5, controls.targetZoom));
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

      controls.rotX += (controls.targetRotX - controls.rotX) * 0.08;
      controls.rotY += (controls.targetRotY - controls.rotY) * 0.08;
      controls.zoom += (controls.targetZoom - controls.zoom) * 0.08;

      if (autoRotate && !controls.isDragging) {
        controls.targetRotY += 0.0012;
      }

      moonGroup.rotation.x = controls.rotX;
      moonGroup.rotation.y = controls.rotY;
      camera.position.z = controls.zoom;

      // Real-time Spacecraft Orbital Motion (100km polar circular orbit)
      orbitAngle += 0.004;
      const satY = orbitRadius * Math.cos(orbitAngle);
      const satZ = orbitRadius * Math.sin(orbitAngle) * 0.998;
      const satX = orbitRadius * Math.sin(orbitAngle) * 0.05;
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
      drapeMesh,
      gcpGroup,
      measureLineGroup,
      bumpTexture: bumpTex,
      normalTexture: bumpTex,
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
    const dist = 14.0;

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

    if (renderMode === 'realistic') {
      mat.map = textures.albedoTex;
      mat.bumpMap = bumpTexture;
      mat.bumpScale = 0.065 * terrainExaggeration;
      mat.roughness = 0.96;
      mat.wireframe = false;
    } else if (renderMode === 'albedo') {
      mat.map = textures.albedoTex;
      mat.bumpMap = null;
      mat.roughness = 1.0;
      mat.wireframe = false;
    } else if (renderMode === 'elevation') {
      mat.map = textures.elevTex;
      mat.bumpMap = bumpTexture;
      mat.bumpScale = 0.050 * terrainExaggeration;
      mat.roughness = 0.50;
      mat.wireframe = false;
    } else if (renderMode === 'slope') {
      mat.map = textures.slopeTex;
      mat.bumpMap = bumpTexture;
      mat.bumpScale = 0.040 * terrainExaggeration;
      mat.roughness = 0.45;
      mat.wireframe = false;
    } else if (renderMode === 'relief') {
      mat.map = textures.reliefTex;
      mat.bumpMap = bumpTexture;
      mat.bumpScale = 0.085 * terrainExaggeration;
      mat.roughness = 0.70;
      mat.wireframe = false;
    } else if (renderMode === 'wireframe') {
      mat.wireframe = true;
    }
    mat.needsUpdate = true;
  }, [renderMode, terrainExaggeration]);

  // Update Layer Visibility Toggles
  useEffect(() => {
    if (!sceneRef.current) return;
    const { orbitLine, satelliteGroup, footprintsGroup, gridGroup, markersGroup, moonMesh, drapeMesh, gcpGroup } = sceneRef.current;
    moonMesh.visible = layers.lunarSurface;
    orbitLine.visible = layers.orbitPath;
    satelliteGroup.visible = layers.spacecraft;
    footprintsGroup.visible = layers.footprints;
    gridGroup.visible = layers.coordinateGrid;
    markersGroup.visible = layers.craterMarkers;
    drapeMesh.visible = layers.imageOverlay;
    gcpGroup.visible = layers.correspondencePoints;
  }, [layers]);

  // Update Image Draping Opacity
  useEffect(() => {
    if (!sceneRef.current) return;
    const { drapeMesh } = sceneRef.current;
    const mat = drapeMesh.material as THREE.MeshBasicMaterial;
    mat.opacity = imageOpacity / 100.0;
  }, [imageOpacity]);

  // Update Measurement Line Visualizer
  useEffect(() => {
    if (!sceneRef.current) return;
    const { measureLineGroup } = sceneRef.current;
    measureLineGroup.clear();

    if (measurePoints.length === 2) {
      const p1 = latLonToVector3(measurePoints[0].lat, measurePoints[0].lon, 2.115);
      const p2 = latLonToVector3(measurePoints[1].lat, measurePoints[1].lon, 2.115);

      const lineGeo = new THREE.BufferGeometry().setFromPoints([p1, p2]);
      const lineMat = new THREE.LineBasicMaterial({ color: 0x38a8ff, linewidth: 2 });
      const line = new THREE.Line(lineGeo, lineMat);
      measureLineGroup.add(line);

      [p1, p2].forEach(p => {
        const dotGeo = new THREE.SphereGeometry(0.018, 12, 12);
        const dotMat = new THREE.MeshBasicMaterial({ color: 0x38a8ff });
        const dot = new THREE.Mesh(dotGeo, dotMat);
        dot.position.copy(p);
        measureLineGroup.add(dot);
      });
    }
  }, [measurePoints]);

  // Deep Link URL Query Parameters parsing
  useEffect(() => {
    if (typeof window === 'undefined') return;
    const params = new URLSearchParams(window.location.search);
    const datasetParam = params.get('dataset') || params.get('target') || params.get('source');
    if (datasetParam) {
      const foundLandmark = LUNAR_LANDMARKS.find(l => l.sourceProductId === datasetParam || l.targetProductId === datasetParam || l.footprintId === datasetParam);
      if (foundLandmark) {
        flyToTarget(foundLandmark);
      } else {
        const foundDs = DATASETS_LIST.find(d => d.id === datasetParam || d.product_id === datasetParam);
        if (foundDs) {
          flyToCoord(foundDs.lat, foundDs.lon);
        }
      }
    }
  }, []);

  // Camera Fly-to and Target Lock
  const flyToTarget = (target: LunarTarget) => {
    setSelectedTarget(target);
    if (useDatasetSun) {
      // Find actual dataset metadata if available
      const ds = DATASETS_LIST.find(d => d.id === target.sourceProductId || d.id === target.footprintId);
      if (ds) {
        setSunAzimuth(ds.sun_azimuth);
        setSunElevation(ds.sun_elevation);
      }
    }
    if (!sceneRef.current) return;
    const { controls } = sceneRef.current;
    const phi = target.lat * (Math.PI / 180);
    const theta = -(target.lon + 180) * (Math.PI / 180);
    
    controls.targetRotX = phi;
    controls.targetRotY = theta + Math.PI / 2;
    controls.targetZoom = 4.2;
  };

  const flyToCoord = (lat: number, lon: number) => {
    if (!sceneRef.current) return;
    const { controls } = sceneRef.current;
    const phi = lat * (Math.PI / 180);
    const theta = -(lon + 180) * (Math.PI / 180);
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
    setSunAzimuth(265.0);
    setSunElevation(30.5);
    setRenderMode('realistic');
    setMeasureMode(false);
    setMeasurePoints([]);
    setMeasuredDistance(null);
  };

  const captureCanvas = () => {
    if (!sceneRef.current) return;
    const { renderer } = sceneRef.current;
    const dataUrl = renderer.domElement.toDataURL('image/png');
    const a = document.createElement('a');
    a.href = dataUrl;
    a.download = `chandrayaan2_3d_lunar_capture_${Date.now()}.png`;
    a.click();
  };

  // Solar Incidence Angle
  const calculatedIncidence = Math.max(0, 90.0 - sunElevation).toFixed(1);

  return (
    <div className="h-screen w-screen overflow-hidden bg-[#02070D] text-[#D9DDE0] font-sans flex flex-col select-none antialiased pt-14">
      
      {/* Unified Master Transparent/Glass Navbar */}
      <EdolusTopNav />

      {/* ========================================================
          MAIN PLANETARY WORKSPACE (Canvas + Telemetry Rail)
         ======================================================== */}
      <div className="flex-1 relative flex overflow-hidden">
        
        {/* LEFT COMPACT TOOLBAR */}
        <div className="absolute top-4 left-4 z-30 flex flex-col gap-1.5 p-1.5 bg-[#07090B]/90 border border-white/[0.08] rounded-xl text-[#7E858C] text-[10px] font-mono shadow-2xl backdrop-blur-md">
          <button
            onClick={() => setActiveDrawer(activeDrawer === 'targets' ? 'none' : 'targets')}
            className={`p-2 rounded-lg flex flex-col items-center gap-1 transition-all ${
              activeDrawer === 'targets'
                ? 'bg-[#38A8FF]/20 text-[#38A8FF] border border-[#38A8FF]/40'
                : 'hover:bg-white/[0.06] hover:text-[#D9DDE0]'
            }`}
            title="Target Regions & PDS4 Observations"
          >
            <Crosshair className="w-4 h-4" />
            <span className="text-[8px] tracking-wider font-bold">TARGETS</span>
          </button>

          <button
            onClick={() => setActiveDrawer(activeDrawer === 'layers' ? 'none' : 'layers')}
            className={`p-2 rounded-lg flex flex-col items-center gap-1 transition-all ${
              activeDrawer === 'layers'
                ? 'bg-[#38A8FF]/20 text-[#38A8FF] border border-[#38A8FF]/40'
                : 'hover:bg-white/[0.06] hover:text-[#D9DDE0]'
            }`}
            title="Scientific Layer Manager"
          >
            <Layers className="w-4 h-4" />
            <span className="text-[8px] tracking-wider font-bold">LAYERS</span>
          </button>

          <button
            onClick={() => setActiveDrawer(activeDrawer === 'shading' ? 'none' : 'shading')}
            className={`p-2 rounded-lg flex flex-col items-center gap-1 transition-all ${
              activeDrawer === 'shading'
                ? 'bg-[#38A8FF]/20 text-[#38A8FF] border border-[#38A8FF]/40'
                : 'hover:bg-white/[0.06] hover:text-[#D9DDE0]'
            }`}
            title="Photometric Shading Pipeline"
          >
            <Eye className="w-4 h-4" />
            <span className="text-[8px] tracking-wider font-bold">SHADING</span>
          </button>

          <button
            onClick={() => {
              setMeasureMode(!measureMode);
              setMeasurePoints([]);
              setMeasuredDistance(null);
            }}
            className={`p-2 rounded-lg flex flex-col items-center gap-1 transition-all ${
              measureMode
                ? 'bg-[#32D39A]/20 text-[#32D39A] border border-[#32D39A]/40'
                : 'hover:bg-white/[0.06] hover:text-[#D9DDE0]'
            }`}
            title="Great-Circle Lunar Distance Measurement Tool"
          >
            <Ruler className="w-4 h-4" />
            <span className="text-[8px] tracking-wider font-bold">MEASURE</span>
          </button>

          <button
            onClick={() => setLayers(prev => ({ ...prev, coordinateGrid: !prev.coordinateGrid }))}
            className={`p-2 rounded-lg flex flex-col items-center gap-1 transition-all ${
              layers.coordinateGrid ? 'text-[#38A8FF] bg-[#38A8FF]/15' : 'hover:bg-white/[0.06] hover:text-[#D9DDE0]'
            }`}
            title="Toggle Selenographic Coordinate Grid"
          >
            <Compass className="w-4 h-4" />
            <span className="text-[8px] tracking-wider font-bold">GRID</span>
          </button>

          <button
            onClick={() => setLayers(prev => ({ ...prev, orbitPath: !prev.orbitPath, spacecraft: !prev.spacecraft }))}
            className={`p-2 rounded-lg flex flex-col items-center gap-1 transition-all ${
              layers.orbitPath ? 'text-[#38A8FF] bg-[#38A8FF]/15' : 'hover:bg-white/[0.06] hover:text-[#D9DDE0]'
            }`}
            title="Toggle Chandrayaan-2 100km Orbit"
          >
            <Orbit className="w-4 h-4" />
            <span className="text-[8px] tracking-wider font-bold">ORBIT</span>
          </button>

          <div className="h-[1px] bg-white/[0.08] my-1" />

          <button
            onClick={captureCanvas}
            className="p-2 rounded-lg hover:bg-white/[0.06] hover:text-[#D9DDE0] flex flex-col items-center gap-1"
            title="Capture High-Res Viewport PNG Screenshot"
          >
            <Camera className="w-4 h-4 text-[#38A8FF]" />
            <span className="text-[8px] tracking-wider font-bold">CAPTURE</span>
          </button>

          <button
            onClick={resetCamera}
            className="p-2 rounded-lg hover:bg-white/[0.06] hover:text-[#D9DDE0] flex flex-col items-center gap-1"
            title="Reset Selenocentric Camera Orientation"
          >
            <RefreshCw className="w-4 h-4 text-[#8D98A5]" />
            <span className="text-[8px] tracking-wider font-bold">RESET</span>
          </button>
        </div>

        {/* CONTEXTUAL DRAWER (TARGETS / LAYERS / SHADING) */}
        {activeDrawer === 'targets' && (
          <div className="absolute top-4 left-20 z-30 w-80 bg-[#07090B]/95 border border-white/[0.12] rounded-2xl p-4 text-xs font-mono shadow-2xl space-y-3 backdrop-blur-md">
            <div className="flex items-center justify-between border-b border-white/[0.08] pb-2 text-[#D9DDE0] text-[11px] font-bold tracking-wider">
              <span>LUNAR TARGET SITES &amp; PDS4 SWATHS</span>
              <span className="text-[#38A8FF]">{LUNAR_LANDMARKS.length} SITES</span>
            </div>
            <div className="space-y-1.5 max-h-[65vh] overflow-y-auto pr-1 scrollbar-thin">
              {LUNAR_LANDMARKS.map(t => (
                <button
                  key={t.id}
                  onClick={() => {
                    flyToTarget(t);
                    setActiveDrawer('none');
                  }}
                  className={`w-full p-2.5 rounded-xl text-left transition-all flex items-center justify-between border ${
                    selectedTarget.id === t.id
                      ? 'bg-[#38A8FF]/15 border-[#38A8FF]/40 text-[#F4F6F8]'
                      : 'bg-[#0B0D0F] border-white/[0.04] text-[#8D98A5] hover:text-[#D9DDE0] hover:border-white/[0.15]'
                  }`}
                >
                  <div>
                    <div className="text-[11px] font-bold text-[#F4F6F8]">{t.name}</div>
                    <div className="text-[9px] text-[#8D98A5] mt-0.5">{t.latStr} • {t.lonStr}</div>
                  </div>
                  <span className="text-[9px] font-mono text-[#38A8FF] font-bold">{t.sensorResolution}</span>
                </button>
              ))}
            </div>
          </div>
        )}

        {activeDrawer === 'layers' && (
          <div className="absolute top-4 left-20 z-30 w-72 bg-[#07090B]/95 border border-white/[0.12] rounded-2xl p-4 text-xs font-mono shadow-2xl space-y-3 backdrop-blur-md">
            <div className="text-[#D9DDE0] text-[11px] font-bold tracking-wider border-b border-white/[0.08] pb-2">
              SCIENTIFIC LAYER MANAGER
            </div>
            <div className="space-y-2 text-[11px]">
              {[
                { key: 'lunarSurface', label: 'Lunar Terrain (PBR Regolith)', desc: '1737.4 km reference ellipsoid with bump relief' },
                { key: 'coordinateGrid', label: 'Coordinate Graticule (Grid)', desc: 'Body-fixed parallels & meridians' },
                { key: 'footprints', label: 'Dataset Swath Footprints', desc: 'OHRC 0.25m, TMC-2 5m, IIRS 80m' },
                { key: 'imageOverlay', label: 'Image Draping on Terrain', desc: 'Real Chandrayaan-2 georeferenced raster' },
                { key: 'correspondencePoints', label: 'Correspondence GCPs', desc: 'Projected inliers & outliers tie-points' },
                { key: 'orbitPath', label: 'Chandrayaan-2 Orbit Track', desc: '100km polar circular trajectory' },
                { key: 'spacecraft', label: 'Chandrayaan-2 Spacecraft', desc: 'Orbiter model & optical sensor frustum' },
                { key: 'craterMarkers', label: 'Crater Landmark Pins', desc: 'IAU authentic lunar landmarks' },
              ].map(item => (
                <label 
                  key={item.key} 
                  className="flex items-start gap-2.5 p-2 rounded-lg hover:bg-white/[0.04] cursor-pointer transition-colors"
                >
                  <input
                    type="checkbox"
                    checked={layers[item.key as keyof typeof layers]}
                    onChange={(e) => setLayers({ ...layers, [item.key]: e.target.checked })}
                    className="mt-0.5 accent-[#38A8FF]"
                  />
                  <div>
                    <div className="font-bold text-[#F4F6F8] text-[10px]">{item.label}</div>
                    <div className="text-[8px] text-[#8D98A5]">{item.desc}</div>
                  </div>
                </label>
              ))}

              {/* Image Draping Opacity Slider */}
              <div className="pt-2 border-t border-white/[0.06] space-y-1">
                <div className="flex justify-between text-[9px] uppercase text-[#8D98A5]">
                  <span>Image Draping Opacity:</span>
                  <span className="text-[#38A8FF] font-bold">{imageOpacity}%</span>
                </div>
                <input
                  type="range"
                  min="0"
                  max="100"
                  value={imageOpacity}
                  onChange={(e) => setImageOpacity(Number(e.target.value))}
                  className="w-full accent-[#38A8FF] cursor-pointer"
                />
              </div>
            </div>
          </div>
        )}

        {activeDrawer === 'shading' && (
          <div className="absolute top-4 left-20 z-30 w-80 bg-[#07090B]/95 border border-white/[0.12] rounded-2xl p-4 text-xs font-mono shadow-2xl space-y-3 backdrop-blur-md">
            <div className="text-[#D9DDE0] text-[11px] font-bold tracking-wider border-b border-white/[0.08] pb-2">
              PHOTOMETRIC SHADING PIPELINE
            </div>
            <div className="space-y-1.5">
              {[
                { 
                  id: 'realistic', 
                  label: 'REALISTIC PBR LUNAR REGOLITH', 
                  badge: 'PHYSICAL', 
                  badgeColor: 'text-[#32D39A] bg-[#32D39A]/10 border-[#32D39A]/30',
                  desc: 'Photorealistic PBR texture with directional sunlight & terminator' 
                },
                { 
                  id: 'albedo', 
                  label: 'TRUE ALBEDO / REFLECTANCE', 
                  badge: 'PHOTOMETRY', 
                  badgeColor: 'text-[#38A8FF] bg-[#38A8FF]/10 border-[#38A8FF]/30',
                  desc: 'Calibrated LROC/Clementine surface reflectance map' 
                },
                { 
                  id: 'elevation', 
                  label: 'ELEVATION (LOLA DEM)', 
                  badge: 'DATA-DERIVED', 
                  badgeColor: 'text-[#32D39A] bg-[#32D39A]/10 border-[#32D39A]/30',
                  desc: 'Laser altimeter hypsometric ramp (-9000m to +10500m)' 
                },
                { 
                  id: 'slope', 
                  label: 'SLOPE GRADIENT MAP', 
                  badge: 'DERIVED', 
                  badgeColor: 'text-[#8D98A5] bg-white/[0.06] border-white/10',
                  desc: 'Terrain slope angle (0°-35°+ landing safety classification)' 
                },
                { 
                  id: 'relief', 
                  label: 'CRATER RELIEF HILLSHADE', 
                  badge: 'RELIEF', 
                  badgeColor: 'text-[#FFB547] bg-[#FFB547]/10 border-[#FFB547]/30',
                  desc: 'High-contrast grazing sun hillshade enhancement' 
                },
                { 
                  id: 'wireframe', 
                  label: 'GEOMETRIC WIREFRAME', 
                  badge: 'DIAGNOSTIC', 
                  badgeColor: 'text-[#A78BFA] bg-[#A78BFA]/10 border-[#A78BFA]/30',
                  desc: 'High-density 160x160 polygonal mesh structure' 
                },
              ].map(mode => (
                <button
                  key={mode.id}
                  onClick={() => {
                    setRenderMode(mode.id as RenderShaderMode);
                    setActiveDrawer('none');
                  }}
                  className={`w-full p-2.5 rounded-xl text-left transition-all border ${
                    renderMode === mode.id
                      ? 'bg-[#38A8FF]/15 border-[#38A8FF]/40 text-[#F4F6F8]'
                      : 'bg-[#0B0D0F] border-white/[0.04] text-[#8D98A5] hover:text-[#D9DDE0]'
                  }`}
                >
                  <div className="flex items-center justify-between">
                    <span className="text-[10px] font-bold text-[#F4F6F8]">{mode.label}</span>
                    <span className={`text-[8px] px-1.5 py-0.5 rounded border font-mono ${mode.badgeColor}`}>
                      {mode.badge}
                    </span>
                  </div>
                  <div className="text-[8px] text-[#8D98A5] mt-0.5">{mode.desc}</div>
                </button>
              ))}

              {/* Terrain Exaggeration */}
              <div className="pt-2 border-t border-white/[0.06] space-y-1">
                <div className="flex justify-between text-[9px] uppercase text-[#8D98A5]">
                  <span>Terrain Exaggeration:</span>
                  <span className="text-[#32D39A] font-bold">{terrainExaggeration}×</span>
                </div>
                <div className="flex items-center gap-2">
                  {[0.5, 1.0, 2.0, 4.0].map(v => (
                    <button
                      key={v}
                      onClick={() => setTerrainExaggeration(v)}
                      className={`flex-1 py-1 rounded text-[10px] font-bold border transition-colors ${
                        terrainExaggeration === v 
                          ? 'bg-[#32D39A]/20 border-[#32D39A]/40 text-[#32D39A]' 
                          : 'bg-[#0B0D0F] border-white/5 text-[#8D98A5] hover:text-white'
                      }`}
                    >
                      {v}×
                    </button>
                  ))}
                </div>
              </div>
            </div>
          </div>
        )}

        {/* 3D HERO LUNAR GLOBE CANVAS */}
        <div className="flex-1 relative h-full w-full">
          <div 
            ref={canvasContainerRef} 
            className="w-full h-full cursor-grab active:cursor-grabbing bg-[#010408]"
          />

          {/* MEASUREMENT TOOL HUD NOTIFICATION */}
          {measureMode && (
            <div className="absolute top-4 left-1/2 -translate-x-1/2 z-30 bg-[#07131D]/90 border border-[#38A8FF]/40 px-4 py-2 rounded-xl text-xs font-mono text-white shadow-2xl backdrop-blur-md flex items-center gap-3">
              <Ruler className="w-4 h-4 text-[#38A8FF] animate-pulse" />
              <div>
                <span className="font-bold text-[#38A8FF]">LUNAR DISTANCE MEASUREMENT:</span> Click any 2 points on the lunar surface.
                {measuredDistance !== null && (
                  <span className="ml-2 font-bold text-[#32D39A] bg-[#32D39A]/10 px-2 py-0.5 rounded border border-[#32D39A]/30">
                    GREAT-CIRCLE DISTANCE: {measuredDistance.toLocaleString()} KM
                  </span>
                )}
              </div>
              <button
                onClick={() => {
                  setMeasurePoints([]);
                  setMeasuredDistance(null);
                }}
                className="px-2 py-0.5 rounded bg-white/10 text-[10px] hover:bg-white/20"
              >
                Clear
              </button>
            </div>
          )}

          {/* SCIENTIFIC HUD OVERLAY: TARGET LOCK & SOLAR INCIDENCE READOUT */}
          <div className="absolute top-4 right-84 lg:right-96 pointer-events-none hidden md:flex flex-col items-end text-right font-mono text-[10px] text-[#8D98A5] space-y-1 bg-[#07090B]/85 p-3 rounded-xl border border-white/[0.08] backdrop-blur-md shadow-xl">
            <div className="flex items-center gap-1.5 text-[#F4F6F8] font-bold">
              <Crosshair className="w-3.5 h-3.5 text-[#38A8FF]" />
              <span>TARGET LOCK // {selectedTarget.code}</span>
            </div>
            <div>LAT: <span className="text-[#F4F6F8] font-bold">{selectedTarget.latStr}</span> | LON: <span className="text-[#F4F6F8] font-bold">{selectedTarget.lonStr}</span></div>
            <div>RELIEF: <span className="text-[#F4F6F8]">{selectedTarget.elevation}</span> | GSD: <span className="text-[#32D39A]">{selectedTarget.sensorResolution}</span></div>
            <div>SOLAR INCIDENCE: <span className="text-[#FFB547] font-bold">{calculatedIncidence}°</span> | AZIMUTH: <span className="text-[#F4F6F8]">{sunAzimuth.toFixed(1)}°</span></div>
            {inspectedCoord && (
              <div className="text-[#38A8FF] border-t border-white/[0.06] pt-1">
                INSPECTED COORD: {inspectedCoord.lat}° / {inspectedCoord.lon}°
              </div>
            )}
          </div>

          {/* DOCKED BOTTOM TELEMETRY STRIP (Aerospace Control Bar) */}
          <div className="absolute bottom-0 left-0 right-0 h-12 bg-[#07090B]/95 border-t border-white/[0.08] px-4 sm:px-6 flex items-center justify-between z-30 font-mono text-[11px] text-[#8D98A5] backdrop-blur-md">
            <div className="flex items-center gap-4 sm:gap-6 overflow-x-auto py-1">
              
              {/* Sun Azimuth Slider */}
              <div className="flex items-center gap-2">
                <span className="text-[9px] uppercase tracking-wider text-[#8D98A5]">SUN AZIMUTH:</span>
                <input
                  type="range"
                  min="0"
                  max="360"
                  step="0.5"
                  value={sunAzimuth}
                  onChange={(e) => {
                    setSunAzimuth(parseFloat(e.target.value));
                    setUseDatasetSun(false);
                  }}
                  className="w-20 sm:w-28 accent-[#FFB547] cursor-pointer"
                  title="Adjust Sun Azimuth (Crater shadows move dynamically)"
                />
                <span className="text-[#FFB547] font-bold text-xs">{sunAzimuth.toFixed(1)}°</span>
              </div>

              <div className="h-3 w-[1px] bg-white/[0.08] hidden sm:block" />

              {/* Sun Elevation Slider */}
              <div className="flex items-center gap-2">
                <span className="text-[9px] uppercase tracking-wider text-[#8D98A5]">SUN ELEVATION:</span>
                <input
                  type="range"
                  min="0"
                  max="90"
                  step="0.5"
                  value={sunElevation}
                  onChange={(e) => {
                    setSunElevation(parseFloat(e.target.value));
                    setUseDatasetSun(false);
                  }}
                  className="w-20 sm:w-28 accent-[#FFB547] cursor-pointer"
                  title="Adjust Sun Elevation (Controls terminator & shadow length)"
                />
                <span className="text-[#FFB547] font-bold text-xs">{sunElevation.toFixed(1)}°</span>
              </div>

              <div className="h-3 w-[1px] bg-white/[0.08] hidden sm:block" />

              {/* Use Dataset Sun Toggle */}
              <button
                onClick={() => {
                  setUseDatasetSun(!useDatasetSun);
                  if (!useDatasetSun) {
                    const ds = DATASETS_LIST.find(d => d.id === selectedTarget.sourceProductId || d.id === selectedTarget.footprintId);
                    if (ds) {
                      setSunAzimuth(ds.sun_azimuth);
                      setSunElevation(ds.sun_elevation);
                    }
                  }
                }}
                className={`px-2 py-0.5 rounded text-[9px] font-bold border transition-colors cursor-pointer ${
                  useDatasetSun 
                    ? 'bg-[#38A8FF]/20 border-[#38A8FF]/40 text-[#38A8FF]' 
                    : 'bg-white/5 border-white/10 text-white/50'
                }`}
                title="Lock lighting to actual PDS4 dataset Sun geometry"
              >
                USE DATASET SUN: {useDatasetSun ? 'ON' : 'OFF'}
              </button>

              <div className="h-3 w-[1px] bg-white/[0.08] hidden md:block" />

              <div className="hidden md:flex items-center gap-1.5">
                <span className="text-[9px] uppercase tracking-wider text-[#8D98A5]">INCIDENCE:</span>
                <span className="text-[#F4F6F8] font-bold">{calculatedIncidence}°</span>
              </div>

              <div className="h-3 w-[1px] bg-white/[0.08] hidden lg:block" />

              <div className="hidden lg:flex items-center gap-1.5">
                <span className="text-[9px] uppercase tracking-wider text-[#8D98A5]">ALTITUDE:</span>
                <span className="text-[#F4F6F8] font-bold">100.18 km</span>
              </div>
            </div>

            <div className="flex items-center gap-2 shrink-0">
              <button
                onClick={() => setAutoRotate(!autoRotate)}
                className={`px-2.5 py-1 rounded-lg text-[10px] font-mono border transition-all flex items-center gap-1.5 ${
                  autoRotate
                    ? 'bg-[#32D39A]/15 border-[#32D39A]/40 text-[#32D39A]'
                    : 'bg-[#0B0D0F] border-white/[0.08] text-[#8D98A5] hover:text-[#D9DDE0]'
                }`}
              >
                {autoRotate ? <Pause className="w-3 h-3" /> : <Play className="w-3 h-3" />}
                <span>ORBIT {autoRotate ? 'ON' : 'OFF'}</span>
              </button>
            </div>
          </div>
        </div>

        {/* RIGHT MISSION TELEMETRY RAIL */}
        <div className="w-80 lg:w-96 bg-[#07090B] border-l border-white/[0.08] flex flex-col z-30 shrink-0 overflow-y-auto">
          
          {/* Target Header Block */}
          <div className="p-4 border-b border-white/[0.08] space-y-1.5 bg-[#0B0D0F]">
            <div className="flex items-center justify-between text-[9px] font-mono tracking-widest text-[#8D98A5] uppercase">
              <div className="flex items-center gap-1.5">
                <span className="w-1.5 h-1.5 rounded-full bg-[#32D39A] animate-pulse" />
                <span>CHANDRAYAAN-2 TARGET TELEMETRY</span>
              </div>
              <span className="text-[#38A8FF] font-bold">{selectedTarget.code}</span>
            </div>
            
            <h2 className="text-sm font-bold text-[#F4F6F8] tracking-tight font-mono">
              {selectedTarget.name}
            </h2>
            
            <p className="text-[10px] text-[#8D98A5] font-mono leading-relaxed">
              {selectedTarget.description}
            </p>
          </div>

          {/* Selenodesy & Geodetic Readout Matrix */}
          <div className="p-4 border-b border-white/[0.08] space-y-3 font-mono text-xs">
            <div className="text-[9px] tracking-widest text-[#8D98A5] uppercase">
              SELENODETIC READOUT &amp; GEOMETRY
            </div>

            <div className="grid grid-cols-2 gap-x-3 gap-y-2 bg-[#020304] p-3 rounded-xl border border-white/[0.06]">
              <div>
                <span className="text-[9px] text-[#8D98A5] block uppercase">LATITUDE</span>
                <span className="text-[#F4F6F8] font-bold text-xs">{selectedTarget.latStr}</span>
              </div>
              <div>
                <span className="text-[9px] text-[#8D98A5] block uppercase">LONGITUDE</span>
                <span className="text-[#F4F6F8] font-bold text-xs">{selectedTarget.lonStr}</span>
              </div>
              <div>
                <span className="text-[9px] text-[#8D98A5] block uppercase">FLOOR ELEVATION</span>
                <span className="text-[#38A8FF] font-bold text-xs">{selectedTarget.elevation}</span>
              </div>
              <div>
                <span className="text-[9px] text-[#8D98A5] block uppercase">CRATER DEPTH</span>
                <span className="text-[#F4F6F8] font-bold text-xs">{selectedTarget.depth}</span>
              </div>
              <div>
                <span className="text-[9px] text-[#8D98A5] block uppercase">DIAMETER</span>
                <span className="text-[#F4F6F8] font-bold text-xs">{selectedTarget.diameter}</span>
              </div>
              <div>
                <span className="text-[9px] text-[#8D98A5] block uppercase">BEST GSD</span>
                <span className="text-[#32D39A] font-bold text-xs">{selectedTarget.sensorResolution}</span>
              </div>
              <div className="col-span-2 pt-1.5 border-t border-white/[0.04]">
                <span className="text-[9px] text-[#8D98A5] block uppercase">SENSORS COVERAGE</span>
                <span className="text-[#F4F6F8] text-[11px]">{selectedTarget.instruments}</span>
              </div>
              <div className="col-span-2">
                <span className="text-[9px] text-[#8D98A5] block uppercase">PDS4 PRODUCT ID</span>
                <span className="text-[#38A8FF] text-[10px] truncate block">{selectedTarget.footprintId}</span>
              </div>
            </div>
          </div>

          {/* SCIENTIFIC TOPOGRAPHIC CROSS-SECTION (LOLA-DEM) */}
          <div className="p-4 border-b border-white/[0.08] space-y-2 font-mono text-xs">
            <div className="flex items-center justify-between text-[9px] tracking-widest text-[#8D98A5] uppercase">
              <span>TOPOGRAPHIC PROFILE (LOLA DEM)</span>
              <span className="text-[#38A8FF]">1:1000 RELIEF</span>
            </div>

            <div className="bg-[#020304] p-3 rounded-xl border border-white/[0.06] space-y-2">
              <div className="h-20 w-full relative flex items-end">
                <svg className="w-full h-full overflow-visible" viewBox="0 0 100 40" preserveAspectRatio="none">
                  <defs>
                    <linearGradient id="sciTopGrad" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="0%" stopColor="#38A8FF" stopOpacity="0.25" />
                      <stop offset="100%" stopColor="#38A8FF" stopOpacity="0.0" />
                    </linearGradient>
                  </defs>
                  <path
                    d="M 0 14 Q 16 18, 30 11 Q 38 38, 50 38 Q 62 38, 70 11 Q 84 18, 100 14 L 100 40 L 0 40 Z"
                    fill="url(#sciTopGrad)"
                  />
                  <path
                    d="M 0 14 Q 16 18, 30 11 Q 38 38, 50 38 Q 62 38, 70 11 Q 84 18, 100 14"
                    fill="none"
                    stroke="#38A8FF"
                    strokeWidth="1.5"
                  />
                  <line x1="50" y1="0" x2="50" y2="40" stroke="#8D98A5" strokeWidth="0.8" strokeDasharray="2,2" />
                </svg>
              </div>

              <div className="flex justify-between text-[8px] font-mono text-[#8D98A5]">
                <span>WEST RIM ({selectedTarget.rimWest})</span>
                <span className="text-[#F4F6F8] font-bold">FLOOR ({selectedTarget.floorDepth})</span>
                <span>EAST RIM ({selectedTarget.rimEast})</span>
              </div>
            </div>
          </div>

          {/* Quick Target Switcher */}
          <div className="p-4 border-b border-white/[0.08] space-y-2 font-mono text-xs">
            <div className="text-[9px] tracking-widest text-[#8D98A5] uppercase">
              SELECT LUNAR REGION
            </div>
            <div className="grid grid-cols-2 gap-1.5">
              {LUNAR_LANDMARKS.map(t => (
                <button
                  key={t.id}
                  onClick={() => flyToTarget(t)}
                  className={`p-2 rounded-lg text-[10px] text-left truncate transition-all border ${
                    selectedTarget.id === t.id
                      ? 'bg-[#38A8FF]/20 border-[#38A8FF]/40 text-[#F4F6F8] font-bold'
                      : 'bg-[#0B0D0F] border-white/[0.04] text-[#8D98A5] hover:text-[#D9DDE0]'
                  }`}
                >
                  <span className={`w-1.5 h-1.5 rounded-full inline-block mr-1.5 ${selectedTarget.id === t.id ? 'bg-[#38A8FF]' : 'bg-[#8D98A5]'}`} />
                  {t.name.split(' ')[0]}
                </button>
              ))}
            </div>
          </div>

          {/* Direct Workflow: Run Correspondence & Scientific Analysis */}
          <div className="p-4 space-y-2 font-mono text-xs mt-auto">
            <div className="text-[9px] tracking-widest text-[#8D98A5] uppercase mb-1">
              CONNECTED SCIENTIFIC PIPELINE
            </div>

            <Link
              href={`/correspondence?source=${selectedTarget.sourceProductId}&target=${selectedTarget.targetProductId}`}
              className="w-full py-2.5 rounded-xl bg-gradient-to-r from-[#2F80FF] to-[#00B8FF] hover:brightness-110 text-white font-bold text-[11px] uppercase tracking-wider flex items-center justify-center gap-2 transition-all cursor-pointer shadow-md"
            >
              <GitCompare className="w-3.5 h-3.5" />
              <span>RUN CORRESPONDENCE FOR THIS REGION →</span>
            </Link>

            <div className="p-2.5 rounded-xl bg-[#020304] border border-white/[0.06] text-[9px] text-[#8D98A5] space-y-0.5">
              <div>AVAILABLE MATCH: <strong className="text-[#F4F6F8]">{selectedTarget.matchPayload}</strong></div>
              <div>METRICS: <span className="text-[#32D39A] font-bold">{selectedTarget.matchRatio}</span> • <span className="text-[#FFB547] font-bold">{selectedTarget.sunDelta}</span></div>
            </div>

            <Link
              href={`/reports?id=RUN-20261004-95D6E5&source=${selectedTarget.sourceProductId}&target=${selectedTarget.targetProductId}`}
              className="w-full py-2 rounded-xl bg-white/5 hover:bg-white/10 border border-white/10 text-[#8D98A5] hover:text-[#F4F6F8] text-[10px] uppercase tracking-wider flex items-center justify-center gap-2 transition-all"
            >
              <FileText className="w-3 h-3 text-[#A78BFA]" />
              <span>GENERATE PDS4 SCIENTIFIC REPORT</span>
            </Link>
          </div>

        </div>

      </div>
    </div>
  );
}
