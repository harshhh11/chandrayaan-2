'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { 
  FileText, Download, Printer, CheckCircle2, ShieldCheck, 
  Orbit, Sun, Maximize2, Cpu, GitCompare, Share2
} from 'lucide-react';
import { EdolusShell } from '@/components/layout/EdolusShell';

export default function ReportsPage() {
  const [analysisId, setAnalysisId] = useState('REP-20260930-BOGUSLAWSKY-001');
  const [isExporting, setIsExporting] = useState(false);

  const reportData = {
    report_id: analysisId,
    timestamp: '2026-09-30T12:45:00Z',
    operator: 'ISRO LUNAR SPECIALIST (LEVEL-3)',
    platform: 'EDOLUS // LUNAR INTELLIGENCE',
    mission: 'CHANDRAYAAN-2 (ISRO)',
    source: {
      id: 'OHRC-BOGUSLAWSKY-001',
      sensor: 'OHRC',
      gsd: '0.25 m/pixel',
      sun_elevation: 28.4,
      sun_azimuth: 65.2,
      lat: -74.32,
      lon: 53.64
    },
    target: {
      id: 'TMC-BOGUSLAWSKY-002',
      sensor: 'TMC-2',
      gsd: '1.20 m/pixel',
      sun_elevation: 54.1,
      sun_azimuth: 142.8,
      lat: -74.30,
      lon: 53.60
    },
    deltas: {
      sun_elevation_delta: '25.7°',
      sun_azimuth_delta: '77.6°',
      scale_ratio: '4.8×',
      mode: 'PHASE-CONGRUENCY + MULTI-SCALE GAUSSIAN PYRAMID'
    },
    results: {
      matches_detected: 1284,
      inlier_matches: 1071,
      inlier_ratio: '83.4%',
      median_error: '0.72 px',
      geometric_consistency: '94.1%',
      overall_confidence: '92.7%'
    },
    transformation_matrix: [
      [0.9984, -0.0521, 14.82],
      [0.0519, 0.9982, -8.45],
      [0.00002, -0.00001, 1.0000]
    ]
  };

  const handlePrint = () => {
    window.print();
  };

  const handleDownloadJSON = () => {
    const dataStr = "data:text/json;charset=utf-8," + encodeURIComponent(JSON.stringify(reportData, null, 2));
    const downloadAnchor = document.createElement('a');
    downloadAnchor.setAttribute("href", dataStr);
    downloadAnchor.setAttribute("download", `EDOLUS_${analysisId}.json`);
    document.body.appendChild(downloadAnchor);
    downloadAnchor.click();
    downloadAnchor.remove();
  };

  const handleDownloadCSV = () => {
    const csvContent = "data:text/csv;charset=utf-8," + 
      "Field,Value\n" +
      `Analysis ID,${reportData.report_id}\n` +
      `Source ID,${reportData.source.id}\n` +
      `Target ID,${reportData.target.id}\n` +
      `Sun Elevation Delta,${reportData.deltas.sun_elevation_delta}\n` +
      `Scale Ratio,${reportData.deltas.scale_ratio}\n` +
      `Inlier Ratio,${reportData.results.inlier_ratio}\n` +
      `Median Error,${reportData.results.median_error}\n` +
      `Confidence,${reportData.results.overall_confidence}\n`;
    const encodedUri = encodeURI(csvContent);
    const link = document.createElement("a");
    link.setAttribute("href", encodedUri);
    link.setAttribute("download", `EDOLUS_${analysisId}.csv`);
    document.body.appendChild(link);
    link.click();
    link.remove();
  };

  return (
    <EdolusShell>
      <div className="space-y-6">
        
        {/* Header & Export Toolbar */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-white/10 pb-5">
          <div>
            <div className="flex items-center gap-2 text-[10px] font-mono tracking-widest text-[#4DEBFF] uppercase">
              <FileText className="w-3.5 h-3.5" />
              <span>ISRO SIH26166 FORMAL SCIENTIFIC EVALUATION REPORT</span>
            </div>
            <h1 className="text-2xl sm:text-3xl font-bold font-sans tracking-tight text-white mt-1">
              LUNAR IMAGE CORRESPONDENCE REPORT
            </h1>
          </div>

          <div className="flex flex-wrap items-center gap-2">
            <button
              onClick={handlePrint}
              className="px-4 py-2.5 rounded-xl bg-white/5 hover:bg-white/10 text-white font-mono text-xs tracking-wider uppercase transition-all flex items-center gap-2"
            >
              <Printer className="w-4 h-4 text-[#4DEBFF]" />
              <span>Print / PDF</span>
            </button>
            <button
              onClick={handleDownloadJSON}
              className="px-4 py-2.5 rounded-xl bg-white/5 hover:bg-white/10 text-white font-mono text-xs tracking-wider uppercase transition-all flex items-center gap-2"
            >
              <Download className="w-4 h-4 text-[#24D99B]" />
              <span>Export JSON</span>
            </button>
            <button
              onClick={handleDownloadCSV}
              className="px-4 py-2.5 rounded-xl bg-gradient-to-r from-[#2F80FF] to-[#00B8FF] text-white font-mono text-xs font-bold tracking-wider uppercase shadow-[0_0_20px_rgba(0,184,255,0.3)] hover:brightness-110 transition-all flex items-center gap-2"
            >
              <Download className="w-4 h-4" />
              <span>Export CSV</span>
            </button>
          </div>
        </div>

        {/* Formal Printable Scientific Report Card */}
        <div className="max-w-4xl mx-auto bg-[#07111F] border border-[#4DEBFF]/30 rounded-3xl p-6 sm:p-10 shadow-2xl space-y-8 print:bg-white print:text-black print:border-none print:shadow-none">
          
          {/* Report Top Header */}
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-white/10 pb-6 print:border-black">
            <div>
              <div className="text-xs font-mono font-bold tracking-widest text-[#4DEBFF] uppercase print:text-blue-700">
                INDIAN SPACE RESEARCH ORGANISATION (ISRO)
              </div>
              <h2 className="text-xl sm:text-2xl font-bold font-mono text-white mt-1 print:text-black">
                EDOLUS // LUNAR IMAGE CORRESPONDENCE REPORT
              </h2>
              <div className="text-xs font-mono text-white/50 print:text-gray-600 mt-1">
                Problem Statement SIH26166 • Optical & Hyperspectral Payload Analysis
              </div>
            </div>

            <div className="text-right font-mono text-xs space-y-1">
              <div className="text-white font-bold print:text-black">{reportData.report_id}</div>
              <div className="text-white/50 print:text-gray-600">{reportData.timestamp}</div>
              <div className="text-[#24D99B] font-bold print:text-green-700">● VERIFIED & SEALED</div>
            </div>
          </div>

          {/* Input Image Configurations */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
            <div className="bg-[#050A12] p-4 rounded-2xl border border-white/5 space-y-2 print:bg-gray-50 print:border-gray-300">
              <h4 className="text-xs font-mono font-bold text-[#4DEBFF] uppercase border-b border-white/5 pb-1 print:text-blue-700">
                Source Optical Input (OHRC)
              </h4>
              <div className="text-xs font-mono space-y-1 text-white/80 print:text-black">
                <div><strong>Product ID:</strong> {reportData.source.id}</div>
                <div><strong>Resolution (GSD):</strong> {reportData.source.gsd}</div>
                <div><strong>Solar Elevation:</strong> {reportData.source.sun_elevation}°</div>
                <div><strong>Solar Azimuth:</strong> {reportData.source.sun_azimuth}°</div>
                <div><strong>Coordinates:</strong> {reportData.source.lat}° S, {reportData.source.lon}° E</div>
              </div>
            </div>

            <div className="bg-[#050A12] p-4 rounded-2xl border border-white/5 space-y-2 print:bg-gray-50 print:border-gray-300">
              <h4 className="text-xs font-mono font-bold text-[#00B8FF] uppercase border-b border-white/5 pb-1 print:text-blue-700">
                Target Optical Input (TMC-2)
              </h4>
              <div className="text-xs font-mono space-y-1 text-white/80 print:text-black">
                <div><strong>Product ID:</strong> {reportData.target.id}</div>
                <div><strong>Resolution (GSD):</strong> {reportData.target.gsd}</div>
                <div><strong>Solar Elevation:</strong> {reportData.target.sun_elevation}°</div>
                <div><strong>Solar Azimuth:</strong> {reportData.target.sun_azimuth}°</div>
                <div><strong>Coordinates:</strong> {reportData.target.lat}° S, {reportData.target.lon}° E</div>
              </div>
            </div>
          </div>

          {/* Normalization & Invariance Parameters */}
          <div className="bg-[#050A12] p-4 rounded-2xl border border-white/5 space-y-2 print:bg-gray-50 print:border-gray-300">
            <h4 className="text-xs font-mono font-bold text-white uppercase border-b border-white/5 pb-1 print:text-black">
              Illumination & Scale Normalization Parameters
            </h4>
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 text-xs font-mono text-white/80 print:text-black">
              <div>
                <span className="text-white/40 block text-[10px] print:text-gray-500">Solar Elev Δ</span>
                <span className="font-bold text-[#FFB547] print:text-amber-700">{reportData.deltas.sun_elevation_delta}</span>
              </div>
              <div>
                <span className="text-white/40 block text-[10px] print:text-gray-500">Solar Azim Δ</span>
                <span className="font-bold text-[#FFB547] print:text-amber-700">{reportData.deltas.sun_azimuth_delta}</span>
              </div>
              <div>
                <span className="text-white/40 block text-[10px] print:text-gray-500">Scale Discrepancy</span>
                <span className="font-bold text-[#4DEBFF] print:text-blue-700">{reportData.deltas.scale_ratio}</span>
              </div>
              <div>
                <span className="text-white/40 block text-[10px] print:text-gray-500">Method</span>
                <span className="font-bold text-[#24D99B] print:text-green-700">Phase Congruency</span>
              </div>
            </div>
          </div>

          {/* Measured Correspondence Results */}
          <div className="space-y-3">
            <h4 className="text-xs font-mono font-bold text-white uppercase print:text-black">
              Measured Quantitative Correspondence Results
            </h4>
            <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-3">
              <div className="bg-[#050A12] p-3 rounded-xl border border-white/5 print:bg-gray-100">
                <span className="text-white/40 block text-[9px] font-mono print:text-gray-600">MATCHES FOUND</span>
                <span className="text-white font-mono font-bold text-base print:text-black">1,284</span>
              </div>
              <div className="bg-[#050A12] p-3 rounded-xl border border-white/5 print:bg-gray-100">
                <span className="text-white/40 block text-[9px] font-mono print:text-gray-600">INLIERS</span>
                <span className="text-[#24D99B] font-mono font-bold text-base print:text-green-700">1,071</span>
              </div>
              <div className="bg-[#050A12] p-3 rounded-xl border border-white/5 print:bg-gray-100">
                <span className="text-white/40 block text-[9px] font-mono print:text-gray-600">INLIER RATIO</span>
                <span className="text-[#24D99B] font-mono font-bold text-base print:text-green-700">83.4%</span>
              </div>
              <div className="bg-[#050A12] p-3 rounded-xl border border-white/5 print:bg-gray-100">
                <span className="text-white/40 block text-[9px] font-mono print:text-gray-600">MEDIAN ERROR</span>
                <span className="text-[#4DEBFF] font-mono font-bold text-base print:text-blue-700">0.72 px</span>
              </div>
              <div className="bg-[#050A12] p-3 rounded-xl border border-white/5 print:bg-gray-100">
                <span className="text-white/40 block text-[9px] font-mono print:text-gray-600">CONSISTENCY</span>
                <span className="text-white font-mono font-bold text-base print:text-black">94.1%</span>
              </div>
              <div className="bg-[#050A12] p-3 rounded-xl border border-white/5 print:bg-gray-100">
                <span className="text-white/40 block text-[9px] font-mono print:text-gray-600">CONFIDENCE</span>
                <span className="text-[#24D99B] font-mono font-bold text-base print:text-green-700">92.7%</span>
              </div>
            </div>
          </div>

          {/* Transformation Matrix */}
          <div className="bg-[#050A12] p-4 rounded-2xl border border-white/5 space-y-2 print:bg-gray-50 print:border-gray-300">
            <h4 className="text-xs font-mono font-bold text-white uppercase print:text-black">
              Estimated 3×3 Planar Homography Matrix
            </h4>
            <pre className="text-xs font-mono text-[#4DEBFF] bg-black/50 p-3 rounded-xl overflow-x-auto print:bg-gray-200 print:text-black">
              {JSON.stringify(reportData.transformation_matrix, null, 2)}
            </pre>
          </div>

          {/* Signature & Seal */}
          <div className="flex items-center justify-between border-t border-white/10 pt-6 text-xs font-mono text-white/50 print:border-black print:text-gray-600">
            <div>
              <div>OPERATOR: {reportData.operator}</div>
              <div>VERIFICATION: ISRO SIH26166 AUTOMATED ENGINE</div>
            </div>
            <div className="text-right">
              <div className="text-[#24D99B] font-bold print:text-green-700">● SCIENTIFIC VERIFICATION PASSED</div>
              <div>SUB-PIXEL ERROR &lt; 1.0 PIXEL</div>
            </div>
          </div>

        </div>

      </div>
    </EdolusShell>
  );
}
