'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { WorkstationHeader } from '@/components/layout/WorkstationHeader';
import { apiClient } from '@/lib/api';
import { DatasetItem, SensorType } from '@/types/api';

export default function DatasetExplorerPage() {
  const [datasets, setDatasets] = useState<DatasetItem[]>([]);
  const [selectedSensor, setSelectedSensor] = useState<string>('ALL');
  const [uploading, setUploading] = useState(false);
  const [showUploadModal, setShowUploadModal] = useState(false);

  // Form states
  const [title, setTitle] = useState('');
  const [sensor, setSensor] = useState<SensorType>('OHRC');
  const [gsd, setGsd] = useState(0.25);
  const [sunAz, setSunAz] = useState(45.0);
  const [sunEl, setSunEl] = useState(30.0);
  const [file, setFile] = useState<File | null>(null);

  useEffect(() => {
    apiClient.getDatasets().then(setDatasets);
  }, []);

  const handleUpload = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!file) return;

    setUploading(true);
    const formData = new FormData();
    formData.append('file', file);
    formData.append('title', title || file.name);
    formData.append('sensor', sensor);
    formData.append('gsd_m', gsd.toString());
    formData.append('sun_azimuth_deg', sunAz.toString());
    formData.append('sun_elevation_deg', sunEl.toString());
    formData.append('region_name', 'User Ingested Lunar Swath');

    try {
      const newItem = await apiClient.uploadRaster(formData);
      setDatasets([newItem, ...datasets]);
      setShowUploadModal(false);
      setFile(null);
      setTitle('');
    } catch (err: any) {
      alert(`Upload error: ${err.message}`);
    } finally {
      setUploading(false);
    }
  };

  const filtered =
    selectedSensor === 'ALL'
      ? datasets
      : datasets.filter((d) => d.sensor === selectedSensor);

  return (
    <main className="min-h-screen bg-[#05070a] text-white select-none">
      <WorkstationHeader />

      <div className="max-w-7xl mx-auto px-4 sm:px-8 py-10 flex flex-col gap-8">
        {/* Top bar */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-6 border-b border-white/10 font-mono">
          <div className="flex flex-col gap-1">
            <span className="text-xs text-[#00C8FF] tracking-[0.25em] uppercase font-bold">
              DATA ARCHIVE // CHANDRAYAAN-2 LUNAR PAYLOADS
            </span>
            <h1 className="text-2xl sm:text-3xl font-black uppercase text-white tracking-tight">
              DATASET EXPLORER & RASTER INGESTION
            </h1>
          </div>

          <div className="flex items-center gap-3">
            <button
              onClick={() => setShowUploadModal(true)}
              className="px-5 py-2.5 rounded-lg bg-[#00C8FF] hover:bg-[#00B4E6] text-black font-bold text-xs tracking-wider uppercase transition-all shadow-[0_0_15px_rgba(0,200,255,0.2)]"
            >
              + INGEST RASTER FILE
            </button>
          </div>
        </div>

        {/* Sensor Filter Pills */}
        <div className="flex items-center gap-2 font-mono text-[11px] overflow-x-auto pb-2">
          {['ALL', 'OHRC', 'TMC-2', 'IIRS'].map((s) => (
            <button
              key={s}
              onClick={() => setSelectedSensor(s)}
              className={`px-4 py-1.5 rounded-full border transition-all uppercase ${
                selectedSensor === s
                  ? 'bg-[#00C8FF]/20 border-[#00C8FF] text-[#00C8FF] font-bold shadow-[0_0_10px_rgba(0,200,255,0.2)]'
                  : 'border-white/10 text-white/50 hover:text-white'
              }`}
            >
              {s === 'ALL' ? 'ALL SENSORS' : `${s} PAYLOAD`}
            </button>
          ))}
        </div>

        {/* Dataset Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 font-mono">
          {filtered.map((item) => (
            <div
              key={item.id}
              className="bg-[#080d16] border border-white/10 rounded-xl overflow-hidden flex flex-col justify-between group hover:border-[#00C8FF]/50 transition-all"
            >
              {/* Raster Preview Thumbnail */}
              <div className="relative w-full h-48 bg-[#020407] overflow-hidden flex items-center justify-center border-b border-white/10">
                <img
                  src={item.image_url}
                  alt={item.title}
                  className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                />
                <div className="absolute top-3 left-3 px-2.5 py-0.5 rounded bg-black/80 border border-white/10 text-[9px] text-[#00C8FF] font-bold">
                  {item.sensor} (GSD {item.gsd_m}m)
                </div>
                <div className="absolute bottom-3 right-3 px-2 py-0.5 rounded bg-black/80 text-[8px] text-white/60">
                  {item.width} × {item.height} px
                </div>
              </div>

              {/* Metadata Body */}
              <div className="p-5 flex flex-col gap-3">
                <div className="text-[10px] text-white/40">{item.id}</div>
                <h3 className="text-sm font-bold text-white uppercase leading-snug">
                  {item.title}
                </h3>
                <p className="text-xs text-white/60 font-sans line-clamp-2">
                  {item.description}
                </p>

                {/* Technical Specs */}
                <div className="grid grid-cols-2 gap-2 text-[9px] text-white/50 pt-2 border-t border-white/5">
                  <div>
                    REGION: <span className="text-white/80">{item.location.region_name}</span>
                  </div>
                  <div>
                    LAT/LON: <span className="text-white/80">{item.location.center_lat}° / {item.location.center_lon}°</span>
                  </div>
                  <div>
                    SUN AZ: <span className="text-[#00C8FF]">{item.sun_geometry.azimuth_deg}°</span>
                  </div>
                  <div>
                    SUN EL: <span className="text-amber-400">{item.sun_geometry.elevation_deg}°</span>
                  </div>
                </div>

                {/* Actions */}
                <div className="grid grid-cols-2 gap-2 pt-3">
                  <Link
                    href={`/register?src=${item.id}`}
                    className="py-2 rounded bg-white/[0.04] hover:bg-[#00C8FF]/20 text-[#00C8FF] text-center text-[10px] font-bold uppercase transition-all border border-[#00C8FF]/30"
                  >
                    USE AS SOURCE
                  </Link>
                  <Link
                    href={`/register?ref=${item.id}`}
                    className="py-2 rounded bg-white/[0.04] hover:bg-white/10 text-white/70 hover:text-white text-center text-[10px] font-bold uppercase transition-all border border-white/10"
                  >
                    USE AS REFERENCE
                  </Link>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Upload Modal */}
      {showUploadModal && (
        <div className="fixed inset-0 z-50 bg-black/80 backdrop-blur-sm flex items-center justify-center p-4 font-mono select-none">
          <div className="bg-[#080d16] border border-white/20 rounded-xl max-w-lg w-full p-6 flex flex-col gap-5 shadow-2xl">
            <div className="flex items-center justify-between pb-3 border-b border-white/10">
              <span className="text-xs text-[#00C8FF] font-bold uppercase">
                INGEST LUNAR RASTER FILE
              </span>
              <button
                onClick={() => setShowUploadModal(false)}
                className="text-white/40 hover:text-white text-sm"
              >
                ✕
              </button>
            </div>

            <form onSubmit={handleUpload} className="flex flex-col gap-4 text-xs">
              <div className="flex flex-col gap-1">
                <label className="text-white/60">RASTER FILE (PNG, TIFF, GeoTIFF, JPG)</label>
                <input
                  type="file"
                  required
                  accept=".png,.jpg,.jpeg,.tif,.tiff"
                  onChange={(e) => setFile(e.target.files?.[0] || null)}
                  className="p-2 rounded bg-[#020407] border border-white/10 text-white/70"
                />
              </div>

              <div className="flex flex-col gap-1">
                <label className="text-white/60">DATASET TITLE</label>
                <input
                  type="text"
                  placeholder="e.g. OHRC South Pole Swath 04"
                  value={title}
                  onChange={(e) => setTitle(e.target.value)}
                  className="p-2 rounded bg-[#020407] border border-white/10 text-white"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div className="flex flex-col gap-1">
                  <label className="text-white/60">SENSOR TYPE</label>
                  <select
                    value={sensor}
                    onChange={(e) => setSensor(e.target.value as SensorType)}
                    className="p-2 rounded bg-[#020407] border border-white/10 text-white"
                  >
                    <option value="OHRC">OHRC (0.25m)</option>
                    <option value="TMC-2">TMC-2 (5.0m)</option>
                    <option value="IIRS">IIRS (80m)</option>
                    <option value="LUNAR_REF">LUNAR REFERENCE</option>
                  </select>
                </div>

                <div className="flex flex-col gap-1">
                  <label className="text-white/60">GSD (m/pixel)</label>
                  <input
                    type="number"
                    step="0.01"
                    value={gsd}
                    onChange={(e) => setGsd(parseFloat(e.target.value))}
                    className="p-2 rounded bg-[#020407] border border-white/10 text-white"
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div className="flex flex-col gap-1">
                  <label className="text-white/60">SUN AZIMUTH (°)</label>
                  <input
                    type="number"
                    step="0.1"
                    value={sunAz}
                    onChange={(e) => setSunAz(parseFloat(e.target.value))}
                    className="p-2 rounded bg-[#020407] border border-white/10 text-white"
                  />
                </div>

                <div className="flex flex-col gap-1">
                  <label className="text-white/60">SUN ELEVATION (°)</label>
                  <input
                    type="number"
                    step="0.1"
                    value={sunEl}
                    onChange={(e) => setSunEl(parseFloat(e.target.value))}
                    className="p-2 rounded bg-[#020407] border border-white/10 text-white"
                  />
                </div>
              </div>

              <div className="pt-2 flex items-center justify-end gap-3">
                <button
                  type="button"
                  onClick={() => setShowUploadModal(false)}
                  className="px-4 py-2 rounded border border-white/10 text-white/60 hover:text-white"
                >
                  CANCEL
                </button>
                <button
                  type="submit"
                  disabled={uploading}
                  className="px-6 py-2 rounded bg-[#00C8FF] text-black font-bold uppercase hover:bg-[#00B4E6] disabled:opacity-50"
                >
                  {uploading ? 'UPLOADING...' : 'VALIDATE & INGEST'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </main>
  );
}
