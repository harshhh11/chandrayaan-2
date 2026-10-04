'use client';

import React from 'react';
import Link from 'next/link';
import { Orbit, Activity, Radio, Calendar, Compass, ArrowRight, ShieldCheck } from 'lucide-react';
import { EdolusTopNav } from '@/components/layout/EdolusTopNav';

export default function MissionPage() {
  return (
    <div className="min-h-screen bg-[#050A12] text-white font-sans selection:bg-white/20 selection:text-white">
      <EdolusTopNav />

      <main className="pt-20 pb-12 px-4 sm:px-8 max-w-[1920px] mx-auto space-y-6">
        {/* Header */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-white/10 pb-4">
          <div>
            <div className="text-[10px] font-mono tracking-widest text-[#8D98A5] uppercase">
              CHANDRAYAAN-2 LUNAR ORBITAL MISSION CONTEXT
            </div>
            <h1 className="text-2xl sm:text-3xl font-bold font-sans tracking-tight text-white mt-0.5">
              MISSION TELEMETRY & FLIGHT DYNAMICS
            </h1>
          </div>
        </div>

        {/* 3 Overview Telemetry Cards */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <div className="p-6 rounded-3xl bg-[#07111F]/90 border border-white/10 space-y-3">
            <div className="flex items-center justify-between">
              <span className="text-xs font-mono font-bold text-white">ORBIT PROPAGATION</span>
              <span className="text-[10px] font-mono text-[#32D39A]">CIRCULAR POLAR</span>
            </div>
            <div className="text-2xl font-mono font-bold text-white">100.4 × 99.8 km</div>
            <p className="text-xs text-white/60 font-sans">
              90.0° Polar inclination with 112-minute orbital period, providing global lunar coverage across 28-day diurnal illumination cycles.
            </p>
          </div>

          <div className="p-6 rounded-3xl bg-[#07111F]/90 border border-white/10 space-y-3">
            <div className="flex items-center justify-between">
              <span className="text-xs font-mono font-bold text-[#D9DDE0]">COMMUNICATION LINK</span>
              <span className="text-[10px] font-mono text-[#32D39A]">LOCKED</span>
            </div>
            <div className="text-2xl font-mono font-bold text-white">IDSN BYALALU</div>
            <p className="text-xs text-white/60 font-sans">
              32m Deep Space Network antenna with 8.4 GHz X-band downlink stream transmitting calibrated Level-2 science products.
            </p>
          </div>

          <div className="p-6 rounded-3xl bg-[#07111F]/90 border border-white/10 space-y-3">
            <div className="flex items-center justify-between">
              <span className="text-xs font-mono font-bold text-[#FFB547]">CORRESPONDENCE READY</span>
              <span className="text-[10px] font-mono text-white/70">8,932 RUNS</span>
            </div>
            <div className="text-2xl font-mono font-bold text-white">91.4% AVG CONFIDENCE</div>
            <p className="text-xs text-white/60 font-sans">
              Automated tie-point matching engine operational across OHRC, TMC-2 stereo, and IIRS spectral bands.
            </p>
          </div>
        </div>

        {/* Fast Action Navigation */}
        <div className="p-6 rounded-3xl bg-[#07111F]/90 border border-white/10 flex flex-col sm:flex-row items-center justify-between gap-4">
          <div className="space-y-1">
            <h3 className="text-sm font-mono font-bold text-white">READY TO PERFORM CORRESPONDENCE ANALYSIS?</h3>
            <p className="text-xs text-white/60 font-sans">
              Select dual calibrated Chandrayaan-2 image products to compute sub-pixel tie-points, Sun-angle compensation, and scale pyramids.
            </p>
          </div>

          <Link
            href="/correspondence"
            className="px-6 py-3 rounded-full bg-gradient-to-r from-[#2F80FF] to-[#00B8FF] text-white font-mono text-xs font-bold tracking-wider uppercase shadow-[0_0_20px_rgba(0,184,255,0.3)] hover:brightness-110 transition-all flex items-center gap-2 shrink-0"
          >
            <span>Launch Workbench</span>
            <ArrowRight className="w-4 h-4" />
          </Link>
        </div>
      </main>
    </div>
  );
}
