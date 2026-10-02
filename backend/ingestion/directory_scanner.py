import zipfile
from pathlib import Path
from typing import List, Dict, Any
from ..config import RAW_DIR, RAW_OHRC_DIR, RAW_TMC2_DIR, RAW_IIRS_DIR
from .ohrc_ingest import OHRCIngester
from .tmc2_ingest import TMC2Ingester
from .iirs_ingest import IIRSIngester
from .manifest_generator import ManifestGenerator
from ..database import db

class DirectoryScanner:
    """
    Scans raw dataset folders (/data/raw/ohrc, /data/raw/tmc2, /data/raw/iirs)
    for downloaded ZIP archives or PDS4 image+XML pairs, extracts archives safely,
    and ingests new products automatically into the database.
    """

    @classmethod
    def scan_and_ingest_all(cls) -> Dict[str, Any]:
        results = {"ingested": [], "errors": [], "skipped": []}
        
        folders = [
            (RAW_OHRC_DIR, OHRCIngester, "OHRC"),
            (RAW_TMC2_DIR, TMC2Ingester, "TMC-2"),
            (RAW_IIRS_DIR, IIRSIngester, "IIRS"),
            (RAW_DIR, OHRCIngester, "OHRC")
        ]

        existing_datasets = {d["product_id"]: d for d in db.list_datasets()}

        for folder, ingester, default_payload in folders:
            if not folder.exists():
                continue

            # 1. Check for ZIP archives and extract safely
            for zip_path in folder.glob("*.zip"):
                try:
                    extract_target = folder / zip_path.stem
                    extract_target.mkdir(parents=True, exist_ok=True)
                    with zipfile.ZipFile(zip_path, "r") as zf:
                        # Prevent ZipSlip vulnerability
                        for member in zf.namelist():
                            if ".." in member or member.startswith("/") or member.startswith("\\"):
                                continue
                            zf.extract(member, extract_target)
                except Exception as e:
                    results["errors"].append({"file": str(zip_path), "error": str(e)})

            # 2. Check for image files
            for img_path in list(folder.glob("*.png")) + list(folder.glob("*.tif")) + list(folder.glob("*.tiff")) + list(folder.glob("*.jpg")):
                if img_path.name.endswith("_browse.png") or img_path.name.endswith("_thumb.png"):
                    continue

                prod_id = img_path.stem
                if prod_id in existing_datasets:
                    results["skipped"].append(prod_id)
                    continue

                try:
                    xml_path = img_path.with_suffix(".xml")
                    record = ingester.ingest_product(
                        image_file=img_path,
                        xml_file=xml_path if xml_path.exists() else None
                    )
                    db.add_dataset(record)
                    results["ingested"].append(record["product_id"])
                    existing_datasets[record["product_id"]] = record
                except Exception as e:
                    results["errors"].append({"file": str(img_path), "error": str(e)})

        # Update Manifest
        all_ds = db.list_datasets()
        ManifestGenerator.generate_manifest(all_ds)

        return results
