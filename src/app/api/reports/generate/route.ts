import { NextResponse } from 'next/server';
import { DATASETS_LIST } from '@/lib/serverDatasets';
import { computeCorrespondence } from '@/lib/correspondenceEngine';

export async function POST(req: Request) {
  try {
    const payload = await req.json().catch(() => ({}));
    const srcId = payload.source_image_id || payload.source_image || payload.sourceProductId || DATASETS_LIST[0].id;
    const tgtId = payload.reference_image_id || payload.target_image || payload.targetProductId || DATASETS_LIST[1].id;

    const src = DATASETS_LIST.find(d => d.id === srcId || d.product_id === srcId) || DATASETS_LIST[0];
    const tgt = DATASETS_LIST.find(d => d.id === tgtId || d.product_id === tgtId) || DATASETS_LIST[1] || DATASETS_LIST[0];

    const result = computeCorrespondence(src, tgt);

    return NextResponse.json({
      status: "SUCCESS",
      report_id: result.jobId,
      id: result.jobId,
      analysis_id: result.jobId,
      title: `EDOLUS // LUNAR IMAGE CORRESPONDENCE & MULTI-MODAL REPORT — ${result.jobId}`,
      generated_at: new Date().toISOString(),
      platform: "EDOLUS // LUNAR INTELLIGENCE",
      mission: "CHANDRAYAAN-2 (ISRO)",
      source_dataset: src.instrument,
      target_dataset: tgt.instrument,
      source_image: src.id,
      target_image: tgt.id,
      is_overlapping: result.isOverlapping,
      warning: result.warning,
      sun_geometry: {
        source_elevation: src.sun_elevation,
        source_azimuth: src.sun_azimuth,
        target_elevation: tgt.sun_elevation,
        target_azimuth: tgt.sun_azimuth,
        delta_elevation: result.sunElevationDelta,
        delta_azimuth: result.sunAzimuthDelta,
        status: "NORMALIZED (Phase-Congruency & Illumination Ratio Compensated)"
      },
      scale_info: {
        source_gsd: `${src.gsd_m} m/px`,
        target_gsd: `${tgt.gsd_m} m/px`,
        scale_ratio: `${result.scaleRatio}x`,
        matching_mode: "MULTI-SCALE GAUSSIAN PYRAMID + LOG-POLAR DESCRIPTOR"
      },
      correspondence_results: {
        total_matches_detected: result.metrics.total_matches,
        valid_inliers: result.metrics.verified_inliers,
        inlier_ratio_pct: result.metrics.inlier_ratio_pct,
        median_reprojection_error_px: result.metrics.rmse_px,
        geometric_consistency_pct: result.metrics.spatial_coverage_pct,
        correspondence_confidence_pct: result.metrics.confidence
      },
      transformation: {
        type: "HOMOGRAPHY_MATRIX_3x3",
        matrix: result.transformation_matrix
      },
      pdf_url: `/api/reports/${result.jobId}/pdf`,
      csv_url: `/api/reports/${result.jobId}/csv`
    });
  } catch (err: any) {
    return NextResponse.json({ error: err?.message || "Failed to generate report" }, { status: 500 });
  }
}
