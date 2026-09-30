import cv2
import numpy as np
from typing import Dict, Any, Tuple
from ..models.registration import PreprocessingMethod

def apply_preprocessing(
    image: np.ndarray,
    method: PreprocessingMethod = PreprocessingMethod.CLAHE,
    clip_limit: float = 3.0,
    tile_grid_size: Tuple[int, int] = (8, 8)
) -> Tuple[np.ndarray, Dict[str, Any]]:
    """
    Applies scientific illumination normalization and contrast enhancement:
    - CLAHE (Contrast Limited Adaptive Histogram Equalization)
    - Histogram Equalization
    - Gradient-Domain Representation (Sobel magnitude / phase invariant)
    - Wallis Filter (Local mean and variance standardization)
    - Illumination-Invariant Bandpass (DoG filter)
    """
    if method == PreprocessingMethod.NONE:
        return image.copy(), {"method": "NONE", "params": {}}

    elif method == PreprocessingMethod.HISTOGRAM_EQ:
        processed = cv2.equalizeHist(image)
        return processed, {"method": "HISTOGRAM_EQ", "params": {}}

    elif method == PreprocessingMethod.CLAHE or method == PreprocessingMethod.ILLUMINATION_INVARIANT:
        clahe = cv2.createCLAHE(clipLimit=clip_limit, tileGridSize=tile_grid_size)
        processed = clahe.apply(image)
        
        # If illumination invariant is specifically requested, apply gentle bilateral smoothing to suppress sensor grain
        if method == PreprocessingMethod.ILLUMINATION_INVARIANT:
            processed = cv2.bilateralFilter(processed, d=5, sigmaColor=35, sigmaSpace=35)
            
        return processed, {
            "method": method.value,
            "params": {"clip_limit": clip_limit, "tile_grid_size": list(tile_grid_size)}
        }

    elif method == PreprocessingMethod.GRADIENT_DOMAIN:
        # Compute gradient magnitude invariant to global brightness shifts
        sobelx = cv2.Sobel(image, cv2.CV_32F, 1, 0, ksize=3)
        sobely = cv2.Sobel(image, cv2.CV_32F, 0, 1, ksize=3)
        magnitude = cv2.magnitude(sobelx, sobely)
        norm_mag = cv2.normalize(magnitude, None, 0, 255, cv2.NORM_MINMAX)
        processed = norm_mag.astype(np.uint8)
        return processed, {"method": "GRADIENT_DOMAIN", "params": {"ksize": 3}}

    elif method == PreprocessingMethod.WALLIS_FILTER:
        # Wallis filter local standardization: I_out = (I - mean) * (target_std / (std + target_std/c)) + target_mean
        target_mean = 127.0
        target_std = 50.0
        c = 1.0 # brightness enforcement factor
        
        img_f = image.astype(np.float32)
        local_mean = cv2.blur(img_f, (15, 15))
        local_sq_mean = cv2.blur(img_f ** 2, (15, 15))
        local_var = np.maximum(0.0, local_sq_mean - local_mean ** 2)
        local_std = np.sqrt(local_var)
        
        gain = target_std / (local_std + target_std / (c * 2.0 + 1e-5))
        out_f = (img_f - local_mean) * gain + target_mean
        processed = np.clip(out_f, 0, 255).astype(np.uint8)
        return processed, {"method": "WALLIS_FILTER", "params": {"target_mean": target_mean, "target_std": target_std}}

    return image.copy(), {"method": "DEFAULT", "params": {}}
