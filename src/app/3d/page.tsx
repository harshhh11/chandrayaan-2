'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { 
  Globe, Compass, Layers, Crosshair, Orbit, 
  Database, GitCompare, Maximize2, ShieldCheck, MapPin, 
  RotateCw, ZoomIn, ZoomOut, ArrowLeft
} from 'lucide-react';
import { EdolusTopNav } from '@/components/layout/EdolusTopNav';

interface LunarTarget {
  id: string;
  name: string;
  lat: string;
  lon: string;
  elevation: string;
  instruments: string;
  description: string;
}

const TARGETS: LunarTarget[] = [
  {
    id: 'T1',
    name: 'Boguslawsky E Crater',
    lat: '74.32° S',
    lon: '53.64° E',
    elevation: '-3.2 km',
    instruments: 'OHRC, TMC-2, IIRS',
    description: 'High-priority benchmark calibration site with multi-scale optical coverage.'
  },
  {
    id: 'T2',
    name: 'Shiv Shakti Point',
    lat: '69.37° S',
    lon: '32.35° E',
    elevation: '-1.8 km',
    instruments: 'OHRC 0.25m / TMC-2',
    description: 'Chandrayaan-3 landing touchdown locus with multi-temporal registration.'
  },
  {
    id: 'T3',
    name: 'Manzinus C Crater',
    lat: '72.80° S',
    lon: '33.70° E',
    elevation: '-2.4 km',
    instruments: 'TMC-2 Triplet Stereo',
    description: 'Complex illuminated topography tested under extreme solar azimuths.'
  },
  {
    id: 'T4',
    name: 'Shackleton Crater Rim',
    lat: '89.90° S',
    lon: '0.00° E',
    elevation: '+1.2 km',
    instruments: 'IIRS Hyperspectral',
    description: 'Permanently shadowed south polar cold trap with volatile indicators.'
  }
];

export default function ThreeDViewerPage() {
  const [selectedTarget, setSelectedTarget] = useState<LunarTarget>(TARGETS[0]);
  const [rotationDeg, setRotationDeg] = useState(45);
  const [zoomScale, setZoomScale] = useState(1);
  const [layerFootprints, setLayerFootprints] = useState(true);
  const [layerGrid, setLayerGrid] = useState(true);

  return (
    <div className="min-h-screen bg-[#050A12] text-white font-sans selection:bg-[#4DEBFF] selection:text-black">
      <EdolusTopNav />

      <main className="pt-20 pb-12 px-4 sm:px-8 max-w-[1920px] mx-auto space-y-6">
        {/* Header */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-white/10 pb-4">
          <div className="flex items-center gap-3">
            <Link
              href="/"
              className="p-2 rounded-xl bg-white/5 hover:bg-white/10 text-white/70 hover:text-white transition-colors"
            >
              <ArrowLeft className="w-4 h-4" />
            </Link>
            <div>
              <div className="text-[10px] font-mono tracking-widest text-[#4DEBFF] uppercase">
                INTERACTIVE LUNAR ORBITAL GIS WORKSPACE
              </div>
              <h1 className="text-2xl sm:text-3xl font-bold font-sans tracking-tight text-white mt-0.5">
                3D LUNAR & SWATH VISUALIZER
              </h1>
            </div>
          </div>

          <div className="flex items-center gap-2 font-mono text-xs text-white/70">
            <span className="px-3 py-1.5 rounded-full bg-[#00B8FF]/10 border border-[#4DEBFF]/30 text-[#4DEBFF]">
              ORBIT: 100 KM POLAR (90.0°)
            </span>
          </div>
        </div>

        {/* 3D Viewport & Overlay Toolbar */}
        <div className="relative w-full h-[650px] rounded-3xl bg-[#03070E] border border-white/15 overflow-hidden shadow-2xl flex items-center justify-center select-none">
          
          {/* Background Space Atmosphere */}
          <div className="absolute inset-0 bg-[radial-gradient(circle_at_center,rgba(0,184,255,0.15)_0%,rgba(5,10,18,1)_80%)]" />
          
          {/* Central 3D Globe Visual (Rotatable & Zoomable) */}
          <div 
            className="relative w-96 h-96 sm:w-[500px] sm:h-[500px] rounded-full border border-[#4DEBFF]/40 bg-gradient-to-tr from-[#081322] via-[#102035] to-[#1c385c] shadow-[0_0_90px_rgba(0,184,255,0.3)] flex items-center justify-center transition-transform duration-300"
            style={{ 
              transform: `rotate(${rotationDeg}deg) scale(${zoomScale})`,
            }}
          >
            {/* Latitude / Longitude Orthographic Grid */}
            {layerGrid && (
              <div className="absolute inset-0 opacity-25">
                <div className="w-full h-[1px] bg-[#4DEBFF] absolute top-1/2" />
                <div className="h-full w-[1px] bg-[#4DEBFF] absolute left-1/2" />
                <div className="w-64 h-64 rounded-full border border-[#4DEBFF] absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2" />
                <div className="w-96 h-96 rounded-full border border-[#4DEBFF] absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2" />
              </div>
            )}

            {/* Orbit Ground Track Ring */}
            <div className="absolute inset-0 rounded-full border-2 border-dashed border-[#4DEBFF]/60 rotate-45 scale-110 animate-pulse" />

            {/* Optical Observation Swath Polygons */}
            {layerFootprints && (
              <>
                <div className="absolute top-24 left-32 w-28 h-16 border-2 border-[#4DEBFF] bg-[#4DEBFF]/15 rotate-12 rounded" />
                <div className="absolute bottom-28 right-32 w-36 h-20 border-2 border-[#2F80FF] bg-[#2F80FF]/15 -rotate-6 rounded" />
                <div className="absolute bottom-16 left-40 w-24 h-28 border-2 border-[#FFB547] bg-[#FFB547]/15 rotate-45 rounded" />
              </>
            )}

            {/* Target Locus Marker */}
            <div className="absolute top-1/3 right-1/3 flex items-center gap-1.5 bg-[#07111F]/90 border border-[#4DEBFF] px-3 py-1 rounded-full shadow-xl">
              <span className="w-2 h-2 rounded-full bg-[#4DEBFF] animate-ping" />
              <span className="text-[10px] font-mono text-white font-bold">{selectedTarget.name}</span>
            </div>
          </div>

          {/* Left Layer & Camera Controls */}
          <div className="absolute top-6 left-6 bg-[#07111F]/90 backdrop-blur-xl border border-white/10 rounded-2xl p-4 text-xs font-mono space-y-3 z-30 max-w-xs shadow-xl">
            <div className="flex items-center gap-2 text-[#4DEBFF] font-bold text-xs uppercase border-b border-white/5 pb-2">
              <Layers className="w-4 h-4" />
              <span>LAYER CONTROLS</span>
            </div>

            <label className="flex items-center gap-2 cursor-pointer text-white/70 hover:text-white">
              <input
                type="checkbox"
                checked={layerFootprints}
                onChange={(e) => setLayerFootprints(e.target.checked)}
                className="rounded bg-white/10 border-white/20 text-[#00B8FF]"
              />
              <span>Observation Footprints (OHRC/TMC)</span>
            </label>

            <label className="flex items-center gap-2 cursor-pointer text-white/70 hover:text-white">
              <input
                type="checkbox"
                checked={layerGrid}
                onChange={(e) => setLayerGrid(e.target.checked)}
                className="rounded bg-white/10 border-white/20 text-[#00B8FF]"
              />
              <span>Lat / Lon Coordinate Grid</span>
            </label>

            <div className="pt-2 border-t border-white/5 flex items-center gap-2">
              <button
                onClick={() => setRotationDeg(rotationDeg + 30)}
                className="px-2.5 py-1.5 rounded-lg bg-white/5 hover:bg-white/10 text-white/80 flex items-center gap-1 text-[11px]"
              >
                <RotateCw className="w-3.5 h-3.5" />
                <span>Rotate</span>
              </button>
              <button
                onClick={() => setZoomScale(Math.min(1.5, zoomScale + 0.1))}
                className="p-1.5 rounded-lg bg-white/5 hover:bg-white/10 text-white/80"
                title="Zoom In"
              >
                <ZoomIn className="w-3.5 h-3.5" />
              </button>
              <button
                onClick={() => setZoomScale(Math.max(0.7, zoomScale - 0.1))}
                className="p-1.5 rounded-lg bg-white/5 hover:bg-white/10 text-white/80"
                title="Zoom Out"
              >
                <ZoomOut className="w-3.5 h-3.5" />
              </button>
            </div>
          </div>

          {/* Right Selected Target Information Drawer */}
          <div className="absolute top-6 right-6 w-84 bg-[#07111F]/95 backdrop-blur-xl border border-[#4DEBFF]/30 rounded-2xl p-5 text-xs font-mono space-y-4 shadow-2xl z-30">
            <div className="flex items-center justify-between border-b border-white/10 pb-2">
              <div className="flex items-center gap-2 text-white font-bold">
                <MapPin className="w-4 h-4 text-[#4DEBFF]" />
                <span>{selectedTarget.name}</span>
              </div>
              <span className="text-[10px] text-[#24D99B]">LIVE TARGET</span>
            </div>

            <p className="text-[11px] text-white/70 font-sans leading-relaxed">
              {selectedTarget.description}
            </p>

            <div className="grid grid-cols-2 gap-2 text-[10px] bg-[#050A12] p-3 rounded-xl border border-white/5">
              <div>
                <span className="text-white/40 block text-[9px]">Coordinates</span>
                <span className="text-white font-bold">{selectedTarget.lat}, {selectedTarget.lon}</span>
              </div>
              <div>
                <span className="text-white/40 block text-[9px]">Elevation</span>
                <span className="text-[#4DEBFF] font-bold">{selectedTarget.elevation}</span>
              </div>
              <div className="col-span-2 pt-1">
                <span className="text-white/40 block text-[9px]">Available Sensors</span>
                <span className="text-white font-bold">{selectedTarget.instruments}</span>
              </div>
            </div>

            <div className="space-y-1.5 pt-1">
              <span className="text-[10px] text-white/50 block">SWITCH LUNAR TARGET:</span>
              <div className="grid grid-cols-2 gap-1.5">
                {TARGETS.map(t => (
                  <button
                    key={t.id}
                    onClick={() => setSelectedTarget(t)}
                    className={`px-2 py-1.5 rounded-lg text-[10px] font-mono truncate transition-all ${
                      selectedTarget.id === t.id
                        ? 'bg-[#2F80FF] text-white font-bold'
                        : 'bg-white/5 text-white/60 hover:text-white'
                    }`}
                  >
                    {t.name.split(' ')[0]}
                  </button>
                ))}
              </div>
            </div>

            <Link
              href="/correspondence"
              className="w-full py-2.5 rounded-xl bg-gradient-to-r from-[#2F80FF] to-[#00B8FF] text-white text-center font-bold text-xs uppercase tracking-wider block shadow-lg hover:brightness-110"
            >
              Run Correspondence on Target →
            </Link>
          </div>

        </div>
      </main>
    </div>
  );
}
