import { NextRequest, NextResponse } from 'next/server';
import { DATASETS_LIST, BENCHMARK_RUNS } from '@/lib/serverDatasets';
import { computeCorrespondence } from '@/lib/correspondenceEngine';

export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  const { id } = await params;
  const decodedId = decodeURIComponent(id || '').trim();

  const url = new URL(request.url);
  const srcParam = url.searchParams.get('source') || url.searchParams.get('source_image_id') || url.searchParams.get('sourceProductId') || url.searchParams.get('ref');
  const tgtParam = url.searchParams.get('target') || url.searchParams.get('reference_image_id') || url.searchParams.get('targetProductId') || url.searchParams.get('tgt');

  let src = srcParam ? DATASETS_LIST.find(d => d.id === srcParam || d.product_id === srcParam) : null;
  let tgt = tgtParam ? DATASETS_LIST.find(d => d.id === tgtParam || d.product_id === tgtParam) : null;

  if (!src || !tgt) {
    const matchedBenchmark = BENCHMARK_RUNS.find(r => r.id === decodedId);
    if (matchedBenchmark) {
      src = DATASETS_LIST.find(d => d.id === matchedBenchmark.reference_id || d.product_id === matchedBenchmark.reference_id) || src;
      tgt = DATASETS_LIST.find(d => d.id === matchedBenchmark.target_id || d.product_id === matchedBenchmark.target_id) || tgt;
    }
  }

  src = src || DATASETS_LIST[0];
  tgt = tgt || (DATASETS_LIST.length > 1 ? DATASETS_LIST[1] : DATASETS_LIST[0]);

  const result = computeCorrespondence(src, tgt);

  const srcImgUrl = src.image_url || '/images/ch2_ohr_ncp_20220324T184000_d_img_d18.png';
  const tgtImgUrl = tgt.image_url || '/images/ch2_ohr_ncp_20220310T061500_d_img_d18.png';

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
      padding: 24px;
      font-size: 13px;
    }

    .container {
      max-width: 980px;
      margin: 0 auto;
      background: var(--card-bg);
      border: 1px solid var(--border);
      border-radius: 12px;
      padding: 32px;
      box-shadow: 0 20px 40px rgba(0,0,0,0.6);
    }

    .actions-bar {
      position: sticky;
      top: 12px;
      z-index: 100;
      max-width: 980px;
      margin: 0 auto 16px auto;
      display: flex;
      justify-content: space-between;
      align-items: center;
      background: #0D1722;
      border: 1px solid rgba(56, 168, 255, 0.3);
      padding: 10px 18px;
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
      padding-bottom: 16px;
      margin-bottom: 20px;
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
      font-size: 12px;
      font-weight: 700;
      text-transform: uppercase;
      letter-spacing: 0.1em;
      color: var(--accent-blue);
      font-family: 'JetBrains Mono', monospace;
      margin: 20px 0 10px 0;
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
      margin-bottom: 14px;
    }
    .grid-4 {
      display: grid;
      grid-template-columns: repeat(4, 1fr);
      gap: 10px;
      margin-bottom: 14px;
    }

    .card {
      background: #060B10;
      border: 1px solid var(--border);
      border-radius: 8px;
      padding: 12px 14px;
    }
    .card h3 {
      font-size: 10px;
      font-family: 'JetBrains Mono', monospace;
      color: var(--text-muted);
      text-transform: uppercase;
      margin-bottom: 6px;
    }
    .card .val {
      font-size: 16px;
      font-weight: 700;
      color: var(--text);
      font-family: 'JetBrains Mono', monospace;
    }
    .card .val.green { color: var(--accent-green); }
    .card .val.blue { color: var(--accent-blue); }
    .card .val.amber { color: var(--accent-amber); }

    /* IMAGERY PANELS */
    .image-comparison-container {
      display: grid;
      grid-template-columns: 1fr 1fr;
      gap: 16px;
      margin: 12px 0;
    }
    .image-box {
      background: #000000;
      border: 1px solid var(--border);
      border-radius: 8px;
      overflow: hidden;
      position: relative;
    }
    .image-box img {
      width: 100%;
      height: 240px;
      object-fit: cover;
      display: block;
    }
    .image-box .img-meta {
      position: absolute;
      bottom: 8px;
      left: 8px;
      background: rgba(0,0,0,0.85);
      border: 1px solid rgba(255,255,255,0.2);
      border-radius: 4px;
      padding: 4px 8px;
      font-family: 'JetBrains Mono', monospace;
      font-size: 10px;
      color: #FFFFFF;
    }
    .image-box .img-header {
      padding: 8px 12px;
      background: #081018;
      border-bottom: 1px solid var(--border);
      display: flex;
      justify-content: space-between;
      align-items: center;
      font-family: 'JetBrains Mono', monospace;
      font-size: 11px;
    }

    /* TIE-POINTS VECTOR DISPLAY */
    .vector-stage-box {
      background: #000000;
      border: 1px solid var(--border);
      border-radius: 8px;
      position: relative;
      margin: 12px 0;
      overflow: hidden;
    }
    .vector-stage-box .stage-header {
      padding: 8px 12px;
      background: #081018;
      border-bottom: 1px solid var(--border);
      display: flex;
      justify-content: space-between;
      font-family: 'JetBrains Mono', monospace;
      font-size: 11px;
      color: var(--accent-green);
    }
    .vector-stage-inner {
      display: flex;
      width: 100%;
      height: 220px;
      position: relative;
    }
    .vector-stage-inner .pane {
      width: 50%;
      height: 100%;
      position: relative;
      overflow: hidden;
    }
    .vector-stage-inner .pane img {
      width: 100%;
      height: 100%;
      object-fit: cover;
    }
    .vector-svg-overlay {
      position: absolute;
      inset: 0;
      width: 100%;
      height: 100%;
      pointer-events: none;
    }

    table {
      width: 100%;
      border-collapse: collapse;
      font-size: 11px;
      margin-top: 6px;
    }
    th, td {
      padding: 6px 10px;
      text-align: left;
      border-bottom: 1px solid var(--border);
    }
    th {
      font-family: 'JetBrains Mono', monospace;
      font-size: 9px;
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
      padding: 12px;
      font-family: 'JetBrains Mono', monospace;
      font-size: 11px;
      line-height: 1.6;
      color: var(--accent-blue);
    }

    .footer {
      margin-top: 24px;
      padding-top: 12px;
      border-top: 1px solid var(--border);
      display: flex;
      justify-content: space-between;
      font-size: 10px;
      color: var(--text-muted);
      font-family: 'JetBrains Mono', monospace;
    }

    @media print {
      body { background: white; color: black; padding: 0; font-size: 10pt; }
      .actions-bar { display: none !important; }
      .container { border: none; box-shadow: none; padding: 0; background: white; max-width: 100%; }
      .card, .matrix-box, table th, .image-box .img-header, .vector-stage-box .stage-header { background: #F8FAFC !important; border-color: #CBD5E1 !important; color: black !important; }
      .card .val, .logo-text h1, td, .image-box .img-header span { color: black !important; }
      .section-title { color: #0284C7 !important; }
      .image-box, .vector-stage-box { border-color: #94A3B8 !important; }
      .image-box img, .vector-stage-inner .pane img { filter: grayscale(10%); }
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

    <!-- 1. OBSERVATIONAL LUNAR IMAGERY (SOURCE & TARGET) -->
    <div class="section-title">1. Observational Lunar Imagery (Source & Target Pairs)</div>
    <div class="image-comparison-container">
      
      <!-- Source Image Box -->
      <div class="image-box">
        <div class="img-header">
          <span style="color: var(--accent-blue); font-weight: 700;">SOURCE: ${src.instrument} (${src.gsd_m} m/px)</span>
          <span style="color: var(--text-muted); font-size: 10px;">${src.id}</span>
        </div>
        <div style="position: relative;">
          <img src="${srcImgUrl}" alt="Source lunar observation" />
          <svg style="position: absolute; inset: 0; width: 100%; height: 100%; pointer-events: none;" viewBox="0 0 1024 1024">
            ${result.matches.map((m: any, idx: number) => {
              const sx = parseFloat(m.source_x || 0);
              const sy = parseFloat(m.source_y || 0);
              const isInlier = m.match_type === 'INLIER' || m.inlier === true || m.is_inlier === true;
              return `<circle cx="${sx}" cy="${sy}" r="${isInlier ? 5 : 3.5}" fill="${isInlier ? '#32D39A' : '#FF5C67'}" stroke="#000" stroke-width="1.5" />`;
            }).join('')}
          </svg>
          <div class="img-meta">
            Region: ${src.region} | Sun El: ${src.sun_elevation}° | Az: ${src.sun_azimuth}°
          </div>
        </div>
      </div>

      <!-- Target Image Box -->
      <div class="image-box">
        <div class="img-header">
          <span style="color: var(--accent-amber); font-weight: 700;">TARGET: ${tgt.instrument} (${tgt.gsd_m} m/px)</span>
          <span style="color: var(--text-muted); font-size: 10px;">${tgt.id}</span>
        </div>
        <div style="position: relative;">
          <img src="${tgtImgUrl}" alt="Target lunar observation" />
          <svg style="position: absolute; inset: 0; width: 100%; height: 100%; pointer-events: none;" viewBox="0 0 1024 1024">
            ${result.matches.map((m: any, idx: number) => {
              const tx = parseFloat(m.target_x || m.reference_x || 0);
              const ty = parseFloat(m.target_y || m.reference_y || 0);
              const isInlier = m.match_type === 'INLIER' || m.inlier === true || m.is_inlier === true;
              return `<circle cx="${tx}" cy="${ty}" r="${isInlier ? 5 : 3.5}" fill="${isInlier ? '#38A8FF' : '#FF5C67'}" stroke="#000" stroke-width="1.5" />`;
            }).join('')}
          </svg>
          <div class="img-meta">
            Region: ${tgt.region} | Sun El: ${tgt.sun_elevation}° | Az: ${tgt.sun_azimuth}°
          </div>
        </div>
      </div>

    </div>

    <!-- 2. CORRESPONDENCE VECTOR FIELD STAGE -->
    <div class="section-title">2. Dual-Image Correspondence Vectors & Spatial Homography</div>
    <div class="vector-stage-box">
      <div class="stage-header">
        <span>● DUAL OBSERVATION TIE-POINT VECTORS (${result.metrics.verified_inliers} INLIERS • ${result.metrics.outliers} OUTLIERS)</span>
        <span style="color: #FFFFFF;">SCALE RATIO: ${result.scaleRatio}×</span>
      </div>
      <div class="vector-stage-inner">
        <div class="pane" style="border-right: 1px solid rgba(255,255,255,0.2);">
          <img src="${srcImgUrl}" alt="Source left" />
        </div>
        <div class="pane">
          <img src="${tgtImgUrl}" alt="Target right" />
        </div>
        <svg class="vector-svg-overlay" viewBox="0 0 1000 500" preserveAspectRatio="none">
          ${result.matches.slice(0, 75).map((m: any) => {
            const sx = (parseFloat(m.source_x || 0) / 1024.0) * 500;
            const sy = (parseFloat(m.source_y || 0) / 1024.0) * 500;
            const tx = 500 + (parseFloat(m.target_x || 0) / 1024.0) * 500;
            const ty = (parseFloat(m.target_y || 0) / 1024.0) * 500;
            const isInlier = m.match_type === 'INLIER' || m.inlier === true || m.is_inlier === true;
            if (isInlier) {
              return `<line x1="${sx}" y1="${sy}" x2="${tx}" y2="${ty}" stroke="rgba(50, 211, 154, 0.85)" stroke-width="1.5" />
                      <circle cx="${sx}" cy="${sy}" r="3" fill="#32D39A" />
                      <circle cx="${tx}" cy="${ty}" r="3" fill="#38A8FF" />`;
            } else {
              return `<line x1="${sx}" y1="${sy}" x2="${tx}" y2="${ty}" stroke="rgba(255, 92, 103, 0.5)" stroke-width="1" stroke-dasharray="3,3" />
                      <circle cx="${sx}" cy="${sy}" r="2.5" fill="#FF5C67" />
                      <circle cx="${tx}" cy="${ty}" r="2.5" fill="#FF5C67" />`;
            }
          }).join('')}
        </svg>
      </div>
    </div>

    <!-- 3. QUANTITATIVE PERFORMANCE METRICS -->
    <div class="section-title">3. Quantitative Registration Accuracy & Metrics</div>
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

    <!-- 4. HOMOGRAPHY MATRIX -->
    <div class="section-title">4. Geometric Homography Transformation (3×3)</div>
    <div class="matrix-box">
      <div>H = [</div>
      <div>&nbsp;&nbsp;[  ${result.transformation_matrix[0][0].toFixed(6)}, ${result.transformation_matrix[0][1].toFixed(6)}, ${result.transformation_matrix[0][2] >= 0 ? '+' : ''}${result.transformation_matrix[0][2].toFixed(6)} ],</div>
      <div>&nbsp;&nbsp;[  ${result.transformation_matrix[1][0].toFixed(6)}, ${result.transformation_matrix[1][1].toFixed(6)}, ${result.transformation_matrix[1][2] >= 0 ? '+' : ''}${result.transformation_matrix[1][2].toFixed(6)} ],</div>
      <div>&nbsp;&nbsp;[  ${result.transformation_matrix[2][0].toFixed(6)}, ${result.transformation_matrix[2][1].toFixed(6)}, ${result.transformation_matrix[2][2] >= 0 ? '+' : ''}${result.transformation_matrix[2][2].toFixed(6)} ]</div>
      <div>]</div>
      <div style="font-size: 10px; color: var(--text-muted); margin-top: 4px;">
        Model: 8-DOF Projective Homography with Sub-Pixel Levenberg-Marquardt SVD Optimization
      </div>
    </div>

    <!-- 5. SAMPLE TIE-POINTS TABLE -->
    <div class="section-title">5. Ground Control Points (GCPs) Catalog (Sample)</div>
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
        ${result.matches.slice(0, 8).map((m: any) => `
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
