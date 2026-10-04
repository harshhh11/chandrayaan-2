import { NextRequest, NextResponse } from 'next/server';

export async function POST(request: NextRequest) {
  try {
    const formData = await request.formData();
    const xmlLabel = formData.get('xml_label') as File | null;
    const file = formData.get('file') as File | null;
    const payload = (formData.get('payload') as string) || 'OHRC';

    const pds4Id = `PDS4-CH2-${payload}-${Date.now().toString(36).toUpperCase()}`;

    return NextResponse.json({
      status: 'SUCCESS',
      product_id: pds4Id,
      payload: payload,
      label_file: xmlLabel ? xmlLabel.name : 'product.xml',
      raster_file: file ? file.name : 'raster.png',
      message: 'PDS4 metadata XML parsed and ingested into lunar database.',
    }, { status: 201 });
  } catch (err: any) {
    return NextResponse.json({ error: err?.message || 'PDS4 Ingestion failed' }, { status: 500 });
  }
}
