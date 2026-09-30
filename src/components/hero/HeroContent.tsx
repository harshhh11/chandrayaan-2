'use client';

import React, { useState, useEffect } from 'react';
import { spaceAudio } from '@/audio/spaceAudio';

interface HeroContentProps {
  mouseX: number;
  mouseY: number;
}

export const HeroContent: React.FC<HeroContentProps> = ({ mouseX, mouseY }) => {
  const [utcTime, setUtcTime] = useState('');

  useEffect(() => {
    const updateTime = () => {
      const now = new Date();
      const iso = now.toISOString().replace('T', ' ').substring(0, 19) + ' UTC';
      setUtcTime(iso);
    };
    updateTime();
    const interval = setInterval(updateTime, 1000);
    return () => clearInterval(interval);
  }, []);

  // Micro parallax translation
  const textShiftX = mouseX * 1.5;
  const textShiftY = mouseY * 1.0;
  const labelShiftX = mouseX * 0.9;
  const labelShiftY = mouseY * 0.9;

  return (
    <div className="absolute inset-0 z-30 pointer-events-none select-none">
      {/* ========================================================
          1. LEFT STATUS BLOCK (BELOW NAVBAR)
          ======================================================== */}
      <div className="absolute top-24 sm:top-28 left-6 sm:left-12 lg:left-16 flex flex-col gap-1 font-mono text-[9px] sm:text-[10px] tracking-[0.24em] uppercase text-white/70">
        <div className="flex items-center gap-2">
          <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 shadow-[0_0_8px_#34d399] animate-pulse" />
          <span className="font-semibold text-white/90">SYSTEM ONLINE // NOMINAL</span>
        </div>
        <div className="text-white/45 pl-3.5 tracking-[0.2em] font-light text-[8px] sm:text-[9px]">
          {utcTime || '2026-09-30 11:42:17 UTC'}
        </div>
      </div>

      {/* ========================================================
          2. MAIN EDITORIAL TYPOGRAPHY & SUBTITLE (LOWER LEFT)
          ======================================================== */}
      <div
        style={{ transform: `translate3d(${textShiftX}px, ${textShiftY}px, 0)` }}
        className="absolute bottom-20 sm:bottom-24 left-6 sm:left-12 lg:left-16 max-w-2xl flex flex-col gap-5 sm:gap-6"
      >
        {/* Large Editorial Title */}
        <h1 className="text-[52px] sm:text-[72px] md:text-[88px] lg:text-[108px] font-black tracking-[-0.04em] text-[#F5F7FA] uppercase leading-[0.88]">
          ORBITAL<br />
          INTELLIGENCE
        </h1>

        {/* Subtitle */}
        <p className="text-xs sm:text-[13px] text-white/70 font-sans tracking-wide max-w-[520px] leading-relaxed uppercase">
          A REAL-TIME AUTONOMOUS PLATFORM FOR MONITORING, ANALYSIS, PREDICTION AND OPERATIONAL INTELLIGENCE.
        </p>

        {/* Micro Technical Metrics */}
        <div className="flex flex-wrap items-center gap-3 sm:gap-5 pt-1 font-mono text-[9px] sm:text-[10px] tracking-[0.2em] text-white/45 uppercase border-t border-white/10">
          <div>
            LATENCY // <span className="text-white/85">&lt;24MS</span>
          </div>
          <span className="text-white/20">|</span>
          <div>
            SYNC // <span className="text-white/85">REAL-TIME</span>
          </div>
          <span className="text-white/20">|</span>
          <div>
            MODEL // <span className="text-white/85">ORBITAL MESH</span>
          </div>
          <span className="text-white/20">|</span>
          <div>
            STATUS // <span className="text-emerald-400">NOMINAL</span>
          </div>
        </div>
      </div>

      {/* ========================================================
          3. TECHNICAL AEROSPACE CALLOUTS (AROUND SATELLITE)
          ======================================================== */}
      <div
        style={{ transform: `translate3d(${labelShiftX}px, ${labelShiftY}px, 0)` }}
        className="absolute inset-0 pointer-events-none font-mono"
      >
        {/* Callout 1: AI INTELLIGENCE CORE */}
        <div className="absolute top-[40%] right-[10%] sm:right-[18%] hidden md:flex items-center gap-2.5 opacity-80">
          <div className="w-1.5 h-1.5 rounded-full border border-white/60" />
          <div className="h-[1px] w-10 bg-white/30" />
          <div className="flex flex-col text-left">
            <span className="text-[10px] sm:text-[11px] font-bold tracking-[0.22em] text-white">AI INTELLIGENCE CORE</span>
            <span className="text-[8px] sm:text-[9px] tracking-[0.16em] text-[#00C8FF]">REAL-TIME INFERENCE</span>
          </div>
          <div className="h-[1px] w-6 bg-white/30" />
          <div className="w-1.5 h-1.5 rounded-full bg-[#00C8FF] shadow-[0_0_6px_#00C8FF]" />
        </div>

        {/* Callout 2: SOLAR ARRAY MATRIX */}
        <div className="absolute top-[26%] right-[30%] sm:right-[38%] hidden lg:flex items-center gap-2.5 opacity-75">
          <div className="flex flex-col text-right">
            <span className="text-[10px] font-bold tracking-[0.22em] text-white">SOLAR ARRAY MATRIX</span>
            <span className="text-[8px] tracking-[0.14em] text-white/50">PHOTOVOLTAIC CELLS</span>
          </div>
          <div className="h-[1px] w-12 bg-white/30" />
          <div className="w-1.5 h-1.5 rounded-full bg-white/80" />
        </div>

        {/* Callout 3: ORBITAL TELEMETRY NODE */}
        <div className="absolute top-[64%] right-[22%] sm:right-[26%] hidden md:flex items-center gap-2.5 opacity-70">
          <div className="w-1.5 h-1.5 rounded-full bg-[#00C8FF]/80" />
          <div className="h-[1px] w-8 bg-white/20" />
          <div className="flex flex-col text-left">
            <span className="text-[9px] font-bold tracking-[0.2em] text-white">ORBITAL TELEMETRY NODE</span>
            <span className="text-[8px] tracking-[0.14em] text-white/45">LEO MESH // 540.4 KM</span>
          </div>
        </div>
      </div>

      {/* ========================================================
          4. RIGHT SIDE TELEMETRY BLOCK
          ======================================================== */}
      <div className="absolute top-28 sm:top-32 right-6 sm:right-12 hidden sm:flex flex-col items-end gap-1 font-mono text-[9px] sm:text-[10px] tracking-[0.2em] text-white/50">
        <div className="flex items-center gap-2">
          <span className="text-[#00C8FF] font-bold text-xs">+</span>
          <div className="h-[1px] w-8 bg-white/20" />
          <span className="text-white/80 tracking-[0.22em]">LEO / 540.4 KM</span>
        </div>
        <div className="text-sky-300/80 tracking-[0.18em]">SYNC / 0.024 MS</div>
        <div className="text-emerald-400/80 tracking-[0.18em]">VEL / 7.66 KM/S</div>
      </div>

      {/* ========================================================
          5. BOTTOM UI (LEFT METRICS & RIGHT SCROLL INDICATOR)
          ======================================================== */}
      {/* Bottom Left */}
      <div className="absolute bottom-6 sm:bottom-8 left-6 sm:left-12 lg:left-16 flex items-center gap-4 font-mono text-[9px] sm:text-[10px] tracking-[0.22em] text-white/40 uppercase">
        <div>LATENCY // &lt;24MS</div>
        <span className="text-white/20">•</span>
        <div>GLOBAL COVERAGE // ACTIVE</div>
      </div>

      {/* Bottom Right */}
      <div className="absolute bottom-6 sm:bottom-8 right-6 sm:right-12 z-30 pointer-events-auto">
        <a
          href="#system"
          onClick={() => spaceAudio.playTelemetryClick()}
          className="flex items-center gap-2 font-mono text-[10px] tracking-[0.25em] uppercase text-white/50 hover:text-white transition-colors duration-300 group"
        >
          <span>SCROLL TO EXPLORE</span>
          <span className="text-[#00C8FF] group-hover:translate-y-0.5 transition-transform">↓</span>
        </a>
      </div>
    </div>
  );
};
