-- ====================================================================
-- EDOLUS Relational Schema Migration (PostgreSQL / SQLite Compatible)
-- Chandrayaan-2 Optical & Hyperspectral Intelligence Platform
-- ====================================================================

-- Payloads definition table
CREATE TABLE IF NOT EXISTS payloads (
    id TEXT PRIMARY KEY,
    code TEXT NOT NULL UNIQUE,
    name TEXT NOT NULL,
    description TEXT,
    nominal_gsd REAL,
    spectral_type TEXT,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Datasets table (Section 4)
CREATE TABLE IF NOT EXISTS datasets (
    id TEXT PRIMARY KEY,
    name TEXT NOT NULL,
    mission TEXT DEFAULT 'Chandrayaan-2',
    payload TEXT NOT NULL,
    description TEXT,
    source TEXT DEFAULT 'ISRO Science Data Archive (ISDA) / PRADAN',
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Dataset Images table (Section 4)
CREATE TABLE IF NOT EXISTS dataset_images (
    id TEXT PRIMARY KEY,
    dataset_id TEXT REFERENCES datasets(id) ON DELETE CASCADE,
    product_id TEXT NOT NULL UNIQUE,
    image_path TEXT NOT NULL,
    thumbnail_path TEXT,
    file_format TEXT DEFAULT 'PNG',
    width INTEGER DEFAULT 1024,
    height INTEGER DEFAULT 1024,
    file_size BIGINT DEFAULT 1048576,
    checksum TEXT,
    status TEXT DEFAULT 'INDEXED',
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Image Metadata table (Section 4)
CREATE TABLE IF NOT EXISTS image_metadata (
    id TEXT PRIMARY KEY,
    image_id TEXT NOT NULL REFERENCES dataset_images(id) ON DELETE CASCADE,
    product_id TEXT NOT NULL,
    payload TEXT NOT NULL,
    sensor TEXT,
    acquisition_time TIMESTAMP,
    latitude REAL,
    longitude REAL,
    resolution_m_per_px REAL,
    sun_elevation_deg REAL,
    sun_azimuth_deg REAL,
    region TEXT,
    instrument TEXT,
    additional_metadata TEXT,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Products table (authoritative sync)
CREATE TABLE IF NOT EXISTS products (
    id TEXT PRIMARY KEY,
    product_id TEXT NOT NULL UNIQUE,
    payload_id TEXT NOT NULL REFERENCES payloads(id),
    filename TEXT NOT NULL,
    product_type TEXT,
    processing_level TEXT,
    acquisition_time TIMESTAMP,
    start_time TIMESTAMP,
    end_time TIMESTAMP,
    file_size_bytes BIGINT,
    checksum TEXT,
    source_reference TEXT,
    status TEXT DEFAULT 'INDEXED',
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- PDS4 / XML metadata extracted from raw product labels
CREATE TABLE IF NOT EXISTS product_metadata (
    id TEXT PRIMARY KEY,
    product_id TEXT NOT NULL UNIQUE REFERENCES products(product_id) ON DELETE CASCADE,
    image_width INTEGER,
    image_height INTEGER,
    band_count INTEGER,
    pixel_type TEXT,
    data_type TEXT,
    resolution_m_per_pixel REAL,
    sun_elevation REAL,
    sun_azimuth REAL,
    incidence_angle REAL,
    emission_angle REAL,
    phase_angle REAL,
    spacecraft_altitude REAL,
    latitude_center REAL,
    longitude_center REAL,
    footprint_geojson TEXT,
    metadata_json TEXT,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Physical image assets stored on disk/object storage
CREATE TABLE IF NOT EXISTS image_assets (
    id TEXT PRIMARY KEY,
    product_id TEXT NOT NULL REFERENCES products(product_id) ON DELETE CASCADE,
    asset_type TEXT NOT NULL,
    file_path TEXT NOT NULL,
    mime_type TEXT DEFAULT 'image/png',
    width INTEGER,
    height INTEGER,
    file_size BIGINT,
    checksum TEXT,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Lunar geological regions / target craters
CREATE TABLE IF NOT EXISTS lunar_regions (
    id TEXT PRIMARY KEY,
    name TEXT NOT NULL,
    latitude REAL NOT NULL,
    longitude REAL NOT NULL,
    description TEXT,
    geometry TEXT
);

-- Product-to-region mapping
CREATE TABLE IF NOT EXISTS product_regions (
    product_id TEXT NOT NULL REFERENCES products(product_id) ON DELETE CASCADE,
    region_id TEXT NOT NULL REFERENCES lunar_regions(id) ON DELETE CASCADE,
    PRIMARY KEY (product_id, region_id)
);

-- Correspondence Jobs table (Section 4)
CREATE TABLE IF NOT EXISTS correspondence_jobs (
    id TEXT PRIMARY KEY,
    source_image_id TEXT NOT NULL,
    target_image_id TEXT NOT NULL,
    status TEXT DEFAULT 'CREATED', -- CREATED, PREPROCESSING, FEATURE_EXTRACTION, MATCHING, GEOMETRIC_VERIFICATION, COMPLETED, FAILED, INSUFFICIENT_CORRESPONDENCE
    algorithm TEXT DEFAULT 'MultiScalePyramid-SIFT-RANSAC',
    started_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    completed_at TIMESTAMP,
    error_message TEXT
);

-- Correspondence Results table (Section 4)
CREATE TABLE IF NOT EXISTS correspondence_results (
    id TEXT PRIMARY KEY,
    job_id TEXT NOT NULL REFERENCES correspondence_jobs(id) ON DELETE CASCADE,
    total_keypoints_source INTEGER DEFAULT 0,
    total_keypoints_target INTEGER DEFAULT 0,
    candidate_matches INTEGER DEFAULT 0,
    inlier_matches INTEGER DEFAULT 0,
    inlier_ratio REAL DEFAULT 0.0,
    confidence REAL DEFAULT 0.0,
    scale_ratio REAL DEFAULT 1.0,
    registration_error REAL DEFAULT 0.0,
    spatial_coverage REAL DEFAULT 0.0,
    homography_available BOOLEAN DEFAULT TRUE,
    processing_time_ms INTEGER DEFAULT 0,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Matched Features table (Section 4)
CREATE TABLE IF NOT EXISTS matched_features (
    id TEXT PRIMARY KEY,
    job_id TEXT NOT NULL REFERENCES correspondence_jobs(id) ON DELETE CASCADE,
    feature_index INTEGER DEFAULT 0,
    source_x REAL NOT NULL,
    source_y REAL NOT NULL,
    target_x REAL NOT NULL,
    target_y REAL NOT NULL,
    distance REAL DEFAULT 0.0,
    is_inlier BOOLEAN DEFAULT TRUE,
    confidence REAL DEFAULT 1.0
);

-- Analysis Metrics table (Section 4)
CREATE TABLE IF NOT EXISTS analysis_metrics (
    id TEXT PRIMARY KEY,
    job_id TEXT NOT NULL REFERENCES correspondence_jobs(id) ON DELETE CASCADE,
    metric_name TEXT NOT NULL,
    metric_value REAL NOT NULL,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Processing Logs table (Section 4)
CREATE TABLE IF NOT EXISTS processing_logs (
    id TEXT PRIMARY KEY,
    job_id TEXT REFERENCES correspondence_jobs(id) ON DELETE CASCADE,
    stage TEXT NOT NULL,
    message TEXT NOT NULL,
    level TEXT DEFAULT 'INFO',
    timestamp TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Correspondence run history (compat)
CREATE TABLE IF NOT EXISTS correspondence_runs (
    id TEXT PRIMARY KEY,
    source_product_id TEXT NOT NULL REFERENCES products(product_id),
    target_product_id TEXT NOT NULL REFERENCES products(product_id),
    source_payload TEXT NOT NULL,
    target_payload TEXT NOT NULL,
    sun_angle_delta REAL,
    scale_ratio REAL,
    algorithm TEXT,
    algorithm_version TEXT,
    matched_features INTEGER,
    inlier_matches INTEGER,
    confidence REAL,
    registration_error REAL,
    status TEXT DEFAULT 'COMPLETED',
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    completed_at TIMESTAMP
);

-- Individual keypoint correspondence tie-points (compat)
CREATE TABLE IF NOT EXISTS correspondence_matches (
    id TEXT PRIMARY KEY,
    run_id TEXT NOT NULL REFERENCES correspondence_runs(id) ON DELETE CASCADE,
    source_x REAL NOT NULL,
    source_y REAL NOT NULL,
    target_x REAL NOT NULL,
    target_y REAL NOT NULL,
    confidence REAL,
    match_type TEXT DEFAULT 'INLIER',
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Background processing and ingestion jobs (compat)
CREATE TABLE IF NOT EXISTS processing_jobs (
    id TEXT PRIMARY KEY,
    product_id TEXT,
    job_type TEXT,
    status TEXT,
    progress REAL DEFAULT 0.0,
    error_message TEXT,
    started_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    completed_at TIMESTAMP
);

-- System audit trail
CREATE TABLE IF NOT EXISTS audit_logs (
    id TEXT PRIMARY KEY,
    action TEXT NOT NULL,
    entity_type TEXT NOT NULL,
    entity_id TEXT NOT NULL,
    details TEXT,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Indexes for high performance querying
CREATE INDEX IF NOT EXISTS idx_products_payload ON products(payload_id);
CREATE INDEX IF NOT EXISTS idx_products_status ON products(status);
CREATE INDEX IF NOT EXISTS idx_dataset_images_pid ON dataset_images(product_id);
CREATE INDEX IF NOT EXISTS idx_image_metadata_pid ON image_metadata(product_id);
CREATE INDEX IF NOT EXISTS idx_image_metadata_coords ON image_metadata(latitude, longitude);
CREATE INDEX IF NOT EXISTS idx_metadata_coords ON product_metadata(latitude_center, longitude_center);
CREATE INDEX IF NOT EXISTS idx_corr_source ON correspondence_runs(source_product_id);
CREATE INDEX IF NOT EXISTS idx_corr_target ON correspondence_runs(target_product_id);
CREATE INDEX IF NOT EXISTS idx_corr_jobs_source ON correspondence_jobs(source_image_id);
CREATE INDEX IF NOT EXISTS idx_corr_jobs_target ON correspondence_jobs(target_image_id);
