import { NextRequest, NextResponse } from 'next/server';
import { DATASETS_LIST } from '@/lib/serverDatasets';
import { computeCorrespondence } from '@/lib/correspondenceEngine';

export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  const { id } = await params;
  const decodedId = decodeURIComponent(id || '').trim();

  const src = DATASETS_LIST[0];
  const tgt = DATASETS_LIST[1] || DATASETS_LIST[0];
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
