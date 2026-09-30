'use client';

import React from 'react';
import { spaceAudio } from '@/audio/spaceAudio';

interface HeroOverlayProps {
  opacity: number;
}

export const HeroOverlay: React.FC<HeroOverlayProps> = ({ opacity }) => {
  if (opacity <= 0.01) return null;

  return (
    <div
      style={{ opacity }}
      className="fixed inset-0 pointer-events-none z-30 flex flex-col justify-between p-6 sm:p-12 lg:p-16 transition-opacity duration-500"
    >
      {/* Top Center Brand Name (Exact match to EDOLUS screenshot header) */}
      <div className="w-full flex justify-center pt-2 sm:pt-4">
        <div className="text-white text-base sm:text-lg font-medium tracking-[0.38em] uppercase select-none">
          EDOLUS
        </div>
      </div>

      {/* Main Bottom-Left Hero Typography (Reference Screenshot Match) */}
      <div className="max-w-2xl pb-4 sm:pb-8 flex flex-col gap-3 sm:gap-4 select-none">
        {/* Massive Bold Headline */}
        <h1 className="text-5xl sm:text-7xl md:text-8xl font-black tracking-[-0.04em] text-white uppercase leading-[0.90]">
          ORBITAL<br />
          INTELLIGENCE
        </h1>

        {/* 2-line Subtext from Screenshot */}
        <p className="text-[10px] sm:text-xs text-white/60 tracking-[0.14em] font-mono uppercase max-w-xl leading-relaxed">
          AUTONOMOUS ORBITAL SYSTEMS CONTINUOUSLY COORDINATE, SYNCHRONIZE, AND RELAY INTELLIGENCE ACROSS THE PLANET IN REAL TIME.
        </p>

        {/* Micro Telemetry Tags */}
        <div className="flex items-center gap-4 pt-1 font-mono text-[9px] tracking-widest text-white/40">
          <span>LEO-SSO // 540.4 KM</span>
          <span className="text-white/20">|</span>
          <span>AUTONOMOUS INFERENCE CORE</span>
        </div>
      </div>

      {/* Scroll Prompt (Near satellite / lower right) */}
      <div className="absolute bottom-8 right-12 sm:right-24 flex items-center gap-2 text-white/50 hover:text-white transition-colors duration-300 pointer-events-auto">
        <a
          href="#observe"
          onClick={() => spaceAudio.playTelemetryClick()}
          className="flex items-center gap-2 group font-mono text-[10px] tracking-[0.25em] uppercase text-white/60 hover:text-white"
        >
          <span>SCROLL TO BEGIN</span>
          <span className="text-sky-400 group-hover:translate-y-0.5 transition-transform">↓</span>
        </a>
      </div>
    </div>
  );
};
