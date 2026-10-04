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
  const [timelineMetric, setTimelineMetric] = useState<'confidence' | 'inliers' | 'rmse'>('confidence');
  const [hoveredRun, setHoveredRun] = useState<any | null>(null);

  const fetchAnalytics = () => {
    setLoading(true);
    const apiBase = process.env.NEXT_PUBLIC_API_URL || '';
    fetch(`${apiBase}/api/analytics/summary`)
      .catch(() => fetch('/api/analytics/summary'))
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
  const payloadColors: Record<string, string> = {
    'OHRC': '#D9DDE0',
    'TMC-2': '#64748B',
    'IIRS': '#C89A45'
  };

  const payloadGSD: Record<string, string> = {
    'OHRC': '0.25 m/px',
    'TMC-2': '5.00 m/px',
    'IIRS': '80.0 m/px'
  };

  const totalPayloadCount = (data.payload_distribution || []).reduce((acc, curr) => acc + curr.count, 0) || 1;
  let accumulatedAngle = 0;

  // Max calculations for timeline metrics
  const maxInliers = Math.max(
    ...(data.analysis_timeline || []).map(r => r.inliers),
    300
  );
  const maxRmse = Math.max(
    ...(data.analysis_timeline || []).map(r => r.rmse),
    3.0
  );

  return (
    <EdolusShell>
      <div className="space-y-6">
        
        {/* ========================================================
            HEADER & ACTIONS
           ======================================================== */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-white/[0.08] pb-5">
          <div>
            <div className="flex items-center gap-2 text-[10px] font-tech tracking-[0.18em] text-[#8D98A5] uppercase font-medium">
              <Activity className="w-3.5 h-3.5 text-[#D9DDE0]" />
              <span>CHANDRAYAAN-2 DATABASE-DERIVED BENCHMARKS & TELEMETRY</span>
            </div>
            <h1 className="text-2xl sm:text-3xl font-display font-bold tracking-tight text-[#F4F6F8] mt-1">
              MISSION ANALYTICS & BENCHMARK SUITE
            </h1>
          </div>

          <div className="flex items-center gap-3">
            <button
              onClick={fetchAnalytics}
              className="px-3.5 py-2 rounded-lg bg-white/5 hover:bg-white/10 text-white/80 hover:text-white text-xs font-mono flex items-center gap-1.5 transition-colors border border-white/10"
              title="Query live database metrics"
            >
              <RefreshCw className={`w-3.5 h-3.5 text-[#D9DDE0] ${loading ? 'animate-spin' : ''}`} />
              <span>Refresh DB Metrics</span>
            </button>
            <Link
              href="/reports"
              className="px-4 py-2 rounded-lg bg-white text-black hover:bg-[#E2E8F0] font-mono text-xs font-bold uppercase tracking-wider transition-all flex items-center gap-2 shadow-sm"
            >
              <FileText className="w-3.5 h-3.5" />
              <span>Scientific Report</span>
            </Link>
          </div>
        </div>

        {/* ========================================================
            1. CORE SUMMARY TELEMETRY CARDS (With explicit scientific units)
           ======================================================== */}
        <div className="grid grid-cols-2 sm:grid-cols-4 lg:grid-cols-7 gap-3">
          <div className="p-3.5 rounded-2xl bg-[#07111F]/90 border border-white/10">
            <span className="text-[#8D98A5] block text-[9px] font-mono uppercase tracking-wider">Total Analyzed</span>
            <div className="flex items-baseline gap-1 mt-0.5">
              <span className="text-xl font-mono font-bold text-white">
                {data.total_analyses.toLocaleString()}
              </span>
              <span className="text-[10px] font-mono text-[#8D98A5]">runs</span>
            </div>
          </div>

          <div className="p-3.5 rounded-2xl bg-[#07111F]/90 border border-white/10">
            <span className="text-[#8D98A5] block text-[9px] font-mono uppercase tracking-wider">Successful</span>
            <div className="flex items-baseline gap-1 mt-0.5">
              <span className="text-xl font-mono font-bold text-[#32D39A]">
                {data.successful_analyses.toLocaleString()}
              </span>
              <span className="text-[10px] font-mono text-[#32D39A]/70">verified</span>
            </div>
          </div>

          <div className="p-3.5 rounded-2xl bg-[#07111F]/90 border border-white/10">
            <span className="text-[#8D98A5] block text-[9px] font-mono uppercase tracking-wider">Low Conf / Insuff</span>
            <div className="flex items-baseline gap-1 mt-0.5">
              <span className="text-xl font-mono font-bold text-[#FFB547]">
                {data.low_confidence_analyses.toLocaleString()}
              </span>
              <span className="text-[10px] font-mono text-[#FFB547]/70">runs</span>
            </div>
          </div>

          <div className="p-3.5 rounded-2xl bg-[#07111F]/90 border border-white/10">
            <span className="text-[#8D98A5] block text-[9px] font-mono uppercase tracking-wider">Avg Confidence</span>
            <div className="flex items-baseline gap-1 mt-0.5">
              <span className="text-xl font-mono font-bold text-[#32D39A]">
                {data.avg_confidence}%
              </span>
              <span className="text-[10px] font-mono text-[#8D98A5]">score</span>
            </div>
          </div>

          <div className="p-3.5 rounded-2xl bg-[#07111F]/90 border border-white/10">
            <span className="text-[#8D98A5] block text-[9px] font-mono uppercase tracking-wider">Avg Inlier Ratio</span>
            <div className="flex items-baseline gap-1 mt-0.5">
              <span className="text-xl font-mono font-bold text-[#32D39A]">
                {data.avg_inlier_ratio}%
              </span>
              <span className="text-[10px] font-mono text-[#8D98A5]">ratio</span>
            </div>
          </div>

          <div className="p-3.5 rounded-2xl bg-[#07111F]/90 border border-white/10">
            <span className="text-[#8D98A5] block text-[9px] font-mono uppercase tracking-wider">Avg RMSE Error</span>
            <div className="flex items-baseline gap-1 mt-0.5">
              <span className="text-xl font-mono font-bold text-[#D9DDE0]">
                {data.avg_registration_error}
              </span>
              <span className="text-[10px] font-mono text-[#8D98A5]">px</span>
            </div>
          </div>

          <div className="p-3.5 rounded-2xl bg-[#07111F]/90 border border-white/10">
            <span className="text-[#8D98A5] block text-[9px] font-mono uppercase tracking-wider">Images Indexed</span>
            <div className="flex items-baseline gap-1 mt-0.5">
              <span className="text-xl font-mono font-bold text-white">
                {data.images_indexed.toLocaleString()}
              </span>
              <span className="text-[10px] font-mono text-[#8D98A5]">products</span>
            </div>
          </div>
        </div>

        {/* ========================================================
            2. CHARTS ROW: Interactive Chronological Timeline & Donut Chart
           ======================================================== */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          
          {/* ENHANCED TIMELINE GRAPH: Interactive axes, metric toggles & tooltips */}
          <div className="lg:col-span-2 rounded-2xl bg-[#071019]/90 border border-white/[0.08] p-5 space-y-4 shadow-xl">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-white/[0.06] pb-3">
              <div className="flex items-center gap-2">
                <TrendingUp className="w-4 h-4 text-[#D9DDE0]" />
                <div>
                  <h3 className="text-xs font-tech font-semibold tracking-[0.14em] uppercase text-[#F4F6F8]">
                    CORRESPONDENCE PERFORMANCE TIMELINE // TEMPORAL RUNS
                  </h3>
                  <div className="text-[10px] font-mono text-[#8D98A5] mt-0.5">
                    Viewing metric: <strong className="text-white uppercase">{timelineMetric}</strong> across {data.analysis_timeline?.length || 0} sequential runs
                  </div>
                </div>
              </div>

              {/* Interactive Metric Switcher */}
              <div className="flex items-center gap-1 p-0.5 bg-[#050A12] rounded-lg border border-white/10 self-start sm:self-auto">
                <button
                  onClick={() => setTimelineMetric('confidence')}
                  className={`px-2 py-1 rounded text-[10px] font-mono uppercase transition-all ${
                    timelineMetric === 'confidence'
                      ? 'bg-white/15 text-white font-bold'
                      : 'text-[#8D98A5] hover:text-white'
                  }`}
                >
                  Confidence (%)
                </button>
                <button
                  onClick={() => setTimelineMetric('inliers')}
                  className={`px-2 py-1 rounded text-[10px] font-mono uppercase transition-all ${
                    timelineMetric === 'inliers'
                      ? 'bg-white/15 text-white font-bold'
                      : 'text-[#8D98A5] hover:text-white'
                  }`}
                >
                  Inliers (pts)
                </button>
                <button
                  onClick={() => setTimelineMetric('rmse')}
                  className={`px-2 py-1 rounded text-[10px] font-mono uppercase transition-all ${
                    timelineMetric === 'rmse'
                      ? 'bg-white/15 text-white font-bold'
                      : 'text-[#8D98A5] hover:text-white'
                  }`}
                >
                  Error (px)
                </button>
              </div>
            </div>

            {/* Hover Tooltip Readout HUD */}
            <div className="h-7 px-3 rounded bg-[#050A12]/80 border border-white/[0.06] flex items-center justify-between font-mono text-[10px] text-[#8D98A5]">
              {hoveredRun ? (
                <>
                  <div className="flex items-center gap-3">
                    <span className="text-white font-bold">RUN: {hoveredRun.id}</span>
                    <span>PAIR: <strong className="text-[#D9DDE0]">{hoveredRun.pair}</strong></span>
                    <span>TIME: {hoveredRun.date}</span>
                  </div>
                  <div className="flex items-center gap-3">
                    <span>CONFIDENCE: <strong className="text-[#32D39A]">{hoveredRun.confidence}%</strong></span>
                    <span>INLIERS: <strong className="text-white">{hoveredRun.inliers} pts</strong></span>
                    <span>RMSE: <strong className="text-[#D9DDE0]">{hoveredRun.rmse} px</strong></span>
                    <span className={`px-1.5 py-0.2 rounded text-[9px] ${hoveredRun.status === 'COMPLETED' ? 'bg-[#32D39A]/20 text-[#32D39A]' : 'bg-[#FFB547]/20 text-[#FFB547]'}`}>
                      {hoveredRun.status}
                    </span>
                  </div>
                </>
              ) : (
                <div className="flex items-center justify-between w-full">
                  <span>Hover over any data point to inspect run coordinates, inlier counts, and reprojection residual.</span>
                  <span className="text-white/40">Y-AXIS: {timelineMetric === 'confidence' ? 'Score (0% – 100%)' : timelineMetric === 'inliers' ? `Inliers (0 – ${maxInliers} pts)` : `RMSE (0 – ${maxRmse.toFixed(2)} px)`}</span>
                </div>
              )}
            </div>

            {/* SVG Graph Canvas with Full Axis & Units */}
            <div className="h-60 relative w-full pt-2">
              {data.analysis_timeline && data.analysis_timeline.length > 0 ? (
                <svg className="w-full h-full overflow-visible" viewBox="0 0 680 180">
                  <defs>
                    <linearGradient id="timelineSilverGradient" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="0%" stopColor="#D9DDE0" stopOpacity="0.18" />
                      <stop offset="100%" stopColor="#D9DDE0" stopOpacity="0.0" />
                    </linearGradient>
                  </defs>

                  {/* Y-Axis Grid Lines & Tick Labels with Scientific Units */}
                  {[
                    { pct: 1.0, y: 20, label: timelineMetric === 'confidence' ? '100%' : timelineMetric === 'inliers' ? `${maxInliers}` : `${maxRmse.toFixed(1)} px` },
                    { pct: 0.75, y: 55, label: timelineMetric === 'confidence' ? '75%' : timelineMetric === 'inliers' ? `${Math.round(maxInliers * 0.75)}` : `${(maxRmse * 0.75).toFixed(1)} px` },
                    { pct: 0.50, y: 90, label: timelineMetric === 'confidence' ? '50%' : timelineMetric === 'inliers' ? `${Math.round(maxInliers * 0.50)}` : `${(maxRmse * 0.50).toFixed(1)} px` },
                    { pct: 0.25, y: 125, label: timelineMetric === 'confidence' ? '25%' : timelineMetric === 'inliers' ? `${Math.round(maxInliers * 0.25)}` : `${(maxRmse * 0.25).toFixed(1)} px` },
                    { pct: 0.0, y: 160, label: timelineMetric === 'confidence' ? '0%' : '0' },
                  ].map((tick, i) => (
                    <g key={i}>
                      <text x="45" y={tick.y + 3} textAnchor="end" fill="rgba(255,255,255,0.4)" fontSize="9" fontFamily="monospace">
                        {tick.label}
                      </text>
                      <line x1="55" y1={tick.y} x2="670" y2={tick.y} stroke="rgba(255,255,255,0.06)" strokeDasharray={i === 4 ? "none" : "3 3"} />
                    </g>
                  ))}

                  {/* Left Y-Axis Vertical Line */}
                  <line x1="55" y1="20" x2="55" y2="160" stroke="rgba(255,255,255,0.2)" strokeWidth="1" />
                  {/* Bottom X-Axis Horizontal Line */}
                  <line x1="55" y1="160" x2="670" y2="160" stroke="rgba(255,255,255,0.2)" strokeWidth="1" />

                  {/* Normalized Data Mapping Helper */}
                  {(() => {
                    const runs = data.analysis_timeline;
                    const getNormY = (item: any) => {
                      let val = 0;
                      if (timelineMetric === 'confidence') val = item.confidence / 100.0;
                      else if (timelineMetric === 'inliers') val = item.inliers / maxInliers;
                      else if (timelineMetric === 'rmse') val = item.rmse / maxRmse;
                      val = Math.max(0.0, Math.min(1.0, val));
                      return 160 - val * 140;
                    };

                    const getX = (idx: number) => {
                      return 55 + (idx / Math.max(1, runs.length - 1)) * 615;
                    };

                    const pathD = runs.map((item, idx) => {
                      const x = getX(idx);
                      const y = getNormY(item);
                      return `${idx === 0 ? 'M' : 'L'} ${x.toFixed(1)},${y.toFixed(1)}`;
                    }).join(' ');

                    const areaD = `M 55,160 ${runs.map((item, idx) => {
                      const x = getX(idx);
                      const y = getNormY(item);
                      return `L ${x.toFixed(1)},${y.toFixed(1)}`;
                    }).join(' ')} L ${getX(runs.length - 1).toFixed(1)},160 Z`;

                    return (
                      <>
                        {/* Area fill */}
                        <path d={areaD} fill="url(#timelineSilverGradient)" />

                        {/* Line */}
                        <path d={pathD} fill="none" stroke="#D9DDE0" strokeWidth="1.8" />

                        {/* Interactive Data Points */}
                        {runs.map((item, idx) => {
                          const x = getX(idx);
                          const y = getNormY(item);
                          const isSucc = item.status === 'COMPLETED';
                          const isHovered = hoveredRun?.id === item.id;

                          return (
                            <g 
                              key={idx}
                              onMouseEnter={() => setHoveredRun(item)}
                              className="cursor-pointer"
                            >
                              {/* Invisible hit target for smooth hovering */}
                              <circle cx={x} cy={y} r="12" fill="transparent" />

                              {/* Visible Point */}
                              <circle
                                cx={x}
                                cy={y}
                                r={isHovered ? "6" : "3.5"}
                                fill={isSucc ? '#32D39A' : '#FFB547'}
                                stroke="#071019"
                                strokeWidth={isHovered ? "2.5" : "1.5"}
                                className="transition-all duration-150"
                              />

                              {/* Hover Guideline */}
                              {isHovered && (
                                <line x1={x} y1="20" x2={x} y2="160" stroke="rgba(255,255,255,0.3)" strokeDasharray="2 2" />
                              )}
                            </g>
                          );
                        })}
                      </>
                    );
                  })()}

                  {/* X-Axis Sequence Labels */}
                  {[0, 0.25, 0.5, 0.75, 1.0].map((ratio, i) => {
                    const runs = data.analysis_timeline || [];
                    const idx = Math.min(runs.length - 1, Math.round(ratio * (runs.length - 1)));
                    const x = 55 + ratio * 615;
                    return (
                      <g key={i}>
                        <line x1={x} y1="160" x2={x} y2="164" stroke="rgba(255,255,255,0.3)" />
                        <text x={x} y="174" textAnchor="middle" fill="rgba(255,255,255,0.4)" fontSize="9" fontFamily="monospace">
                          Run #{idx + 1}
                        </text>
                      </g>
                    );
                  })}
                </svg>
              ) : (
                <div className="flex items-center justify-center h-full text-white/40 text-xs font-mono">
                  No chronological correspondence history recorded yet.
                </div>
              )}
            </div>

            {/* Scientific Legend Strip */}
            <div className="flex flex-wrap items-center justify-between text-[10px] font-mono text-[#8D98A5] pt-2 border-t border-white/[0.04]">
              <span className="flex items-center gap-1.5"><span className="w-2 h-2 rounded-full bg-[#32D39A]" /> Verified Inlier Run (&gt;50% Conf)</span>
              <span className="flex items-center gap-1.5"><span className="w-2 h-2 rounded-full bg-[#FFB547]" /> Insufficient Run (&lt;50% Conf)</span>
              <span>Units: Confidence (%), Points (count), RMSE (px)</span>
            </div>
          </div>

          {/* DONUT CHART: Payload Sensor Ratio (Monochrome & Amber palette) */}
          <div className="rounded-2xl bg-[#071019]/90 border border-white/[0.08] p-5 space-y-4 shadow-xl flex flex-col justify-between">
            <div className="flex items-center justify-between border-b border-white/[0.06] pb-3">
              <div className="flex items-center gap-2">
                <PieChart className="w-4 h-4 text-[#D9DDE0]" />
                <h3 className="text-xs font-tech font-semibold tracking-[0.14em] uppercase text-[#F4F6F8]">
                  PAYLOAD SENSOR RATIO
                </h3>
              </div>
              <span className="text-[10px] font-mono text-[#8D98A5]">
                {data.images_indexed} TOTAL
              </span>
            </div>

            <div className="flex items-center justify-center h-44 relative my-auto">
              <svg className="w-40 h-40 -rotate-90" viewBox="0 0 100 100">
                {data.payload_distribution && data.payload_distribution.map((p, idx) => {
                  const pct = p.count / totalPayloadCount;
                  const strokeDash = pct * 251.3; // 2 * pi * r (r=40)
                  const strokeOffset = -accumulatedAngle * 251.3;
                  accumulatedAngle += pct;
                  const color = payloadColors[p.name] || p.color || '#D9DDE0';

                  return (
                    <circle
                      key={idx}
                      cx="50"
                      cy="50"
                      r="40"
                      fill="transparent"
                      stroke={color}
                      strokeWidth="11"
                      strokeDasharray={`${strokeDash} 251.3`}
                      strokeDashoffset={strokeOffset}
                      className="transition-all duration-500"
                    />
                  );
                })}
              </svg>
              <div className="absolute inset-0 flex flex-col items-center justify-center pointer-events-none">
                <span className="text-xl font-mono font-bold text-white">{data.images_indexed}</span>
                <span className="text-[9px] font-mono text-[#8D98A5] uppercase">PRODUCTS</span>
              </div>
            </div>

            <div className="space-y-2 pt-2 font-mono text-xs border-t border-white/[0.04]">
              {data.payload_distribution && data.payload_distribution.map((p, idx) => {
                const color = payloadColors[p.name] || p.color || '#D9DDE0';
                const gsd = payloadGSD[p.name] || 'N/A';
                const pct = Math.round((p.count / totalPayloadCount) * 100);

                return (
                  <div key={idx} className="flex items-center justify-between text-[11px]">
                    <div className="flex items-center gap-2">
                      <span className="w-2.5 h-2.5 rounded-full" style={{ backgroundColor: color }} />
                      <span className="text-white/90 font-bold">{p.name}</span>
                      <span className="text-[10px] text-[#8D98A5]">({gsd})</span>
                    </div>
                    <span className="font-bold text-white font-mono">
                      {p.count} products ({pct}%)
                    </span>
                  </div>
                );
              })}
            </div>
          </div>

        </div>

        {/* ========================================================
            3. SCATTER PLOTS ROW: Scale Ratio vs Conf & Sun Delta vs Conf (Full units)
           ======================================================== */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          
          {/* SCATTER PLOT 1: Scale Difference (GSD Ratio) vs Match Confidence */}
          <div className="rounded-2xl bg-[#071019]/90 border border-white/[0.08] p-5 space-y-4 shadow-xl">
            <div className="flex items-center justify-between border-b border-white/[0.06] pb-3">
              <div className="flex items-center gap-2">
                <Maximize2 className="w-4 h-4 text-[#D9DDE0]" />
                <h3 className="text-xs font-tech font-semibold tracking-[0.14em] uppercase text-[#F4F6F8]">
                  SCALE DIFFERENCE (GSD RATIO ×) VS MATCH CONFIDENCE (%)
                </h3>
              </div>
              <span className="text-[10px] font-mono text-[#8D98A5]">
                {data.scale_vs_confidence?.length || 0} Samples
              </span>
            </div>

            <div className="h-56 relative w-full pt-2">
              <svg className="w-full h-full overflow-visible" viewBox="0 0 520 160">
                {/* Y-Axis Grid Lines & Labels */}
                {[
                  { y: 20, label: '100%' },
                  { y: 55, label: '75%' },
                  { y: 90, label: '50%' },
                  { y: 125, label: '25%' },
                  { y: 140, label: '0%' }
                ].map((tick, i) => (
                  <g key={i}>
                    <text x="35" y={tick.y + 3} textAnchor="end" fill="rgba(255,255,255,0.4)" fontSize="9" fontFamily="monospace">
                      {tick.label}
                    </text>
                    <line x1="42" y1={tick.y} x2="500" y2={tick.y} stroke="rgba(255,255,255,0.05)" strokeDasharray={i === 4 ? "none" : "3 3"} />
                  </g>
                ))}

                {/* 50% Confidence Threshold Line */}
                <line x1="42" y1="90" x2="500" y2="90" stroke="rgba(50,211,154,0.3)" strokeWidth="1" strokeDasharray="2 2" />
                <text x="500" y="86" textAnchor="end" fill="#32D39A" fontSize="8" fontFamily="monospace">
                  50% Verification Threshold
                </text>

                {/* Axes */}
                <line x1="42" y1="20" x2="42" y2="140" stroke="rgba(255,255,255,0.2)" strokeWidth="1" />
                <line x1="42" y1="140" x2="500" y2="140" stroke="rgba(255,255,255,0.2)" strokeWidth="1" />

                {/* Scatter Points (Lunar silver) */}
                {data.scale_vs_confidence && data.scale_vs_confidence.map((pt, idx) => {
                  const cx = 42 + Math.min(1.0, (pt.scale_ratio - 1.0) / 24.0) * 440;
                  const cy = 140 - (pt.confidence / 100.0) * 120;
                  return (
                    <circle
                      key={idx}
                      cx={cx}
                      cy={cy}
                      r="4"
                      fill="#D9DDE0"
                      stroke="#071019"
                      strokeWidth="1.5"
                      className="hover:scale-150 transition-transform cursor-pointer"
                    >
                      <title>{`${pt.pair}: ${pt.scale_ratio}× scale ratio -> ${pt.confidence}% confidence (${pt.inliers} inliers)`}</title>
                    </circle>
                  );
                })}

                {/* X-Axis Ticks & Units */}
                {[
                  { x: 42, label: '1.0× (Mono)' },
                  { x: 152, label: '6.0×' },
                  { x: 262, label: '12.0×' },
                  { x: 372, label: '18.0×' },
                  { x: 482, label: '25.0× (OHRC↔TMC)' }
                ].map((tick, i) => (
                  <g key={i}>
                    <line x1={tick.x} y1="140" x2={tick.x} y2="144" stroke="rgba(255,255,255,0.3)" />
                    <text x={tick.x} y="154" textAnchor="middle" fill="rgba(255,255,255,0.4)" fontSize="9" fontFamily="monospace">
                      {tick.label}
                    </text>
                  </g>
                ))}
              </svg>
            </div>
            <div className="text-[10px] font-mono text-[#8D98A5] text-center border-t border-white/[0.04] pt-2">
              Units: X-Axis in Scale Ratio (× factor) • Y-Axis in Match Confidence (%)
            </div>
          </div>

          {/* SCATTER PLOT 2: Sun-Angle Difference vs Match Confidence */}
          <div className="rounded-2xl bg-[#071019]/90 border border-white/[0.08] p-5 space-y-4 shadow-xl">
            <div className="flex items-center justify-between border-b border-white/[0.06] pb-3">
              <div className="flex items-center gap-2">
                <Sun className="w-4 h-4 text-[#C89A45]" />
                <h3 className="text-xs font-tech font-semibold tracking-[0.14em] uppercase text-[#F4F6F8]">
                  SUN-ANGLE DIFFERENCE (Δ DEG °) VS MATCH CONFIDENCE (%)
                </h3>
              </div>
              <span className="text-[10px] font-mono text-[#8D98A5]">
                {data.sun_delta_vs_confidence?.length || 0} Samples
              </span>
            </div>

            <div className="h-56 relative w-full pt-2">
              <svg className="w-full h-full overflow-visible" viewBox="0 0 520 160">
                {/* Y-Axis Grid Lines & Labels */}
                {[
                  { y: 20, label: '100%' },
                  { y: 55, label: '75%' },
                  { y: 90, label: '50%' },
                  { y: 125, label: '25%' },
                  { y: 140, label: '0%' }
                ].map((tick, i) => (
                  <g key={i}>
                    <text x="35" y={tick.y + 3} textAnchor="end" fill="rgba(255,255,255,0.4)" fontSize="9" fontFamily="monospace">
                      {tick.label}
                    </text>
                    <line x1="42" y1={tick.y} x2="500" y2={tick.y} stroke="rgba(255,255,255,0.05)" strokeDasharray={i === 4 ? "none" : "3 3"} />
                  </g>
                ))}

                {/* 50% Confidence Threshold Line */}
                <line x1="42" y1="90" x2="500" y2="90" stroke="rgba(50,211,154,0.3)" strokeWidth="1" strokeDasharray="2 2" />
                <text x="500" y="86" textAnchor="end" fill="#32D39A" fontSize="8" fontFamily="monospace">
                  50% Verification Threshold
                </text>

                {/* Axes */}
                <line x1="42" y1="20" x2="42" y2="140" stroke="rgba(255,255,255,0.2)" strokeWidth="1" />
                <line x1="42" y1="140" x2="500" y2="140" stroke="rgba(255,255,255,0.2)" strokeWidth="1" />

                {/* Scatter Points (Amber solar) */}
                {data.sun_delta_vs_confidence && data.sun_delta_vs_confidence.map((pt, idx) => {
                  const cx = 42 + Math.min(1.0, pt.sun_angle_delta / 180.0) * 440;
                  const cy = 140 - (pt.confidence / 100.0) * 120;
                  return (
                    <circle
                      key={idx}
                      cx={cx}
                      cy={cy}
                      r="4"
                      fill="#C89A45"
                      stroke="#071019"
                      strokeWidth="1.5"
                      className="hover:scale-150 transition-transform cursor-pointer"
                    >
                      <title>{`${pt.pair}: Δ ${pt.sun_angle_delta}° -> ${pt.confidence}% confidence (RMSE: ${pt.error_px} px)`}</title>
                    </circle>
                  );
                })}

                {/* X-Axis Ticks & Units */}
                {[
                  { x: 42, label: 'Δ 0° (Identical)' },
                  { x: 152, label: 'Δ 45°' },
                  { x: 262, label: 'Δ 90°' },
                  { x: 372, label: 'Δ 135°' },
                  { x: 482, label: 'Δ 180° (Opposite)' }
                ].map((tick, i) => (
                  <g key={i}>
                    <line x1={tick.x} y1="140" x2={tick.x} y2="144" stroke="rgba(255,255,255,0.3)" />
                    <text x={tick.x} y="154" textAnchor="middle" fill="rgba(255,255,255,0.4)" fontSize="9" fontFamily="monospace">
                      {tick.label}
                    </text>
                  </g>
                ))}
              </svg>
            </div>
            <div className="text-[10px] font-mono text-[#8D98A5] text-center border-t border-white/[0.04] pt-2">
              Units: X-Axis in Solar Angle Delta (° degrees) • Y-Axis in Match Confidence (%)
            </div>
          </div>

        </div>

        {/* ========================================================
            4. HISTOGRAM: Match Confidence Distribution
           ======================================================== */}
        {data.confidence_distribution && data.confidence_distribution.length > 0 && (
          <div className="rounded-2xl bg-[#071019]/90 border border-white/[0.08] p-5 space-y-4 shadow-xl">
            <div className="flex items-center justify-between border-b border-white/[0.06] pb-3">
              <div className="flex items-center gap-2">
                <BarChart3 className="w-4 h-4 text-[#32D39A]" />
                <h3 className="text-xs font-tech font-semibold tracking-[0.14em] uppercase text-[#F4F6F8]">
                  MATCH CONFIDENCE DISTRIBUTION (HISTOGRAM FREQUENCY)
                </h3>
              </div>
              <span className="text-[10px] font-mono text-[#8D98A5]">
                Unit: Runs Count (N) per 20% Bin Range
              </span>
            </div>

            <div className="grid grid-cols-5 gap-3 pt-2">
              {data.confidence_distribution.map((bin, idx) => {
                const maxCount = Math.max(...data.confidence_distribution!.map(b => b.count), 1);
                const heightPct = Math.max(10, Math.round((bin.count / maxCount) * 100));
                return (
                  <div key={idx} className="flex flex-col items-center gap-2">
                    <div className="w-full h-32 bg-[#050A12] rounded-xl border border-white/5 flex items-end justify-center p-2 relative">
                      <div
                        className="w-full rounded-lg bg-[#32D39A]/80 border border-[#32D39A] transition-all duration-500 flex items-center justify-center text-[10px] font-mono font-bold text-black"
                        style={{ height: `${heightPct}%` }}
                      >
                        {bin.count > 0 && `${bin.count} runs`}
                      </div>
                    </div>
                    <span className="text-[10px] font-mono text-white/70">{bin.range}</span>
                  </div>
                );
              })}
            </div>
          </div>
        )}

        {/* ========================================================
            5. Cross-Modal Benchmark Table (Explicit units on all headers)
           ======================================================== */}
        <div className="rounded-2xl bg-[#071019]/90 border border-white/[0.08] p-5 space-y-4 shadow-xl">
          <div className="flex items-center justify-between border-b border-white/[0.06] pb-3">
            <div className="flex items-center gap-2">
              <Cpu className="w-4 h-4 text-[#D9DDE0]" />
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
                  <th className="py-2.5 px-4">Median Reprojection Error (px)</th>
                  <th className="py-2.5 px-4">Confidence Score (%)</th>
                  <th className="py-2.5 px-4">Active Samples (runs)</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-white/[0.04]">
                {data.cross_modal_benchmarks && data.cross_modal_benchmarks.length > 0 ? (
                  data.cross_modal_benchmarks.map((row, idx) => (
                    <tr key={idx} className="hover:bg-white/[0.02] transition-colors">
                      <td className="py-3.5 px-4 font-tech font-medium text-xs text-[#F4F6F8] flex items-center gap-2.5">
                        <span className="w-1.5 h-1.5 rounded-full bg-[#D9DDE0]" />
                        <span>{row.pair}</span>
                      </td>
                      <td className="py-3.5 px-4 text-xs font-sans text-[#8D98A5]">{row.modality}</td>
                      <td className="py-3.5 px-4 font-tech font-medium text-xs text-[#32D39A] tabular-nums">{row.inlier_ratio}%</td>
                      <td className="py-3.5 px-4 font-tech font-medium text-xs text-[#D9DDE0] tabular-nums">{row.median_error_px} px</td>
                      <td className="py-3.5 px-4 font-tech font-medium text-xs text-[#F4F6F8] tabular-nums">{row.confidence}%</td>
                      <td className="py-3.5 px-4 font-tech text-xs text-[#8D98A5] tabular-nums">{row.samples.toLocaleString()} runs</td>
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
