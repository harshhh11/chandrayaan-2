'use client';

import React from 'react';
import Link from 'next/link';
import { spaceAudio } from '@/audio/spaceAudio';

export const PlatformEntrySection: React.FC = () => {
  return (
    <section id="platform" className="relative w-full py-32 bg-[#05070a] text-white px-6 sm:px-12 lg:px-20 flex flex-col items-center justify-center text-center border-t border-white/[0.06] select-none">
      {/* Background soft glow */}
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[500px] h-[500px] bg-sky-500/5 rounded-full blur-[140px] pointer-events-none" />

      <div className="max-w-3xl flex flex-col items-center gap-8 relative z-10">
        <div className="flex items-center gap-2 font-mono text-[10px] sm:text-[11px] tracking-[0.3em] uppercase text-sky-400">
          <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse shadow-[0_0_8px_#4ade80]" />
          <span>03 // PLATFORM ACCESS</span>
        </div>

        <h2 className="text-4xl sm:text-6xl md:text-7xl font-black tracking-[-0.035em] text-white uppercase leading-[0.92]">
          ENTER THE<br />
          PLATFORM.
        </h2>

        <p className="text-sm sm:text-base text-white/60 font-sans font-light max-w-lg leading-relaxed">
          Access the live operational telemetry stream, predictive forecasting models, and interactive orbital workspace.
        </p>

        {/* Minimal Understated Platform Entry Button */}
        <div className="pt-4">
          <Link
            href="/dashboard"
            onClick={() => spaceAudio.playTelemetryClick()}
            className="inline-flex items-center gap-3 px-8 py-4 rounded-full border border-[#4DEBFF]/30 bg-[#00C8FF]/10 hover:bg-[#00C8FF]/20 hover:border-sky-400 hover:shadow-[0_0_30px_rgba(56,189,248,0.3)] text-white text-xs sm:text-sm font-mono tracking-[0.25em] uppercase font-medium transition-all duration-300 group cursor-pointer"
          >
            <span>ENTER MISSION CONSOLE</span>
            <span className="text-sky-400 group-hover:translate-x-1 transition-transform">→</span>
          </Link>
        </div>
      </div>

      {/* Footer copyright */}
      <div id="analytics" className="w-full flex flex-col sm:flex-row items-center justify-between gap-4 font-mono text-[9px] sm:text-[10px] tracking-widest text-white/35 pt-24 mt-12 border-t border-white/5">
        <div>ORBITAL INTELLIGENCE // SYSTEM PLATFORM</div>
        <div>ALL RIGHTS RESERVED © 2026</div>
      </div>
    </section>
  );
};
