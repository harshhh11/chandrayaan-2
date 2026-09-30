import cv2
import numpy as np
from pathlib import Path
from typing import Dict, Any, Tuple
from ..config import RESULTS_DIR

def generate_registered_products(
    source_img: np.ndarray,
    reference_img: np.ndarray,
    H_matrix: np.ndarray,
    job_id: str
) -> Dict[str, str]:
    """
    Warps the source image onto the reference geometry using estimated Homography matrix H,
    and produces:
    1. Registered warped source product (PNG/TIFF)
    2. 50/50 Blended checkerboard / alpha overlay
    3. Residual difference heatmap
    """
    ref_h, ref_w = reference_img.shape[:2]

    # Warp source image to reference frame
    warped_source = cv2.warpPerspective(
        source_img, H_matrix, (ref_w, ref_h),
        flags=cv2.INTER_CUBIC,
        borderMode=cv2.BORDER_CONSTANT,
        borderValue=0
    )

    # 1. Save registered source image
    reg_filename = f"{job_id}_registered.png"
    reg_path = RESULTS_DIR / reg_filename
    cv2.imwrite(str(reg_path), warped_source)

    # 2. Generate 50/50 Blended image (overlaying reference and registered source)
    # Convert grayscale to 3-channel BGR for colored difference / clear visualization
    ref_bgr = cv2.cvtColor(reference_img, cv2.COLOR_GRAY2BGR)
    warp_bgr = cv2.cvtColor(warped_source, cv2.COLOR_GRAY2BGR)
    
    # Valid overlap mask where warped source has pixels
    mask = (warped_source > 0).astype(np.float32)
    mask_3c = np.repeat(mask[:, :, np.newaxis], 3, axis=2)
    
    # 50/50 blend in overlapping area
    blend_bgr = (ref_bgr * (1.0 - mask_3c * 0.5) + warp_bgr * (mask_3c * 0.5)).astype(np.uint8)
    blend_filename = f"{job_id}_blend.png"
    blend_path = RESULTS_DIR / blend_filename
    cv2.imwrite(str(blend_path), blend_bgr)

    # 3. Generate Difference Heatmap (absolute error in pixel intensities)
    diff = cv2.absdiff(reference_img, warped_source)
    # Mask out non-overlapping zero border regions
    diff[warped_source == 0] = 0
    diff_colored = cv2.applyColorMap(diff, cv2.COLORMAP_JET)
    diff_colored[warped_source == 0] = [10, 15, 20] # dark background

    diff_filename = f"{job_id}_difference.png"
    diff_path = RESULTS_DIR / diff_filename
    cv2.imwrite(str(diff_path), diff_colored)

    return {
        "registered_image_path": str(reg_path),
        "registered_image_url": f"/api/results/{reg_filename}",
        "blend_image_path": str(blend_path),
        "blend_image_url": f"/api/results/{blend_filename}",
        "difference_image_path": str(diff_path),
        "difference_image_url": f"/api/results/{diff_filename}",
    }
