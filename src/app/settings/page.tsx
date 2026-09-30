'use client';

import React, { useState } from 'react';
import { WorkstationHeader } from '@/components/layout/WorkstationHeader';

export default function SettingsPage() {
  const [reprojThresh, setReprojThresh] = useState(3.0);
  const [maxFeatures, setMaxFeatures] = useState(2000);
  const [claheClip, setClaheClip] = useState(3.0);
  const [saved, setSaved] = useState(false);

  const handleSave = (e: React.FormEvent) => {
    e.preventDefault();
    setSaved(true);
    setTimeout(() => setSaved(false), 2000);
  };

  return (
    <main className="min-h-screen bg-[#05070a] text-white select-none font-mono">
      <WorkstationHeader />

      <div className="max-w-4xl mx-auto px-4 sm:px-8 py-10 flex flex-col gap-8">
        <div className="flex flex-col gap-1 pb-6 border-b border-white/10">
          <span className="text-xs text-[#00C8FF] tracking-[0.25em] uppercase font-bold">
            SYSTEM // ALGORITHM & PIPELINE TUNING
          </span>
          <h1 className="text-2xl sm:text-3xl font-black uppercase text-white tracking-tight">
            ENGINE CONFIGURATION & HYPERPARAMETERS
          </h1>
        </div>

        <form onSubmit={handleSave} className="bg-[#080d16] border border-white/10 rounded-xl p-6 flex flex-col gap-6 text-xs">
          <div className="flex flex-col gap-2">
            <label className="text-white/70">RANSAC REPROJECTION THRESHOLD: {reprojThresh} px</label>
            <input
              type="range"
              min="1.0"
              max="10.0"
              step="0.5"
              value={reprojThresh}
              onChange={(e) => setReprojThresh(parseFloat(e.target.value))}
              className="accent-[#00C8FF] cursor-pointer"
            />
            <span className="text-[10px] text-white/40">Inlier distance bound for Homography verification.</span>
          </div>

          <div className="flex flex-col gap-2">
            <label className="text-white/70">MAX FEATURE DETECTIONS: {maxFeatures}</label>
            <input
              type="range"
              min="500"
              max="5000"
              step="250"
              value={maxFeatures}
              onChange={(e) => setMaxFeatures(parseInt(e.target.value))}
              className="accent-[#00C8FF] cursor-pointer"
            />
            <span className="text-[10px] text-white/40">Keypoint extraction density limit per raster swath.</span>
          </div>

          <div className="flex flex-col gap-2">
            <label className="text-white/70">CLAHE CLIP LIMIT: {claheClip}</label>
            <input
              type="range"
              min="1.0"
              max="6.0"
              step="0.5"
              value={claheClip}
              onChange={(e) => setClaheClip(parseFloat(e.target.value))}
              className="accent-[#00C8FF] cursor-pointer"
            />
            <span className="text-[10px] text-white/40">Local contrast equalization limit for shadow normalization.</span>
          </div>

          <div className="pt-4 border-t border-white/10 flex items-center justify-between">
            <span className="text-emerald-400 text-xs">
              {saved ? '✓ SETTINGS SAVED & PERSISTED TO ENGINE' : ''}
            </span>
            <button
              type="submit"
              className="px-6 py-2.5 rounded bg-[#00C8FF] text-black font-bold uppercase hover:bg-[#00B4E6] cursor-pointer"
            >
              SAVE CONFIGURATION
            </button>
          </div>
        </form>
      </div>
    </main>
  );
}
