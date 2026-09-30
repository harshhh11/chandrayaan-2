import pytest
import numpy as np
import cv2
from backend.models.dataset import SunGeometry, SensorType
from backend.models.registration import MatcherType, PreprocessingMethod, GeometricModel
from backend.pipeline.metadata import analyze_sun_geometry
from backend.pipeline.preprocessing import apply_preprocessing
from backend.pipeline.scale import normalize_scale
from backend.pipeline.matchers.classical import ClassicalMatcher
from backend.pipeline.matchers.cross_modal import CrossModalMatcher
from backend.pipeline.geometry import verify_geometry_and_filter
from backend.pipeline.evaluation import evaluate_registration
from backend.datasets.sample_generator import generate_synthetic_lunar_patch

def test_sun_geometry_analysis():
    sun1 = SunGeometry(azimuth_deg=45.0, elevation_deg=20.0)
    sun2 = SunGeometry(azimuth_deg=50.0, elevation_deg=22.0)
    res = analyze_sun_geometry(sun1, sun2)
    assert res["illumination_difference_level"] == "LOW"
    assert res["sun_azimuth_delta_deg"] == 5.0
    assert res["sun_elevation_delta_deg"] == 2.0

def test_clahe_preprocessing():
    img = np.zeros((100, 100), dtype=np.uint8)
    img[25:75, 25:75] = 180
    processed, report = apply_preprocessing(img, PreprocessingMethod.CLAHE)
    assert processed.shape == (100, 100)
    assert report["method"] == "CLAHE"

def test_scale_normalization():
    img_src = np.ones((512, 512), dtype=np.uint8) * 128
    img_ref = np.ones((512, 512), dtype=np.uint8) * 128
    src_scaled, ref_scaled, scale_factor, report = normalize_scale(
        img_src, img_ref, source_gsd_m=0.25, reference_gsd_m=5.0
    )
    assert scale_factor == 20.0
    assert src_scaled.shape[0] < img_src.shape[0]

def test_classical_sift_matching():
    # Generate identical patch
    img = generate_synthetic_lunar_patch(seed=42, size=256, craters=8)
    matcher = ClassicalMatcher(algorithm="SIFT")
    matches, report = matcher.match(img, img)
    assert len(matches) > 10
    assert report["status"] == "OK"

def test_cross_modal_matching():
    img1 = generate_synthetic_lunar_patch(seed=101, size=256, craters=8, spectral_tone=1.0)
    img2 = generate_synthetic_lunar_patch(seed=101, size=256, craters=8, spectral_tone=0.75)
    matcher = CrossModalMatcher()
    matches, report = matcher.match(img1, img2)
    assert len(matches) > 4

def test_ransac_verification():
    img = generate_synthetic_lunar_patch(seed=42, size=256, craters=8)
    matcher = ClassicalMatcher(algorithm="SIFT")
    matches, _ = matcher.match(img, img)
    correspondences, H, report = verify_geometry_and_filter(
        matches=matches,
        img_width=256,
        img_height=256,
        model_type=GeometricModel.HOMOGRAPHY,
        reproj_threshold_px=3.0
    )
    assert H is not None
    assert report["inlier_count"] > 4
    assert report["rmse_px"] < 2.0
