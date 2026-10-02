-- ============================================================
-- 004_correspondence.sql: Scene Pairs & Correspondence Runs
-- ============================================================

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

CREATE INDEX IF NOT EXISTS idx_correspondence_runs_scene_pair ON correspondence_runs(scene_pair_id);
CREATE INDEX IF NOT EXISTS idx_matched_features_run ON matched_features(correspondence_run_id);
