'use client';

import React, { useState, useEffect } from 'react';

interface TelemetryHUDProps {
  scrollProgress: number;
}

export const TelemetryHUD: React.FC<TelemetryHUDProps> = ({ scrollProgress }) => {
  const [metrics, setMetrics] = useState({
    alt: 540.4,
    vel: 7.668,
    sync: '0.024 MS',
    utc: '',
  });

  useEffect(() => {
    const update = () => {
      const now = new Date();
      setMetrics({
        alt: +(540.4 + Math.sin(Date.now() * 0.001) * 2.1).toFixed(1),
        vel: +(7.668 + Math.cos(Date.now() * 0.001) * 0.008).toFixed(3),
        sync: '0.024 MS',
        utc: now.toISOString().replace('T', ' ').slice(0, 19) + ' UTC',
      });
    };
    update();
    const interval = setInterval(update, 1000);
    return () => clearInterval(interval);
  }, []);

  // Show the AI CHIP targeting callout prominently when approaching or scrolling into the sensor phase (progress 0.15 - 0.55)
  const isNearChipPhase = scrollProgress > 0.15 && scrollProgress < 0.6;

  return (
    <div className="fixed inset-0 pointer-events-none z-20 select-none overflow-hidden text-white font-mono text-[10px]">
      {/* 1. AI CHIP / AUTONOMOUS INFERENCE CORE Overlay (Exact match to Screenshot 1) */}
      <div
        className={`absolute top-[42%] right-[12%] sm:right-[18%] flex items-center gap-4 transition-all duration-700 ${
          isNearChipPhase ? 'opacity-90 translate-x-0' : 'opacity-35 translate-x-2'
        }`}
      >
        {/* Targeting Circle Reticle */}
        <div className="relative w-8 h-8 flex items-center justify-center">
          <div className="w-7 h-7 border border-white/50 rounded-full" />
          <div className="w-2 h-2 bg-sky-400 rounded-full shadow-[0_0_8px_#38bdf8]" />
          <div className="absolute inset-0 border border-sky-400/40 rounded-full animate-ping opacity-25" />
        </div>

        {/* Thin Connecting Leader Line */}
        <div className="h-[1px] w-12 bg-white/40" />

        {/* Technical Callout Text */}
        <div className="flex flex-col gap-0.5">
          <div className="text-xs sm:text-sm font-bold tracking-[0.25em] text-white">
            AI CHIP
          </div>
          <div className="text-[9px] tracking-[0.18em] text-white/60">
            AUTONOMOUS INFERENCE CORE
          </div>
        </div>
      </div>

      {/* 2. Top-Left System Status */}
      <div className="absolute top-6 left-6 sm:left-12 flex flex-col gap-1 opacity-60">
        <div className="flex items-center gap-2">
          <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse shadow-[0_0_6px_#4ade80]" />
          <span className="tracking-[0.25em] text-[10px] text-white/90">
            SYSTEM ONLINE // NOMINAL
          </span>
        </div>
        <div className="text-[9px] tracking-widest text-white/40">{metrics.utc}</div>
      </div>

      {/* 3. Top-Right Telemetry Node Links */}
      <div className="absolute top-6 right-6 sm:right-12 hidden md:flex flex-col items-end gap-1 opacity-60">
        <div className="flex items-center gap-3">
          <span className="text-sky-400 font-bold">+</span>
          <div className="h-[1px] w-10 bg-white/20" />
          <span className="tracking-[0.28em] text-[10px] text-white/80">LEO CONSTELLATION</span>
        </div>
        <div className="text-[9px] tracking-widest text-sky-300/80">SYNC: {metrics.sync}</div>
      </div>

      {/* 4. Bottom-Left Orbit Telemetry Metrics */}
      <div className="absolute bottom-6 left-6 sm:left-12 hidden lg:flex items-center gap-4 opacity-50 text-[10px] tracking-widest">
        <span>ALT: <span className="text-sky-300">{metrics.alt} KM</span></span>
        <span className="text-white/20">|</span>
        <span>VEL: <span className="text-sky-300">{metrics.vel} KM/S</span></span>
        <span className="text-white/20">|</span>
        <span>ISL: <span className="text-emerald-300">100 GBPS</span></span>
      </div>

      {/* 5. Minimal Corner Framing Brackets */}
      <div className="absolute top-4 left-4 w-2.5 h-2.5 border-t border-l border-white/20" />
      <div className="absolute top-4 right-4 w-2.5 h-2.5 border-t border-r border-white/20" />
      <div className="absolute bottom-4 left-4 w-2.5 h-2.5 border-b border-l border-white/20" />
      <div className="absolute bottom-4 right-4 w-2.5 h-2.5 border-b border-r border-white/20" />
    </div>
  );
};
