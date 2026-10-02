'use client';

import React, { useState, useEffect } from 'react';
import { Header } from '@/components/layout/Header';
import { HeroSection } from '@/components/hero/HeroSection';
import { TheSystemSection } from '@/components/sections/TheSystemSection';
import { IntelligenceSection } from '@/components/sections/IntelligenceSection';
import { PlatformEntrySection } from '@/components/sections/PlatformEntrySection';

export default function LandingPage() {
  const [scrollProgress, setScrollProgress] = useState(0);

  useEffect(() => {
    const handleScroll = () => {
      const totalHeight = document.documentElement.scrollHeight - window.innerHeight;
      if (totalHeight > 0) {
        setScrollProgress(window.scrollY / totalHeight);
      }
    };
    window.addEventListener('scroll', handleScroll, { passive: true });
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  return (
    <div className="relative min-h-screen bg-[#030609] text-[#F4F6F8] font-sans selection:bg-[#38A8FF]/30 selection:text-white overflow-x-hidden">
      {/* 1. Top Landing Navigation Bar */}
      <Header />

      {/* 2. Fullscreen Space Visual Hero with Orbital Video & Editorial Typography */}
      <HeroSection scrollProgress={scrollProgress} />

      {/* 3. Section 01: Digital Infrastructure & Living Model */}
      <TheSystemSection />

      {/* 4. Section 02: Space Intelligence Capabilities Suite */}
      <IntelligenceSection />

      {/* 5. Section 03: Platform Access & Mission Console Entry */}
      <PlatformEntrySection />
    </div>
  );
}
