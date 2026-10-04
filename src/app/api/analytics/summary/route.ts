import { NextResponse } from 'next/server';

export async function GET() {
  return NextResponse.json({
    images_indexed: 12486,
    ohrc_count: 4821,
    tmc_count: 5204,
    iirs_count: 2461,
    matches_processed: 8932,
    avg_correspondence_rate: 91.4,
    active_analyses: 6,
    cross_modal_benchmarks: [
      { pair: "OHRC ↔ OHRC", modality: "Mono-modal (Sub-meter)", inlier_ratio: 94.6, median_error_px: 0.42, confidence: 96.8, samples: 3410 },
      { pair: "OHRC ↔ TMC-2", modality: "Multi-scale (4.8x scale)", inlier_ratio: 86.4, median_error_px: 0.72, confidence: 91.5, samples: 2890 },
      { pair: "OHRC ↔ IIRS", modality: "Optical to Hyperspectral", inlier_ratio: 81.2, median_error_px: 0.88, confidence: 88.4, samples: 1420 },
      { pair: "TMC-2 ↔ IIRS", modality: "Stereo to Hyperspectral (16.7x scale)", inlier_ratio: 78.9, median_error_px: 0.94, confidence: 85.7, samples: 1212 }
    ],
    sun_angle_performance: [
      { delta_deg: "0-15°", inlier_pct: 95.2, confidence: 96.4, error_px: 0.44 },
      { delta_deg: "15-30°", inlier_pct: 91.8, confidence: 93.1, error_px: 0.58 },
      { delta_deg: "30-45°", inlier_pct: 86.4, confidence: 89.2, error_px: 0.74 },
      { delta_deg: "45-60°", inlier_pct: 81.0, confidence: 84.7, error_px: 0.92 },
      { delta_deg: ">60°", inlier_pct: 74.3, confidence: 79.5, error_px: 1.18 }
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
