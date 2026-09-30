'use client';

import React from 'react';
import { WorkstationHeader } from '@/components/layout/WorkstationHeader';
import { LunarMapCanvas } from '@/components/visualization/LunarMapCanvas';

export default function LunarSpatialMapPage() {
  return (
    <main className="min-h-screen bg-[#05070a] text-white select-none">
      <WorkstationHeader />

      <div className="max-w-7xl mx-auto px-4 sm:px-8 py-10 flex flex-col gap-8 font-mono">
        <div className="flex flex-col gap-1 pb-6 border-b border-white/10">
          <span className="text-xs text-[#00C8FF] tracking-[0.25em] uppercase font-bold">
            LUNAR SPATIAL CONTEXT // CHANDRAYAAN-2 OBSERVATION SWATHS
          </span>
          <h1 className="text-2xl sm:text-3xl font-black uppercase text-white tracking-tight">
            ORBITAL LOCALIZATION & FOOTPRINT OVERLAP
          </h1>
        </div>

        <LunarMapCanvas />
      </div>
    </main>
  );
}
