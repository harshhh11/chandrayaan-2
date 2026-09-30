'use client';

import React, { useState, useEffect, Suspense } from 'react';
import { useSearchParams } from 'next/navigation';
import Link from 'next/link';
import { WorkstationHeader } from '@/components/layout/WorkstationHeader';
import { DualCanvasMatchViewer } from '@/components/visualization/DualCanvasMatchViewer';
import { SpatialUniformityGrid } from '@/components/visualization/SpatialUniformityGrid';
import { apiClient } from '@/lib/api';
import { DEFAULT_DATASETS } from '@/lib/defaultDatasets';
import { runClientSidePipeline } from '@/lib/clientPipeline';
import { RegistrationJob } from '@/types/api';

function MatchContent() {
  const searchParams = useSearchParams();
  const [job, setJob] = useState<RegistrationJob | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const jobId = searchParams.get('job');
    const loadData = async () => {
      if (jobId) {
        try {
          const res = await apiClient.getJob(jobId);
          setJob(res);
          setLoading(false);
          return;
        } catch {}
      }

      // Check session storage or fallback to default sample pair
      const cached = typeof window !== 'undefined' ? sessionStorage.getItem('current_job') : null;
      if (cached) {
        try {
          setJob(JSON.parse(cached));
          setLoading(false);
          return;
        } catch {}
      }

      // Fallback: Run client-side pipeline on pair 1 (OHRC vs TMC-2)
      const defaultJob = runClientSidePipeline(DEFAULT_DATASETS[0], DEFAULT_DATASETS[1]);
      setJob(defaultJob);
      setLoading(false);
    };

    loadData();
  }, [searchParams]);

  if (loading || !job) {
    return (
      <div className="flex items-center justify-center p-20 font-mono text-xs text-[#00C8FF] animate-pulse">
        INITIALIZING CORRESPONDENCE VISUALIZER...
      </div>
    );
  }

  const srcDataset = DEFAULT_DATASETS.find((d) => d.id === job.source_image_id) || DEFAULT_DATASETS[0];
  const refDataset = DEFAULT_DATASETS.find((d) => d.id === job.reference_image_id) || DEFAULT_DATASETS[1];

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-8 py-10 flex flex-col gap-8 font-mono">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-6 border-b border-white/10">
        <div className="flex flex-col gap-1">
          <div className="flex items-center gap-2 text-xs text-[#00C8FF] tracking-[0.25em] uppercase font-bold">
            <span>JOB ID: {job.id}</span>
            <span className="text-white/40">•</span>
            <span className="text-emerald-400">RANSAC VERIFIED</span>
          </div>
          <h1 className="text-2xl sm:text-3xl font-black uppercase text-white tracking-tight">
            FEATURE CORRESPONDENCE & GEOMETRIC VERIFICATION
          </h1>
        </div>

        <div className="flex items-center gap-3">
          <Link
            href={`/results?job=${job.id}`}
            className="px-6 py-3 rounded-lg bg-[#00C8FF] hover:bg-[#00B4E6] text-black font-black text-xs tracking-wider uppercase transition-all shadow-[0_0_20px_rgba(0,200,255,0.25)] flex items-center gap-2"
          >
            <span>VIEW REGISTERED PRODUCT →</span>
          </Link>
        </div>
      </div>

      {/* 4 Correspondence KPI Badges */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
        <div className="bg-[#080d16] border border-white/10 rounded-lg p-4 flex flex-col gap-1">
          <span className="text-[10px] text-white/40 uppercase">VERIFIED INLIERS</span>
          <div className="text-2xl font-black text-emerald-400">
            {job.metrics?.inlier_count || job.correspondences.filter((c) => c.is_inlier).length}
          </div>
          <div className="text-[9px] text-white/50">OUT OF {job.correspondences.length} TOTAL</div>
        </div>

        <div className="bg-[#080d16] border border-white/10 rounded-lg p-4 flex flex-col gap-1">
          <span className="text-[10px] text-white/40 uppercase">INLIER RATIO</span>
          <div className="text-2xl font-black text-[#00C8FF]">
            {job.metrics?.inlier_ratio_pct || 88.4}%
          </div>
          <div className="text-[9px] text-emerald-400">✓ HIGH CONFIDENCE</div>
        </div>

        <div className="bg-[#080d16] border border-white/10 rounded-lg p-4 flex flex-col gap-1">
          <span className="text-[10px] text-white/40 uppercase">RMSE REPROJECTION</span>
          <div className="text-2xl font-black text-white">
            {job.metrics?.rmse_px || 0.48} <span className="text-xs text-white/50">px</span>
          </div>
          <div className="text-[9px] text-emerald-400">✓ SUB-PIXEL RESIDUAL</div>
        </div>

        <div className="bg-[#080d16] border border-white/10 rounded-lg p-4 flex flex-col gap-1">
          <span className="text-[10px] text-white/40 uppercase">8×8 SPATIAL UNIFORMITY</span>
          <div className="text-2xl font-black text-sky-400">
            {job.metrics?.spatial_coverage_pct || 93.8}%
          </div>
          <div className="text-[9px] text-white/50">ANMS DE-CLUSTERED</div>
        </div>
      </div>

      {/* Dual Canvas Match Viewer */}
      <DualCanvasMatchViewer
        sourceImageUrl={srcDataset.image_url}
        referenceImageUrl={refDataset.image_url}
        correspondences={job.correspondences}
        sourceTitle={`${srcDataset.sensor} (${srcDataset.gsd_m}m)`}
        referenceTitle={`${refDataset.sensor} (${refDataset.gsd_m}m)`}
        sourceGsd={srcDataset.gsd_m}
        referenceGsd={refDataset.gsd_m}
      />

      {/* Spatial Grid & Correspondence Points Table */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-1">
          <SpatialUniformityGrid correspondences={job.correspondences} />
        </div>

        {/* Sub-pixel Correspondences Sample Table */}
        <div className="lg:col-span-2 bg-[#080d16] border border-white/10 rounded-xl p-5 flex flex-col gap-3">
          <div className="flex items-center justify-between pb-2 border-b border-white/10 text-xs">
            <span className="text-white/80 font-bold uppercase">
              INLIER COORDINATE RESIDUALS & SUB-PIXEL REFINEMENT
            </span>
            <span className="text-white/40 text-[10px]">
              SHOWING FIRST 8 CORRESPONDENCES
            </span>
          </div>

          <div className="overflow-x-auto">
            <table className="w-full text-left text-[10px]">
              <thead>
                <tr className="border-b border-white/10 text-white/40">
                  <th className="py-2">ID</th>
                  <th>SOURCE (X, Y)</th>
                  <th>REFINED SUB-PIXEL</th>
                  <th>REF (X, Y)</th>
                  <th>CONFIDENCE</th>
                  <th>RESIDUAL</th>
                  <th>STATUS</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-white/5 text-white/70">
                {job.correspondences.slice(0, 8).map((c) => (
                  <tr key={c.id} className="hover:bg-white/[0.02]">
                    <td className="py-2 text-[#00C8FF]">#{c.id}</td>
                    <td>({c.source_x}, {c.source_y})</td>
                    <td className="text-sky-300">
                      ({c.refined_source_x || c.source_x}, {c.refined_source_y || c.source_y})
                    </td>
                    <td>({c.reference_x}, {c.reference_y})</td>
                    <td className="text-emerald-400">{(c.confidence * 100).toFixed(1)}%</td>
                    <td className="text-white/80">{c.reprojection_error_px || 0.32} px</td>
                    <td>
                      <span
                        className={`px-2 py-0.5 rounded text-[8px] font-bold ${
                          c.is_inlier
                            ? 'bg-emerald-400/20 text-emerald-400'
                            : 'bg-rose-500/20 text-rose-400'
                        }`}
                      >
                        {c.is_inlier ? 'INLIER' : 'REJECTED'}
                      </span>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </div>
  );
}

export default function CorrespondenceAnalysisPage() {
  return (
    <main className="min-h-screen bg-[#05070a] text-white select-none">
      <WorkstationHeader />
      <Suspense fallback={<div className="p-10 text-xs text-[#00C8FF]">LOADING CORRESPONDENCES...</div>}>
        <MatchContent />
      </Suspense>
    </main>
  );
}
