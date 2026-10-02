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
    <header className="fixed top-0 left-0 w-full z-40 px-6 sm:px-12 py-5 flex items-center justify-between pointer-events-auto select-none bg-gradient-to-b from-[#030609]/90 to-transparent backdrop-blur-sm">
      {/* Brand Monogram: EDOLUS // LUNAR INTELLIGENCE */}
      <div className="flex items-center gap-3">
        <Link
          href="/"
          onClick={() => spaceAudio.playTelemetryClick()}
          className="flex items-center gap-2.5 group"
        >
          <div className="relative w-7 h-7 rounded-full overflow-hidden border border-white/20 shrink-0 group-hover:border-[#38A8FF]/60 transition-colors">
            <img 
              src="/images/edolus_logo.png" 
              alt="EDOLUS" 
              className="w-full h-full object-cover"
            />
          </div>
          <div className="flex flex-col">
            <span className="text-[13px] font-display font-bold tracking-[0.2em] text-[#F4F6F8]">
              EDOLUS
            </span>
            <span className="text-[8px] font-tech tracking-[0.16em] text-[#8D98A5] uppercase -mt-0.5">
              // LUNAR INTELLIGENCE
            </span>
          </div>
        </Link>
      </div>

      {/* Navigation: SYSTEM / INTELLIGENCE / MONITORING / PLATFORM */}
      <nav className="hidden md:flex items-center gap-8 lg:gap-10 text-[11px] font-tech tracking-[0.2em] text-[#8D98A5]">
        <a
          href="#system"
          onClick={() => spaceAudio.playTelemetryClick()}
          className="hover:text-[#F4F6F8] transition-colors uppercase"
        >
          SYSTEM
        </a>
        <a
          href="#intelligence"
          onClick={() => spaceAudio.playTelemetryClick()}
          className="hover:text-[#F4F6F8] transition-colors uppercase"
        >
          INTELLIGENCE
        </a>
        <a
          href="#platform"
          onClick={() => spaceAudio.playTelemetryClick()}
          className="hover:text-[#F4F6F8] transition-colors uppercase"
        >
          PLATFORM
        </a>
        <Link
          href="/dashboard"
          onClick={() => spaceAudio.playTelemetryClick()}
          className="hover:text-[#38A8FF] transition-colors uppercase"
        >
          DASHBOARD
        </Link>
      </nav>

      {/* Right Controls: AUDIO Toggle + ENTER MISSION CONSOLE */}
      <div className="flex items-center gap-4 sm:gap-5">
        {/* Audio Ambient Synthesizer Toggle */}
        <button
          onClick={toggleAudio}
          className="flex items-center gap-2 px-3 py-1.5 rounded-[6px] border border-white/[0.08] bg-white/[0.02] hover:bg-white/[0.06] hover:border-white/20 transition-all text-[#8D98A5] hover:text-[#F4F6F8] cursor-pointer"
          title="Toggle Ambient Audio"
        >
          <div className="flex items-end gap-[2px] h-2.5">
            <span
              className={`w-[1.5px] bg-[#38A8FF] rounded-full transition-all duration-200 ${
                isPlayingAudio ? 'h-2.5 animate-pulse' : 'h-1 opacity-40'
              }`}
            />
            <span
              className={`w-[1.5px] bg-[#38A8FF] rounded-full transition-all duration-300 ${
                isPlayingAudio ? 'h-1.5 animate-bounce' : 'h-2 opacity-40'
              }`}
            />
            <span
              className={`w-[1.5px] bg-[#38A8FF] rounded-full transition-all duration-150 ${
                isPlayingAudio ? 'h-3 animate-pulse' : 'h-1 opacity-40'
              }`}
            />
          </div>
          <span className="text-[9px] tracking-[0.16em] font-tech uppercase">
            {isPlayingAudio ? 'AUDIO ON' : 'AUDIO'}
          </span>
        </button>

        {/* Enter Platform / Mission Console Link */}
        <Link
          href="/dashboard"
          onClick={() => spaceAudio.playTelemetryClick()}
          className="flex items-center gap-1.5 px-4 py-2 rounded-[8px] bg-[#38A8FF] hover:bg-[#2094EC] text-white text-[11px] tracking-[0.16em] font-tech uppercase font-medium transition-colors"
        >
          <span>ENTER PLATFORM</span>
          <span className="text-white">→</span>
        </Link>
      </div>
    </header>
  );
};
