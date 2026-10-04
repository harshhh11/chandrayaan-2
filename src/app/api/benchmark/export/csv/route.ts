import { NextResponse } from 'next/server';

export async function GET() {
  const header = 'Analysis_ID,Reference_Payload,Target_Payload,Payload_Pair,Region,Candidate_Matches,Verified_Inliers,Inlier_Ratio_Pct,Reprojection_RMSE_px,Confidence_Pct,Spatial_Coverage_Pct,Uniformity_Score,Subpixel_Error_px,Sun_Delta_Elevation_deg,Sun_Delta_Azimuth_deg,Scale_Ratio,Processing_Time_ms,Status\n';
  
  const rows = [
    'RUN-20261004-95D6E5,OHRC,OHRC,OHRC ↔ OHRC,Tycho Crater Rim,140,124,88.6,0.38,98.4,94.8,93.2,0.17,1.5,180.0,1.0,1840,COMPLETED',
    'RUN-20261004-7C9901,OHRC,TMC-2,OHRC ↔ TMC-2,Boguslawsky E Crater,135,112,83.0,0.58,93.2,89.5,87.0,0.24,21.0,60.0,20.0,2420,COMPLETED',
    'RUN-20261003-B7DB7A,TMC-2,IIRS,TMC-2 ↔ IIRS,Shackleton Crater Rim,110,86,78.2,0.88,88.0,82.4,80.5,0.35,2.1,15.0,16.0,3100,COMPLETED',
    'RUN-20261002-E1A488,TMC-2,TMC-2,TMC-2 ↔ TMC-2,Moretus Crater Stereo,150,139,92.7,0.31,97.8,96.0,95.0,0.14,0.5,2.0,1.0,1450,COMPLETED',
    'RUN-20261001-F38D90,OHRC,IIRS,OHRC ↔ IIRS,Aristarchus Pyroclastic,90,59,65.6,1.45,78.5,71.0,68.0,0.58,12.5,82.0,320.0,3890,COMPLETED'
  ].join('\n');

  const csv = header + rows;

  return new NextResponse(csv, {
    status: 200,
    headers: {
      'Content-Type': 'text/csv; charset=utf-8',
      'Content-Disposition': 'attachment; filename="chandrayaan2_benchmark_evaluation.csv"',
    },
  });
}
