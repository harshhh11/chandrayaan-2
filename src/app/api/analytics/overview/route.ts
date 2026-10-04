import { NextResponse } from 'next/server';

export async function GET() {
  return NextResponse.json({
    total_datasets_indexed: 12,
    ohrc_swaths: 5,
    tmc_strips: 4,
    iirs_cubes: 3,
    total_correspondence_runs: 28,
    mean_inlier_ratio: 0.884,
    mean_rmse_subpixel: 0.41,
    scale_range_handled: '1x to 320x',
    sun_azimuth_delta_max: '180.0°',
    system_status: 'NOMINAL',
  });
}
