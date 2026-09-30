import cv2
import numpy as np
from typing import Dict, Any, Tuple, List
from ..models.registration import ScaleHandling

def normalize_scale(
    source_img: np.ndarray,
    reference_img: np.ndarray,
    source_gsd_m: float,
    reference_gsd_m: float,
    mode: ScaleHandling = ScaleHandling.AUTOMATIC
) -> Tuple[np.ndarray, np.ndarray, float, Dict[str, Any]]:
    """
    Computes GSD scale ratio and resamples imagery to common spatial resolution:
    Scale Ratio = reference_gsd_m / source_gsd_m
    E.g. OHRC (0.25m) vs TMC-2 (5.0m) => Scale ratio = 20.0
    """
    scale_ratio = reference_gsd_m / max(1e-4, source_gsd_m)
    resampled_source = source_img
    resampled_ref = reference_img
    applied_scale = 1.0

    if mode == ScaleHandling.MATCH_REF_GSD or (mode == ScaleHandling.AUTOMATIC and abs(scale_ratio - 1.0) > 0.05):
        # Downsample/resample source to match reference GSD
        new_w = max(32, int(round(source_img.shape[1] / scale_ratio)))
        new_h = max(32, int(round(source_img.shape[0] / scale_ratio)))
        resampled_source = cv2.resize(source_img, (new_w, new_h), interpolation=cv2.INTER_AREA if scale_ratio > 1.0 else cv2.INTER_CUBIC)
        applied_scale = scale_ratio

    elif mode == ScaleHandling.MATCH_SOURCE_GSD:
        # Upsample reference to match source GSD
        new_w = int(round(reference_img.shape[1] * scale_ratio))
        new_h = int(round(reference_img.shape[0] * scale_ratio))
        resampled_ref = cv2.resize(reference_img, (new_w, new_h), interpolation=cv2.INTER_CUBIC)
        applied_scale = 1.0 / scale_ratio

    report = {
        "source_gsd_m": source_gsd_m,
        "reference_gsd_m": reference_gsd_m,
        "theoretical_scale_ratio": round(scale_ratio, 4),
        "applied_scale_factor": round(applied_scale, 4),
        "source_shape_orig": list(source_img.shape),
        "source_shape_resampled": list(resampled_source.shape),
        "reference_shape": list(resampled_ref.shape),
        "resampling_mode": mode.value
    }

    return resampled_source, resampled_ref, applied_scale, report

def build_gaussian_pyramid(image: np.ndarray, levels: int = 3) -> List[np.ndarray]:
    """Generates coarse-to-fine Gaussian image pyramid for multi-scale matching."""
    pyramid = [image]
    current = image
    for _ in range(1, levels):
        current = cv2.pyrDown(current)
        pyramid.append(current)
    return pyramid
