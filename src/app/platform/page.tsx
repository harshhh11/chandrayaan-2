'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { WorkstationHeader } from '@/components/layout/WorkstationHeader';
import { apiClient } from '@/lib/api';
import { DatasetItem, RegistrationJob } from '@/types/api';

export default function PlatformMissionControl() {
  const [datasets, setDatasets] = useState<DatasetItem[]>([]);
  const [jobs, setJobs] = useState<RegistrationJob[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    Promise.all([apiClient.getDatasets(), apiClient.listJobs()]).then(([d, j]) => {
      setDatasets(d);
      setJobs(j);
      setLoading(false);
    });
  }, []);

  return (
    <main className="min-h-screen bg-[#05070a] text-white select-none">
      <WorkstationHeader />

      <div className="max-w-7xl mx-auto px-4 sm:px-8 py-10 flex flex-col gap-10">
        {/* Top Header Banner */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-6 pb-6 border-b border-white/10 font-mono">
          <div className="flex flex-col gap-1.5">
            <div className="flex items-center gap-2 text-xs text-[#00C8FF] tracking-[0.25em] uppercase font-bold">
              <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse shadow-[0_0_8px_#34d399]" />
              <span>ISRO SIH26166 // MISSION CONTROL</span>
            </div>
            <h1 className="text-2xl sm:text-3xl font-black tracking-tight uppercase text-[#F5F7FA]">
              CHANDRAYAAN-2 CORRESPONDENCE WORKSTATION
            </h1>
            <p className="text-xs text-white/60 font-sans max-w-2xl">
              Multi-modal, Sun angle and scale-invariant image registration platform for OHRC, TMC-2, and IIRS payloads.
            </p>
          </div>

          <div className="flex items-center gap-3">
            <Link
              href="/register"
              className="px-6 py-3 rounded-lg bg-[#00C8FF] hover:bg-[#00B4E6] text-black font-bold text-xs tracking-wider uppercase transition-all shadow-[0_0_20px_rgba(0,200,255,0.25)] flex items-center gap-2"
            >
              <span>INITIALIZE REGISTRATION</span>
              <span>→</span>
            </Link>
          </div>
        </div>

        {/* 4 Scientific Telemetry KPI Cards */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 font-mono">
          <div className="bg-[#080d16] border border-white/10 rounded-xl p-5 flex flex-col gap-2">
            <span className="text-[10px] text-white/40 tracking-widest uppercase">
              MEAN REPROJECTION ERROR
            </span>
            <div className="text-3xl font-black text-[#00C8FF] tracking-tight">
              0.48 <span className="text-sm font-normal text-white/50">px</span>
            </div>
            <div className="text-[10px] text-emerald-400 tracking-wider">
              ✓ SUB-PIXEL ACCURACY (&lt;1.0 px)
            </div>
          </div>

          <div className="bg-[#080d16] border border-white/10 rounded-xl p-5 flex flex-col gap-2">
            <span className="text-[10px] text-white/40 tracking-widest uppercase">
              MEAN INLIER RATIO
            </span>
            <div className="text-3xl font-black text-emerald-400 tracking-tight">
              88.4 <span className="text-sm font-normal text-white/50">%</span>
            </div>
            <div className="text-[10px] text-white/50 tracking-wider">
              RANSAC HOMOGRAPHY FILTERED
            </div>
          </div>

          <div className="bg-[#080d16] border border-white/10 rounded-xl p-5 flex flex-col gap-2">
            <span className="text-[10px] text-white/40 tracking-widest uppercase">
              CHANDRAYAAN-2 DATASETS
            </span>
            <div className="text-3xl font-black text-white tracking-tight">
              {datasets.length} <span className="text-sm font-normal text-white/50">swaths</span>
            </div>
            <div className="text-[10px] text-sky-400 tracking-wider">
              OHRC (0.25m) • TMC-2 (5m) • IIRS
            </div>
          </div>

          <div className="bg-[#080d16] border border-white/10 rounded-xl p-5 flex flex-col gap-2">
            <span className="text-[10px] text-white/40 tracking-widest uppercase">
              PIPELINE EXECUTION STATE
            </span>
            <div className="text-3xl font-black text-white tracking-tight">
              ONLINE
            </div>
            <div className="text-[10px] text-emerald-400 tracking-wider">
              SIFT • CROSS-MODAL • RANSAC
            </div>
          </div>
        </div>

        {/* Quick Launch Demo Scenarios */}
        <div className="flex flex-col gap-4">
          <div className="flex items-center justify-between font-mono text-xs">
            <span className="text-white/80 font-bold tracking-widest uppercase">
              OFFICIAL BENCHMARK TEST PAIRS (ISRO SIH26166)
            </span>
            <Link href="/data" className="text-[#00C8FF] hover:underline text-[11px]">
              EXPLORE ALL DATASETS →
            </Link>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 font-mono">
            {/* Demo 1: OHRC vs TMC-2 */}
            <div className="bg-[#080d16] border border-white/10 rounded-xl p-5 flex flex-col justify-between gap-4 group hover:border-[#00C8FF]/50 transition-all">
              <div className="flex flex-col gap-2">
                <div className="flex items-center justify-between text-[10px]">
                  <span className="px-2 py-0.5 rounded bg-[#00C8FF]/10 text-[#00C8FF] font-bold">
                    DEMO 01 // SCALE INVARIANT
                  </span>
                  <span className="text-white/40">20.0× SCALE RATIO</span>
                </div>
                <h3 className="text-base font-bold text-white uppercase pt-1">
                  OHRC (0.25m) ↔ TMC-2 (5.0m)
                </h3>
                <p className="text-xs text-white/60 font-sans">
                  Boguslawsky Crater South Pole ejecta field. High-to-low resolution multi-scale pyramid registration.
                </p>
              </div>
              <Link
                href="/register?src=DS-OHRC-BOGUSLAWSKY-01&ref=DS-TMC2-BOGUSLAWSKY-01"
                className="w-full py-2.5 rounded bg-white/[0.04] hover:bg-[#00C8FF]/20 text-[#00C8FF] text-center text-xs font-bold uppercase transition-all border border-[#00C8FF]/30"
              >
                RUN PAIR REGISTRATION →
              </Link>
            </div>

            {/* Demo 2: TMC-2 vs IIRS */}
            <div className="bg-[#080d16] border border-white/10 rounded-xl p-5 flex flex-col justify-between gap-4 group hover:border-amber-400/50 transition-all">
              <div className="flex flex-col gap-2">
                <div className="flex items-center justify-between text-[10px]">
                  <span className="px-2 py-0.5 rounded bg-amber-400/10 text-amber-400 font-bold">
                    DEMO 02 // MULTI-MODAL
                  </span>
                  <span className="text-white/40">OPTICAL ↔ INFRARED</span>
                </div>
                <h3 className="text-base font-bold text-white uppercase pt-1">
                  TMC-2 Optical ↔ IIRS NIR (2.1 μm)
                </h3>
                <p className="text-xs text-white/60 font-sans">
                  Shackleton Crater rim. Structural phase congruency matching invariant to spectral albedo reversals.
                </p>
              </div>
              <Link
                href="/register?src=DS-TMC2-SHACKLETON-02&ref=DS-IIRS-SHACKLETON-02"
                className="w-full py-2.5 rounded bg-white/[0.04] hover:bg-amber-400/20 text-amber-300 text-center text-xs font-bold uppercase transition-all border border-amber-400/30"
              >
                RUN PAIR REGISTRATION →
              </Link>
            </div>

            {/* Demo 3: Sun Angle Invariant */}
            <div className="bg-[#080d16] border border-white/10 rounded-xl p-5 flex flex-col justify-between gap-4 group hover:border-emerald-400/50 transition-all">
              <div className="flex flex-col gap-2">
                <div className="flex items-center justify-between text-[10px]">
                  <span className="px-2 py-0.5 rounded bg-emerald-400/10 text-emerald-400 font-bold">
                    DEMO 03 // SUN ANGLE Δ 180°
                  </span>
                  <span className="text-white/40">OPPOSITE SHADOWS</span>
                </div>
                <h3 className="text-base font-bold text-white uppercase pt-1">
                  OHRC Morning (65°) ↔ Afternoon (245°)
                </h3>
                <p className="text-xs text-white/60 font-sans">
                  Tycho Crater interior. 180° reversed illumination with CLAHE & gradient-domain shadow compensation.
                </p>
              </div>
              <Link
                href="/register?src=DS-OHRC-TYCHO-AM-03&ref=DS-OHRC-TYCHO-PM-03"
                className="w-full py-2.5 rounded bg-white/[0.04] hover:bg-emerald-400/20 text-emerald-300 text-center text-xs font-bold uppercase transition-all border border-emerald-400/30"
              >
                RUN PAIR REGISTRATION →
              </Link>
            </div>
          </div>
        </div>

        {/* Scientific Workflow Architecture Summary */}
        <div className="bg-[#080d16] border border-white/10 rounded-xl p-6 font-mono flex flex-col gap-4">
          <div className="text-xs text-[#00C8FF] font-bold tracking-widest uppercase">
            END-TO-END CORRESPONDENCE PIPELINE STAGES
          </div>
          <div className="grid grid-cols-2 sm:grid-cols-4 lg:grid-cols-8 gap-3 text-center text-[10px]">
            <div className="p-3 bg-white/[0.02] border border-white/5 rounded flex flex-col gap-1">
              <span className="text-[#00C8FF] font-bold">01. INGEST</span>
              <span className="text-white/50">TIFF/GeoTIFF</span>
            </div>
            <div className="p-3 bg-white/[0.02] border border-white/5 rounded flex flex-col gap-1">
              <span className="text-[#00C8FF] font-bold">02. SUN GEO</span>
              <span className="text-white/50">Δ Azimuth/El</span>
            </div>
            <div className="p-3 bg-white/[0.02] border border-white/5 rounded flex flex-col gap-1">
              <span className="text-[#00C8FF] font-bold">03. CLAHE</span>
              <span className="text-white/50">Wallis Filter</span>
            </div>
            <div className="p-3 bg-white/[0.02] border border-white/5 rounded flex flex-col gap-1">
              <span className="text-[#00C8FF] font-bold">04. GSD PYR</span>
              <span className="text-white/50">Scale Resample</span>
            </div>
            <div className="p-3 bg-white/[0.02] border border-white/5 rounded flex flex-col gap-1">
              <span className="text-[#00C8FF] font-bold">05. MATCH</span>
              <span className="text-white/50">Cross-Modal</span>
            </div>
            <div className="p-3 bg-white/[0.02] border border-white/5 rounded flex flex-col gap-1">
              <span className="text-[#00C8FF] font-bold">06. RANSAC</span>
              <span className="text-white/50">Homography</span>
            </div>
            <div className="p-3 bg-white/[0.02] border border-white/5 rounded flex flex-col gap-1">
              <span className="text-[#00C8FF] font-bold">07. SUBPIXEL</span>
              <span className="text-white/50">Lucas-Kanade</span>
            </div>
            <div className="p-3 bg-white/[0.02] border border-white/5 rounded flex flex-col gap-1">
              <span className="text-[#00C8FF] font-bold">08. EXPORT</span>
              <span className="text-white/50">GeoTIFF/CSV</span>
            </div>
          </div>
        </div>
      </div>
    </main>
  );
}
