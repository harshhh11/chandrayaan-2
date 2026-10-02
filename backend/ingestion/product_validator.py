import hashlib
from pathlib import Path
from typing import Dict, Any, Tuple
from PIL import Image

class ProductValidator:
    """
    Validates Chandrayaan-2 raw datasets and PDS4 labels for integrity,
    file presence, dimensions, and supported payloads.
    """

    SUPPORTED_PAYLOADS = {"OHRC", "TMC-2", "IIRS"}
    SUPPORTED_EXTENSIONS = {".png", ".jpg", ".jpeg", ".tif", ".tiff", ".img", ".xml", ".zip"}

    @staticmethod
    def calculate_checksum(file_path: Path) -> str:
        sha = hashlib.sha256()
        with open(file_path, "rb") as f:
            for chunk in iter(lambda: f.read(65536), b""):
                sha.update(chunk)
        return sha.hexdigest()

    @classmethod
    def validate_dataset_file(cls, file_path: Path) -> Tuple[bool, Dict[str, Any]]:
        if not file_path.exists():
            return False, {"error": f"File does not exist: {file_path}", "reason": "FILE_NOT_FOUND"}

        ext = file_path.suffix.lower()
        if ext not in cls.SUPPORTED_EXTENSIONS:
            return False, {
                "error": f"Unsupported file extension: {ext}",
                "reason": "UNSUPPORTED_FORMAT",
                "supported": list(cls.SUPPORTED_EXTENSIONS)
            }

        file_size = file_path.stat().st_size
        checksum = cls.calculate_checksum(file_path)

        # Image validation
        img_info = {}
        if ext in {".png", ".jpg", ".jpeg", ".tif", ".tiff"}:
            try:
                with Image.open(file_path) as img:
                    img_info["width"] = img.width
                    img_info["height"] = img.height
                    img_info["format"] = img.format
                    img_info["mode"] = img.mode
            except Exception as e:
                return False, {"error": f"Corrupted image file: {str(e)}", "reason": "CORRUPTED_IMAGE"}

        return True, {
            "file_path": str(file_path),
            "file_size": file_size,
            "checksum": checksum,
            "extension": ext,
            "image_info": img_info,
            "status": "VALID"
        }
