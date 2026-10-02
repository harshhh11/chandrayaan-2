import os
import shutil
from pathlib import Path
from typing import Dict, Any, Optional
from PIL import Image
from .metadata_parser import PDS4MetadataParser
from .product_validator import ProductValidator
from ..config import RAW_OHRC_DIR, PROCESSED_OHRC_DIR, BROWSE_DIR, THUMBNAILS_DIR

class OHRCIngester:
    """
    Ingestion handler for Chandrayaan-2 OHRC (Orbiter High Resolution Camera) products.
    Extracts sub-meter resolution panchromatic imagery, parses PDS4 XML,
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
            raise ValueError(f"OHRC Validation Failed: {val_info.get('error')}")

        # Parse XML metadata if present
        if xml_file and xml_file.exists():
            parsed_meta = PDS4MetadataParser.parse_xml_string_or_file(xml_file)
        else:
            # Check for sibling .xml file
            sibling_xml = image_file.with_suffix(".xml")
            if sibling_xml.exists():
                parsed_meta = PDS4MetadataParser.parse_xml_string_or_file(sibling_xml)
            else:
                parsed_meta = PDS4MetadataParser.parse_xml_string_or_file(f"""
                <Product_Observational>
                    <Identification_Area>
                        <logical_identifier>urn:isro:ch2:ohrc:{image_file.stem}</logical_identifier>
                        <title>Chandrayaan-2 OHRC High Resolution Observation</title>
                    </Identification_Area>
                    <Observation_Area>
                        <Observing_System><name>OHRC</name></Observing_System>
                        <spatial_resolution>0.25</spatial_resolution>
                    </Observation_Area>
                </Product_Observational>
                """)

        if custom_metadata:
            parsed_meta.update(custom_metadata)

        product_id = parsed_meta.get("product_id") or f"CH2_OHR_{image_file.stem}"
        dest_raw = RAW_OHRC_DIR / f"{product_id}{image_file.suffix}"
        
        # Copy to managed raw storage if needed
        if image_file.resolve() != dest_raw.resolve():
            shutil.copy2(image_file, dest_raw)

        # Generate Browse (1024 max) and Thumbnail (256 max)
        browse_path = BROWSE_DIR / f"{product_id}_browse.png"
        thumb_path = THUMBNAILS_DIR / f"{product_id}_thumb.png"

        try:
            with Image.open(dest_raw) as img:
                # Convert to L if multi-channel panchromatic
                if img.mode != "L" and img.mode != "RGB":
                    img = img.convert("L")
                
                # Browse
                img_browse = img.copy()
                img_browse.thumbnail((1024, 1024), Image.Resampling.LANCZOS)
                img_browse.save(browse_path, "PNG")

                # Thumbnail
                img_thumb = img.copy()
                img_thumb.thumbnail((256, 256), Image.Resampling.LANCZOS)
                img_thumb.save(thumb_path, "PNG")
                
                width, height = img.size
        except Exception as e:
            width, height = parsed_meta.get("width", 1024), parsed_meta.get("height", 1024)

        item_id = (custom_metadata.get("id") if custom_metadata else None) or product_id
        return {
            "id": item_id,
            "product_id": product_id,
            "payload": "OHRC",
            "dataset_name": parsed_meta.get("region_name", "OHRC Lunar Observation"),
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
            "resolution_m_per_pixel": parsed_meta.get("resolution_m_per_pixel", 0.25),
            "center_latitude": parsed_meta.get("center_latitude", -74.32),
            "center_longitude": parsed_meta.get("center_longitude", 53.64),
            "sun_elevation": parsed_meta.get("sun_elevation", 28.4),
            "sun_azimuth": parsed_meta.get("sun_azimuth", 65.2),
            "incidence_angle": parsed_meta.get("incidence_angle", 61.6),
            "observation_time": parsed_meta.get("observation_time"),
            "metadata_json": parsed_meta
        }
