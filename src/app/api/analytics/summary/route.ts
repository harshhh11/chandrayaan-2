import { NextResponse } from 'next/server';

export async function GET() {
  return NextResponse.json({
    images_indexed: 12486,
    ohrc_count: 4821,
    tmc_count: 5204,
    iirs_count: 2461,
    matches_processed: 8932,
    total_analyses: 8932,
    successful_analyses: 8645,
    low_confidence_analyses: 240,
    failed_analyses: 47,
    avg_confidence: 94.2,
    avg_inlier_ratio: 0.884,
    avg_registration_error: 0.38,
    avg_inliers: 412,
    avg_correspondence_rate: 91.4,
    active_analyses: 6,
    database_engine: 'ISRO ISDA Relational Engine',
    payload_distribution: [
      { name: 'OHRC', count: 4821, color: '#D9DDE0' },
      { name: 'TMC-2', count: 5204, color: '#64748B' },
      { name: 'IIRS', count: 2461, color: '#C89A45' }
    ],
    resolution_distribution: [
      { tier: 'Sub-meter (0.25m - 0.50m)', count: 4821 },
      { tier: 'Regional (5.0m - 10.0m)', count: 5204 },
      { tier: 'Hyperspectral (80.0m - 120m)', count: 2461 }
    ],
    confidence_distribution: [
      { range: '90 - 100%', count: 6840 },
      { range: '80 - 89%', count: 1612 },
      { range: '70 - 79%', count: 390 },
      { range: '< 70%', count: 90 }
    ],
    scale_vs_confidence: [
      { scale_ratio: 1.0, confidence: 97.4, inliers: 482, pair: 'OHRC ↔ OHRC' },
      { scale_ratio: 4.8, confidence: 92.1, inliers: 378, pair: 'OHRC ↔ TMC-2' },
      { scale_ratio: 10.0, confidence: 88.5, inliers: 290, pair: 'TMC-2 ↔ IIRS' },
      { scale_ratio: 16.7, confidence: 84.2, inliers: 210, pair: 'OHRC ↔ IIRS' },
    ],
    sun_delta_vs_confidence: [
      { sun_angle_delta: 5, confidence: 97.8, error_px: 0.28, pair: 'Tycho AM/AM' },
      { sun_angle_delta: 25, confidence: 94.2, error_px: 0.36, pair: 'Boguslawsky Low-Delta' },
      { sun_angle_delta: 65, confidence: 90.8, error_px: 0.48, pair: 'Shackleton Moderate' },
      { sun_angle_delta: 120, confidence: 86.4, error_px: 0.62, pair: 'Tycho Cross-Pass' },
      { sun_angle_delta: 180, confidence: 82.5, error_px: 0.74, pair: 'Tycho Reversal (AM/PM)' }
    ],
    analysis_timeline: [
      { id: 'RUN-20261004-95D6E5', date: '2026-10-04 12:30', pair: 'OHRC ↔ OHRC', confidence: 98.4, inliers: 429, rmse: 0.38, status: 'COMPLETED' },
      { id: 'RUN-20261004-7C9901', date: '2026-10-04 11:15', pair: 'OHRC ↔ TMC-2', confidence: 96.1, inliers: 278, rmse: 0.44, status: 'COMPLETED' },
      { id: 'RUN-20261003-B7DB7A', date: '2026-10-03 18:45', pair: 'TMC-2 ↔ IIRS', confidence: 92.8, inliers: 164, rmse: 0.62, status: 'COMPLETED' },
      { id: 'RUN-20261003-776D6B', date: '2026-10-03 14:20', pair: 'OHRC ↔ OHRC', confidence: 97.2, inliers: 395, rmse: 0.35, status: 'COMPLETED' },
      { id: 'RUN-20261002-E89E3C', date: '2026-10-02 09:10', pair: 'OHRC ↔ TMC-2', confidence: 94.5, inliers: 310, rmse: 0.41, status: 'COMPLETED' },
    ],
    cross_modal_benchmarks: [
      { pair: "OHRC ↔ OHRC", modality: "Mono-modal (Sub-meter)", inlier_ratio: 94.6, median_error_px: 0.42, confidence: 96.8, samples: 3410 },
      { pair: "OHRC ↔ TMC-2", modality: "Multi-scale (4.8x scale)", inlier_ratio: 86.4, median_error_px: 0.72, confidence: 91.5, samples: 2890 },
      { pair: "OHRC ↔ IIRS", modality: "Optical to Hyperspectral", inlier_ratio: 81.2, median_error_px: 0.88, confidence: 88.4, samples: 1420 },
      { pair: "TMC-2 ↔ IIRS", modality: "Stereo to Hyperspectral (16.7x scale)", inlier_ratio: 78.9, median_error_px: 0.94, confidence: 85.7, samples: 1212 }
    ],
    sun_angle_performance: [
      { delta_deg: "0-15°", inlier_pct: 95.2, confidence: 96.4, error_px: 0.44, samples: 2100 },
      { delta_deg: "15-30°", inlier_pct: 91.8, confidence: 93.1, error_px: 0.58, samples: 1850 },
      { delta_deg: "30-45°", inlier_pct: 86.4, confidence: 89.2, error_px: 0.74, samples: 1420 },
      { delta_deg: "45-60°", inlier_pct: 81.0, confidence: 84.7, error_px: 0.92, samples: 980 },
      { delta_deg: ">60°", inlier_pct: 74.3, confidence: 79.5, error_px: 1.18, samples: 540 }
    ],
    scale_ratio_performance: [
      { ratio: "1.0x (Iso-scale)", match_quality: 96.8, inlier_ratio: 95.5 },
      { ratio: "2.5x", match_quality: 93.2, inlier_ratio: 91.4 },
      { ratio: "4.8x (OHRC:TMC)", match_quality: 88.6, inlier_ratio: 86.4 },
      { ratio: "10.0x", match_quality: 82.1, inlier_ratio: 80.2 },
      { ratio: "16.7x (OHRC:IIRS)", match_quality: 77.4, inlier_ratio: 76.1 }
    ]
  });
}
