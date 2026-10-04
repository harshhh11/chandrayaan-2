import { NextResponse } from 'next/server';
import { DATASETS_LIST } from '@/lib/serverDatasets';

export async function GET() {
  return NextResponse.json(DATASETS_LIST, {
    status: 200,
    headers: {
      'Cache-Control': 'public, s-maxage=60, stale-while-revalidate=120',
    },
  });
}
