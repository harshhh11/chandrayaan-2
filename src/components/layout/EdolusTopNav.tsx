'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { Search, Bell, Moon, Sun } from 'lucide-react';
import { GlobalSearchModal } from './GlobalSearchModal';
import { NotificationsDrawer } from './NotificationsDrawer';

export const EdolusTopNav: React.FC = () => {
  const pathname = usePathname();
  const [searchOpen, setSearchOpen] = useState(false);
  const [notificationsOpen, setNotificationsOpen] = useState(false);
  const [themeDark, setThemeDark] = useState(true);

  // Exact primary navigation items
  const navLinks = [
    { label: 'Dashboard', href: '/dashboard' },
    { label: 'Datasets', href: '/datasets' },
    { label: 'Correspondence', href: '/correspondence' },
    { label: 'Reports', href: '/reports' },
    { label: '3D Viewer', href: '/3d' },
    { label: 'Analytics', href: '/analytics' },
  ];

  return (
    <>
      <GlobalSearchModal isOpen={searchOpen} onClose={() => setSearchOpen(false)} />
      <NotificationsDrawer isOpen={notificationsOpen} onClose={() => setNotificationsOpen(false)} />

      {/* Transparent Glassmorphic Aerospace Navigation Bar */}
      <header className="fixed top-0 left-0 right-0 h-14 z-50 glass-nav px-4 sm:px-8 flex items-center justify-between transition-all select-none">
        
        {/* Left: EDOLUS Brand Monogram & Return to Landing Page */}
        <div className="flex items-center gap-3">
          <Link href="/" className="flex items-center gap-2.5 group" title="Return to Landing Page (Home)">
            <div className="relative w-7 h-7 rounded-full overflow-hidden border border-white/20 shrink-0 group-hover:border-white/50 transition-colors">
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

          <div className="h-4 w-[1px] bg-white/10 hidden sm:block" />

          {/* Direct link back to Landing Page */}
          <Link
            href="/"
            className="hidden sm:flex items-center gap-1 px-2 py-0.5 rounded-[6px] border border-white/[0.08] hover:border-white/30 bg-white/[0.02] hover:bg-white/[0.08] text-[10px] font-tech tracking-wider text-[#8D98A5] hover:text-[#F4F6F8] transition-all"
            title="Return to Landing Page"
          >
            <span>←</span>
            <span className="uppercase">LANDING</span>
          </Link>
        </div>

        {/* Center: Minimalist HUD Navigation Links (No bulky pill container) */}
        <nav className="hidden md:flex items-center gap-7 lg:gap-9">
          {navLinks.map((item) => {
            const isActive = pathname === item.href || (item.href !== '/dashboard' && pathname.startsWith(item.href));

            return (
              <Link
                key={item.label}
                href={item.href}
                className={`relative py-1 text-xs tracking-wide transition-colors ${
                  isActive
                    ? 'text-[#F4F6F8] font-medium'
                    : 'text-[#8D98A5] hover:text-[#F4F6F8]'
                }`}
              >
                {item.label}
                {isActive && (
                  <span className="absolute -bottom-3.5 left-0 right-0 h-[2px] bg-white" />
                )}
              </Link>
            );
          })}
        </nav>

        {/* Right: Search, Bell, Operator Avatar */}
        <div className="flex items-center gap-3">
          {/* Subtle Theme Toggle */}
          <button
            onClick={() => setThemeDark(!themeDark)}
            className="p-1.5 rounded-[6px] text-[#8D98A5] hover:text-[#F4F6F8] hover:bg-white/[0.04] transition-colors"
            title="Toggle theme"
          >
            {themeDark ? <Moon className="w-3.5 h-3.5" /> : <Sun className="w-3.5 h-3.5" />}
          </button>

          {/* Minimal Search Field */}
          <button
            onClick={() => setSearchOpen(true)}
            className="flex items-center gap-2.5 px-3 py-1.5 rounded-[8px] bg-[#0A1118] border border-white/[0.08] hover:border-white/20 text-[#8D98A5] hover:text-[#F4F6F8] text-xs font-sans transition-all group w-44 sm:w-56"
            title="Search image ID, coordinates... (⌘K)"
          >
            <Search className="w-3.5 h-3.5 text-[#59636E] group-hover:text-[#8D98A5] transition-colors shrink-0" />
            <span className="text-[11px] text-[#59636E] truncate text-left flex-1 font-light">
              Search image ID, coordinates...
            </span>
            <kbd className="hidden sm:inline-block px-1.5 py-0.5 rounded bg-white/[0.06] text-[9px] font-tech text-[#8D98A5]">
              ⌘K
            </kbd>
          </button>

          {/* Minimal Notifications Button */}
          <button
            onClick={() => setNotificationsOpen(!notificationsOpen)}
            className={`relative p-1.5 rounded-[6px] transition-colors ${
              notificationsOpen 
                ? 'text-white bg-white/10 border border-white/20' 
                : 'text-[#8D98A5] hover:text-[#F4F6F8] hover:bg-white/[0.04]'
            }`}
            title="Notifications (Mission Alerts & Telemetry)"
          >
            <Bell className="w-3.5 h-3.5" />
            <span className="absolute top-1 right-1 w-1.5 h-1.5 rounded-full bg-[#EF4444]" />
          </button>

          {/* Clean ISRO Specialist Avatar */}
          <div 
            className="w-6 h-6 rounded-full bg-[#0D151E] border border-white/20 flex items-center justify-center text-[10px] font-bold text-[#F4F6F8] font-tech hover:border-white/50 transition-colors cursor-pointer"
            title="ISRO Operator"
          >
            IS
          </div>
        </div>

      </header>
    </>
  );
};
