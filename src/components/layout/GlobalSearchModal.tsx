'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { Search, Compass, Layers, Globe, Radio, Database, Sparkles, X, ChevronRight, ArrowRight } from 'lucide-react';

interface SearchResult {
  id: string;
  category: 'DATASET' | 'IMAGE' | 'JOB' | 'CRATER' | 'MODULE';
  title: string;
  subtitle: string;
  route: string;
  badge: string;
}

const SEARCH_DATABASE: SearchResult[] = [
  { id: '1', category: 'MODULE', title: 'Mission Console // Overview', subtitle: 'Chandrayaan-2 lunar imaging & telemetry dashboard', route: '/dashboard', badge: 'LIVE' },
  { id: '2', category: 'MODULE', title: 'Image Correspondence Workbench', subtitle: 'Multi-modal OHRC, TMC-2 & IIRS feature matching', route: '/correspondence', badge: 'CORE' },
  { id: '3', category: 'MODULE', title: 'Dataset & PDS4 Ingestion Explorer', subtitle: 'Calibrated Chandrayaan-2 optical image archive', route: '/datasets', badge: 'ARCHIVE' },
  { id: '4', category: 'MODULE', title: 'Lunar Geospatial Map & Orbit GIS', subtitle: '2D & 3D orthographic footprints and ground track', route: '/map', badge: 'GIS' },
  { id: '5', category: 'MODULE', title: 'Scientific Analytics & Performance', subtitle: 'Sun-angle & scale invariant benchmark metrics', route: '/analytics', badge: 'BENCHMARK' },
  { id: '6', category: 'MODULE', title: 'Scientific Report Generator', subtitle: 'Formal ISRO-format correspondence evaluation report', route: '/reports', badge: 'EXPORT' },
  { id: '7', category: 'MODULE', title: 'Mission Acquisition Timeline', subtitle: 'Chronological lunar observation events (2019–2024)', route: '/timeline', badge: 'HISTORY' },
  { id: '8', category: 'IMAGE', title: 'OHRC-BOGUSLAWSKY-001', subtitle: '0.25 m/px • Boguslawsky Crater • Sun Elev: 28.4°', route: '/image/OHRC-BOGUSLAWSKY-001', badge: 'OHRC' },
  { id: '9', category: 'IMAGE', title: 'TMC-BOGUSLAWSKY-002', subtitle: '5.00 m/px • Boguslawsky Crater • Sun Elev: 54.1°', route: '/image/TMC-BOGUSLAWSKY-002', badge: 'TMC-2' },
  { id: '10', category: 'IMAGE', title: 'IIRS-SHACKLETON-003', subtitle: '80.0 m/px • Shackleton Rim • 256 Spectral Bands', route: '/image/IIRS-SHACKLETON-003', badge: 'IIRS' },
  { id: '11', category: 'CRATER', title: 'Shiv Shakti Point (Chandrayaan-3 Site)', subtitle: '69.3676° S, 32.3481° E • South Pole Region', route: '/map?target=shiv-shakti', badge: 'COORDINATES' },
  { id: '12', category: 'CRATER', title: 'Boguslawsky E Crater', subtitle: '74.32° S, 53.64° E • Primary Benchmark Site', route: '/map?target=boguslawsky', badge: 'CRATER' }
];

interface GlobalSearchModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export const GlobalSearchModal: React.FC<GlobalSearchModalProps> = ({ isOpen, onClose }) => {
  const [query, setQuery] = useState('');
  const [results, setResults] = useState<SearchResult[]>(SEARCH_DATABASE);
  const router = useRouter();

  useEffect(() => {
    if (!query.trim()) {
      setResults(SEARCH_DATABASE);
    } else {
      const q = query.toLowerCase();
      setResults(
        SEARCH_DATABASE.filter(
          (item) =>
            item.title.toLowerCase().includes(q) ||
            item.subtitle.toLowerCase().includes(q) ||
            item.badge.toLowerCase().includes(q) ||
            item.category.toLowerCase().includes(q)
        )
      );
    }
  }, [query]);

  // Handle ESC key
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') onClose();
      if ((e.metaKey || e.ctrlKey) && e.key === 'k') {
        e.preventDefault();
        onClose();
      }
    };
    if (isOpen) window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [isOpen, onClose]);

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-start justify-center pt-20 px-4 bg-black/80 backdrop-blur-md animate-fadeIn">
      <div 
        className="w-full max-w-2xl bg-[#07111F]/95 border border-[#4DEBFF]/30 rounded-2xl shadow-[0_0_50px_rgba(0,184,255,0.2)] overflow-hidden flex flex-col"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Search Bar Input */}
        <div className="flex items-center px-5 py-4 border-b border-white/10 gap-3 bg-[#0B1726]/60">
          <Search className="w-5 h-5 text-[#4DEBFF] animate-pulse" />
          <input
            type="text"
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder="Search image IDs, datasets, lunar coordinates, craters, or telemetry..."
            className="flex-1 bg-transparent text-sm text-white placeholder-white/40 focus:outline-none font-mono"
            autoFocus
          />
          <button 
            onClick={onClose}
            className="p-1.5 rounded-lg text-white/40 hover:text-white hover:bg-white/10 transition-colors"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* Results List */}
        <div className="max-h-96 overflow-y-auto p-3 space-y-1 divide-y divide-white/[0.04]">
          {results.length === 0 ? (
            <div className="text-center py-10 text-xs font-mono text-white/40">
              No matching records found for query "{query}"
            </div>
          ) : (
            results.map((item) => (
              <button
                key={item.id}
                onClick={() => {
                  onClose();
                  router.push(item.route);
                }}
                className="w-full text-left p-3 rounded-xl hover:bg-[#2F80FF]/15 transition-all flex items-center justify-between group border border-transparent hover:border-[#4DEBFF]/20"
              >
                <div className="flex items-center gap-3">
                  <div className="w-8 h-8 rounded-lg bg-white/5 border border-white/10 flex items-center justify-center text-[#4DEBFF] group-hover:bg-[#00B8FF]/20">
                    {item.category === 'MODULE' && <Layers className="w-4 h-4" />}
                    {item.category === 'IMAGE' && <Database className="w-4 h-4" />}
                    {item.category === 'CRATER' && <Globe className="w-4 h-4" />}
                    {item.category === 'JOB' && <Radio className="w-4 h-4" />}
                  </div>
                  <div>
                    <div className="flex items-center gap-2">
                      <span className="text-xs font-bold font-mono text-white tracking-wide group-hover:text-[#4DEBFF] transition-colors">
                        {item.title}
                      </span>
                      <span className="text-[9px] font-mono uppercase px-1.5 py-0.5 rounded bg-white/10 text-white/70 border border-white/10">
                        {item.badge}
                      </span>
                    </div>
                    <p className="text-[11px] text-white/50 font-sans mt-0.5">
                      {item.subtitle}
                    </p>
                  </div>
                </div>
                <ArrowRight className="w-4 h-4 text-white/30 group-hover:text-[#4DEBFF] group-hover:translate-x-1 transition-all" />
              </button>
            ))
          )}
        </div>

        {/* Modal Footer Keybinds */}
        <div className="px-5 py-2.5 bg-[#050A12] border-t border-white/5 flex items-center justify-between text-[10px] font-mono text-white/40">
          <div className="flex items-center gap-3">
            <span><kbd className="px-1.5 py-0.5 rounded bg-white/10 text-white/70">ESC</kbd> to close</span>
            <span><kbd className="px-1.5 py-0.5 rounded bg-white/10 text-white/70">↵</kbd> to select</span>
          </div>
          <span className="text-[#4DEBFF]/80">EDOLUS INDEX // 12,486 RECORDS READY</span>
        </div>
      </div>
    </div>
  );
};
