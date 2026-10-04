'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { Calendar, Orbit, Database, ArrowRight, Clock, MapPin, Sparkles } from 'lucide-react';
import { EdolusShell } from '@/components/layout/EdolusShell';

interface TimelineEvent {
  id: string;
  year: string;
  date: string;
  event: string;
  instrument: string;
  region: string;
  description: string;
}

const FALLBACK_EVENTS: TimelineEvent[] = [
  {
    id: 'TL-01',
    year: '2019',
    date: '2019-08-20',
    event: 'Lunar Orbit Insertion',
    instrument: 'ALL',
    region: 'Polar Orbit (100 km circular)',
    description: 'Chandrayaan-2 successfully injected into 100 km polar lunar orbit.'
  },
  {
    id: 'TL-02',
    year: '2019',
    date: '2019-10-15',
    event: 'First OHRC High-Resolution Strip',
    instrument: 'OHRC',
    region: 'Boguslawsky E Crater (74.3°S, 53.6°E)',
    description: '0.25 m/px ultra-resolution observation under low illumination.'
  },
  {
    id: 'TL-03',
    year: '2020',
    date: '2020-04-11',
    event: 'TMC-2 Stereo Swath Ingestion',
    instrument: 'TMC-2',
    region: 'Manzinus C & Simpelius (72.8°S, 33.7°E)',
    description: '5.0 m/px triplet stereo coverage generating digital elevation models.'
  },
  {
    id: 'TL-04',
    year: '2021',
    date: '2021-08-28',
    event: 'IIRS Hyperspectral Mapping',
    instrument: 'IIRS',
    region: 'Shackleton Rim & South Pole',
    description: '0.8 - 5.0 µm 256 spectral bands for mineralogical and hydroxyl detection.'
  },
  {
    id: 'TL-05',
    year: '2023',
    date: '2023-08-23',
    event: 'Chandrayaan-3 Landing Site Cross-Registration',
    instrument: 'OHRC / TMC-2',
    region: 'Shiv Shakti Point (69.3676°S, 32.3481°E)',
    description: 'Sub-pixel multi-scale correspondence verification between 2019 and 2023 images.'
  },
  {
    id: 'TL-06',
    year: '2024',
    date: '2024-09-30',
    event: 'EDOLUS Automated Engine Ingestion',
    instrument: 'OHRC / TMC-2 / IIRS',
    region: 'Global Lunar Database',
    description: 'Sun-angle invariant feature correspondence across all three optical instruments.'
  }
];

export default function TimelinePage() {
  const [events, setEvents] = useState<TimelineEvent[]>(FALLBACK_EVENTS);

  useEffect(() => {
    fetch('http://127.0.0.1:8000/api/mission/timeline')
      .then(res => res.ok ? res.json() : null)
      .then(d => {
        if (d && d.length > 0) setEvents(d);
      })
      .catch(() => {});
  }, []);

  return (
    <EdolusShell>
      <div className="space-y-6">
        
        {/* Header */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-white/10 pb-5">
          <div>
            <div className="flex items-center gap-2 text-[10px] font-mono tracking-widest text-[#8D98A5] uppercase">
              <Calendar className="w-3.5 h-3.5 text-[#D9DDE0]" />
              <span>CHANDRAYAAN-2 LUNAR OBSERVATION CAMPAIGN (2019 – 2024)</span>
            </div>
            <h1 className="text-2xl sm:text-3xl font-bold font-sans tracking-tight text-white mt-1">
              MISSION & ACQUISITION TIMELINE
            </h1>
          </div>
        </div>

        {/* Timeline Sequence */}
        <div className="relative pl-6 sm:pl-10 space-y-8 border-l border-white/20 my-6">
          {events.map((ev, idx) => (
            <div key={ev.id} className="relative group">
              {/* Timeline Pin */}
              <div className="absolute -left-[31px] sm:-left-[47px] top-1.5 w-4 h-4 rounded-full bg-[#07111F] border-2 border-white/60 shadow-[0_0_8px_rgba(255,255,255,0.4)] group-hover:scale-125 transition-transform" />

              <div className="p-5 rounded-3xl bg-[#07111F]/90 border border-white/10 hover:border-white/30 transition-all space-y-2">
                <div className="flex flex-wrap items-center justify-between gap-2">
                  <div className="flex items-center gap-3">
                    <span className="px-2.5 py-0.5 rounded-md bg-white/10 border border-white/20 text-xs font-mono font-bold text-white">
                      {ev.year}
                    </span>
                    <h3 className="text-base font-mono font-bold text-white group-hover:text-[#D9DDE0] transition-colors">
                      {ev.event}
                    </h3>
                  </div>

                  <span className="px-2 py-0.5 rounded bg-white/10 text-[10px] font-mono text-white/70">
                    {ev.instrument}
                  </span>
                </div>

                <div className="flex items-center gap-2 text-xs font-mono text-white/50">
                  <Clock className="w-3.5 h-3.5 text-[#D9DDE0]" />
                  <span>{ev.date}</span>
                  <span>•</span>
                  <MapPin className="w-3.5 h-3.5 text-[#C89A45]" />
                  <span>{ev.region}</span>
                </div>

                <p className="text-xs text-white/70 font-sans leading-relaxed pt-1">
                  {ev.description}
                </p>
              </div>
            </div>
          ))}
        </div>

      </div>
    </EdolusShell>
  );
}
