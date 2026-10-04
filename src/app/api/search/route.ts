import { NextRequest, NextResponse } from 'next/server';
import { DATASETS_LIST } from '@/lib/serverDatasets';

export async function GET(request: NextRequest) {
  const { searchParams } = new URL(request.url);
  const q = (searchParams.get('q') || '').toLowerCase();

  if (!q) {
    return NextResponse.json(DATASETS_LIST);
  }

  const matches = DATASETS_LIST.filter(d => 
    d.id.toLowerCase().includes(q) ||
    d.title.toLowerCase().includes(q) ||
    d.region.toLowerCase().includes(q) ||
    d.instrument.toLowerCase().includes(q)
  );

  return NextResponse.json(matches);
}
