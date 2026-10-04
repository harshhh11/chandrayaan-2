import { NextRequest, NextResponse } from 'next/server';
import { DATASETS_LIST } from '@/lib/serverDatasets';

export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  const { id } = await params;
  const decodedId = decodeURIComponent(id);

  const found = DATASETS_LIST.find(
    d => d.id.toLowerCase() === decodedId.toLowerCase() ||
         d.product_id.toLowerCase() === decodedId.toLowerCase()
  );

  if (!found) {
    return NextResponse.json({ error: 'Dataset product not found' }, { status: 404 });
  }

  return NextResponse.json(found, { status: 200 });
}
