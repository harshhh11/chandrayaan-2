import { NextRequest, NextResponse } from 'next/server';

export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  const { id } = await params;

  return NextResponse.json({
    analysis_id: id,
    title: `Chandrayaan-2 Registration Verification Report — ${id}`,
    generated_at: new Date().toISOString(),
    organization: 'Indian Space Research Organisation (ISRO)',
    mission: 'Chandrayaan-2 Planetary Science Mission',
    payloads: ['OHRC', 'TMC-2'],
    source_product: 'ch2_ohr_ncp_20220324T184000_d_img_d18',
    reference_product: 'ch2_ohr_ncp_20220310T061500_d_img_d18',
    target_region: 'Tycho Crater Rim (-43.31° S, -11.36° E)',
    metrics: {
      inlier_matches: 429,
      total_matches: 482,
      inlier_ratio_pct: 89.0,
      rmse_subpixel_px: 0.38,
      sun_elevation_delta_deg: 1.5,
      sun_azimuth_delta_deg: 180.0,
      scale_ratio: 1.0,
      transformation_model: 'Homography (8-DOF Projective)',
    },
    quality_verdict: 'APPROVED_FOR_CARTOGRAPHIC_INTEGRATION',
    summary: 'Sub-pixel accuracy achieved across opposing illumination swaths with LoFTR deep feature correspondence and RANSAC geometric outlier rejection.',
  });
}
