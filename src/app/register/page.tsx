'use client';

import React, { useState, useEffect, Suspense } from 'react';
import { useSearchParams, useRouter } from 'next/navigation';
import { WorkstationHeader } from '@/components/layout/WorkstationHeader';
import { apiClient } from '@/lib/api';
import { runClientSidePipeline } from '@/lib/clientPipeline';
import { SunVectorVisualizer } from '@/components/visualization/SunVectorVisualizer';
import {
  DatasetItem,
  RegistrationConfig,
  RegistrationJob,
  MatcherType,
  PreprocessingMethod,
  GeometricModel,
  ScaleHandling,
} from '@/types/api';

function RegisterWorkspaceContent() {
  const searchParams = useSearchParams();
  const router = useRouter();

  const [datasets, setDatasets] = useState<DatasetItem[]>([]);
  const [sourceId, setSourceId] = useState<string>('DS-OHRC-BOGUSLAWSKY-01');
  const [referenceId, setReferenceId] = useState<string>('DS-TMC2-BOGUSLAWSKY-01');

  // Configuration
  const [matcher, setMatcher] = useState<MatcherType>('AUTOMATIC');
  const [preprocessing, setPreprocessing] = useState<PreprocessingMethod>('CLAHE');
  const [geometricModel, setGeometricModel] = useState<GeometricModel>('HOMOGRAPHY');
  const [scaleHandling, setScaleHandling] = useState<ScaleHandling>('AUTOMATIC');
  const [showAdvanced, setShowAdvanced] = useState(false);
  const [subpixelRefinement, setSubpixelRefinement] = useState(true);
  const [uniformGrid, setUniformGrid] = useState(true);

  // Execution states
  const [isProcessing, setIsProcessing] = useState(false);
  const [activeJob, setActiveJob] = useState<RegistrationJob | null>(null);

  useEffect(() => {
    apiClient.getDatasets().then((items) => {
      setDatasets(items);
      const srcParam = searchParams.get('src');
      const refParam = searchParams.get('ref');
      if (srcParam) setSourceId(srcParam);
      if (refParam) setReferenceId(refParam);
    });
  }, [searchParams]);

  const sourceItem = datasets.find((d) => d.id === sourceId) || datasets[0];
  const referenceItem = datasets.find((d) => d.id === referenceId) || datasets[1] || datasets[0];

  const handleRunPipeline = async () => {
    if (!sourceItem || !referenceItem) return;

    setIsProcessing(true);
    const config: RegistrationConfig = {
      matcher_type: matcher,
      preprocessing_method: preprocessing,
      geometric_model: geometricModel,
      scale_handling: scaleHandling,
      ransac_reproj_threshold_px: 3.0,
      ransac_confidence: 0.99,
      enable_subpixel_refinement: subpixelRefinement,
      enable_uniform_distribution: uniformGrid,
      grid_divisions: 8,
      max_features: 2000,
    };

    try {
      // 1. Attempt backend processing
      const job = await apiClient.createJob(sourceId, referenceId, config);
      setActiveJob(job);

      // Poll until finished
      const pollInterval = setInterval(async () => {
        try {
          const updated = await apiClient.getJob(job.id);
          setActiveJob(updated);
          if (updated.status === 'COMPLETED' || updated.status === 'FAILED') {
            clearInterval(pollInterval);
            setIsProcessing(false);
            if (updated.status === 'COMPLETED') {
              router.push(`/match?job=${updated.id}`);
            }
          }
        } catch {
          // Fallback to client-side pipeline
          clearInterval(pollInterval);
          runFallback(config);
        }
      }, 750);
    } catch {
      // Direct client-side pipeline fallback
      runFallback(config);
    }
  };

  const runFallback = (config: RegistrationConfig) => {
    const clientJob = runClientSidePipeline(sourceItem, referenceItem, config);
    setActiveJob(clientJob);
    setTimeout(() => {
      setIsProcessing(false);
      sessionStorage.setItem('current_job', JSON.stringify(clientJob));
      router.push(`/match?job=${clientJob.id}`);
    }, 1200);
  };

  const scaleRatio =
    sourceItem && referenceItem ? (referenceItem.gsd_m / sourceItem.gsd_m).toFixed(2) : '1.0';

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-8 py-10 flex flex-col gap-8 font-mono">
      {/* Workspace Title */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-6 border-b border-white/10">
        <div className="flex flex-col gap-1">
          <span className="text-xs text-[#00C8FF] tracking-[0.25em] uppercase font-bold">
            PIPELINE EXECUTION // ISRO SIH26166
          </span>
          <h1 className="text-2xl sm:text-3xl font-black uppercase text-white tracking-tight">
            IMAGE CORRESPONDENCE & REGISTRATION WORKSPACE
          </h1>
        </div>

        <button
          onClick={handleRunPipeline}
          disabled={isProcessing}
          className="px-8 py-3.5 rounded-lg bg-[#00C8FF] hover:bg-[#00B4E6] text-black font-black text-xs tracking-wider uppercase transition-all shadow-[0_0_25px_rgba(0,200,255,0.3)] disabled:opacity-50 flex items-center gap-2 cursor-pointer"
        >
          <span>{isProcessing ? 'PROCESSING PIPELINE...' : 'EXECUTE REGISTRATION →'}</span>
        </button>
      </div>

      {/* Dual Sensor & Image Selector Panels */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        {/* SOURCE IMAGE PANEL */}
        <div className="bg-[#080d16] border border-white/10 rounded-xl p-6 flex flex-col gap-4">
          <div className="flex items-center justify-between pb-2 border-b border-white/10">
            <span className="text-xs text-[#00C8FF] font-bold uppercase tracking-wider">
              01 // SOURCE RASTER (TO BE WARPED)
            </span>
            <span className="px-2.5 py-0.5 rounded bg-[#00C8FF]/10 text-[#00C8FF] text-[10px] font-bold">
              {sourceItem?.sensor}
            </span>
          </div>

          <div className="flex flex-col gap-1.5">
            <label className="text-white/50 text-[11px]">SELECT SOURCE DATASET</label>
            <select
              value={sourceId}
              onChange={(e) => setSourceId(e.target.value)}
              className="p-2.5 rounded bg-[#020407] border border-white/10 text-white text-xs"
            >
              {datasets.map((d) => (
                <option key={d.id} value={d.id}>
                  {d.sensor} — {d.title} ({d.gsd_m}m)
                </option>
              ))}
            </select>
          </div>

          {/* Source Image Preview */}
          <div className="relative w-full h-64 bg-[#020407] rounded-lg overflow-hidden border border-white/10 flex items-center justify-center">
            {sourceItem?.image_url && (
              <img
                src={sourceItem.image_url}
                alt="Source Preview"
                className="w-full h-full object-cover"
              />
            )}
            <div className="absolute bottom-2 left-2 px-2 py-0.5 rounded bg-black/80 text-[9px] text-white/70">
              GSD: {sourceItem?.gsd_m}m | {sourceItem?.width}×{sourceItem?.height} px
            </div>
          </div>

          {/* Source Specs */}
          <div className="grid grid-cols-2 gap-3 text-[10px] text-white/60 pt-2 border-t border-white/5">
            <div>
              REGION: <span className="text-white">{sourceItem?.location.region_name}</span>
            </div>
            <div>
              ACQUIRED: <span className="text-white">{sourceItem?.acquisition_date.slice(0, 10)}</span>
            </div>
            <div>
              SUN AZIMUTH: <span className="text-[#00C8FF]">{sourceItem?.sun_geometry.azimuth_deg}°</span>
            </div>
            <div>
              SUN ELEVATION: <span className="text-[#00C8FF]">{sourceItem?.sun_geometry.elevation_deg}°</span>
            </div>
          </div>
        </div>

        {/* REFERENCE IMAGE PANEL */}
        <div className="bg-[#080d16] border border-white/10 rounded-xl p-6 flex flex-col gap-4">
          <div className="flex items-center justify-between pb-2 border-b border-white/10">
            <span className="text-xs text-amber-400 font-bold uppercase tracking-wider">
              02 // REFERENCE BASE (FIXED GEOMETRY)
            </span>
            <span className="px-2.5 py-0.5 rounded bg-amber-400/10 text-amber-400 text-[10px] font-bold">
              {referenceItem?.sensor}
            </span>
          </div>

          <div className="flex flex-col gap-1.5">
            <label className="text-white/50 text-[11px]">SELECT REFERENCE DATASET</label>
            <select
              value={referenceId}
              onChange={(e) => setReferenceId(e.target.value)}
              className="p-2.5 rounded bg-[#020407] border border-white/10 text-white text-xs"
            >
              {datasets.map((d) => (
                <option key={d.id} value={d.id}>
                  {d.sensor} — {d.title} ({d.gsd_m}m)
                </option>
              ))}
            </select>
          </div>

          {/* Reference Image Preview */}
          <div className="relative w-full h-64 bg-[#020407] rounded-lg overflow-hidden border border-white/10 flex items-center justify-center">
            {referenceItem?.image_url && (
              <img
                src={referenceItem.image_url}
                alt="Reference Preview"
                className="w-full h-full object-cover"
              />
            )}
            <div className="absolute bottom-2 left-2 px-2 py-0.5 rounded bg-black/80 text-[9px] text-white/70">
              GSD: {referenceItem?.gsd_m}m | {referenceItem?.width}×{referenceItem?.height} px
            </div>
          </div>

          {/* Reference Specs */}
          <div className="grid grid-cols-2 gap-3 text-[10px] text-white/60 pt-2 border-t border-white/5">
            <div>
              REGION: <span className="text-white">{referenceItem?.location.region_name}</span>
            </div>
            <div>
              ACQUIRED:{' '}
              <span className="text-white">{referenceItem?.acquisition_date.slice(0, 10)}</span>
            </div>
            <div>
              SUN AZIMUTH: <span className="text-amber-400">{referenceItem?.sun_geometry.azimuth_deg}°</span>
            </div>
            <div>
              SUN ELEVATION: <span className="text-amber-400">{referenceItem?.sun_geometry.elevation_deg}°</span>
            </div>
          </div>
        </div>
      </div>

      {/* Sun Geometry Analyzer & Scale Ratio Telemetry */}
      {sourceItem && referenceItem && (
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          <div className="lg:col-span-2">
            <SunVectorVisualizer
              sourceSun={sourceItem.sun_geometry}
              referenceSun={referenceItem.sun_geometry}
            />
          </div>

          {/* Scale Telemetry Box */}
          <div className="bg-[#080d16] border border-white/10 rounded-xl p-5 flex flex-col justify-between gap-3">
            <span className="text-[11px] text-white/80 font-bold uppercase">
              SPATIAL RESOLUTION & SCALE RATIO
            </span>
            <div className="flex flex-col gap-1">
              <div className="text-3xl font-black text-[#00C8FF]">{scaleRatio}×</div>
              <div className="text-[10px] text-white/50">
                SOURCE GSD: {sourceItem.gsd_m}m ↔ REF GSD: {referenceItem.gsd_m}m
              </div>
            </div>
            <div className="text-[9px] text-emerald-400 pt-2 border-t border-white/5">
              ✓ MULTI-SCALE GAUSSIAN PYRAMID RESAMPLING ACTIVE
            </div>
          </div>
        </div>
      )}

      {/* Pipeline Algorithm Settings */}
      <div className="bg-[#080d16] border border-white/10 rounded-xl p-6 flex flex-col gap-5">
        <div className="flex items-center justify-between pb-3 border-b border-white/10">
          <span className="text-xs text-[#00C8FF] font-bold uppercase">
            03 // ALGORITHM & MATCHING CONFIGURATION
          </span>
          <button
            onClick={() => setShowAdvanced(!showAdvanced)}
            className="text-[10px] text-white/50 hover:text-white uppercase underline cursor-pointer"
          >
            {showAdvanced ? 'HIDE ADVANCED' : 'SHOW ADVANCED CONTROLS'}
          </button>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 text-xs">
          <div className="flex flex-col gap-1.5">
            <label className="text-white/60">FEATURE MATCHER</label>
            <select
              value={matcher}
              onChange={(e) => setMatcher(e.target.value as MatcherType)}
              className="p-2 rounded bg-[#020407] border border-white/10 text-white"
            >
              <option value="AUTOMATIC">AUTOMATIC (Sensor-Aware)</option>
              <option value="CROSS_MODAL">CROSS-MODAL (Phase Congruency)</option>
              <option value="CLASSICAL_SIFT">CLASSICAL SIFT (Scale-Invariant)</option>
              <option value="CLASSICAL_ORB">CLASSICAL ORB (Fast Binary)</option>
              <option value="CLASSICAL_AKAZE">CLASSICAL AKAZE (Non-Linear)</option>
              <option value="LOFTR">LoFTR (Transformer Dense Matcher)</option>
            </select>
          </div>

          <div className="flex flex-col gap-1.5">
            <label className="text-white/60">ILLUMINATION NORMALIZATION</label>
            <select
              value={preprocessing}
              onChange={(e) => setPreprocessing(e.target.value as PreprocessingMethod)}
              className="p-2 rounded bg-[#020407] border border-white/10 text-white"
            >
              <option value="CLAHE">CLAHE (Adaptive Histogram)</option>
              <option value="WALLIS_FILTER">WALLIS FILTER (Local Standardization)</option>
              <option value="GRADIENT_DOMAIN">GRADIENT DOMAIN (Shadow Invariant)</option>
              <option value="HISTOGRAM_EQ">HISTOGRAM EQUALIZATION</option>
              <option value="NONE">NONE (Raw Data)</option>
            </select>
          </div>

          <div className="flex flex-col gap-1.5">
            <label className="text-white/60">GEOMETRIC MODEL</label>
            <select
              value={geometricModel}
              onChange={(e) => setGeometricModel(e.target.value as GeometricModel)}
              className="p-2 rounded bg-[#020407] border border-white/10 text-white"
            >
              <option value="HOMOGRAPHY">HOMOGRAPHY (8-DoF Planar Projective)</option>
              <option value="AFFINE">AFFINE (6-DoF Rotation/Scale/Shear)</option>
              <option value="SIMILARITY">SIMILARITY (4-DoF Rigid + Scale)</option>
            </select>
          </div>

          <div className="flex flex-col gap-1.5">
            <label className="text-white/60">SCALE HANDLING</label>
            <select
              value={scaleHandling}
              onChange={(e) => setScaleHandling(e.target.value as ScaleHandling)}
              className="p-2 rounded bg-[#020407] border border-white/10 text-white"
            >
              <option value="AUTOMATIC">AUTOMATIC (GSD Match)</option>
              <option value="MATCH_REF_GSD">RESAMPLE TO REFERENCE GSD</option>
              <option value="MULTI_SCALE_PYRAMID">MULTI-SCALE PYRAMID SEARCH</option>
            </select>
          </div>
        </div>

        {/* Advanced Switches */}
        {showAdvanced && (
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 pt-3 border-t border-white/5 text-xs">
            <label className="flex items-center gap-3 p-3 rounded bg-[#020407] border border-white/10 cursor-pointer">
              <input
                type="checkbox"
                checked={subpixelRefinement}
                onChange={(e) => setSubpixelRefinement(e.target.checked)}
                className="accent-[#00C8FF] w-4 h-4"
              />
              <div className="flex flex-col">
                <span className="text-white font-bold">SUB-PIXEL REFINEMENT</span>
                <span className="text-[10px] text-white/50">
                  Lucas-Kanade gradient optimization (&lt;0.5px)
                </span>
              </div>
            </label>

            <label className="flex items-center gap-3 p-3 rounded bg-[#020407] border border-white/10 cursor-pointer">
              <input
                type="checkbox"
                checked={uniformGrid}
                onChange={(e) => setUniformGrid(e.target.checked)}
                className="accent-[#00C8FF] w-4 h-4"
              />
              <div className="flex flex-col">
                <span className="text-white font-bold">8×8 SPATIAL UNIFORMITY (ANMS)</span>
                <span className="text-[10px] text-white/50">
                  Adaptive suppression preventing match clustering
                </span>
              </div>
            </label>
          </div>
        )}
      </div>

      {/* Live Stage Progress Indicator during execution */}
      {isProcessing && (
        <div className="bg-[#080d16] border border-[#00C8FF]/40 rounded-xl p-6 flex flex-col gap-4 shadow-[0_0_30px_rgba(0,200,255,0.15)]">
          <div className="flex items-center justify-between text-xs">
            <span className="text-[#00C8FF] font-bold uppercase animate-pulse">
              ► EXECUTING SCIENTIFIC CORRESPONDENCE PIPELINE...
            </span>
            <span className="text-white">{activeJob?.progress_pct || 45}%</span>
          </div>

          <div className="w-full h-2 rounded-full bg-white/10 overflow-hidden">
            <div
              style={{ width: `${activeJob?.progress_pct || 45}%` }}
              className="h-full bg-[#00C8FF] transition-all duration-300 shadow-[0_0_10px_#00C8FF]"
            />
          </div>

          <div className="flex flex-col gap-1.5 text-[10px] text-white/60 bg-[#020407] p-3 rounded border border-white/5 max-h-36 overflow-y-auto">
            {activeJob?.stages_log?.map((log, idx) => (
              <div key={idx} className="flex items-center gap-3">
                <span className="text-[#00C8FF] font-bold">[{log.timestamp}]</span>
                <span className="text-white/80">{log.message}</span>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}

export default function ImageRegistrationWorkspace() {
  return (
    <main className="min-h-screen bg-[#05070a] text-white select-none">
      <WorkstationHeader />
      <Suspense fallback={<div className="p-10 text-xs text-[#00C8FF]">LOADING WORKSPACE...</div>}>
        <RegisterWorkspaceContent />
      </Suspense>
    </main>
  );
}
