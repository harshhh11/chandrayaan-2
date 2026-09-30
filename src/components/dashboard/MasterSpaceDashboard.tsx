'use client';

import React, { useState, useEffect, useRef } from 'react';
import Link from 'next/link';
import { 
  Orbit, Globe, Compass, Activity, ArrowRight, Play, Eye, 
  Layers, Radio, ShieldAlert, CheckCircle2, ChevronRight,
  Maximize2, Database, Sliders, RefreshCw, Sparkles, TrendingUp,
  Crosshair, Sun, Move, Zap, Split, FileText
} from 'lucide-react';
import { EdolusTopNav } from '@/components/layout/EdolusTopNav';

interface AnalyticsData {
  images_indexed: number;
  ohrc_count: number;
  tmc_count: number;
  iirs_count: number;
  matches_processed: number;
  avg_correspondence_rate: number;
}

export const MasterSpaceDashboard: React.FC = () => {
  const [analytics, setAnalytics] = useState<AnalyticsData>({
    images_indexed: 12486,
    ohrc_count: 4821,
    tmc_count: 5204,
    iirs_count: 2461,
    matches_processed: 8932,
    avg_correspondence_rate: 91.4
  });

  const [activeLayers, setActiveLayers] = useState({
    chandrayaan2: true,
    chandrayaan3: true,
    isroSatellites: true,
    spaceDebris: false,
    groundStations: true
  });

  const [timerSeconds, setTimerSeconds] = useState(754); // 12m 34s
  const [selectedSensor, setSelectedSensor] = useState<'OHRC' | 'TMC-2' | 'IIRS'>('OHRC');
  const [isMatching, setIsMatching] = useState(false);
  const [matchDone, setMatchDone] = useState(true);
  const [demoVideoOpen, setDemoVideoOpen] = useState(false);

  // Fetch real backend analytics
  useEffect(() => {
    fetch('http://127.0.0.1:8000/api/analytics/summary')
      .then(res => res.ok ? res.json() : null)
      .then(data => {
        if (data) setAnalytics(data);
      })
      .catch(() => {});
  }, []);

  // Orbital countdown timer
  useEffect(() => {
    const interval = setInterval(() => {
      setTimerSeconds(prev => (prev > 0 ? prev - 1 : 754));
    }, 1000);
    return () => clearInterval(interval);
  }, []);

  const formatTimer = (seconds: number) => {
    const m = Math.floor(seconds / 60);
    const s = seconds % 60;
    return `${m}m ${s < 10 ? '0' : ''}${s}s`;
  };

  const handleRunMatch = () => {
    setIsMatching(true);
    setMatchDone(false);
    setTimeout(() => {
      setIsMatching(false);
      setMatchDone(true);
    }, 1200);
  };

  return (
    <div className="min-h-screen bg-[#050A12] text-[#F5F7FA] font-sans antialiased selection:bg-[#4DEBFF] selection:text-black overflow-x-hidden">
      
      {/* Top Persistent Aerospace Navbar */}
      <EdolusTopNav />

      {/* Main Content Area */}
      <main className="pt-20 pb-16 px-4 sm:px-8 lg:px-12 max-w-[1920px] mx-auto space-y-8">

        {/* ========================================================
            1. HERO / PRIMARY SPACE VISUAL SCENE (MATCHING REFERENCE)
           ======================================================== */}
        <div className="relative rounded-3xl overflow-hidden border border-[#4DEBFF]/20 bg-gradient-to-b from-[#081322] via-[#060D17] to-[#050A12] p-6 sm:p-12 lg:p-14 shadow-[0_0_60px_rgba(0,184,255,0.15)] min-h-[580px] flex flex-col justify-between select-none">
          
          {/* Deep Space Background Layer: Earth Curve with Night Lights + Moon + Nebula */}
          <div className="absolute inset-0 pointer-events-none overflow-hidden">
            {/* Ambient Cosmic Radial Glows */}
            <div className="absolute top-1/4 right-1/4 w-[700px] h-[700px] rounded-full bg-[radial-gradient(circle_at_center,rgba(0,184,255,0.2)_0%,rgba(47,128,255,0.05)_50%,transparent_75%)] blur-3xl" />
            <div className="absolute -bottom-40 left-1/3 w-[900px] h-[500px] rounded-full bg-[radial-gradient(ellipse_at_center,rgba(0,200,255,0.12)_0%,transparent_70%)] blur-2xl" />

            {/* Earth Limb Curvature with Atmosphere Glow & Night Lights (Pure SVG/CSS) */}
            <div className="absolute -bottom-32 right-0 left-0 h-[380px] opacity-40 mix-blend-screen pointer-events-none">
              <svg className="w-full h-full" viewBox="0 0 1440 380" preserveAspectRatio="none">
                <defs>
                  <radialGradient id="earthGlow" cx="50%" cy="100%" r="60%">
                    <stop offset="0%" stopColor="#4DEBFF" stopOpacity="0.35" />
                    <stop offset="40%" stopColor="#0055FF" stopOpacity="0.15" />
                    <stop offset="100%" stopColor="transparent" stopOpacity="0" />
                  </radialGradient>
                </defs>
                <path
                  d="M0,380 Q720,180 1440,380 L1440,380 L0,380 Z"
                  fill="url(#earthGlow)"
                />
                <path
                  d="M0,380 Q720,180 1440,380"
                  fill="none"
                  stroke="#4DEBFF"
                  strokeWidth="2"
                  className="opacity-70 shadow-[0_0_15px_#4DEBFF]"
                />
              </svg>
            </div>

            {/* Orbital Trajectory Circles & Golden Markers */}
            <div className="absolute top-12 right-36 w-[520px] h-[520px] rounded-full border border-dashed border-[#4DEBFF]/25 animate-spin" style={{ animationDuration: '120s' }} />
            <div className="absolute top-24 right-48 w-[400px] h-[400px] rounded-full border border-[#00B8FF]/15" />
            
            {/* Golden Target Pulse on Orbit */}
            <div className="absolute top-44 right-52 flex items-center justify-center">
              <div className="w-6 h-6 rounded-full border border-[#FFB547] animate-ping" />
              <div className="w-2 h-2 rounded-full bg-[#FFB547] absolute" />
            </div>
          </div>

          {/* Central-Right Spacecraft Render (Visual Representation of Chandrayaan-2 Orbiter) */}
          <div className="absolute top-1/2 right-12 lg:right-32 -translate-y-1/2 w-80 sm:w-[460px] h-[340px] pointer-events-none z-10 hidden sm:flex items-center justify-center">
            {/* Stylized Photorealistic Chandrayaan-2 Spacecraft Component */}
            <div className="relative w-full h-full flex items-center justify-center animate-pulse" style={{ animationDuration: '6s' }}>
              
              {/* Solar Array Left Wing */}
              <div className="absolute left-4 top-1/2 -translate-y-1/2 w-32 h-44 rounded-lg bg-gradient-to-r from-[#0d223a] via-[#1a3a60] to-[#254f80] border-2 border-[#4DEBFF]/50 shadow-[0_0_30px_rgba(77,235,255,0.25)] -rotate-12 grid grid-cols-4 gap-1 p-1">
                {Array.from({ length: 16 }).map((_, i) => (
                  <div key={i} className="bg-[#0b1b2d] border border-[#4DEBFF]/30 rounded-sm" />
                ))}
              </div>

              {/* Main Cubical Spacecraft Bus */}
              <div className="relative w-36 h-36 rounded-2xl bg-gradient-to-br from-[#d9e2ec] via-[#9fb3c8] to-[#486581] border-2 border-white/60 shadow-[0_0_40px_rgba(255,255,255,0.3)] z-20 flex flex-col items-center justify-between p-3 rotate-6">
                {/* ISRO Insignia & Thermal Blankets */}
                <div className="flex items-center justify-between w-full">
                  <div className="w-4 h-4 rounded-full bg-[#FF9933] border border-white" />
                  <span className="text-[8px] font-mono font-bold text-black bg-white/80 px-1 rounded">ISRO</span>
                  <div className="w-3 h-3 rounded-full bg-[#138808] border border-white" />
                </div>

                {/* Optical Payloads Bay (OHRC / TMC-2 Lenses) */}
                <div className="w-16 h-16 rounded-full bg-black border-2 border-[#4DEBFF] shadow-[0_0_20px_#4DEBFF] flex items-center justify-center">
                  <div className="w-8 h-8 rounded-full bg-[#001f3f] border border-[#00B8FF] flex items-center justify-center">
                    <div className="w-3 h-3 rounded-full bg-[#4DEBFF] animate-ping" />
                  </div>
                </div>

                <span className="text-[7px] font-mono font-bold tracking-wider text-black">CHANDRAYAAN-2</span>
              </div>

              {/* Solar Array Right Wing */}
              <div className="absolute right-4 top-1/2 -translate-y-1/2 w-32 h-44 rounded-lg bg-gradient-to-l from-[#0d223a] via-[#1a3a60] to-[#254f80] border-2 border-[#4DEBFF]/50 shadow-[0_0_30px_rgba(77,235,255,0.25)] -rotate-12 grid grid-cols-4 gap-1 p-1">
                {Array.from({ length: 16 }).map((_, i) => (
                  <div key={i} className="bg-[#0b1b2d] border border-[#4DEBFF]/30 rounded-sm" />
                ))}
              </div>

              {/* High Gain Dish Antenna */}
              <div className="absolute -top-6 right-20 w-16 h-16 rounded-full border-2 border-white/70 bg-gradient-to-tr from-gray-700 to-gray-300 rotate-45 shadow-lg flex items-center justify-center">
                <div className="w-2 h-8 bg-white rotate-45" />
              </div>
            </div>
          </div>

          {/* Top Row Content: Left Status + Right Floating Telemetry Card */}
          <div className="relative z-20 flex flex-col lg:flex-row items-start lg:items-center justify-between gap-8">
            
            {/* Left Hero Title & Description */}
            <div className="space-y-4 max-w-2xl">
              {/* Status Pill */}
              <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-[#00B8FF]/10 border border-[#4DEBFF]/30 text-[#4DEBFF] text-xs font-mono font-bold tracking-widest uppercase shadow-[0_0_15px_rgba(0,184,255,0.2)]">
                <span className="w-2 h-2 rounded-full bg-[#4DEBFF] shadow-[0_0_8px_#4DEBFF] animate-pulse" />
                <span>LIVE FROM LUNAR ORBIT</span>
              </div>

              {/* Massive Main Heading */}
              <h1 className="text-4xl sm:text-6xl lg:text-7xl font-black tracking-tight text-white font-sans uppercase leading-[0.95]">
                ORBITAL<br />
                <span className="bg-gradient-to-r from-white via-[#4DEBFF] to-[#2F80FF] bg-clip-text text-transparent">
                  INTELLIGENCE
                </span>
              </h1>

              {/* Subtitle */}
              <p className="text-sm sm:text-base text-white/75 font-sans leading-relaxed max-w-xl font-light">
                Real-time satellite tracking, analysis and mission insights for a safer, smarter space future.
              </p>

              {/* Action Buttons */}
              <div className="flex flex-wrap items-center gap-3 pt-2">
                <Link
                  href="/3d"
                  className="px-6 py-3.5 rounded-full bg-white text-black font-mono text-xs font-bold tracking-wider uppercase shadow-[0_0_25px_rgba(255,255,255,0.4)] hover:bg-[#4DEBFF] hover:shadow-[0_0_30px_#4DEBFF] transition-all flex items-center gap-2 group"
                >
                  <span>Explore in 3D</span>
                  <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
                </Link>

                <Link
                  href="/correspondence"
                  className="px-6 py-3.5 rounded-full bg-white/[0.06] hover:bg-white/[0.12] border border-white/20 hover:border-[#4DEBFF]/40 text-white font-mono text-xs tracking-wider uppercase transition-all flex items-center gap-2"
                >
                  <Play className="w-3.5 h-3.5 text-[#4DEBFF] fill-[#4DEBFF]" />
                  <span>Run Correspondence</span>
                </Link>
              </div>
            </div>

            {/* Top-Right Floating Glass Telemetry Card (Matching Screenshot exactly) */}
            <div className="w-full sm:w-84 rounded-2xl bg-[#07111F]/80 backdrop-blur-xl border border-white/15 p-4 shadow-2xl flex flex-col gap-3">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-3">
                  {/* Realistic Moon Thumbnail */}
                  <div className="w-11 h-11 rounded-full bg-[#112233] border border-white/20 overflow-hidden shadow-inner flex items-center justify-center relative">
                    <img 
                      src="/api/images/DS-OHRC-BOGUSLAWSKY-01.png" 
                      alt="Moon"
                      className="w-full h-full object-cover"
                      onError={(e) => {
                        (e.target as HTMLElement).style.display = 'none';
                      }}
                    />
                    <Orbit className="w-6 h-6 text-[#4DEBFF]" />
                  </div>
                  <div>
                    <h4 className="text-xs font-mono font-bold text-white">Chandrayaan-2 (OHRC)</h4>
                    <span className="text-[10px] font-mono text-[#24D99B] flex items-center gap-1.5 mt-0.5">
                      <span className="w-1.5 h-1.5 rounded-full bg-[#24D99B] animate-pulse" /> In Orbit
                    </span>
                  </div>
                </div>
              </div>

              {/* Telemetry Key-Value Grid */}
              <div className="grid grid-cols-2 gap-3 text-[11px] font-mono border-t border-white/10 pt-3">
                <div>
                  <span className="text-white/40 block text-[9px] uppercase">Altitude</span>
                  <span className="text-white font-bold">100 km</span>
                </div>
                <div>
                  <span className="text-white/40 block text-[9px] uppercase">Inclination</span>
                  <span className="text-white font-bold">90.0° Polar</span>
                </div>
                <div>
                  <span className="text-white/40 block text-[9px] uppercase">Velocity</span>
                  <span className="text-white font-bold">1.60 km/s</span>
                </div>
                <div>
                  <span className="text-white/40 block text-[9px] uppercase">Next Pass</span>
                  <span className="text-[#4DEBFF] font-bold">{formatTimer(timerSeconds)}</span>
                </div>
              </div>
            </div>

          </div>

          {/* Bottom Row: Location & Lunar Target Indicator */}
          <div className="relative z-20 flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-t border-white/10 pt-6 mt-8">
            <div className="flex items-center gap-3 font-mono text-xs text-white/70">
              <span className="text-white/40">PAYLOADS:</span>
              <span className="px-2 py-0.5 rounded bg-[#4DEBFF]/10 text-[#4DEBFF] font-bold border border-[#4DEBFF]/30">OHRC 0.25m</span>
              <span className="px-2 py-0.5 rounded bg-[#2F80FF]/10 text-[#2F80FF] font-bold border border-[#2F80FF]/30">TMC-2 Stereo</span>
              <span className="px-2 py-0.5 rounded bg-[#FFB547]/10 text-[#FFB547] font-bold border border-[#FFB547]/30">IIRS Spectra</span>
            </div>

            {/* Interactive Target Coordinates */}
            <Link
              href="/map"
              className="flex items-center gap-2.5 font-mono text-xs text-white/80 hover:text-white transition-colors group self-start sm:self-auto"
            >
              <Crosshair className="w-4 h-4 text-[#4DEBFF] animate-spin" style={{ animationDuration: '24s' }} />
              <span className="text-white font-bold">74.32° S, 53.64° E</span>
              <span className="text-white/30">•</span>
              <span className="text-[#4DEBFF] tracking-wider">BOGUSLAWSKY CRATER</span>
              <span className="px-1.5 py-0.5 rounded bg-[#4DEBFF]/20 text-[#4DEBFF] text-[9px] font-bold">LIVE</span>
            </Link>
          </div>

        </div>

        {/* ========================================================
            2. HORIZONTAL FEATURE STRIP (6 FLOATING AEROSPACE MODULES)
           ======================================================== */}
        <div className="grid grid-cols-2 md:grid-cols-3 xl:grid-cols-6 gap-3 sm:gap-4">
          {[
            { title: 'Live Tracking', desc: 'Real-time satellite positions', icon: Compass, href: '/map' },
            { title: '3D Visualization', desc: 'Interactive Earth & orbit view', icon: Globe, href: '/3d' },
            { title: 'Mission Analytics', desc: 'Performance & insights', icon: Activity, href: '/analytics' },
            { title: 'Orbital Prediction', desc: 'Future trajectory & pass times', icon: Orbit, href: '/predictions' },
            { title: 'Conjunction Alerts', desc: 'Collision risk monitoring', icon: ShieldAlert, href: '/alerts', isAlert: true },
            { title: 'Ground Stations', desc: 'Communication windows', icon: Radio, href: '/mission' },
          ].map((item, idx) => {
            const Icon = item.icon;
            return (
              <Link
                key={idx}
                href={item.href}
                className="p-4 rounded-2xl bg-[#07111F]/80 hover:bg-[#0B1726] border border-white/10 hover:border-[#4DEBFF]/40 transition-all duration-300 group flex items-center justify-between shadow-lg"
              >
                <div className="flex items-center gap-3">
                  <div className={`w-9 h-9 rounded-xl flex items-center justify-center transition-transform group-hover:scale-110 ${
                    item.isAlert 
                      ? 'bg-[#FF5C67]/20 border border-[#FF5C67]/30 text-[#FF5C67]' 
                      : 'bg-[#2F80FF]/15 border border-[#4DEBFF]/30 text-[#4DEBFF]'
                  }`}>
                    <Icon className="w-4 h-4" />
                  </div>
                  <div>
                    <h4 className="text-xs font-mono font-bold text-white group-hover:text-[#4DEBFF] transition-colors">
                      {item.title}
                    </h4>
                    <p className="text-[10px] text-white/40 truncate max-w-[130px] font-sans">
                      {item.desc}
                    </p>
                  </div>
                </div>
                <ChevronRight className="w-4 h-4 text-white/20 group-hover:text-[#4DEBFF] group-hover:translate-x-0.5 transition-all" />
              </Link>
            );
          })}
        </div>

        {/* ========================================================
            3. MAIN DASHBOARD AREA (3-COLUMN COMPOSITION)
           ======================================================== */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
          
          {/* LEFT COLUMN: LARGE LIVE ORBITAL VIEW (5 Columns) */}
          <div className="lg:col-span-5 rounded-3xl bg-[#07111F]/90 border border-white/10 p-5 flex flex-col justify-between relative overflow-hidden min-h-[480px] shadow-2xl">
            {/* Header */}
            <div className="flex items-center justify-between border-b border-white/5 pb-3">
              <div className="flex items-center gap-2">
                <Globe className="w-4 h-4 text-[#4DEBFF]" />
                <h3 className="text-xs font-mono font-bold tracking-widest uppercase text-white">
                  LIVE ORBITAL VIEW
                </h3>
              </div>
              <span className="text-[10px] font-mono text-[#24D99B] bg-[#24D99B]/10 px-2 py-0.5 rounded border border-[#24D99B]/30">
                100 KM CIRCULAR
              </span>
            </div>

            {/* Interactive Lunar Globe Canvas Simulation */}
            <div className="relative flex-1 my-4 rounded-2xl bg-[#050A12] border border-white/5 overflow-hidden flex items-center justify-center">
              {/* Stars Background */}
              <div className="absolute inset-0 bg-[radial-gradient(circle_at_50%_50%,#0B1726_0%,#050A12_100%)]" />

              {/* Realistic Textured Lunar Sphere Simulation */}
              <div className="relative w-56 h-56 sm:w-72 sm:h-72 rounded-full border border-[#4DEBFF]/30 bg-gradient-to-tr from-[#081322] via-[#102035] to-[#1e395c] shadow-[0_0_60px_rgba(0,184,255,0.25)] overflow-hidden flex items-center justify-center">
                {/* Surface Crater Formations */}
                <div className="absolute inset-0 opacity-40">
                  <div className="w-14 h-14 rounded-full border border-dashed border-white/30 absolute top-8 left-10" />
                  <div className="w-20 h-20 rounded-full border border-dashed border-white/30 absolute bottom-10 right-8" />
                  <div className="w-8 h-8 rounded-full bg-black/50 absolute top-20 right-16" />
                  <div className="w-full h-[1px] bg-[#4DEBFF]/20 absolute top-1/2" />
                  <div className="h-full w-[1px] bg-[#4DEBFF]/20 absolute left-1/2" />
                </div>

                {/* Animated Polar Orbit Rings */}
                <div className="absolute inset-0 rounded-full border-2 border-dashed border-[#4DEBFF]/50 rotate-45 scale-110 animate-pulse" />

                {/* Real-Time Satellite Pin Marker */}
                <div className="absolute top-1/3 left-1/2 -translate-x-1/2 -translate-y-1/2 flex items-center gap-1.5 bg-[#07111F]/90 border border-[#4DEBFF] px-2.5 py-1 rounded-full shadow-lg z-20">
                  <span className="w-2 h-2 rounded-full bg-[#4DEBFF] animate-ping" />
                  <span className="text-[9px] font-mono text-white font-bold">Chandrayaan-2 (Alt: 100km)</span>
                </div>
              </div>

              {/* Floating Layer Checklist (Left overlay from reference image) */}
              <div className="absolute bottom-3 left-3 bg-[#07111F]/95 backdrop-blur-md border border-white/10 rounded-xl p-3 text-[10px] font-mono space-y-1.5 z-20">
                {[
                  { key: 'chandrayaan2', label: 'Chandrayaan-2' },
                  { key: 'chandrayaan3', label: 'Chandrayaan-3' },
                  { key: 'isroSatellites', label: 'ISRO Satellites' },
                  { key: 'spaceDebris', label: 'Space Debris' },
                  { key: 'groundStations', label: 'Ground Stations' },
                ].map(item => (
                  <label key={item.key} className="flex items-center gap-2 cursor-pointer text-white/70 hover:text-white">
                    <input
                      type="checkbox"
                      checked={activeLayers[item.key as keyof typeof activeLayers]}
                      onChange={(e) => setActiveLayers({ ...activeLayers, [item.key]: e.target.checked })}
                      className="rounded bg-white/10 border-white/20 text-[#00B8FF] focus:ring-0 w-3.5 h-3.5"
                    />
                    <span>{item.label}</span>
                  </label>
                ))}
              </div>

              {/* Zoom & Fullscreen Controls */}
              <div className="absolute bottom-3 right-3 flex flex-col gap-1 z-20">
                <Link
                  href="/3d"
                  className="p-2 rounded-lg bg-[#07111F]/90 border border-white/10 hover:border-[#4DEBFF]/40 text-white/60 hover:text-white transition-colors"
                  title="Expand to Fullscreen 3D Lunar Viewer"
                >
                  <Maximize2 className="w-3.5 h-3.5" />
                </Link>
              </div>
            </div>

            <div className="flex items-center justify-between text-[11px] font-mono text-white/50 pt-1">
              <span>ORBIT: POLAR 90.0°</span>
              <span className="text-[#4DEBFF]">GROUND TRACK: ACTIVE</span>
            </div>
          </div>

          {/* CENTER COLUMN: SATELLITE INFORMATION & CORRESPONDENCE (4 Columns) */}
          <div className="lg:col-span-4 rounded-3xl bg-[#07111F]/90 border border-white/10 p-5 flex flex-col justify-between space-y-4 shadow-2xl">
            {/* Header */}
            <div className="flex items-center justify-between border-b border-white/5 pb-3">
              <div className="flex items-center gap-2">
                <Orbit className="w-4 h-4 text-[#4DEBFF]" />
                <h3 className="text-xs font-mono font-bold tracking-widest uppercase text-white">
                  SATELLITE INFORMATION
                </h3>
              </div>
              <span className="text-[10px] font-mono text-white/50">
                ISRO / SAC
              </span>
            </div>

            {/* Spacecraft Graphic + ISRO Title Card */}
            <div className="flex items-center gap-3.5 bg-[#050A12] p-3 rounded-2xl border border-white/5">
              <div className="w-14 h-14 rounded-xl bg-gradient-to-tr from-[#081322] to-[#12243d] border border-[#4DEBFF]/30 p-2 flex items-center justify-center shrink-0">
                <Orbit className="w-7 h-7 text-[#4DEBFF]" />
              </div>
              <div>
                <h4 className="text-xs font-mono font-bold text-white">Chandrayaan-2 (OHRC)</h4>
                <div className="flex items-center gap-1.5 text-[10px] text-white/60 mt-0.5">
                  <span className="w-2.5 h-1.5 bg-[#FF9933] inline-block rounded-xs" />
                  <span>Indian Space Research Organisation</span>
                </div>
                <div className="flex items-center gap-3 text-[9px] font-mono text-white/40 mt-1">
                  <span>Status: <strong className="text-[#24D99B]">In Orbit</strong></span>
                  <span>Type: <strong>Orbiter</strong></span>
                  <span>Launch: <strong>22 Jul 2019</strong></span>
                </div>
              </div>
            </div>

            {/* Telemetry 4-Cell Grid */}
            <div className="grid grid-cols-4 gap-2 text-center text-[10px] font-mono bg-[#050A12] p-3 rounded-2xl border border-white/5">
              <div>
                <span className="text-white/40 block text-[9px]">Altitude</span>
                <span className="text-white font-bold text-xs">100 km</span>
              </div>
              <div>
                <span className="text-white/40 block text-[9px]">Velocity</span>
                <span className="text-white font-bold text-xs">1.6 km/s</span>
              </div>
              <div>
                <span className="text-white/40 block text-[9px]">Inclination</span>
                <span className="text-white font-bold text-xs">90.0°</span>
              </div>
              <div>
                <span className="text-white/40 block text-[9px]">Period</span>
                <span className="text-white font-bold text-xs">112 min</span>
              </div>
            </div>

            {/* Quick Correspondence Match Preview */}
            <div className="p-3 rounded-2xl bg-[#050A12] border border-white/5 space-y-2">
              <div className="flex items-center justify-between text-[10px] font-mono">
                <span className="text-white/60">ACTIVE TIE-POINTS (OHRC ↔ TMC-2):</span>
                <span className="text-[#24D99B] font-bold">1,284 MATCHES (94.7%)</span>
              </div>
              <div className="h-1.5 w-full bg-white/5 rounded-full overflow-hidden">
                <div className="h-full bg-gradient-to-r from-[#2F80FF] via-[#00B8FF] to-[#24D99B] w-[94.7%]" />
              </div>
            </div>

            {/* View Full Details Button */}
            <Link
              href="/correspondence"
              className="w-full py-2.5 rounded-xl bg-white/[0.04] hover:bg-white/[0.08] border border-white/10 hover:border-[#4DEBFF]/30 text-white/80 hover:text-white text-xs font-mono text-center tracking-wider transition-all block"
            >
              View Full Details →
            </Link>
          </div>

          {/* RIGHT COLUMN: MISSION INTELLIGENCE STACK (3 Columns) */}
          <div className="lg:col-span-3 space-y-4 flex flex-col justify-between">
            
            {/* Card 1: Next Pass Over India / Byalalu Station */}
            <div className="rounded-3xl bg-[#07111F]/90 border border-white/10 p-4.5 flex flex-col justify-between shadow-2xl">
              <div className="flex items-center justify-between text-[10px] font-mono text-white/50">
                <span className="flex items-center gap-1.5 uppercase">
                  <Radio className="w-3.5 h-3.5 text-[#4DEBFF]" /> NEXT PASS OVER INDIA
                </span>
                <span className="text-[#4DEBFF] font-bold">IDSN</span>
              </div>

              {/* Glowing Waveform Spectrogram */}
              <div className="h-12 flex items-center justify-center my-3">
                <svg className="w-full h-full text-[#4DEBFF]" viewBox="0 0 100 25" preserveAspectRatio="none">
                  <path
                    d="M0,12 Q15,0 30,12 T60,12 T90,12 T100,12"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth="2"
                  />
                  <path
                    d="M0,12 Q15,24 30,12 T60,12 T90,12 T100,12"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth="1"
                    strokeDasharray="2 2"
                    className="opacity-30"
                  />
                </svg>
              </div>

              <div className="flex items-baseline justify-between font-mono">
                <span className="text-xl font-bold text-white">{formatTimer(timerSeconds)}</span>
                <span className="text-[9px] text-white/40">AOS • 03:32:14 IST</span>
              </div>
            </div>

            {/* Card 2: Collision & Sun Angle Risk */}
            <div className="rounded-3xl bg-[#07111F]/90 border border-white/10 p-4.5 flex flex-col justify-between shadow-2xl">
              <div className="flex items-center justify-between text-[10px] font-mono text-white/50">
                <span className="flex items-center gap-1.5 uppercase">
                  <ShieldAlert className="w-3.5 h-3.5 text-[#FFB547]" /> COLLISION RISK
                </span>
                <span className="text-[#FFB547] font-bold">MONITORED</span>
              </div>

              <div className="flex items-center gap-4 my-2">
                <div className="w-12 h-12 rounded-full border-3 border-dashed border-[#FFB547] flex items-center justify-center font-mono font-bold text-base text-[#FFB547]">
                  2
                </div>
                <div className="text-xs font-mono">
                  <div className="text-white font-bold">Medium Risk Objects</div>
                  <Link href="/alerts" className="text-[#4DEBFF] hover:underline text-[10px] mt-0.5 block">
                    View Details →
                  </Link>
                </div>
              </div>
            </div>

            {/* Card 3: System Status */}
            <div className="rounded-3xl bg-[#07111F]/90 border border-[#24D99B]/30 p-4 flex items-center justify-between text-xs font-mono text-[#24D99B] shadow-2xl">
              <div className="flex items-center gap-2">
                <span className="w-2 h-2 rounded-full bg-[#24D99B] animate-ping" />
                <span className="font-bold">SYSTEM STATUS</span>
              </div>
              <span className="text-[10px] text-white/60">All systems operational</span>
            </div>

          </div>

        </div>

      </main>
    </div>
  );
};
