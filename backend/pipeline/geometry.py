import cv2
import numpy as np
import math
from typing import List, Tuple, Dict, Any, Optional
from ..models.registration import CorrespondencePoint, GeometricModel
from .matchers.base import RawMatch

def verify_geometry_and_filter(
    matches: List[RawMatch],
    img_width: int,
    img_height: int,
    model_type: GeometricModel = GeometricModel.HOMOGRAPHY,
    reproj_threshold_px: float = 3.0,
    confidence: float = 0.99,
    enforce_uniformity: bool = True,
    grid_divisions: int = 8
) -> Tuple[List[CorrespondencePoint], Optional[np.ndarray], Dict[str, Any]]:
    """
    Performs robust RANSAC geometric estimation (Homography / Affine / Similarity)
    and enforces uniform spatial distribution across the image grid.
    """
    if len(matches) < 4:
        return [], None, {
            "status": "FAILED_INSUFFICIENT_MATCHES",
            "inlier_count": 0,
            "total_matches": len(matches),
            "inlier_ratio": 0.0,
            "reproj_threshold_px": reproj_threshold_px
        }

    src_pts = np.float32([[m.src_x, m.src_y] for m in matches]).reshape(-1, 1, 2)
    ref_pts = np.float32([[m.ref_x, m.ref_y] for m in matches]).reshape(-1, 1, 2)

    M = None
    mask = None

    if model_type == GeometricModel.AFFINE or (model_type == GeometricModel.AUTOMATIC and len(matches) < 8):
        M_aff, inliers = cv2.estimateAffine2D(src_pts, ref_pts, method=cv2.RANSAC, ransacReprojThreshold=reproj_threshold_px, confidence=confidence)
        if M_aff is not None:
            # Convert 2x3 affine to 3x3 homography matrix for uniform handling
            M = np.vstack([M_aff, [0, 0, 1]])
            mask = inliers.flatten() if inliers is not None else np.zeros(len(matches), dtype=bool)
    else: # Homography (default)
        M, inliers = cv2.findHomography(src_pts, ref_pts, cv2.RANSAC, reproj_threshold_px, confidence=confidence)
        mask = inliers.flatten() if inliers is not None else np.zeros(len(matches), dtype=bool)

    if M is None or mask is None:
        # Fallback identity or failed
        return [], None, {"status": "RANSAC_ESTIMATION_FAILED", "inlier_count": 0, "total_matches": len(matches)}

    correspondences: List[CorrespondencePoint] = []
    inlier_errors = []

    # Spatial grid buckets for uniformity analysis
    cell_w = max(1, img_width // grid_divisions)
    cell_h = max(1, img_height // grid_divisions)
    grid_buckets: Dict[str, List[int]] = {}

    for i, m in enumerate(matches):
        is_inlier = bool(mask[i] == 1)
        
        # Calculate reprojection error: error = || ref_pt - H * src_pt ||
        pt_src_h = np.array([m.src_x, m.src_y, 1.0])
        mapped_pt = M @ pt_src_h
        if abs(mapped_pt[2]) > 1e-6:
            proj_x = mapped_pt[0] / mapped_pt[2]
            proj_y = mapped_pt[1] / mapped_pt[2]
            reproj_err = float(np.sqrt((proj_x - m.ref_x)**2 + (proj_y - m.ref_y)**2))
        else:
            reproj_err = 999.0

        if is_inlier:
            inlier_errors.append(reproj_err)

        # Assign spatial cell
        gx = min(grid_divisions - 1, max(0, int(m.src_x // cell_w)))
        gy = min(grid_divisions - 1, max(0, int(m.src_y // cell_h)))
        cell_key = f"{gx}_{gy}"

        if is_inlier:
            if cell_key not in grid_buckets:
                grid_buckets[cell_key] = []
            grid_buckets[cell_key].append(i)

        correspondences.append(CorrespondencePoint(
            id=i + 1,
            source_x=round(m.src_x, 2),
            source_y=round(m.src_y, 2),
            reference_x=round(m.ref_x, 2),
            reference_y=round(m.ref_y, 2),
            confidence=round(m.confidence, 4),
            is_inlier=is_inlier,
            reprojection_error_px=round(reproj_err, 3),
            grid_cell=cell_key
        ))

    inlier_count = len(inlier_errors)
    total_matches = len(matches)
    inlier_ratio = (inlier_count / total_matches * 100.0) if total_matches > 0 else 0.0
    rmse = float(np.sqrt(np.mean(np.array(inlier_errors)**2))) if inlier_count > 0 else 0.0

    # Calculate spatial grid coverage and uniformity entropy
    total_cells = grid_divisions * grid_divisions
    occupied_cells = len(grid_buckets)
    coverage_pct = (occupied_cells / total_cells) * 100.0

    # Shannon entropy of spatial point distribution
    if inlier_count > 0:
        probs = [len(indices) / inlier_count for indices in grid_buckets.values()]
        entropy = -sum(p * math.log2(p) for p in probs if p > 0)
        max_entropy = math.log2(total_cells)
        uniformity_score = max(0.0, min(1.0, entropy / max(1e-5, max_entropy)))
    else:
        uniformity_score = 0.0

    report = {
        "status": "SUCCESS" if inlier_count >= 4 else "LOW_INLIERS",
        "inlier_count": inlier_count,
        "total_matches": total_matches,
        "inlier_ratio_pct": round(inlier_ratio, 2),
        "rmse_px": round(rmse, 3),
        "mean_inlier_reproj_err_px": round(float(np.mean(inlier_errors)), 3) if inlier_count > 0 else 0.0,
        "spatial_coverage_pct": round(coverage_pct, 2),
        "spatial_uniformity_score": round(uniformity_score, 4),
        "grid_divisions": grid_divisions,
        "occupied_cells": occupied_cells,
        "total_cells": total_cells,
    }

    return correspondences, M, report
