'use client';

import React from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { 
  Activity, Orbit, Calendar, Database, Layers, GitCompare, 
  RotateCw, History, Sun, Maximize2, Cpu, Crosshair, 
  Globe, Eye, Box, FileText, Download, ChevronLeft, ChevronRight,
  Radio, Compass, ShieldCheck
} from 'lucide-react';

interface EdolusSidebarProps {
  collapsed: boolean;
  setCollapsed: (v: boolean) => void;
}

export const EdolusSidebar: React.FC<EdolusSidebarProps> = ({ collapsed, setCollapsed }) => {
  const pathname = usePathname();

  const navGroups = [
    {
      group: 'MISSION',
      items: [
        { label: 'Mission Status', href: '/dashboard', icon: Activity },
        { label: 'Orbit Context', href: '/map', icon: Orbit },
        { label: 'Acquisition Timeline', href: '/timeline', icon: Calendar },
      ]
    },
    {
      group: 'DATA',
      items: [
        { label: 'OHRC Archive', href: '/datasets?sensor=OHRC', icon: Database },
        { label: 'TMC-2 Swaths', href: '/datasets?sensor=TMC-2', icon: Layers },
        { label: 'IIRS Spectra', href: '/datasets?sensor=IIRS', icon: Database },
        { label: 'Dataset Explorer', href: '/datasets', icon: Database },
      ]
    },
    {
      group: 'CORRESPONDENCE',
      items: [
        { label: 'Correspondence Lab', href: '/correspondence', icon: Crosshair },
        { label: 'Invariance Lab', href: '/invariance', icon: Sun },
        { label: 'Benchmark Suite', href: '/benchmark', icon: Cpu },
        { label: 'Registration', href: '/register', icon: RotateCw },
        { label: 'Match History', href: '/jobs', icon: History },
      ]
    },
    {
      group: 'ANALYSIS',
      items: [
        { label: 'Invariance Engine', href: '/invariance', icon: Sun },
        { label: 'Cross-Modal Benchmarks', href: '/benchmark', icon: Cpu },
        { label: 'Sun Angle Analysis', href: '/analysis#sun-angle', icon: Sun },
        { label: 'Scale-Invariant Analysis', href: '/analysis#scale', icon: Maximize2 },
        { label: 'Mission Analytics', href: '/analytics', icon: Activity },
      ]
    },
    {
      group: 'VISUALIZATION',
      items: [
        { label: 'Lunar Map GIS', href: '/map', icon: Globe },
        { label: 'High-Res Viewer', href: '/image/OHRC-BOGUSLAWSKY-001', icon: Eye },
        { label: '3D Lunar Orbit', href: '/lunar-map', icon: Box },
      ]
    },
    {
      group: 'OUTPUT',
      items: [
        { label: 'Scientific Reports', href: '/reports', icon: FileText },
        { label: 'Export Results', href: '/results', icon: Download },
      ]
    }
  ];

  return (
    <aside 
      className={`fixed top-16 left-0 bottom-0 z-30 bg-[#07111F]/95 backdrop-blur-xl border-r border-white/10 transition-all duration-300 flex flex-col justify-between select-none ${
        collapsed ? 'w-16' : 'w-64'
      }`}
    >
      {/* Navigation Sections */}
      <div className="flex-1 overflow-y-auto py-4 px-2 space-y-6 scrollbar-thin scrollbar-thumb-white/10">
        {navGroups.map((g, idx) => (
          <div key={idx} className="space-y-1">
            {!collapsed && (
              <div className="px-3 py-1 text-[10px] font-mono font-semibold tracking-widest text-[#8D98A5] uppercase">
                {g.group}
              </div>
            )}
            {g.items.map((item, itemIdx) => {
              const Icon = item.icon;
              const isActive = pathname === item.href || (item.href !== '/dashboard' && pathname.startsWith(item.href.split('?')[0]) && item.href !== '/');
              return (
                <Link
                  key={itemIdx}
                  href={item.href}
                  className={`flex items-center gap-3 px-3 py-2 rounded-xl text-xs font-mono transition-all group ${
                    isActive
                      ? 'bg-white/10 text-white border border-white/20 shadow-sm'
                      : 'text-white/60 hover:text-white hover:bg-white/[0.04] border border-transparent'
                  }`}
                  title={collapsed ? item.label : undefined}
                >
                  <Icon className={`w-4 h-4 shrink-0 transition-transform group-hover:scale-110 ${isActive ? 'text-white' : 'text-white/50 group-hover:text-white'}`} />
                  {!collapsed && (
                    <span className="truncate tracking-wide">{item.label}</span>
                  )}
                </Link>
              );
            })}
          </div>
        ))}
      </div>

      {/* Bottom Telemetry & Collapse Switch */}
      <div className="p-3 border-t border-white/10 bg-[#050A12]/80 flex items-center justify-between">
        {!collapsed && (
          <div className="flex items-center gap-2 text-[10px] font-mono text-white/50">
            <span className="w-1.5 h-1.5 rounded-full bg-[#24D99B] animate-pulse" />
            <span>CORE: v1.0.4 ISRO</span>
          </div>
        )}
        <button
          onClick={() => setCollapsed(!collapsed)}
          className={`p-1.5 rounded-lg text-white/40 hover:text-white hover:bg-white/10 transition-colors ${collapsed ? 'mx-auto' : ''}`}
          title={collapsed ? 'Expand Sidebar' : 'Collapse Sidebar'}
        >
          {collapsed ? <ChevronRight className="w-4 h-4" /> : <ChevronLeft className="w-4 h-4" />}
        </button>
      </div>
    </aside>
  );
};
