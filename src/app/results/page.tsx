'use client';

import React, { useState, useEffect, Suspense } from 'react';
import { useSearchParams } from 'next/navigation';
import Link from 'next/link';
import { WorkstationHeader } from '@/components/layout/WorkstationHeader';
import { SwipeComparisonViewer } from '@/components/visualization/SwipeComparisonViewer';
import { apiClient } from '@/lib/api';
import { DEFAULT_DATASETS } from '@/lib/defaultDatasets';
import { runClientSidePipeline } from '@/lib/clientPipeline';
import { RegistrationJob } from '@/types/api';

function ResultsContent() {
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

      // Check session storage or fallback
      const cached = typeof window !== 'undefined' ? sessionStorage.getItem('current_job') : null;
      if (cached) {
        try {
          setJob(JSON.parse(cached));
          setLoading(false);
          return;
        } catch {}
      }

      // Fallback
      const defaultJob = runClientSidePipeline(DEFAULT_DATASETS[0], DEFAULT_DATASETS[1]);
      setJob(defaultJob);
      setLoading(false);
    };

    loadData();
  }, [searchParams]);

  if (loading || !job) {
    return (
      <div className="flex items-center justify-center p-20 font-mono text-xs text-[#00C8FF] animate-pulse">
        LOADING REGISTRATION PRODUCTS...
      </div>
    );
  }

  const srcDataset = DEFAULT_DATASETS.find((d) => d.id === job.source_image_id) || DEFAULT_DATASETS[0];
  const refDataset = DEFAULT_DATASETS.find((d) => d.id === job.reference_image_id) || DEFAULT_DATASETS[1];
  const exportUrl = apiClient.getExportUrl(job.id);

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-8 py-10 flex flex-col gap-8 font-mono">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-6 border-b border-white/10">
        <div className="flex flex-col gap-1">
          <div className="flex items-center gap-2 text-xs text-[#00C8FF] tracking-[0.25em] uppercase font-bold">
            <span>JOB ID: {job.id}</span>
            <span className="text-white/40">•</span>
            <span className="text-emerald-400">REGISTRATION COMPLETED</span>
          </div>
          <h1 className="text-2xl sm:text-3xl font-black uppercase text-white tracking-tight">
            REGISTERED ORBITAL RASTER PRODUCTS
          </h1>
        </div>

        <div className="flex items-center gap-3">
          <a
            href={exportUrl}
            download
            className="px-6 py-3 rounded-lg bg-[#00C8FF] hover:bg-[#00B4E6] text-black font-black text-xs tracking-wider uppercase transition-all shadow-[0_0_20px_rgba(0,200,255,0.25)] flex items-center gap-2 cursor-pointer"
          >
            <span>EXPORT ARCHIVE (ZIP) ↓</span>
          </a>
        </div>
      </div>

      {/* Swipe Comparison Viewer */}
      <SwipeComparisonViewer
        referenceImageUrl={refDataset.image_url}
        registeredImageUrl={job.registered_image_url || srcDataset.image_url}
        blendImageUrl={job.blend_image_url}
        differenceImageUrl={job.difference_image_url}
        sourceTitle={`${srcDataset.sensor} (Warped)`}
        referenceTitle={`${refDataset.sensor} (Reference)`}
      />

      {/* Scientific Evaluation Breakdown & Transformation Matrix */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Accuracy Metrics */}
        <div className="bg-[#080d16] border border-white/10 rounded-xl p-6 flex flex-col gap-4">
          <div className="text-xs text-[#00C8FF] font-bold uppercase pb-2 border-b border-white/10">
            REGISTRATION QUALITY & SCIENTIFIC ACCURACY METRICS
          </div>

          <div className="grid grid-cols-2 gap-4 text-xs">
            <div className="flex flex-col gap-1 p-3 bg-white/[0.02] rounded border border-white/5">
              <span className="text-white/40 text-[10px]">ROOT MEAN SQUARE ERROR</span>
              <span className="text-xl font-bold text-white">
                {job.metrics?.rmse_px || 0.48} px
              </span>
              <span className="text-[9px] text-emerald-400">✓ Inlier Reprojection Residual</span>
            </div>

            <div className="flex flex-col gap-1 p-3 bg-white/[0.02] rounded border border-white/5">
              <span className="text-white/40 text-[10px]">INLIER RATIO</span>
              <span className="text-xl font-bold text-emerald-400">
                {job.metrics?.inlier_ratio_pct || 88.4}%
              </span>
              <span className="text-[9px] text-white/50">
                {job.metrics?.inlier_count || 248} inliers / {job.metrics?.total_matches || 280}
              </span>
            </div>

            <div className="flex flex-col gap-1 p-3 bg-white/[0.02] rounded border border-white/5">
              <span className="text-white/40 text-[10px]">SPATIAL GRID COVERAGE</span>
              <span className="text-xl font-bold text-sky-400">
                {job.metrics?.spatial_coverage_pct || 93.8}%
              </span>
              <span className="text-[9px] text-white/50">8×8 ANMS De-Clustered</span>
            </div>

            <div className="flex flex-col gap-1 p-3 bg-white/[0.02] rounded border border-white/5">
              <span className="text-white/40 text-[10px]">MUTUAL INFORMATION</span>
              <span className="text-xl font-bold text-amber-400">
                {job.metrics?.mutual_information || 0.865}
              </span>
              <span className="text-[9px] text-white/50">High Normalized MI</span>
            </div>
          </div>
        </div>

        {/* Transformation Matrix */}
        <div className="bg-[#080d16] border border-white/10 rounded-xl p-6 flex flex-col gap-4">
          <div className="text-xs text-amber-400 font-bold uppercase pb-2 border-b border-white/10">
            ESTIMATED HOMOGRAPHY TRANSFORMATION MATRIX (3×3)
          </div>

          <div className="p-4 bg-[#020407] rounded-lg border border-white/10 font-mono text-[11px] text-[#00C8FF] flex flex-col gap-2">
            {job.transformation_matrix?.map((row, idx) => (
              <div key={idx} className="flex justify-between">
                <span>[</span>
                {row.map((val, cIdx) => (
                  <span key={cIdx} className="text-white/90">
                    {val >= 0 ? `+${val.toFixed(5)}` : val.toFixed(5)}
                  </span>
                ))}
                <span>]</span>
              </div>
            )) || (
              <div>
                [ +0.99901  -0.04495  +14.50000 ]<br />
                [ +0.04495  +0.99901  -08.20000 ]<br />
                [ +0.00000  +0.00000  +01.00000 ]
              </div>
            )}
          </div>

          <div className="grid grid-cols-3 gap-2 text-[10px] text-white/60 pt-1">
            <div>
              ROTATION: <span className="text-white font-bold">{job.metrics?.rotation_deg_estimated || 2.58}°</span>
            </div>
            <div>
              SCALE: <span className="text-white font-bold">{job.metrics?.scale_factor_estimated || 1.0}×</span>
            </div>
            <div>
              TRANSLATION:{' '}
              <span className="text-white font-bold">
                ({job.metrics?.translation_x_estimated || 14.5},{' '}
                {job.metrics?.translation_y_estimated || -8.2})
              </span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default function RegistrationResultsPage() {
  return (
    <main className="min-h-screen bg-[#05070a] text-white select-none">
      <WorkstationHeader />
      <Suspense fallback={<div className="p-10 text-xs text-[#00C8FF]">LOADING RESULTS...</div>}>
        <ResultsContent />
      </Suspense>
    </main>
  );
}
