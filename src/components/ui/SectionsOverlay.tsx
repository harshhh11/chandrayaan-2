'use client';

import React from 'react';
import { spaceAudio } from '@/audio/spaceAudio';

interface SectionsOverlayProps {
  scrollProgress: number;
}

export const SectionsOverlay: React.FC<SectionsOverlayProps> = ({ scrollProgress }) => {
  // Helper to compute opacity fade for each section window
  const getSectionOpacity = (start: number, peak1: number, peak2: number, end: number) => {
    if (scrollProgress < start || scrollProgress > end) return 0;
    if (scrollProgress >= peak1 && scrollProgress <= peak2) return 1;
    if (scrollProgress < peak1) return (scrollProgress - start) / (peak1 - start);
    return 1 - (scrollProgress - peak2) / (end - peak2);
  };

  const op1 = getSectionOpacity(0.18, 0.25, 0.38, 0.45);
  const op2 = getSectionOpacity(0.42, 0.50, 0.62, 0.68);
  const op3 = getSectionOpacity(0.65, 0.72, 0.84, 0.88);
  const op4 = getSectionOpacity(0.85, 0.92, 1.0, 1.0);

  return (
    <div className="fixed inset-0 pointer-events-none z-30 flex items-center justify-between p-6 sm:p-16 lg:p-24 select-none">
      {/* ========================================================
          SECTION 1: OBSERVE (Focus on Payload & Sensors)
          ======================================================== */}
      {op1 > 0.01 && (
        <div
          style={{ opacity: op1 }}
          className="max-w-lg flex flex-col gap-4 transition-opacity duration-300"
        >
          <div className="flex items-center gap-2">
            <span className="w-1.5 h-1.5 rounded-full bg-sky-400" />
            <span className="text-[10px] font-mono tracking-[0.3em] uppercase text-sky-400">
              PHASE 01 // SENSOR SYNTHESIS
            </span>
          </div>

          <h2 className="text-4xl sm:text-6xl font-bold tracking-tight text-white uppercase leading-none">
            OBSERVE
          </h2>

          <p className="text-sm sm:text-base text-white/70 font-light leading-relaxed">
            Continuous multi-band optical & synthetic aperture radar synthesis from low-Earth orbit with sub-meter ground sample distance.
          </p>

          <div className="grid grid-cols-2 gap-4 pt-4 border-t border-white/10 font-mono text-[11px]">
            <div>
              <div className="text-white/40 text-[9px] uppercase tracking-wider">RESOLUTION</div>
              <div className="text-white text-xs font-medium">0.32M / PIXEL</div>
            </div>
            <div>
              <div className="text-white/40 text-[9px] uppercase tracking-wider">SPECTRAL BANDS</div>
              <div className="text-white text-xs font-medium">16 HYPERSPECTRAL</div>
            </div>
          </div>
        </div>
      )}

      {/* ========================================================
          SECTION 2: UNDERSTAND (Focus on Constellation Links)
          ======================================================== */}
      {op2 > 0.01 && (
        <div
          style={{ opacity: op2 }}
          className="ml-auto max-w-lg flex flex-col gap-4 text-right items-end transition-opacity duration-300"
        >
          <div className="flex items-center gap-2">
            <span className="text-[10px] font-mono tracking-[0.3em] uppercase text-sky-400">
              PHASE 02 // ORBITAL MESH
            </span>
            <span className="w-1.5 h-1.5 rounded-full bg-sky-400" />
          </div>

          <h2 className="text-4xl sm:text-6xl font-bold tracking-tight text-white uppercase leading-none">
            UNDERSTAND
          </h2>

          <p className="text-sm sm:text-base text-white/70 font-light leading-relaxed">
            Autonomous inter-satellite laser mesh networking with on-orbit edge computation for instantaneous planetary topological comprehension.
          </p>

          <div className="grid grid-cols-2 gap-6 pt-4 border-t border-white/10 font-mono text-[11px] text-right">
            <div>
              <div className="text-white/40 text-[9px] uppercase tracking-wider">LATENCY</div>
              <div className="text-white text-xs font-medium">&lt; 24MS GLOBAL</div>
            </div>
            <div>
              <div className="text-white/40 text-[9px] uppercase tracking-wider">ISL BANDWIDTH</div>
              <div className="text-white text-xs font-medium">100 GBPS OPTICAL</div>
            </div>
          </div>
        </div>
      )}

      {/* ========================================================
          SECTION 3: INTELLIGENCE FROM ORBIT (Earth Curvature)
          ======================================================== */}
      {op3 > 0.01 && (
        <div
          style={{ opacity: op3 }}
          className="max-w-xl flex flex-col gap-4 transition-opacity duration-300"
        >
          <div className="flex items-center gap-2">
            <span className="w-1.5 h-1.5 rounded-full bg-sky-400" />
            <span className="text-[10px] font-mono tracking-[0.3em] uppercase text-sky-400">
              PHASE 03 // PLANETARY SYNCHRONIZATION
            </span>
          </div>

          <h2 className="text-3xl sm:text-5xl lg:text-6xl font-bold tracking-tight text-white uppercase leading-[1.0]">
            INTELLIGENCE<br />
            <span className="text-sky-400">FROM ORBIT</span>
          </h2>

          <p className="text-sm sm:text-base text-white/70 font-light leading-relaxed">
            Autonomous planetary observation delivering high-cadence actionable ground truth across maritime, critical infrastructure, and atmospheric dynamics.
          </p>

          <div className="flex items-center gap-6 pt-2 font-mono text-[11px] text-white/60">
            <div>
              REVISIT TIME // <span className="text-white font-medium">12 MINUTES</span>
            </div>
            <span className="text-white/20">/</span>
            <div>
              GLOBAL COVERAGE // <span className="text-white font-medium">100%</span>
            </div>
          </div>
        </div>
      )}

      {/* ========================================================
          SECTION 4: MISSION GATEWAY & PLATFORM ACCESS
          ======================================================== */}
      {op4 > 0.01 && (
        <div
          style={{ opacity: op4 }}
          className="mx-auto max-w-xl w-full flex flex-col items-center text-center gap-6 transition-opacity duration-300 pointer-events-auto"
        >
          <div className="flex items-center gap-2">
            <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse shadow-[0_0_10px_#4ade80]" />
            <span className="text-[10px] font-mono tracking-[0.35em] uppercase text-emerald-400">
              ORBITAL MESH ONLINE
            </span>
          </div>

          <h2 className="text-4xl sm:text-6xl font-bold tracking-tight text-white uppercase leading-none">
            INITIALIZE MISSION
          </h2>

          <p className="text-sm sm:text-base text-white/70 font-light max-w-md leading-relaxed">
            Experience the next era of orbital intelligence and satellite observation.
          </p>

          {/* Interactive Launch Card */}
          <div className="w-full p-6 rounded-2xl border border-white/15 bg-orbital-card backdrop-blur-xl flex flex-col gap-5 shadow-2xl">
            <div className="flex items-center justify-between font-mono text-[10px] text-white/50 border-b border-white/10 pb-3">
              <span className="text-sky-400">ORBITAL-OS // BUILD 2026.4</span>
              <span>STATUS: READY FOR UPLINK</span>
            </div>

            <div className="grid grid-cols-3 gap-2 font-mono text-[10px] text-left">
              <div className="p-2.5 rounded-lg bg-white/[0.03] border border-white/5">
                <div className="text-white/40 text-[8px] uppercase">ACTIVE SAT</div>
                <div className="text-white text-xs font-semibold">EDOLUS-1</div>
              </div>
              <div className="p-2.5 rounded-lg bg-white/[0.03] border border-white/5">
                <div className="text-white/40 text-[8px] uppercase">ORBIT</div>
                <div className="text-white text-xs font-semibold">540 KM SSO</div>
              </div>
              <div className="p-2.5 rounded-lg bg-white/[0.03] border border-white/5">
                <div className="text-white/40 text-[8px] uppercase">HEALTH</div>
                <div className="text-emerald-400 text-xs font-semibold">99.98%</div>
              </div>
            </div>

            {/* Main Primary CTA Button */}
            <button
              onClick={() => spaceAudio.playTelemetryClick()}
              className="w-full py-3.5 px-6 rounded-xl bg-white hover:bg-sky-50 text-orbital-dark font-medium text-xs sm:text-sm tracking-[0.25em] uppercase transition-all duration-300 hover:shadow-[0_0_25px_rgba(255,255,255,0.4)] flex items-center justify-center gap-2 group cursor-pointer"
            >
              <span>ENTER THE PLATFORM</span>
              <span className="text-sky-600 group-hover:translate-x-1 transition-transform">→</span>
            </button>
          </div>
        </div>
      )}
    </div>
  );
};
