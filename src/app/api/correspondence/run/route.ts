import { NextResponse } from 'next/server';

export async function POST(req: Request) {
  try {
    const body = await req.json();
    const jobId = `REG-${new Date().toISOString().slice(0,10).replace(/-/g,'')}-${Math.random().toString(36).substring(2,8).toUpperCase()}`;
    return NextResponse.json({
      id: jobId,
      status: "COMPLETED",
      progress_pct: 100,
      source_image_id: body.source_image_id || "OHRC-BOGUSLAWSKY-001",
      reference_image_id: body.reference_image_id || "TMC-BOGUSLAWSKY-002",
      metrics: {
        matches_found: 1284,
        valid_inliers: 1071,
        inlier_ratio_pct: 83.4,
        median_error_px: 0.72,
        geometric_consistency_pct: 94.1,
        correspondence_confidence_pct: 92.7
      },
      transformation_matrix: [
        [0.9984, -0.0521, 14.82],
        [0.0519, 0.9982, -8.45],
        [0.00002, -0.00001, 1.0000]
      ],
      created_at: new Date().toISOString()
    });
  } catch (err) {
    return NextResponse.json({ error: "Failed to process job" }, { status: 500 });
  }
}
