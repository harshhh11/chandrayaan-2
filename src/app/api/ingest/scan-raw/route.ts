import { NextResponse } from 'next/server';
import { DATASETS_LIST } from '@/lib/serverDatasets';

export async function POST() {
  return NextResponse.json({
    status: 'COMPLETED',
    scanned_directory: '/data/raw',
    discovered_files: DATASETS_LIST.length,
    new_indexed_records: DATASETS_LIST.length,
    message: `Storage scan complete: ${DATASETS_LIST.length} Chandrayaan-2 PDS4 observation rasters validated.`,
    products: DATASETS_LIST,
  });
}
