import { NextRequest, NextResponse } from 'next/server';
import { DATASETS_LIST, BENCHMARK_RUNS } from '@/lib/serverDatasets';
import { computeCorrespondence } from '@/lib/correspondenceEngine';

export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  const { id } = await params;
  const decodedId = decodeURIComponent(id || '').trim();

  const url = new URL(request.url);
  const srcParam = url.searchParams.get('source') || url.searchParams.get('source_image_id') || url.searchParams.get('sourceProductId') || url.searchParams.get('ref');
  const tgtParam = url.searchParams.get('target') || url.searchParams.get('reference_image_id') || url.searchParams.get('targetProductId') || url.searchParams.get('tgt');

  let src = srcParam ? DATASETS_LIST.find(d => d.id === srcParam || d.product_id === srcParam) : null;
  let tgt = tgtParam ? DATASETS_LIST.find(d => d.id === tgtParam || d.product_id === tgtParam) : null;

  if (!src || !tgt) {
    const matchedBenchmark = BENCHMARK_RUNS.find(r => r.id === decodedId);
    if (matchedBenchmark) {
      src = DATASETS_LIST.find(d => d.id === matchedBenchmark.reference_id || d.product_id === matchedBenchmark.reference_id) || src;
      tgt = DATASETS_LIST.find(d => d.id === matchedBenchmark.target_id || d.product_id === matchedBenchmark.target_id) || tgt;
    }
  }

  src = src || DATASETS_LIST[0];
  tgt = tgt || (DATASETS_LIST.length > 1 ? DATASETS_LIST[1] : DATASETS_LIST[0]);

  const result = computeCorrespondence(src, tgt);

  return NextResponse.json({
    analysis_id: decodedId,
    id: decodedId,
    title: `Chandrayaan-2 Planetary Correspondence Report — ${decodedId}`,
    created_at: new Date().toISOString().replace('T', ' ').substring(0, 19) + ' UTC',
    algorithm: 'LoFTR Deep Planetary Transformer + Pyramidal Wallis + RANSAC',
    classification: result.classification,
    confidence: result.metrics.confidence,
    is_overlapping: result.isOverlapping,
    warning: result.warning,
    source: {
      id: src.id,
      payload: src.instrument,
      region: src.region,
      resolution: src.gsd_m,
      sun_elevation: src.sun_elevation,
      sun_azimuth: src.sun_azimuth,
      acquisition: src.acquisition,
      image_url: src.image_url,
      width: src.width || 2048,
      height: src.height || 2048,
    },
    target: {
      id: tgt.id,
      payload: tgt.instrument,
      region: tgt.region,
      resolution: tgt.gsd_m,
      sun_elevation: tgt.sun_elevation,
      sun_azimuth: tgt.sun_azimuth,
      acquisition: tgt.acquisition,
      image_url: tgt.image_url,
      width: tgt.width || 2048,
      height: tgt.height || 2048,
    },
    metrics: {
      verified_inliers: result.metrics.verified_inliers,
      outliers: result.metrics.outliers,
      total_candidates: result.metrics.total_matches,
      inlier_ratio_pct: result.metrics.inlier_ratio_pct,
      registration_error_rmse_px: result.metrics.rmse_px,
      spatial_coverage_pct: result.metrics.spatial_coverage_pct,
      scale_ratio: result.scaleRatio,
      sun_elevation_delta: result.sunElevationDelta,
      sun_azimuth_delta: result.sunAzimuthDelta,
    },
    matches: result.matches,
    artifacts: {
      source_keypoints_url: src.image_url,
      target_keypoints_url: tgt.image_url,
      correspondence_plot_url: src.image_url,
      registered_image_url: src.image_url,
      difference_map_url: tgt.image_url,
      blend_overlay_url: src.image_url,
    },
  });
}
