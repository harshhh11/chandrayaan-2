import * as THREE from 'three';

// Procedural high-resolution textures matching the EDOLUS / ORBITAL INTELLIGENCE aesthetic
export function createEarthTextures() {
  if (typeof window === 'undefined') return { dayMap: null, specMap: null, cloudsMap: null, nightMap: null };

  // 1. Day Surface Texture (High-contrast deep oceanic blue & continents)
  const dayCanvas = document.createElement('canvas');
  dayCanvas.width = 2048;
  dayCanvas.height = 1024;
  const ctx = dayCanvas.getContext('2d');

  if (ctx) {
    // Deep orbital blue gradient
    const oceanGrad = ctx.createLinearGradient(0, 0, 0, dayCanvas.height);
    oceanGrad.addColorStop(0, '#020b18');
    oceanGrad.addColorStop(0.2, '#041d3d');
    oceanGrad.addColorStop(0.5, '#072e5c');
    oceanGrad.addColorStop(0.8, '#041d3d');
    oceanGrad.addColorStop(1, '#020b18');
    ctx.fillStyle = oceanGrad;
    ctx.fillRect(0, 0, dayCanvas.width, dayCanvas.height);

    // Realistic Continent Contours
    ctx.fillStyle = '#173022'; // Dark continent green/gray
    ctx.strokeStyle = '#224832';
    ctx.lineWidth = 3;

    const drawLand = (coords: number[][]) => {
      ctx.beginPath();
      coords.forEach(([x, y], i) => {
        const px = (x / 360 + 0.5) * dayCanvas.width;
        const py = (-y / 180 + 0.5) * dayCanvas.height;
        if (i === 0) ctx.moveTo(px, py);
        else ctx.lineTo(px, py);
      });
      ctx.closePath();
      ctx.fill();
      ctx.stroke();
    };

    // Geographic continental outlines
    drawLand([[-18, 35], [-5, 36], [10, 37], [25, 31], [35, 31], [40, 15], [51, 12], [43, -12], [35, -24], [27, -34], [18, -34], [12, -15], [9, 5], [-17, 15], [-18, 35]]);
    drawLand([[-9, 36], [-9, 43], [3, 43], [5, 47], [-5, 48], [0, 53], [8, 55], [14, 54], [25, 60], [30, 70], [60, 70], [100, 75], [140, 70], [170, 65], [140, 40], [120, 30], [105, 20], [80, 15], [70, 25], [60, 25], [45, 38], [28, 41], [15, 40], [-9, 36]]);
    drawLand([[-165, 65], [-140, 70], [-100, 70], [-80, 60], [-65, 45], [-75, 35], [-80, 25], [-97, 26], [-105, 20], [-120, 35], [-125, 50], [-165, 65]]);
    drawLand([[-80, 10], [-60, 12], [-35, -5], [-38, -15], [-55, -25], [-65, -55], [-75, -50], [-70, -20], [-80, 0], [-80, 10]]);
    drawLand([[115, -22], [130, -15], [145, -15], [152, -25], [148, -38], [135, -35], [115, -35], [115, -22]]);

    // Shallow turquoise coastal reefs
    ctx.strokeStyle = 'rgba(24, 140, 210, 0.45)';
    ctx.lineWidth = 16;
    ctx.stroke();

    // Mountain highlands & desert
    ctx.fillStyle = '#4a3f2a';
    drawLand([[15, 30], [40, 25], [50, 18], [35, 15], [15, 20], [15, 30]]);
    drawLand([[70, 35], [90, 35], [95, 28], [75, 25], [70, 35]]);
  }

  const dayMap = new THREE.CanvasTexture(dayCanvas);
  dayMap.wrapS = THREE.RepeatWrapping;

  // 2. Specular Ocean Map (Bright white reflections on water, matte on land)
  const specCanvas = document.createElement('canvas');
  specCanvas.width = 1024;
  specCanvas.height = 512;
  const specCtx = specCanvas.getContext('2d');
  if (specCtx) {
    specCtx.fillStyle = '#ffffff';
    specCtx.fillRect(0, 0, specCanvas.width, specCanvas.height);
    specCtx.drawImage(dayCanvas, 0, 0, specCanvas.width, specCanvas.height);
    const imgData = specCtx.getImageData(0, 0, specCanvas.width, specCanvas.height);
    for (let i = 0; i < imgData.data.length; i += 4) {
      const r = imgData.data[i];
      const g = imgData.data[i + 1];
      const b = imgData.data[i + 2];
      if (g > b * 0.85 || r > b * 0.85) {
        imgData.data[i] = 15;
        imgData.data[i + 1] = 15;
        imgData.data[i + 2] = 15;
      } else {
        imgData.data[i] = 240;
        imgData.data[i + 1] = 240;
        imgData.data[i + 2] = 240;
      }
    }
    specCtx.putImageData(imgData, 0, 0);
  }
  const specMap = new THREE.CanvasTexture(specCanvas);

  // 3. Clouds Map with realistic atmospheric weather fronts
  const cloudsCanvas = document.createElement('canvas');
  cloudsCanvas.width = 2048;
  cloudsCanvas.height = 1024;
  const cloudCtx = cloudsCanvas.getContext('2d');
  if (cloudCtx) {
    cloudCtx.fillStyle = 'rgba(0,0,0,0)';
    cloudCtx.fillRect(0, 0, cloudsCanvas.width, cloudsCanvas.height);

    for (let i = 0; i < 350; i++) {
      const cx = Math.random() * cloudsCanvas.width;
      const cy = (Math.sin(Math.random() * Math.PI) * 0.75 + 0.12) * cloudsCanvas.height;
      const rx = 30 + Math.random() * 140;
      const ry = 15 + Math.random() * 45;
      const rot = (Math.random() - 0.5) * 0.35;

      const grad = cloudCtx.createRadialGradient(cx, cy, 0, cx, cy, rx);
      const alpha = 0.2 + Math.random() * 0.65;
      grad.addColorStop(0, `rgba(255, 255, 255, ${alpha})`);
      grad.addColorStop(0.6, `rgba(235, 245, 255, ${alpha * 0.5})`);
      grad.addColorStop(1, 'rgba(255, 255, 255, 0)');

      cloudCtx.save();
      cloudCtx.translate(cx, cy);
      cloudCtx.rotate(rot);
      cloudCtx.scale(1, ry / rx);
      cloudCtx.fillStyle = grad;
      cloudCtx.beginPath();
      cloudCtx.arc(0, 0, rx, 0, Math.PI * 2);
      cloudCtx.fill();
      cloudCtx.restore();
    }
  }
  const cloudsMap = new THREE.CanvasTexture(cloudsCanvas);
  cloudsMap.wrapS = THREE.RepeatWrapping;

  // 4. Night Lights (City clusters)
  const nightCanvas = document.createElement('canvas');
  nightCanvas.width = 1024;
  nightCanvas.height = 512;
  const nightCtx = nightCanvas.getContext('2d');
  if (nightCtx) {
    nightCtx.fillStyle = '#000000';
    nightCtx.fillRect(0, 0, nightCanvas.width, nightCanvas.height);

    const drawCity = (xRatio: number, yRatio: number, count: number, spread: number) => {
      const cx = xRatio * nightCanvas.width;
      const cy = yRatio * nightCanvas.height;
      for (let i = 0; i < count; i++) {
        const px = cx + (Math.random() - 0.5) * spread;
        const py = cy + (Math.random() - 0.5) * spread * 0.6;
        nightCtx.fillStyle = Math.random() > 0.6 ? '#ffe49e' : '#ffb347';
        nightCtx.beginPath();
        nightCtx.arc(px, py, 1 + Math.random(), 0, Math.PI * 2);
        nightCtx.fill();
      }
    };

    drawCity(0.52, 0.28, 160, 50); // Europe
    drawCity(0.28, 0.32, 140, 45); // US East
    drawCity(0.72, 0.42, 180, 50); // South Asia
    drawCity(0.82, 0.35, 200, 60); // East Asia
  }
  const nightMap = new THREE.CanvasTexture(nightCanvas);
  nightMap.wrapS = THREE.RepeatWrapping;

  return { dayMap, specMap, cloudsMap, nightMap };
}

// Procedural Solar Panel Texture matching Screenshot 2 & 3:
// Highly reflective rectangular wafer cells with silver grid busbars and deep electric-blue silicon
export function createSolarPanelTexture() {
  if (typeof window === 'undefined') return null;

  const canvas = document.createElement('canvas');
  canvas.width = 1024;
  canvas.height = 1024;
  const ctx = canvas.getContext('2d');
  if (!ctx) return null;

  // Deep metallic blue base
  ctx.fillStyle = '#051226';
  ctx.fillRect(0, 0, canvas.width, canvas.height);

  const cols = 12;
  const rows = 24;
  const cellW = canvas.width / cols;
  const cellH = canvas.height / rows;

  for (let c = 0; c < cols; c++) {
    for (let r = 0; r < rows; r++) {
      const x = c * cellW;
      const y = r * cellH;

      // Photovoltaic cell gradient (iridescent silicon)
      const grad = ctx.createLinearGradient(x, y, x + cellW, y + cellH);
      grad.addColorStop(0, '#0a234f');
      grad.addColorStop(0.3, '#103d82');
      grad.addColorStop(0.7, '#0c2e63');
      grad.addColorStop(1, '#051633');
      ctx.fillStyle = grad;
      ctx.fillRect(x + 1.5, y + 1.5, cellW - 3, cellH - 3);

      // Fine silver grid lines
      ctx.strokeStyle = 'rgba(210, 235, 255, 0.45)';
      ctx.lineWidth = 1;
      for (let l = 1; l <= 3; l++) {
        ctx.beginPath();
        ctx.moveTo(x + (cellW / 4) * l, y + 2);
        ctx.lineTo(x + (cellW / 4) * l, y + cellH - 2);
        ctx.stroke();
      }

      // Cell border
      ctx.strokeStyle = 'rgba(180, 215, 255, 0.3)';
      ctx.lineWidth = 1.2;
      ctx.strokeRect(x + 1, y + 1, cellW - 2, cellH - 2);
    }
  }

  // Heavy silver busbar lines
  ctx.strokeStyle = '#e2e8f0';
  ctx.lineWidth = 3;
  ctx.beginPath();
  ctx.moveTo(canvas.width * 0.33, 0);
  ctx.lineTo(canvas.width * 0.33, canvas.height);
  ctx.moveTo(canvas.width * 0.66, 0);
  ctx.lineTo(canvas.width * 0.66, canvas.height);
  ctx.stroke();

  const texture = new THREE.CanvasTexture(canvas);
  texture.wrapS = THREE.RepeatWrapping;
  texture.wrapT = THREE.RepeatWrapping;
  return texture;
}

// Procedural Thermal Multi-Layer Insulation (MLI) Foil Texture
export function createThermalFoilTexture(isGold: boolean = true) {
  if (typeof window === 'undefined') return null;

  const canvas = document.createElement('canvas');
  canvas.width = 512;
  canvas.height = 512;
  const ctx = canvas.getContext('2d');
  if (!ctx) return null;

  ctx.fillStyle = isGold ? '#ca9835' : '#8892b0';
  ctx.fillRect(0, 0, canvas.width, canvas.height);

  // Realistic space blanket crinkles
  for (let i = 0; i < 400; i++) {
    const x = Math.random() * canvas.width;
    const y = Math.random() * canvas.height;
    const len = 15 + Math.random() * 45;
    const angle = Math.random() * Math.PI * 2;

    ctx.strokeStyle = isGold
      ? (Math.random() > 0.5 ? 'rgba(255, 235, 160, 0.5)' : 'rgba(110, 75, 15, 0.5)')
      : (Math.random() > 0.5 ? 'rgba(255, 255, 255, 0.5)' : 'rgba(30, 40, 55, 0.6)');
    ctx.lineWidth = 1 + Math.random() * 2.5;
    ctx.beginPath();
    ctx.moveTo(x, y);
    ctx.lineTo(x + Math.cos(angle) * len, y + Math.sin(angle) * len);
    ctx.stroke();
  }

  const texture = new THREE.CanvasTexture(canvas);
  texture.wrapS = THREE.RepeatWrapping;
  texture.wrapT = THREE.RepeatWrapping;
  return texture;
}
