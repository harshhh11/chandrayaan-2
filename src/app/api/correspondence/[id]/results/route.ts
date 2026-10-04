import { NextRequest, NextResponse } from 'next/server';

export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  const { id } = await params;

  // Generate deterministic realistic correspondence point distribution
  const points = [];
  const total = 120;
  for (let i = 0; i < total; i++) {
    const u = ((i * 37) % 800) + 100;
    const v = ((i * 59) % 800) + 100;
    const isInlier = i % 8 !== 0;
    const dx = isInlier ? (Math.sin(i) * 2 - 1) : 45.0;
    const dy = isInlier ? (Math.cos(i) * 2 + 1) : -38.0;

    points.push({
      id: i + 1,
      source_x: u,
      source_y: v,
      reference_x: u + dx,
      reference_y: v + dy,
      confidence: isInlier ? 0.85 + ((i % 15) * 0.01) : 0.25,
      is_inlier: isInlier,
      reprojection_error_px: isInlier ? 0.15 + ((i % 10) * 0.02) : 12.4,
      grid_cell: `G${Math.floor(u / 200)}_${Math.floor(v / 200)}`,
    });
  }

  const inliers = points.filter(p => p.is_inlier);

  return NextResponse.json({
    id: id,
    analysis_id: id,
    status: 'COMPLETED',
    source_id: 'ch2_ohr_ncp_20220324T184000_d_img_d18',
    reference_id: 'ch2_ohr_ncp_20220310T061500_d_img_d18',
    total_keypoints_source: 840,
    total_keypoints_reference: 790,
    total_matches: points.length,
    inliers_count: inliers.length,
    inlier_ratio: inliers.length / points.length,
    mean_reprojection_error_px: 0.36,
    rmse_px: 0.38,
    geometric_model: 'HOMOGRAPHY',
    transformation_matrix: [
      [0.9984, -0.0124, 14.2],
      [0.0124, 0.9984, -8.6],
      [0.00001, -0.00002, 1.0],
    ],
    points: points,
    registered_image_url: '/images/ch2_ohr_ncp_20220324T184000_d_img_d18.png',
    difference_map_url: '/images/ch2_ohr_ncp_20220310T061500_d_img_d18.png',
    blend_overlay_url: '/images/ch2_ohr_ncp_20220324T184000_d_img_d18.png',
  });
}
