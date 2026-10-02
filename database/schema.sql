-- ============================================================
-- EDOLUS: CHANDRAYAAN-2 OPTICAL & HYPERSPECTRAL INTELLIGENCE
-- DATABASE SCHEMA: edolus (PostgreSQL 14+)
-- ============================================================

CREATE TABLE IF NOT EXISTS missions (
    id VARCHAR(64) PRIMARY KEY,
    name VARCHAR(255) NOT NULL,
    mission_code VARCHAR(64) NOT NULL UNIQUE,
    organization VARCHAR(128) NOT NULL,
    description TEXT,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE IF NOT EXISTS payloads (
    id VARCHAR(64) PRIMARY KEY,
    name VARCHAR(128) NOT NULL,
    code VARCHAR(64) NOT NULL UNIQUE,
    description TEXT,
    spatial_resolution VARCHAR(128),
    spectral_range VARCHAR(128),
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE IF NOT EXISTS lunar_regions (
    id VARCHAR(64) PRIMARY KEY,
    name VARCHAR(255) NOT NULL,
    latitude DOUBLE PRECISION NOT NULL,
    longitude DOUBLE PRECISION NOT NULL,
    description TEXT,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE IF NOT EXISTS datasets (
    id VARCHAR(128) PRIMARY KEY,
    payload_id VARCHAR(64) REFERENCES payloads(id) ON DELETE SET NULL,
    dataset_name VARCHAR(255) NOT NULL,
    product_id VARCHAR(255) NOT NULL UNIQUE,
    product_type VARCHAR(64) DEFAULT 'IMAGE',
    processing_level VARCHAR(32) DEFAULT 'LEVEL-2',
    file_path TEXT NOT NULL,
    browse_path TEXT,
    thumbnail_path TEXT,
    file_size BIGINT DEFAULT 0,
    checksum VARCHAR(64),
    format VARCHAR(32) DEFAULT 'GeoTIFF',
    source VARCHAR(128) DEFAULT 'ISRO PRADAN',
    status VARCHAR(32) DEFAULT 'INDEXED',
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE IF NOT EXISTS image_products (
    id VARCHAR(128) PRIMARY KEY,
    dataset_id VARCHAR(128) REFERENCES datasets(id) ON DELETE CASCADE,
    payload VARCHAR(64) NOT NULL,
    product_id VARCHAR(255) NOT NULL,
    observation_time TIMESTAMP WITH TIME ZONE,
    start_time TIMESTAMP WITH TIME ZONE,
    end_time TIMESTAMP WITH TIME ZONE,
    width INTEGER NOT NULL,
    height INTEGER NOT NULL,
    bands INTEGER DEFAULT 1,
    resolution_m_per_pixel DOUBLE PRECISION NOT NULL,
    latitude_min DOUBLE PRECISION,
    latitude_max DOUBLE PRECISION,
    longitude_min DOUBLE PRECISION,
    longitude_max DOUBLE PRECISION,
    center_latitude DOUBLE PRECISION NOT NULL,
    center_longitude DOUBLE PRECISION NOT NULL,
    sun_elevation DOUBLE PRECISION NOT NULL,
    sun_azimuth DOUBLE PRECISION NOT NULL,
    incidence_angle DOUBLE PRECISION,
    emission_angle DOUBLE PRECISION,
    phase_angle DOUBLE PRECISION,
    look_direction VARCHAR(32) DEFAULT 'NADIR',
    coordinate_system VARCHAR(64) DEFAULT 'MOON_ME_2000',
    metadata_json JSONB,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE IF NOT EXISTS spectral_products (
    id VARCHAR(128) PRIMARY KEY,
    dataset_id VARCHAR(128) REFERENCES datasets(id) ON DELETE CASCADE,
    payload VARCHAR(64) NOT NULL,
    product_id VARCHAR(255) NOT NULL,
    observation_time TIMESTAMP WITH TIME ZONE,
    band_count INTEGER NOT NULL DEFAULT 256,
    wavelength_min DOUBLE PRECISION NOT NULL DEFAULT 800.0,
    wavelength_max DOUBLE PRECISION NOT NULL DEFAULT 5000.0,
    spectral_resolution DOUBLE PRECISION DEFAULT 16.4,
    spatial_resolution DOUBLE PRECISION NOT NULL DEFAULT 80.0,
    metadata_json JSONB,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE IF NOT EXISTS scene_pairs (
    id VARCHAR(128) PRIMARY KEY,
    reference_dataset_id VARCHAR(128) REFERENCES datasets(id) ON DELETE CASCADE,
    target_dataset_id VARCHAR(128) REFERENCES datasets(id) ON DELETE CASCADE,
    region_id VARCHAR(64) REFERENCES lunar_regions(id) ON DELETE SET NULL,
    spatial_overlap DOUBLE PRECISION DEFAULT 0.0,
    time_difference DOUBLE PRECISION DEFAULT 0.0,
    sun_angle_difference DOUBLE PRECISION DEFAULT 0.0,
    scale_ratio DOUBLE PRECISION DEFAULT 1.0,
    compatibility_score DOUBLE PRECISION DEFAULT 0.0,
    status VARCHAR(32) DEFAULT 'AVAILABLE',
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE IF NOT EXISTS correspondence_runs (
    id VARCHAR(128) PRIMARY KEY,
    scene_pair_id VARCHAR(128) REFERENCES scene_pairs(id) ON DELETE CASCADE,
    algorithm VARCHAR(64) NOT NULL,
    parameters_json JSONB,
    status VARCHAR(32) NOT NULL DEFAULT 'QUEUED',
    started_at TIMESTAMP WITH TIME ZONE,
    completed_at TIMESTAMP WITH TIME ZONE,
    processing_time_ms INTEGER DEFAULT 0,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE IF NOT EXISTS matched_features (
    id VARCHAR(128) PRIMARY KEY,
    correspondence_run_id VARCHAR(128) REFERENCES correspondence_runs(id) ON DELETE CASCADE,
    reference_x DOUBLE PRECISION NOT NULL,
    reference_y DOUBLE PRECISION NOT NULL,
    target_x DOUBLE PRECISION NOT NULL,
    target_y DOUBLE PRECISION NOT NULL,
    distance DOUBLE PRECISION DEFAULT 0.0,
    confidence DOUBLE PRECISION DEFAULT 1.0,
    inlier BOOLEAN DEFAULT TRUE,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE IF NOT EXISTS registrations (
    id VARCHAR(128) PRIMARY KEY,
    correspondence_run_id VARCHAR(128) REFERENCES correspondence_runs(id) ON DELETE CASCADE,
    transform_type VARCHAR(64) NOT NULL DEFAULT 'HOMOGRAPHY',
    matrix_json JSONB NOT NULL,
    rmse DOUBLE PRECISION NOT NULL DEFAULT 0.0,
    inlier_count INTEGER NOT NULL DEFAULT 0,
    inlier_ratio DOUBLE PRECISION NOT NULL DEFAULT 0.0,
    registration_quality VARCHAR(32) DEFAULT 'HIGH',
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE IF NOT EXISTS sun_angle_analysis (
    id VARCHAR(128) PRIMARY KEY,
    correspondence_run_id VARCHAR(128) REFERENCES correspondence_runs(id) ON DELETE CASCADE,
    reference_elevation DOUBLE PRECISION NOT NULL,
    reference_azimuth DOUBLE PRECISION NOT NULL,
    target_elevation DOUBLE PRECISION NOT NULL,
    target_azimuth DOUBLE PRECISION NOT NULL,
    elevation_delta DOUBLE PRECISION NOT NULL,
    azimuth_delta DOUBLE PRECISION NOT NULL,
    normalization_method VARCHAR(64) DEFAULT 'PHASE_CONGRUENCY',
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE IF NOT EXISTS scale_analysis (
    id VARCHAR(128) PRIMARY KEY,
    correspondence_run_id VARCHAR(128) REFERENCES correspondence_runs(id) ON DELETE CASCADE,
    reference_resolution DOUBLE PRECISION NOT NULL,
    target_resolution DOUBLE PRECISION NOT NULL,
    scale_ratio DOUBLE PRECISION NOT NULL,
    pyramid_levels INTEGER NOT NULL DEFAULT 4,
    matching_method VARCHAR(64) DEFAULT 'MULTI_SCALE_PYRAMID',
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE IF NOT EXISTS analysis_reports (
    id VARCHAR(128) PRIMARY KEY,
    correspondence_run_id VARCHAR(128) REFERENCES correspondence_runs(id) ON DELETE CASCADE,
    report_type VARCHAR(64) DEFAULT 'CORRESPONDENCE_VERIFICATION',
    report_json JSONB NOT NULL,
    report_path TEXT,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE IF NOT EXISTS processing_jobs (
    id VARCHAR(128) PRIMARY KEY,
    job_type VARCHAR(64) NOT NULL DEFAULT 'CORRESPONDENCE',
    dataset_id VARCHAR(128),
    status VARCHAR(32) NOT NULL DEFAULT 'QUEUED',
    progress INTEGER NOT NULL DEFAULT 0,
    error_message TEXT,
    started_at TIMESTAMP WITH TIME ZONE,
    completed_at TIMESTAMP WITH TIME ZONE,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

CREATE OR REPLACE VIEW candidate_scene_matches AS
SELECT 
    d1.id AS reference_dataset_id,
    d1.product_id AS reference_product_id,
    p1.code AS reference_payload,
    d2.id AS target_dataset_id,
    d2.product_id AS target_product_id,
    p2.code AS target_payload,
    COALESCE(img1.center_latitude, -74.32) AS latitude,
    COALESCE(img1.center_longitude, 53.64) AS longitude,
    ABS(COALESCE(img1.sun_elevation, 30.0) - COALESCE(img2.sun_elevation, 30.0)) AS sun_angle_difference,
    ROUND(
        (GREATEST(COALESCE(img1.resolution_m_per_pixel, 1.0), COALESCE(img2.resolution_m_per_pixel, 1.0)) /
         NULLIF(LEAST(COALESCE(img1.resolution_m_per_pixel, 1.0), COALESCE(img2.resolution_m_per_pixel, 1.0)), 0))::numeric, 2
    )::double precision AS resolution_ratio,
    CASE 
        WHEN p1.code != p2.code THEN 88.5
        ELSE 95.0
    END AS match_suitability
FROM datasets d1
JOIN datasets d2 ON d1.id != d2.id
LEFT JOIN payloads p1 ON d1.payload_id = p1.id
LEFT JOIN payloads p2 ON d2.payload_id = p2.id
LEFT JOIN image_products img1 ON d1.id = img1.dataset_id
LEFT JOIN image_products img2 ON d2.id = img2.dataset_id;
