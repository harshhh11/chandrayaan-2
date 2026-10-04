import { NextRequest, NextResponse } from 'next/server';
import { DATASETS_LIST } from '@/lib/serverDatasets';

export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ slug: string[] }> }
) {
  const { slug } = await params;
  const productId = slug[0];
  const type = slug[1] || 'preview';

  const dataset = DATASETS_LIST.find(
    d => d.id.toLowerCase() === productId.toLowerCase() ||
         d.product_id.toLowerCase() === productId.toLowerCase()
  );

  const targetUrl = type === 'thumbnail'
    ? (dataset?.thumbnail_url || `/thumbnails/${productId}_thumb.png`)
    : (dataset?.image_url || `/images/${productId}.png`);

  return NextResponse.redirect(new URL(targetUrl, request.url));
}
