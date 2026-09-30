'use client';

import React, { useState, useEffect } from 'react';

export const HeroEntrance: React.FC<{ onComplete?: () => void }> = ({ onComplete }) => {
  const [progress, setProgress] = useState(18);
  const [done, setDone] = useState(false);

  useEffect(() => {
    const timer = setInterval(() => {
      setProgress((prev) => {
        if (prev >= 100) {
          clearInterval(timer);
          setTimeout(() => {
            setDone(true);
            onComplete?.();
          }, 350);
          return 100;
        }
        return prev + Math.floor(Math.random() * 20 + 12);
      });
    }, 150);

    return () => clearInterval(timer);
  }, [onComplete]);

  if (done) return null;

  // Thin block loading indicator: [██████████████░░░░] 82%
  const totalBlocks = 18;
  const filledBlocks = Math.floor((Math.min(100, progress) / 100) * totalBlocks);
  const progressBar = '█'.repeat(filledBlocks) + '░'.repeat(Math.max(0, totalBlocks - filledBlocks));

  return (
    <div
      className={`fixed inset-0 z-50 pointer-events-none transition-opacity duration-700 bg-[#05070a] flex flex-col items-center justify-center select-none ${
        progress >= 100 ? 'opacity-0' : 'opacity-100'
      }`}
    >
      <div className="flex flex-col items-center gap-4 text-white font-mono text-center px-6">
        {/* Brand Monogram */}
        <div className="text-sm tracking-[0.38em] font-bold uppercase text-white/90">
          ORBITAL INTELLIGENCE
        </div>

        {/* Initialization Tag */}
        <div className="text-[10px] tracking-[0.28em] text-white/50 uppercase">
          INITIALIZING ORBITAL MESH
        </div>

        {/* Loading Progress Bar */}
        <div className="text-xs tracking-widest text-[#00C8FF] font-mono py-1">
          [{progressBar}] {Math.min(100, progress)}%
        </div>

        {/* Technical Telemetry Sequence */}
        <div className="flex flex-col gap-1 text-[9px] tracking-[0.2em] text-white/35 pt-2 uppercase">
          <div>ORBITAL LINK // ESTABLISHING</div>
          <div>TELEMETRY // SYNCHRONIZING</div>
          <div className={progress > 60 ? 'text-emerald-400/80 font-medium' : ''}>
            SYSTEM STATE // {progress > 60 ? 'ONLINE' : 'CONNECTING'}
          </div>
        </div>
      </div>
    </div>
  );
};
