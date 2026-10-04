import { NextResponse } from 'next/server';

const TIMELINE = [
  {
    id: "TL-01",
    year: "2019",
    date: "2019-08-20",
    event: "Lunar Orbit Insertion",
    instrument: "ALL",
    region: "Polar Orbit (100 km circular)",
    description: "Chandrayaan-2 successfully injected into 100 km polar lunar orbit."
  },
  {
    id: "TL-02",
    year: "2019",
    date: "2019-10-15",
    event: "First OHRC High-Resolution Strip",
    instrument: "OHRC",
    region: "Boguslawsky E Crater (74.3°S, 53.6°E)",
    description: "0.25 m/px ultra-resolution observation under low illumination."
  },
  {
    id: "TL-03",
    year: "2020",
    date: "2020-04-11",
    event: "TMC-2 Stereo Swath Ingestion",
    instrument: "TMC-2",
    region: "Manzinus C & Simpelius (72.8°S, 33.7°E)",
    description: "5.0 m/px triplet stereo coverage generating digital elevation models."
  },
  {
    id: "TL-04",
    year: "2021",
    date: "2021-08-28",
    event: "IIRS Hyperspectral Mapping",
    instrument: "IIRS",
    region: "Shackleton Rim & South Pole",
    description: "0.8 - 5.0 µm 256 spectral bands for mineralogical and hydroxyl detection."
  },
  {
    id: "TL-05",
    year: "2023",
    date: "2023-08-23",
    event: "Chandrayaan-3 Landing Site Cross-Registration",
    instrument: "OHRC / TMC-2",
    region: "Shiv Shakti Point (69.3676°S, 32.3481°E)",
    description: "Sub-pixel multi-scale correspondence verification between 2019 and 2023 images."
  },
  {
    id: "TL-06",
    year: "2024",
    date: "2024-09-30",
    event: "EDOLUS Automated Engine Ingestion",
    instrument: "OHRC / TMC-2 / IIRS",
    region: "Global Lunar Database",
    description: "Sun-angle invariant feature correspondence across all three optical instruments."
  }
];

export async function GET() {
  return NextResponse.json(TIMELINE);
}
