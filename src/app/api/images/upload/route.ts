import { NextRequest, NextResponse } from 'next/server';

export async function POST(request: NextRequest) {
  try {
    const formData = await request.formData();
    const file = formData.get('file') as File | null;
    const payload = (formData.get('payload') as string) || 'OHRC';
    const region = (formData.get('region') as string) || 'Custom Lunar Region';

    const newId = `USR-CH2-${payload}-${Date.now().toString(36).toUpperCase()}`;

    return NextResponse.json({
      success: true,
      product: {
        id: newId,
        product_id: newId,
        title: `${payload} User Ingested Observation`,
        dataset: payload,
        instrument: payload,
        gsd_m: payload === 'OHRC' ? 0.25 : payload === 'TMC-2' ? 5.0 : 80.0,
        sun_elevation: 25.0,
        sun_azimuth: 85.0,
        image_url: '/images/DS-OHRC-BOGUSLAWSKY-01.png',
        thumbnail_url: '/thumbnails/DS-OHRC-BOGUSLAWSKY-01_thumb.png',
        region: region,
        observation_time: new Date().toISOString(),
        width: 1024,
        height: 1024,
      }
    }, { status: 201 });
  } catch (err: any) {
    return NextResponse.json({ error: err?.message || 'Upload failed' }, { status: 500 });
  }
}
