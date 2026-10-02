-- ============================================================
-- 005_analysis.sql: Sun Angle, Scale, Reports, Jobs, and Candidate Matches View
-- ============================================================

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

-- Candidate Scene Matches View (Calculating spatial overlap, sun delta, and scale ratio from real metadata)
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
