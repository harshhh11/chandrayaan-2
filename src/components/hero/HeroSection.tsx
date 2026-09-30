'use client';

import React, { useState, useEffect } from 'react';
import { HeroVisual } from './HeroVisual';
import { HeroContent } from './HeroContent';

interface HeroSectionProps {
  scrollProgress: number;
}

export const HeroSection: React.FC<HeroSectionProps> = ({ scrollProgress }) => {
  const [mouse, setMouse] = useState({ x: 0, y: 0 });

  useEffect(() => {
    const handleMouseMove = (e: MouseEvent) => {
      const x = (e.clientX / window.innerWidth - 0.5) * 2;
      const y = (e.clientY / window.innerHeight - 0.5) * 2;
      setMouse({ x, y });
    };
    window.addEventListener('mousemove', handleMouseMove);
    return () => window.removeEventListener('mousemove', handleMouseMove);
  }, []);

  return (
    <section className="relative w-full h-screen overflow-hidden bg-[#05070a] select-none">
      {/* 1. Fullscreen Space Visual / NASA Orbital Satellite Video Layer */}
      <HeroVisual mouseX={mouse.x} mouseY={mouse.y} scrollProgress={scrollProgress} />

      {/* 2. Editorial Typography, Status Metadata, Annotations, Telemetry & Scroll Controls */}
      <HeroContent mouseX={mouse.x} mouseY={mouse.y} />
    </section>
  );
};
