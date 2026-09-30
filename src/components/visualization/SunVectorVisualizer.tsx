'use client';

import React from 'react';
import { SunGeometry } from '@/types/api';

interface SunVectorVisualizerProps {
  sourceSun: SunGeometry;
  referenceSun: SunGeometry;
}

export const SunVectorVisualizer: React.FC<SunVectorVisualizerProps> = ({
  sourceSun,
  referenceSun,
}) => {
  // Compute delta azimuth
  const rawAzDiff = Math.abs(sourceSun.azimuth_deg - referenceSun.azimuth_deg) % 360;
  const azDiff = rawAzDiff > 180 ? 360 - rawAzDiff : rawAzDiff;
  const elDiff = Math.abs(sourceSun.elevation_deg - referenceSun.elevation_deg);

  const diffLevel =
    azDiff < 25 && elDiff < 15 ? 'LOW' : azDiff < 55 && elDiff < 35 ? 'MODERATE' : 'HIGH';

  const badgeColor =
    diffLevel === 'LOW'
      ? 'text-emerald-400 border-emerald-400/30 bg-emerald-400/10'
      : diffLevel === 'MODERATE'
      ? 'text-amber-400 border-amber-400/30 bg-amber-400/10'
      : 'text-rose-400 border-rose-400/30 bg-rose-400/10';

  // Polar radar vectors
  const size = 120;
  const cx = size / 2;
  const cy = size / 2;
  const r = 45;

  const srcRad = (sourceSun.azimuth_deg - 90) * (Math.PI / 180);
  const srcX = cx + r * Math.cos(srcRad);
  const srcY = cy + r * Math.sin(srcRad);

  const refRad = (referenceSun.azimuth_deg - 90) * (Math.PI / 180);
  const refX = cx + r * Math.cos(refRad);
  const refY = cy + r * Math.sin(refRad);

  return (
    <div className="flex flex-col gap-3 bg-[#080d16] border border-white/10 rounded-lg p-4 font-mono select-none">
      <div className="flex items-center justify-between text-[11px]">
        <span className="text-white/80 font-bold uppercase tracking-wider">SUN ANGLE GEOMETRY</span>
        <span className={`px-2 py-0.5 rounded text-[9px] font-bold border ${badgeColor}`}>
          ILLUMINATION Δ: {diffLevel}
        </span>
      </div>

      <div className="flex items-center gap-6 pt-1">
        {/* Polar Solar Radar Diagram */}
        <div className="relative w-[120px] h-[120px] flex-shrink-0 bg-[#020407] rounded-full border border-white/15 flex items-center justify-center">
          <svg width={size} height={size} className="overflow-visible">
            {/* Concentric Elevation rings */}
            <circle cx={cx} cy={cy} r={r * 0.33} fill="none" stroke="rgba(255,255,255,0.06)" />
            <circle cx={cx} cy={cy} r={r * 0.66} fill="none" stroke="rgba(255,255,255,0.06)" />
            <circle cx={cx} cy={cy} r={r} fill="none" stroke="rgba(255,255,255,0.12)" />

            {/* Crosshairs */}
            <line x1={cx} y1={cx - r} x2={cx} y2={cx + r} stroke="rgba(255,255,255,0.1)" />
            <line x1={cx - r} y1={cy} x2={cx + r} y2={cy} stroke="rgba(255,255,255,0.1)" />

            {/* Cardinal labels */}
            <text x={cx} y={cx - r - 4} fill="rgba(255,255,255,0.4)" fontSize="7" textAnchor="middle">
              N (0°)
            </text>
            <text x={cx + r + 6} y={cy + 2} fill="rgba(255,255,255,0.4)" fontSize="7" textAnchor="start">
              E (90°)
            </text>

            {/* Source Sun Vector (Cyan Arrow) */}
            <line x1={cx} y1={cy} x2={srcX} y2={srcY} stroke="#00C8FF" strokeWidth="2" />
            <circle cx={srcX} cy={srcY} r="3.5" fill="#00C8FF" />

            {/* Reference Sun Vector (Amber Arrow) */}
            <line x1={cx} y1={cy} x2={refX} y2={refY} stroke="#F59E0B" strokeWidth="2" strokeDasharray="3,3" />
            <circle cx={refX} cy={refY} r="3.5" fill="#F59E0B" />
          </svg>
        </div>

        {/* Angular Numerical Breakdowns */}
        <div className="grid grid-cols-2 gap-x-5 gap-y-2 text-[10px] w-full">
          <div>
            <div className="text-[#00C8FF] font-bold">SOURCE SUN</div>
            <div className="text-white/70">AZ: {sourceSun.azimuth_deg.toFixed(1)}°</div>
            <div className="text-white/50">EL: {sourceSun.elevation_deg.toFixed(1)}°</div>
          </div>
          <div>
            <div className="text-amber-400 font-bold">REF SUN</div>
            <div className="text-white/70">AZ: {referenceSun.azimuth_deg.toFixed(1)}°</div>
            <div className="text-white/50">EL: {referenceSun.elevation_deg.toFixed(1)}°</div>
          </div>
          <div className="col-span-2 pt-1 border-t border-white/10 flex items-center justify-between text-white/50">
            <div>Δ AZIMUTH: <span className="text-white/80 font-bold">{azDiff.toFixed(1)}°</span></div>
            <div>Δ ELEVATION: <span className="text-white/80 font-bold">{elDiff.toFixed(1)}°</span></div>
          </div>
        </div>
      </div>
    </div>
  );
};
