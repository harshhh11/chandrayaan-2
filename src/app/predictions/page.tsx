'use client';

import React from 'react';
import Link from 'next/link';
import { Orbit, Sun, Calendar, Clock, MapPin, Eye, ArrowRight, CheckCircle2 } from 'lucide-react';
import { EdolusTopNav } from '@/components/layout/EdolusTopNav';

export default function PredictionsPage() {
  const predictionEvents = [
    {
      id: 'PRED-01',
      target: 'Boguslawsky E Crater',
      coords: '74.32° S, 53.64° E',
      pass_time: '2026-10-01T04:18:22 UTC',
      countdown: '09h 42m',
      solar_elevation: '32.1°',
      solar_azimuth: '74.5°',
      fov_overlap: '98.4%',
      sensor: 'OHRC (0.25 m/px)',
      status: 'OPTIMAL WINDOW'
    },
    {
      id: 'PRED-02',
      target: 'Shiv Shakti Point',
      coords: '69.37° S, 32.35° E',
      pass_time: '2026-10-01T06:10:45 UTC',
      countdown: '11h 34m',
      solar_elevation: '44.8°',
      solar_azimuth: '128.0°',
      fov_overlap: '95.1%',
      sensor: 'TMC-2 Triplet Stereo',
      status: 'SCHEDULED'
    },
    {
      id: 'PRED-03',
      target: 'Shackleton Rim',
      coords: '89.90° S, 0.00° E',
      pass_time: '2026-10-01T08:02:10 UTC',
      countdown: '13h 26m',
      solar_elevation: '11.4°',
      solar_azimuth: '205.2°',
      fov_overlap: '89.7%',
      sensor: 'IIRS Hyperspectral',
      status: 'LOW SUN ANGLE'
    }
  ];

  return (
    <div className="min-h-screen bg-[#050A12] text-white font-sans selection:bg-white/20 selection:text-white">
      <EdolusTopNav />

      <main className="pt-20 pb-12 px-4 sm:px-8 max-w-[1920px] mx-auto space-y-6">
        {/* Header */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-white/10 pb-4">
          <div>
            <div className="text-[10px] font-mono tracking-widest text-[#8D98A5] uppercase">
              CHANDRAYAAN-2 ORBITAL PROPAGATION & ACQUISITION PLANNING
            </div>
            <h1 className="text-2xl sm:text-3xl font-bold font-sans tracking-tight text-white mt-0.5">
              ORBITAL PREDICTIONS & SOLAR GEOMETRY
            </h1>
          </div>
        </div>

        {/* Prediction Cards Grid */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {predictionEvents.map(p => (
            <div key={p.id} className="p-6 rounded-3xl bg-[#07111F]/90 border border-white/10 space-y-4 hover:border-white/30 transition-all shadow-xl">
              <div className="flex items-center justify-between border-b border-white/5 pb-3">
                <span className="text-xs font-mono font-bold text-white">{p.target}</span>
                <span className="text-[10px] font-mono text-[#32D39A] bg-[#32D39A]/10 px-2 py-0.5 rounded border border-[#32D39A]/30">
                  {p.status}
                </span>
              </div>

              <div className="space-y-2 text-xs font-mono">
                <div className="flex items-center justify-between text-white/70">
                  <span>Coordinates:</span>
                  <span className="text-white font-bold">{p.coords}</span>
                </div>
                <div className="flex items-center justify-between text-white/70">
                  <span>Acquisition Pass:</span>
                  <span className="text-[#D9DDE0] font-bold">{p.countdown}</span>
                </div>
                <div className="flex items-center justify-between text-white/70">
                  <span>Predicted Solar Elev:</span>
                  <span className="text-[#C89A45] font-bold">{p.solar_elevation}</span>
                </div>
                <div className="flex items-center justify-between text-white/70">
                  <span>Payload Allocation:</span>
                  <span className="text-white font-bold">{p.sensor}</span>
                </div>
              </div>

              <Link
                href="/correspondence"
                className="w-full py-2.5 rounded-xl bg-white/5 hover:bg-white/15 text-white border border-white/10 hover:border-white/30 text-xs font-mono text-center tracking-wider block transition-all font-bold"
              >
                Simulate Target Match →
              </Link>
            </div>
          ))}
        </div>
      </main>
    </div>
  );
}
