import { NextRequest, NextResponse } from 'next/server';
import { DATASETS_LIST } from '@/lib/serverDatasets';

export async function GET(request: NextRequest) {
  const url = new URL(request.url);
  const search = (url.searchParams.get('search') || '').toLowerCase().trim();
  const payload = url.searchParams.get('payload') || url.searchParams.get('sensor') || '';
  const region = (url.searchParams.get('region') || '').toLowerCase().trim();
  const sortBy = url.searchParams.get('sort') || 'newest';

  let results = [...DATASETS_LIST];

  // 1. Search filter
  if (search) {
    results = results.filter(d => 
      d.id.toLowerCase().includes(search) ||
      d.product_id.toLowerCase().includes(search) ||
      d.title.toLowerCase().includes(search) ||
      d.region.toLowerCase().includes(search) ||
      d.instrument.toLowerCase().includes(search)
    );
  }

  // 2. Payload filter
  if (payload && payload !== 'ALL') {
    results = results.filter(d => d.instrument.toUpperCase() === payload.toUpperCase());
  }

  // 3. Region filter
  if (region && region !== 'all') {
    results = results.filter(d => d.region.toLowerCase().includes(region));
  }

  // 4. Sorting
  if (sortBy === 'newest') {
    results.sort((a, b) => new Date(b.acquisition).getTime() - new Date(a.acquisition).getTime());
  } else if (sortBy === 'oldest') {
    results.sort((a, b) => new Date(a.acquisition).getTime() - new Date(b.acquisition).getTime());
  } else if (sortBy === 'highest_res') {
    results.sort((a, b) => a.gsd_m - b.gsd_m);
  } else if (sortBy === 'lowest_res') {
    results.sort((a, b) => b.gsd_m - a.gsd_m);
  } else if (sortBy === 'payload') {
    results.sort((a, b) => a.instrument.localeCompare(b.instrument));
  } else if (sortBy === 'product_id') {
    results.sort((a, b) => a.id.localeCompare(b.id));
  }

  return NextResponse.json(results);
}
