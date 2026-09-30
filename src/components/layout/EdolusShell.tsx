'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { Search, Bell, Settings, User, Radio, Cpu, ShieldCheck, Compass, Sparkles, Orbit } from 'lucide-react';
import { EdolusSidebar } from './EdolusSidebar';
import { GlobalSearchModal } from './GlobalSearchModal';
import { NotificationsDrawer } from './NotificationsDrawer';

interface EdolusShellProps {
  children: React.ReactNode;
}

export const EdolusShell: React.FC<EdolusShellProps> = ({ children }) => {
  const pathname = usePathname();
  const [sidebarCollapsed, setSidebarCollapsed] = useState(false);
  const [searchOpen, setSearchOpen] = useState(false);
  const [notificationsOpen, setNotificationsOpen] = useState(false);
  const [unreadCount, setUnreadCount] = useState(2);

  const topNavItems = [
    { label: 'MISSION CONSOLE', href: '/dashboard' },
    { label: 'DATASETS', href: '/datasets' },
    { label: 'CORRESPONDENCE', href: '/correspondence' },
    { label: 'ANALYSIS', href: '/analysis' },
    { label: 'MAP', href: '/map' },
    { label: 'REPORTS', href: '/reports' },
  ];

  return (
    <div className="min-h-screen bg-[#050A12] text-[#F5F7FA] font-sans antialiased selection:bg-[#4DEBFF] selection:text-black">
      {/* Background Ambience: Deep Space Stars & Subtle Grid */}
      <div className="fixed inset-0 pointer-events-none z-0">
        <div className="absolute inset-0 bg-[radial-gradient(ellipse_80%_80%_at_50%_-20%,rgba(11,23,38,0.8),rgba(5,10,18,1))]" />
        <div 
          className="absolute inset-0 opacity-[0.03]"
          style={{
            backgroundImage: `linear-gradient(#4DEBFF 1px, transparent 1px), linear-gradient(90deg, #4DEBFF 1px, transparent 1px)`,
            backgroundSize: '40px 40px'
          }}
        />
      </div>

      {/* Global Search & Notifications Modals */}
      <GlobalSearchModal isOpen={searchOpen} onClose={() => setSearchOpen(false)} />
      <NotificationsDrawer isOpen={notificationsOpen} onClose={() => setNotificationsOpen(false)} />

      {/* 1. TOP PERSISTENT NAVIGATION BAR */}
      <header className="fixed top-0 left-0 right-0 h-16 z-40 bg-[#07111F]/90 backdrop-blur-xl border-b border-[#4DEBFF]/15 px-4 sm:px-6 flex items-center justify-between">
        {/* Top-Left Brand Monogram */}
        <div className="flex items-center gap-3">
          <Link href="/dashboard" className="flex items-center gap-2.5 group">
            <div className="w-7 h-7 rounded-lg bg-gradient-to-tr from-[#2F80FF] to-[#4DEBFF] p-[1px] shadow-[0_0_15px_rgba(77,235,255,0.4)]">
              <div className="w-full h-full bg-[#07111F] rounded-[7px] flex items-center justify-center">
                <Orbit className="w-4 h-4 text-[#4DEBFF] group-hover:rotate-180 transition-transform duration-700" />
              </div>
            </div>
            <div className="flex flex-col">
              <span className="text-xs font-mono font-bold tracking-[0.25em] text-white flex items-center gap-1.5">
                EDOLUS
              </span>
              <span className="text-[9px] font-mono tracking-[0.2em] text-[#4DEBFF]/70">
                // LUNAR INTELLIGENCE
              </span>
            </div>
          </Link>
        </div>

        {/* Center Primary Nav Tabs */}
        <nav className="hidden lg:flex items-center gap-1 bg-[#050A12]/60 p-1 rounded-xl border border-white/5">
          {topNavItems.map((item) => {
            const isActive = pathname === item.href || (item.href !== '/dashboard' && pathname.startsWith(item.href));
            return (
              <Link
                key={item.href}
                href={item.href}
                className={`px-3.5 py-1.5 rounded-lg text-[11px] font-mono tracking-wider transition-all ${
                  isActive
                    ? 'bg-[#2F80FF]/25 text-[#4DEBFF] font-bold shadow-[0_0_12px_rgba(77,235,255,0.2)] border border-[#4DEBFF]/30'
                    : 'text-white/60 hover:text-white hover:bg-white/[0.04]'
                }`}
              >
                {item.label}
              </Link>
            );
          })}
        </nav>

        {/* Right Controls: Search, Notifications, Telemetry, Settings, Profile */}
        <div className="flex items-center gap-2.5 sm:gap-3">
          {/* Quick Search Trigger */}
          <button
            onClick={() => setSearchOpen(true)}
            className="flex items-center gap-2 px-3 py-1.5 rounded-xl bg-white/[0.03] hover:bg-white/[0.08] border border-white/10 hover:border-[#4DEBFF]/30 text-white/50 hover:text-white text-xs font-mono transition-all group"
            title="Press Ctrl+K or Click to search"
          >
            <Search className="w-3.5 h-3.5 text-[#4DEBFF]" />
            <span className="hidden xl:inline text-[11px] text-white/40 group-hover:text-white/70">
              Search image ID, coordinates...
            </span>
            <kbd className="hidden sm:inline px-1.5 py-0.2 rounded bg-white/10 text-[9px] text-white/60">
              ⌘K
            </kbd>
          </button>

          {/* Notifications Alert Bell */}
          <button
            onClick={() => setNotificationsOpen(true)}
            className="relative p-2 rounded-xl bg-white/[0.03] hover:bg-white/[0.08] border border-white/10 hover:border-[#4DEBFF]/30 text-white/60 hover:text-[#4DEBFF] transition-all"
            title="Mission Alerts"
          >
            <Bell className="w-4 h-4" />
            {unreadCount > 0 && (
              <span className="absolute top-1.5 right-1.5 w-2 h-2 rounded-full bg-[#4DEBFF] shadow-[0_0_8px_#4DEBFF] animate-pulse" />
            )}
          </button>

          {/* Live System Status Pill */}
          <div className="hidden sm:flex items-center gap-2 px-3 py-1.5 rounded-xl bg-[#24D99B]/10 border border-[#24D99B]/30 text-[11px] font-mono text-[#24D99B]">
            <span className="w-1.5 h-1.5 rounded-full bg-[#24D99B] animate-ping" />
            <span className="font-bold tracking-wider">SYSTEM ONLINE</span>
          </div>

          {/* User Profile / ISRO Badge */}
          <Link
            href="/settings"
            className="flex items-center gap-2 pl-2 pr-3 py-1 rounded-xl bg-white/[0.03] border border-white/10 hover:border-white/20 transition-all text-xs font-mono"
            title="Mission Operator Settings"
          >
            <div className="w-6 h-6 rounded-lg bg-gradient-to-br from-[#2F80FF] to-[#00B8FF] flex items-center justify-center text-white text-[10px] font-bold">
              IS
            </div>
            <span className="hidden md:inline text-white/80 font-medium">ISRO OPERATOR</span>
          </Link>
        </div>
      </header>

      {/* 2. LEFT COLLAPSIBLE MISSION SIDEBAR */}
      <EdolusSidebar collapsed={sidebarCollapsed} setCollapsed={setSidebarCollapsed} />

      {/* 3. MAIN WORKSPACE VIEW */}
      <main 
        className={`pt-16 min-h-screen relative z-10 transition-all duration-300 ${
          sidebarCollapsed ? 'pl-16' : 'pl-64'
        }`}
      >
        <div className="p-4 sm:p-6 lg:p-8 max-w-[1920px] mx-auto">
          {children}
        </div>
      </main>
    </div>
  );
};
