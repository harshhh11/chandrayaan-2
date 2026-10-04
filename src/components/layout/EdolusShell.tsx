'use client';

import React from 'react';
import { EdolusTopNav } from './EdolusTopNav';

interface EdolusShellProps {
  children: React.ReactNode;
}

export const EdolusShell: React.FC<EdolusShellProps> = ({ children }) => {
  return (
    <div className="min-h-screen bg-[#02070D] text-[#F5F7FA] font-sans antialiased selection:bg-white/20 selection:text-white overflow-x-hidden">
      {/* Background Ambience: Deep Space Stars & Subtle Ambient Glow */}
      <div className="fixed inset-0 pointer-events-none z-0">
        <div className="absolute inset-0 bg-[radial-gradient(ellipse_80%_80%_at_50%_-20%,rgba(6,17,28,0.7),rgba(2,7,13,1))]" />
        <div 
          className="absolute inset-0 opacity-[0.02]"
          style={{
            backgroundImage: `linear-gradient(rgba(255,255,255,0.1) 1px, transparent 1px), linear-gradient(90deg, rgba(255,255,255,0.1) 1px, transparent 1px)`,
            backgroundSize: '48px 48px'
          }}
        />
      </div>

      {/* Unified Master Transparent/Glass Navbar (No Sidebar) */}
      <EdolusTopNav />

      {/* Master Workspace View - Clean, Full Width, No Sidebar */}
      <main className="pt-20 pb-16 px-4 sm:px-6 lg:px-8 max-w-[1920px] mx-auto relative z-10">
        {children}
      </main>
    </div>
  );
};
