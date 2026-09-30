'use client';

import React, { useState, useEffect } from 'react';

export const HeroStatus: React.FC = () => {
  const [utcTime, setUtcTime] = useState('2026-09-30 10:52:37 UTC');

  useEffect(() => {
    const update = () => {
      const now = new Date();
      setUtcTime(now.toISOString().replace('T', ' ').slice(0, 19) + ' UTC');
    };
    update();
    const timer = setInterval(update, 1000);
    return () => clearInterval(timer);
  }, []);

  return (
    <div className="absolute top-20 sm:top-24 left-6 sm:left-12 z-30 flex flex-col gap-1 font-mono text-[9px] tracking-widest text-white/50 pointer-events-none select-none">
      <div className="flex items-center gap-2">
        <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse shadow-[0_0_6px_#4ade80]" />
        <span className="text-white/80 text-[10px] uppercase tracking-[0.22em]">
          SYSTEM ONLINE // NOMINAL
        </span>
      </div>
      <div className="text-white/40 tracking-[0.16em]">{utcTime}</div>
    </div>
  );
};
