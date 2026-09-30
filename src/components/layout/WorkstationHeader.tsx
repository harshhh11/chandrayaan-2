'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { apiClient } from '@/lib/api';

export const WorkstationHeader: React.FC = () => {
  const pathname = usePathname();
  const [engineOnline, setEngineOnline] = useState(true);

  useEffect(() => {
    apiClient.getHealth().then((h) => setEngineOnline(h.pipeline_ready));
  }, []);

  const navLinks = [
    { href: '/platform', label: 'CONTROL' },
    { href: '/data', label: 'DATASETS' },
    { href: '/register', label: 'REGISTRATION' },
    { href: '/match', label: 'CORRESPONDENCE' },
    { href: '/results', label: 'RESULTS' },
    { href: '/analytics', label: 'ANALYTICS' },
    { href: '/lunar-map', label: 'LUNAR MAP' },
    { href: '/jobs', label: 'JOBS' },
    { href: '/reports', label: 'REPORTS' },
    { href: '/settings', label: 'SETTINGS' },
  ];

  return (
    <header className="sticky top-0 z-50 w-full bg-[#05070a]/90 backdrop-blur-md border-b border-white/[0.08] px-4 sm:px-8 py-3.5 flex items-center justify-between select-none">
      {/* Left: Brand Monogram & Mission Code */}
      <div className="flex items-center gap-4">
        <Link href="/" className="flex items-center gap-2 group">
          <span className="w-2 h-2 rounded-full bg-[#00C8FF] shadow-[0_0_8px_#00C8FF] animate-pulse" />
          <span className="font-mono text-xs font-black tracking-[0.25em] text-white uppercase group-hover:text-[#00C8FF] transition-colors">
            LUNAMATCH
          </span>
          <span className="font-mono text-[9px] tracking-[0.18em] text-white/40 hidden md:inline-block">
            // ISRO SIH26166
          </span>
        </Link>

        {/* Engine status indicator */}
        <div className="hidden sm:flex items-center gap-1.5 px-2.5 py-0.5 rounded-full border border-white/10 bg-white/[0.02] font-mono text-[9px] tracking-wider text-white/60">
          <span
            className={`w-1.5 h-1.5 rounded-full ${
              engineOnline ? 'bg-emerald-400 shadow-[0_0_6px_#34d399]' : 'bg-amber-400'
            }`}
          />
          <span>{engineOnline ? 'ENGINE ONLINE' : 'HYBRID MODE'}</span>
        </div>
      </div>

      {/* Center: Main Workstation Navigation */}
      <nav className="hidden xl:flex items-center gap-6 font-mono text-[10px] tracking-[0.22em] text-white/50">
        {navLinks.map((link) => {
          const isActive = pathname === link.href;
          return (
            <Link
              key={link.href}
              href={link.href}
              className={`py-1 transition-colors uppercase ${
                isActive
                  ? 'text-[#00C8FF] font-bold border-b border-[#00C8FF]'
                  : 'hover:text-white'
              }`}
            >
              {link.label}
            </Link>
          );
        })}
      </nav>

      {/* Right: Quick Launch & Return Home */}
      <div className="flex items-center gap-3 font-mono text-[10px] tracking-[0.2em]">
        <Link
          href="/register"
          className="hidden sm:flex items-center gap-1.5 px-3.5 py-1.5 rounded-full border border-[#00C8FF]/40 bg-[#00C8FF]/10 hover:bg-[#00C8FF]/20 text-[#00C8FF] font-bold uppercase transition-all shadow-[0_0_15px_rgba(0,200,255,0.15)]"
        >
          <span>+ NEW REGISTRATION</span>
        </Link>
        <Link
          href="/"
          className="text-white/40 hover:text-white/80 transition-colors uppercase text-[9px]"
        >
          LANDING ↗
        </Link>
      </div>
    </header>
  );
};
