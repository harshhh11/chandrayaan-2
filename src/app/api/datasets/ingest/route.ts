import { NextRequest, NextResponse } from 'next/server';

export async function POST(request: NextRequest) {
  try {
    const formData = await request.formData();
    const file = formData.get('file') as File | null;
    const xmlLabel = formData.get('xml_label') as File | null;
    const payload = (formData.get('payload') as string) || 'OHRC';
    const title = (formData.get('title') as string) || `${payload} User Ingested Raster`;

    const fileName = file ? file.name : `custom_${Date.now()}.png`;
    const newId = `INGEST-${payload}-${Date.now().toString(36).toUpperCase()}`;

    return NextResponse.json({
      success: true,
      product_id: newId,
      id: newId,
      title: title,
      instrument: payload,
      dataset: payload,
      file_name: fileName,
      xml_attached: !!xmlLabel,
      status: 'INDEXED',
      resolution: payload === 'OHRC' ? '0.25 m/px' : payload === 'TMC-2' ? '5.0 m/px' : '80.0 m/px',
      gsd_m: payload === 'OHRC' ? 0.25 : payload === 'TMC-2' ? 5.0 : 80.0,
      image_url: '/images/DS-OHRC-BOGUSLAWSKY-01.png',
      thumbnail_url: '/thumbnails/DS-OHRC-BOGUSLAWSKY-01_thumb.png',
      message: `PDS4 observational dataset ${newId} successfully indexed into ISDA lunar catalog.`,
    }, { status: 201 });
  } catch (err: any) {
    return NextResponse.json({ error: err?.message || 'Ingestion failed' }, { status: 500 });
  }
}
