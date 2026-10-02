-- ============================================================
-- 003_datasets.sql: Datasets, Image Products & Spectral Products
-- ============================================================

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

CREATE INDEX IF NOT EXISTS idx_datasets_product_id ON datasets(product_id);
CREATE INDEX IF NOT EXISTS idx_image_products_payload ON image_products(payload);
CREATE INDEX IF NOT EXISTS idx_image_products_coords ON image_products(center_latitude, center_longitude);
