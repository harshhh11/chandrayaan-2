import time
import cv2
import json
import numpy as np
from datetime import datetime
from pathlib import Path
from typing import Callable, Optional

from ..config import RAW_DIR, PROCESSED_DIR, RESULTS_DIR
from ..models.registration import (
    RegistrationJob, ProcessingStage, StageProgress,
    MatcherType, PreprocessingMethod, GeometricModel
)
from ..models.dataset import SunGeometry
from ..database import db
from .ingestion import load_and_validate_image
from .metadata import analyze_sun_geometry
from .preprocessing import apply_preprocessing
from .scale import normalize_scale
from .matchers.classical import ClassicalMatcher
from .matchers.cross_modal import CrossModalMatcher
from .matchers.learned import LearnedMatcher
from .geometry import verify_geometry_and_filter
from .refinement import refine_subpixel_correspondences
from .registration import generate_registered_products
from .evaluation import evaluate_registration

def log_stage(job: RegistrationJob, stage: ProcessingStage, pct: int, msg: str):
    job.status = stage
    job.progress_pct = pct
    entry = StageProgress(
        stage=stage,
        percentage=pct,
        message=msg,
        timestamp=datetime.utcnow().strftime("%H:%M:%S.%f")[:-3]
    )
    job.stages_log.append(entry)
    db.save_job(job.id, "CORRESPONDENCE", job.source_image_id, stage.value.upper(), pct)

def execute_registration_pipeline(job_id: str):
    """
    Executes the complete scientific image correspondence and registration workflow.
    Integrates with PostgreSQL / SQLite relational tables.
    """
    job = db.get_job(job_id)
    if not job:
        return

    # Look up reference and target dataset records from DB
    src_id = job.source_image_id if hasattr(job, 'source_image_id') else (job.get('dataset_id') if isinstance(job, dict) else "")
    ref_id = job.reference_image_id if hasattr(job, 'reference_image_id') else ""
    src_ds = db.get_dataset(src_id)
    ref_ds = db.get_dataset(ref_id)
    
    start_time = time.time()
    try:
        # 1. DATA INGESTION
        log_stage(job, ProcessingStage.INGESTION, 10, "Validating and ingesting source and reference raster files...")
        
        src_path = None
        if src_ds and src_ds.get("file_path") and Path(src_ds["file_path"]).exists():
            src_path = Path(src_ds["file_path"])
        else:
            for ext in [".png", ".jpg", ".jpeg", ".tif", ".tiff"]:
                p = RAW_DIR / f"{job.source_image_id}{ext}"
                if p.exists():
                    src_path = p
                    break

        ref_path = None
        if ref_ds and ref_ds.get("file_path") and Path(ref_ds["file_path"]).exists():
            ref_path = Path(ref_ds["file_path"])
        else:
            for ext in [".png", ".jpg", ".jpeg", ".tif", ".tiff"]:
                p = RAW_DIR / f"{job.reference_image_id}{ext}"
                if p.exists():
                    ref_path = p
                    break

        if not src_path or not ref_path:
            raise FileNotFoundError(f"Source ({job.source_image_id}) or Reference ({job.reference_image_id}) image file not found on disk.")

        src_raw, src_report = load_and_validate_image(str(src_path))
        ref_raw, ref_report = load_and_validate_image(str(ref_path))

        # 2. METADATA & SUN ANGLE ANALYSIS
        src_sun = job.source_sun_geometry or SunGeometry(
            azimuth_deg=src_ds.get("sun_azimuth", 45.0) if src_ds else 45.0,
            elevation_deg=src_ds.get("sun_elevation", 30.0) if src_ds else 30.0
        )
        ref_sun = job.reference_sun_geometry or SunGeometry(
            azimuth_deg=ref_ds.get("sun_azimuth", 45.0) if ref_ds else 45.0,
            elevation_deg=ref_ds.get("sun_elevation", 30.0) if ref_ds else 30.0
        )
        sun_analysis = analyze_sun_geometry(src_sun, ref_sun)
        log_stage(
            job, ProcessingStage.PREPROCESSING, 22,
            f"Sun Azimuth Δ: {sun_analysis['sun_azimuth_delta_deg']}°, Elevation Δ: {sun_analysis['sun_elevation_delta_deg']}°. Illumination difference: {sun_analysis['illumination_difference_level']}."
        )

        # 3. ILLUMINATION NORMALIZATION
        src_pre, _ = apply_preprocessing(src_raw, job.config.preprocessing_method)
        ref_pre, _ = apply_preprocessing(ref_raw, job.config.preprocessing_method)

        # 4. GSD & SCALE NORMALIZATION
        log_stage(job, ProcessingStage.SCALE_NORMALIZATION, 35, "Evaluating spatial GSD ratio and executing scale normalization...")
        src_gsd = src_ds.get("resolution_m_per_pixel", 1.0) if src_ds else 1.0
        ref_gsd = ref_ds.get("resolution_m_per_pixel", 1.0) if ref_ds else 1.0

        src_scaled, ref_scaled, applied_scale, scale_report = normalize_scale(
            src_pre, ref_pre, src_gsd, ref_gsd, job.config.scale_handling
        )

        # 5. FEATURE EXTRACTION & MATCHING
        log_stage(
            job, ProcessingStage.COARSE_MATCHING, 48,
            f"Extracting multi-modal feature descriptors using {job.config.matcher_type.value} engine..."
        )

        matcher = None
        if job.config.matcher_type == MatcherType.CLASSICAL_SIFT:
            matcher = ClassicalMatcher(algorithm="SIFT")
        elif job.config.matcher_type == MatcherType.CLASSICAL_ORB:
            matcher = ClassicalMatcher(algorithm="ORB")
        elif job.config.matcher_type == MatcherType.CLASSICAL_AKAZE:
            matcher = ClassicalMatcher(algorithm="AKAZE")
        elif job.config.matcher_type == MatcherType.CROSS_MODAL:
            matcher = CrossModalMatcher()
        elif job.config.matcher_type in [MatcherType.LOFTR, MatcherType.SUPERPOINT]:
            matcher = LearnedMatcher(model_name=job.config.matcher_type.value)
        else: # AUTOMATIC
            if job.source_sensor != job.reference_sensor or sun_analysis["illumination_difference_level"] == "HIGH":
                matcher = CrossModalMatcher()
            else:
                matcher = ClassicalMatcher(algorithm="SIFT")

        raw_matches, match_report = matcher.match(src_scaled, ref_scaled, max_features=job.config.max_features)

        # 6. GEOMETRIC VERIFICATION & RANSAC
        log_stage(
            job, ProcessingStage.RANSAC_VERIFICATION, 65,
            f"Established {len(raw_matches)} candidate correspondences. Running RANSAC geometric verification..."
        )

        correspondences, H_matrix, geo_report = verify_geometry_and_filter(
            matches=raw_matches,
            img_width=ref_scaled.shape[1],
            img_height=ref_scaled.shape[0],
            model_type=job.config.geometric_model,
            reproj_threshold_px=job.config.ransac_reproj_threshold_px,
            confidence=job.config.ransac_confidence,
            enforce_uniformity=job.config.enable_uniform_distribution,
            grid_divisions=job.config.grid_divisions
        )

        if H_matrix is None or geo_report["inlier_count"] < 4:
            raise ValueError(f"Geometric verification failed: insufficient reliable inliers ({geo_report.get('inlier_count', 0)} found). Try adjusting preprocessing or matcher.")

        # 7. SUB-PIXEL REFINEMENT
        if job.config.enable_subpixel_refinement:
            log_stage(job, ProcessingStage.SUBPIXEL_REFINEMENT, 78, "Refining inlier feature coordinates to sub-pixel precision...")
            correspondences, ref_report = refine_subpixel_correspondences(src_scaled, ref_scaled, correspondences)

        # 8. WARPING & REGISTERED IMAGE GENERATION
        log_stage(job, ProcessingStage.WARPING_REGISTRATION, 88, "Warping source raster and synthesizing 50/50 blend and difference heatmaps...")
        product_urls = generate_registered_products(src_scaled, ref_scaled, H_matrix, job.id)

        job.registered_image_url = product_urls["registered_image_url"]
        job.blend_image_url = product_urls["blend_image_url"]
        job.difference_image_url = product_urls["difference_image_url"]
        job.transformation_matrix = H_matrix.tolist()
        job.correspondences = correspondences

        # 9. EVALUATION & ACCURACY METRICS
        log_stage(job, ProcessingStage.EVALUATION, 95, "Calculating final scientific accuracy metrics and spatial uniformity...")
        total_time_ms = int((time.time() - start_time) * 1000.0)

        metrics = evaluate_registration(
            correspondences=correspondences,
            H_matrix=H_matrix,
            reference_img=ref_scaled,
            source_img=src_scaled,
            sun_azimuth_delta=sun_analysis["sun_azimuth_delta_deg"],
            sun_elevation_delta=sun_analysis["sun_elevation_delta_deg"],
            illumination_level=sun_analysis["illumination_difference_level"],
            processing_time_ms=total_time_ms,
            is_demo=False
        )

        job.metrics = metrics
        job.completed_at = datetime.utcnow().isoformat() + "Z"
        log_stage(job, ProcessingStage.COMPLETED, 100, f"Registration completed successfully in {total_time_ms:.1f}ms. Inliers: {metrics.inlier_count}, RMSE: {metrics.rmse_px}px.")

        # 10. PERSIST FULL SCIENTIFIC CORRESPONDENCE RECORD TO RELATIONAL DATABASE
        db.save_correspondence_run(
            run_id=job.id,
            scene_pair_id=f"PAIR-{job.source_image_id[:8]}-{job.reference_image_id[:8]}",
            algorithm=f"{job.config.matcher_type.value} + {job.config.geometric_model.value}",
            parameters=job.config.model_dump(),
            status="COMPLETED",
            processing_time_ms=total_time_ms,
            matches=[c.model_dump() for c in correspondences],
            registration={
                "transform_type": job.config.geometric_model.value,
                "matrix": H_matrix.tolist(),
                "rmse": metrics.rmse_px,
                "inlier_count": metrics.inlier_count,
                "inlier_ratio": round(metrics.inlier_ratio_pct / 100.0, 4),
                "quality": "HIGH" if metrics.rmse_px < 1.0 else "MODERATE"
            },
            sun_analysis={
                "reference_elevation": ref_sun.elevation_deg,
                "reference_azimuth": ref_sun.azimuth_deg,
                "target_elevation": src_sun.elevation_deg,
                "target_azimuth": src_sun.azimuth_deg,
                "elevation_delta": sun_analysis["sun_elevation_delta_deg"],
                "azimuth_delta": sun_analysis["sun_azimuth_delta_deg"],
                "normalization_method": job.config.preprocessing_method.value
            },
            scale_analysis={
                "reference_resolution": ref_gsd,
                "target_resolution": src_gsd,
                "scale_ratio": round(max(ref_gsd, src_gsd) / max(0.01, min(ref_gsd, src_gsd)), 2),
                "pyramid_levels": 4,
                "matching_method": "MULTI_SCALE_PYRAMID"
            },
            report={
                "job_id": job.id,
                "source_image": job.source_image_id,
                "reference_image": job.reference_image_id,
                "metrics": metrics.model_dump(),
                "completed_at": job.completed_at
            }
        )

    except Exception as e:
        job.status = ProcessingStage.FAILED
        job.error_message = str(e)
        job.completed_at = datetime.utcnow().isoformat() + "Z"
        log_stage(job, ProcessingStage.FAILED, job.progress_pct, f"Pipeline execution failed: {str(e)}")
        db.update_job_progress(job.id, job.progress_pct, "FAILED", str(e))
