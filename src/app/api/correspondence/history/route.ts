import { NextResponse } from 'next/server';

export async function GET() {
  const history = [
    {
      id: 'RUN-20261004-95D6E5',
      analysis_id: 'RUN-20261004-95D6E5',
      created_at: '2026-10-04T12:30:15Z',
      source_id: 'ch2_ohr_ncp_20220324T184000_d_img_d18',
      reference_id: 'ch2_ohr_ncp_20220310T061500_d_img_d18',
      source_sensor: 'OHRC',
      reference_sensor: 'OHRC',
      region: 'Tycho Crater Rim',
      matcher_type: 'CROSS_MODAL',
      total_matches: 482,
      inliers: 429,
      inlier_ratio: 0.89,
      rmse_px: 0.38,
      status: 'COMPLETED',
      duration_ms: 1840,
    },
    {
      id: 'RUN-20261004-7C9901',
      analysis_id: 'RUN-20261004-7C9901',
      created_at: '2026-10-04T11:15:40Z',
      source_id: 'ch2_ohr_ncp_20191015T041200_d_img_d18',
      reference_id: 'ch2_tmc_ncn_20200411T093000_d_img_d18',
      source_sensor: 'OHRC',
      reference_sensor: 'TMC-2',
      region: 'Boguslawsky E Crater',
      matcher_type: 'SUPERPOINT',
      total_matches: 312,
      inliers: 278,
      inlier_ratio: 0.891,
      rmse_px: 0.44,
      status: 'COMPLETED',
      duration_ms: 2420,
    },
    {
      id: 'RUN-20261003-B7DB7A',
      analysis_id: 'RUN-20261003-B7DB7A',
      created_at: '2026-10-03T18:45:10Z',
      source_id: 'ch2_tmc_ncn_20210828T144500_d_img_d18',
      reference_id: 'ch2_iir_ncn_20210828T144500_d_cub_d18',
      source_sensor: 'TMC-2',
      reference_sensor: 'IIRS',
      region: 'Shackleton Crater Rim',
      matcher_type: 'LOFTR',
      total_matches: 198,
      inliers: 164,
      inlier_ratio: 0.828,
      rmse_px: 0.62,
      status: 'COMPLETED',
      duration_ms: 3100,
    },
  ];

  return NextResponse.json(history, {
    status: 200,
    headers: {
      'Cache-Control': 'public, s-maxage=30, stale-while-revalidate=60',
    },
  });
}
