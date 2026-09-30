'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { 
  Orbit, Search, Bell, Moon, Sun, ArrowRight, 
  Sparkles, Radio, ShieldCheck, Layers, Globe, Activity
} from 'lucide-react';
import { GlobalSearchModal } from './GlobalSearchModal';
import { NotificationsDrawer } from './NotificationsDrawer';

export const EdolusTopNav: React.FC = () => {
  const pathname = usePathname();
  const [searchOpen, setSearchOpen] = useState(false);
  const [notificationsOpen, setNotificationsOpen] = useState(false);
  const [themeDark, setThemeDark] = useState(true);

  const navLinks = [
    { label: 'Home', href: '/' },
    { label: 'Mission', href: '/mission' },
    { label: 'Live Orbit', href: '/map' },
    { label: '3D Viewer', href: '/3d' },
    { label: 'Analytics', href: '/analytics' },
    { label: 'Predictions', href: '/predictions' },
    { label: 'Alerts', href: '/alerts' },
    { label: 'About', href: '/about' },
  ];

  return (
    <>
      {/* Global Search & Notifications Modals */}
      <GlobalSearchModal isOpen={searchOpen} onClose={() => setSearchOpen(false)} />
      <NotificationsDrawer isOpen={notificationsOpen} onClose={() => setNotificationsOpen(false)} />

      {/* Top Navbar Header */}
      <header className="fixed top-0 left-0 right-0 h-16 z-50 bg-[#050A12]/75 backdrop-blur-xl border-b border-[#4DEBFF]/15 px-4 sm:px-8 flex items-center justify-between transition-all select-none">
        
        {/* Left: EDOLUS Brand Monogram */}
        <div className="flex items-center gap-3">
          <Link href="/" className="flex items-center gap-3 group">
            <div className="w-8 h-8 rounded-full bg-gradient-to-tr from-[#2F80FF] via-[#00B8FF] to-[#4DEBFF] p-[1.5px] shadow-[0_0_20px_rgba(77,235,255,0.4)] group-hover:scale-105 transition-transform">
              <div className="w-full h-full bg-[#07111F] rounded-full flex items-center justify-center">
                <Orbit className="w-4 h-4 text-[#4DEBFF] group-hover:rotate-180 transition-transform duration-700" />
              </div>
            </div>
            <div className="flex items-baseline gap-2">
              <span className="text-base font-mono font-extrabold tracking-[0.25em] text-white">
                EDOLUS
              </span>
              <span className="hidden xl:inline text-[9px] font-mono tracking-[0.2em] text-[#4DEBFF]/70 uppercase">
                // LUNAR INTELLIGENCE
              </span>
            </div>
          </Link>
        </div>

        {/* Center: Primary Navigation Links */}
        <nav className="hidden lg:flex items-center gap-1 bg-[#07111F]/60 p-1 rounded-full border border-white/10 shadow-inner">
          {navLinks.map((item) => {
            const isActive = pathname === item.href || (item.href !== '/' && pathname.startsWith(item.href));
            return (
              <Link
                key={item.label}
                href={item.href}
                className={`px-3.5 py-1.5 rounded-full text-xs font-mono tracking-wider transition-all duration-200 ${
                  isActive
                    ? 'bg-[#2F80FF]/30 text-[#4DEBFF] font-bold shadow-[0_0_12px_rgba(77,235,255,0.25)] border border-[#4DEBFF]/40'
                    : 'text-white/60 hover:text-white hover:bg-white/[0.05]'
                }`}
              >
                {item.label}
              </Link>
            );
          })}
        </nav>

        {/* Right: Theme, Search, Notifications, Mission Console CTA */}
        <div className="flex items-center gap-2 sm:gap-3">
          {/* Moon Theme Toggle Icon */}
          <button
            onClick={() => setThemeDark(!themeDark)}
            className="p-2 rounded-full bg-white/[0.03] hover:bg-white/[0.08] border border-white/10 text-white/60 hover:text-[#4DEBFF] transition-colors"
            title="Theme Mode"
          >
            <Moon className="w-3.5 h-3.5" />
          </button>

          {/* Quick Search Field */}
          <button
            onClick={() => setSearchOpen(true)}
            className="flex items-center gap-2 px-3 py-1.5 rounded-full bg-white/[0.03] hover:bg-white/[0.08] border border-white/10 hover:border-[#4DEBFF]/30 text-white/50 hover:text-white text-xs font-mono transition-all group"
            title="Search (⌘K)"
          >
            <Search className="w-3.5 h-3.5 text-[#4DEBFF]" />
            <span className="hidden md:inline text-[11px] text-white/40 group-hover:text-white/70">
              Search satellite, location...
            </span>
            <kbd className="hidden sm:inline px-1.5 py-0.2 rounded bg-white/10 text-[9px] text-white/60">
              ⌘K
            </kbd>
          </button>

          {/* Notifications Bell */}
          <button
            onClick={() => setNotificationsOpen(true)}
            className="relative p-2 rounded-full bg-white/[0.03] hover:bg-white/[0.08] border border-white/10 text-white/60 hover:text-[#4DEBFF] transition-colors"
            title="Notifications & Telemetry Alerts"
          >
            <Bell className="w-3.5 h-3.5" />
            <span className="absolute top-1.5 right-1.5 w-1.5 h-1.5 rounded-full bg-[#4DEBFF] shadow-[0_0_6px_#4DEBFF] animate-pulse" />
          </button>

          {/* Primary Action Button: Mission Console */}
          <Link
            href="/correspondence"
            className="px-4 py-1.5 rounded-full bg-gradient-to-r from-[#2F80FF] to-[#00B8FF] hover:brightness-110 text-white text-xs font-mono font-bold tracking-wider uppercase shadow-[0_0_15px_rgba(0,184,255,0.4)] transition-all flex items-center gap-1.5 group"
          >
            <span>Mission Console</span>
            <ArrowRight className="w-3.5 h-3.5 group-hover:translate-x-0.5 transition-transform" />
          </Link>
        </div>

      </header>
    </>
  );
};
