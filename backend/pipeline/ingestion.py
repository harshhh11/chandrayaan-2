import os
import cv2
import numpy as np
from PIL import Image
from pathlib import Path
from typing import Dict, Any, Tuple

def load_and_validate_image(file_path: str) -> Tuple[np.ndarray, Dict[str, Any]]:
    """
    Loads an image file (PNG, JPG, TIFF, GeoTIFF, 8-bit/16-bit)
    and returns a standardized uint8 numpy grayscale image along with metadata report.
    """
    path = Path(file_path)
    if not path.exists():
        raise FileNotFoundError(f"Image file not found: {file_path}")

    # Use PIL or OpenCV to read
    try:
        pil_img = Image.open(path)
        format_name = pil_img.format or path.suffix.upper().replace(".", "")
        orig_mode = pil_img.mode
        width, height = pil_img.size
        
        # Read with OpenCV for high-performance matrix operations
        img = cv2.imread(str(path), cv2.IMREAD_UNCHANGED)
        if img is None:
            # Fallback to PIL array
            img = np.array(pil_img)
            
    except Exception as e:
        raise ValueError(f"Failed to decode image file: {str(e)}")

    orig_dtype = str(img.dtype)
    orig_shape = img.shape
    channels = 1 if len(img.shape) == 2 else img.shape[2]

    # Convert to standard 8-bit grayscale for pipeline processing
    if len(img.shape) == 3:
        if channels == 4:
            gray = cv2.cvtColor(img, cv2.COLOR_BGRA2GRAY)
        elif channels == 3:
            gray = cv2.cvtColor(img, cv2.COLOR_BGR2GRAY)
        else:
            gray = img[:, :, 0]
    else:
        gray = img

    # Normalize 16-bit or floating point to 8-bit uint8 (0-255)
    if gray.dtype == np.uint16:
        # Min-max stretch or 16-bit division
        min_val, max_val = float(np.min(gray)), float(np.max(gray))
        if max_val > min_val:
            gray_u8 = ((gray.astype(np.float32) - min_val) / (max_val - min_val) * 255.0).astype(np.uint8)
        else:
            gray_u8 = (gray / 256).astype(np.uint8)
    elif gray.dtype == np.float32 or gray.dtype == np.float64:
        min_val, max_val = float(np.min(gray)), float(np.max(gray))
        if max_val > min_val:
            gray_u8 = ((gray - min_val) / (max_val - min_val) * 255.0).astype(np.uint8)
        else:
            gray_u8 = np.clip(gray * 255.0, 0, 255).astype(np.uint8)
    else:
        gray_u8 = gray.astype(np.uint8)

    report = {
        "valid": True,
        "width": width,
        "height": height,
        "channels": channels,
        "original_mode": orig_mode,
        "original_dtype": orig_dtype,
        "format": format_name,
        "file_size_bytes": os.path.getsize(path),
        "mean_intensity": float(np.mean(gray_u8)),
        "std_intensity": float(np.std(gray_u8)),
    }

    return gray_u8, report
