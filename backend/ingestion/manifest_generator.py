import json
from pathlib import Path
from typing import List, Dict, Any
from ..config import MANIFESTS_DIR

MANIFEST_PATH = MANIFESTS_DIR / "dataset_manifest.json"

class ManifestGenerator:
    """
    Maintains the official curated dataset manifest tracking all ingested
    Chandrayaan-2 products with checksums, source attribution, and metadata.
    """

    @classmethod
    def generate_manifest(cls, datasets: List[Dict[str, Any]]) -> Dict[str, Any]:
        records = []
        for ds in datasets:
            lat = ds.get("center_latitude") if ds.get("center_latitude") is not None else (ds.get("location").center_lat if ds.get("location") else None)
            lon = ds.get("center_longitude") if ds.get("center_longitude") is not None else (ds.get("location").center_lon if ds.get("location") else None)
            sun_el = ds.get("sun_elevation") if ds.get("sun_elevation") is not None else (ds.get("sun_geometry").elevation_deg if ds.get("sun_geometry") else None)
            sun_az = ds.get("sun_azimuth") if ds.get("sun_azimuth") is not None else (ds.get("sun_geometry").azimuth_deg if ds.get("sun_geometry") else None)
            res = ds.get("resolution_m_per_pixel") if ds.get("resolution_m_per_pixel") is not None else ds.get("gsd_m")

            records.append({
                "product_id": ds.get("product_id") or ds.get("id"),
                "payload": ds.get("payload") or (ds.get("sensor").value if hasattr(ds.get("sensor"), "value") else str(ds.get("sensor"))),
                "source": ds.get("source", "ISRO PRADAN"),
                "observation_time": ds.get("observation_time") or ds.get("acquisition_date"),
                "resolution": f"{res} m/px",
                "center_latitude": lat,
                "center_longitude": lon if lon is not None else 0.0,
                "sun_elevation": sun_el,
                "sun_azimuth": sun_az,
                "file": str(ds.get("file_path", "")),
                "browse": str(ds.get("browse_path", ds.get("image_url", ""))),
                "checksum": ds.get("checksum", ""),
                "status": ds.get("status", "INDEXED")
            })

        manifest = {
            "version": "1.0.0",
            "mission": "Chandrayaan-2",
            "organization": "ISRO",
            "total_products": len(records),
            "payload_summary": {
                "OHRC": sum(1 for r in records if "OHRC" in r["payload"]),
                "TMC-2": sum(1 for r in records if "TMC" in r["payload"]),
                "IIRS": sum(1 for r in records if "IIRS" in r["payload"])
            },
            "products": records
        }

        with open(MANIFEST_PATH, "w", encoding="utf-8") as f:
            json.dump(manifest, f, indent=2)

        return manifest

    @classmethod
    def load_manifest(cls) -> Dict[str, Any]:
        if MANIFEST_PATH.exists():
            try:
                with open(MANIFEST_PATH, "r", encoding="utf-8") as f:
                    return json.load(f)
            except Exception:
                pass
        return {"total_products": 0, "products": []}
