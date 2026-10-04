import { NextRequest, NextResponse } from 'next/server';

// Standard scientific benchmark suite of completed Chandrayaan-2 runs
let BENCHMARK_RUNS = [
  {
    id: 'RUN-20261004-95D6E5',
    reference_id: 'ch2_ohr_ncp_20220324T184000_d_img_d18',
    target_id: 'ch2_ohr_ncp_20220310T061500_d_img_d18',
    reference_payload: 'OHRC',
    target_payload: 'OHRC',
    payload_pair: 'OHRC ↔ OHRC',
    region: 'Tycho Crater Rim (South Polar)',
    candidate_matches: 140,
    verified_inliers: 124,
    inlier_ratio_pct: 88.6,
    rmse_px: 0.38,
    confidence_pct: 98.4,
    spatial_coverage_pct: 94.8,
    uniformity_score: 93.2,
    subpixel_error_px: 0.17,
    sun_delta_elevation: 1.5,
    sun_delta_azimuth: 180.0,
    scale_ratio: 1.0,
    processing_time_ms: 1840,
    status: 'COMPLETED',
    created_at: '2026-10-04T12:30:15Z',
    is_best_case: true
  },
  {
    id: 'RUN-20261004-7C9901',
    reference_id: 'ch2_ohr_ncp_20191015T041200_d_img_d18',
    target_id: 'ch2_tmc_ncn_20200411T093000_d_img_d18',
    reference_payload: 'OHRC',
    target_payload: 'TMC-2',
    payload_pair: 'OHRC ↔ TMC-2',
    region: 'Boguslawsky E Crater',
    candidate_matches: 135,
    verified_inliers: 112,
    inlier_ratio_pct: 83.0,
    rmse_px: 0.58,
    confidence_pct: 93.2,
    spatial_coverage_pct: 89.5,
    uniformity_score: 87.0,
    subpixel_error_px: 0.24,
    sun_delta_elevation: 21.0,
    sun_delta_azimuth: 60.0,
    scale_ratio: 20.0,
    processing_time_ms: 2420,
    status: 'COMPLETED',
    is_challenging_case: true
  },
  {
    id: 'RUN-20261003-B7DB7A',
    reference_id: 'ch2_tmc_ncn_20210828T144500_d_img_d18',
    target_id: 'ch2_iir_ncn_20210828T144500_d_cub_d18',
    reference_payload: 'TMC-2',
    target_payload: 'IIRS',
    payload_pair: 'TMC-2 ↔ IIRS',
    region: 'Shackleton Crater Rim',
    candidate_matches: 110,
    verified_inliers: 86,
    inlier_ratio_pct: 78.2,
    rmse_px: 0.88,
    confidence_pct: 88.0,
    spatial_coverage_pct: 82.4,
    uniformity_score: 80.5,
    subpixel_error_px: 0.35,
    sun_delta_elevation: 2.1,
    sun_delta_azimuth: 15.0,
    scale_ratio: 16.0,
    processing_time_ms: 3100,
    status: 'COMPLETED'
  },
  {
    id: 'RUN-20261002-E1A488',
    reference_id: 'ch2_tmc_ncn_20200715T101200_d_img_d18',
    target_id: 'ch2_tmc_ncn_20200715T101205_d_img_d18',
    reference_payload: 'TMC-2',
    target_payload: 'TMC-2',
    payload_pair: 'TMC-2 ↔ TMC-2',
    region: 'Moretus Crater Stereo',
    candidate_matches: 150,
    verified_inliers: 139,
    inlier_ratio_pct: 92.7,
    rmse_px: 0.31,
    confidence_pct: 97.8,
    spatial_coverage_pct: 96.0,
    uniformity_score: 95.0,
    subpixel_error_px: 0.14,
    sun_delta_elevation: 0.5,
    sun_delta_azimuth: 2.0,
    scale_ratio: 1.0,
    processing_time_ms: 1450,
    status: 'COMPLETED'
  },
  {
    id: 'RUN-20261001-F38D90',
    reference_id: 'ch2_ohr_ncp_20210519T143000_d_img_d18',
    target_id: 'ch2_iir_ncn_20211005T182000_d_cub_d18',
    reference_payload: 'OHRC',
    target_payload: 'IIRS',
    payload_pair: 'OHRC ↔ IIRS',
    region: 'Aristarchus Pyroclastic',
    candidate_matches: 90,
    verified_inliers: 59,
    inlier_ratio_pct: 65.6,
    rmse_px: 1.45,
    confidence_pct: 78.5,
    spatial_coverage_pct: 71.0,
    uniformity_score: 68.0,
    subpixel_error_px: 0.58,
    sun_delta_elevation: 12.5,
    sun_delta_azimuth: 82.0,
    scale_ratio: 320.0,
    processing_time_ms: 3890,
    status: 'COMPLETED'
  }
];

export async function GET(request: NextRequest) {
  const url = new URL(request.url);
  const search = (url.searchParams.get('search') || '').toLowerCase().trim();
  const pair = url.searchParams.get('pair') || url.searchParams.get('payload_pair') || 'ALL';
  const status = url.searchParams.get('status') || 'ALL';
  const minConfidence = parseFloat(url.searchParams.get('min_confidence') || '0');
  const maxRmse = parseFloat(url.searchParams.get('max_rmse') || '10');
  const sortBy = url.searchParams.get('sort_by') || 'created_at';
  const sortDir = url.searchParams.get('sort_dir') || 'desc';
  const page = parseInt(url.searchParams.get('page') || '1', 10);
  const limit = parseInt(url.searchParams.get('limit') || '10', 10);

  let filtered = [...BENCHMARK_RUNS];

  // 1. Search filter
  if (search) {
    filtered = filtered.filter(r => 
      r.id.toLowerCase().includes(search) ||
      r.reference_id.toLowerCase().includes(search) ||
      r.target_id.toLowerCase().includes(search) ||
      r.region.toLowerCase().includes(search) ||
      r.payload_pair.toLowerCase().includes(search)
    );
  }

  // 2. Payload Pair filter
  if (pair && pair !== 'ALL') {
    filtered = filtered.filter(r => r.payload_pair === pair);
  }

  // 3. Status filter
  if (status && status !== 'ALL') {
    filtered = filtered.filter(r => r.status === status);
  }

  // 4. Numerical filters
  if (minConfidence > 0) {
    filtered = filtered.filter(r => r.confidence_pct >= minConfidence);
  }
  if (maxRmse < 10) {
    filtered = filtered.filter(r => r.rmse_px <= maxRmse);
  }

  // 5. Sorting
  filtered.sort((a: any, b: any) => {
    let valA = a[sortBy];
    let valB = b[sortBy];
    if (valA === undefined) valA = 0;
    if (valB === undefined) valB = 0;

    if (typeof valA === 'string') {
      return sortDir === 'asc' ? valA.localeCompare(valB) : valB.localeCompare(valA);
    }
    return sortDir === 'asc' ? valA - valB : valB - valA;
  });

  const total = filtered.length;
  const totalPages = Math.ceil(total / limit) || 1;
  const paginated = filtered.slice((page - 1) * limit, page * limit);

  return NextResponse.json({
    runs: paginated,
    total,
    page,
    limit,
    total_pages: totalPages
  });
}

export async function DELETE(request: NextRequest) {
  try {
    const url = new URL(request.url);
    const id = url.searchParams.get('id');
    if (!id) {
      return NextResponse.json({ error: 'Run ID required for deletion' }, { status: 400 });
    }

    BENCHMARK_RUNS = BENCHMARK_RUNS.filter(r => r.id !== id);
    return NextResponse.json({ status: 'SUCCESS', deleted_id: id });
  } catch (err: any) {
    return NextResponse.json({ error: err?.message || 'Delete operation failed' }, { status: 500 });
  }
}
