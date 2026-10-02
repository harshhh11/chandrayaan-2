'use client';

import React, { useState, useEffect, useRef, useMemo } from 'react';
import Link from 'next/link';
import * as THREE from 'three';
import { 
  Globe, Compass, Layers, Crosshair, Orbit, 
  Database, GitCompare, Maximize2, ShieldCheck, MapPin, 
  RotateCw, ZoomIn, ZoomOut, ArrowLeft, Sun, Eye, Activity,
  Sliders, Play, Pause, ChevronRight, Download, Sparkles, Navigation
} from 'lucide-react';
import { EdolusTopNav } from '@/components/layout/EdolusTopNav';

interface LunarTarget {
  id: string;
  name: string;
  lat: number; // degrees
  lon: number; // degrees
  latStr: string;
  lonStr: string;
  elevation: string;
  depth: string;
  diameter: string;
  instruments: string;
  sensorResolution: string;
  description: string;
  color: string;
}

const TARGETS: LunarTarget[] = [
  {
    id: 'T1',
    name: 'Boguslawsky E Crater',
    lat: -74.32,
    lon: 53.64,
    latStr: '74.32° S',
    lonStr: '53.64° E',
    elevation: '-3,240 m',
    depth: '3.8 km',
    diameter: '14.2 km',
    instruments: 'OHRC 0.25m, TMC-2, IIRS',
    sensorResolution: '0.25 m/px',
    description: 'High-priority benchmark calibration site with multi-scale optical coverage and boulder distributions.',
    color: '#00F0FF'
  },
  {
    id: 'T2',
    name: 'Shiv Shakti Point (Ch-3)',
    lat: -69.37,
    lon: 32.35,
    latStr: '69.37° S',
    lonStr: '32.35° E',
    elevation: '-1,820 m',
    depth: '1.2 km',
    diameter: 'N/A (Locus)',
    instruments: 'OHRC 0.25m / TMC-2 Stereo',
    sensorResolution: '0.25 m/px',
    description: 'Chandrayaan-3 landing touchdown locus with multi-temporal pre- and post-landing registration.',
    color: '#32D39A'
  },
  {
    id: 'T3',
    name: 'Tycho Crater Peak',
    lat: -43.35,
    lon: -11.36,
    latStr: '43.35° S',
    lonStr: '11.36° W',
    elevation: '+1,480 m',
    depth: '4.8 km',
    diameter: '85.0 km',
    instruments: 'TMC-2 Triplet Stereo',
    sensorResolution: '5.0 m/px',
    description: 'Prominent young impact crater with massive central peak uplift and high-albedo ejecta rays.',
    color: '#FFB547'
  },
  {
    id: 'T4',
    name: 'Shackleton Crater Rim',
    lat: -89.90,
    lon: 0.00,
    latStr: '89.90° S',
    lonStr: '0.00° E',
    elevation: '+1,200 m',
    depth: '4.2 km',
    diameter: '21.0 km',
    instruments: 'IIRS Hyperspectral & DFRS',
    sensorResolution: '2.0 m/px',
    description: 'Permanently shadowed south polar cold trap preserving cryogenic water ice and volatile deposits.',
    color: '#A78BFA'
  },
  {
    id: 'T5',
    name: 'Copernicus Crater',
    lat: 9.62,
    lon: -20.08,
    latStr: '9.62° N',
    lonStr: '20.08° W',
    elevation: '-3,800 m',
    depth: '3.8 km',
    diameter: '93.0 km',
    instruments: 'OHRC / TMC-2 / CLASS',
    sensorResolution: '0.25 m / 5m',
    description: 'Terraced crater walls with olivine/pyroxene exposures along the central mound peaks.',
    color: '#FF5C67'
  }
];

type RenderMode = 'albedo' | 'elevation' | 'thermal' | 'radar';

export default function ThreeDViewerPage() {
  const canvasContainerRef = useRef<HTMLDivElement>(null);
  const [selectedTarget, setSelectedTarget] = useState<LunarTarget>(TARGETS[0]);
  const [renderMode, setRenderMode] = useState<RenderMode>('albedo');
  const [sunAngle, setSunAngle] = useState<number>(45);
  const [autoRotate, setAutoRotate] = useState<boolean>(true);
  const [showOrbit, setShowOrbit] = useState<boolean>(true);
  const [showFootprints, setShowFootprints] = useState<boolean>(true);
  const [showGrid, setShowGrid] = useState<boolean>(true);
  const [showSensorCone, setShowSensorCone] = useState<boolean>(true);
  const [telemetryAlt, setTelemetryAlt] = useState('100.24 km');
  const [telemetryVel, setTelemetryVel] = useState('1.633 km/s');

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
    sensorCone: THREE.Mesh;
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

  // Helper to convert Lat/Lon to 3D Sphere vector
  const latLonToVector3 = (lat: number, lon: number, radius: number) => {
    const phi = (90 - lat) * (Math.PI / 180);
    const theta = (lon + 180) * (Math.PI / 180);
    const x = -(radius * Math.sin(phi) * Math.cos(theta));
    const z = radius * Math.sin(phi) * Math.sin(theta);
    const y = radius * Math.cos(phi);
    return new THREE.Vector3(x, y, z);
  };

  // Generate high-resolution procedural textures for the Moon
  const createLunarTextures = () => {
    const width = 2048;
    const height = 1024;
    
    // 1. Lunar Albedo (Realistic gray basalt with maria & bright highlands)
    const albedoCanvas = document.createElement('canvas');
    albedoCanvas.width = width;
    albedoCanvas.height = height;
    const ctxA = albedoCanvas.getContext('2d');
    if (ctxA) {
      // Base highland gray
      ctxA.fillStyle = '#8f9399';
      ctxA.fillRect(0, 0, width, height);

      // Dark Mare Basalts (Oceanus Procellarum, Mare Imbrium, Mare Serenitatis, Mare Tranquillitatis)
      const maria = [
        { x: 0.35, y: 0.40, rx: 180, ry: 130 }, // Oceanus Procellarum
        { x: 0.45, y: 0.32, rx: 120, ry: 90 },  // Mare Imbrium
        { x: 0.55, y: 0.36, rx: 90, ry: 75 },   // Mare Serenitatis
        { x: 0.60, y: 0.45, rx: 80, ry: 70 },   // Mare Tranquillitatis
        { x: 0.58, y: 0.58, rx: 70, ry: 60 },   // Mare Nectaris
        { x: 0.68, y: 0.48, rx: 75, ry: 65 },   // Mare Crisium
        { x: 0.46, y: 0.52, rx: 85, ry: 65 },   // Mare Nubium
      ];

      maria.forEach(m => {
        const grad = ctxA.createRadialGradient(
          m.x * width, m.y * height, 10,
          m.x * width, m.y * height, m.rx
        );
        grad.addColorStop(0, 'rgba(42, 45, 50, 0.88)');
        grad.addColorStop(0.7, 'rgba(58, 62, 68, 0.75)');
        grad.addColorStop(1, 'rgba(143, 147, 153, 0)');
        ctxA.fillStyle = grad;
        ctxA.beginPath();
        ctxA.ellipse(m.x * width, m.y * height, m.rx, m.ry, 0, 0, Math.PI * 2);
        ctxA.fill();
      });

      // Impact Craters & Ejecta Rays (Tycho, Copernicus, Kepler)
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
          ctxA.strokeStyle = 'rgba(235, 240, 250, 0.35)';
          ctxA.lineWidth = 1.5;
          for (let i = 0; i < 24; i++) {
            const angle = (i / 24) * Math.PI * 2 + (Math.random() * 0.1);
            const len = 120 + Math.random() * 260;
            ctxA.beginPath();
            ctxA.moveTo(cx, cy);
            ctxA.lineTo(cx + Math.cos(angle) * len, cy + Math.sin(angle) * len);
            ctxA.stroke();
          }
        }

        // Crater Rim
        ctxA.fillStyle = '#ffffff';
        ctxA.beginPath();
        ctxA.arc(cx, cy, c.r + 2, 0, Math.PI * 2);
        ctxA.fill();

        // Crater Floor
        ctxA.fillStyle = '#22252a';
        ctxA.beginPath();
        ctxA.arc(cx, cy, c.r - 2, 0, Math.PI * 2);
        ctxA.fill();
      });

      // Subtle fine micro-crater noise
      ctxA.fillStyle = 'rgba(255,255,255,0.06)';
      for (let i = 0; i < 1500; i++) {
        const rx = Math.random() * width;
        const ry = Math.random() * height;
        const rr = 1 + Math.random() * 3;
        ctxA.beginPath();
        ctxA.arc(rx, ry, rr, 0, Math.PI * 2);
        ctxA.fill();
      }
    }
    const albedoTex = new THREE.CanvasTexture(albedoCanvas);

    // 2. Elevation Hypsometric Heatmap (Deep Purple -> Blue -> Green -> Yellow -> Red)
    const elevCanvas = document.createElement('canvas');
    elevCanvas.width = width;
    elevCanvas.height = height;
    const ctxE = elevCanvas.getContext('2d');
    if (ctxE) {
      const eGrad = ctxE.createLinearGradient(0, 0, 0, height);
      eGrad.addColorStop(0, '#784ba0');
      eGrad.addColorStop(0.2, '#2b86c5');
      eGrad.addColorStop(0.5, '#00d2ff');
      eGrad.addColorStop(0.7, '#24d99b');
      eGrad.addColorStop(0.85, '#f7b733');
      eGrad.addColorStop(1, '#ff416c');
      ctxE.fillStyle = eGrad;
      ctxE.fillRect(0, 0, width, height);

      // Overlay mare lowlands
      ctxE.fillStyle = 'rgba(15, 23, 42, 0.7)';
      ctxE.beginPath();
      ctxE.ellipse(0.45 * width, 0.38 * height, 240, 160, 0, 0, Math.PI * 2);
      ctxE.fill();
    }
    const elevTex = new THREE.CanvasTexture(elevCanvas);

    // 3. Thermal IR Radiance Texture (Solar illuminated hotspot + Cryogenic poles)
    const thermalCanvas = document.createElement('canvas');
    thermalCanvas.width = width;
    thermalCanvas.height = height;
    const ctxT = thermalCanvas.getContext('2d');
    if (ctxT) {
      ctxT.fillStyle = '#050518';
      ctxT.fillRect(0, 0, width, height);

      const tGrad = ctxT.createRadialGradient(
        0.5 * width, 0.5 * height, 10,
        0.5 * width, 0.5 * height, 500
      );
      tGrad.addColorStop(0, '#ffffff'); // 390 Kelvin (117°C)
      tGrad.addColorStop(0.25, '#ff4b1f');
      tGrad.addColorStop(0.55, '#ff9068');
      tGrad.addColorStop(0.8, '#1f1c2c');
      tGrad.addColorStop(1, '#050518'); // 40 Kelvin (-233°C) polar cold traps
      ctxT.fillStyle = tGrad;
      ctxT.fillRect(0, 0, width, height);
    }
    const thermalTex = new THREE.CanvasTexture(thermalCanvas);

    // 4. Radar SAR Rugosity Texture (Metallic cyan / radar backscatter)
    const radarCanvas = document.createElement('canvas');
    radarCanvas.width = width;
    radarCanvas.height = height;
    const ctxR = radarCanvas.getContext('2d');
    if (ctxR) {
      ctxR.fillStyle = '#061325';
      ctxR.fillRect(0, 0, width, height);

      ctxR.strokeStyle = 'rgba(0, 240, 255, 0.25)';
      ctxR.lineWidth = 1;
      for (let y = 0; y < height; y += 12) {
        ctxR.beginPath();
        ctxR.moveTo(0, y);
        for (let x = 0; x < width; x += 30) {
          ctxR.lineTo(x, y + Math.sin(x * 0.05 + y) * 4);
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

    // SCENE & CAMERA
    const scene = new THREE.Scene();
    scene.background = new THREE.Color('#030712');

    const camera = new THREE.PerspectiveCamera(40, width / height, 0.1, 1000);
    camera.position.set(0, 0, 6.2);

    const renderer = new THREE.WebGLRenderer({ antialias: true, alpha: true, powerPreference: 'high-performance' });
    renderer.setSize(width, height);
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
    renderer.toneMapping = THREE.ACESFilmicToneMapping;
    renderer.toneMappingExposure = 1.3;
    renderer.shadowMap.enabled = true;
    renderer.shadowMap.type = THREE.PCFSoftShadowMap;

    container.innerHTML = '';
    container.appendChild(renderer.domElement);

    // LIGHTING
    const ambientLight = new THREE.AmbientLight(0x101b2b, 0.2);
    scene.add(ambientLight);

    const sunLight = new THREE.DirectionalLight(0xffffff, 3.8);
    sunLight.position.set(8, 4, 6);
    sunLight.castShadow = true;
    scene.add(sunLight);

    const earthAlbedoRim = new THREE.DirectionalLight(0x00b8ff, 0.6);
    earthAlbedoRim.position.set(-8, -2, -4);
    scene.add(earthAlbedoRim);

    // STARFIELD
    const starGeo = new THREE.BufferGeometry();
    const starCount = 1200;
    const starPositions = new Float32Array(starCount * 3);
    for (let i = 0; i < starCount * 3; i += 3) {
      starPositions[i] = (Math.random() - 0.5) * 80;
      starPositions[i + 1] = (Math.random() - 0.5) * 80;
      starPositions[i + 2] = (Math.random() - 0.5) * 80;
    }
    starGeo.setAttribute('position', new THREE.BufferAttribute(starPositions, 3));
    const starMat = new THREE.PointsMaterial({ color: 0xffffff, size: 0.08, transparent: true, opacity: 0.85 });
    const stars = new THREE.Points(starGeo, starMat);
    scene.add(stars);

    // MOON GROUP & SPHERE
    const moonGroup = new THREE.Group();
    scene.add(moonGroup);

    const { albedoTex, elevTex, thermalTex, radarTex } = createLunarTextures();

    const moonGeo = new THREE.SphereGeometry(2.0, 96, 96);
    const moonMat = new THREE.MeshStandardMaterial({
      map: albedoTex,
      roughness: 0.85,
      metalness: 0.1,
    });
    const moonMesh = new THREE.Mesh(moonGeo, moonMat);
    moonMesh.castShadow = true;
    moonMesh.receiveShadow = true;
    moonGroup.add(moonMesh);

    // LAT/LON COORDINATE GRID
    const gridGroup = new THREE.Group();
    moonGroup.add(gridGroup);

    // Parallels (Latitudes)
    [-60, -30, 0, 30, 60].forEach(lat => {
      const radiusAtLat = 2.005 * Math.cos(lat * (Math.PI / 180));
      const yAtLat = 2.005 * Math.sin(lat * (Math.PI / 180));
      const circleGeo = new THREE.RingGeometry(radiusAtLat - 0.003, radiusAtLat, 64);
      const circleMat = new THREE.MeshBasicMaterial({ 
        color: 0x4debff, 
        side: THREE.DoubleSide, 
        transparent: true, 
        opacity: 0.25 
      });
      const ring = new THREE.Mesh(circleGeo, circleMat);
      ring.rotation.x = Math.PI / 2;
      ring.position.y = yAtLat;
      gridGroup.add(ring);
    });

    // Meridians (Longitudes)
    [0, 45, 90, 135, 180, 225, 270, 315].forEach(lon => {
      const circleGeo = new THREE.RingGeometry(2.002, 2.005, 64);
      const circleMat = new THREE.MeshBasicMaterial({ 
        color: 0x4debff, 
        side: THREE.DoubleSide, 
        transparent: true, 
        opacity: 0.2 
      });
      const ring = new THREE.Mesh(circleGeo, circleMat);
      ring.rotation.y = lon * (Math.PI / 180);
      gridGroup.add(ring);
    });

    // CRATER TARGET MARKERS (Interactive 3D Pins)
    const markersGroup = new THREE.Group();
    moonGroup.add(markersGroup);

    TARGETS.forEach(t => {
      const pos = latLonToVector3(t.lat, t.lon, 2.02);
      const markerGroup = new THREE.Group();
      markerGroup.position.copy(pos);
      markerGroup.lookAt(new THREE.Vector3(0, 0, 0));

      // Glowing pin dot
      const pinGeo = new THREE.SphereGeometry(0.04, 16, 16);
      const pinMat = new THREE.MeshBasicMaterial({ color: new THREE.Color(t.color) });
      const pin = new THREE.Mesh(pinGeo, pinMat);
      markerGroup.add(pin);

      // Radar ripple ring
      const ringGeo = new THREE.RingGeometry(0.06, 0.08, 24);
      const ringMat = new THREE.MeshBasicMaterial({ color: new THREE.Color(t.color), side: THREE.DoubleSide, transparent: true, opacity: 0.6 });
      const ring = new THREE.Mesh(ringGeo, ringMat);
      markerGroup.add(ring);

      markerGroup.userData = { targetId: t.id, targetData: t };
      markersGroup.add(markerGroup);
    });

    // OBSERVATION SWATH OVERLAYS (OHRC cyan polygon, TMC blue strip, IIRS orange swath)
    const footprintsGroup = new THREE.Group();
    moonGroup.add(footprintsGroup);

    // 1. OHRC High-Res Footprint over Boguslawsky
    const ohrcPos = latLonToVector3(-74.32, 53.64, 2.01);
    const ohrcGeo = new THREE.PlaneGeometry(0.22, 0.35);
    const ohrcMat = new THREE.MeshBasicMaterial({ 
      color: 0x00f0ff, 
      side: THREE.DoubleSide, 
      transparent: true, 
      opacity: 0.45 
    });
    const ohrcMesh = new THREE.Mesh(ohrcGeo, ohrcMat);
    ohrcMesh.position.copy(ohrcPos);
    ohrcMesh.lookAt(new THREE.Vector3(0, 0, 0));
    footprintsGroup.add(ohrcMesh);

    // 2. TMC-2 Stereo Strip Swath
    const tmcPos = latLonToVector3(-45, 10, 2.01);
    const tmcGeo = new THREE.PlaneGeometry(0.4, 1.2);
    const tmcMat = new THREE.MeshBasicMaterial({ 
      color: 0x2f80ff, 
      side: THREE.DoubleSide, 
      transparent: true, 
      opacity: 0.35 
    });
    const tmcMesh = new THREE.Mesh(tmcGeo, tmcMat);
    tmcMesh.position.copy(tmcPos);
    tmcMesh.lookAt(new THREE.Vector3(0, 0, 0));
    footprintsGroup.add(tmcMesh);

    // 3. IIRS Hyperspectral Polar Swath
    const iirsPos = latLonToVector3(-85, 0, 2.01);
    const iirsGeo = new THREE.PlaneGeometry(0.3, 0.6);
    const iirsMat = new THREE.MeshBasicMaterial({ 
      color: 0xffb547, 
      side: THREE.DoubleSide, 
      transparent: true, 
      opacity: 0.4 
    });
    const iirsMesh = new THREE.Mesh(iirsGeo, iirsMat);
    iirsMesh.position.copy(iirsPos);
    iirsMesh.lookAt(new THREE.Vector3(0, 0, 0));
    footprintsGroup.add(iirsMesh);

    // 100 KM POLAR ORBIT PATH
    const orbitRadius = 2.45;
    const orbitPoints = [];
    for (let i = 0; i <= 128; i++) {
      const theta = (i / 128) * Math.PI * 2;
      // Polar orbit inclined at 90 deg (vertical circle)
      orbitPoints.push(new THREE.Vector3(
        orbitRadius * Math.sin(theta) * 0.15, // slight nodal precession
        orbitRadius * Math.cos(theta),
        orbitRadius * Math.sin(theta) * 0.98
      ));
    }
    const orbitGeo = new THREE.BufferGeometry().setFromPoints(orbitPoints);
    const orbitMat = new THREE.LineDashedMaterial({
      color: 0x4debff,
      dashSize: 0.08,
      gapSize: 0.04,
      transparent: true,
      opacity: 0.75
    });
    const orbitLine = new THREE.Line(orbitGeo, orbitMat);
    orbitLine.computeLineDistances();
    scene.add(orbitLine);

    // CHANDRAYAAN-2 SATELLITE MODEL
    const satelliteGroup = new THREE.Group();
    scene.add(satelliteGroup);

    // Satellite Main Gold Thermal Foil Body
    const satBodyGeo = new THREE.BoxGeometry(0.12, 0.12, 0.16);
    const satBodyMat = new THREE.MeshStandardMaterial({ 
      color: 0xd4af37, 
      metalness: 0.9, 
      roughness: 0.2 
    });
    const satBody = new THREE.Mesh(satBodyGeo, satBodyMat);
    satBody.castShadow = true;
    satelliteGroup.add(satBody);

    // Solar Array Wings (Left & Right)
    const panelGeo = new THREE.BoxGeometry(0.35, 0.1, 0.01);
    const panelMat = new THREE.MeshStandardMaterial({ 
      color: 0x1a3b6e, 
      metalness: 0.8, 
      roughness: 0.3 
    });
    const leftPanel = new THREE.Mesh(panelGeo, panelMat);
    leftPanel.position.set(-0.25, 0, 0);
    satelliteGroup.add(leftPanel);

    const rightPanel = new THREE.Mesh(panelGeo, panelMat);
    rightPanel.position.set(0.25, 0, 0);
    satelliteGroup.add(rightPanel);

    // Dish High Gain Antenna
    const dishGeo = new THREE.ConeGeometry(0.06, 0.03, 16, 1, true);
    const dishMat = new THREE.MeshStandardMaterial({ color: 0xcccccc, metalness: 0.5, roughness: 0.4 });
    const dish = new THREE.Mesh(dishGeo, dishMat);
    dish.position.set(0, 0.08, 0);
    dish.rotation.x = Math.PI;
    satelliteGroup.add(dish);

    // Optical Payload Scanning Frustum Cone
    const coneGeo = new THREE.ConeGeometry(0.45, 0.8, 24, 1, true);
    const coneMat = new THREE.MeshBasicMaterial({
      color: 0x00f0ff,
      transparent: true,
      opacity: 0.25,
      side: THREE.DoubleSide
    });
    const sensorCone = new THREE.Mesh(coneGeo, coneMat);
    sensorCone.position.set(0, -0.4, 0);
    sensorCone.rotation.x = Math.PI;
    satelliteGroup.add(sensorCone);

    // INTERACTION / ORBIT CONTROLS
    const controls = {
      isDragging: false,
      prevMousePos: { x: 0, y: 0 },
      targetRotX: 0.3,
      targetRotY: 0.8,
      rotX: 0.3,
      rotY: 0.8,
      targetZoom: 6.2,
      zoom: 6.2,
    };

    const handleMouseDown = (e: MouseEvent) => {
      controls.isDragging = true;
      controls.prevMousePos = { x: e.clientX, y: e.clientY };
    };

    const handleMouseMove = (e: MouseEvent) => {
      if (!controls.isDragging) return;
      const deltaX = e.clientX - controls.prevMousePos.x;
      const deltaY = e.clientY - controls.prevMousePos.y;
      controls.targetRotY += deltaX * 0.006;
      controls.targetRotX += deltaY * 0.006;
      // Clamp vertical rotation
      controls.targetRotX = Math.max(-Math.PI / 2 + 0.1, Math.min(Math.PI / 2 - 0.1, controls.targetRotX));
      controls.prevMousePos = { x: e.clientX, y: e.clientY };
    };

    const handleMouseUp = () => {
      controls.isDragging = false;
    };

    const handleWheel = (e: WheelEvent) => {
      e.preventDefault();
      controls.targetZoom += e.deltaY * 0.004;
      controls.targetZoom = Math.max(3.2, Math.min(10.0, controls.targetZoom));
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

    // ANIMATION LOOP
    let animationFrameId: number;
    let orbitAngle = 0;

    const animate = () => {
      animationFrameId = requestAnimationFrame(animate);

      // Smooth camera orbit damping
      controls.rotX += (controls.targetRotX - controls.rotX) * 0.1;
      controls.rotY += (controls.targetRotY - controls.rotY) * 0.1;
      controls.zoom += (controls.targetZoom - controls.zoom) * 0.1;

      // Auto-rotation when not dragging
      if (autoRotate && !controls.isDragging) {
        controls.targetRotY += 0.002;
      }

      moonGroup.rotation.x = controls.rotX;
      moonGroup.rotation.y = controls.rotY;
      camera.position.z = controls.zoom;

      // Satellite orbital motion along polar track
      orbitAngle += 0.008;
      const satY = orbitRadius * Math.cos(orbitAngle);
      const satZ = orbitRadius * Math.sin(orbitAngle) * 0.98;
      const satX = orbitRadius * Math.sin(orbitAngle) * 0.15;
      satelliteGroup.position.set(satX, satY, satZ);

      // Orient satellite pointing nadir towards lunar center
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
      sensorCone,
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

  // Update textures upon Render Mode switch
  useEffect(() => {
    if (!sceneRef.current) return;
    const { moonMesh } = sceneRef.current;
    const { albedoTex, elevTex, thermalTex, radarTex } = createLunarTextures();

    if (renderMode === 'albedo') {
      (moonMesh.material as THREE.MeshStandardMaterial).map = albedoTex;
      (moonMesh.material as THREE.MeshStandardMaterial).roughness = 0.85;
    } else if (renderMode === 'elevation') {
      (moonMesh.material as THREE.MeshStandardMaterial).map = elevTex;
      (moonMesh.material as THREE.MeshStandardMaterial).roughness = 0.5;
    } else if (renderMode === 'thermal') {
      (moonMesh.material as THREE.MeshStandardMaterial).map = thermalTex;
      (moonMesh.material as THREE.MeshStandardMaterial).roughness = 0.4;
    } else if (renderMode === 'radar') {
      (moonMesh.material as THREE.MeshStandardMaterial).map = radarTex;
      (moonMesh.material as THREE.MeshStandardMaterial).roughness = 0.3;
    }
    (moonMesh.material as THREE.MeshStandardMaterial).needsUpdate = true;
  }, [renderMode]);

  // Update Sun azimuth
  useEffect(() => {
    if (!sceneRef.current) return;
    const rad = (sunAngle * Math.PI) / 180;
    sceneRef.current.sunLight.position.set(Math.cos(rad) * 10, 4, Math.sin(rad) * 10);
  }, [sunAngle]);

  // Toggle Visibility Layers
  useEffect(() => {
    if (!sceneRef.current) return;
    sceneRef.current.orbitLine.visible = showOrbit;
    sceneRef.current.satelliteGroup.visible = showOrbit;
    sceneRef.current.footprintsGroup.visible = showFootprints;
    sceneRef.current.gridGroup.visible = showGrid;
    sceneRef.current.sensorCone.visible = showSensorCone;
  }, [showOrbit, showFootprints, showGrid, showSensorCone]);

  // Smooth Fly-to Target on click
  const flyToTarget = (target: LunarTarget) => {
    setSelectedTarget(target);
    if (!sceneRef.current) return;
    const { controls } = sceneRef.current;
    // Calculate required Euler angles to face the target directly toward the camera
    const phi = (target.lat) * (Math.PI / 180);
    const theta = -(target.lon + 180) * (Math.PI / 180);
    
    controls.targetRotX = phi;
    controls.targetRotY = theta + Math.PI / 2;
    controls.targetZoom = 4.6; // closer zoom on target
  };

  return (
    <div className="min-h-screen bg-[#030712] text-white font-sans selection:bg-[#00F0FF] selection:text-black">
      <EdolusTopNav />

      <main className="pt-20 pb-12 px-4 sm:px-8 max-w-[1920px] mx-auto space-y-6">
        {/* Header Ribbon */}
        <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4 border-b border-white/10 pb-5">
          <div className="flex items-center gap-4">
            <Link
              href="/dashboard"
              className="p-2.5 rounded-xl bg-white/5 hover:bg-white/10 text-white/70 hover:text-white transition-colors border border-white/10 flex items-center gap-2 text-xs font-mono"
            >
              <ArrowLeft className="w-4 h-4" />
              <span>Back to Master Dashboard</span>
            </Link>
            <div>
              <div className="flex items-center gap-2">
                <span className="w-2 h-2 rounded-full bg-[#00F0FF] animate-ping" />
                <div className="text-[10px] font-mono tracking-widest text-[#00F0FF] uppercase">
                  ISRO CHANDRAYAAN-2 SCIENCE OPERATIONS CENTRE • 3D GIS WORKSPACE
                </div>
              </div>
              <h1 className="text-2xl sm:text-3xl font-extrabold tracking-tight text-white mt-0.5 flex items-center gap-3">
                <span>ULTRA-HIGH RES 3D LUNAR & SWATH VISUALIZER</span>
                <span className="px-2.5 py-0.5 rounded text-[11px] font-mono font-bold bg-[#00F0FF]/20 text-[#00F0FF] border border-[#00F0FF]/40">
                  PDS4 CALIBRATED
                </span>
              </h1>
            </div>
          </div>

          {/* Real-time Ephemeris Telemetry */}
          <div className="flex flex-wrap items-center gap-3 font-mono text-xs">
            <div className="px-3.5 py-1.5 rounded-xl bg-white/5 border border-white/10 flex items-center gap-2">
              <Orbit className="w-4 h-4 text-[#00F0FF]" />
              <span className="text-white/50">ALTITUDE:</span>
              <span className="text-white font-bold">{telemetryAlt}</span>
            </div>
            <div className="px-3.5 py-1.5 rounded-xl bg-white/5 border border-white/10 flex items-center gap-2">
              <Activity className="w-4 h-4 text-[#32D39A]" />
              <span className="text-white/50">VELOCITY:</span>
              <span className="text-white font-bold">{telemetryVel}</span>
            </div>
            <div className="px-3.5 py-1.5 rounded-xl bg-[#00F0FF]/10 border border-[#00F0FF]/30 text-[#00F0FF] flex items-center gap-2">
              <Compass className="w-4 h-4" />
              <span>INCLINATION: 90.0° POLAR</span>
            </div>
          </div>
        </div>

        {/* 3D Visualizer Workspace */}
        <div className="grid grid-cols-1 xl:grid-cols-4 gap-6">
          
          {/* Main 3D WebGL Canvas Area (Span 3 Cols) */}
          <div className="xl:col-span-3 relative h-[720px] rounded-3xl bg-[#02040A] border border-white/15 overflow-hidden shadow-[0_0_80px_rgba(0,240,255,0.08)] flex flex-col">
            
            {/* 3D Three.js Container */}
            <div 
              ref={canvasContainerRef} 
              className="w-full h-full cursor-grab active:cursor-grabbing relative"
            />

            {/* Floating Top Left Render Mode Selector */}
            <div className="absolute top-6 left-6 bg-[#07111F]/90 backdrop-blur-md border border-white/15 rounded-2xl p-2 flex items-center gap-1.5 shadow-2xl z-20">
              <button
                onClick={() => setRenderMode('albedo')}
                className={`px-3 py-1.5 rounded-xl text-xs font-mono font-bold transition-all flex items-center gap-1.5 ${
                  renderMode === 'albedo'
                    ? 'bg-[#00F0FF] text-black shadow-lg shadow-[#00F0FF]/25'
                    : 'text-white/70 hover:text-white hover:bg-white/5'
                }`}
              >
                <Eye className="w-3.5 h-3.5" />
                <span>Visual Albedo</span>
              </button>
              <button
                onClick={() => setRenderMode('elevation')}
                className={`px-3 py-1.5 rounded-xl text-xs font-mono font-bold transition-all flex items-center gap-1.5 ${
                  renderMode === 'elevation'
                    ? 'bg-[#00F0FF] text-black shadow-lg shadow-[#00F0FF]/25'
                    : 'text-white/70 hover:text-white hover:bg-white/5'
                }`}
              >
                <Layers className="w-3.5 h-3.5" />
                <span>Elevation Heatmap</span>
              </button>
              <button
                onClick={() => setRenderMode('thermal')}
                className={`px-3 py-1.5 rounded-xl text-xs font-mono font-bold transition-all flex items-center gap-1.5 ${
                  renderMode === 'thermal'
                    ? 'bg-[#00F0FF] text-black shadow-lg shadow-[#00F0FF]/25'
                    : 'text-white/70 hover:text-white hover:bg-white/5'
                }`}
              >
                <Sun className="w-3.5 h-3.5" />
                <span>Thermal IR</span>
              </button>
              <button
                onClick={() => setRenderMode('radar')}
                className={`px-3 py-1.5 rounded-xl text-xs font-mono font-bold transition-all flex items-center gap-1.5 ${
                  renderMode === 'radar'
                    ? 'bg-[#00F0FF] text-black shadow-lg shadow-[#00F0FF]/25'
                    : 'text-white/70 hover:text-white hover:bg-white/5'
                }`}
              >
                <Crosshair className="w-3.5 h-3.5" />
                <span>Radar SAR</span>
              </button>
            </div>

            {/* Floating Bottom Center Solar Lighting & Orbit Speed Controller */}
            <div className="absolute bottom-6 left-1/2 -translate-x-1/2 bg-[#07111F]/90 backdrop-blur-md border border-white/15 rounded-2xl px-5 py-3 flex items-center gap-6 shadow-2xl z-20 font-mono text-xs">
              <div className="flex items-center gap-2.5">
                <Sun className="w-4 h-4 text-[#FFB547]" />
                <span className="text-white/60 text-[11px]">SUN AZIMUTH:</span>
                <input
                  type="range"
                  min="0"
                  max="360"
                  value={sunAngle}
                  onChange={(e) => setSunAngle(Number(e.target.value))}
                  className="w-28 accent-[#FFB547] cursor-pointer"
                />
                <span className="text-[#FFB547] font-bold w-10 text-right">{sunAngle}°</span>
              </div>

              <div className="h-4 w-[1px] bg-white/20" />

              <div className="flex items-center gap-2">
                <button
                  onClick={() => setAutoRotate(!autoRotate)}
                  className={`p-2 rounded-xl border transition-colors flex items-center gap-1.5 text-[11px] ${
                    autoRotate 
                      ? 'bg-[#32D39A]/20 border-[#32D39A]/40 text-[#32D39A]' 
                      : 'bg-white/5 border-white/10 text-white/60'
                  }`}
                >
                  {autoRotate ? <Pause className="w-3.5 h-3.5" /> : <Play className="w-3.5 h-3.5" />}
                  <span>{autoRotate ? 'Auto Rotation ON' : 'Auto Rotation OFF'}</span>
                </button>
              </div>
            </div>

            {/* Floating Bottom Left Viewport Guidance */}
            <div className="absolute bottom-6 left-6 text-[10px] font-mono text-white/40 flex items-center gap-2 pointer-events-none">
              <Navigation className="w-3.5 h-3.5 text-[#00F0FF]" />
              <span>DRAG TO ROTATE 360° • SCROLL WHEEL TO ZOOM • CLICK TARGET TO FLY</span>
            </div>
          </div>

          {/* Right Control & Science Inspection Drawer (Span 1 Col) */}
          <div className="space-y-6">
            
            {/* Target Information Card */}
            <div className="bg-[#07111F]/90 border border-white/15 rounded-3xl p-6 shadow-2xl space-y-4">
              <div className="flex items-center justify-between border-b border-white/10 pb-3">
                <div className="flex items-center gap-2 text-white font-bold text-base">
                  <MapPin className="w-5 h-5 text-[#00F0FF]" />
                  <span>{selectedTarget.name}</span>
                </div>
                <span className="px-2 py-0.5 rounded text-[10px] font-mono font-bold bg-[#32D39A]/20 text-[#32D39A] border border-[#32D39A]/40">
                  FOCUSED
                </span>
              </div>

              <p className="text-xs text-white/70 font-sans leading-relaxed">
                {selectedTarget.description}
              </p>

              {/* Physical Metrics Grid */}
              <div className="grid grid-cols-2 gap-2 text-xs font-mono bg-[#03070E] p-3.5 rounded-2xl border border-white/5">
                <div>
                  <span className="text-white/40 block text-[10px]">LATITUDE / LON</span>
                  <span className="text-white font-bold text-xs">{selectedTarget.latStr}, {selectedTarget.lonStr}</span>
                </div>
                <div>
                  <span className="text-white/40 block text-[10px]">ELEVATION RELIEF</span>
                  <span className="text-[#00F0FF] font-bold text-xs">{selectedTarget.elevation}</span>
                </div>
                <div className="pt-2">
                  <span className="text-white/40 block text-[10px]">CRATER DIAMETER</span>
                  <span className="text-white font-bold text-xs">{selectedTarget.diameter}</span>
                </div>
                <div className="pt-2">
                  <span className="text-white/40 block text-[10px]">BEST RESOLUTION</span>
                  <span className="text-[#32D39A] font-bold text-xs">{selectedTarget.sensorResolution}</span>
                </div>
                <div className="col-span-2 pt-2 border-t border-white/5">
                  <span className="text-white/40 block text-[10px]">COVERING INSTRUMENTS</span>
                  <span className="text-white font-bold text-xs">{selectedTarget.instruments}</span>
                </div>
              </div>

              {/* Elevation Profile Graph (Simulated LALT / TMC LIDAR) */}
              <div className="bg-[#03070E] p-3.5 rounded-2xl border border-white/5 space-y-2">
                <div className="flex items-center justify-between text-[10px] font-mono text-white/60">
                  <span>TOPOGRAPHIC CROSS-SECTION</span>
                  <span className="text-[#00F0FF]">LALT STEREO-DEM</span>
                </div>
                <div className="h-16 w-full relative flex items-end">
                  <svg className="w-full h-full overflow-visible" viewBox="0 0 100 40" preserveAspectRatio="none">
                    <defs>
                      <linearGradient id="elevGrad" x1="0" y1="0" x2="0" y2="1">
                        <stop offset="0%" stopColor="#00F0FF" stopOpacity="0.4" />
                        <stop offset="100%" stopColor="#00F0FF" stopOpacity="0.0" />
                      </linearGradient>
                    </defs>
                    <path
                      d="M 0 15 Q 20 18, 35 12 Q 40 38, 50 38 Q 60 38, 65 12 Q 80 18, 100 15 L 100 40 L 0 40 Z"
                      fill="url(#elevGrad)"
                    />
                    <path
                      d="M 0 15 Q 20 18, 35 12 Q 40 38, 50 38 Q 60 38, 65 12 Q 80 18, 100 15"
                      fill="none"
                      stroke="#00F0FF"
                      strokeWidth="1.5"
                    />
                  </svg>
                </div>
                <div className="flex justify-between text-[9px] font-mono text-white/40">
                  <span>West Rim (+1.2km)</span>
                  <span className="text-[#FF5C67]">Floor (-3.2km)</span>
                  <span>East Rim (+1.4km)</span>
                </div>
              </div>

              {/* Action Buttons */}
              <div className="space-y-2 pt-1">
                <Link
                  href="/correspondence"
                  className="w-full py-3 rounded-2xl bg-gradient-to-r from-[#2F80FF] to-[#00F0FF] text-black font-bold text-xs uppercase tracking-wider flex items-center justify-center gap-2 shadow-lg shadow-[#00F0FF]/20 hover:brightness-110 transition-all font-mono"
                >
                  <GitCompare className="w-4 h-4 text-black" />
                  <span>Run Correspondence on Site →</span>
                </Link>

                <Link
                  href="/reports"
                  className="w-full py-2.5 rounded-2xl bg-white/5 hover:bg-white/10 text-white/80 hover:text-white border border-white/10 font-bold text-xs uppercase tracking-wider flex items-center justify-center gap-2 transition-all font-mono"
                >
                  <Database className="w-4 h-4 text-[#00F0FF]" />
                  <span>Generate Scientific Report</span>
                </Link>
              </div>
            </div>

            {/* Target Fly-To Carousel */}
            <div className="bg-[#07111F]/90 border border-white/15 rounded-3xl p-5 shadow-2xl space-y-3 font-mono">
              <div className="flex items-center justify-between text-xs text-[#00F0FF] font-bold uppercase">
                <div className="flex items-center gap-2">
                  <Crosshair className="w-4 h-4" />
                  <span>QUICK FLY-TO SITES</span>
                </div>
                <span className="text-[10px] text-white/40">{TARGETS.length} TARGETS</span>
              </div>

              <div className="space-y-1.5">
                {TARGETS.map(t => (
                  <button
                    key={t.id}
                    onClick={() => flyToTarget(t)}
                    className={`w-full p-3 rounded-xl text-left text-xs transition-all flex items-center justify-between border ${
                      selectedTarget.id === t.id
                        ? 'bg-[#00F0FF]/15 border-[#00F0FF] text-white shadow-lg'
                        : 'bg-white/5 border-white/5 text-white/70 hover:bg-white/10 hover:text-white'
                    }`}
                  >
                    <div>
                      <div className="font-bold flex items-center gap-2">
                        <span className="w-2 h-2 rounded-full" style={{ backgroundColor: t.color }} />
                        <span>{t.name}</span>
                      </div>
                      <div className="text-[10px] text-white/40 mt-0.5">{t.latStr}, {t.lonStr}</div>
                    </div>
                    <ChevronRight className="w-4 h-4 text-white/40" />
                  </button>
                ))}
              </div>
            </div>

            {/* Layer Visibility Toggles */}
            <div className="bg-[#07111F]/90 border border-white/15 rounded-3xl p-5 shadow-2xl space-y-3 font-mono text-xs">
              <div className="flex items-center gap-2 text-[#00F0FF] font-bold uppercase">
                <Sliders className="w-4 h-4" />
                <span>ACTIVE DISPLAY LAYERS</span>
              </div>

              <div className="space-y-2">
                <label className="flex items-center justify-between p-2 rounded-xl bg-white/5 cursor-pointer hover:bg-white/10">
                  <span className="text-white/80 text-[11px]">100km Polar Orbit Ring</span>
                  <input
                    type="checkbox"
                    checked={showOrbit}
                    onChange={(e) => setShowOrbit(e.target.checked)}
                    className="accent-[#00F0FF] w-4 h-4 rounded"
                  />
                </label>

                <label className="flex items-center justify-between p-2 rounded-xl bg-white/5 cursor-pointer hover:bg-white/10">
                  <span className="text-white/80 text-[11px]">Sensor Footprints (OHRC/TMC)</span>
                  <input
                    type="checkbox"
                    checked={showFootprints}
                    onChange={(e) => setShowFootprints(e.target.checked)}
                    className="accent-[#00F0FF] w-4 h-4 rounded"
                  />
                </label>

                <label className="flex items-center justify-between p-2 rounded-xl bg-white/5 cursor-pointer hover:bg-white/10">
                  <span className="text-white/80 text-[11px]">Coordinate Graticule Grid</span>
                  <input
                    type="checkbox"
                    checked={showGrid}
                    onChange={(e) => setShowGrid(e.target.checked)}
                    className="accent-[#00F0FF] w-4 h-4 rounded"
                  />
                </label>

                <label className="flex items-center justify-between p-2 rounded-xl bg-white/5 cursor-pointer hover:bg-white/10">
                  <span className="text-white/80 text-[11px]">Satellite Nadir Beam Cone</span>
                  <input
                    type="checkbox"
                    checked={showSensorCone}
                    onChange={(e) => setShowSensorCone(e.target.checked)}
                    className="accent-[#00F0FF] w-4 h-4 rounded"
                  />
                </label>
              </div>
            </div>

          </div>

        </div>
      </main>
    </div>
  );
}
