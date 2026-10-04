import { NextResponse } from 'next/server';

export async function GET() {
  const candidates = [
    {
      id: 'MATCH-TYCHO-AM-PM',
      title: 'Tycho Crater — Opposing Sun Azimuth (85° vs 265°)',
      region_name: 'Tycho Crater Rim',
      description: 'Sun-angle invariant correspondence challenge between morning and evening low-elevation solar illumination swaths (180° shadow reversal).',
      source_image: {
        id: 'ch2_ohr_ncp_20220324T184000_d_img_d18',
        title: 'OHRC Tycho Afternoon (265° Azimuth)',
        sensor: 'OHRC',
        gsd_m: 0.25,
        sun_geometry: { azimuth_deg: 265.0, elevation_deg: 30.5 },
        image_url: '/images/ch2_ohr_ncp_20220324T184000_d_img_d18.png',
        thumbnail_url: '/thumbnails/ch2_ohr_ncp_20220324T184000_d_img_d18_thumb.png',
      },
      reference_image: {
        id: 'ch2_ohr_ncp_20220310T061500_d_img_d18',
        title: 'OHRC Tycho Morning (85° Azimuth)',
        sensor: 'OHRC',
        gsd_m: 0.25,
        sun_geometry: { azimuth_deg: 85.0, elevation_deg: 32.0 },
        image_url: '/images/ch2_ohr_ncp_20220310T061500_d_img_d18.png',
        thumbnail_url: '/thumbnails/ch2_ohr_ncp_20220310T061500_d_img_d18_thumb.png',
      },
      scale_ratio: '1:1 (0.25m vs 0.25m)',
      sun_azimuth_delta_deg: 180.0,
      modality: 'Single-Sensor (OHRC vs OHRC)',
      difficulty: 'HIGH (Shadow Inversion)',
    },
    {
      id: 'MATCH-BOGUSLAWSKY-OHRC-TMC',
      title: 'Boguslawsky E — Cross-Scale Optical (OHRC 0.25m vs TMC-2 5.0m)',
      region_name: 'Boguslawsky E Crater',
      description: 'Scale-invariant cross-resolution registration bridging 20x GSD spatial resolution discrepancy for high-precision landing site mapping.',
      source_image: {
        id: 'ch2_ohr_ncp_20191015T041200_d_img_d18',
        title: 'OHRC Boguslawsky E Sub-Meter Frame',
        sensor: 'OHRC',
        gsd_m: 0.25,
        sun_geometry: { azimuth_deg: 65.2, elevation_deg: 28.4 },
        image_url: '/images/ch2_ohr_ncp_20191015T041200_d_img_d18.png',
        thumbnail_url: '/thumbnails/ch2_ohr_ncp_20191015T041200_d_img_d18_thumb.png',
      },
      reference_image: {
        id: 'ch2_tmc_ncn_20200411T093000_d_img_d18',
        title: 'TMC-2 Boguslawsky E Terrain Strip',
        sensor: 'TMC-2',
        gsd_m: 5.0,
        sun_geometry: { azimuth_deg: 142.8, elevation_deg: 54.1 },
        image_url: '/images/ch2_tmc_ncn_20200411T093000_d_img_d18.png',
        thumbnail_url: '/thumbnails/ch2_tmc_ncn_20200411T093000_d_img_d18_thumb.png',
      },
      scale_ratio: '20:1 (0.25m vs 5.0m)',
      sun_azimuth_delta_deg: 77.6,
      modality: 'Cross-Scale Optical (OHRC vs TMC-2)',
      difficulty: 'CRITICAL (20x Resolution Delta)',
    },
    {
      id: 'MATCH-SHACKLETON-TMC-IIRS',
      title: 'Shackleton Rim — Multi-Modal Optical to Hyperspectral (TMC-2 vs IIRS)',
      region_name: 'Shackleton Rim (South Pole)',
      description: 'Multi-modal spectral registration aligning TMC-2 panchromatic terrain with IIRS 2.1 µm volatile absorption band at South Pole PSR.',
      source_image: {
        id: 'ch2_tmc_ncn_20210828T144500_d_img_d18',
        title: 'TMC-2 Shackleton Polar Strip',
        sensor: 'TMC-2',
        gsd_m: 5.0,
        sun_geometry: { azimuth_deg: 180.0, elevation_deg: 12.4 },
        image_url: '/images/ch2_tmc_ncn_20210828T144500_d_img_d18.png',
        thumbnail_url: '/thumbnails/ch2_tmc_ncn_20210828T144500_d_img_d18_thumb.png',
      },
      reference_image: {
        id: 'ch2_iir_ncn_20210828T144500_d_cub_d18',
        title: 'IIRS Hyperspectral 2.1 µm Band',
        sensor: 'IIRS',
        gsd_m: 80.0,
        sun_geometry: { azimuth_deg: 180.0, elevation_deg: 12.4 },
        image_url: '/images/ch2_iir_ncn_20210828T144500_d_cub_d18.png',
        thumbnail_url: '/thumbnails/ch2_iir_ncn_20210828T144500_d_cub_d18_thumb.png',
      },
      scale_ratio: '16:1 (5.0m vs 80.0m)',
      sun_azimuth_delta_deg: 0.0,
      modality: 'Multi-Modal (Panchromatic vs Hyperspectral IR)',
      difficulty: 'VERY HIGH (Cross-Modal Reflectance)',
    },
  ];

  return NextResponse.json(candidates, {
    status: 200,
    headers: {
      'Cache-Control': 'public, s-maxage=60, stale-while-revalidate=120',
    },
  });
}
