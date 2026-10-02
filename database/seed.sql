-- ============================================================
-- EDOLUS: Seed Data for Chandrayaan-2 Database
-- ============================================================

INSERT INTO missions (id, name, mission_code, organization, description)
VALUES (
    'CH2-MISSION-01',
    'Chandrayaan-2',
    'CH2',
    'ISRO',
    'India second lunar exploration mission comprising an orbiter with high-resolution optical and hyperspectral payloads.'
) ON CONFLICT (id) DO UPDATE SET name = EXCLUDED.name;

INSERT INTO payloads (id, name, code, description, spatial_resolution, spectral_range)
VALUES 
(
    'PAYLOAD-OHRC',
    'Orbiter High Resolution Camera',
    'OHRC',
    'High-resolution lunar optical camera operating in panchromatic mode with sub-meter ground sampling distance (0.25 - 0.32 m/px).',
    '0.25 - 0.32 m/pixel',
    '450 - 700 nm (Panchromatic)'
),
(
    'PAYLOAD-TMC2',
    'Terrain Mapping Camera-2',
    'TMC-2',
    'Panchromatic stereo triplet camera providing high-resolution digital elevation models (DEM) and terrain strips.',
    '5.0 m/pixel',
    '500 - 850 nm (Panchromatic Stereo)'
),
(
    'PAYLOAD-IIRS',
    'Imaging Infrared Spectrometer',
    'IIRS',
    'Hyperspectral imaging spectrometer covering 256 contiguous spectral bands for mineralogical and hydroxyl/water mapping.',
    '80.0 m/pixel',
    '800 - 5000 nm (256 Spectral Bands)'
) ON CONFLICT (id) DO UPDATE SET name = EXCLUDED.name;

INSERT INTO lunar_regions (id, name, latitude, longitude, description)
VALUES
(
    'REGION-BOGUSLAWSKY',
    'Boguslawsky E Crater',
    -74.32,
    53.64,
    'High-priority South Polar highland impact structure with extensive ejecta blanket.'
),
(
    'REGION-SHACKLETON',
    'Shackleton Rim',
    -89.90,
    0.00,
    'Ultra-cold permanently shadowed region (PSR) on the lunar South Pole with potential water-ice volatiles.'
),
(
    'REGION-TYCHO',
    'Tycho Crater',
    -43.31,
    -11.36,
    'Prominent young lunar impact crater exhibiting distinctive high-albedo ray system.'
),
(
    'REGION-MANZINUS',
    'Manzinus C Crater',
    -72.80,
    33.70,
    'Southern lunar crater with smooth floor and prominent central peak topography.'
),
(
    'REGION-SHIV-SHAKTI',
    'Shiv Shakti Point',
    -69.3676,
    32.3481,
    'Chandrayaan-3 landing site in the southern polar region observed continuously by Chandrayaan-2 OHRC.'
) ON CONFLICT (id) DO UPDATE SET name = EXCLUDED.name;
