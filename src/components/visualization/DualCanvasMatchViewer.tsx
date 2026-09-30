'use client';

import React, { useRef, useEffect, useState } from 'react';
import { CorrespondencePoint } from '@/types/api';

interface DualCanvasMatchViewerProps {
  sourceImageUrl: string;
  referenceImageUrl: string;
  correspondences: CorrespondencePoint[];
  sourceTitle?: string;
  referenceTitle?: string;
  sourceGsd?: number;
  referenceGsd?: number;
}

export const DualCanvasMatchViewer: React.FC<DualCanvasMatchViewerProps> = ({
  sourceImageUrl,
  referenceImageUrl,
  correspondences,
  sourceTitle = 'Source Image',
  referenceTitle = 'Reference Image',
  sourceGsd = 0.25,
  referenceGsd = 5.0,
}) => {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const [showInliersOnly, setShowInliersOnly] = useState(false);
  const [showOutliers, setShowOutliers] = useState(true);
  const [showConnectingLines, setShowConnectingLines] = useState(true);
  const [showGrid, setShowGrid] = useState(false);
  const [hoveredPoint, setHoveredPoint] = useState<CorrespondencePoint | null>(null);

  const inliers = correspondences.filter((c) => c.is_inlier);
  const outliers = correspondences.filter((c) => !c.is_inlier);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    const imgSrc = new Image();
    const imgRef = new Image();
    imgSrc.crossOrigin = 'anonymous';
    imgRef.crossOrigin = 'anonymous';

    let loadedCount = 0;
    const onImgLoad = () => {
      loadedCount++;
      if (loadedCount === 2) {
        draw();
      }
    };

    imgSrc.onload = onImgLoad;
    imgRef.onload = onImgLoad;
    imgSrc.src = sourceImageUrl;
    imgRef.src = referenceImageUrl;

    const draw = () => {
      const panelW = 480;
      const panelH = 480;
      const gap = 60;
      canvas.width = panelW * 2 + gap;
      canvas.height = panelH;

      ctx.fillStyle = '#05070a';
      ctx.fillRect(0, 0, canvas.width, canvas.height);

      // Draw Source Image on Left
      ctx.drawImage(imgSrc, 0, 0, panelW, panelH);
      // Draw Reference Image on Right
      ctx.drawImage(imgRef, panelW + gap, 0, panelW, panelH);

      // Draw Separator & Overlay Tint
      ctx.strokeStyle = 'rgba(255, 255, 255, 0.1)';
      ctx.lineWidth = 1;
      ctx.strokeRect(0, 0, panelW, panelH);
      ctx.strokeRect(panelW + gap, 0, panelW, panelH);

      // Optional 8x8 Spatial Grid
      if (showGrid) {
        ctx.strokeStyle = 'rgba(0, 200, 255, 0.15)';
        ctx.setLineDash([4, 4]);
        const step = panelW / 8;
        for (let i = 1; i < 8; i++) {
          ctx.beginPath();
          ctx.moveTo(i * step, 0);
          ctx.lineTo(i * step, panelH);
          ctx.stroke();

          ctx.beginPath();
          ctx.moveTo(panelW + gap + i * step, 0);
          ctx.lineTo(panelW + gap + i * step, panelH);
          ctx.stroke();

          ctx.beginPath();
          ctx.moveTo(0, i * step);
          ctx.lineTo(panelW, i * step);
          ctx.stroke();

          ctx.beginPath();
          ctx.moveTo(panelW + gap, i * step);
          ctx.lineTo(canvas.width, i * step);
          ctx.stroke();
        }
        ctx.setLineDash([]);
      }

      // Draw Match Correspondences
      const scaleSrcX = panelW / (imgSrc.width || 512);
      const scaleSrcY = panelH / (imgSrc.height || 512);
      const scaleRefX = panelW / (imgRef.width || 512);
      const scaleRefY = panelH / (imgRef.height || 512);

      correspondences.forEach((c) => {
        if (showInliersOnly && !c.is_inlier) return;
        if (!showOutliers && !c.is_inlier) return;

        const sx = c.source_x * scaleSrcX;
        const sy = c.source_y * scaleSrcY;
        const rx = panelW + gap + c.reference_x * scaleRefX;
        const ry = c.reference_y * scaleRefY;

        const isHovered = hoveredPoint?.id === c.id;

        // Colors: Green = Inlier, Red = Outlier, Yellow = Medium Confidence
        let strokeColor = c.is_inlier
          ? c.confidence > 0.65
            ? 'rgba(52, 211, 153, 0.65)' // Green
            : 'rgba(251, 191, 36, 0.65)' // Yellow
          : 'rgba(239, 68, 68, 0.45)'; // Red

        if (isHovered) {
          strokeColor = '#00C8FF';
        }

        // Draw Connecting Line
        if (showConnectingLines || isHovered) {
          ctx.beginPath();
          ctx.moveTo(sx, sy);
          ctx.lineTo(rx, ry);
          ctx.strokeStyle = strokeColor;
          ctx.lineWidth = isHovered ? 2 : 1;
          ctx.stroke();
        }

        // Draw Source Marker
        ctx.beginPath();
        ctx.arc(sx, sy, isHovered ? 5 : 3, 0, Math.PI * 2);
        ctx.fillStyle = strokeColor;
        ctx.fill();

        // Draw Reference Marker
        ctx.beginPath();
        ctx.arc(rx, ry, isHovered ? 5 : 3, 0, Math.PI * 2);
        ctx.fillStyle = strokeColor;
        ctx.fill();
      });
    };

    draw();
  }, [
    sourceImageUrl,
    referenceImageUrl,
    correspondences,
    showInliersOnly,
    showOutliers,
    showConnectingLines,
    showGrid,
    hoveredPoint,
  ]);

  return (
    <div className="flex flex-col gap-4 w-full bg-[#070b12] border border-white/[0.08] rounded-xl p-5 select-none font-mono">
      {/* Controls Bar */}
      <div className="flex flex-wrap items-center justify-between gap-4 pb-3 border-b border-white/[0.08] text-[11px]">
        <div className="flex items-center gap-6">
          <div className="flex items-center gap-2">
            <span className="w-2.5 h-2.5 rounded-full bg-emerald-400" />
            <span className="text-white/80">INLIERS: {inliers.length}</span>
          </div>
          <div className="flex items-center gap-2">
            <span className="w-2.5 h-2.5 rounded-full bg-rose-500" />
            <span className="text-white/60">OUTLIERS: {outliers.length}</span>
          </div>
          <div className="text-white/40">TOTAL: {correspondences.length}</div>
        </div>

        {/* Filters and Toggles */}
        <div className="flex flex-wrap items-center gap-3">
          <button
            onClick={() => setShowInliersOnly(!showInliersOnly)}
            className={`px-2.5 py-1 rounded border text-[10px] uppercase transition-colors ${
              showInliersOnly
                ? 'bg-emerald-400/20 border-emerald-400 text-emerald-300'
                : 'border-white/10 text-white/50 hover:text-white'
            }`}
          >
            INLIERS ONLY
          </button>
          <button
            onClick={() => setShowConnectingLines(!showConnectingLines)}
            className={`px-2.5 py-1 rounded border text-[10px] uppercase transition-colors ${
              showConnectingLines
                ? 'bg-[#00C8FF]/20 border-[#00C8FF] text-[#00C8FF]'
                : 'border-white/10 text-white/50 hover:text-white'
            }`}
          >
            LINES
          </button>
          <button
            onClick={() => setShowGrid(!showGrid)}
            className={`px-2.5 py-1 rounded border text-[10px] uppercase transition-colors ${
              showGrid
                ? 'bg-sky-400/20 border-sky-400 text-sky-300'
                : 'border-white/10 text-white/50 hover:text-white'
            }`}
          >
            8×8 GRID
          </button>
        </div>
      </div>

      {/* Canvas Viewport */}
      <div className="relative w-full overflow-x-auto flex justify-center bg-[#020407] rounded-lg p-2 border border-white/5">
        <canvas ref={canvasRef} className="max-w-full h-auto rounded" />
      </div>

      {/* Bottom Metadata & Hover Telemetry */}
      <div className="flex flex-wrap items-center justify-between text-[10px] text-white/50 pt-2">
        <div className="flex items-center gap-4">
          <div>
            SOURCE: <span className="text-white/80">{sourceTitle}</span> (GSD {sourceGsd}m)
          </div>
          <span>•</span>
          <div>
            REFERENCE: <span className="text-white/80">{referenceTitle}</span> (GSD {referenceGsd}m)
          </div>
        </div>
        <div>
          ESTIMATED SCALE RATIO: <span className="text-[#00C8FF]">{(referenceGsd / sourceGsd).toFixed(1)}×</span>
        </div>
      </div>
    </div>
  );
};
