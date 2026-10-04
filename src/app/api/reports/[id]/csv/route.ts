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

  const header = 'Point_ID,Source_X_px,Source_Y_px,Target_X_px,Target_Y_px,Match_Type,Is_Inlier,Reprojection_Error_px,Confidence_Score,Grid_Cell\n';
  const rows = result.matches.map((m: any) => 
    `${m.id},${m.source_x},${m.source_y},${m.target_x},${m.target_y},${m.match_type},${m.inlier ? 'TRUE' : 'FALSE'},${m.reprojection_error_px},${m.confidence},${m.grid_cell || 'G0_0'}`
  ).join('\n');

  const csv = header + rows;

  return new NextResponse(csv, {
    status: 200,
    headers: {
      'Content-Type': 'text/csv; charset=utf-8',
      'Content-Disposition': `attachment; filename="chandrayaan2_tiepoints_${decodedId}.csv"`,
    },
  });
}
