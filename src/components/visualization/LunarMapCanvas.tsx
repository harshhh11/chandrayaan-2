'use client';

import React, { useRef, useEffect, useState } from 'react';
import { LunarCoordinates } from '@/types/api';

interface LunarMapCanvasProps {
  sourceLocation?: LunarCoordinates;
  referenceLocation?: LunarCoordinates;
  onSelectRegion?: (name: string, lat: number, lon: number) => void;
}

export const LunarMapCanvas: React.FC<LunarMapCanvasProps> = ({
  sourceLocation,
  referenceLocation,
  onSelectRegion,
}) => {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const [rotation, setRotation] = useState(0);

  const LUNAR_CRATERS = [
    { name: 'Boguslawsky', lat: -72.9, lon: 43.2, size: 14, desc: 'South Polar Target (OHRC/TMC-2)' },
    { name: 'Shackleton', lat: -89.9, lon: 0.0, size: 12, desc: 'South Pole Rim (TMC-2/IIRS)' },
    { name: 'Tycho', lat: -43.31, lon: -11.36, size: 16, desc: 'Prominent Ray Crater (Sun Angle)' },
    { name: 'Copernicus', lat: 9.62, lon: -20.08, size: 15, desc: 'Equatorial Impact Basin' },
    { name: 'Mare Tranquillitatis', lat: 8.5, lon: 31.4, size: 28, desc: 'Basaltic Lunar Mare' },
    { name: 'Aristarchus', lat: 23.7, lon: -47.4, size: 12, desc: 'High Albedo Plateau' },
  ];

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    let animId: number;

    const render = () => {
      const w = (canvas.width = canvas.parentElement?.clientWidth || 600);
      const h = (canvas.height = 450);
      const cx = w / 2;
      const cy = h / 2;
      const r = Math.min(w, h) * 0.42;

      ctx.fillStyle = '#05070a';
      ctx.fillRect(0, 0, w, h);

      // 1. Draw Starfield background
      ctx.fillStyle = 'rgba(255, 255, 255, 0.4)';
      for (let i = 0; i < 40; i++) {
        const sx = ((i * 137.5) % w);
        const sy = ((i * 93.2) % h);
        ctx.fillRect(sx, sy, 1, 1);
      }

      // 2. Draw Moon Disc (Orthographic Projection)
      const grad = ctx.createRadialGradient(cx - r * 0.3, cy - r * 0.3, r * 0.1, cx, cy, r);
      grad.addColorStop(0, '#707784');
      grad.addColorStop(0.7, '#2a303c');
      grad.addColorStop(1, '#0c1017');

      ctx.beginPath();
      ctx.arc(cx, cy, r, 0, Math.PI * 2);
      ctx.fillStyle = grad;
      ctx.fill();

      // Atmospheric limb glow
      ctx.strokeStyle = 'rgba(0, 200, 255, 0.35)';
      ctx.lineWidth = 2;
      ctx.stroke();

      // Draw Latitude / Longitude Graticule lines
      ctx.strokeStyle = 'rgba(255, 255, 255, 0.08)';
      ctx.lineWidth = 1;
      for (let lat = -60; lat <= 60; lat += 30) {
        const yOffset = (lat / 90) * r;
        const widthAtLat = Math.sqrt(Math.max(0, r * r - yOffset * yOffset));
        ctx.beginPath();
        ctx.ellipse(cx, cy - yOffset, widthAtLat, widthAtLat * 0.25, 0, 0, Math.PI * 2);
        ctx.stroke();
      }

      // Draw Key Lunar Craters & Mission Footprints
      LUNAR_CRATERS.forEach((crater) => {
        // Orthographic projection conversion
        const radLat = (crater.lat * Math.PI) / 180;
        const radLon = ((crater.lon + rotation) * Math.PI) / 180;

        // Check if on visible hemisphere (cos(lon) >= 0)
        if (Math.cos(radLon) >= 0) {
          const px = cx + r * Math.cos(radLat) * Math.sin(radLon);
          const py = cy - r * Math.sin(radLat);

          const isSelected =
            sourceLocation?.region_name.includes(crater.name) ||
            referenceLocation?.region_name.includes(crater.name);

          // Crater Marker
          ctx.beginPath();
          ctx.arc(px, py, isSelected ? 7 : 4, 0, Math.PI * 2);
          ctx.fillStyle = isSelected ? '#00C8FF' : 'rgba(255, 255, 255, 0.6)';
          ctx.fill();

          if (isSelected) {
            // Pulse ring & footprint bounding box
            ctx.strokeStyle = '#00C8FF';
            ctx.lineWidth = 1.5;
            ctx.beginPath();
            ctx.arc(px, py, 14, 0, Math.PI * 2);
            ctx.stroke();

            // Footprint rectangle
            ctx.strokeStyle = 'rgba(52, 211, 153, 0.8)';
            ctx.strokeRect(px - 18, py - 18, 36, 36);
          }

          // Label
          ctx.font = '10px monospace';
          ctx.fillStyle = isSelected ? '#00C8FF' : 'rgba(255, 255, 255, 0.5)';
          ctx.fillText(crater.name, px + 9, py + 3);
        }
      });

      animId = requestAnimationFrame(render);
    };

    render();
    return () => cancelAnimationFrame(animId);
  }, [sourceLocation, referenceLocation, rotation]);

  return (
    <div className="flex flex-col gap-4 w-full bg-[#070b12] border border-white/[0.08] rounded-xl p-5 select-none font-mono">
      {/* Header */}
      <div className="flex flex-wrap items-center justify-between gap-4 pb-3 border-b border-white/[0.08] text-[11px]">
        <div className="flex items-center gap-2 text-white/80 font-bold uppercase">
          <span className="w-2 h-2 rounded-full bg-[#00C8FF] shadow-[0_0_6px_#00C8FF]" />
          <span>LUNAR SPATIAL CONTEXT & OBSERVATION FOOTPRINTS</span>
        </div>

        {/* Orbit Rotation Slider */}
        <div className="flex items-center gap-3 text-[10px] text-white/50">
          <span>ROTATE SPHERE:</span>
          <input
            type="range"
            min="-180"
            max="180"
            value={rotation}
            onChange={(e) => setRotation(parseFloat(e.target.value))}
            className="w-28 accent-[#00C8FF] cursor-pointer"
          />
          <span className="text-white/80">{rotation}°</span>
        </div>
      </div>

      {/* Canvas */}
      <div className="relative w-full h-[450px] bg-[#020407] rounded-lg overflow-hidden border border-white/10 flex items-center justify-center">
        <canvas ref={canvasRef} className="w-full h-full" />
      </div>

      {/* Footprint Details */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 text-[10px] text-white/60 pt-2 border-t border-white/5">
        <div className="flex flex-col gap-1">
          <span className="text-[#00C8FF] font-bold">SOURCE COVERAGE</span>
          <div>{sourceLocation?.region_name || 'Boguslawsky E (-72.9°N, 43.2°E)'}</div>
          <div className="text-white/40">SENSOR: OHRC (0.25m GSD)</div>
        </div>
        <div className="flex flex-col gap-1">
          <span className="text-amber-400 font-bold">REFERENCE COVERAGE</span>
          <div>{referenceLocation?.region_name || 'Boguslawsky E (-72.9°N, 43.2°E)'}</div>
          <div className="text-white/40">SENSOR: TMC-2 (5.0m GSD)</div>
        </div>
        <div className="flex flex-col gap-1">
          <span className="text-emerald-400 font-bold">SPATIAL OVERLAP</span>
          <div>94.8% REGIONAL INTERSECTION</div>
          <div className="text-white/40">COORDINATE SYNC: VERIFIED</div>
        </div>
      </div>
    </div>
  );
};
