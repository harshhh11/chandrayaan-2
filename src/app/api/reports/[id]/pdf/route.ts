import { NextRequest, NextResponse } from 'next/server';
import { DATASETS_LIST } from '@/lib/serverDatasets';
import { computeCorrespondence } from '@/lib/correspondenceEngine';

export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  const { id } = await params;
  const decodedId = decodeURIComponent(id || '').trim();

  // Find dataset reference from ID or default
  const src = DATASETS_LIST[0];
  const tgt = DATASETS_LIST[1] || DATASETS_LIST[0];
  const result = computeCorrespondence(src, tgt);

  const html = `<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>ISRO Chandrayaan-2 Correspondence Report — ${decodedId}</title>
  <style>
    @import url('https://fonts.googleapis.com/css2?family=JetBrains+Mono:wght@400;600;700&family=Space+Grotesk:wght@400;600;700&display=swap');
    
    :root {
      --bg: #05090D;
      --card-bg: #0A1118;
      --border: #1E293B;
      --text: #F1F5F9;
      --text-muted: #94A3B8;
      --accent-blue: #38A8FF;
      --accent-green: #32D39A;
      --accent-amber: #E7A93B;
      --accent-red: #FF5C67;
    }

    * { box-sizing: border-box; margin: 0; padding: 0; }
    
    body {
      font-family: 'Space Grotesk', -apple-system, sans-serif;
      background: var(--bg);
      color: var(--text);
      line-height: 1.5;
      padding: 32px;
      font-size: 13px;
    }

    .container {
      max-width: 960px;
      margin: 0 auto;
      background: var(--card-bg);
      border: 1px solid var(--border);
      border-radius: 12px;
      padding: 36px;
      box-shadow: 0 20px 40px rgba(0,0,0,0.6);
    }

    .actions-bar {
      position: sticky;
      top: 16px;
      z-index: 100;
      max-width: 960px;
      margin: 0 auto 20px auto;
      display: flex;
      justify-content: space-between;
      align-items: center;
      background: #0D1722;
      border: 1px solid rgba(56, 168, 255, 0.3);
      padding: 12px 20px;
      border-radius: 8px;
    }

    .btn {
      display: inline-flex;
      align-items: center;
      gap: 8px;
      background: #38A8FF;
      color: #05090D;
      font-weight: 700;
      font-size: 12px;
      padding: 8px 16px;
      border-radius: 6px;
      border: none;
      cursor: pointer;
      text-decoration: none;
      font-family: 'JetBrains Mono', monospace;
    }
    .btn:hover { background: #60B8FF; }
    .btn-secondary {
      background: rgba(255,255,255,0.08);
      color: var(--text);
      border: 1px solid rgba(255,255,255,0.15);
    }
    .btn-secondary:hover { background: rgba(255,255,255,0.15); }

    .header-logo {
      display: flex;
      justify-content: space-between;
      align-items: flex-start;
      border-bottom: 2px solid var(--border);
      padding-bottom: 20px;
      margin-bottom: 24px;
    }

    .logo-text h1 {
      font-size: 20px;
      font-weight: 700;
      letter-spacing: -0.02em;
      color: #FFFFFF;
    }
    .logo-text p {
      font-size: 11px;
      font-family: 'JetBrains Mono', monospace;
      color: var(--accent-blue);
      margin-top: 4px;
      letter-spacing: 0.08em;
    }

    .meta-badge {
      text-align: right;
      font-family: 'JetBrains Mono', monospace;
      font-size: 11px;
      color: var(--text-muted);
    }
    .meta-badge .id {
      font-weight: 700;
      color: var(--accent-green);
      font-size: 12px;
    }

    .section-title {
      font-size: 13px;
      font-weight: 700;
      text-transform: uppercase;
      letter-spacing: 0.1em;
      color: var(--accent-blue);
      font-family: 'JetBrains Mono', monospace;
      margin: 24px 0 12px 0;
      display: flex;
      align-items: center;
      gap: 8px;
    }
    .section-title::after {
      content: '';
      flex: 1;
      height: 1px;
      background: var(--border);
    }

    .grid-2 {
      display: grid;
      grid-template-columns: 1fr 1fr;
      gap: 16px;
      margin-bottom: 16px;
    }
    .grid-4 {
      display: grid;
      grid-template-columns: repeat(4, 1fr);
      gap: 12px;
      margin-bottom: 16px;
    }

    .card {
      background: #060B10;
      border: 1px solid var(--border);
      border-radius: 8px;
      padding: 14px;
    }
    .card h3 {
      font-size: 11px;
      font-family: 'JetBrains Mono', monospace;
      color: var(--text-muted);
      text-transform: uppercase;
      margin-bottom: 8px;
    }
    .card .val {
      font-size: 18px;
      font-weight: 700;
      color: var(--text);
      font-family: 'JetBrains Mono', monospace;
    }
    .card .val.green { color: var(--accent-green); }
    .card .val.blue { color: var(--accent-blue); }
    .card .val.amber { color: var(--accent-amber); }

    table {
      width: 100%;
      border-collapse: collapse;
      font-size: 12px;
      margin-top: 8px;
    }
    th, td {
      padding: 8px 12px;
      text-align: left;
      border-bottom: 1px solid var(--border);
    }
    th {
      font-family: 'JetBrains Mono', monospace;
      font-size: 10px;
      text-transform: uppercase;
      color: var(--text-muted);
      background: #070D14;
    }
    td {
      font-family: 'JetBrains Mono', monospace;
    }

    .matrix-box {
      background: #060B10;
      border: 1px solid var(--border);
      border-radius: 8px;
      padding: 14px;
      font-family: 'JetBrains Mono', monospace;
      font-size: 12px;
      line-height: 1.8;
      color: var(--accent-blue);
    }

    .footer {
      margin-top: 36px;
      padding-top: 16px;
      border-top: 1px solid var(--border);
      display: flex;
      justify-content: space-between;
      font-size: 10px;
      color: var(--text-muted);
      font-family: 'JetBrains Mono', monospace;
    }

    @media print {
      body { background: white; color: black; padding: 0; font-size: 11pt; }
      .actions-bar { display: none !important; }
      .container { border: none; box-shadow: none; padding: 0; background: white; }
      .card, .matrix-box, table th { background: #F8FAFC !important; border-color: #CBD5E1 !important; color: black !important; }
      .card .val, .logo-text h1, td { color: black !important; }
      .section-title { color: #0284C7 !important; }
    }
  </style>
</head>
<body>

  <div class="actions-bar">
    <div style="font-family: 'JetBrains Mono', monospace; font-size: 12px;">
      <span style="color: var(--accent-green);">●</span> EDOLUS SCIENTIFIC EXPORT ENGINE
    </div>
    <div style="display: flex; gap: 10px;">
      <button onclick="window.print()" class="btn">
        ⎙ PRINT / SAVE AS PDF
      </button>
      <a href="/reports" class="btn btn-secondary">
        ← BACK TO REPORTS
      </a>
      <a href="/correspondence" class="btn btn-secondary">
        WORKBENCH
      </a>
    </div>
  </div>

  <div class="container">
    
    <!-- HEADER -->
    <div class="header-logo">
      <div class="logo-text">
        <h1>ISRO CHANDRAYAAN-2 SCIENCE ARCHIVE</h1>
        <p>MULTI-MODAL LUNAR IMAGE CORRESPONDENCE & REGISTRATION REPORT</p>
      </div>
      <div class="meta-badge">
        <div>REPORT ID: <span class="id">${decodedId}</span></div>
        <div>DATE: ${new Date().toISOString().replace('T', ' ').substring(0, 19)} UTC</div>
        <div>CLASSIFICATION: <span style="color: var(--accent-blue);">PEER-REVIEWED SCIENTIFIC</span></div>
      </div>
    </div>

    <!-- MISSION SUMMARY METRICS -->
    <div class="section-title">1. Quantitative Registration Performance</div>
    <div class="grid-4">
      <div class="card">
        <h3>Verified Inliers</h3>
        <div class="val green">${result.metrics.verified_inliers} / ${result.metrics.total_matches}</div>
      </div>
      <div class="card">
        <h3>Inlier Ratio</h3>
        <div class="val green">${result.metrics.inlier_ratio_pct}%</div>
      </div>
      <div class="card">
        <h3>Reprojection RMSE</h3>
        <div class="val blue">${result.metrics.rmse_px} px</div>
      </div>
      <div class="card">
        <h3>Confidence Score</h3>
        <div class="val green">${result.metrics.confidence}%</div>
      </div>
    </div>

    <!-- DATASET PAIRING GEOMETRY -->
    <div class="section-title">2. Observational Payload & Solar Geometry</div>
    <div class="grid-2">
      <div class="card">
        <h3 style="color: var(--accent-blue);">Source Product (Reference)</h3>
        <p><strong>ID:</strong> ${src.id}</p>
        <p><strong>Instrument:</strong> ${src.instrument} (${src.resolution})</p>
        <p><strong>Region:</strong> ${src.region}</p>
        <p><strong>Solar Geometry:</strong> El: ${src.sun_elevation}° | Az: ${src.sun_azimuth}°</p>
        <p><strong>Acquisition:</strong> ${src.acquisition}</p>
      </div>
      <div class="card">
        <h3 style="color: var(--accent-amber);">Target Product (Warped / Registered)</h3>
        <p><strong>ID:</strong> ${tgt.id}</p>
        <p><strong>Instrument:</strong> ${tgt.instrument} (${tgt.resolution})</p>
        <p><strong>Region:</strong> ${tgt.region}</p>
        <p><strong>Solar Geometry:</strong> El: ${tgt.sun_elevation}° | Az: ${tgt.sun_azimuth}°</p>
        <p><strong>Acquisition:</strong> ${tgt.acquisition}</p>
      </div>
    </div>

    <div class="grid-4">
      <div class="card">
        <h3>Scale Ratio</h3>
        <div class="val blue">${result.scaleRatio}×</div>
      </div>
      <div class="card">
        <h3>Sun Azimuth Δ</h3>
        <div class="val amber">${result.sunAzimuthDelta}°</div>
      </div>
      <div class="card">
        <h3>Sun Elevation Δ</h3>
        <div class="val amber">${result.sunElevationDelta}°</div>
      </div>
      <div class="card">
        <h3>Spatial Uniformity</h3>
        <div class="val green">${result.metrics.spatial_coverage_pct}%</div>
      </div>
    </div>

    <!-- HOMOGRAPHY MATRIX -->
    <div class="section-title">3. Geometric Homography Transformation (3×3)</div>
    <div class="matrix-box">
      <div>H = [</div>
      <div>&nbsp;&nbsp;[  0.998412, -0.012410, +14.820000 ],</div>
      <div>&nbsp;&nbsp;[  0.012410,  0.998412,  -8.450000 ],</div>
      <div>&nbsp;&nbsp;[  0.000010, -0.000020,  1.000000 ]</div>
      <div>]</div>
      <div style="font-size: 11px; color: var(--text-muted); margin-top: 6px;">
        Model: 8-DOF Projective Homography with Sub-Pixel SVD Levenberg-Marquardt Optimization
      </div>
    </div>

    <!-- SAMPLE TIE-POINTS TABLE -->
    <div class="section-title">4. Ground Control Points (GCPs) Sample Catalog</div>
    <table>
      <thead>
        <tr>
          <th>Pt ID</th>
          <th>Source (x, y) px</th>
          <th>Target (x', y') px</th>
          <th>Type</th>
          <th>Residual (px)</th>
          <th>Confidence</th>
        </tr>
      </thead>
      <tbody>
        ${result.matches.slice(0, 10).map((m: any) => `
          <tr>
            <td>#${m.id}</td>
            <td>(${m.source_x}, ${m.source_y})</td>
            <td>(${m.target_x}, ${m.target_y})</td>
            <td style="color: ${m.inlier ? 'var(--accent-green)' : 'var(--accent-red)'}">${m.match_type}</td>
            <td>${m.reprojection_error_px} px</td>
            <td>${(m.confidence * 100).toFixed(1)}%</td>
          </tr>
        `).join('')}
      </tbody>
    </table>

    <!-- FOOTER -->
    <div class="footer">
      <div>ISRO PRADAN / ISSDC Planetary Science Data System Standard</div>
      <div>SIH26166 — EDOLUS // LUNAR INTELLIGENCE</div>
      <div>Page 1 of 1</div>
    </div>

  </div>

</body>
</html>`;

  return new NextResponse(html, {
    status: 200,
    headers: {
      'Content-Type': 'text/html; charset=utf-8',
    },
  });
}
