'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { spaceAudio } from '@/audio/spaceAudio';

export const Header: React.FC = () => {
  const [isPlayingAudio, setIsPlayingAudio] = useState(false);

  useEffect(() => {
    const unsub = spaceAudio.subscribe((playing) => setIsPlayingAudio(playing));
    return () => {
      unsub();
    };
  }, []);

  const toggleAudio = () => {
    spaceAudio.playTelemetryClick();
    spaceAudio.toggle();
  };

  return (
    <header className="fixed top-0 left-0 w-full z-40 px-6 sm:px-12 py-6 flex items-center justify-between pointer-events-auto select-none bg-transparent">
      {/* Brand Monogram: ● ORBITAL INTELLIGENCE // PLATFORM */}
      <div className="flex items-center gap-3">
        <a
          href="#"
          onClick={() => spaceAudio.playTelemetryClick()}
          className="flex items-center gap-2.5 text-xs font-mono tracking-[0.24em] uppercase text-white/90 hover:text-white transition-opacity"
        >
          <span className="w-1.5 h-1.5 rounded-full bg-[#00C8FF] shadow-[0_0_8px_#00C8FF] animate-pulse" />
          <span className="font-bold tracking-[0.28em] text-[#F5F7FA]">ORBITAL INTELLIGENCE</span>
          <span className="text-white/40 tracking-[0.2em] hidden sm:inline-block">
            // PLATFORM
          </span>
        </a>
      </div>

      {/* Navigation: SYSTEM / INTELLIGENCE / MONITORING */}
      <nav className="hidden md:flex items-center gap-8 lg:gap-12 text-[11px] font-mono tracking-[0.26em] text-white/50">
        <a
          href="#system"
          onClick={() => spaceAudio.playTelemetryClick()}
          className="hover:text-white transition-colors uppercase"
        >
          SYSTEM
        </a>
        <a
          href="#intelligence"
          onClick={() => spaceAudio.playTelemetryClick()}
          className="hover:text-white transition-colors uppercase"
        >
          INTELLIGENCE
        </a>
        <a
          href="#monitoring"
          onClick={() => spaceAudio.playTelemetryClick()}
          className="hover:text-white transition-colors uppercase"
        >
          MONITORING
        </a>
        <a
          href="#platform"
          onClick={() => spaceAudio.playTelemetryClick()}
          className="hover:text-white transition-colors uppercase"
        >
          PLATFORM
        </a>
      </nav>

      {/* Right Controls: AUDIO Toggle + ENTER PLATFORM */}
      <div className="flex items-center gap-5 sm:gap-6">
        {/* Audio Ambient Synthesizer Toggle */}
        <button
          onClick={toggleAudio}
          className="flex items-center gap-2 px-3 py-1 rounded-full border border-white/10 bg-white/[0.02] hover:bg-white/[0.08] hover:border-white/20 transition-all duration-300 text-white/70 hover:text-white cursor-pointer"
          title="Toggle Ambient Audio"
        >
          <div className="flex items-end gap-[2px] h-2.5">
            <span
              className={`w-[1.5px] bg-[#00C8FF] rounded-full transition-all duration-200 ${
                isPlayingAudio ? 'h-2.5 animate-pulse' : 'h-1 opacity-40'
              }`}
            />
            <span
              className={`w-[1.5px] bg-[#00C8FF] rounded-full transition-all duration-300 ${
                isPlayingAudio ? 'h-1.5 animate-bounce' : 'h-2 opacity-40'
              }`}
            />
            <span
              className={`w-[1.5px] bg-[#00C8FF] rounded-full transition-all duration-150 ${
                isPlayingAudio ? 'h-3 animate-pulse' : 'h-1 opacity-40'
              }`}
            />
          </div>
          <span className="text-[9px] tracking-[0.2em] font-mono uppercase">
            {isPlayingAudio ? 'AUDIO ON' : 'AUDIO'}
          </span>
        </button>

        {/* Enter Platform / Mission Console Link */}
        <Link
          href="/dashboard"
          onClick={() => spaceAudio.playTelemetryClick()}
          className="flex items-center gap-1.5 px-3.5 py-1.5 rounded-full bg-[#00C8FF]/10 hover:bg-[#00C8FF]/20 border border-[#00C8FF]/30 text-[10px] tracking-[0.24em] font-mono uppercase text-white hover:text-[#4DEBFF] transition-all shadow-[0_0_12px_rgba(0,200,255,0.2)]"
        >
          <span>MISSION CONSOLE</span>
          <span className="text-[#00C8FF]">→</span>
        </Link>
      </div>
    </header>
  );
};
