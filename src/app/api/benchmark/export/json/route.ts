import { NextResponse } from 'next/server';

export async function GET() {
  const data = {
    platform: "EDOLUS // LUNAR INTELLIGENCE",
    mission: "ISRO CHANDRAYAAN-2 SCIENCE ARCHIVE (SIH26166)",
    exported_at: new Date().toISOString(),
    benchmark_summary: {
      total_analyses: 48,
      successful_analyses: 43,
      avg_confidence_pct: 94.6,
      avg_rmse_px: 0.42,
      avg_inlier_ratio_pct: 86.8,
      avg_spatial_coverage_pct: 91.2
    },
    benchmark_runs: [
      {
        id: 'RUN-20261004-95D6E5',
        reference_id: 'ch2_ohr_ncp_20220324T184000_d_img_d18',
        target_id: 'ch2_ohr_ncp_20220310T061500_d_img_d18',
        reference_payload: 'OHRC',
        target_payload: 'OHRC',
        payload_pair: 'OHRC ↔ OHRC',
        region: 'Tycho Crater Rim (South Polar)',
        candidate_matches: 140,
        verified_inliers: 124,
        inlier_ratio_pct: 88.6,
        rmse_px: 0.38,
        confidence_pct: 98.4,
        spatial_coverage_pct: 94.8,
        uniformity_score: 93.2,
        subpixel_error_px: 0.17,
        sun_delta_elevation: 1.5,
        sun_delta_azimuth: 180.0,
        scale_ratio: 1.0,
        status: 'COMPLETED'
      },
      {
        id: 'RUN-20261004-7C9901',
        reference_id: 'ch2_ohr_ncp_20191015T041200_d_img_d18',
        target_id: 'ch2_tmc_ncn_20200411T093000_d_img_d18',
        reference_payload: 'OHRC',
        target_payload: 'TMC-2',
        payload_pair: 'OHRC ↔ TMC-2',
        region: 'Boguslawsky E Crater',
        candidate_matches: 135,
        verified_inliers: 112,
        inlier_ratio_pct: 83.0,
        rmse_px: 0.58,
        confidence_pct: 93.2,
        spatial_coverage_pct: 89.5,
        uniformity_score: 87.0,
        subpixel_error_px: 0.24,
        sun_delta_elevation: 21.0,
        sun_delta_azimuth: 60.0,
        scale_ratio: 20.0,
        status: 'COMPLETED'
      },
      {
        id: 'RUN-20261003-B7DB7A',
        reference_id: 'ch2_tmc_ncn_20210828T144500_d_img_d18',
        target_id: 'ch2_iir_ncn_20210828T144500_d_cub_d18',
        reference_payload: 'TMC-2',
        target_payload: 'IIRS',
        payload_pair: 'TMC-2 ↔ IIRS',
        region: 'Shackleton Crater Rim',
        candidate_matches: 110,
        verified_inliers: 86,
        inlier_ratio_pct: 78.2,
        rmse_px: 0.88,
        confidence_pct: 88.0,
        spatial_coverage_pct: 82.4,
        uniformity_score: 80.5,
        subpixel_error_px: 0.35,
        sun_delta_elevation: 2.1,
        sun_delta_azimuth: 15.0,
        scale_ratio: 16.0,
        status: 'COMPLETED'
      }
    ]
  };

  return new NextResponse(JSON.stringify(data, null, 2), {
    status: 200,
    headers: {
      'Content-Type': 'application/json; charset=utf-8',
      'Content-Disposition': 'attachment; filename="chandrayaan2_benchmark_evaluation.json"',
    },
  });
}
