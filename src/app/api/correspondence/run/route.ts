import { NextResponse } from 'next/server';
import { DATASETS_LIST } from '@/lib/serverDatasets';
import { computeCorrespondence } from '@/lib/correspondenceEngine';

export async function POST(req: Request) {
  try {
    const body = await req.json().catch(() => ({}));
    const srcId = body.source_image_id || body.sourceProductId || "ch2_ohr_ncp_20220324T184000_d_img_d18";
    const tgtId = body.reference_image_id || body.targetProductId || "ch2_ohr_ncp_20220310T061500_d_img_d18";
    const config = body.config || {};

    const src = DATASETS_LIST.find(d => d.id === srcId || d.product_id === srcId) || DATASETS_LIST[0];
    const tgt = DATASETS_LIST.find(d => d.id === tgtId || d.product_id === tgtId) || DATASETS_LIST[1] || DATASETS_LIST[0];

    const result = computeCorrespondence(src, tgt, config);

    return NextResponse.json({
      id: result.jobId,
      jobId: result.jobId,
      runId: result.jobId,
      status: result.status,
      progress_pct: 100,
      source_image_id: src.id,
      reference_image_id: tgt.id,
      is_overlapping: result.isOverlapping,
      warning: result.warning,
      classification: result.classification,
      matches: result.matches,
      correspondences: result.matches,
      metrics: result.metrics,
      transformation_matrix: result.transformation_matrix,
      artifacts: result.artifacts,
      created_at: result.created_at
    });
  } catch (err: any) {
    return NextResponse.json({ error: err?.message || "Failed to process correspondence matching" }, { status: 500 });
  }
}
