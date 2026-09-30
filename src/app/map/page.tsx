'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { 
  Globe, Compass, Layers, Eye, Crosshair, Orbit, 
  Database, GitCompare, Maximize2, ShieldCheck, MapPin, X
} from 'lucide-react';
import { EdolusShell } from '@/components/layout/EdolusShell';

interface CraterPin {
  id: string;
  name: string;
  lat: number;
  lon: number;
  desc: string;
  hasMatches: boolean;
  matchCount: number;
  primarySensor: string;
}

const CRATER_PINS: CraterPin[] = [
  {
    id: 'PIN-1',
    name: 'Boguslawsky E Crater',
    lat: -74.32,
    lon: 53.64,
    desc: 'Primary benchmark evaluation site for OHRC & TMC-2 scale-invariant correspondence.',
    hasMatches: true,
    matchCount: 1284,
    primarySensor: 'OHRC / TMC-2'
  },
  {
    id: 'PIN-2',
    name: 'Shiv Shakti Point (Chandrayaan-3 Site)',
    lat: -69.37,
    lon: 32.35,
    desc: 'Landing zone cross-registered between 2019 pre-landing swaths and 2023 touchdown imagery.',
    hasMatches: true,
    matchCount: 946,
    primarySensor: 'OHRC / TMC-2'
  },
  {
    id: 'PIN-3',
    name: 'Manzinus C Crater',
    lat: -72.80,
    lon: 33.70,
    desc: 'Complex topography region evaluated under large illumination azimuth divergence (Δ83.5°).',
    hasMatches: true,
    matchCount: 712,
    primarySensor: 'TMC-2 Stereo'
  },
  {
    id: 'PIN-4',
    name: 'Shackleton Crater Rim',
    lat: -89.90,
    lon: 0.00,
    desc: 'Permanently shadowed region investigated using IIRS hyperspectral infrared cubes.',
    hasMatches: true,
    matchCount: 438,
    primarySensor: 'IIRS Spectra'
  }
];

export default function LunarMapPage() {
  const [selectedPin, setSelectedPin] = useState<CraterPin | null>(CRATER_PINS[0]);
  const [viewMode, setViewMode] = useState<'2D_ORTHO' | '3D_ORBIT' | 'TOPOGRAPHY' | 'FOOTPRINTS'>('2D_ORTHO');
  const [showFootprints, setShowFootprints] = useState(true);
  const [showMatches, setShowMatches] = useState(true);

  return (
    <EdolusShell>
      <div className="space-y-6">
        
        {/* Header */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-white/10 pb-5">
          <div>
            <div className="flex items-center gap-2 text-[10px] font-mono tracking-widest text-[#4DEBFF] uppercase">
              <Globe className="w-3.5 h-3.5" />
              <span>CHANDRAYAAN-2 LUNAR GEOSPATIAL GIS & FOOTPRINT REPOSITORY</span>
            </div>
            <h1 className="text-2xl sm:text-3xl font-bold font-sans tracking-tight text-white mt-1">
              LUNAR SURFACE MAP & ORBIT TRACKS
            </h1>
          </div>

          <div className="flex items-center gap-2">
            <div className="flex items-center gap-1 bg-[#07111F] p-1 rounded-xl border border-white/10 text-xs font-mono">
              {(['2D_ORTHO', '3D_ORBIT', 'TOPOGRAPHY', 'FOOTPRINTS'] as const).map(mode => (
                <button
                  key={mode}
                  onClick={() => setViewMode(mode)}
                  className={`px-3 py-1.5 rounded-lg transition-all ${
                    viewMode === mode
                      ? 'bg-[#2F80FF] text-white font-bold'
                      : 'text-white/50 hover:text-white'
                  }`}
                >
                  {mode.replace('_', ' ')}
                </button>
              ))}
            </div>
          </div>
        </div>

        {/* Main Map Container */}
        <div className="relative w-full h-[600px] rounded-3xl bg-[#050A12] border border-white/10 overflow-hidden shadow-2xl flex items-center justify-center select-none">
          
          {/* Background Space Stars */}
          <div className="absolute inset-0 bg-[radial-gradient(circle_at_50%_50%,#0B1726_0%,#050A12_100%)]" />
          
          {/* Lunar Globe Graphic Simulation */}
          <div className="relative w-[480px] h-[480px] rounded-full border border-[#4DEBFF]/30 bg-gradient-to-tr from-[#07111F] via-[#102035] to-[#1c3758] shadow-[0_0_80px_rgba(0,184,255,0.2)] overflow-hidden flex items-center justify-center">
            
            {/* Coordinate Grid Overlays */}
            <div className="absolute inset-0 opacity-20">
              <div className="w-full h-[1px] bg-[#4DEBFF] absolute top-1/2" />
              <div className="h-full w-[1px] bg-[#4DEBFF] absolute left-1/2" />
              <div className="w-64 h-64 rounded-full border border-[#4DEBFF] absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2" />
              <div className="w-96 h-96 rounded-full border border-[#4DEBFF] absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2" />
            </div>

            {/* Orbit Ground Track Line */}
            <div className="absolute inset-0 rounded-full border-2 border-dashed border-[#4DEBFF]/40 rotate-12 scale-110 animate-pulse" />

            {/* Live Chandrayaan-2 Position */}
            <div className="absolute top-1/4 left-1/3 flex items-center gap-1.5 bg-[#07111F]/90 border border-[#4DEBFF] px-2.5 py-1 rounded-full shadow-lg z-20">
              <span className="w-2 h-2 rounded-full bg-[#4DEBFF] animate-ping" />
              <span className="text-[10px] font-mono text-white font-bold">Chandrayaan-2 (100 km)</span>
            </div>

            {/* Footprint Polygons (Simulated bounding boxes) */}
            {showFootprints && (
              <>
                <div className="absolute bottom-24 right-28 w-24 h-16 border-2 border-[#4DEBFF] bg-[#4DEBFF]/10 rotate-12 rounded" />
                <div className="absolute bottom-32 left-28 w-32 h-20 border-2 border-[#2F80FF] bg-[#2F80FF]/10 -rotate-6 rounded" />
                <div className="absolute top-36 right-36 w-20 h-28 border-2 border-[#FFB547] bg-[#FFB547]/10 rotate-45 rounded" />
              </>
            )}

            {/* Clickable Crater Site Pins */}
            {showMatches && CRATER_PINS.map((pin) => {
              const isSelected = selectedPin?.id === pin.id;
              // Map simulated coordinates to globe positions
              const pinStyles: Record<string, { top: string; left: string }> = {
                'PIN-1': { top: '65%', left: '58%' },
                'PIN-2': { top: '55%', left: '42%' },
                'PIN-3': { top: '70%', left: '48%' },
                'PIN-4': { top: '82%', left: '50%' }
              };
              const pos = pinStyles[pin.id] || { top: '50%', left: '50%' };

              return (
                <button
                  key={pin.id}
                  onClick={() => setSelectedPin(pin)}
                  className={`absolute -translate-x-1/2 -translate-y-1/2 p-1.5 rounded-full transition-all group z-30 ${
                    isSelected 
                      ? 'bg-[#4DEBFF] text-black shadow-[0_0_20px_#4DEBFF] scale-125' 
                      : 'bg-[#07111F] border border-[#4DEBFF]/50 text-[#4DEBFF] hover:scale-110'
                  }`}
                  style={pos}
                  title={pin.name}
                >
                  <MapPin className="w-4 h-4" />
                </button>
              );
            })}
          </div>

          {/* Left Layer Control Panel */}
          <div className="absolute top-5 left-5 bg-[#07111F]/90 backdrop-blur-xl border border-white/10 rounded-2xl p-4 text-xs font-mono space-y-3 z-30 max-w-xs">
            <div className="flex items-center gap-2 text-[#4DEBFF] font-bold text-xs uppercase border-b border-white/5 pb-2">
              <Layers className="w-4 h-4" />
              <span>GIS GIS LAYERS</span>
            </div>

            <label className="flex items-center gap-2 cursor-pointer text-white/70 hover:text-white">
              <input
                type="checkbox"
                checked={showFootprints}
                onChange={(e) => setShowFootprints(e.target.checked)}
                className="rounded bg-white/10 border-white/20 text-[#00B8FF]"
              />
              <span>Optical Footprints (OHRC/TMC)</span>
            </label>

            <label className="flex items-center gap-2 cursor-pointer text-white/70 hover:text-white">
              <input
                type="checkbox"
                checked={showMatches}
                onChange={(e) => setShowMatches(e.target.checked)}
                className="rounded bg-white/10 border-white/20 text-[#00B8FF]"
              />
              <span>Correspondence Match Pins</span>
            </label>
          </div>

          {/* Right Selected Crater / Footprint Detail Modal Drawer */}
          {selectedPin && (
            <div className="absolute top-5 right-5 w-80 bg-[#07111F]/95 backdrop-blur-xl border border-[#4DEBFF]/30 rounded-2xl p-4 text-xs font-mono space-y-3 shadow-2xl z-30 animate-fadeIn">
              <div className="flex items-center justify-between border-b border-white/10 pb-2">
                <div className="flex items-center gap-2 text-white font-bold">
                  <MapPin className="w-4 h-4 text-[#4DEBFF]" />
                  <span>{selectedPin.name}</span>
                </div>
                <button 
                  onClick={() => setSelectedPin(null)}
                  className="p-1 rounded text-white/40 hover:text-white"
                >
                  <X className="w-3.5 h-3.5" />
                </button>
              </div>

              <div className="text-[11px] text-white/70 font-sans leading-relaxed">
                {selectedPin.desc}
              </div>

              <div className="grid grid-cols-2 gap-2 text-[10px] bg-[#050A12] p-2.5 rounded-xl border border-white/5">
                <div>
                  <span className="text-white/40 block text-[9px]">Coordinates</span>
                  <span className="text-white font-bold">{selectedPin.lat}° S, {selectedPin.lon}° E</span>
                </div>
                <div>
                  <span className="text-white/40 block text-[9px]">Matches Found</span>
                  <span className="text-[#24D99B] font-bold">{selectedPin.matchCount} Inliers</span>
                </div>
                <div>
                  <span className="text-white/40 block text-[9px]">Instrument</span>
                  <span className="text-[#4DEBFF] font-bold">{selectedPin.primarySensor}</span>
                </div>
                <div>
                  <span className="text-white/40 block text-[9px]">Status</span>
                  <span className="text-[#24D99B] font-bold">VERIFIED</span>
                </div>
              </div>

              <div className="flex items-center gap-2 pt-1">
                <Link
                  href="/correspondence"
                  className="w-full py-2 rounded-xl bg-gradient-to-r from-[#2F80FF] to-[#00B8FF] text-white text-center font-bold text-[10px] uppercase tracking-wider block"
                >
                  Open in Workbench →
                </Link>
              </div>
            </div>
          )}

        </div>

      </div>
    </EdolusShell>
  );
}
