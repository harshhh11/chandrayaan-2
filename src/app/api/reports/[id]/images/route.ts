import { NextRequest, NextResponse } from 'next/server';

export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  const { id } = await params;

  return NextResponse.json({
    analysis_id: id,
    source_image: '/images/ch2_ohr_ncp_20220324T184000_d_img_d18.png',
    reference_image: '/images/ch2_ohr_ncp_20220310T061500_d_img_d18.png',
    registered_image: '/images/ch2_ohr_ncp_20220324T184000_d_img_d18.png',
    difference_image: '/images/ch2_ohr_ncp_20220310T061500_d_img_d18.png',
    blend_image: '/images/ch2_ohr_ncp_20220324T184000_d_img_d18.png',
    correspondence_plot: '/images/ch2_ohr_ncp_20220324T184000_d_img_d18.png',
  });
}
