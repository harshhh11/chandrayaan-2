'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { 
  Orbit, Globe, ArrowRight, Layers, CheckCircle2, ChevronRight,
  Maximize2, Crosshair, Sun, Box, ExternalLink, ZoomIn, ZoomOut, 
  BarChart3, Activity
} from 'lucide-react';
import { EdolusTopNav } from '@/components/layout/EdolusTopNav';

interface AnalyticsData {
  images_indexed: number;
  ohrc_count: number;
  tmc_count: number;
  iirs_count: number;
  matches_processed: number;
  avg_correspondence_rate: number;
  active_analyses: number;
}

export const MasterSpaceDashboard: React.FC = () => {
  const [analytics, setAnalytics] = useState<AnalyticsData>({
    images_indexed: 0,
    ohrc_count: 0,
    tmc_count: 0,
    iirs_count: 0,
    matches_processed: 0,
    avg_correspondence_rate: 0,
    active_analyses: 0
  });

  const [activeLayers, setActiveLayers] = useState({
    chandrayaan2: true,
    ohrcFootprints: true,
    tmcSwaths: true,
    iirsCoverage: true,
    lunarTargets: true
  });

  const [viewMode, setViewMode] = useState<'2D' | '3D'>('3D');
  const [matchView, setMatchView] = useState<'matches' | 'overlay'>('matches');
  const [timerSeconds, setTimerSeconds] = useState(698); // 11m 38s
  const [selectedPyramidScale, setSelectedPyramidScale] = useState<string>('multi');
  const [hoveredPoint, setHoveredPoint] = useState<number | null>(null);
  const [isComparing, setIsComparing] = useState(false);
  const [zoomLevel, setZoomLevel] = useState(1);

  // Fetch real backend analytics from PostgreSQL / SQLite metadata layer
  useEffect(() => {
    const apiBase = process.env.NEXT_PUBLIC_API_URL || 'http://127.0.0.1:8000';
    fetch(`${apiBase}/api/analytics/overview`)
      .then(res => res.ok ? res.json() : null)
      .then(data => {
        if (data) {
          setAnalytics({
            images_indexed: data.images_indexed || 0,
            ohrc_count: data.ohrc_count || 0,
            tmc_count: data.tmc_count || 0,
            iirs_count: data.iirs_count || 0,
            matches_processed: data.matches_processed || 0,
            avg_correspondence_rate: data.avg_correspondence_rate || 0,
            active_analyses: data.active_analyses || 0
          });
        }
      })
      .catch(() => {});
  }, []);

  // Countdown timer for next orbital pass
  useEffect(() => {
    const interval = setInterval(() => {
      setTimerSeconds(prev => (prev > 0 ? prev - 1 : 698));
    }, 1000);
    return () => clearInterval(interval);
  }, []);

  const formatTimer = (seconds: number) => {
    const m = Math.floor(seconds / 60);
    const s = seconds % 60;
    return `${m}m ${s < 10 ? '0' : ''}${s}s`;
  };

  // Technical keypoints for Boguslawsky Crater correspondence
  const keypoints = [
    { id: 1, x1: 25, y1: 30, x2: 28, y2: 34 },
    { id: 2, x1: 45, y1: 22, x2: 48, y2: 26 },
    { id: 3, x1: 70, y1: 35, x2: 73, y2: 39 },
    { id: 4, x1: 30, y1: 55, x2: 33, y2: 58 },
    { id: 5, x1: 55, y1: 50, x2: 58, y2: 53 },
    { id: 6, x1: 78, y1: 60, x2: 81, y2: 64 },
    { id: 7, x1: 40, y1: 75, x2: 44, y2: 78 },
    { id: 8, x1: 65, y1: 80, x2: 68, y2: 82 },
    { id: 9, x1: 85, y1: 72, x2: 88, y2: 74 },
  ];

  return (
    <div className="min-h-screen bg-[#030609] text-[#F4F6F8] font-sans antialiased selection:bg-[#38A8FF]/30 selection:text-white overflow-x-hidden">
      
      {/* 1. MASTER SPACECRAFT HUD NAVBAR */}
      <EdolusTopNav />

      {/* Main Workspace Layout with Generous Editorial Breathing Room */}
      <main className="pt-20 pb-16 px-4 sm:px-6 lg:px-8 max-w-[1920px] mx-auto space-y-6">

        {/* ========================================================
            2. HERO / CINEMATIC LUNAR ORBITAL SCENE
           ======================================================== */}
        <div className="relative rounded-[14px] overflow-hidden border border-white/[0.08] bg-[#05090D] min-h-[460px] lg:min-h-[500px] flex flex-col justify-between p-6 sm:p-10 lg:p-12 shadow-[0_20px_60px_rgba(0,0,0,0.5)] select-none">
          
          {/* Photographic Chandrayaan-2 Visual Seamlessly Blended into Deep Space */}
          <div className="absolute inset-0 pointer-events-none overflow-hidden">
            <img 
              src="/hero/chandrayaan2_orbit.jpg" 
              alt="Chandrayaan-2 in Lunar Orbit" 
              className="absolute inset-0 w-full h-full object-cover object-[center_right] opacity-60"
            />
            {/* Multi-stage dark graphite gradient masks */}
            <div className="absolute inset-0 bg-gradient-to-r from-[#05090D] via-[#05090D]/90 via-42% to-transparent" />
            <div className="absolute inset-0 bg-gradient-to-t from-[#05090D] via-transparent to-[#05090D]/40" />

            {/* Faint technical orbital trajectory line */}
            <svg className="absolute inset-0 w-full h-full pointer-events-none opacity-25" viewBox="0 0 1440 600" preserveAspectRatio="none">
              <path 
                d="M 220,540 Q 820,180 1420,290" 
                fill="none" 
                stroke="#38A8FF" 
                strokeWidth="1" 
                strokeDasharray="3 5"
              />
              <circle cx="940" cy="272" r="3" fill="#38A8FF" />
            </svg>
          </div>

          {/* Top Row: Hero Headline & Floating Glass Telemetry Cards */}
          <div className="relative z-10 flex flex-col lg:flex-row items-start lg:items-start justify-between gap-8">
            
            {/* Left Hero Title & Actions */}
            <div className="space-y-4 max-w-xl">
              {/* Technical Status Label */}
              <div className="inline-flex items-center gap-2 text-[10px] font-tech tracking-[0.16em] text-[#8D98A5] uppercase">
                <span className="w-1.5 h-1.5 rounded-full bg-[#32D39A]" />
                <span>LIVE FROM LUNAR ORBIT</span>
              </div>

              {/* Bold Condensed Editorial Headline */}
              <h1 className="text-4xl sm:text-6xl lg:text-7xl font-display font-extrabold tracking-tight text-[#F4F6F8] uppercase leading-[0.92]">
                ORBITAL<br />
                <span className="text-white/95">
                  INTELLIGENCE
                </span>
              </h1>

              {/* Subtitle in Neutral Muted Gray */}
              <p className="text-xs sm:text-sm text-[#8D98A5] font-sans leading-relaxed max-w-lg font-normal">
                Multi-modal, Sun-angle and scale-invariant image correspondence using Chandrayaan-2 optical images (OHRC, TMC-2 and IIRS).
              </p>

              {/* Minimal Premium Action Buttons */}
              <div className="flex flex-wrap items-center gap-3 pt-2">
                <Link
                  href="/correspondence"
                  className="px-5 py-2.5 rounded-[8px] bg-[#38A8FF] hover:bg-[#2094EC] text-white font-sans text-xs font-semibold tracking-wide transition-colors flex items-center gap-2 group"
                >
                  <span>Run Correspondence</span>
                  <ArrowRight className="w-3.5 h-3.5 group-hover:translate-x-0.5 transition-transform" />
                </Link>

                <Link
                  href="/3d"
                  className="px-5 py-2.5 rounded-[8px] bg-white/[0.04] hover:bg-white/[0.08] border border-white/[0.08] text-[#F4F6F8] font-sans text-xs font-medium tracking-wide transition-colors flex items-center gap-2"
                >
                  <Box className="w-3.5 h-3.5 text-[#8D98A5]" />
                  <span>Explore in 3D</span>
                </Link>
              </div>
            </div>

            {/* Right Side: Floating Glass Telemetry Cards Stack */}
            <div className="space-y-3 w-full sm:w-76 shrink-0">
              
              {/* Card 1: Spacecraft Telemetry Panel */}
              <div className="glass-telemetry rounded-[12px] p-4">
                <div className="flex items-center gap-3 mb-3">
                  {/* Moon Sphere Thumbnail */}
                  <div className="w-8 h-8 rounded-full overflow-hidden border border-white/10 shrink-0">
                    <img 
                      src="/images/moon_globe.png" 
                      alt="Moon" 
                      className="w-full h-full object-cover"
                    />
                  </div>
                  <div>
                    <h3 className="text-xs font-sans font-semibold text-[#F4F6F8] tracking-wide">
                      Chandrayaan-2 (OHRC)
                    </h3>
                    <div className="flex items-center gap-1.5 text-[10px] font-tech text-[#32D39A] mt-0.5">
                      <span className="w-1.5 h-1.5 rounded-full bg-[#32D39A]" />
                      <span>In Orbit</span>
                    </div>
                  </div>
                </div>

                {/* 2x2 Telemetry Grid */}
                <div className="grid grid-cols-2 gap-3 pt-3 border-t border-white/[0.07] font-tech text-xs">
                  <div>
                    <span className="text-[9px] text-[#59636E] block uppercase tracking-wider">Altitude</span>
                    <span className="text-[#F4F6F8] font-bold text-sm">100 km</span>
                  </div>
                  <div>
                    <span className="text-[9px] text-[#59636E] block uppercase tracking-wider">Inclination</span>
                    <span className="text-[#F4F6F8] font-bold text-sm">90.0° Polar</span>
                  </div>
                  <div>
                    <span className="text-[9px] text-[#59636E] block uppercase tracking-wider">Velocity</span>
                    <span className="text-[#F4F6F8] font-bold text-sm">1.60 km/s</span>
                  </div>
                  <div>
                    <span className="text-[9px] text-[#59636E] block uppercase tracking-wider">Next Pass</span>
                    <span className="text-[#38A8FF] font-bold text-sm">{formatTimer(timerSeconds)}</span>
                  </div>
                </div>
              </div>

              {/* Card 2: Target Location Coordinates */}
              <div className="glass-telemetry rounded-[12px] p-3 flex items-center justify-between">
                <div className="flex items-center gap-2.5">
                  <div className="w-7 h-7 rounded-[6px] bg-white/[0.04] border border-white/[0.08] flex items-center justify-center shrink-0">
                    <Crosshair className="w-3.5 h-3.5 text-[#38A8FF]" />
                  </div>
                  <div>
                    <div className="text-xs font-tech font-bold text-[#F4F6F8]">
                      74.32° S, 53.64° E
                    </div>
                    <div className="text-[9.5px] font-tech text-[#8D98A5] tracking-wider uppercase">
                      BOGUSLAWSKY CRATER
                    </div>
                  </div>
                </div>
                <span className="px-1.5 py-0.5 rounded-[4px] bg-[#38A8FF]/10 border border-[#38A8FF]/20 text-[#38A8FF] text-[9px] font-tech font-medium">
                  LIVE
                </span>
              </div>

            </div>

          </div>

          {/* Bottom Technical Payload Indicators */}
          <div className="relative z-10 pt-5 mt-6 border-t border-white/[0.07] flex flex-wrap items-center justify-between gap-4 text-xs font-tech text-[#8D98A5]">
            <div className="flex items-center gap-3">
              <span className="text-[#59636E]">PAYLOADS:</span>
              <span className="text-[#8D98A5]">OHRC 0.25m High-Resolution</span>
              <span className="text-[#59636E]">•</span>
              <span className="text-[#8D98A5]">TMC-2 Stereo Terrain</span>
              <span className="text-[#59636E]">•</span>
              <span className="text-[#8D98A5]">IIRS Hyperspectral</span>
            </div>
            <div className="flex items-center gap-2 text-[#59636E]">
              <span className="w-1.5 h-1.5 rounded-full bg-[#32D39A]" />
              <span className="text-[#8D98A5]">ISRO Chandrayaan-2 Payload Operations Center</span>
            </div>
          </div>

        </div>

        {/* ========================================================
            3. HORIZONTAL METRICS STRIP (7 MINIMAL GRAPHITE CARDS)
           ======================================================== */}
        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 xl:grid-cols-7 gap-3">
          
          {/* Card 1: Images Indexed */}
          <div className="p-3.5 rounded-[10px] bg-[#0A1118] border border-white/[0.08] flex items-center gap-3">
            <div className="w-8 h-8 rounded-[6px] bg-white/[0.03] border border-white/[0.06] flex items-center justify-center text-[#8D98A5] shrink-0">
              <BarChart3 className="w-4 h-4" />
            </div>
            <div>
              <span className="text-[10px] font-tech text-[#59636E] uppercase tracking-wider block">Images Indexed</span>
              <div className="flex items-baseline gap-1.5">
                <span className="text-base font-tech font-bold text-[#F4F6F8]">
                  {analytics.images_indexed.toLocaleString()}
                </span>
                <span className="text-[10px] font-tech text-[#32D39A]">↑ +12%</span>
              </div>
            </div>
          </div>

          {/* Card 2: OHRC Images */}
          <div className="p-3.5 rounded-[10px] bg-[#0A1118] border border-white/[0.08] flex items-center gap-3">
            <div className="w-8 h-8 rounded-full overflow-hidden border border-white/10 shrink-0">
              <img src="/api/products/ch2_ohr_ncp_20191015T041200_d_img_d18/thumbnail" alt="OHRC" className="w-full h-full object-cover" />
            </div>
            <div>
              <span className="text-[10px] font-tech text-[#59636E] uppercase tracking-wider block">OHRC Images</span>
              <span className="text-base font-tech font-bold text-[#F4F6F8]">
                {analytics.ohrc_count.toLocaleString()}
              </span>
            </div>
          </div>

          {/* Card 3: TMC-2 Images */}
          <div className="p-3.5 rounded-[10px] bg-[#0A1118] border border-white/[0.08] flex items-center gap-3">
            <div className="w-8 h-8 rounded-full overflow-hidden border border-white/10 shrink-0">
              <img src="/api/products/ch2_tmc_ncn_20200411T093000_d_img_d18/thumbnail" alt="TMC-2" className="w-full h-full object-cover" />
            </div>
            <div>
              <span className="text-[10px] font-tech text-[#59636E] uppercase tracking-wider block">TMC-2 Images</span>
              <span className="text-base font-tech font-bold text-[#F4F6F8]">
                {analytics.tmc_count.toLocaleString()}
              </span>
            </div>
          </div>

          {/* Card 4: IIRS Spectra */}
          <div className="p-3.5 rounded-[10px] bg-[#0A1118] border border-white/[0.08] flex items-center gap-3">
            <div className="w-8 h-8 rounded-full overflow-hidden border border-white/10 shrink-0">
              <img src="/api/products/ch2_iir_ncn_20210828T144500_d_cub_d18/thumbnail" alt="IIRS" className="w-full h-full object-cover" />
            </div>
            <div>
              <span className="text-[10px] font-tech text-[#59636E] uppercase tracking-wider block">IIRS Spectra</span>
              <span className="text-base font-tech font-bold text-[#F4F6F8]">
                {analytics.iirs_count.toLocaleString()}
              </span>
            </div>
          </div>

          {/* Card 5: Matches Processed */}
          <div className="p-3.5 rounded-[10px] bg-[#0A1118] border border-white/[0.08] flex items-center gap-3">
            <div className="w-8 h-8 rounded-[6px] bg-white/[0.03] border border-white/[0.06] flex items-center justify-center text-[#8D98A5] shrink-0">
              <CheckCircle2 className="w-4 h-4 text-[#8D98A5]" />
            </div>
            <div>
              <span className="text-[10px] font-tech text-[#59636E] uppercase tracking-wider block">Matches Processed</span>
              <span className="text-base font-tech font-bold text-[#F4F6F8]">
                {analytics.matches_processed.toLocaleString()}
              </span>
            </div>
          </div>

          {/* Card 6: Avg. Confidence with Radial Progress Ring */}
          <div className="p-3.5 rounded-[10px] bg-[#0A1118] border border-white/[0.08] flex items-center gap-3">
            <div className="relative w-8 h-8 flex items-center justify-center shrink-0">
              <svg className="w-full h-full -rotate-90" viewBox="0 0 36 36">
                <path
                  d="M18 2.0845 a 15.9155 15.9155 0 0 1 0 31.831 a 15.9155 15.9155 0 0 1 0 -31.831"
                  fill="none"
                  stroke="rgba(255, 255, 255, 0.08)"
                  strokeWidth="3"
                />
                <path
                  d="M18 2.0845 a 15.9155 15.9155 0 0 1 0 31.831 a 15.9155 15.9155 0 0 1 0 -31.831"
                  fill="none"
                  stroke="#38A8FF"
                  strokeDasharray="91.4, 100"
                  strokeWidth="3"
                  strokeLinecap="round"
                />
              </svg>
            </div>
            <div>
              <span className="text-[10px] font-tech text-[#59636E] uppercase tracking-wider block">Avg. Confidence</span>
              <span className="text-base font-tech font-bold text-[#F4F6F8]">
                {analytics.avg_correspondence_rate}%
              </span>
            </div>
          </div>

          {/* Card 7: Active Analyses */}
          <div className="p-3.5 rounded-[10px] bg-[#0A1118] border border-white/[0.08] flex items-center gap-3">
            <div className="w-8 h-8 rounded-[6px] bg-white/[0.03] border border-white/[0.06] flex items-center justify-center text-[#8D98A5] shrink-0">
              <Activity className="w-4 h-4" />
            </div>
            <div>
              <span className="text-[10px] font-tech text-[#59636E] uppercase tracking-wider block">Active Analyses</span>
              <span className="text-base font-tech font-bold text-[#F4F6F8]">
                0{analytics.active_analyses}
              </span>
            </div>
          </div>

        </div>

        {/* ========================================================
            4. LOWER THREE-MODULE WORKSPACE (EDITORIAL SCIENTIFIC)
           ======================================================== */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-5 items-stretch">
          
          {/* ------------------------------------------------------
              MODULE A: LIVE ORBITAL VIEW (4 Columns)
             ------------------------------------------------------ */}
          <div className="lg:col-span-4 rounded-[12px] bg-[#0A1118] border border-white/[0.08] p-4 flex flex-col justify-between shadow-xl relative overflow-hidden min-h-[480px]">
            
            {/* Header with Working Segmented 2D | 3D Toggle */}
            <div className="flex items-center justify-between mb-3 z-10">
              <div className="flex items-center gap-2">
                <span className="w-1.5 h-1.5 rounded-full bg-[#32D39A] animate-pulse" />
                <h3 className="text-xs font-tech font-semibold tracking-wider text-[#F4F6F8] uppercase">
                  LIVE ORBITAL VIEW ({viewMode})
                </h3>
                <Link href="/3d" title="Open Fullscreen 3D Viewer">
                  <ExternalLink className="w-3 h-3 text-[#59636E] hover:text-[#38A8FF] transition-colors" />
                </Link>
              </div>

              {/* Segmented 2D / 3D Switch */}
              <div className="flex items-center bg-[#05090D] p-0.5 rounded-[6px] border border-white/[0.08] text-[10px] font-tech">
                <button
                  onClick={() => setViewMode('2D')}
                  className={`px-3 py-1 rounded-[4px] transition-all cursor-pointer font-bold ${
                    viewMode === '2D' 
                      ? 'bg-[#38A8FF] text-black shadow-[0_0_10px_rgba(56,168,255,0.5)]' 
                      : 'text-[#8D98A5] hover:text-[#F4F6F8]'
                  }`}
                >
                  2D MAP
                </button>
                <button
                  onClick={() => setViewMode('3D')}
                  className={`px-3 py-1 rounded-[4px] transition-all cursor-pointer font-bold ${
                    viewMode === '3D' 
                      ? 'bg-[#38A8FF] text-black shadow-[0_0_10px_rgba(56,168,255,0.5)]' 
                      : 'text-[#8D98A5] hover:text-[#F4F6F8]'
                  }`}
                >
                  3D GLOBE
                </button>
              </div>
            </div>

            {/* Main Interactive Map / Globe Viewport */}
            <div className="relative flex-1 my-1 rounded-[8px] bg-[#030609] border border-white/[0.06] overflow-hidden flex items-center justify-center select-none min-h-[290px]">
              
              {/* Starry Space Background */}
              <div className="absolute inset-0 bg-[radial-gradient(circle_at_50%_50%,#081422_0%,#030609_100%)]" />

              {/* 2D EQUIRECTANGULAR PLANETARY PROJECTION */}
              {viewMode === '2D' && (
                <div className="relative w-full h-full p-2 flex flex-col justify-center items-center">
                  <div 
                    className="relative w-full h-56 rounded border border-white/10 overflow-hidden bg-[#0A121E] shadow-inner transition-transform"
                    style={{ transform: `scale(${zoomLevel})` }}
                  >
                    {/* High-res Lunar Surface Texture Map */}
                    <img 
                      src="/images/chandrayaan2_orbit.jpg" 
                      alt="Lunar Equirectangular Projection" 
                      className="w-full h-full object-cover opacity-60 filter grayscale contrast-125"
                    />

                    {/* Lat / Lon Graticule Grid */}
                    <svg className="absolute inset-0 w-full h-full pointer-events-none opacity-40" viewBox="0 0 400 200" preserveAspectRatio="none">
                      {/* Equator & Parallels */}
                      <line x1="0" y1="100" x2="400" y2="100" stroke="#38A8FF" strokeWidth="0.75" />
                      <line x1="0" y1="50" x2="400" y2="50" stroke="#8D98A5" strokeWidth="0.5" strokeDasharray="2 3" />
                      <line x1="0" y1="150" x2="400" y2="150" stroke="#8D98A5" strokeWidth="0.5" strokeDasharray="2 3" />
                      {/* Meridians */}
                      <line x1="200" y1="0" x2="200" y2="200" stroke="#38A8FF" strokeWidth="0.75" />
                      <line x1="100" y1="0" x2="100" y2="200" stroke="#8D98A5" strokeWidth="0.5" strokeDasharray="2 3" />
                      <line x1="300" y1="0" x2="300" y2="200" stroke="#8D98A5" strokeWidth="0.5" strokeDasharray="2 3" />

                      {/* Chandrayaan-2 Ground Track Wave */}
                      {activeLayers.chandrayaan2 && (
                        <path 
                          d="M 0,160 Q 100,20 200,100 T 400,40" 
                          fill="none" 
                          stroke="#32D39A" 
                          strokeWidth="1.5" 
                          strokeDasharray="4 3" 
                        />
                      )}
                    </svg>

                    {/* OHRC Footprints Layer */}
                    {activeLayers.ohrcFootprints && (
                      <>
                        {/* Boguslawsky Footprint */}
                        <div className="absolute bottom-6 right-16 w-8 h-8 border border-[#38A8FF] bg-[#38A8FF]/20 rounded-sm flex items-center justify-center">
                          <span className="text-[7px] font-mono text-[#38A8FF]">OHRC</span>
                        </div>
                        {/* Tycho Footprint */}
                        <div className="absolute bottom-12 left-24 w-8 h-8 border border-[#38A8FF] bg-[#38A8FF]/20 rounded-sm flex items-center justify-center">
                          <span className="text-[7px] font-mono text-[#38A8FF]">OHRC</span>
                        </div>
                      </>
                    )}

                    {/* TMC-2 Swaths Layer */}
                    {activeLayers.tmcSwaths && (
                      <div className="absolute top-4 right-8 w-20 h-44 border border-[#E7A93B]/60 bg-[#E7A93B]/10 rotate-12 pointer-events-none" />
                    )}

                    {/* IIRS Coverage Layer */}
                    {activeLayers.iirsCoverage && (
                      <div className="absolute bottom-2 right-24 w-12 h-14 border border-[#A78BFA]/60 bg-[#A78BFA]/15 pointer-events-none" />
                    )}

                    {/* Lunar Targets Layer */}
                    {activeLayers.lunarTargets && (
                      <>
                        {/* Boguslawsky Crater Pin */}
                        <div className="absolute bottom-5 right-20 flex items-center gap-1.5 z-20 group cursor-pointer">
                          <span className="w-2.5 h-2.5 rounded-full bg-[#38A8FF] ring-2 ring-white/80 animate-ping absolute" />
                          <span className="w-2.5 h-2.5 rounded-full bg-[#38A8FF] ring-1 ring-white relative" />
                          <div className="px-2 py-0.5 rounded bg-black/90 border border-white/20 text-[8px] font-mono text-white whitespace-nowrap shadow-lg">
                            Boguslawsky E (74.32°S, 53.64°E)
                          </div>
                        </div>

                        {/* Tycho Crater Pin */}
                        <div className="absolute bottom-14 left-20 flex items-center gap-1.5 z-20 group cursor-pointer">
                          <span className="w-2 h-2 rounded-full bg-[#E7A93B] ring-1 ring-white relative" />
                          <div className="px-2 py-0.5 rounded bg-black/90 border border-white/20 text-[8px] font-mono text-white whitespace-nowrap shadow-lg">
                            Tycho Crater (43.31°S)
                          </div>
                        </div>
                      </>
                    )}

                    {/* Orbit Coordinates HUD */}
                    <div className="absolute top-2 left-2 px-2 py-0.5 rounded bg-black/85 text-[8.5px] font-mono text-[#32D39A] border border-[#32D39A]/30">
                      POLAR ORBIT: 100.4 KM • INCLINATION: 90.0°
                    </div>
                  </div>
                </div>
              )}

              {/* 3D ROTATABLE GLOBE PROJECTION */}
              {viewMode === '3D' && (
                <div 
                  className="relative w-56 h-56 sm:w-64 sm:h-64 rounded-full overflow-hidden border border-[#38A8FF]/40 shadow-[0_0_50px_rgba(56,168,255,0.25)] flex items-center justify-center transition-transform duration-300"
                  style={{ transform: `scale(${zoomLevel})` }}
                >
                  <img 
                    src="/images/moon_globe.png" 
                    alt="Lunar 3D Globe" 
                    className="w-full h-full object-cover scale-105"
                  />

                  {/* 3D Atmospheric Limb & Glow */}
                  <div className="absolute inset-0 rounded-full shadow-[inset_0_0_30px_rgba(56,168,255,0.4)] pointer-events-none" />

                  {/* Orbit Ground Track Ring with Orbiting Satellite */}
                  {activeLayers.chandrayaan2 && (
                    <svg className="absolute inset-0 w-full h-full pointer-events-none animate-spin" style={{ animationDuration: '24s' }} viewBox="0 0 300 300">
                      <ellipse 
                        cx="150" 
                        cy="150" 
                        rx="130" 
                        ry="55" 
                        fill="none" 
                        stroke="#38A8FF" 
                        strokeWidth="1.5" 
                        strokeDasharray="4 4"
                        transform="rotate(65 150 150)"
                        className="opacity-70"
                      />
                      <g transform="rotate(65 150 150)">
                        <circle cx="280" cy="150" r="4" fill="#32D39A" className="shadow-[0_0_10px_#32D39A]" />
                      </g>
                    </svg>
                  )}

                  {/* Target Pin Marker (Boguslawsky) */}
                  {activeLayers.lunarTargets && (
                    <div className="absolute bottom-10 right-10 flex items-center gap-1.5 z-20">
                      <div className="w-2.5 h-2.5 rounded-full border border-white bg-[#38A8FF] shadow-[0_0_10px_#38A8FF]" />
                      <div className="px-2 py-1 rounded-[6px] bg-[#0D151E]/95 border border-white/20 text-[9px] font-tech shadow-xl flex items-center gap-1.5">
                        <div className="w-3.5 h-3.5 rounded overflow-hidden border border-white/10 shrink-0">
                          <img src="/api/products/ch2_ohr_ncp_20191015T041200_d_img_d18/thumbnail" alt="Boguslawsky" className="w-full h-full object-cover" />
                        </div>
                        <div>
                          <div className="font-semibold text-white">Boguslawsky E</div>
                          <div className="text-[7.5px] text-[#8D98A5]">74.32° S, 53.64° E</div>
                        </div>
                      </div>
                    </div>
                  )}
                </div>
              )}

              {/* Overlaid Checkbox Layer Controls */}
              <div className="absolute top-2.5 left-2.5 bg-[#0A1118]/90 backdrop-blur-md border border-white/[0.08] rounded-[8px] p-2 text-[9px] font-tech space-y-1.5 z-20">
                {[
                  { key: 'chandrayaan2', label: 'Chandrayaan-2' },
                  { key: 'ohrcFootprints', label: 'OHRC Footprints' },
                  { key: 'tmcSwaths', label: 'TMC-2 Swaths' },
                  { key: 'iirsCoverage', label: 'IIRS Coverage' },
                  { key: 'lunarTargets', label: 'Lunar Targets' },
                ].map(item => (
                  <label key={item.key} className="flex items-center gap-1.5 cursor-pointer text-[#8D98A5] hover:text-[#F4F6F8] select-none">
                    <input
                      type="checkbox"
                      checked={activeLayers[item.key as keyof typeof activeLayers]}
                      onChange={(e) => setActiveLayers({ ...activeLayers, [item.key]: e.target.checked })}
                      className="rounded-[3px] bg-black/40 border-white/20 text-[#38A8FF] focus:ring-0 w-3 h-3 cursor-pointer"
                    />
                    <span>{item.label}</span>
                  </label>
                ))}
              </div>

              {/* Zoom & Fullscreen Tools */}
              <div className="absolute bottom-2.5 right-2.5 flex flex-col gap-1 z-20">
                <button 
                  onClick={() => setZoomLevel(prev => Math.min(prev + 0.15, 1.8))}
                  className="w-6 h-6 rounded-[5px] bg-[#05090D] border border-white/[0.08] flex items-center justify-center text-[#8D98A5] hover:text-white transition-colors cursor-pointer"
                  title="Zoom In"
                >
                  <ZoomIn className="w-3 h-3" />
                </button>
                <button 
                  onClick={() => setZoomLevel(prev => Math.max(prev - 0.15, 0.8))}
                  className="w-6 h-6 rounded-[5px] bg-[#05090D] border border-white/[0.08] flex items-center justify-center text-[#8D98A5] hover:text-white transition-colors cursor-pointer"
                  title="Zoom Out"
                >
                  <ZoomOut className="w-3 h-3" />
                </button>
                <Link 
                  href="/3d"
                  className="w-6 h-6 rounded-[5px] bg-[#05090D] border border-white/[0.08] flex items-center justify-center text-[#8D98A5] hover:text-[#38A8FF] transition-colors"
                  title="Fullscreen 3D Viewer"
                >
                  <Maximize2 className="w-3 h-3" />
                </Link>
              </div>

            </div>

          </div>

          {/* ------------------------------------------------------
              MODULE B: IMAGE CORRESPONDENCE & COMPARE (5 Columns)
             ------------------------------------------------------ */}
          <div className="lg:col-span-5 rounded-[12px] bg-[#0A1118] border border-white/[0.08] p-4 flex flex-col justify-between shadow-xl space-y-3">
            
            {/* Header + Minimal New Analysis CTA */}
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <Box className="w-3.5 h-3.5 text-[#38A8FF]" />
                <h3 className="text-xs font-tech font-semibold tracking-wider text-[#F4F6F8] uppercase">
                  IMAGE CORRESPONDENCE // LIVE BENCHMARK
                </h3>
                <Link href="/correspondence" title="Open Workspace">
                  <ExternalLink className="w-3 h-3 text-[#59636E] hover:text-[#38A8FF] transition-colors" />
                </Link>
              </div>

              <Link
                href="/correspondence"
                className="px-3 py-1 rounded-[6px] bg-[#0D151E] hover:bg-[#121D2A] border border-[#38A8FF]/30 text-[#38A8FF] text-[11px] font-sans font-bold flex items-center gap-1.5 transition-colors"
              >
                <span>New Analysis</span>
                <ArrowRight className="w-3 h-3" />
              </Link>
            </div>

            {/* Technical Subheader: Sensor Labels and Resolutions */}
            <div className="grid grid-cols-2 gap-4 text-xs font-tech pt-1">
              <div className="flex items-center justify-between border-b border-white/[0.07] pb-1">
                <span className="font-medium text-[#F4F6F8]">OHRC (Reference)</span>
                <span className="text-[#38A8FF] text-[11px] font-bold">0.25 m/px</span>
              </div>
              <div className="flex items-center justify-between border-b border-white/[0.07] pb-1">
                <span className="font-medium text-[#F4F6F8]">TMC-2 (Target)</span>
                <span className="text-[#E7A93B] text-[11px] font-bold">5.00 m/px</span>
              </div>
            </div>

            {/* VIEWPORT: SUPPORTS MATCHES, OVERLAY, AND INTERACTIVE COMPARE SLIDER */}
            <div className="relative rounded-[8px] overflow-hidden bg-[#030609] border border-white/[0.06] p-2">
              
              {/* 1. COMPARE SLIDER VIEW */}
              {isComparing ? (
                <div className="relative h-48 sm:h-52 rounded-[6px] overflow-hidden border border-white/10 bg-black">
                  <img 
                    src="/api/products/ch2_tmc_ncn_20200411T093000_d_img_d18/preview" 
                    alt="TMC-2" 
                    className="absolute inset-0 w-full h-full object-cover" 
                  />
                  <div 
                    className="absolute inset-0 overflow-hidden border-r-2 border-[#38A8FF] shadow-2xl bg-black"
                    style={{ width: '50%' }}
                  >
                    <img 
                      src="/api/products/ch2_ohr_ncp_20191015T041200_d_img_d18/preview" 
                      alt="OHRC" 
                      className="absolute inset-0 w-full h-full object-cover" 
                    />
                  </div>
                  <div className="absolute top-2 left-2 px-2 py-0.5 rounded bg-black/85 text-[9px] font-mono text-[#38A8FF]">
                    LEFT: OHRC (0.25m)
                  </div>
                  <div className="absolute top-2 right-2 px-2 py-0.5 rounded bg-black/85 text-[9px] font-mono text-[#E7A93B]">
                    RIGHT: TMC-2 (5.0m)
                  </div>
                  <div className="absolute bottom-2 left-1/2 -translate-x-1/2 px-2.5 py-0.5 rounded bg-black/90 text-[9px] font-mono text-white border border-white/20">
                    INTERACTIVE SPLIT COMPARISON ACTIVE
                  </div>
                </div>
              ) : matchView === 'overlay' ? (
                /* 2. REGISTERED FALSE-COLOR OVERLAY VIEW */
                <div className="relative h-48 sm:h-52 rounded-[6px] overflow-hidden border border-white/10 bg-black flex items-center justify-center">
                  <img 
                    src="/api/products/ch2_ohr_ncp_20191015T041200_d_img_d18/preview" 
                    alt="Base" 
                    className="absolute inset-0 w-full h-full object-cover filter contrast-125" 
                  />
                  {/* False Color Blend Simulation */}
                  <div className="absolute inset-0 bg-[#00FF88]/20 mix-blend-screen pointer-events-none" />
                  <div className="absolute top-2 left-2 px-2 py-1 rounded bg-black/90 border border-[#32D39A]/40 text-[9px] font-mono text-[#32D39A]">
                    ● HOMOGRAPHY REGISTRATION BLEND (GREEN: OHRC / MAGENTA: TMC-2)
                  </div>
                  <div className="absolute bottom-2 right-2 px-2 py-0.5 rounded bg-black/90 text-[9px] font-mono text-white">
                    RMSE: 0.42 px • Scale: 3.2×
                  </div>
                </div>
              ) : (
                /* 3. DUAL MATCHES VIEW WITH VECTOR TIE-LINES & DOTS */
                <div className="grid grid-cols-2 gap-3 relative h-48 sm:h-52">
                  {/* Left: OHRC Reference Image */}
                  <div className="relative rounded-[6px] overflow-hidden border border-white/[0.08] h-full">
                    <img 
                      src="/api/products/ch2_ohr_ncp_20191015T041200_d_img_d18/preview" 
                      alt="OHRC Reference" 
                      className="w-full h-full object-cover"
                    />
                    {/* Cyan Inlier Dots */}
                    {keypoints.map((pt) => (
                      <div 
                        key={`l-${pt.id}`}
                        onMouseEnter={() => setHoveredPoint(pt.id)}
                        onMouseLeave={() => setHoveredPoint(null)}
                        style={{ top: `${pt.y1}%`, left: `${pt.x1}%` }}
                        className={`absolute -translate-x-1/2 -translate-y-1/2 w-2.5 h-2.5 rounded-full cursor-pointer transition-transform ${
                          hoveredPoint === pt.id 
                            ? 'bg-white ring-2 ring-[#32D39A] scale-150 z-30 shadow-[0_0_10px_#32D39A]' 
                            : 'bg-[#32D39A] shadow-sm'
                        }`}
                      />
                    ))}
                    <span className="absolute bottom-1.5 left-2 px-1.5 py-0.5 rounded-[4px] bg-black/75 text-[8.5px] font-tech text-[#32D39A] font-bold">
                      SRC • LOW SUN (28.4°)
                    </span>
                  </div>

                  {/* Right: TMC-2 Target Image */}
                  <div className="relative rounded-[6px] overflow-hidden border border-white/[0.08] h-full">
                    <img 
                      src="/api/products/ch2_tmc_ncn_20200411T093000_d_img_d18/preview" 
                      alt="TMC-2 Target" 
                      className="w-full h-full object-cover"
                    />
                    {/* Amber / Blue Target Dots */}
                    {keypoints.map((pt) => (
                      <div 
                        key={`r-${pt.id}`}
                        onMouseEnter={() => setHoveredPoint(pt.id)}
                        onMouseLeave={() => setHoveredPoint(null)}
                        style={{ top: `${pt.y2}%`, left: `${pt.x2}%` }}
                        className={`absolute -translate-x-1/2 -translate-y-1/2 w-2.5 h-2.5 rounded-full cursor-pointer transition-transform ${
                          hoveredPoint === pt.id 
                            ? 'bg-white ring-2 ring-[#38A8FF] scale-150 z-30 shadow-[0_0_10px_#38A8FF]' 
                            : 'bg-[#38A8FF] shadow-sm'
                        }`}
                      />
                    ))}
                    <span className="absolute bottom-1.5 right-2 px-1.5 py-0.5 rounded-[4px] bg-black/75 text-[8.5px] font-tech text-[#E7A93B] font-bold">
                      TGT • HIGH SUN (54.1°)
                    </span>
                  </div>

                  {/* Tie-Lines */}
                  <svg className="absolute inset-0 w-full h-full pointer-events-none z-20">
                    {keypoints.map((pt) => {
                      const isHover = hoveredPoint === pt.id;
                      const startX = pt.x1 * 0.48;
                      const startY = pt.y1;
                      const endX = 52 + (pt.x2 * 0.48);
                      const endY = pt.y2;

                      return (
                        <line
                          key={`line-${pt.id}`}
                          x1={`${startX}%`}
                          y1={`${startY}%`}
                          x2={`${endX}%`}
                          y2={`${endY}%`}
                          stroke={isHover ? '#FFFFFF' : 'rgba(50, 211, 154, 0.65)'}
                          strokeWidth={isHover ? '2' : '1.2'}
                          strokeDasharray={isHover ? 'none' : '2 3'}
                        />
                      );
                    })}
                  </svg>
                </div>
              )}

            </div>

            {/* Scientific Metrics Bar */}
            <div className="grid grid-cols-5 gap-2 text-center font-tech py-2 bg-[#05090D] rounded-[8px] border border-white/[0.06]">
              <div>
                <span className="text-[8.5px] text-[#59636E] uppercase tracking-wider block">Matched</span>
                <span className="text-[#F4F6F8] font-bold text-xs sm:text-sm">1,284</span>
              </div>
              <div>
                <span className="text-[8.5px] text-[#59636E] uppercase tracking-wider block">Confidence</span>
                <span className="text-[#32D39A] font-bold text-xs sm:text-sm">94.7%</span>
              </div>
              <div>
                <span className="text-[8.5px] text-[#59636E] uppercase tracking-wider block">Scale Ratio</span>
                <span className="text-[#F4F6F8] font-bold text-xs sm:text-sm">3.2×</span>
              </div>
              <div>
                <span className="text-[8.5px] text-[#59636E] uppercase tracking-wider block">Sun Δ</span>
                <span className="text-[#E7A93B] font-bold text-xs sm:text-sm">18.4°</span>
              </div>
              <div>
                <span className="text-[8.5px] text-[#59636E] uppercase tracking-wider block">Error</span>
                <span className="text-[#38A8FF] font-bold text-xs sm:text-sm">0.42 px</span>
              </div>
            </div>

            {/* Bottom Actions: Compare & Mode Switch */}
            <div className="flex items-center justify-between pt-1">
              <button
                onClick={() => setIsComparing(!isComparing)}
                className={`px-3.5 py-1.5 rounded-[6px] text-xs font-sans font-bold transition-all cursor-pointer ${
                  isComparing 
                    ? 'bg-[#32D39A] text-black shadow-[0_0_12px_rgba(50,211,154,0.5)]' 
                    : 'bg-[#38A8FF] hover:bg-[#2094EC] text-white'
                }`}
              >
                {isComparing ? 'Exit Compare' : 'Compare (Split View)'}
              </button>

              <div className="flex items-center gap-2">
                <span className="text-[11px] font-tech text-[#59636E]">Mode:</span>
                <div className="flex items-center bg-[#05090D] p-0.5 rounded-[6px] border border-white/[0.08] text-[10px] font-tech">
                  <button
                    onClick={() => { setMatchView('matches'); setIsComparing(false); }}
                    className={`px-2.5 py-0.5 rounded-[4px] transition-all cursor-pointer font-bold ${
                      matchView === 'matches' && !isComparing
                        ? 'bg-[#38A8FF] text-black'
                        : 'text-[#8D98A5] hover:text-[#F4F6F8]'
                    }`}
                  >
                    Matches
                  </button>
                  <button
                    onClick={() => { setMatchView('overlay'); setIsComparing(false); }}
                    className={`px-2.5 py-0.5 rounded-[4px] transition-all cursor-pointer font-bold ${
                      matchView === 'overlay' && !isComparing
                        ? 'bg-[#38A8FF] text-black'
                        : 'text-[#8D98A5] hover:text-[#F4F6F8]'
                    }`}
                  >
                    Overlay
                  </button>
                </div>
              </div>

              <Link
                href="/correspondence"
                className="p-1.5 rounded-[6px] bg-white/[0.05] hover:bg-[#38A8FF]/20 text-[#8D98A5] hover:text-[#38A8FF] transition-colors"
                title="Open in Full Correspondence Engine"
              >
                <Maximize2 className="w-3.5 h-3.5" />
              </Link>
            </div>

          </div>

          {/* ------------------------------------------------------
              MODULE C: RIGHT STACK (SUN ANGLE + SCALE INVARIANCE) (3 Columns)
             ------------------------------------------------------ */}
          <div className="lg:col-span-3 flex flex-col justify-between gap-4">
            
            {/* Top Stack Card: SUN-ANGLE ANALYSIS */}
            <div className="rounded-[12px] bg-[#0A1118] border border-white/[0.08] p-4 shadow-xl flex-1 flex flex-col justify-between">
              <div className="flex items-center justify-between pb-2 border-b border-white/[0.07]">
                <div className="flex items-center gap-1.5">
                  <Sun className="w-3.5 h-3.5 text-[#E7A93B]" />
                  <h3 className="text-xs font-tech font-semibold tracking-wider text-[#F4F6F8] uppercase">
                    SUN-ANGLE ANALYSIS
                  </h3>
                </div>
                <Link href="/analytics" title="Detailed Analysis">
                  <ChevronRight className="w-3.5 h-3.5 text-[#59636E] hover:text-[#F4F6F8]" />
                </Link>
              </div>

              {/* Solar Geometry Comparison */}
              <div className="grid grid-cols-2 gap-2 my-2 font-tech text-[10px]">
                
                {/* Reference Sun */}
                <div className="p-2 rounded-[6px] bg-[#030609] border border-white/[0.06] space-y-1.5">
                  <span className="text-[#59636E] block text-[9px] uppercase">Reference Sun</span>
                  <div className="flex items-baseline justify-between">
                    <span className="text-[#F4F6F8] font-bold text-xs">32.4°</span>
                    <span className="text-[#59636E] text-[9px]">Elev</span>
                  </div>
                  <div className="flex items-baseline justify-between">
                    <span className="text-[#F4F6F8] font-bold text-xs">138.2°</span>
                    <span className="text-[#59636E] text-[9px]">Azim</span>
                  </div>
                  {/* Solar Dial Graphic */}
                  <div className="pt-1 flex items-center justify-center">
                    <div className="relative w-8 h-8 rounded-full border border-dashed border-white/20 flex items-center justify-center">
                      <div className="absolute w-1.5 h-1.5 rounded-full bg-[#E7A93B] top-0 right-1" />
                      <div className="w-1 h-1 rounded-full bg-white/30" />
                    </div>
                  </div>
                </div>

                {/* Target Sun */}
                <div className="p-2 rounded-[6px] bg-[#030609] border border-white/[0.06] space-y-1.5">
                  <span className="text-[#59636E] block text-[9px] uppercase">Target Sun</span>
                  <div className="flex items-baseline justify-between">
                    <span className="text-[#F4F6F8] font-bold text-xs">51.8°</span>
                    <span className="text-[#59636E] text-[9px]">Elev</span>
                  </div>
                  <div className="flex items-baseline justify-between">
                    <span className="text-[#F4F6F8] font-bold text-xs">221.7°</span>
                    <span className="text-[#59636E] text-[9px]">Azim</span>
                  </div>
                  {/* Solar Dial Graphic */}
                  <div className="pt-1 flex items-center justify-center">
                    <div className="relative w-8 h-8 rounded-full border border-dashed border-white/20 flex items-center justify-center">
                      <div className="absolute w-1.5 h-1.5 rounded-full bg-[#38A8FF] bottom-0.5 left-1" />
                      <div className="w-1 h-1 rounded-full bg-white/30" />
                    </div>
                  </div>
                </div>

              </div>

              {/* Delta Angle Badge in Amber */}
              <div className="flex items-center justify-between px-3 py-1.5 rounded-[6px] bg-[#05090D] border border-white/[0.06] text-[#E7A93B] text-[10px] font-tech">
                <span className="text-[#8D98A5]">ILLUMINATION DELTA</span>
                <span className="font-bold">Δ 19.4°</span>
              </div>
            </div>

            {/* Bottom Stack Card: SCALE-INVARIANT MATCHING */}
            <div className="rounded-[12px] bg-[#0A1118] border border-white/[0.08] p-4 shadow-xl flex-1 flex flex-col justify-between">
              <div className="flex items-center justify-between pb-2 border-b border-white/[0.07]">
                <div className="flex items-center gap-1.5">
                  <Layers className="w-3.5 h-3.5 text-[#38A8FF]" />
                  <h3 className="text-xs font-tech font-semibold tracking-wider text-[#F4F6F8] uppercase">
                    SCALE-INVARIANT MATCHING
                  </h3>
                </div>
                <Link href="/analytics" title="Detailed Analysis">
                  <ChevronRight className="w-3.5 h-3.5 text-[#59636E] hover:text-[#F4F6F8]" />
                </Link>
              </div>

              {/* Scale Values Grid */}
              <div className="grid grid-cols-3 gap-2 my-2 text-center font-tech">
                <div className="p-1.5 rounded-[6px] bg-[#030609] border border-white/[0.06]">
                  <span className="text-[8.5px] text-[#59636E] block uppercase">Reference</span>
                  <span className="text-[#F4F6F8] font-bold text-[11px]">0.25 m/px</span>
                </div>
                <div className="p-1.5 rounded-[6px] bg-[#030609] border border-white/[0.06]">
                  <span className="text-[8.5px] text-[#59636E] block uppercase">Target</span>
                  <span className="text-[#F4F6F8] font-bold text-[11px]">1.20 m/px</span>
                </div>
                <div className="p-1.5 rounded-[6px] bg-[#030609] border border-white/[0.06]">
                  <span className="text-[8.5px] text-[#59636E] block uppercase">Ratio</span>
                  <span className="text-[#38A8FF] font-bold text-[11px]">4.8×</span>
                </div>
              </div>

              {/* Multi-Scale Pyramid Preview */}
              <div>
                <span className="text-[9px] font-tech text-[#59636E] block mb-1.5 uppercase tracking-wider">
                  SCALE PYRAMID LEVEL
                </span>
                <div className="grid grid-cols-5 gap-1.5 text-center font-tech text-[9px]">
                  {['1.0x', '0.75x', '0.50x', '0.25x', 'Multi-Scale'].map((lvl) => {
                    const isMulti = lvl === 'Multi-Scale';
                    const isSelected = selectedPyramidScale === lvl.toLowerCase() || (isMulti && selectedPyramidScale === 'multi');
                    return (
                      <button
                        key={lvl}
                        onClick={() => setSelectedPyramidScale(lvl.toLowerCase())}
                        className={`p-1 rounded-[5px] border transition-all ${
                          isSelected
                            ? 'bg-[#0D151E] border-[#38A8FF] text-[#38A8FF] font-medium'
                            : 'bg-[#030609] border-white/[0.06] text-[#8D98A5] hover:border-white/20'
                        }`}
                      >
                        <div className="w-full h-4 rounded-[3px] overflow-hidden mb-1 border border-white/10 opacity-75">
                          <img 
                            src="/api/products/ch2_ohr_ncp_20191015T041200_d_img_d18/thumbnail" 
                            alt={lvl} 
                            className="w-full h-full object-cover" 
                          />
                        </div>
                        <span className="block truncate">{lvl}</span>
                      </button>
                    );
                  })}
                </div>
              </div>

            </div>

          </div>

        </div>

      </main>

    </div>
  );
};
