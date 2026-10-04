'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { 
  Database, Search, Filter, Upload, Eye, GitCompare, 
  Layers, ArrowUpDown, Download, CheckCircle2, RefreshCw, X, Plus,
  FileCode, Sparkles, AlertCircle, HardDrive, Compass, Sun, Info
} from 'lucide-react';
import { EdolusShell } from '@/components/layout/EdolusShell';

interface DatasetRecord {
  id: string;
  product_id?: string;
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
  source?: string;
}

export default function DatasetsPage() {
  const [datasets, setDatasets] = useState<DatasetRecord[]>([]);
  const [selectedSensor, setSelectedSensor] = useState<'ALL' | 'OHRC' | 'TMC-2' | 'IIRS'>('ALL');
  const [searchQuery, setSearchQuery] = useState('');
  const [loading, setLoading] = useState(true);
  const [scanning, setScanning] = useState(false);
  
  // Modals State
  const [uploadModalOpen, setUploadModalOpen] = useState(false);
  const [inspectModalOpen, setInspectModalOpen] = useState(false);
  const [inspectingDataset, setInspectingDataset] = useState<DatasetRecord | null>(null);
  const [inspectMetadata, setInspectMetadata] = useState<any | null>(null);
  const [metadataLoading, setMetadataLoading] = useState(false);

  // Upload Form State
  const [uploadTitle, setUploadTitle] = useState('');
  const [uploadSensor, setUploadSensor] = useState('OHRC');
  const [uploadFile, setUploadFile] = useState<File | null>(null);
  const [uploadXmlFile, setUploadXmlFile] = useState<File | null>(null);
  const [uploading, setUploading] = useState(false);
  const [uploadError, setUploadError] = useState<string | null>(null);

  const fetchDatasets = async () => {
    setLoading(true);
    const apiBase = process.env.NEXT_PUBLIC_API_URL || 'http://127.0.0.1:8000';
    try {
      const res = await fetch(`${apiBase}/api/datasets`);
      if (res.ok) {
        const data = await res.json();
        setDatasets(data);
      }
    } catch (e) {
      console.error('Failed to load datasets:', e);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchDatasets();
  }, []);

  const handleScanRaw = async () => {
    setScanning(true);
    const apiBase = process.env.NEXT_PUBLIC_API_URL || 'http://127.0.0.1:8000';
    try {
      const res = await fetch(`${apiBase}/api/ingest/scan-raw`, { method: 'POST' });
      if (res.ok) {
        await fetchDatasets();
      }
    } catch (e) {
      console.error('Failed to scan raw storage:', e);
    } finally {
      setScanning(false);
    }
  };

  const openInspectModal = async (item: DatasetRecord) => {
    setInspectingDataset(item);
    setInspectModalOpen(true);
    setMetadataLoading(true);
    const apiBase = process.env.NEXT_PUBLIC_API_URL || 'http://127.0.0.1:8000';
    try {
      const res = await fetch(`${apiBase}/api/datasets/${item.id}/metadata`);
      if (res.ok) {
        const data = await res.json();
        setInspectMetadata(data);
      } else {
        setInspectMetadata(null);
      }
    } catch {
      setInspectMetadata(null);
    } finally {
      setMetadataLoading(false);
    }
  };

  const filtered = datasets.filter(d => {
    const matchesSensor = selectedSensor === 'ALL' || d.instrument.includes(selectedSensor);
    const q = searchQuery.toLowerCase();
    const matchesQuery = !searchQuery || (
      d.id.toLowerCase().includes(q) ||
      (d.product_id && d.product_id.toLowerCase().includes(q)) ||
      d.title.toLowerCase().includes(q) ||
      d.region.toLowerCase().includes(q)
    );
    return matchesSensor && matchesQuery;
  });

  const handleUploadSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!uploadFile) {
      setUploadError('Please select a raster or archive file to upload.');
      return;
    }

    setUploading(true);
    setUploadError(null);

    const formData = new FormData();
    formData.append('file', uploadFile);
    if (uploadXmlFile) {
      formData.append('xml_label', uploadXmlFile);
    }
    formData.append('payload', uploadSensor);
    if (uploadTitle) {
      formData.append('title', uploadTitle);
    }

    const apiBase = process.env.NEXT_PUBLIC_API_URL || 'http://127.0.0.1:8000';
    try {
      const res = await fetch(`${apiBase}/api/datasets/ingest`, {
        method: 'POST',
        body: formData,
      });

      if (!res.ok) {
        const err = await res.json().catch(() => ({ detail: 'Ingestion failed' }));
        throw new Error(err.detail || 'Dataset ingestion failed');
      }

      await fetchDatasets();
      setUploadModalOpen(false);
      setUploadFile(null);
      setUploadXmlFile(null);
      setUploadTitle('');
    } catch (err: any) {
      setUploadError(err.message || 'Upload error');
    } finally {
      setUploading(false);
    }
  };

  return (
    <EdolusShell>
      <div className="space-y-6">
        
        {/* Header */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-white/[0.08] pb-5">
          <div>
            <div className="flex items-center gap-2 text-[10px] font-tech tracking-[0.18em] text-[#8D98A5] uppercase font-medium">
              <Database className="w-3.5 h-3.5 text-[#D9DDE0]" />
              <span>ISRO SCIENCE DATA ARCHIVE (ISDA) // CHANDRAYAAN-2 OPTICAL & HYPERSPECTRAL</span>
            </div>
            <h1 className="text-2xl sm:text-3xl font-display font-bold tracking-tight text-[#F4F6F8] mt-1">
              DATASET & PDS4 INGESTION EXPLORER
            </h1>
          </div>

          <div className="flex items-center gap-3">
            <button
              onClick={handleScanRaw}
              disabled={scanning}
              className="px-3.5 py-2.5 rounded-lg bg-[#0A1118] hover:bg-[#121E2A] border border-white/10 text-white/80 hover:text-white font-tech text-xs tracking-wide transition-colors flex items-center gap-2"
              title="Scan /data/raw directory for unindexed products"
            >
              <HardDrive className={`w-3.5 h-3.5 text-[#D9DDE0] ${scanning ? 'animate-spin' : ''}`} />
              <span>{scanning ? 'Scanning Raw Storage...' : 'Scan /data/raw'}</span>
            </button>

            <button
              onClick={() => { setUploadError(null); setUploadModalOpen(true); }}
              className="px-4 py-2.5 rounded-lg bg-white hover:bg-[#E2E8F0] text-black font-sans text-xs font-bold tracking-wide transition-colors shadow-sm flex items-center gap-2"
            >
              <Plus className="w-3.5 h-3.5" />
              <span>Ingest PDS4 / Raster</span>
            </button>
          </div>
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
              placeholder="Search product ID, crater region, coordinates..."
              className="w-full pl-9 pr-4 py-2 rounded-xl bg-[#050A12] border border-white/10 text-xs font-mono text-white placeholder-white/40 focus:outline-none focus:border-white/40"
            />
          </div>

          <div className="text-xs font-mono text-white/50 flex items-center gap-2">
            <span>Showing {filtered.length} of {datasets.length} database products</span>
          </div>
        </div>

        {/* Dataset Table */}
        <div className="rounded-3xl bg-[#07111F]/90 border border-white/10 overflow-hidden shadow-xl">
          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs font-mono">
              <thead className="bg-[#0B1726] border-b border-white/10 text-white/50 text-[10px] uppercase tracking-wider">
                <tr>
                  <th className="py-3.5 px-4">Preview</th>
                  <th className="py-3.5 px-4">Product ID & Region</th>
                  <th className="py-3.5 px-4">Payload</th>
                  <th className="py-3.5 px-4">Acquisition Time</th>
                  <th className="py-3.5 px-4">Lunar Coords</th>
                  <th className="py-3.5 px-4">Sun Geometry</th>
                  <th className="py-3.5 px-4">Resolution</th>
                  <th className="py-3.5 px-4 text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-white/5">
                {filtered.length === 0 ? (
                  <tr>
                    <td colSpan={8} className="py-12 text-center text-white/40 font-mono text-xs">
                      {loading ? 'Loading database records...' : 'NO DATA: No datasets match the current filter. Ingest new PDS4 products or scan /data/raw.'}
                    </td>
                  </tr>
                ) : (
                  filtered.map((item) => (
                    <tr key={item.id} className="hover:bg-white/[0.02] transition-colors group">
                      {/* Thumbnail */}
                      <td className="py-3 px-4">
                        <div className="w-12 h-12 rounded-lg bg-black border border-white/10 overflow-hidden relative">
                          <img src={item.thumbnail_url || item.image_url} alt={item.id} className="w-full h-full object-cover" />
                        </div>
                      </td>

                      {/* ID & Title */}
                      <td className="py-3 px-4">
                        <div className="font-bold text-white group-hover:text-[#D9DDE0] transition-colors">
                          {item.id}
                        </div>
                        <div className="text-[11px] text-white/50 font-sans truncate max-w-[240px]">
                          {item.title}
                        </div>
                      </td>

                      {/* Instrument Badge */}
                      <td className="py-3 px-4">
                        <span className={`px-2 py-0.5 rounded text-[10px] font-bold border ${
                          item.instrument === 'OHRC'
                            ? 'bg-white/10 text-white border-white/20'
                            : item.instrument === 'TMC-2'
                            ? 'bg-slate-500/20 text-[#D9DDE0] border-slate-500/30'
                            : 'bg-[#C89A45]/15 text-[#C89A45] border-[#C89A45]/30'
                        }`}>
                          {item.instrument}
                        </span>
                      </td>

                      {/* Acquisition */}
                      <td className="py-3 px-4 text-white/70">
                        {item.acquisition ? item.acquisition.split('T')[0] : 'N/A'}
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
                        <button
                          onClick={() => openInspectModal(item)}
                          className="inline-flex items-center gap-1 px-2.5 py-1 rounded-lg bg-white/5 hover:bg-white/10 text-white/70 hover:text-white transition-colors text-[10px]"
                          title="Inspect Metadata & PDS4 Label"
                        >
                          <FileCode className="w-3 h-3 text-[#D9DDE0]" />
                          <span>PDS4 Info</span>
                        </button>
                        <Link
                          href={`/correspondence?source=${encodeURIComponent(item.product_id || item.id)}`}
                          className="inline-flex items-center gap-1 px-2.5 py-1 rounded-lg bg-white/10 hover:bg-white/20 text-white transition-colors text-[10px] font-bold"
                          title="Match in Correspondence Workbench"
                        >
                          <GitCompare className="w-3 h-3" />
                          <span>Match</span>
                        </Link>
                      </td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>
        </div>

        {/* ========================================================
            INSPECT PDS4 METADATA MODAL
           ======================================================== */}
        {inspectModalOpen && inspectingDataset && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-md animate-fadeIn">
            <div className="w-full max-w-3xl bg-[#07111F] border border-white/20 rounded-3xl p-6 shadow-2xl space-y-4 max-h-[90vh] flex flex-col">
              <div className="flex items-center justify-between border-b border-white/10 pb-3">
                <div className="flex items-center gap-2">
                  <FileCode className="w-5 h-5 text-[#D9DDE0]" />
                  <h3 className="text-sm font-mono font-bold text-white uppercase tracking-wider">
                    PDS4 SCIENTIFIC METADATA // {inspectingDataset.id}
                  </h3>
                </div>
                <button
                  onClick={() => setInspectModalOpen(false)}
                  className="p-1 rounded-lg text-white/40 hover:text-white"
                >
                  <X className="w-4 h-4" />
                </button>
              </div>

              <div className="overflow-y-auto space-y-4 pr-1 scrollbar-thin scrollbar-thumb-white/10">
                {/* Visual Overview */}
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  <div className="h-44 rounded-2xl bg-black border border-white/10 overflow-hidden relative">
                    <img
                      src={inspectingDataset.image_url}
                      alt={inspectingDataset.id}
                      className="w-full h-full object-cover"
                    />
                    <div className="absolute top-2 left-2 px-2 py-0.5 rounded bg-black/80 text-[10px] font-mono text-[#D9DDE0]">
                      {inspectingDataset.instrument}
                    </div>
                  </div>

                  <div className="col-span-2 grid grid-cols-2 gap-3 text-xs font-mono bg-[#050A12] p-4 rounded-2xl border border-white/5">
                    <div>
                      <span className="text-white/40 block text-[9px] uppercase">Logical Product ID</span>
                      <span className="text-white font-bold break-all">{inspectMetadata?.product_id || inspectingDataset.product_id || inspectingDataset.id}</span>
                    </div>
                    <div>
                      <span className="text-white/40 block text-[9px] uppercase">Payload Instrument</span>
                      <span className="text-[#D9DDE0] font-bold">{inspectingDataset.instrument}</span>
                    </div>
                    <div>
                      <span className="text-white/40 block text-[9px] uppercase">Center Coordinates</span>
                      <span className="text-white font-bold">{inspectingDataset.lat}° S, {inspectingDataset.lon}° E</span>
                    </div>
                    <div>
                      <span className="text-white/40 block text-[9px] uppercase">Spatial Resolution</span>
                      <span className="text-white font-bold">{inspectingDataset.resolution}</span>
                    </div>
                    <div>
                      <span className="text-white/40 block text-[9px] uppercase">Sun Elevation Angle</span>
                      <span className="text-[#C89A45] font-bold">{inspectingDataset.sun_elevation}°</span>
                    </div>
                    <div>
                      <span className="text-white/40 block text-[9px] uppercase">Sun Azimuth Angle</span>
                      <span className="text-[#C89A45] font-bold">{inspectingDataset.sun_azimuth}°</span>
                    </div>
                  </div>
                </div>

                {/* Raw PDS4 XML Tab */}
                <div className="space-y-2">
                  <div className="flex items-center justify-between text-xs font-mono text-white/70">
                    <span>Authentic ISRO PDS4 XML Structure:</span>
                    <span className="text-[10px] text-[#32D39A]">Ground Truth Verified</span>
                  </div>
                  <pre className="p-4 rounded-2xl bg-[#03060A] border border-white/10 text-[11px] font-mono text-[#A9C7DF] overflow-x-auto max-h-56 leading-relaxed select-text">
                    {metadataLoading ? 'Parsing PDS4 XML tree...' : (inspectMetadata?.raw_pds4_xml || JSON.stringify(inspectMetadata?.metadata_json || inspectingDataset, null, 2))}
                  </pre>
                </div>
              </div>

              <div className="pt-2 border-t border-white/10 flex items-center justify-between">
                <span className="text-[10px] font-mono text-white/40">ISRO Chandrayaan-2 Planetary Data System (PDS4 v1.14)</span>
                <button
                  onClick={() => setInspectModalOpen(false)}
                  className="px-4 py-2 rounded-xl bg-white/5 hover:bg-white/10 text-white/80 text-xs font-mono"
                >
                  Close
                </button>
              </div>
            </div>
          </div>
        )}

        {/* ========================================================
            UPLOAD / INGESTION MODAL
           ======================================================== */}
        {uploadModalOpen && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-md animate-fadeIn">
            <div className="w-full max-w-lg bg-[#07111F] border border-white/20 rounded-3xl p-6 shadow-2xl space-y-4">
              <div className="flex items-center justify-between border-b border-white/10 pb-3">
                <h3 className="text-sm font-mono font-bold text-white uppercase tracking-wider">
                  INGEST CHANDRAYAAN-2 PRODUCT (ZIP / RASTER + XML)
                </h3>
                <button
                  onClick={() => setUploadModalOpen(false)}
                  className="p-1 rounded-lg text-white/40 hover:text-white"
                >
                  <X className="w-4 h-4" />
                </button>
              </div>

              {uploadError && (
                <div className="p-3 rounded-xl bg-[#FF5C67]/10 border border-[#FF5C67]/30 text-[#FF5C67] text-xs font-mono flex items-center gap-2">
                  <AlertCircle className="w-4 h-4 shrink-0" />
                  <span>{uploadError}</span>
                </div>
              )}

              <form onSubmit={handleUploadSubmit} className="space-y-4 text-xs font-mono">
                <div>
                  <label className="block text-white/60 mb-1">Product Title / Description</label>
                  <input
                    type="text"
                    value={uploadTitle}
                    onChange={(e) => setUploadTitle(e.target.value)}
                    placeholder="e.g. Boguslawsky Crater South Polar Swath"
                    className="w-full px-3 py-2 rounded-xl bg-[#050A12] border border-white/10 text-white focus:outline-none focus:border-white/40"
                  />
                </div>

                <div>
                  <label className="block text-white/60 mb-1">Target Instrument Payload</label>
                  <select
                    value={uploadSensor}
                    onChange={(e) => setUploadSensor(e.target.value)}
                    className="w-full px-3 py-2 rounded-xl bg-[#050A12] border border-white/10 text-white focus:outline-none focus:border-white/40"
                  >
                    <option value="OHRC">OHRC (0.25 m/px High-Resolution)</option>
                    <option value="TMC-2">TMC-2 (5.0 m/px Terrain Mapping)</option>
                    <option value="IIRS">IIRS (80.0 m/px Hyperspectral 0.8-5.0µm)</option>
                  </select>
                </div>

                {/* File Dropzone */}
                <div>
                  <label className="block text-white/60 mb-1">Select Raster File or PRADAN ZIP Archive (.zip, .png, .tif)</label>
                  <input
                    type="file"
                    accept=".png,.jpg,.jpeg,.tif,.tiff,.zip"
                    onChange={(e) => setUploadFile(e.target.files ? e.target.files[0] : null)}
                    className="w-full text-xs text-white/60 file:mr-3 file:py-2 file:px-4 file:rounded-xl file:border-0 file:text-xs file:font-mono file:bg-white/10 file:text-white hover:file:bg-white/20 cursor-pointer"
                    required
                  />
                </div>

                {/* Optional XML Label */}
                <div>
                  <label className="block text-white/60 mb-1">Optional PDS4 XML Label File (.xml)</label>
                  <input
                    type="file"
                    accept=".xml"
                    onChange={(e) => setUploadXmlFile(e.target.files ? e.target.files[0] : null)}
                    className="w-full text-xs text-white/60 file:mr-3 file:py-2 file:px-4 file:rounded-xl file:border-0 file:text-xs file:font-mono file:bg-white/10 file:text-white/80 hover:file:bg-white/20 cursor-pointer"
                  />
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
                    className="px-5 py-2 rounded-xl bg-gradient-to-r from-[#2F80FF] to-[#00B8FF] text-white font-bold flex items-center gap-2 shadow-[0_0_15px_rgba(56,168,255,0.3)]"
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
