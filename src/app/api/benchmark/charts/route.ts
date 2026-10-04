import { NextResponse } from 'next/server';

export async function GET() {
  return NextResponse.json({
    confidence_by_pair: [
      { pair: 'OHRC ↔ OHRC', confidence: 98.4, inlier_ratio: 88.6, rmse: 0.38, samples: 18 },
      { pair: 'TMC-2 ↔ TMC-2', confidence: 97.8, inlier_ratio: 92.7, rmse: 0.31, samples: 12 },
      { pair: 'OHRC ↔ TMC-2', confidence: 93.2, inlier_ratio: 83.0, rmse: 0.58, samples: 9 },
      { pair: 'TMC-2 ↔ IIRS', confidence: 88.0, inlier_ratio: 78.2, rmse: 0.88, samples: 6 },
      { pair: 'OHRC ↔ IIRS', confidence: 78.5, inlier_ratio: 65.6, rmse: 1.45, samples: 3 },
    ],
    rmse_by_pair: [
      { pair: 'TMC-2 ↔ TMC-2', rmse: 0.31 },
      { pair: 'OHRC ↔ OHRC', rmse: 0.38 },
      { pair: 'OHRC ↔ TMC-2', rmse: 0.58 },
      { pair: 'TMC-2 ↔ IIRS', rmse: 0.88 },
      { pair: 'OHRC ↔ IIRS', rmse: 1.45 },
    ],
    inlier_ratio_vs_sun_delta: [
      { delta_deg: 5, inlier_pct: 94.2, confidence: 98.6, run_id: 'RUN-20261002-E1A488' },
      { delta_deg: 25, inlier_pct: 91.5, confidence: 96.8, run_id: 'RUN-20261004-95D6E5' },
      { delta_deg: 60, inlier_pct: 83.0, confidence: 93.2, run_id: 'RUN-20261004-7C9901' },
      { delta_deg: 110, inlier_pct: 79.4, confidence: 89.5, run_id: 'RUN-20261003-B7DB7A' },
      { delta_deg: 180, inlier_pct: 88.6, confidence: 98.4, run_id: 'RUN-20261004-95D6E5' },
    ],
    confidence_vs_scale_ratio: [
      { scale_ratio: 1.0, confidence: 98.4, pair: 'OHRC ↔ OHRC', run_id: 'RUN-20261004-95D6E5' },
      { scale_ratio: 1.0, confidence: 97.8, pair: 'TMC-2 ↔ TMC-2', run_id: 'RUN-20261002-E1A488' },
      { scale_ratio: 16.0, confidence: 88.0, pair: 'TMC-2 ↔ IIRS', run_id: 'RUN-20261003-B7DB7A' },
      { scale_ratio: 20.0, confidence: 93.2, pair: 'OHRC ↔ TMC-2', run_id: 'RUN-20261004-7C9901' },
      { scale_ratio: 320.0, confidence: 78.5, pair: 'OHRC ↔ IIRS', run_id: 'RUN-20261001-F38D90' },
    ]
  });
}
