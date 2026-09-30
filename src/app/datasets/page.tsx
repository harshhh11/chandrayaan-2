'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { 
  Database, Search, Filter, Upload, Eye, GitCompare, 
  Layers, ArrowUpDown, Download, CheckCircle2, RefreshCw, X, Plus
} from 'lucide-react';
import { EdolusShell } from '@/components/layout/EdolusShell';

interface DatasetRecord {
  id: string;
  title: string;
  dataset: string;
  instrument: string;
  acquisition: string;
  lat: number;
  lon: number;
  region: string;
  sun_elevation: number;
  sun_azimuth: number;
  resolution: string;
  gsd_m: number;
  image_url: string;
  thumbnail_url: string;
  file_size_kb: number;
  width: number;
  height: number;
  status: string;
}

const FALLBACK_DATASETS: DatasetRecord[] = [
  {
    id: 'OHRC-BOGUSLAWSKY-001',
    title: 'Boguslawsky Crater South Pole OHRC',
    dataset: 'OHRC',
    instrument: 'OHRC',
    acquisition: '2019-10-15T04:12:00Z',
    lat: -74.32,
    lon: 53.64,
    region: 'Boguslawsky E Crater',
    sun_elevation: 28.4,
    sun_azimuth: 65.2,
    resolution: '0.25 m/px',
    gsd_m: 0.25,
    image_url: '/api/images/OHRC-BOGUSLAWSKY-001.png',
    thumbnail_url: '/api/images/OHRC-BOGUSLAWSKY-001.png',
    file_size_kb: 4820,
    width: 2048,
    height: 2048,
    status: 'INDEXED'
  },
  {
    id: 'TMC-BOGUSLAWSKY-002',
    title: 'Boguslawsky Crater TMC-2 Swath',
    dataset: 'TMC-2',
    instrument: 'TMC-2',
    acquisition: '2020-04-11T09:30:00Z',
    lat: -74.30,
    lon: 53.60,
    region: 'Boguslawsky E Crater',
    sun_elevation: 54.1,
    sun_azimuth: 142.8,
    resolution: '5.00 m/px',
    gsd_m: 5.0,
    image_url: '/api/images/TMC-BOGUSLAWSKY-002.png',
    thumbnail_url: '/api/images/TMC-BOGUSLAWSKY-002.png',
    file_size_kb: 3240,
    width: 1024,
    height: 1024,
    status: 'INDEXED'
  },
  {
    id: 'IIRS-SHACKLETON-003',
    title: 'Shackleton Rim Hyperspectral Cube',
    dataset: 'IIRS',
    instrument: 'IIRS',
    acquisition: '2021-08-28T14:45:00Z',
    lat: -89.90,
    lon: 0.00,
    region: 'Shackleton Rim',
    sun_elevation: 12.6,
    sun_azimuth: 210.4,
    resolution: '80.0 m/px',
    gsd_m: 80.0,
    image_url: '/api/images/IIRS-SHACKLETON-003.png',
    thumbnail_url: '/api/images/IIRS-SHACKLETON-003.png',
    file_size_kb: 8940,
    width: 512,
    height: 512,
    status: 'INDEXED'
  },
  {
    id: 'OHRC-MANZINUS-004',
    title: 'Manzinus C High-Res Target',
    dataset: 'OHRC',
    instrument: 'OHRC',
    acquisition: '2022-01-19T08:15:00Z',
    lat: -72.80,
    lon: 33.70,
    region: 'Manzinus C Crater',
    sun_elevation: 34.2,
    sun_azimuth: 88.5,
    resolution: '0.25 m/px',
    gsd_m: 0.25,
    image_url: '/api/images/OHRC-BOGUSLAWSKY-001.png',
    thumbnail_url: '/api/images/OHRC-BOGUSLAWSKY-001.png',
    file_size_kb: 5120,
    width: 2048,
    height: 2048,
    status: 'INDEXED'
  },
  {
    id: 'TMC-MANZINUS-005',
    title: 'Manzinus Stereo Digital Terrain',
    dataset: 'TMC-2',
    instrument: 'TMC-2',
    acquisition: '2022-06-03T11:20:00Z',
    lat: -72.82,
    lon: 33.68,
    region: 'Manzinus C Crater',
    sun_elevation: 48.9,
    sun_azimuth: 165.1,
    resolution: '5.00 m/px',
    gsd_m: 5.0,
    image_url: '/api/images/TMC-BOGUSLAWSKY-002.png',
    thumbnail_url: '/api/images/TMC-BOGUSLAWSKY-002.png',
    file_size_kb: 2980,
    width: 1024,
    height: 1024,
    status: 'INDEXED'
  }
];

export default function DatasetsPage() {
  const [datasets, setDatasets] = useState<DatasetRecord[]>(FALLBACK_DATASETS);
  const [selectedSensor, setSelectedSensor] = useState<'ALL' | 'OHRC' | 'TMC-2' | 'IIRS'>('ALL');
  const [searchQuery, setSearchQuery] = useState('');
  const [uploadModalOpen, setUploadModalOpen] = useState(false);

  // Upload Form State
  const [uploadTitle, setUploadTitle] = useState('');
  const [uploadSensor, setUploadSensor] = useState('OHRC');
  const [uploadGSD, setUploadGSD] = useState('0.25');
  const [uploadSunElev, setUploadSunElev] = useState('30.0');
  const [uploadSunAzim, setUploadSunAzim] = useState('45.0');
  const [uploading, setUploading] = useState(false);

  useEffect(() => {
    fetch('http://127.0.0.1:8000/api/images-list')
      .then(res => res.ok ? res.json() : null)
      .then(data => {
        if (data && data.length > 0) setDatasets(data);
      })
      .catch(() => {});
  }, []);

  const filtered = datasets.filter(d => {
    const matchesSensor = selectedSensor === 'ALL' || d.instrument.includes(selectedSensor);
    const q = searchQuery.toLowerCase();
    const matchesQuery = !searchQuery || (
      d.id.toLowerCase().includes(q) ||
      d.title.toLowerCase().includes(q) ||
      d.region.toLowerCase().includes(q)
    );
    return matchesSensor && matchesQuery;
  });

  const handleUploadSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setUploading(true);
    // Simulate or call backend upload
    setTimeout(() => {
      const newItem: DatasetRecord = {
        id: `UPLOAD-${Date.now().toString().slice(-6)}`,
        title: uploadTitle || 'User Uploaded Lunar Swath',
        dataset: uploadSensor,
        instrument: uploadSensor,
        acquisition: new Date().toISOString(),
        lat: -74.5,
        lon: 50.0,
        region: 'User Region Ingestion',
        sun_elevation: parseFloat(uploadSunElev),
        sun_azimuth: parseFloat(uploadSunAzim),
        resolution: `${uploadGSD} m/px`,
        gsd_m: parseFloat(uploadGSD),
        image_url: '/api/images/OHRC-BOGUSLAWSKY-001.png',
        thumbnail_url: '/api/images/OHRC-BOGUSLAWSKY-001.png',
        file_size_kb: 4200,
        width: 1024,
        height: 1024,
        status: 'INDEXED'
      };
      setDatasets([newItem, ...datasets]);
      setUploading(false);
      setUploadModalOpen(false);
    }, 800);
  };

  return (
    <EdolusShell>
      <div className="space-y-6">
        
        {/* Header */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-white/10 pb-5">
          <div>
            <div className="flex items-center gap-2 text-[10px] font-mono tracking-widest text-[#4DEBFF] uppercase">
              <Database className="w-3.5 h-3.5" />
              <span>CHANDRAYAAN-2 OPTICAL & HYPERSPECTRAL ARCHIVE</span>
            </div>
            <h1 className="text-2xl sm:text-3xl font-bold font-sans tracking-tight text-white mt-1">
              DATASET & PDS4 INGESTION EXPLORER
            </h1>
          </div>

          <button
            onClick={() => setUploadModalOpen(true)}
            className="px-5 py-2.5 rounded-xl bg-gradient-to-r from-[#2F80FF] to-[#00B8FF] text-white font-mono text-xs font-bold tracking-wider uppercase shadow-[0_0_20px_rgba(0,184,255,0.3)] hover:brightness-110 transition-all flex items-center gap-2 self-start sm:self-auto"
          >
            <Plus className="w-4 h-4" />
            <span>Ingest PDS4 / Raster</span>
          </button>
        </div>

        {/* Filter & Search Toolbar */}
        <div className="flex flex-col md:flex-row items-stretch md:items-center justify-between gap-4 bg-[#07111F]/90 p-4 rounded-2xl border border-white/10">
          
          {/* Sensor Tabs */}
          <div className="flex items-center gap-1 bg-[#050A12] p-1 rounded-xl border border-white/5 text-xs font-mono">
            {(['ALL', 'OHRC', 'TMC-2', 'IIRS'] as const).map(s => (
              <button
                key={s}
                onClick={() => setSelectedSensor(s)}
                className={`px-3 py-1.5 rounded-lg transition-all ${
                  selectedSensor === s
                    ? 'bg-[#2F80FF] text-white font-bold'
                    : 'text-white/50 hover:text-white'
                }`}
              >
                {s}
              </button>
            ))}
          </div>

          {/* Search Input */}
          <div className="flex-1 max-w-md relative">
            <Search className="w-4 h-4 text-white/40 absolute left-3 top-1/2 -translate-y-1/2" />
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Search image ID, region, coordinates..."
              className="w-full pl-9 pr-4 py-2 rounded-xl bg-[#050A12] border border-white/10 text-xs font-mono text-white placeholder-white/40 focus:outline-none focus:border-[#4DEBFF]"
            />
          </div>

          <div className="text-xs font-mono text-white/50 flex items-center gap-2">
            <span>Showing {filtered.length} indexed products</span>
          </div>
        </div>

        {/* Dataset Table */}
        <div className="rounded-3xl bg-[#07111F]/90 border border-white/10 overflow-hidden shadow-xl">
          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs font-mono">
              <thead className="bg-[#0B1726] border-b border-white/10 text-white/50 text-[10px] uppercase tracking-wider">
                <tr>
                  <th className="py-3.5 px-4">Image Preview</th>
                  <th className="py-3.5 px-4">Image ID & Title</th>
                  <th className="py-3.5 px-4">Instrument</th>
                  <th className="py-3.5 px-4">Acquisition Date</th>
                  <th className="py-3.5 px-4">Coordinates</th>
                  <th className="py-3.5 px-4">Sun Geometry</th>
                  <th className="py-3.5 px-4">Resolution</th>
                  <th className="py-3.5 px-4 text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-white/5">
                {filtered.map((item) => (
                  <tr key={item.id} className="hover:bg-white/[0.02] transition-colors group">
                    {/* Thumbnail */}
                    <td className="py-3 px-4">
                      <div className="w-12 h-12 rounded-lg bg-black border border-white/10 overflow-hidden relative">
                        <img src={item.thumbnail_url} alt={item.id} className="w-full h-full object-cover" />
                      </div>
                    </td>

                    {/* ID & Title */}
                    <td className="py-3 px-4">
                      <div className="font-bold text-white group-hover:text-[#4DEBFF] transition-colors">
                        {item.id}
                      </div>
                      <div className="text-[11px] text-white/50 font-sans truncate max-w-[220px]">
                        {item.title}
                      </div>
                    </td>

                    {/* Instrument Badge */}
                    <td className="py-3 px-4">
                      <span className={`px-2 py-0.5 rounded text-[10px] font-bold border ${
                        item.instrument === 'OHRC'
                          ? 'bg-[#4DEBFF]/10 text-[#4DEBFF] border-[#4DEBFF]/30'
                          : item.instrument === 'TMC-2'
                          ? 'bg-[#2F80FF]/10 text-[#2F80FF] border-[#2F80FF]/30'
                          : 'bg-[#FFB547]/10 text-[#FFB547] border-[#FFB547]/30'
                      }`}>
                        {item.instrument}
                      </span>
                    </td>

                    {/* Acquisition */}
                    <td className="py-3 px-4 text-white/70">
                      {item.acquisition.split('T')[0]}
                    </td>

                    {/* Lat / Lon */}
                    <td className="py-3 px-4 text-white/70">
                      {item.lat}° S, {item.lon}° E
                    </td>

                    {/* Sun Geometry */}
                    <td className="py-3 px-4">
                      <div className="text-white/80">{item.sun_elevation}° Elev</div>
                      <div className="text-[10px] text-white/40">{item.sun_azimuth}° Azim</div>
                    </td>

                    {/* Resolution */}
                    <td className="py-3 px-4 font-bold text-white">
                      {item.resolution}
                    </td>

                    {/* Action Buttons */}
                    <td className="py-3 px-4 text-right space-x-2">
                      <Link
                        href={`/image/${item.id}`}
                        className="inline-flex items-center gap-1 px-2.5 py-1 rounded-lg bg-white/5 hover:bg-white/10 text-white/70 hover:text-white transition-colors text-[10px]"
                        title="Inspect Detail"
                      >
                        <Eye className="w-3 h-3" />
                        <span>Inspect</span>
                      </Link>
                      <Link
                        href="/correspondence"
                        className="inline-flex items-center gap-1 px-2.5 py-1 rounded-lg bg-[#2F80FF]/20 hover:bg-[#2F80FF]/40 text-[#4DEBFF] transition-colors text-[10px]"
                        title="Match in Workbench"
                      >
                        <GitCompare className="w-3 h-3" />
                        <span>Match</span>
                      </Link>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>

        {/* Upload / Ingestion Modal */}
        {uploadModalOpen && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-md animate-fadeIn">
            <div className="w-full max-w-lg bg-[#07111F] border border-[#4DEBFF]/30 rounded-3xl p-6 shadow-2xl space-y-4">
              <div className="flex items-center justify-between border-b border-white/10 pb-3">
                <h3 className="text-sm font-mono font-bold text-white uppercase tracking-wider">
                  INGEST PDS4 / LUNAR RASTER FILE
                </h3>
                <button
                  onClick={() => setUploadModalOpen(false)}
                  className="p-1 rounded-lg text-white/40 hover:text-white"
                >
                  <X className="w-4 h-4" />
                </button>
              </div>

              <form onSubmit={handleUploadSubmit} className="space-y-4 text-xs font-mono">
                <div>
                  <label className="block text-white/60 mb-1">Product Title</label>
                  <input
                    type="text"
                    value={uploadTitle}
                    onChange={(e) => setUploadTitle(e.target.value)}
                    placeholder="e.g. Boguslawsky Crater Swath 04"
                    className="w-full px-3 py-2 rounded-xl bg-[#050A12] border border-white/10 text-white focus:outline-none focus:border-[#4DEBFF]"
                    required
                  />
                </div>

                <div className="grid grid-cols-2 gap-3">
                  <div>
                    <label className="block text-white/60 mb-1">Instrument Modality</label>
                    <select
                      value={uploadSensor}
                      onChange={(e) => setUploadSensor(e.target.value)}
                      className="w-full px-3 py-2 rounded-xl bg-[#050A12] border border-white/10 text-white focus:outline-none focus:border-[#4DEBFF]"
                    >
                      <option value="OHRC">OHRC (0.25 m/px)</option>
                      <option value="TMC-2">TMC-2 (5.0 m/px)</option>
                      <option value="IIRS">IIRS (80.0 m/px)</option>
                    </select>
                  </div>
                  <div>
                    <label className="block text-white/60 mb-1">GSD Resolution (m/px)</label>
                    <input
                      type="number"
                      step="0.01"
                      value={uploadGSD}
                      onChange={(e) => setUploadGSD(e.target.value)}
                      className="w-full px-3 py-2 rounded-xl bg-[#050A12] border border-white/10 text-white focus:outline-none focus:border-[#4DEBFF]"
                    />
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-3">
                  <div>
                    <label className="block text-white/60 mb-1">Sun Elevation (°)</label>
                    <input
                      type="number"
                      step="0.1"
                      value={uploadSunElev}
                      onChange={(e) => setUploadSunElev(e.target.value)}
                      className="w-full px-3 py-2 rounded-xl bg-[#050A12] border border-white/10 text-white focus:outline-none focus:border-[#4DEBFF]"
                    />
                  </div>
                  <div>
                    <label className="block text-white/60 mb-1">Sun Azimuth (°)</label>
                    <input
                      type="number"
                      step="0.1"
                      value={uploadSunAzim}
                      onChange={(e) => setUploadSunAzim(e.target.value)}
                      className="w-full px-3 py-2 rounded-xl bg-[#050A12] border border-white/10 text-white focus:outline-none focus:border-[#4DEBFF]"
                    />
                  </div>
                </div>

                <div className="p-4 rounded-2xl border-2 border-dashed border-white/20 text-center space-y-2 bg-[#050A12]/50">
                  <Upload className="w-6 h-6 text-[#4DEBFF] mx-auto" />
                  <div className="text-white/70">Drag and drop GeoTIFF / PNG / PDS4 image</div>
                  <div className="text-[10px] text-white/40">Supports 8-bit / 16-bit raster files up to 500MB</div>
                </div>

                <div className="flex items-center justify-end gap-3 pt-2">
                  <button
                    type="button"
                    onClick={() => setUploadModalOpen(false)}
                    className="px-4 py-2 rounded-xl bg-white/5 hover:bg-white/10 text-white/70"
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    disabled={uploading}
                    className="px-5 py-2 rounded-xl bg-gradient-to-r from-[#2F80FF] to-[#00B8FF] text-white font-bold flex items-center gap-2"
                  >
                    {uploading && <RefreshCw className="w-3.5 h-3.5 animate-spin" />}
                    <span>{uploading ? 'Ingesting...' : 'Ingest Product'}</span>
                  </button>
                </div>
              </form>
            </div>
          </div>
        )}

      </div>
    </EdolusShell>
  );
}
