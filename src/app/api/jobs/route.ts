import { NextResponse } from 'next/server';

export async function GET() {
  const jobs = [
    {
      id: 'JOB-94821',
      name: 'LoFTR Multi-Modal Correspondence Pipeline',
      status: 'COMPLETED',
      progress: 100,
      started_at: '2026-10-04T12:30:00Z',
      completed_at: '2026-10-04T12:30:02Z',
      source: 'OHRC Tycho Afternoon (0.25m)',
      reference: 'OHRC Tycho Morning (0.25m)',
      inliers: 429,
      rmse: '0.38 px',
    },
    {
      id: 'JOB-94820',
      name: 'Cross-Scale SuperPoint Pyramid Alignment',
      status: 'COMPLETED',
      progress: 100,
      started_at: '2026-10-04T11:15:00Z',
      completed_at: '2026-10-04T11:15:03Z',
      source: 'OHRC Boguslawsky E (0.25m)',
      reference: 'TMC-2 Boguslawsky E (5.0m)',
      inliers: 278,
      rmse: '0.44 px',
    },
    {
      id: 'JOB-94819',
      name: 'PDS4 Radiometric & Sun Angle Normalization',
      status: 'COMPLETED',
      progress: 100,
      started_at: '2026-10-04T10:00:00Z',
      completed_at: '2026-10-04T10:00:01Z',
      source: 'ISDA Raw Ingestion Buffer',
      reference: 'Lunar SPICE Ephemeris Frame',
      inliers: 512,
      rmse: '0.29 px',
    },
  ];

  return NextResponse.json(jobs, { status: 200 });
}
