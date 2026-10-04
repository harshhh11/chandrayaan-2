import { NextResponse } from 'next/server';

const DATASETS = [
  {
    id: "DS-OHRC-BOGUSLAWSKY-01",
    title: "OHRC High-Resolution Optical — Boguslawsky E",
    dataset: "OHRC",
    instrument: "OHRC",
    acquisition: "2024-03-14T08:24:19Z",
    lat: -72.9,
    lon: 43.2,
    region: "Boguslawsky Crater (South Polar)",
    sun_elevation: 18.2,
    sun_azimuth: 48.5,
    resolution: "0.25 m/px",
    gsd_m: 0.25,
    image_url: "/media/orbital-satellite-poster.jpg",
    thumbnail_url: "/media/orbital-satellite-poster.jpg",
    file_size_kb: 4820,
    width: 2048,
    height: 2048,
    status: "INDEXED"
  },
  {
    id: "DS-TMC2-BOGUSLAWSKY-01",
    title: "TMC-2 Panchromatic Terrain Strip — Boguslawsky E",
    dataset: "TMC-2",
    instrument: "TMC-2",
    acquisition: "2024-03-14T08:24:19Z",
    lat: -72.9,
    lon: 43.2,
    region: "Boguslawsky Crater (South Polar)",
    sun_elevation: 19.0,
    sun_azimuth: 52.0,
    resolution: "5.0 m/px",
    gsd_m: 5.0,
    image_url: "/media/orbital-satellite-poster.jpg",
    thumbnail_url: "/media/orbital-satellite-poster.jpg",
    file_size_kb: 3240,
    width: 1024,
    height: 1024,
    status: "INDEXED"
  },
  {
    id: "DS-IIRS-SHACKLETON-02",
    title: "IIRS Hyperspectral Infrared (2.1 µm) — Shackleton Rim",
    dataset: "IIRS",
    instrument: "IIRS",
    acquisition: "2024-04-02T14:10:05Z",
    lat: -89.9,
    lon: 0.0,
    region: "Shackleton Rim (Lunar South Pole)",
    sun_elevation: 9.0,
    sun_azimuth: 115.0,
    resolution: "80.0 m/px",
    gsd_m: 80.0,
    image_url: "/media/orbital-satellite-poster.jpg",
    thumbnail_url: "/media/orbital-satellite-poster.jpg",
    file_size_kb: 8940,
    width: 512,
    height: 512,
    status: "INDEXED"
  },
  {
    id: "DS-OHRC-TYCHO-AM-03",
    title: "OHRC Optical — Tycho East (Morning Sun Azimuth 65°)",
    dataset: "OHRC",
    instrument: "OHRC",
    acquisition: "2024-01-18T05:30:00Z",
    lat: -43.31,
    lon: -11.36,
    region: "Tycho Crater Interior",
    sun_elevation: 24.0,
    sun_azimuth: 65.0,
    resolution: "0.25 m/px",
    gsd_m: 0.25,
    image_url: "/media/orbital-satellite-poster.jpg",
    thumbnail_url: "/media/orbital-satellite-poster.jpg",
    file_size_kb: 5120,
    width: 2048,
    height: 2048,
    status: "INDEXED"
  }
];

export async function GET() {
  return NextResponse.json(DATASETS);
}
