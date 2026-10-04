import { NextResponse } from 'next/server';

export async function GET() {
  return NextResponse.json({
    total_analyses: 48,
    successful_analyses: 43,
    low_confidence_analyses: 3,
    failed_analyses: 2,
    avg_confidence: 94.6,
    avg_rmse_px: 0.42,
    avg_inlier_ratio_pct: 86.8,
    avg_spatial_coverage_pct: 91.2,
    avg_uniformity_score: 89.4,
    avg_subpixel_error_px: 0.19,
    best_case: {
      id: 'RUN-20261004-95D6E5',
      pair: 'OHRC ↔ OHRC',
      region: 'Tycho Crater Rim',
      confidence_pct: 98.4,
      rmse_px: 0.38,
      inliers: 124,
      coverage_pct: 94.8,
      sun_delta_azimuth: 180.0
    },
    challenging_case: {
      id: 'RUN-20261001-F38D90',
      pair: 'OHRC ↔ IIRS',
      region: 'Aristarchus Pyroclastic',
      confidence_pct: 78.5,
      rmse_px: 1.45,
      scale_ratio: 320.0,
      sun_delta_azimuth: 82.0
    }
  });
}
