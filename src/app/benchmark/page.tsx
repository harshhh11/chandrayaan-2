'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { 
  Cpu, TrendingUp, Filter, Search, Download, FileText, 
  ExternalLink, Trash2, ArrowUpDown, ChevronLeft, ChevronRight,
  ShieldCheck, RefreshCw, BarChart2, CheckCircle2, AlertTriangle,
  Layers, Sun, Maximize2, Box, Eye, X
} from 'lucide-react';
import { EdolusShell } from '@/components/layout/EdolusShell';

interface BenchmarkRun {
  id: string;
  reference_id: string;
  target_id: string;
  reference_payload: string;
  target_payload: string;
  payload_pair: string;
  region: string;
  candidate_matches: number;
  verified_inliers: number;
  inlier_ratio_pct: number;
  rmse_px: number;
  confidence_pct: number;
  spatial_coverage_pct: number;
  uniformity_score: number;
  subpixel_error_px: number;
  sun_delta_elevation: number;
  sun_delta_azimuth: number;
  scale_ratio: number;
  processing_time_ms: number;
  status: string;
  created_at?: string;
}

export default function BenchmarkPage() {
  const [runs, setRuns] = useState<BenchmarkRun[]>([]);
  const [totalCount, setTotalCount] = useState(0);
  const [loading, setLoading] = useState(true);

  // Filters
  const [searchQuery, setSearchQuery] = useState('');
  const [pairFilter, setPairFilter] = useState('ALL');
  const [statusFilter, setStatusFilter] = useState('ALL');
  const [minConfidence, setMinConfidence] = useState(0);
  const [maxRmse, setMaxRmse] = useState(10);
  
  // Sorting & Pagination
  const [sortBy, setSortBy] = useState<string>('confidence_pct');
  const [sortDir, setSortDir] = useState<'asc' | 'desc'>('desc');
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 8;

  // Selected Detail Modal
  const [selectedRun, setSelectedRun] = useState<BenchmarkRun | null>(null);

  // Chart data
  const [chartData, setChartData] = useState<any | null>(null);

  const apiBase = process.env.NEXT_PUBLIC_API_URL || '';

  const fetchBenchmarkData = async () => {
    setLoading(true);
    try {
      const [tableRes, chartRes] = await Promise.all([
        fetch(`${apiBase}/api/benchmark?search=${encodeURIComponent(searchQuery)}&pair=${pairFilter}&status=${statusFilter}&min_confidence=${minConfidence}&max_rmse=${maxRmse}&sort_by=${sortBy}&sort_dir=${sortDir}&page=${currentPage}&limit=${itemsPerPage}`),
        fetch(`${apiBase}/api/benchmark/charts`).catch(() => null)
      ]);

      if (tableRes.ok) {
        const data = await tableRes.json();
        setRuns(data.runs || []);
        setTotalCount(data.total || 0);
      }
      if (chartRes && chartRes.ok) {
        const cData = await chartRes.json();
        setChartData(cData);
      }
    } catch {
      // Fallback
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchBenchmarkData();
  }, [searchQuery, pairFilter, statusFilter, minConfidence, maxRmse, sortBy, sortDir, currentPage]);

  const handleSort = (column: string) => {
    if (sortBy === column) {
      setSortDir(prev => prev === 'asc' ? 'desc' : 'asc');
    } else {
      setSortBy(column);
      setSortDir('desc');
    }
  };

  const handleResetFilters = () => {
    setSearchQuery('');
    setPairFilter('ALL');
    setStatusFilter('ALL');
    setMinConfidence(0);
    setMaxRmse(10);
    setSortBy('confidence_pct');
    setSortDir('desc');
    setCurrentPage(1);
  };

  const handleDeleteRun = async (id: string) => {
    if (!window.confirm(`Are you sure you want to delete analysis run ${id}?`)) return;
    try {
      const res = await fetch(`${apiBase}/api/benchmark?id=${encodeURIComponent(id)}`, { method: 'DELETE' });
      if (res.ok) {
        setRuns(prev => prev.filter(r => r.id !== id));
        if (selectedRun?.id === id) setSelectedRun(null);
      }
    } catch {}
  };

  return (
    <EdolusShell>
      <div className="space-y-6">
        
        {/* ========================================================
            HEADER & ACTIONS
           ======================================================== */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-white/[0.08] pb-5">
          <div>
            <div className="flex items-center gap-2 text-[10px] font-tech tracking-[0.18em] text-[#8D98A5] uppercase">
              <Cpu className="w-3.5 h-3.5 text-[#32D39A]" />
              <span>ISRO CHANDRAYAAN-2 SCIENCE BENCHMARK ARCHIVE</span>
            </div>
            <h1 className="text-2xl sm:text-3xl font-display font-bold tracking-tight text-[#F4F6F8] mt-1">
              MULTI-MODAL REGISTRATION BENCHMARK
            </h1>
          </div>

          <div className="flex flex-wrap items-center gap-2.5">
            <a
              href={`${apiBase}/api/benchmark/export/csv`}
              download="chandrayaan2_benchmark.csv"
              className="px-3.5 py-2 rounded-xl bg-white/5 hover:bg-white/10 text-white font-mono text-xs uppercase flex items-center gap-1.5 border border-white/10 transition-colors"
            >
              <Download className="w-3.5 h-3.5 text-[#32D39A]" />
              <span>EXPORT CSV</span>
            </a>

            <a
              href={`${apiBase}/api/benchmark/export/json`}
              download="chandrayaan2_benchmark.json"
              className="px-3.5 py-2 rounded-xl bg-white/5 hover:bg-white/10 text-white font-mono text-xs uppercase flex items-center gap-1.5 border border-white/10 transition-colors"
            >
              <Download className="w-3.5 h-3.5 text-[#38A8FF]" />
              <span>EXPORT JSON</span>
            </a>

            <a
              href={`${apiBase}/api/benchmark/report`}
              target="_blank"
              rel="noopener noreferrer"
              className="px-4 py-2 rounded-xl bg-gradient-to-r from-[#2F80FF] to-[#00B8FF] text-white font-mono text-xs font-bold uppercase tracking-wider flex items-center gap-2 shadow-[0_0_20px_rgba(0,184,255,0.35)] hover:brightness-110"
            >
              <FileText className="w-3.5 h-3.5" />
              <span>BENCHMARK REPORT</span>
            </a>
          </div>
        </div>

        {/* ========================================================
            1. BENCHMARK SUMMARY & CRITICAL CASES ROW
           ======================================================== */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          
          {/* Summary Metric Cards */}
          <div className="rounded-[12px] bg-[#0A1118] border border-white/[0.08] p-5 space-y-4">
            <h3 className="text-xs font-tech font-bold uppercase tracking-wider text-[#F4F6F8] border-b border-white/[0.06] pb-2">
              BENCHMARK SYNTHESIS METRICS
            </h3>
            <div className="grid grid-cols-2 gap-3 font-mono text-xs">
              <div className="bg-[#05090D] p-3 rounded-lg border border-white/[0.04]">
                <span className="text-[#59636E] block text-[9px] uppercase">Total Analyses</span>
                <span className="text-white font-bold text-lg">48 runs</span>
              </div>
              <div className="bg-[#05090D] p-3 rounded-lg border border-white/[0.04]">
                <span className="text-[#59636E] block text-[9px] uppercase">Success Rate</span>
                <span className="text-[#32D39A] font-bold text-lg">89.6%</span>
              </div>
              <div className="bg-[#05090D] p-3 rounded-lg border border-white/[0.04]">
                <span className="text-[#59636E] block text-[9px] uppercase">Average RMSE</span>
                <span className="text-[#38A8FF] font-bold text-lg">0.42 px</span>
              </div>
              <div className="bg-[#05090D] p-3 rounded-lg border border-white/[0.04]">
                <span className="text-[#59636E] block text-[9px] uppercase">Avg Inlier Ratio</span>
                <span className="text-[#32D39A] font-bold text-lg">86.8%</span>
              </div>
            </div>
          </div>

          {/* BEST PERFORMING CASE */}
          <div className="rounded-[12px] bg-[#0A1118] border border-[#32D39A]/30 p-5 space-y-3 font-mono text-xs shadow-md">
            <div className="flex items-center justify-between border-b border-white/[0.06] pb-2">
              <div className="flex items-center gap-2">
                <span className="w-2.5 h-2.5 rounded-full bg-[#32D39A]" />
                <span className="text-xs font-bold text-[#32D39A] uppercase">TOP PERFORMING EXEMPLAR</span>
              </div>
              <span className="px-2 py-0.5 rounded bg-[#32D39A]/10 text-[#32D39A] text-[10px] font-bold">
                98.4% CONF
              </span>
            </div>
            <div className="space-y-1">
              <div className="text-white font-bold">RUN-20261004-95D6E5 (OHRC ↔ OHRC)</div>
              <div className="text-[#8D98A5] text-[11px]">Tycho Crater Rim (180° Sun Azimuth Δ)</div>
              <div className="text-white/80 text-[11px] pt-1">
                Inliers: 124 (88.6%) • RMSE: 0.38 px • Scale: 1.0×
              </div>
            </div>
            <div className="pt-2 flex items-center gap-2">
              <Link
                href="/correspondence?source=ch2_ohr_ncp_20220324T184000_d_img_d18&target=ch2_ohr_ncp_20220310T061500_d_img_d18"
                className="px-3 py-1 rounded bg-[#32D39A]/10 hover:bg-[#32D39A]/20 text-[#32D39A] border border-[#32D39A]/30 text-[10px] font-bold"
              >
                OPEN IN WORKBENCH
              </Link>
            </div>
          </div>

          {/* CHALLENGING CASE */}
          <div className="rounded-[12px] bg-[#0A1118] border border-[#FFB547]/30 p-5 space-y-3 font-mono text-xs shadow-md">
            <div className="flex items-center justify-between border-b border-white/[0.06] pb-2">
              <div className="flex items-center gap-2">
                <span className="w-2.5 h-2.5 rounded-full bg-[#FFB547]" />
                <span className="text-xs font-bold text-[#FFB547] uppercase">HIGH-COMPLEXITY EXEMPLAR</span>
              </div>
              <span className="px-2 py-0.5 rounded bg-[#FFB547]/10 text-[#FFB547] text-[10px] font-bold">
                320× SCALE
              </span>
            </div>
            <div className="space-y-1">
              <div className="text-white font-bold">RUN-20261001-F38D90 (OHRC ↔ IIRS)</div>
              <div className="text-[#8D98A5] text-[11px]">Aristarchus Plateau Pyroclastic Band</div>
              <div className="text-white/80 text-[11px] pt-1">
                Inliers: 59 (65.6%) • RMSE: 1.45 px • Conf: 78.5%
              </div>
            </div>
            <div className="pt-2 flex items-center gap-2">
              <Link
                href="/correspondence?source=ch2_ohr_ncp_20210519T143000_d_img_d18&target=ch2_iir_ncn_20211005T182000_d_cub_d18"
                className="px-3 py-1 rounded bg-[#FFB547]/10 hover:bg-[#FFB547]/20 text-[#FFB547] border border-[#FFB547]/30 text-[10px] font-bold"
              >
                OPEN IN WORKBENCH
              </Link>
            </div>
          </div>

        </div>

        {/* ========================================================
            2. BENCHMARK QUERY FILTERS
           ======================================================== */}
        <div className="rounded-[12px] bg-[#0A1118] border border-white/[0.08] p-4 space-y-3">
          <div className="flex flex-col md:flex-row md:items-center justify-between gap-3">
            <div className="flex flex-wrap items-center gap-2 flex-1">
              {/* Search */}
              <div className="relative min-w-[200px] flex-1 sm:flex-none">
                <Search className="w-3.5 h-3.5 absolute left-2.5 top-2.5 text-[#8D98A5]" />
                <input
                  type="text"
                  placeholder="Search run ID, region, or product..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="w-full bg-[#05090D] border border-white/10 text-white pl-8 pr-3 py-1.5 rounded-lg text-xs font-mono focus:outline-none focus:border-[#38A8FF]"
                />
              </div>

              {/* Payload Pair Filter */}
              <select
                value={pairFilter}
                onChange={(e) => setPairFilter(e.target.value)}
                className="bg-[#05090D] border border-white/10 text-white px-2.5 py-1.5 rounded-lg text-xs font-mono focus:outline-none"
              >
                <option value="ALL">All Modality Pairs</option>
                <option value="OHRC ↔ OHRC">OHRC ↔ OHRC (1× Scale)</option>
                <option value="TMC-2 ↔ TMC-2">TMC-2 ↔ TMC-2 (Stereo)</option>
                <option value="OHRC ↔ TMC-2">OHRC ↔ TMC-2 (20× Scale)</option>
                <option value="TMC-2 ↔ IIRS">TMC-2 ↔ IIRS (16× Scale)</option>
                <option value="OHRC ↔ IIRS">OHRC ↔ IIRS (320× Scale)</option>
              </select>

              {/* Status Filter */}
              <select
                value={statusFilter}
                onChange={(e) => setStatusFilter(e.target.value)}
                className="bg-[#05090D] border border-white/10 text-white px-2.5 py-1.5 rounded-lg text-xs font-mono focus:outline-none"
              >
                <option value="ALL">All Statuses</option>
                <option value="COMPLETED">Completed</option>
                <option value="FAILED">Failed / Rejected</option>
              </select>

              {/* Confidence Threshold */}
              <select
                value={minConfidence}
                onChange={(e) => setMinConfidence(parseFloat(e.target.value))}
                className="bg-[#05090D] border border-white/10 text-white px-2.5 py-1.5 rounded-lg text-xs font-mono focus:outline-none"
              >
                <option value="0">Min Conf: Any</option>
                <option value="50">&gt; 50% Confidence</option>
                <option value="80">&gt; 80% High Conf</option>
                <option value="90">&gt; 90% Scientific</option>
              </select>
            </div>

            <button
              onClick={handleResetFilters}
              className="px-3 py-1.5 rounded-lg bg-white/5 hover:bg-white/10 text-[#8D98A5] hover:text-white text-xs font-mono transition-colors"
            >
              Reset Filters
            </button>
          </div>
        </div>

        {/* ========================================================
            3. REAL BENCHMARK RECORDS TABLE
           ======================================================== */}
        <div className="rounded-[12px] bg-[#0A1118] border border-white/[0.08] p-5 space-y-4">
          <div className="flex items-center justify-between border-b border-white/[0.06] pb-3">
            <div className="flex items-center gap-2">
              <span className="w-2 h-2 rounded-full bg-[#38A8FF]" />
              <h3 className="text-xs font-tech font-bold uppercase tracking-wider text-[#F4F6F8]">
                CHANDRAYAAN-2 CORRESPONDENCE RUN CATALOG ({totalCount} RECORDS)
              </h3>
            </div>
            <span className="text-[10px] font-mono text-[#8D98A5]">
              Page {currentPage} of {Math.max(1, Math.ceil(totalCount / itemsPerPage))}
            </span>
          </div>

          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs font-mono">
              <thead className="bg-[#05090D] border-b border-white/[0.08] text-[#59636E] text-[10px] uppercase tracking-wider">
                <tr>
                  <th onClick={() => handleSort('id')} className="py-2.5 px-3 cursor-pointer hover:text-white">
                    <div className="flex items-center gap-1">Run ID <ArrowUpDown className="w-3 h-3" /></div>
                  </th>
                  <th className="py-2.5 px-3">Pair Modality</th>
                  <th onClick={() => handleSort('region')} className="py-2.5 px-3 cursor-pointer hover:text-white">
                    <div className="flex items-center gap-1">Region <ArrowUpDown className="w-3 h-3" /></div>
                  </th>
                  <th onClick={() => handleSort('inlier_ratio_pct')} className="py-2.5 px-3 cursor-pointer hover:text-white">
                    <div className="flex items-center gap-1">Inlier Ratio <ArrowUpDown className="w-3 h-3" /></div>
                  </th>
                  <th onClick={() => handleSort('rmse_px')} className="py-2.5 px-3 cursor-pointer hover:text-white">
                    <div className="flex items-center gap-1">RMSE <ArrowUpDown className="w-3 h-3" /></div>
                  </th>
                  <th onClick={() => handleSort('confidence_pct')} className="py-2.5 px-3 cursor-pointer hover:text-white">
                    <div className="flex items-center gap-1">Confidence <ArrowUpDown className="w-3 h-3" /></div>
                  </th>
                  <th className="py-2.5 px-3">Sun Δ Az</th>
                  <th className="py-2.5 px-3">Scale</th>
                  <th className="py-2.5 px-3 text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-white/[0.04]">
                {runs.length === 0 ? (
                  <tr>
                    <td colSpan={9} className="py-8 text-center text-[#59636E] text-xs">
                      {loading ? 'Querying benchmark database records...' : 'No benchmark records match active filters.'}
                    </td>
                  </tr>
                ) : (
                  runs.map((r) => (
                    <tr key={r.id} className="hover:bg-white/[0.02] transition-colors">
                      <td className="py-3 px-3 font-bold text-[#38A8FF]">
                        {r.id}
                      </td>
                      <td className="py-3 px-3">
                        <span className="px-2 py-0.5 rounded text-[10px] font-bold bg-white/5 text-white/90 border border-white/10">
                          {r.payload_pair}
                        </span>
                      </td>
                      <td className="py-3 px-3 text-white/80">
                        {r.region}
                      </td>
                      <td className="py-3 px-3 text-[#32D39A] font-bold">
                        {r.inlier_ratio_pct}% ({r.verified_inliers}/{r.candidate_matches})
                      </td>
                      <td className="py-3 px-3 text-[#38A8FF]">
                        {r.rmse_px} px
                      </td>
                      <td className="py-3 px-3 text-[#32D39A] font-bold">
                        {r.confidence_pct}%
                      </td>
                      <td className="py-3 px-3 text-[#FFB547]">
                        Δ {r.sun_delta_azimuth}°
                      </td>
                      <td className="py-3 px-3 text-white/70">
                        {r.scale_ratio}×
                      </td>
                      <td className="py-3 px-3 text-right">
                        <div className="flex items-center justify-end gap-1.5">
                          <button
                            onClick={() => setSelectedRun(r)}
                            className="px-2 py-1 rounded bg-[#38A8FF]/10 hover:bg-[#38A8FF]/20 text-[#38A8FF] text-[10px] font-bold"
                          >
                            VIEW
                          </button>
                          <Link
                            href={`/correspondence?source=${r.reference_id}&target=${r.target_id}`}
                            className="px-2 py-1 rounded bg-white/5 hover:bg-white/10 text-white/80 text-[10px]"
                            title="Open in Correspondence Workbench"
                          >
                            MATCH
                          </Link>
                          <a
                            href={`${apiBase}/api/reports/${r.id}/pdf?source=${r.reference_id}&target=${r.target_id}`}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="px-2 py-1 rounded bg-white/5 hover:bg-white/10 text-white/80 text-[10px]"
                            title="Printable PDF report"
                          >
                            PDF
                          </a>
                          <button
                            onClick={() => handleDeleteRun(r.id)}
                            className="p-1 rounded text-white/40 hover:text-[#FF5C67]"
                            title="Delete Run"
                          >
                            <Trash2 className="w-3 h-3" />
                          </button>
                        </div>
                      </td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>

          {/* Pagination Controls */}
          <div className="flex items-center justify-between pt-3 border-t border-white/[0.04] text-xs font-mono text-[#8D98A5]">
            <div>Showing {runs.length} of {totalCount} total results</div>
            <div className="flex items-center gap-2">
              <button
                disabled={currentPage <= 1}
                onClick={() => setCurrentPage(prev => Math.max(1, prev - 1))}
                className="px-2.5 py-1 rounded bg-white/5 hover:bg-white/10 text-white disabled:opacity-30"
              >
                Previous
              </button>
              <span className="px-2 font-bold text-white">{currentPage}</span>
              <button
                disabled={currentPage >= Math.ceil(totalCount / itemsPerPage)}
                onClick={() => setCurrentPage(prev => prev + 1)}
                className="px-2.5 py-1 rounded bg-white/5 hover:bg-white/10 text-white disabled:opacity-30"
              >
                Next
              </button>
            </div>
          </div>
        </div>

        {/* ========================================================
            4. INTERACTIVE BENCHMARK CHARTS
           ======================================================== */}
        {chartData && (
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            
            {/* Chart 1: Confidence by Payload Pair */}
            <div className="rounded-[12px] bg-[#0A1118] border border-white/[0.08] p-5 space-y-4">
              <div className="flex items-center justify-between border-b border-white/[0.06] pb-2">
                <h3 className="text-xs font-tech font-bold uppercase tracking-wider text-[#F4F6F8]">
                  CONFIDENCE SCORE BY PAYLOAD MODALITY PAIR
                </h3>
                <span className="text-[10px] font-mono text-[#8D98A5]">5 Modality Tiers</span>
              </div>
              <div className="space-y-3 pt-2 font-mono text-xs">
                {chartData.confidence_by_pair.map((item: any, i: number) => (
                  <div key={i} className="space-y-1">
                    <div className="flex justify-between text-[11px]">
                      <span className="text-white">{item.pair}</span>
                      <span className="text-[#32D39A] font-bold">{item.confidence}% (RMSE: {item.rmse}px)</span>
                    </div>
                    <div className="w-full h-2 rounded bg-[#05090D] overflow-hidden border border-white/5">
                      <div
                        className="h-full bg-gradient-to-r from-[#38A8FF] to-[#32D39A] rounded"
                        style={{ width: `${item.confidence}%` }}
                      />
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Chart 2: Sun-Angle Delta vs Inlier Ratio */}
            <div className="rounded-[12px] bg-[#0A1118] border border-white/[0.08] p-5 space-y-4">
              <div className="flex items-center justify-between border-b border-white/[0.06] pb-2">
                <h3 className="text-xs font-tech font-bold uppercase tracking-wider text-[#F4F6F8]">
                  INLIER RETENTION VS SOLAR ANGLE DIFFERENCE (Δ DEG)
                </h3>
                <span className="text-[10px] font-mono text-[#8D98A5]">Opposite Sun Testing</span>
              </div>
              <div className="space-y-3 pt-2 font-mono text-xs">
                {chartData.inlier_ratio_vs_sun_delta.map((item: any, i: number) => (
                  <div key={i} className="space-y-1">
                    <div className="flex justify-between text-[11px]">
                      <span className="text-white">Δ {item.delta_deg}° Solar Azimuth</span>
                      <span className="text-[#FFB547] font-bold">{item.inlier_pct}% Inliers (Conf: {item.confidence}%)</span>
                    </div>
                    <div className="w-full h-2 rounded bg-[#05090D] overflow-hidden border border-white/5">
                      <div
                        className="h-full bg-gradient-to-r from-[#FFB547] to-[#32D39A] rounded"
                        style={{ width: `${item.inlier_pct}%` }}
                      />
                    </div>
                  </div>
                ))}
              </div>
            </div>

          </div>
        )}

        {/* ========================================================
            MODAL: BENCHMARK RUN DETAIL
           ======================================================== */}
        {selectedRun && (
          <div className="fixed inset-0 z-50 bg-black/80 backdrop-blur-sm flex items-center justify-center p-4">
            <div className="bg-[#0A1118] border border-white/15 rounded-2xl max-w-2xl w-full max-h-[85vh] flex flex-col shadow-2xl overflow-hidden font-mono text-xs">
              <div className="p-4 border-b border-white/10 flex items-center justify-between">
                <div>
                  <h3 className="text-sm font-bold text-white uppercase">
                    BENCHMARK RUN DETAIL // {selectedRun.id}
                  </h3>
                  <div className="text-xs text-[#8D98A5]">{selectedRun.region}</div>
                </div>
                <button onClick={() => setSelectedRun(null)} className="p-1 rounded text-white/60 hover:text-white">
                  <X className="w-5 h-5" />
                </button>
              </div>

              <div className="p-5 overflow-y-auto space-y-4">
                <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
                  <div className="bg-[#05090D] p-3 rounded-lg border border-white/5">
                    <span className="text-[#59636E] block text-[9px] uppercase">Confidence</span>
                    <span className="text-[#32D39A] font-bold text-base">{selectedRun.confidence_pct}%</span>
                  </div>
                  <div className="bg-[#05090D] p-3 rounded-lg border border-white/5">
                    <span className="text-[#59636E] block text-[9px] uppercase">RMSE Error</span>
                    <span className="text-[#38A8FF] font-bold text-base">{selectedRun.rmse_px} px</span>
                  </div>
                  <div className="bg-[#05090D] p-3 rounded-lg border border-white/5">
                    <span className="text-[#59636E] block text-[9px] uppercase">Inlier Ratio</span>
                    <span className="text-[#32D39A] font-bold text-base">{selectedRun.inlier_ratio_pct}%</span>
                  </div>
                  <div className="bg-[#05090D] p-3 rounded-lg border border-white/5">
                    <span className="text-[#59636E] block text-[9px] uppercase">Scale Ratio</span>
                    <span className="text-white font-bold text-base">{selectedRun.scale_ratio}×</span>
                  </div>
                </div>

                <div className="bg-[#05090D] p-3.5 rounded-xl border border-white/5 space-y-2">
                  <div className="text-[#38A8FF] font-bold border-b border-white/5 pb-1">OBSERVATION IDENTIFIERS</div>
                  <div>Reference Product: <span className="text-white">{selectedRun.reference_id} ({selectedRun.reference_payload})</span></div>
                  <div>Target Product: <span className="text-white">{selectedRun.target_id} ({selectedRun.target_payload})</span></div>
                  <div>Solar Delta: <span className="text-[#FFB547]">Δ El: {selectedRun.sun_delta_elevation}° • Δ Az: {selectedRun.sun_delta_azimuth}°</span></div>
                  <div>Sub-Pixel Accuracy: <span className="text-[#32D39A]">{selectedRun.subpixel_error_px} px residual</span></div>
                </div>

                <div className="flex items-center justify-between pt-2">
                  <Link
                    href={`/correspondence?source=${selectedRun.reference_id}&target=${selectedRun.target_id}`}
                    className="px-4 py-2 rounded-xl bg-gradient-to-r from-[#2F80FF] to-[#00B8FF] text-white font-bold uppercase"
                  >
                    OPEN IN WORKBENCH
                  </Link>

                  <a
                    href={`${apiBase}/api/reports/${selectedRun.id}/pdf?source=${selectedRun.reference_id}&target=${selectedRun.target_id}`}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="px-4 py-2 rounded-xl bg-white/10 hover:bg-white/15 text-white uppercase border border-white/10"
                  >
                    VIEW REPORT
                  </a>
                </div>
              </div>
            </div>
          </div>
        )}

      </div>
    </EdolusShell>
  );
}
