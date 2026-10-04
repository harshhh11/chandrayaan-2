'use client';

import React, { useState, useRef } from 'react';

interface SwipeComparisonViewerProps {
  referenceImageUrl: string;
  registeredImageUrl: string;
  differenceImageUrl?: string;
  blendImageUrl?: string;
  sourceTitle?: string;
  referenceTitle?: string;
}

export const SwipeComparisonViewer: React.FC<SwipeComparisonViewerProps> = ({
  referenceImageUrl,
  registeredImageUrl,
  differenceImageUrl,
  blendImageUrl,
  sourceTitle = 'Registered Source (Warped)',
  referenceTitle = 'Reference Base',
}) => {
  const [sliderPos, setSliderPos] = useState(50);
  const [mode, setMode] = useState<'SWIPE' | 'BLEND' | 'DIFFERENCE' | 'SIDE_BY_SIDE'>('SWIPE');
  const containerRef = useRef<HTMLDivElement>(null);

  const handleMouseMove = (e: React.MouseEvent<HTMLDivElement>) => {
    if (mode !== 'SWIPE' || !containerRef.current) return;
    const rect = containerRef.current.getBoundingClientRect();
    const x = Math.max(0, Math.min(rect.width, e.clientX - rect.left));
    setSliderPos((x / rect.width) * 100);
  };

  const handleTouchMove = (e: React.TouchEvent<HTMLDivElement>) => {
    if (mode !== 'SWIPE' || !containerRef.current) return;
    const rect = containerRef.current.getBoundingClientRect();
    const touch = e.touches[0];
    const x = Math.max(0, Math.min(rect.width, touch.clientX - rect.left));
    setSliderPos((x / rect.width) * 100);
  };

  return (
    <div className="flex flex-col gap-4 w-full bg-[#070b12] border border-white/[0.08] rounded-xl p-5 select-none font-mono">
      {/* Mode Switcher */}
      <div className="flex flex-wrap items-center justify-between gap-4 pb-3 border-b border-white/[0.08] text-[11px]">
        <div className="flex items-center gap-2 text-white/80 uppercase font-semibold">
          <span className="w-2 h-2 rounded-full bg-emerald-400 shadow-[0_0_6px_rgba(52,211,153,0.6)]" />
          <span>REGISTERED PRODUCT INSPECTION</span>
        </div>

        <div className="flex flex-wrap items-center gap-2">
          {(['SWIPE', 'BLEND', 'DIFFERENCE', 'SIDE_BY_SIDE'] as const).map((m) => (
            <button
              key={m}
              onClick={() => setMode(m)}
              className={`px-3 py-1 rounded border text-[10px] uppercase transition-all ${
                mode === m
                  ? 'bg-white text-black font-bold border-white shadow-[0_0_10px_rgba(255,255,255,0.2)]'
                  : 'border-white/10 text-white/50 hover:text-white'
              }`}
            >
              {m.replace('_', ' ')}
            </button>
          ))}
        </div>
      </div>

      {/* Main Visualizer Area */}
      <div
        ref={containerRef}
        onMouseMove={handleMouseMove}
        onTouchMove={handleTouchMove}
        className="relative w-full h-[420px] sm:h-[500px] bg-[#020407] rounded-lg overflow-hidden border border-white/10 flex items-center justify-center cursor-ew-resize"
      >
        {mode === 'SWIPE' && (
          <>
            {/* Reference Image (Underneath) */}
            <img
              src={referenceImageUrl}
              alt="Reference"
              className="absolute inset-0 w-full h-full object-contain pointer-events-none"
            />

            {/* Registered Source Image (Clipped by slider percentage) */}
            <div
              style={{ clipPath: `polygon(0 0, ${sliderPos}% 0, ${sliderPos}% 100%, 0 100%)` }}
              className="absolute inset-0 w-full h-full pointer-events-none"
            >
              <img
                src={registeredImageUrl}
                alt="Registered Source"
                className="w-full h-full object-contain"
              />
            </div>

            {/* Vertical Divider Line with Clean Handle */}
            <div
              style={{ left: `${sliderPos}%` }}
              className="absolute top-0 bottom-0 w-[2px] bg-white shadow-[0_0_10px_rgba(255,255,255,0.5)] pointer-events-none flex items-center justify-center -translate-x-1/2"
            >
              <div className="w-6 h-6 rounded-full bg-[#05070a] border-2 border-white shadow-[0_0_8px_rgba(255,255,255,0.5)] flex items-center justify-center text-[9px] text-white font-bold">
                ↔
              </div>
            </div>

            {/* Badges */}
            <div className="absolute top-4 left-4 px-2.5 py-1 rounded bg-black/75 border border-white/10 text-[9px] text-white/80">
              ◄ REGISTERED SOURCE
            </div>
            <div className="absolute top-4 right-4 px-2.5 py-1 rounded bg-black/75 border border-white/10 text-[9px] text-white/80">
              REFERENCE BASE ►
            </div>
          </>
        )}

        {mode === 'BLEND' && (
          <div className="relative w-full h-full flex items-center justify-center">
            <img
              src={blendImageUrl || referenceImageUrl}
              alt="Blend"
              className="w-full h-full object-contain"
            />
            <div className="absolute top-4 left-4 px-2.5 py-1 rounded bg-black/75 border border-white/20 text-[9px] text-white">
              50 / 50 ALPHA BLEND OVERLAY
            </div>
          </div>
        )}

        {mode === 'DIFFERENCE' && (
          <div className="relative w-full h-full flex items-center justify-center">
            <img
              src={differenceImageUrl || registeredImageUrl}
              alt="Difference Heatmap"
              className="w-full h-full object-contain"
            />
            <div className="absolute top-4 left-4 px-2.5 py-1 rounded bg-black/75 border border-rose-500/30 text-[9px] text-rose-400">
              RESIDUAL INTENSITY DIFFERENCE HEATMAP
            </div>
          </div>
        )}

        {mode === 'SIDE_BY_SIDE' && (
          <div className="grid grid-cols-2 w-full h-full p-2 gap-2">
            <div className="relative w-full h-full border border-white/10 rounded overflow-hidden flex items-center justify-center">
              <img src={registeredImageUrl} alt="Source" className="w-full h-full object-contain" />
              <div className="absolute top-2 left-2 px-2 py-0.5 rounded bg-black/75 text-[8px] text-white/70">
                WARPED SOURCE
              </div>
            </div>
            <div className="relative w-full h-full border border-white/10 rounded overflow-hidden flex items-center justify-center">
              <img src={referenceImageUrl} alt="Ref" className="w-full h-full object-contain" />
              <div className="absolute top-2 left-2 px-2 py-0.5 rounded bg-black/75 text-[8px] text-white/70">
                REFERENCE BASE
              </div>
            </div>
          </div>
        )}
      </div>

      {/* Footer Info */}
      <div className="flex items-center justify-between text-[10px] text-white/40 pt-1">
        <div>DRAG HORIZONTALLY TO SWIPE & INSPECT CRATER BOUNDARY ALIGNMENT</div>
        <div className="text-white/70">POSITION: {sliderPos.toFixed(0)}%</div>
      </div>
    </div>
  );
};
