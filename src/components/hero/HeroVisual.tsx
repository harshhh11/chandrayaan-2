'use client';

import React, { useState, useRef, useEffect } from 'react';

interface HeroVisualProps {
  mouseX: number;
  mouseY: number;
  scrollProgress: number;
}

export const HeroVisual: React.FC<HeroVisualProps> = ({ mouseX, mouseY, scrollProgress }) => {
  const [videoLoaded, setVideoLoaded] = useState(false);
  const videoRef = useRef<HTMLVideoElement>(null);
  const canvasRef = useRef<HTMLCanvasElement>(null);

  // Micro parallax: 1-3px translation for camera feel
  const bgShiftX = mouseX * 2.5;
  const bgShiftY = mouseY * 1.5;
  const scrollScale = 1.0 + scrollProgress * 0.04;
  const scrollOpacity = Math.max(0.25, 1.0 - scrollProgress * 1.15);

  // Render subtle procedural starfield on background canvas
  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    let animationFrameId: number;
    const width = (canvas.width = window.innerWidth);
    const height = (canvas.height = window.innerHeight);

    // Create 120 faint stars
    const stars = Array.from({ length: 120 }, () => ({
      x: Math.random() * width,
      y: Math.random() * height,
      size: Math.random() * 1.2 + 0.3,
      alpha: Math.random() * 0.5 + 0.1,
      speed: Math.random() * 0.005 + 0.002,
    }));

    const render = () => {
      ctx.clearRect(0, 0, width, height);
      stars.forEach((star) => {
        star.alpha += Math.sin(Date.now() * star.speed) * 0.005;
        const currentAlpha = Math.max(0.05, Math.min(0.7, star.alpha));
        ctx.fillStyle = `rgba(255, 255, 255, ${currentAlpha})`;
        ctx.beginPath();
        ctx.arc(star.x, star.y, star.size, 0, Math.PI * 2);
        ctx.fill();
      });
      animationFrameId = requestAnimationFrame(render);
    };

    render();

    const handleResize = () => {
      if (!canvas) return;
      canvas.width = window.innerWidth;
      canvas.height = window.innerHeight;
    };
    window.addEventListener('resize', handleResize);

    return () => {
      cancelAnimationFrame(animationFrameId);
      window.removeEventListener('resize', handleResize);
    };
  }, []);

  return (
    <div
      style={{
        opacity: scrollOpacity,
        transform: `scale(${scrollScale}) translate3d(${bgShiftX}px, ${bgShiftY}px, 0)`,
      }}
      className="absolute inset-0 w-full h-full pointer-events-none transition-transform duration-700 ease-out will-change-transform overflow-hidden select-none bg-[#05070a]"
    >
      {/* LAYER 01: Deep black space base */}
      <div className="absolute inset-0 bg-[#05070a]" />

      {/* LAYER 02: Subtle cosmic stars */}
      <canvas
        ref={canvasRef}
        className="absolute inset-0 w-full h-full opacity-60 pointer-events-none mix-blend-screen"
      />

      {/* LAYER 03: Earth Atmospheric Rim & Glow */}
      <div className="absolute -bottom-[20%] right-[-10%] w-[120vw] h-[70vh] rounded-[100%] bg-gradient-to-t from-[#00C8FF]/12 via-[#004488]/5 to-transparent blur-[80px] pointer-events-none" />

      {/* LAYER 04: Cinematic Satellite Video (High-Res NASA Orbit Footage) */}
      <video
        ref={videoRef}
        src="/media/orbital-satellite.mp4"
        poster="/media/orbital-satellite-poster.jpg"
        autoPlay
        muted
        loop
        playsInline
        onCanPlay={() => setVideoLoaded(true)}
        className={`absolute inset-0 w-full h-full object-cover object-[65%_center] transition-opacity duration-1000 ${
          videoLoaded ? 'opacity-90' : 'opacity-0'
        }`}
      />

      {/* Poster Fallback with slow cinematic drift */}
      <div
        className={`absolute inset-0 w-full h-full bg-cover bg-[65%_center] transition-opacity duration-1000 ${
          videoLoaded ? 'opacity-0' : 'opacity-90'
        }`}
        style={{
          backgroundImage: `url('/media/orbital-satellite-poster.jpg')`,
          animation: 'orbitalSlowDrift 30s ease-in-out infinite alternate',
        }}
      />

      {/* LAYER 05: Dark Left Readability Gradient (guarantees 100% crisp typography contrast without boxes) */}
      <div className="absolute inset-0 bg-gradient-to-r from-[#05070a] via-[#05070a]/80 to-transparent w-full md:w-[62%] pointer-events-none" />

      {/* Edge blending vignettes */}
      <div className="absolute inset-x-0 top-0 h-32 bg-gradient-to-b from-[#05070a] to-transparent pointer-events-none" />
      <div className="absolute inset-x-0 bottom-0 h-36 bg-gradient-to-t from-[#05070a] to-transparent pointer-events-none" />
      <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_center,transparent_45%,#05070a_100%)] pointer-events-none opacity-60" />

      {/* LAYER 06: Atmospheric Blue Accent Light from Horizon */}
      <div className="absolute inset-0 bg-gradient-to-tr from-[#00C8FF]/10 via-transparent to-transparent mix-blend-screen pointer-events-none" />
    </div>
  );
};
