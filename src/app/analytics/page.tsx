'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { 
  Activity, TrendingUp, Cpu, Sun, Maximize2, ShieldCheck, 
  BarChart3, FileText, ChevronRight, CheckCircle2, ArrowRight, Database,
  PieChart, ScatterChart, Layers, RefreshCw
} from 'lucide-react';
import { EdolusShell } from '@/components/layout/EdolusShell';

interface AnalyticsData {
  images_indexed: number;
  ohrc_count: number;
  tmc_count: number;
  iirs_count: number;
  matches_processed: number;
  total_analyses: number;
  successful_analyses: number;
  low_confidence_analyses: number;
  failed_analyses: number;
  avg_confidence: number;
  avg_inlier_ratio: number;
  avg_registration_error: number;
  avg_inliers: number;
  active_analyses: number;
  payload_distribution?: { name: string; count: number; color: string }[];
  resolution_distribution?: { tier: string; count: number }[];
  confidence_distribution?: { range: string; count: number }[];
  scale_vs_confidence?: { scale_ratio: number; confidence: number; inliers: number; pair: string }[];
  sun_delta_vs_confidence?: { sun_angle_delta: number; confidence: number; error_px: number; pair: string }[];
  analysis_timeline?: { id: string; date: string; pair: string; confidence: number; inliers: number; rmse: number; status: string }[];
  cross_modal_benchmarks?: {
    pair: string;
    modality: string;
    inlier_ratio: number;
    median_error_px: number;
    confidence: number;
    samples: number;
  }[];
  sun_angle_performance?: {
    delta_deg: string;
    inlier_pct: number;
    confidence: number;
    error_px: number;
    samples: number;
  }[];
  database_engine?: string;
}

export default function AnalyticsPage() {
  const [data, setData] = useState<AnalyticsData>({
    images_indexed: 0,
    ohrc_count: 0,
    tmc_count: 0,
    iirs_count: 0,
    matches_processed: 0,
    total_analyses: 0,
    successful_analyses: 0,
    low_confidence_analyses: 0,
    failed_analyses: 0,
    avg_confidence: 0,
    avg_inlier_ratio: 0,
    avg_registration_error: 0,
    avg_inliers: 0,
    active_analyses: 0,
    payload_distribution: [],
    resolution_distribution: [],
    confidence_distribution: [],
    scale_vs_confidence: [],
    sun_delta_vs_confidence: [],
    analysis_timeline: [],
    cross_modal_benchmarks: [],
    sun_angle_performance: []
  });

  const [loading, setLoading] = useState(true);

  const fetchAnalytics = () => {
    setLoading(true);
    const apiBase = process.env.NEXT_PUBLIC_API_URL || 'http://127.0.0.1:8000';
    fetch(`${apiBase}/api/analytics/overview`)
      .then(res => res.ok ? res.json() : null)
      .then(d => {
        if (d) setData(d);
      })
      .catch(() => {})
      .finally(() => setLoading(false));
  };

  useEffect(() => {
    fetchAnalytics();
  }, []);

  // Compute donut circumference values
  const totalPayloadCount = (data.payload_distribution || []).reduce((acc, curr) => acc + curr.count, 0) || 1;
  let accumulatedAngle = 0;

  return (
    <EdolusShell>
      <div className="space-y-6">
        
        {/* Header */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-white/[0.08] pb-5">
          <div>
            <div className="flex items-center gap-2 text-[10px] font-tech tracking-[0.18em] text-[#38A8FF] uppercase font-medium">
              <Activity className="w-3.5 h-3.5" />
              <span>CHANDRAYAAN-2 DATABASE-DERIVED BENCHMARKS & TELEMETRY</span>
            </div>
            <h1 className="text-2xl sm:text-3xl font-display font-bold tracking-tight text-[#F4F6F8] mt-1">
              MISSION ANALYTICS & BENCHMARK SUITE
            </h1>
          </div>

          <div className="flex items-center gap-3">
            <button
              onClick={fetchAnalytics}
              className="px-3 py-2 rounded-lg bg-white/5 hover:bg-white/10 text-white/70 hover:text-white text-xs font-mono flex items-center gap-1.5 transition-colors"
            >
              <RefreshCw className={`w-3.5 h-3.5 text-[#38A8FF] ${loading ? 'animate-spin' : ''}`} />
              <span>Refresh DB Metrics</span>
            </button>
            <Link
              href="/reports"
              className="px-4 py-2 rounded-lg bg-[#38A8FF] hover:bg-[#2094EC] text-white font-sans text-xs font-medium tracking-wide transition-colors shadow-[0_0_15px_rgba(56,168,255,0.25)] flex items-center gap-2"
            >
              <FileText className="w-3.5 h-3.5" />
              <span>Scientific Report</span>
            </Link>
          </div>
        </div>

        {/* 1. Core Summary Telemetry Cards */}
        <div className="grid grid-cols-2 sm:grid-cols-4 lg:grid-cols-7 gap-3">
          <div className="p-3.5 rounded-2xl bg-[#07111F]/90 border border-white/10">
            <span className="text-white/40 block text-[9px] font-mono uppercase">Total Analyzed</span>
            <span className="text-xl font-mono font-bold text-white mt-0.5 block">
              {data.total_analyses.toLocaleString()}
            </span>
          </div>

          <div className="p-3.5 rounded-2xl bg-[#07111F]/90 border border-white/10">
            <span className="text-white/40 block text-[9px] font-mono uppercase">Successful</span>
            <span className="text-xl font-mono font-bold text-[#24D99B] mt-0.5 block">
              {data.successful_analyses.toLocaleString()}
            </span>
          </div>

          <div className="p-3.5 rounded-2xl bg-[#07111F]/90 border border-white/10">
            <span className="text-white/40 block text-[9px] font-mono uppercase">Low Conf / Insuff</span>
            <span className="text-xl font-mono font-bold text-[#FFB547] mt-0.5 block">
              {data.low_confidence_analyses.toLocaleString()}
            </span>
          </div>

          <div className="p-3.5 rounded-2xl bg-[#07111F]/90 border border-white/10">
            <span className="text-white/40 block text-[9px] font-mono uppercase">Avg Confidence</span>
            <span className="text-xl font-mono font-bold text-[#4DEBFF] mt-0.5 block">
              {data.avg_confidence}%
            </span>
          </div>

          <div className="p-3.5 rounded-2xl bg-[#07111F]/90 border border-white/10">
            <span className="text-white/40 block text-[9px] font-mono uppercase">Avg Inlier Ratio</span>
            <span className="text-xl font-mono font-bold text-[#24D99B] mt-0.5 block">
              {data.avg_inlier_ratio}%
            </span>
          </div>

          <div className="p-3.5 rounded-2xl bg-[#07111F]/90 border border-white/10">
            <span className="text-white/40 block text-[9px] font-mono uppercase">Avg RMSE Error</span>
            <span className="text-xl font-mono font-bold text-[#38A8FF] mt-0.5 block">
              {data.avg_registration_error} px
            </span>
          </div>

          <div className="p-3.5 rounded-2xl bg-[#07111F]/90 border border-white/10">
            <span className="text-white/40 block text-[9px] font-mono uppercase">Images Indexed</span>
            <span className="text-xl font-mono font-bold text-white mt-0.5 block">
              {data.images_indexed.toLocaleString()}
            </span>
          </div>
        </div>

        {/* 2. Charts Row: Line Chart (History Timeline) & Donut Chart (Payload Distribution) */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          
          {/* LINE CHART: Analysis History Over Time */}
          <div className="lg:col-span-2 rounded-2xl bg-[#071019]/90 border border-white/[0.08] p-5 space-y-4 shadow-xl">
            <div className="flex items-center justify-between border-b border-white/[0.06] pb-3">
              <div className="flex items-center gap-2">
                <TrendingUp className="w-4 h-4 text-[#4DEBFF]" />
                <h3 className="text-xs font-tech font-semibold tracking-[0.14em] uppercase text-[#F4F6F8]">
                  CORRESPONDENCE CONFIDENCE TIMELINE // TEMPORAL RUNS
                </h3>
              </div>
              <span className="text-[10px] font-tech text-[#8D98A5]">
                {data.analysis_timeline?.length || 0} Chronological Runs
              </span>
            </div>

            <div className="h-56 relative w-full pt-4">
              {data.analysis_timeline && data.analysis_timeline.length > 0 ? (
                <svg className="w-full h-full overflow-visible" viewBox="0 0 600 160" preserveAspectRatio="none">
                  {/* Grid Lines */}
                  <line x1="0" y1="0" x2="600" y2="0" stroke="rgba(255,255,255,0.05)" strokeDasharray="3 3" />
                  <line x1="0" y1="40" x2="600" y2="40" stroke="rgba(255,255,255,0.05)" strokeDasharray="3 3" />
                  <line x1="0" y1="80" x2="600" y2="80" stroke="rgba(255,255,255,0.05)" strokeDasharray="3 3" />
                  <line x1="0" y1="120" x2="600" y2="120" stroke="rgba(255,255,255,0.05)" strokeDasharray="3 3" />
                  <line x1="0" y1="160" x2="600" y2="160" stroke="rgba(255,255,255,0.1)" />

                  {/* Area fill */}
                  <path
                    d={`M 0,160 ${data.analysis_timeline.map((item, idx) => {
                      const x = (idx / Math.max(1, data.analysis_timeline!.length - 1)) * 600;
                      const y = 160 - (item.confidence / 100.0) * 150;
                      return `L ${x},${y}`;
                    }).join(' ')} L 600,160 Z`}
                    fill="url(#timelineGradient)"
                    opacity="0.25"
                  />

                  {/* Confidence Line */}
                  <path
                    d={data.analysis_timeline.map((item, idx) => {
                      const x = (idx / Math.max(1, data.analysis_timeline!.length - 1)) * 600;
                      const y = 160 - (item.confidence / 100.0) * 150;
                      return `${idx === 0 ? 'M' : 'L'} ${x},${y}`;
                    }).join(' ')}
                    fill="none"
                    stroke="#4DEBFF"
                    strokeWidth="2.5"
                  />

                  {/* Points */}
                  {data.analysis_timeline.map((item, idx) => {
                    const x = (idx / Math.max(1, data.analysis_timeline!.length - 1)) * 600;
                    const y = 160 - (item.confidence / 100.0) * 150;
                    const isSucc = item.status === 'COMPLETED';
                    return (
                      <g key={idx}>
                        <circle
                          cx={x}
                          cy={y}
                          r="4"
                          fill={isSucc ? '#24D99B' : '#FFB547'}
                          stroke="#071019"
                          strokeWidth="1.5"
                        />
                      </g>
                    );
                  })}

                  <defs>
                    <linearGradient id="timelineGradient" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="0%" stopColor="#4DEBFF" stopOpacity="0.8" />
                      <stop offset="100%" stopColor="#4DEBFF" stopOpacity="0.0" />
                    </linearGradient>
                  </defs>
                </svg>
              ) : (
                <div className="flex items-center justify-center h-full text-white/40 text-xs font-mono">
                  No chronological correspondence history recorded yet.
                </div>
              )}
            </div>

            <div className="flex items-center justify-between text-[10px] font-mono text-white/50 pt-2">
              <span className="flex items-center gap-1.5"><span className="w-2 h-2 rounded-full bg-[#24D99B]" /> Completed Run (Verified Inliers)</span>
              <span className="flex items-center gap-1.5"><span className="w-2 h-2 rounded-full bg-[#FFB547]" /> Insufficient Correspondence</span>
              <span>100% Confidence Ceiling</span>
            </div>
          </div>

          {/* DONUT / PIE CHART: Payload Distribution */}
          <div className="rounded-2xl bg-[#071019]/90 border border-white/[0.08] p-5 space-y-4 shadow-xl">
            <div className="flex items-center justify-between border-b border-white/[0.06] pb-3">
              <div className="flex items-center gap-2">
                <PieChart className="w-4 h-4 text-[#38A8FF]" />
                <h3 className="text-xs font-tech font-semibold tracking-[0.14em] uppercase text-[#F4F6F8]">
                  PAYLOAD SENSOR RATIO
                </h3>
              </div>
            </div>

            <div className="flex items-center justify-center h-44 relative">
              <svg className="w-40 h-40 -rotate-90" viewBox="0 0 100 100">
                {data.payload_distribution && data.payload_distribution.map((p, idx) => {
                  const pct = p.count / totalPayloadCount;
                  const strokeDash = pct * 283; // 2 * pi * r (r=45)
                  const strokeOffset = -accumulatedAngle * 283;
                  accumulatedAngle += pct;
                  return (
                    <circle
                      key={idx}
                      cx="50"
                      cy="50"
                      r="40"
                      fill="transparent"
                      stroke={p.color}
                      strokeWidth="12"
                      strokeDasharray={`${strokeDash} 283`}
                      strokeDashoffset={strokeOffset}
                      className="transition-all duration-500"
                    />
                  );
                })}
              </svg>
              <div className="absolute inset-0 flex flex-col items-center justify-center pointer-events-none">
                <span className="text-xl font-mono font-bold text-white">{data.images_indexed}</span>
                <span className="text-[9px] font-mono text-white/50 uppercase">Images</span>
              </div>
            </div>

            <div className="space-y-2 pt-1 font-mono text-xs">
              {data.payload_distribution && data.payload_distribution.map((p, idx) => (
                <div key={idx} className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <span className="w-2.5 h-2.5 rounded-full" style={{ backgroundColor: p.color }} />
                    <span className="text-white/80">{p.name}</span>
                  </div>
                  <span className="font-bold text-white">
                    {p.count} ({Math.round((p.count / totalPayloadCount) * 100)}%)
                  </span>
                </div>
              ))}
            </div>
          </div>

        </div>

        {/* 3. SCATTER PLOTS ROW: Scale Ratio vs Confidence & Illumination Delta vs Confidence */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          
          {/* SCATTER PLOT 1: Scale Difference vs Confidence */}
          <div className="rounded-2xl bg-[#071019]/90 border border-white/[0.08] p-5 space-y-4 shadow-xl">
            <div className="flex items-center justify-between border-b border-white/[0.06] pb-3">
              <div className="flex items-center gap-2">
                <Maximize2 className="w-4 h-4 text-[#4DEBFF]" />
                <h3 className="text-xs font-tech font-semibold tracking-[0.14em] uppercase text-[#F4F6F8]">
                  SCALE DIFFERENCE (GSD RATIO) VS MATCH CONFIDENCE
                </h3>
              </div>
            </div>

            <div className="h-52 relative w-full pt-4">
              <svg className="w-full h-full overflow-visible" viewBox="0 0 500 150">
                {/* Axis lines */}
                <line x1="30" y1="130" x2="480" y2="130" stroke="rgba(255,255,255,0.15)" strokeWidth="1" />
                <line x1="30" y1="10" x2="30" y2="130" stroke="rgba(255,255,255,0.15)" strokeWidth="1" />

                {/* Grid */}
                <line x1="30" y1="70" x2="480" y2="70" stroke="rgba(255,255,255,0.05)" strokeDasharray="3 3" />
                <line x1="255" y1="10" x2="255" y2="130" stroke="rgba(255,255,255,0.05)" strokeDasharray="3 3" />

                {/* Scatter Points */}
                {data.scale_vs_confidence && data.scale_vs_confidence.map((pt, idx) => {
                  const cx = 30 + Math.min(1.0, pt.scale_ratio / 25.0) * 440;
                  const cy = 130 - (pt.confidence / 100.0) * 115;
                  return (
                    <circle
                      key={idx}
                      cx={cx}
                      cy={cy}
                      r="4.5"
                      fill="#4DEBFF"
                      stroke="#071019"
                      strokeWidth="1.5"
                      className="hover:scale-150 transition-transform cursor-pointer"
                    >
                      <title>{`${pt.pair}: ${pt.scale_ratio}x scale -> ${pt.confidence}% conf`}</title>
                    </circle>
                  );
                })}

                {/* Labels */}
                <text x="35" y="145" fill="rgba(255,255,255,0.4)" fontSize="9" fontFamily="monospace">1.0x (Mono)</text>
                <text x="240" y="145" fill="rgba(255,255,255,0.4)" fontSize="9" fontFamily="monospace">12x</text>
                <text x="440" y="145" fill="rgba(255,255,255,0.4)" fontSize="9" fontFamily="monospace">25x+ (OHRC↔TMC)</text>
                <text x="5" y="15" fill="rgba(255,255,255,0.4)" fontSize="9" fontFamily="monospace">100%</text>
                <text x="12" y="130" fill="rgba(255,255,255,0.4)" fontSize="9" fontFamily="monospace">0%</text>
              </svg>
            </div>
            <div className="text-[10px] font-mono text-white/50 text-center">
              Evaluates multi-scale pyramid invariance across 0.25 m/px, 5.0 m/px, and 80.0 m/px imagery
            </div>
          </div>

          {/* SCATTER PLOT 2: Sun-Angle Illumination Delta vs Confidence */}
          <div className="rounded-2xl bg-[#071019]/90 border border-white/[0.08] p-5 space-y-4 shadow-xl">
            <div className="flex items-center justify-between border-b border-white/[0.06] pb-3">
              <div className="flex items-center gap-2">
                <Sun className="w-4 h-4 text-[#FFB547]" />
                <h3 className="text-xs font-tech font-semibold tracking-[0.14em] uppercase text-[#F4F6F8]">
                  SUN-ANGLE DIFFERENCE (Δ DEG) VS MATCH CONFIDENCE
                </h3>
              </div>
            </div>

            <div className="h-52 relative w-full pt-4">
              <svg className="w-full h-full overflow-visible" viewBox="0 0 500 150">
                {/* Axis lines */}
                <line x1="30" y1="130" x2="480" y2="130" stroke="rgba(255,255,255,0.15)" strokeWidth="1" />
                <line x1="30" y1="10" x2="30" y2="130" stroke="rgba(255,255,255,0.15)" strokeWidth="1" />

                {/* Grid */}
                <line x1="30" y1="70" x2="480" y2="70" stroke="rgba(255,255,255,0.05)" strokeDasharray="3 3" />
                <line x1="255" y1="10" x2="255" y2="130" stroke="rgba(255,255,255,0.05)" strokeDasharray="3 3" />

                {/* Scatter Points */}
                {data.sun_delta_vs_confidence && data.sun_delta_vs_confidence.map((pt, idx) => {
                  const cx = 30 + Math.min(1.0, pt.sun_angle_delta / 180.0) * 440;
                  const cy = 130 - (pt.confidence / 100.0) * 115;
                  return (
                    <circle
                      key={idx}
                      cx={cx}
                      cy={cy}
                      r="4.5"
                      fill="#FFB547"
                      stroke="#071019"
                      strokeWidth="1.5"
                      className="hover:scale-150 transition-transform cursor-pointer"
                    >
                      <title>{`${pt.pair}: Δ ${pt.sun_angle_delta}° -> ${pt.confidence}% conf`}</title>
                    </circle>
                  );
                })}

                {/* Labels */}
                <text x="35" y="145" fill="rgba(255,255,255,0.4)" fontSize="9" fontFamily="monospace">Δ 0° (Identical Sun)</text>
                <text x="235" y="145" fill="rgba(255,255,255,0.4)" fontSize="9" fontFamily="monospace">Δ 90°</text>
                <text x="430" y="145" fill="rgba(255,255,255,0.4)" fontSize="9" fontFamily="monospace">Δ 180° (Reversed)</text>
                <text x="5" y="15" fill="rgba(255,255,255,0.4)" fontSize="9" fontFamily="monospace">100%</text>
                <text x="12" y="130" fill="rgba(255,255,255,0.4)" fontSize="9" fontFamily="monospace">0%</text>
              </svg>
            </div>
            <div className="text-[10px] font-mono text-white/50 text-center">
              Evaluates CLAHE & phase-congruency illumination compensation against severe shadowing deltas
            </div>
          </div>

        </div>

        {/* 4. HISTOGRAM: Confidence Score Distribution */}
        {data.confidence_distribution && data.confidence_distribution.length > 0 && (
          <div className="rounded-2xl bg-[#071019]/90 border border-white/[0.08] p-5 space-y-4 shadow-xl">
            <div className="flex items-center justify-between border-b border-white/[0.06] pb-3">
              <div className="flex items-center gap-2">
                <BarChart3 className="w-4 h-4 text-[#24D99B]" />
                <h3 className="text-xs font-tech font-semibold tracking-[0.14em] uppercase text-[#F4F6F8]">
                  MATCH CONFIDENCE DISTRIBUTION (HISTOGRAM)
                </h3>
              </div>
            </div>

            <div className="grid grid-cols-5 gap-3 pt-2">
              {data.confidence_distribution.map((bin, idx) => {
                const maxCount = Math.max(...data.confidence_distribution!.map(b => b.count), 1);
                const heightPct = Math.max(10, Math.round((bin.count / maxCount) * 100));
                return (
                  <div key={idx} className="flex flex-col items-center gap-2">
                    <div className="w-full h-32 bg-[#050A12] rounded-xl border border-white/5 flex items-end justify-center p-2 relative">
                      <div
                        className="w-full rounded-lg bg-gradient-to-t from-[#2F80FF] to-[#24D99B] transition-all duration-500 flex items-center justify-center text-[10px] font-mono font-bold text-black"
                        style={{ height: `${heightPct}%` }}
                      >
                        {bin.count > 0 && bin.count}
                      </div>
                    </div>
                    <span className="text-[10px] font-mono text-white/60">{bin.range}</span>
                  </div>
                );
              })}
            </div>
          </div>
        )}

        {/* 5. Cross-Modal Benchmark Table */}
        <div className="rounded-2xl bg-[#071019]/90 border border-white/[0.08] p-5 space-y-4 shadow-xl">
          <div className="flex items-center justify-between border-b border-white/[0.06] pb-3">
            <div className="flex items-center gap-2">
              <Cpu className="w-4 h-4 text-[#38A8FF]" />
              <h3 className="text-xs font-tech font-semibold tracking-[0.14em] uppercase text-[#F4F6F8]">
                CROSS-MODALITY ACCURACY MATRIX (CHANDRAYAAN-2 PAIRS)
              </h3>
            </div>
            <span className="text-[10px] font-tech text-[#32D39A] tracking-wider font-medium">
              DATABASE-DERIVED SCIENTIFIC METRICS
            </span>
          </div>

          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs">
              <thead className="bg-[#0A121C] text-[#8D98A5] text-[9.5px] font-tech uppercase tracking-[0.14em] font-medium border-y border-white/[0.04]">
                <tr>
                  <th className="py-2.5 px-4">Sensor Pair</th>
                  <th className="py-2.5 px-4">Modality Type</th>
                  <th className="py-2.5 px-4">Inlier Ratio (%)</th>
                  <th className="py-2.5 px-4">Median Reprojection Error</th>
                  <th className="py-2.5 px-4">Confidence</th>
                  <th className="py-2.5 px-4">Active Samples</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-white/[0.04]">
                {data.cross_modal_benchmarks && data.cross_modal_benchmarks.length > 0 ? (
                  data.cross_modal_benchmarks.map((row, idx) => (
                    <tr key={idx} className="hover:bg-white/[0.02] transition-colors">
                      <td className="py-3.5 px-4 font-tech font-medium text-xs text-[#F4F6F8] flex items-center gap-2.5">
                        <span className="w-1.5 h-1.5 rounded-full bg-[#38A8FF] shadow-[0_0_6px_rgba(56,168,255,0.6)]" />
                        <span>{row.pair}</span>
                      </td>
                      <td className="py-3.5 px-4 text-xs font-sans text-[#8D98A5]">{row.modality}</td>
                      <td className="py-3.5 px-4 font-tech font-medium text-xs text-[#32D39A] tabular-nums">{row.inlier_ratio}%</td>
                      <td className="py-3.5 px-4 font-tech font-medium text-xs text-[#38A8FF] tabular-nums">{row.median_error_px} px</td>
                      <td className="py-3.5 px-4 font-tech font-medium text-xs text-[#F4F6F8] tabular-nums">{row.confidence}%</td>
                      <td className="py-3.5 px-4 font-tech text-xs text-[#8D98A5] tabular-nums">{row.samples.toLocaleString()}</td>
                    </tr>
                  ))
                ) : (
                  <tr>
                    <td colSpan={6} className="py-8 text-center text-white/40 font-mono text-xs">
                      {loading ? 'Querying database analytics...' : 'NO DATA: Run correspondence analyses to populate accuracy matrix.'}
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        </div>

      </div>
    </EdolusShell>
  );
}
