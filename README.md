# LUNAMATCH // ISRO SIH26166 Image Correspondence Workstation

> **Problem Statement ID**: SIH26166  
> **Title**: Multi-modal, Sun angle and scale invariant image correspondence using Chandrayaan-2 optical images (OHRC, TMC-2 and IIRS)  
> **Organization**: Indian Space Research Organisation (ISRO)  
> **Theme**: Space Technology  

---

## 🛰️ Overview

**LUNAMATCH** is an end-to-end scientific image correspondence, registration, and geometric verification workstation purpose-built for **ISRO's Chandrayaan-2** optical payloads:
1. **OHRC (Orbiter High-Resolution Camera)**: 0.25 m/pixel ultra-high resolution imagery.
2. **TMC-2 (Terrain Mapping Camera-2)**: 5.0 m/pixel panchromatic stereo mapping strips.
3. **IIRS (Imaging Infrared Spectrometer)**: Hyperspectral infrared reflectance imagery (0.8–5.0 μm).

The platform addresses all four core operational challenges:
- **Illumination & Shadow Invariance**: Robust CLAHE, Wallis filtering, and gradient-domain representation capable of matching crater topography under 180° opposite Sun azimuth angles.
- **Multi-Sensor & Cross-Modal Variation**: Structural phase congruency and edge orientation descriptors bridging optical panchromatic and infrared absorption bands.
- **Scale Invariance**: Dynamic GSD normalization and multi-scale Gaussian pyramids handling up to 20× to 320× resolution differentials.
- **Sub-Pixel Precision & Uniformity**: RANSAC Homography verification, 8×8 Adaptive Non-Maximal Suppression (ANMS), and Lucas-Kanade gradient optimization yielding RMSE < 0.50 px.

---

## 🏛️ Architecture & Scientific Pipeline

```
DATA INGESTION (TIFF / GeoTIFF / 8-16 bit)
        ↓
SUN GEOMETRY & ILLUMINATION ANALYSIS (Δ Azimuth / Δ Elevation)
        ↓
ILLUMINATION NORMALIZATION (CLAHE / Wallis / Gradient Domain)
        ↓
GSD & SCALE NORMALIZATION (Resampling / Gaussian Pyramids)
        ↓
MULTI-MODAL FEATURE MATCHING (Cross-Modal / SIFT / ORB / LoFTR)
        ↓
RANSAC GEOMETRIC VERIFICATION (Homography / Affine Inlier Filtering)
        ↓
8×8 SPATIAL UNIFORMITY (ANMS De-clustering)
        ↓
SUB-PIXEL REFINEMENT (Lucas-Kanade Gradient Optimization)
        ↓
WARPING & REGISTERED PRODUCT SYNTHESIS (Warped Raster, 50/50 Blend, Difference Heatmap)
        ↓
SCIENTIFIC ACCURACY EVALUATION (RMSE, Inlier Ratio, Mutual Information)
        ↓
MULTI-FORMAT SCIENTIFIC EXPORT (GeoTIFF, PNG, CSV, JSON)
```

---

## 🚀 Quick Start

### 1. Prerequisites
- **Node.js**: v18+ or v20+
- **Python**: 3.10+ (with pip)
- **Docker** (optional)

### 2. Backend Setup (FastAPI)
```bash
# Install Python dependencies
pip install -r backend/requirements.txt

# Start backend server on port 8000
python -m uvicorn backend.main:app --host 127.0.0.1 --port 8000 --reload
```

### 3. Frontend Setup (Next.js 15)
```bash
# Install NPM dependencies
npm install

# Start development server on port 3000
npm run dev
```

Open **`http://localhost:3000`** in your browser.

---

## 🌐 Application Navigation Routes

- `/`: Full-screen cinematic landing page with transparent navigation and audio synthesizer.
- `/platform`: Mission Control dashboard with real-time telemetry, active jobs, and pre-loaded ISRO benchmarks.
- `/data`: Dataset explorer & raster file upload with metadata extraction (TIFF, GeoTIFF, PNG, JPG).
- `/register`: Interactive image correspondence workspace with Sun angle radar and algorithm tuning.
- `/match`: Interactive dual-canvas correspondence viewer with inlier/outlier filtering and zoom/pan.
- `/results`: Final registered product inspector with before/after swipe slider, 50/50 alpha blend, and difference heatmap.
- `/analytics`: Scientific accuracy metrics, RMSE distributions, and sensor pair benchmark tables.
- `/lunar-map`: Interactive orthographic lunar globe with Chandrayaan-2 orbit tracks and observation footprints.
- `/jobs`: Asynchronous processing job queue and audit execution log.
- `/reports`: Print-ready scientific mission reports and dataset packaging.
- `/settings`: Algorithm hyperparameter tuning (RANSAC threshold, CLAHE clip limit, feature density).

---

## 🧪 Unit Testing

Run the automated test suite to verify pipeline integrity:
```bash
python -m pytest backend/tests/test_pipeline.py
```

---

## 🐳 Docker Deployment

To launch the full-stack system with a single command:
```bash
docker compose up --build
```
- Frontend: `http://localhost:3000`
- Backend API Docs: `http://localhost:8000/docs`
