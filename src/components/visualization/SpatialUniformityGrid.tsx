'use client';

import React from 'react';
import { CorrespondencePoint } from '@/types/api';

interface SpatialUniformityGridProps {
  correspondences: CorrespondencePoint[];
  gridDivisions?: number;
}

export const SpatialUniformityGrid: React.FC<SpatialUniformityGridProps> = ({
  correspondences,
  gridDivisions = 8,
}) => {
  const inliers = correspondences.filter((c) => c.is_inlier);

  // Compute 8x8 cell distribution
  const grid: number[][] = Array.from({ length: gridDivisions }, () =>
    Array(gridDivisions).fill(0)
  );

  inliers.forEach((c) => {
    if (c.grid_cell) {
      const parts = c.grid_cell.split('_');
      if (parts.length === 2) {
        const gx = parseInt(parts[0]);
        const gy = parseInt(parts[1]);
        if (gx >= 0 && gx < gridDivisions && gy >= 0 && gy < gridDivisions) {
          grid[gy][gx]++;
        }
      }
    }
  });

  let occupiedCount = 0;
  let maxCellCount = 1;
  grid.forEach((row) =>
    row.forEach((val) => {
      if (val > 0) occupiedCount++;
      if (val > maxCellCount) maxCellCount = val;
    })
  );

  const coveragePct = ((occupiedCount / (gridDivisions * gridDivisions)) * 100).toFixed(1);

  return (
    <div className="flex flex-col gap-3 bg-[#080d16] border border-white/10 rounded-lg p-4 font-mono select-none">
      <div className="flex items-center justify-between text-[11px]">
        <span className="text-white/80 font-bold uppercase tracking-wider">
          SPATIAL UNIFORMITY (8×8 GRID)
        </span>
        <span className="text-[#00C8FF] font-bold text-[10px]">
          COVERAGE: {coveragePct}% ({occupiedCount}/64 CELLS)
        </span>
      </div>

      <div className="grid grid-cols-8 gap-1 aspect-square max-w-[240px] mx-auto w-full bg-[#020407] p-2 rounded border border-white/10">
        {grid.map((row, rIdx) =>
          row.map((count, cIdx) => {
            const intensity = count > 0 ? Math.min(1.0, count / maxCellCount) : 0;
            const bg =
              count === 0
                ? 'bg-white/[0.02]'
                : `rgba(0, 200, 255, ${0.15 + intensity * 0.75})`;

            return (
              <div
                key={`${rIdx}_${cIdx}`}
                style={{ backgroundColor: bg }}
                className="rounded-[2px] flex items-center justify-center text-[7px] text-white/70 transition-all hover:border hover:border-white"
                title={`Cell [${cIdx}, ${rIdx}]: ${count} inliers`}
              >
                {count > 0 ? count : ''}
              </div>
            );
          })
        )}
      </div>

      <div className="flex items-center justify-between text-[9px] text-white/45 pt-1 border-t border-white/5">
        <div>ANMS FILTERING: ACTIVE</div>
        <div>PREVENTS POINT CLUSTERING</div>
      </div>
    </div>
  );
};
