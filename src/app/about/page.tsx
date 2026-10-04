'use client';

import React from 'react';
import Link from 'next/link';
import { Orbit, Cpu, ShieldCheck, Database, Layers, ArrowRight, Sun, Maximize2 } from 'lucide-react';
import { EdolusTopNav } from '@/components/layout/EdolusTopNav';

export default function AboutPage() {
  return (
    <div className="min-h-screen bg-[#050A12] text-white font-sans selection:bg-white/20 selection:text-white">
      <EdolusTopNav />

      <main className="pt-20 pb-12 px-4 sm:px-8 max-w-5xl mx-auto space-y-8">
        {/* Header */}
        <div className="border-b border-white/10 pb-4 space-y-2">
          <div className="text-[10px] font-mono tracking-widest text-[#8D98A5] uppercase">
            ISRO PROBLEM STATEMENT SIH26166 ARCHITECTURAL SPECIFICATION
          </div>
          <h1 className="text-3xl sm:text-4xl font-black font-sans tracking-tight text-white">
            EDOLUS // LUNAR INTELLIGENCE
          </h1>
          <p className="text-sm text-white/70 font-sans leading-relaxed">
            Multi-modal, Sun-angle and scale-invariant image correspondence using Chandrayaan-2 optical and hyperspectral datasets (OHRC, TMC-2, and IIRS).
          </p>
        </div>

        {/* 3 Core Optical Payloads */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <div className="p-5 rounded-3xl bg-[#07111F]/90 border border-white/10 space-y-3">
            <div className="flex items-center justify-between">
              <span className="text-xs font-mono font-bold text-white">OHRC</span>
              <span className="text-[9px] font-mono text-white/50">0.25 m/px</span>
            </div>
            <h3 className="text-sm font-bold text-white">Optical High Resolution Camera</h3>
            <p className="text-xs text-white/70 font-sans leading-relaxed">
              Provides ultra-high resolution lunar surface imaging from a 100 km polar orbit for hazard assessment and sub-meter landing site characterization.
            </p>
          </div>

          <div className="p-5 rounded-3xl bg-[#07111F]/90 border border-white/10 space-y-3">
            <div className="flex items-center justify-between">
              <span className="text-xs font-mono font-bold text-[#D9DDE0]">TMC-2</span>
              <span className="text-[9px] font-mono text-white/50">5.0 m/px</span>
            </div>
            <h3 className="text-sm font-bold text-white">Terrain Mapping Camera-2</h3>
            <p className="text-xs text-white/70 font-sans leading-relaxed">
              Captures high-resolution panchromatic triplet stereo swaths (Fore, Nadir, Aft) yielding digital elevation models across extensive lunar regions.
            </p>
          </div>

          <div className="p-5 rounded-3xl bg-[#07111F]/90 border border-white/10 space-y-3">
            <div className="flex items-center justify-between">
              <span className="text-xs font-mono font-bold text-[#C89A45]">IIRS</span>
              <span className="text-[9px] font-mono text-white/50">256 Bands</span>
            </div>
            <h3 className="text-sm font-bold text-white">Imaging Infrared Spectrometer</h3>
            <p className="text-xs text-white/70 font-sans leading-relaxed">
              Operates across 0.8 to 5.0 µm spectral channels, mapping lunar mineralogy, hydroxyl absorption, and volatile signatures under deep shadows.
            </p>
          </div>
        </div>

        {/* Technical Invariance Principles */}
        <div className="p-6 rounded-3xl bg-[#07111F]/90 border border-white/10 space-y-4">
          <h3 className="text-sm font-mono font-bold text-white uppercase tracking-wider">
            TECHNICAL INVARIANCE MECHANISMS
          </h3>
          
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-xs font-mono">
            <div className="p-3.5 bg-[#050A12] rounded-2xl border border-white/5 space-y-1">
              <div className="text-[#C89A45] font-bold flex items-center gap-1.5">
                <Sun className="w-4 h-4" />
                <span>Sun-Angle Invariance (Phase Congruency)</span>
              </div>
              <p className="text-white/60 font-sans leading-relaxed text-[11px]">
                Extracts frequency-domain phase congruency features that remain strictly invariant under solar illumination elevation and azimuth shifts up to 60°.
              </p>
            </div>

            <div className="p-3.5 bg-[#050A12] rounded-2xl border border-white/5 space-y-1">
              <div className="text-white font-bold flex items-center gap-1.5">
                <Maximize2 className="w-4 h-4 text-[#D9DDE0]" />
                <span>Scale Invariance (Log-Polar Pyramids)</span>
              </div>
              <p className="text-white/60 font-sans leading-relaxed text-[11px]">
                Employs multi-scale octave Gaussian pyramids with log-polar local descriptors, establishing robust tie-points across 16.7× resolution divergence.
              </p>
            </div>
          </div>
        </div>

        {/* Launch Workbench CTA */}
        <div className="text-center pt-2">
          <Link
            href="/correspondence"
            className="inline-flex items-center gap-2 px-8 py-3.5 rounded-full bg-gradient-to-r from-[#2F80FF] to-[#00B8FF] text-white font-mono text-xs font-bold tracking-wider uppercase shadow-[0_0_25px_rgba(0,184,255,0.4)] hover:brightness-110 transition-all"
          >
            <span>Enter Image Correspondence Workbench</span>
            <ArrowRight className="w-4 h-4" />
          </Link>
        </div>
      </main>
    </div>
  );
}
