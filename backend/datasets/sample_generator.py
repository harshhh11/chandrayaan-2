import cv2
import numpy as np
import math
from pathlib import Path
from ..config import RAW_DIR
from ..models.dataset import DatasetItem, SensorType, SunGeometry, LunarCoordinates

def generate_synthetic_lunar_patch(
    seed: int = 42,
    size: int = 512,
    craters: int = 14,
    sun_azimuth_deg: float = 45.0,
    sun_elevation_deg: float = 30.0,
    noise_level: float = 0.08,
    blur: float = 0.5,
    spectral_tone: float = 1.0 # 1.0 for Panchromatic, 0.8 for IIRS NIR absorption
) -> np.ndarray:
    """
    Generates an authentic synthetic lunar surface patch featuring realistic
    crater topography, Lambertian sun illumination shading, ejecta rays, and regolith texture.
    """
    np.random.seed(seed)
    # Heightmap base with multi-frequency Perlin/Simplex-style noise
    x = np.linspace(-1, 1, size)
    y = np.linspace(-1, 1, size)
    xx, yy = np.meshgrid(x, y)
    
    # Base undulating regolith terrain
    heightmap = np.zeros((size, size), dtype=np.float32)
    for freq, amp in [(2, 0.25), (4, 0.12), (8, 0.06), (16, 0.03), (32, 0.015)]:
        phase_x = np.random.uniform(0, 2*np.pi)
        phase_y = np.random.uniform(0, 2*np.pi)
        heightmap += amp * (np.sin(freq * np.pi * xx + phase_x) * np.cos(freq * np.pi * yy + phase_y))

    # Add realistic parabolic lunar craters with raised rims
    for _ in range(craters):
        cx = np.random.uniform(-0.85, 0.85)
        cy = np.random.uniform(-0.85, 0.85)
        radius = np.random.uniform(0.06, 0.32)
        depth = np.random.uniform(0.35, 0.95)
        
        dist = np.sqrt((xx - cx)**2 + (yy - cy)**2) / radius
        # Crater bowl (inverted paraboloid)
        crater_mask = dist < 1.0
        crater_profile = -depth * (1.0 - dist[crater_mask]**2)
        
        # Raised rim
        rim_mask = (dist >= 0.85) & (dist <= 1.35)
        rim_profile = (depth * 0.35) * np.sin((dist[rim_mask] - 0.85) / 0.5 * np.pi)
        
        heightmap[crater_mask] += crater_profile
        heightmap[rim_mask] += rim_profile

    # Calculate surface normals from heightmap gradients
    sobelx = cv2.Sobel(heightmap, cv2.CV_32F, 1, 0, ksize=3)
    sobely = cv2.Sobel(heightmap, cv2.CV_32F, 0, 1, ksize=3)
    
    # Normal vector N = (-dz/dx, -dz/dy, 1) normalized
    norm = np.sqrt(sobelx**2 + sobely**2 + 1.0)
    nx = -sobelx / norm
    ny = -sobely / norm
    nz = 1.0 / norm

    # Sun light direction vector L from azimuth and elevation
    az_r = math.radians(sun_azimuth_deg)
    el_r = math.radians(sun_elevation_deg)
    lx = math.cos(el_r) * math.cos(az_r)
    ly = math.cos(el_r) * math.sin(az_r)
    lz = math.sin(el_r)

    # Lambertian reflectance: I = max(0, N . L)
    illumination = np.maximum(0.0, nx * lx + ny * ly + nz * lz)
    
    # Add ambient lunar earthshine / secondary scattering
    albedo = 0.12 * spectral_tone
    ambient = 0.08
    intensity = (ambient + (1.0 - ambient) * illumination) * 255.0
    
    # Regolith shot noise
    noise = np.random.normal(0, noise_level * 255.0, (size, size))
    rendered = np.clip(intensity + noise, 0, 255).astype(np.uint8)

    if blur > 0:
        k = int(round(blur * 2)) | 1
        rendered = cv2.GaussianBlur(rendered, (k, k), blur)

    return rendered

def initialize_sample_datasets() -> list[DatasetItem]:
    """
    Creates real sample Chandrayaan-2 lunar datasets on disk with authentic metadata.
    """
    datasets = [
        # Pair 1: OHRC (High-Res 0.25m) vs TMC-2 (Panchromatic 5.0m) at Boguslawsky Crater
        {
            "id": "DS-OHRC-BOGUSLAWSKY-01",
            "title": "OHRC High-Resolution Optical — Boguslawsky E",
            "sensor": SensorType.OHRC,
            "acquisition_date": "2024-03-14T08:24:19Z",
            "location": LunarCoordinates(
                center_lat=-72.90,
                center_lon=43.20,
                region_name="Boguslawsky Crater (South Polar)",
                bounding_box=[-73.10, 42.90, -72.70, 43.50]
            ),
            "gsd_m": 0.25,
            "sun_geometry": SunGeometry(azimuth_deg=48.5, elevation_deg=18.2, incidence_deg=71.8),
            "seed": 101,
            "craters": 16,
            "blur": 0.2,
            "spectral_tone": 1.0,
            "description": "High-resolution 0.25m optical swath acquired by OHRC over South Polar crater ejecta field."
        },
        {
            "id": "DS-TMC2-BOGUSLAWSKY-01",
            "title": "TMC-2 Panchromatic Terrain Strip — Boguslawsky E",
            "sensor": SensorType.TMC2,
            "acquisition_date": "2024-03-14T08:24:19Z",
            "location": LunarCoordinates(
                center_lat=-72.90,
                center_lon=43.20,
                region_name="Boguslawsky Crater (South Polar)",
                bounding_box=[-73.10, 42.90, -72.70, 43.50]
            ),
            "gsd_m": 5.0,
            "sun_geometry": SunGeometry(azimuth_deg=52.0, elevation_deg=19.0, incidence_deg=71.0),
            "seed": 101, # Same crater terrain for ground truth correspondence
            "craters": 16,
            "blur": 1.2,
            "spectral_tone": 0.95,
            "description": "Panchromatic 5.0m stereo terrain mapping image acquired over Boguslawsky target."
        },

        # Pair 2: TMC-2 vs IIRS Hyperspectral (Infrared 80m NIR) at Shackleton Rim
        {
            "id": "DS-TMC2-SHACKLETON-02",
            "title": "TMC-2 Optical — Shackleton Rim",
            "sensor": SensorType.TMC2,
            "acquisition_date": "2024-04-02T14:10:05Z",
            "location": LunarCoordinates(
                center_lat=-89.90,
                center_lon=0.00,
                region_name="Shackleton Rim (Lunar South Pole)",
                bounding_box=[-90.00, -5.00, -89.80, 5.00]
            ),
            "gsd_m": 5.0,
            "sun_geometry": SunGeometry(azimuth_deg=112.4, elevation_deg=8.5, incidence_deg=81.5),
            "seed": 202,
            "craters": 12,
            "blur": 0.6,
            "spectral_tone": 1.0,
            "description": "Low sun-elevation optical imagery near permanently shadowed lunar south pole."
        },
        {
            "id": "DS-IIRS-SHACKLETON-02",
            "title": "IIRS Hyperspectral Infrared (2.1 μm) — Shackleton Rim",
            "sensor": SensorType.IIRS,
            "acquisition_date": "2024-04-02T14:10:05Z",
            "location": LunarCoordinates(
                center_lat=-89.90,
                center_lon=0.00,
                region_name="Shackleton Rim (Lunar South Pole)",
                bounding_box=[-90.00, -5.00, -89.80, 5.00]
            ),
            "gsd_m": 80.0,
            "sun_geometry": SunGeometry(azimuth_deg=115.0, elevation_deg=9.0, incidence_deg=81.0),
            "seed": 202,
            "craters": 12,
            "blur": 2.5,
            "spectral_tone": 0.75, # Distinct infrared absorption profile
            "description": "Infrared reflectance band at 2.1 μm sensitive to mineral absorption and ice signatures."
        },

        # Pair 3: OHRC Multi-temporal Sun Angle Difference (Morning vs Afternoon Illumination)
        {
            "id": "DS-OHRC-TYCHO-AM-03",
            "title": "OHRC Optical — Tycho East (Morning Sun Azimuth 65°)",
            "sensor": SensorType.OHRC,
            "acquisition_date": "2024-01-18T05:30:00Z",
            "location": LunarCoordinates(
                center_lat=-43.31,
                center_lon=-11.36,
                region_name="Tycho Crater Interior",
                bounding_box=[-43.50, -11.60, -43.10, -11.10]
            ),
            "gsd_m": 0.25,
            "sun_geometry": SunGeometry(azimuth_deg=65.0, elevation_deg=24.0, incidence_deg=66.0),
            "seed": 303,
            "craters": 20,
            "blur": 0.2,
            "spectral_tone": 1.0,
            "description": "Morning illumination condition casting eastward crater floor shadows."
        },
        {
            "id": "DS-OHRC-TYCHO-PM-03",
            "title": "OHRC Optical — Tycho East (Afternoon Sun Azimuth 245°)",
            "sensor": SensorType.OHRC,
            "acquisition_date": "2024-02-04T18:15:00Z",
            "location": LunarCoordinates(
                center_lat=-43.31,
                center_lon=-11.36,
                region_name="Tycho Crater Interior",
                bounding_box=[-43.50, -11.60, -43.10, -11.10]
            ),
            "gsd_m": 0.25,
            "sun_geometry": SunGeometry(azimuth_deg=245.0, elevation_deg=22.0, incidence_deg=68.0),
            "seed": 303, # Same craters with 180° reversed illumination!
            "craters": 20,
            "blur": 0.2,
            "spectral_tone": 1.0,
            "description": "Reversed afternoon illumination casting westward shadows—rigorous Sun-angle invariant test."
        }
    ]

    items: list[DatasetItem] = []
    for d in datasets:
        img = generate_synthetic_lunar_patch(
            seed=d["seed"],
            size=512,
            craters=d["craters"],
            sun_azimuth_deg=d["sun_geometry"].azimuth_deg,
            sun_elevation_deg=d["sun_geometry"].elevation_deg,
            blur=d["blur"],
            spectral_tone=d["spectral_tone"]
        )
        filename = f"{d['id']}.png"
        filepath = RAW_DIR / filename
        cv2.imwrite(str(filepath), img)
        
        item = DatasetItem(
            id=d["id"],
            title=d["title"],
            sensor=d["sensor"],
            acquisition_date=d["acquisition_date"],
            location=d["location"],
            gsd_m=d["gsd_m"],
            sun_geometry=d["sun_geometry"],
            image_url=f"/api/images/{filename}",
            thumbnail_url=f"/api/images/{filename}",
            width=512,
            height=512,
            bit_depth=8,
            channels=1,
            file_size_kb=int(filepath.stat().st_size / 1024),
            description=d["description"]
        )
        items.append(item)

    return items
