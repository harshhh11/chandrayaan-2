'use client';

import React, { useState, useEffect } from 'react';
import { useParams, useRouter } from 'next/navigation';
import Link from 'next/link';
import { 
  Eye, Compass, Sun, Maximize2, GitCompare, Globe, 
  Download, ArrowLeft, Orbit, Database, Radio, Layers, 
  Sparkles, CheckCircle2, ChevronRight
} from 'lucide-react';
import { EdolusShell } from '@/components/layout/EdolusShell';

interface CandidatePair {
  id: string;
  title: string;
  sensor: string;
  gsd_m: number;
  sun_elevation: number;
  sun_azimuth: number;
  sun_elevation_delta: number;
  scale_ratio: number;
  estimated_overlap: string;
}

export default function ImageDetailPage() {
  const params = useParams();
  const router = useRouter();
  const imageId = (params?.id as string) || 'OHRC-BOGUSLAWSKY-001';

  const [zoomLevel, setZoomLevel] = useState(1);
  const [candidatePairs, setCandidatePairs] = useState<CandidatePair[]>([
    {
      id: 'TMC-BOGUSLAWSKY-002',
      title: 'Boguslawsky Crater High-Sun TMC-2',
      sensor: 'TMC-2',
      gsd_m: 5.0,
      sun_elevation: 54.1,
      sun_azimuth: 142.8,
      sun_elevation_delta: 25.7,
      scale_ratio: 20.0,
      estimated_overlap: '94.8%'
    },
    {
      id: 'IIRS-SHACKLETON-003',
      title: 'Shackleton Rim Hyperspectral IIRS',
      sensor: 'IIRS',
      gsd_m: 80.0,
      sun_elevation: 12.6,
      sun_azimuth: 210.4,
      sun_elevation_delta: 15.8,
      scale_ratio: 320.0,
      estimated_overlap: '18.2%'
    }
  ]);

  return (
    <EdolusShell>
      <div className="space-y-6">
        
        {/* Back Link & Title */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-white/10 pb-5">
          <div className="flex items-center gap-3">
            <button
              onClick={() => router.back()}
              className="p-2 rounded-xl bg-white/5 hover:bg-white/10 text-white/70 hover:text-white transition-colors"
            >
              <ArrowLeft className="w-4 h-4" />
            </button>
            <div>
              <div className="flex items-center gap-2 text-[10px] font-mono tracking-widest text-[#4DEBFF] uppercase">
                <Orbit className="w-3.5 h-3.5" />
                <span>CHANDRAYAAN-2 OPTICAL PRODUCT METADATA</span>
              </div>
              <h1 className="text-2xl sm:text-3xl font-bold font-sans tracking-tight text-white mt-0.5">
                {imageId}
              </h1>
            </div>
          </div>

          <div className="flex items-center gap-2">
            <Link
              href="/correspondence"
              className="px-5 py-2.5 rounded-xl bg-gradient-to-r from-[#2F80FF] to-[#00B8FF] text-white font-mono text-xs font-bold tracking-wider uppercase shadow-[0_0_20px_rgba(0,184,255,0.3)] hover:brightness-110 transition-all flex items-center gap-2"
            >
              <GitCompare className="w-4 h-4" />
              <span>Match in Workbench</span>
            </Link>
            <Link
              href="/map"
              className="px-4 py-2.5 rounded-xl bg-white/[0.04] hover:bg-white/[0.08] border border-white/10 text-white font-mono text-xs tracking-wider uppercase transition-all flex items-center gap-2"
            >
              <Globe className="w-4 h-4 text-[#4DEBFF]" />
              <span>View Footprint</span>
            </Link>
          </div>
        </div>

        {/* Main Grid: High-Res Canvas + Telemetry Sidebar */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
          
          {/* Left Column: High-Res Interactive Image Pan/Zoom View (7 Cols) */}
          <div className="lg:col-span-7 rounded-3xl bg-[#07111F]/90 border border-white/10 p-5 flex flex-col justify-between space-y-4">
            <div className="flex items-center justify-between border-b border-white/5 pb-3">
              <div className="flex items-center gap-2">
                <Eye className="w-4 h-4 text-[#4DEBFF]" />
                <h3 className="text-xs font-mono font-bold tracking-widest uppercase text-white">
                  FULL-FRAME RASTER INSPECTOR
                </h3>
              </div>
              
              {/* Zoom Controls */}
              <div className="flex items-center gap-1 bg-[#050A12] p-1 rounded-xl border border-white/5 text-[10px] font-mono">
                <button
                  onClick={() => setZoomLevel(Math.max(0.5, zoomLevel - 0.25))}
                  className="px-2 py-0.5 rounded text-white/60 hover:text-white hover:bg-white/10"
                >
                  -
                </button>
                <span className="px-2 text-[#4DEBFF] font-bold">{(zoomLevel * 100).toFixed(0)}%</span>
                <button
                  onClick={() => setZoomLevel(Math.min(3, zoomLevel + 0.25))}
                  className="px-2 py-0.5 rounded text-white/60 hover:text-white hover:bg-white/10"
                >
                  +
                </button>
                <button
                  onClick={() => setZoomLevel(1)}
                  className="px-2 py-0.5 rounded text-white/40 hover:text-white hover:bg-white/10"
                >
                  Reset
                </button>
              </div>
            </div>

            {/* Viewport */}
            <div className="relative h-[420px] rounded-2xl bg-black border border-white/10 overflow-hidden flex items-center justify-center cursor-grab active:cursor-grabbing">
              <img
                src={
                  imageId.includes('TMC')
                    ? '/api/images/TMC-BOGUSLAWSKY-002.png'
                    : imageId.includes('IIRS')
                    ? '/api/images/IIRS-SHACKLETON-003.png'
                    : '/api/images/OHRC-BOGUSLAWSKY-001.png'
                }
                alt={imageId}
                className="max-w-none transition-transform duration-200"
                style={{ transform: `scale(${zoomLevel})` }}
              />
              <div className="absolute bottom-3 left-3 px-2.5 py-1 rounded-lg bg-black/80 text-[10px] font-mono text-white/70 border border-white/10">
                RESOLUTION: 2048 × 2048 • 16-BIT RADIANCE
              </div>
            </div>

            {/* Radiometric Histogram */}
            <div className="bg-[#050A12] p-3 rounded-2xl border border-white/5">
              <div className="flex items-center justify-between text-[10px] font-mono text-white/50 mb-2">
                <span>RADIOMETRIC INTENSITY HISTOGRAM (DN 0 - 255)</span>
                <span className="text-[#4DEBFF]">MEAN: 118.4 • STD DEV: 34.2</span>
              </div>
              <div className="h-10 flex items-end gap-[2px] opacity-80">
                {Array.from({ length: 48 }).map((_, i) => {
                  const h = Math.sin(i / 8) * 30 + Math.random() * 8 + 5;
                  return (
                    <div
                      key={i}
                      className="flex-1 bg-gradient-to-t from-[#2F80FF] to-[#4DEBFF] rounded-t-sm"
                      style={{ height: `${Math.max(4, h)}px` }}
                    />
                  );
                })}
              </div>
            </div>
          </div>

          {/* Right Column: Metadata & Solar Radar (5 Cols) */}
          <div className="lg:col-span-5 space-y-6 flex flex-col justify-between">
            
            {/* Metadata Breakdown */}
            <div className="rounded-3xl bg-[#07111F]/90 border border-white/10 p-5 space-y-4">
              <div className="flex items-center justify-between border-b border-white/5 pb-3">
                <div className="flex items-center gap-2">
                  <Database className="w-4 h-4 text-[#4DEBFF]" />
                  <h3 className="text-xs font-mono font-bold tracking-widest uppercase text-white">
                    CALIBRATED TELEMETRY
                  </h3>
                </div>
                <span className="text-[10px] font-mono text-[#24D99B] bg-[#24D99B]/10 px-2 py-0.5 rounded border border-[#24D99B]/30">
                  LEVEL-2 PRODUCT
                </span>
              </div>

              <div className="grid grid-cols-2 gap-3 text-[11px] font-mono">
                <div className="bg-[#050A12] p-3 rounded-xl border border-white/5">
                  <span className="text-white/40 block text-[9px]">GSD Pixel Scale</span>
                  <span className="text-white font-bold">0.25 m / pixel</span>
                </div>
                <div className="bg-[#050A12] p-3 rounded-xl border border-white/5">
                  <span className="text-white/40 block text-[9px]">Orbit Altitude</span>
                  <span className="text-white font-bold">100.4 km</span>
                </div>
                <div className="bg-[#050A12] p-3 rounded-xl border border-white/5">
                  <span className="text-white/40 block text-[9px]">Center Latitude</span>
                  <span className="text-white font-bold">74.32° S</span>
                </div>
                <div className="bg-[#050A12] p-3 rounded-xl border border-white/5">
                  <span className="text-white/40 block text-[9px]">Center Longitude</span>
                  <span className="text-white font-bold">53.64° E</span>
                </div>
                <div className="bg-[#050A12] p-3 rounded-xl border border-white/5">
                  <span className="text-white/40 block text-[9px]">Solar Elevation</span>
                  <span className="text-[#FFB547] font-bold">28.4°</span>
                </div>
                <div className="bg-[#050A12] p-3 rounded-xl border border-white/5">
                  <span className="text-white/40 block text-[9px]">Solar Azimuth</span>
                  <span className="text-[#FFB547] font-bold">65.2°</span>
                </div>
              </div>

              {/* Sun Geometry Vector Compass */}
              <div className="bg-[#050A12] p-3.5 rounded-2xl border border-white/5 flex items-center justify-between">
                <div className="text-[11px] font-mono">
                  <div className="text-white font-bold flex items-center gap-1.5 text-xs">
                    <Sun className="w-3.5 h-3.5 text-[#FFB547]" />
                    <span>SOLAR ILLUMINATION VECTOR</span>
                  </div>
                  <div className="text-white/50 text-[10px] mt-0.5">
                    Azimuth: 65.2° (ENE) • Long shadow conditions
                  </div>
                </div>

                <div className="w-12 h-12 rounded-full border border-dashed border-[#FFB547]/40 relative flex items-center justify-center">
                  <div 
                    className="w-1 h-5 bg-[#FFB547] rounded-full origin-bottom absolute bottom-6"
                    style={{ transform: 'rotate(65.2deg)' }}
                  />
                  <span className="text-[8px] font-mono text-white/40 absolute top-0.5">N</span>
                </div>
              </div>
            </div>

            {/* Compatible Matching Candidates */}
            <div className="rounded-3xl bg-[#07111F]/90 border border-white/10 p-5 space-y-3">
              <h3 className="text-xs font-mono font-bold tracking-widest uppercase text-white border-b border-white/5 pb-2">
                OVERLAPPING CORRESPONDENCE CANDIDATES
              </h3>

              <div className="space-y-2">
                {candidatePairs.map((c) => (
                  <div
                    key={c.id}
                    className="p-3 rounded-2xl bg-[#050A12] border border-white/5 hover:border-[#4DEBFF]/30 transition-all flex items-center justify-between"
                  >
                    <div>
                      <div className="text-xs font-mono font-bold text-white flex items-center gap-2">
                        <span>{c.id}</span>
                        <span className="text-[9px] px-1.5 py-0.5 rounded bg-white/10 text-white/70">
                          {c.sensor}
                        </span>
                      </div>
                      <div className="text-[10px] font-mono text-white/50 mt-0.5">
                        Overlap: {c.estimated_overlap} • Scale Diff: {c.scale_ratio}× • Sun Δ: {c.sun_elevation_delta}°
                      </div>
                    </div>

                    <Link
                      href="/correspondence"
                      className="px-3 py-1.5 rounded-lg bg-[#2F80FF]/20 hover:bg-[#2F80FF]/40 text-[#4DEBFF] text-[10px] font-mono font-bold transition-colors flex items-center gap-1"
                    >
                      <span>Match</span>
                      <ChevronRight className="w-3 h-3" />
                    </Link>
                  </div>
                ))}
              </div>
            </div>

          </div>

        </div>

      </div>
    </EdolusShell>
  );
}
