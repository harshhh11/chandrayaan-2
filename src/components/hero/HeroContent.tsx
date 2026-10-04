'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { ArrowRight, ChevronDown } from 'lucide-react';
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
      <div className="absolute top-20 sm:top-24 left-6 sm:left-12 lg:left-16 flex flex-col gap-1 font-tech text-[9px] sm:text-[10px] tracking-[0.2em] uppercase text-[#8D98A5]">
        <div className="flex items-center gap-2">
          <span className="w-1.5 h-1.5 rounded-full bg-[#32D39A]" />
          <span className="font-semibold text-[#F4F6F8]">SYSTEM ONLINE // NOMINAL</span>
        </div>
        <div className="text-[#59636E] pl-3.5 tracking-[0.16em] font-light text-[8px] sm:text-[9px]">
          {utcTime || '2026-09-30 11:42:17 UTC'}
        </div>
      </div>

      {/* ========================================================
          2. MAIN EDITORIAL TYPOGRAPHY & SUBTITLE (LOWER LEFT)
          ======================================================== */}
      <div
        style={{ transform: `translate3d(${textShiftX}px, ${textShiftY}px, 0)` }}
        className="absolute bottom-16 sm:bottom-20 left-6 sm:left-12 lg:left-16 max-w-2xl flex flex-col gap-4 sm:gap-5"
      >
        {/* Large Editorial Title */}
        <h1 className="text-[52px] sm:text-[72px] md:text-[88px] lg:text-[104px] font-display font-extrabold tracking-[-0.035em] text-[#F4F6F8] uppercase leading-[0.88]">
          ORBITAL<br />
          INTELLIGENCE
        </h1>

        {/* Subtitle */}
        <p className="text-xs sm:text-[13px] text-[#8D98A5] font-sans tracking-wide max-w-[520px] leading-relaxed uppercase">
          A REAL-TIME AUTONOMOUS PLATFORM FOR MONITORING, ANALYSIS, PREDICTION AND OPERATIONAL INTELLIGENCE.
        </p>

        {/* CTAs directly on Hero */}
        <div className="flex items-center gap-3 pt-1 pointer-events-auto">
          <Link
            href="/dashboard"
            onClick={() => spaceAudio.playTelemetryClick()}
            className="px-6 py-3 rounded-[8px] bg-white hover:bg-[#E2E8F0] text-black font-tech text-xs tracking-wider uppercase font-bold transition-colors flex items-center gap-2"
          >
            <span>ENTER PLATFORM</span>
            <ArrowRight className="w-3.5 h-3.5" />
          </Link>

          <a
            href="#system"
            onClick={() => spaceAudio.playTelemetryClick()}
            className="px-5 py-3 rounded-[8px] bg-white/[0.04] hover:bg-white/[0.08] border border-white/[0.08] text-[#F4F6F8] font-tech text-xs tracking-wider uppercase transition-colors flex items-center gap-2"
          >
            <span>EXPLORE SYSTEM</span>
            <ChevronDown className="w-3.5 h-3.5 text-[#8D98A5]" />
          </a>
        </div>

        {/* Micro Technical Metrics */}
        <div className="flex flex-wrap items-center gap-3 sm:gap-5 pt-2 font-tech text-[9px] sm:text-[10px] tracking-[0.16em] text-[#59636E] uppercase border-t border-white/[0.08]">
          <div>
            LATENCY // <span className="text-[#F4F6F8]">&lt;24MS</span>
          </div>
          <span className="text-white/10">|</span>
          <div>
            SYNC // <span className="text-[#F4F6F8]">REAL-TIME</span>
          </div>
          <span className="text-white/10">|</span>
          <div>
            MODEL // <span className="text-[#F4F6F8]">CHANDRAYAAN-2</span>
          </div>
          <span className="text-white/10">|</span>
          <div>
            STATUS // <span className="text-[#32D39A]">NOMINAL</span>
          </div>
        </div>
      </div>

      {/* ========================================================
          3. TECHNICAL AEROSPACE CALLOUTS (AROUND SATELLITE)
          ======================================================== */}
      <div
        style={{ transform: `translate3d(${labelShiftX}px, ${labelShiftY}px, 0)` }}
        className="absolute inset-0 pointer-events-none font-tech"
      >
        {/* Callout 1: AI INTELLIGENCE CORE */}
        <div className="absolute top-[40%] right-[10%] sm:right-[18%] hidden md:flex items-center gap-2.5 opacity-80">
          <div className="w-1.5 h-1.5 rounded-full border border-white/60" />
          <div className="h-[1px] w-10 bg-white/20" />
          <div className="flex flex-col text-left">
            <span className="text-[10px] sm:text-[11px] font-bold tracking-[0.2em] text-[#F4F6F8]">AI INTELLIGENCE CORE</span>
            <span className="text-[8px] sm:text-[9px] tracking-[0.14em] text-[#D9DDE0]">REAL-TIME INFERENCE</span>
          </div>
          <div className="h-[1px] w-6 bg-white/20" />
          <div className="w-1.5 h-1.5 rounded-full bg-white" />
        </div>

        {/* Callout 2: SOLAR ARRAY MATRIX */}
        <div className="absolute top-[26%] right-[30%] sm:right-[38%] hidden lg:flex items-center gap-2.5 opacity-75">
          <div className="flex flex-col text-right">
            <span className="text-[10px] font-bold tracking-[0.2em] text-[#F4F6F8]">SOLAR ARRAY MATRIX</span>
            <span className="text-[8px] tracking-[0.14em] text-[#8D98A5]">PHOTOVOLTAIC CELLS</span>
          </div>
          <div className="h-[1px] w-12 bg-white/20" />
          <div className="w-1.5 h-1.5 rounded-full bg-white/60" />
        </div>

        {/* Callout 3: ORBITAL TELEMETRY NODE */}
        <div className="absolute top-[64%] right-[22%] sm:right-[26%] hidden md:flex items-center gap-2.5 opacity-70">
          <div className="w-1.5 h-1.5 rounded-full bg-white" />
          <div className="h-[1px] w-8 bg-white/20" />
          <div className="flex flex-col text-left">
            <span className="text-[9px] font-bold tracking-[0.18em] text-[#F4F6F8]">ORBITAL TELEMETRY NODE</span>
            <span className="text-[8px] tracking-[0.14em] text-[#8D98A5]">LLO POLAR // 100.0 KM</span>
          </div>
        </div>
      </div>

      {/* ========================================================
          4. RIGHT SIDE TELEMETRY BLOCK
          ======================================================== */}
      <div className="absolute top-24 sm:top-28 right-6 sm:right-12 hidden sm:flex flex-col items-end gap-1 font-tech text-[9px] sm:text-[10px] tracking-[0.18em] text-[#59636E]">
        <div className="flex items-center gap-2">
          <span className="text-[#D9DDE0] font-bold text-xs">+</span>
          <div className="h-[1px] w-8 bg-white/10" />
          <span className="text-[#F4F6F8] tracking-[0.2em]">LLO / 100.0 KM</span>
        </div>
        <div className="text-[#8D98A5] tracking-[0.16em]">SYNC / 0.024 MS</div>
        <div className="text-[#32D39A] tracking-[0.16em]">VEL / 1.63 KM/S</div>
      </div>

      {/* ========================================================
          5. BOTTOM UI (LEFT METRICS & RIGHT SCROLL INDICATOR)
          ======================================================== */}
      <div className="absolute bottom-5 sm:bottom-6 right-6 sm:right-12 z-30 pointer-events-auto">
        <a
          href="#system"
          onClick={() => spaceAudio.playTelemetryClick()}
          className="flex items-center gap-2 font-tech text-[10px] tracking-[0.2em] uppercase text-[#8D98A5] hover:text-[#F4F6F8] transition-colors duration-200 group"
        >
          <span>SCROLL TO EXPLORE</span>
          <span className="text-[#D9DDE0] group-hover:translate-y-0.5 transition-transform">↓</span>
        </a>
      </div>
    </div>
  );
};
