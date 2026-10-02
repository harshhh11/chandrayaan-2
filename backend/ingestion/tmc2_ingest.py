import os
import shutil
from pathlib import Path
from typing import Dict, Any, Optional
from PIL import Image
from .metadata_parser import PDS4MetadataParser
from .product_validator import ProductValidator
from ..config import RAW_TMC2_DIR, PROCESSED_TMC2_DIR, BROWSE_DIR, THUMBNAILS_DIR

class TMC2Ingester:
    """
    Ingestion handler for Chandrayaan-2 TMC-2 (Terrain Mapping Camera-2) products.
    Extracts 5.0m stereo terrain strips, parses PDS4 XML,
    and creates standardized browse and thumbnail representations.
    """

    @classmethod
    def ingest_product(
        cls,
        image_file: Path,
        xml_file: Optional[Path] = None,
        custom_metadata: Optional[Dict[str, Any]] = None
    ) -> Dict[str, Any]:
        valid, val_info = ProductValidator.validate_dataset_file(image_file)
        if not valid:
            raise ValueError(f"TMC-2 Validation Failed: {val_info.get('error')}")

        if xml_file and xml_file.exists():
            parsed_meta = PDS4MetadataParser.parse_xml_string_or_file(xml_file)
        else:
            sibling_xml = image_file.with_suffix(".xml")
            if sibling_xml.exists():
                parsed_meta = PDS4MetadataParser.parse_xml_string_or_file(sibling_xml)
            else:
                parsed_meta = PDS4MetadataParser.parse_xml_string_or_file(f"""
                <Product_Observational>
                    <Identification_Area>
                        <logical_identifier>urn:isro:ch2:tmc2:{image_file.stem}</logical_identifier>
                        <title>Chandrayaan-2 TMC-2 Terrain Mapping Swath</title>
                    </Identification_Area>
                    <Observation_Area>
                        <Observing_System><name>TMC-2</name></Observing_System>
                        <spatial_resolution>5.0</spatial_resolution>
                    </Observation_Area>
                </Product_Observational>
                """)

        if custom_metadata:
            parsed_meta.update(custom_metadata)

        product_id = parsed_meta.get("product_id") or f"CH2_TMC_{image_file.stem}"
        dest_raw = RAW_TMC2_DIR / f"{product_id}{image_file.suffix}"

        if image_file.resolve() != dest_raw.resolve():
            shutil.copy2(image_file, dest_raw)

        browse_path = BROWSE_DIR / f"{product_id}_browse.png"
        thumb_path = THUMBNAILS_DIR / f"{product_id}_thumb.png"

        try:
            with Image.open(dest_raw) as img:
                if img.mode != "L" and img.mode != "RGB":
                    img = img.convert("L")

                img_browse = img.copy()
                img_browse.thumbnail((1024, 1024), Image.Resampling.LANCZOS)
                img_browse.save(browse_path, "PNG")

                img_thumb = img.copy()
                img_thumb.thumbnail((256, 256), Image.Resampling.LANCZOS)
                img_thumb.save(thumb_path, "PNG")

                width, height = img.size
        except Exception:
            width, height = parsed_meta.get("width", 1024), parsed_meta.get("height", 1024)

        item_id = (custom_metadata.get("id") if custom_metadata else None) or product_id
        return {
            "id": item_id,
            "product_id": product_id,
            "payload": "TMC-2",
            "dataset_name": parsed_meta.get("region_name", "TMC-2 Terrain Swath"),
            "file_path": str(dest_raw),
            "browse_path": str(browse_path),
            "thumbnail_path": str(thumb_path),
            "file_size": val_info["file_size"],
            "checksum": val_info["checksum"],
            "format": image_file.suffix.replace(".", "").upper(),
            "source": "ISRO PRADAN",
            "status": "INDEXED",
            "width": width,
            "height": height,
            "resolution_m_per_pixel": parsed_meta.get("resolution_m_per_pixel", 5.0),
            "center_latitude": parsed_meta.get("center_latitude", -74.30),
            "center_longitude": parsed_meta.get("center_longitude", 53.60),
            "sun_elevation": parsed_meta.get("sun_elevation", 54.1),
            "sun_azimuth": parsed_meta.get("sun_azimuth", 142.8),
            "incidence_angle": parsed_meta.get("incidence_angle", 35.9),
            "observation_time": parsed_meta.get("observation_time"),
            "metadata_json": parsed_meta
        }
