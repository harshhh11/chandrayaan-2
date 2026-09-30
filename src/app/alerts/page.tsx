'use client';

import React from 'react';
import Link from 'next/link';
import { ShieldAlert, AlertTriangle, CheckCircle2, AlertCircle, Radio, ArrowRight } from 'lucide-react';
import { EdolusTopNav } from '@/components/layout/EdolusTopNav';

export default function AlertsPage() {
  const alertsList = [
    {
      id: 'ALT-101',
      severity: 'WARNING',
      title: 'High Sun-Angle Azimuth Divergence (Δ83.5°)',
      desc: 'Pair REG-20260930-002 exhibits high solar azimuth discrepancy. Phase congruency normalization has been automatically applied to maintain tie-point accuracy.',
      target: 'Boguslawsky E Crater',
      action: 'Open Correspondence Workbench',
      link: '/correspondence'
    },
    {
      id: 'ALT-102',
      severity: 'INFO',
      title: 'Ground Station Signal Acquisition (AOS)',
      desc: 'ISTRAC IDSN 32m deep-space antenna (Byalalu) establishes X-band telemetry lock with Chandrayaan-2 orbiter.',
      target: '100 km Polar Orbit',
      action: 'View Mission Status',
      link: '/mission'
    },
    {
      id: 'ALT-103',
      severity: 'SUCCESS',
      title: 'Sub-Pixel Registration Verification Passed',
      desc: 'Homography refinement verified with 0.42 px median reprojection error on 1,284 keypoint correspondences.',
      target: 'OHRC ↔ TMC-2 Benchmarks',
      action: 'View Scientific Report',
      link: '/reports'
    }
  ];

  return (
    <div className="min-h-screen bg-[#050A12] text-white font-sans selection:bg-[#4DEBFF] selection:text-black">
      <EdolusTopNav />

      <main className="pt-20 pb-12 px-4 sm:px-8 max-w-[1920px] mx-auto space-y-6">
        {/* Header */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-white/10 pb-4">
          <div>
            <div className="text-[10px] font-mono tracking-widest text-[#4DEBFF] uppercase">
              MISSION AUDIT LOG & CONJUNCTION MONITORING
            </div>
            <h1 className="text-2xl sm:text-3xl font-bold font-sans tracking-tight text-white mt-0.5">
              TELEMETRY & CORRESPONDENCE ALERTS
            </h1>
          </div>
        </div>

        {/* Alerts List */}
        <div className="space-y-4 max-w-4xl">
          {alertsList.map(a => (
            <div key={a.id} className="p-5 rounded-3xl bg-[#07111F]/90 border border-white/10 hover:border-[#4DEBFF]/30 transition-all flex flex-col sm:flex-row sm:items-center justify-between gap-4">
              <div className="flex items-start gap-3.5">
                <div className="mt-0.5">
                  {a.severity === 'WARNING' && <AlertTriangle className="w-5 h-5 text-[#FFB547]" />}
                  {a.severity === 'INFO' && <Radio className="w-5 h-5 text-[#4DEBFF]" />}
                  {a.severity === 'SUCCESS' && <CheckCircle2 className="w-5 h-5 text-[#24D99B]" />}
                </div>
                <div className="space-y-1">
                  <div className="flex items-center gap-2">
                    <span className="text-sm font-mono font-bold text-white">{a.title}</span>
                    <span className="text-[9px] font-mono px-1.5 py-0.5 rounded bg-white/10 text-white/70">
                      {a.target}
                    </span>
                  </div>
                  <p className="text-xs text-white/70 font-sans leading-relaxed max-w-xl">
                    {a.desc}
                  </p>
                </div>
              </div>

              <Link
                href={a.link}
                className="px-4 py-2 rounded-xl bg-white/5 hover:bg-[#2F80FF]/20 text-[#4DEBFF] border border-white/10 text-xs font-mono whitespace-nowrap transition-colors flex items-center gap-1.5 self-start sm:self-auto"
              >
                <span>{a.action}</span>
                <ArrowRight className="w-3.5 h-3.5" />
              </Link>
            </div>
          ))}
        </div>
      </main>
    </div>
  );
}
