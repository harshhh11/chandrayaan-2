import { NextRequest, NextResponse } from 'next/server';

export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  const { id } = await params;

  return NextResponse.json({
    id: id,
    analysis_id: id,
    status: 'COMPLETED',
    progress: 100,
    stage: 'COMPLETED',
    created_at: new Date().toISOString(),
    source_id: 'ch2_ohr_ncp_20220324T184000_d_img_d18',
    reference_id: 'ch2_ohr_ncp_20220310T061500_d_img_d18',
  });
}
