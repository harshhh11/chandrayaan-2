import { NextRequest, NextResponse } from 'next/server';
import { DATASETS_LIST, ServerDataset } from '@/lib/serverDatasets';

// In-memory cache to support newly ingested items during session
let runtimeDatasets: ServerDataset[] = [...DATASETS_LIST];

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const instrument = searchParams.get('instrument') || searchParams.get('sensor');
    const region = searchParams.get('region');
    const q = searchParams.get('q');

    let results = [...runtimeDatasets];

    if (instrument && instrument !== 'ALL') {
      results = results.filter(d => d.instrument.toLowerCase() === instrument.toLowerCase() || d.dataset.toLowerCase() === instrument.toLowerCase());
    }

    if (region) {
      results = results.filter(d => d.region.toLowerCase().includes(region.toLowerCase()));
    }

    if (q) {
      const query = q.toLowerCase();
      results = results.filter(d => 
        d.id.toLowerCase().includes(query) ||
        d.title.toLowerCase().includes(query) ||
        d.region.toLowerCase().includes(query) ||
        d.instrument.toLowerCase().includes(query)
      );
    }

    return NextResponse.json(results, {
      status: 200,
      headers: {
        'Cache-Control': 'public, s-maxage=60, stale-while-revalidate=120',
      },
    });
  } catch (error: any) {
    return NextResponse.json({ error: error?.message || 'Failed to fetch datasets' }, { status: 500 });
  }
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.json().catch(() => ({}));
    const newId = body.id || `DS-${(body.instrument || 'OHRC').toUpperCase()}-${Date.now().toString(36).toUpperCase()}`;
    
    const newDataset: ServerDataset = {
      id: newId,
      product_id: newId,
      title: body.title || `${body.instrument || 'OHRC'} User Ingested Frame`,
      dataset: body.instrument || 'OHRC',
      instrument: body.instrument || 'OHRC',
      acquisition: body.acquisition || new Date().toISOString(),
      lat: body.lat ?? -70.5,
      lon: body.lon ?? 25.0,
      region: body.region || 'Custom Polar Target',
      sun_elevation: body.sun_elevation ?? 25.0,
      sun_azimuth: body.sun_azimuth ?? 90.0,
      resolution: body.resolution || (body.instrument === 'OHRC' ? '0.25 m/px' : body.instrument === 'TMC-2' ? '5.0 m/px' : '80.0 m/px'),
      gsd_m: body.gsd_m ?? (body.instrument === 'OHRC' ? 0.25 : body.instrument === 'TMC-2' ? 5.0 : 80.0),
      image_url: body.image_url || '/images/DS-OHRC-BOGUSLAWSKY-01.png',
      thumbnail_url: body.thumbnail_url || '/thumbnails/DS-OHRC-BOGUSLAWSKY-01_thumb.png',
      file_size_kb: body.file_size_kb ?? 4096,
      width: body.width ?? 1024,
      height: body.height ?? 1024,
      status: 'INDEXED',
      description: body.description || 'Ingested via EDOLUS PDS4 / Raster Ingestion Pipeline.',
    };

    runtimeDatasets = [newDataset, ...runtimeDatasets];

    return NextResponse.json(newDataset, { status: 201 });
  } catch (err: any) {
    return NextResponse.json({ error: err?.message || 'Ingestion failed' }, { status: 500 });
  }
}
