'use client';

import React from 'react';

export const TheSystemSection: React.FC = () => {
  return (
    <section id="system" className="relative w-full min-h-screen bg-[#05070a] text-white px-6 sm:px-12 lg:px-20 py-28 flex flex-col justify-between border-t border-white/[0.06] select-none">
      {/* Background ambient lighting */}
      <div className="absolute top-12 right-12 w-96 h-96 bg-sky-500/5 rounded-full blur-[120px] pointer-events-none" />

      {/* Top Section Label */}
      <div className="flex items-center gap-2 font-mono text-[11px] tracking-[0.3em] uppercase text-sky-400">
        <span className="w-1.5 h-1.5 rounded-full bg-sky-400 shadow-[0_0_6px_#38bdf8]" />
        <span>01 // DIGITAL INFRASTRUCTURE</span>
      </div>

      {/* Main Editorial Block */}
      <div className="max-w-4xl flex flex-col gap-8 my-16">
        <h2 className="text-4xl sm:text-6xl md:text-7xl lg:text-8xl font-black tracking-[-0.035em] text-white uppercase leading-[0.92]">
          A LIVING MODEL<br />
          OF THE SYSTEM.
        </h2>

        <p className="text-sm sm:text-base md:text-lg text-white/70 font-sans font-light max-w-2xl leading-relaxed">
          The system continuously ingests telemetry, environmental feeds, and topological states to maintain a synchronized, high-fidelity operational model of complex distributed infrastructure in real time.
        </p>

        {/* Minimal Editorial Specs Grid */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 pt-10 border-t border-white/10 font-mono text-xs">
          <div className="flex flex-col gap-2">
            <span className="text-[10px] tracking-widest text-sky-400">01.01 // SYNCHRONIZATION</span>
            <div className="text-white text-sm font-semibold uppercase">Continuous Ingestion</div>
            <p className="text-white/50 text-[11px] leading-relaxed">Sub-second state synchronization across multi-layer physical and orbital nodes.</p>
          </div>

          <div className="flex flex-col gap-2">
            <span className="text-[10px] tracking-widest text-sky-400">01.02 // TOPOLOGY</span>
            <div className="text-white text-sm font-semibold uppercase">Dynamic Graph Modeling</div>
            <p className="text-white/50 text-[11px] leading-relaxed">Real-time dependency graphs mapping cascading impacts and critical path resilience.</p>
          </div>

          <div className="flex flex-col gap-2">
            <span className="text-[10px] tracking-widest text-sky-400">01.03 // ACCURACY</span>
            <div className="text-white text-sm font-semibold uppercase">Microsecond Precision</div>
            <p className="text-white/50 text-[11px] leading-relaxed">Deterministic digital representation with verified zero-drift telemetry guarantees.</p>
          </div>
        </div>
      </div>

      {/* Section Footer Metadata */}
      <div className="flex items-center justify-between text-[10px] font-mono tracking-widest text-white/40 pt-6 border-t border-white/5">
        <div>DIGITAL INFRASTRUCTURE ENGINE</div>
        <div>REAL-TIME ORBITAL MESH v2.4</div>
      </div>
    </section>
  );
};
