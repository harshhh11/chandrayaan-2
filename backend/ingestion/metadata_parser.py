import re
import json
import xml.etree.ElementTree as ET
from pathlib import Path
from typing import Dict, Any, Optional
from datetime import datetime

class PDS4MetadataParser:
    """
    Robust PDS4 / XML metadata parser for Chandrayaan-2 payloads (OHRC, TMC-2, IIRS).
    Extracts geometric, solar, and instrument parameters while preserving full XML.
    """

    @staticmethod
    def _strip_ns(tag: str) -> str:
        if "}" in tag:
            return tag.split("}", 1)[1]
        return tag

    @classmethod
    def _xml_to_dict(cls, elem: ET.Element) -> Dict[str, Any]:
        result: Dict[str, Any] = {}
        tag = cls._strip_ns(elem.tag)
        
        # Attributes
        for k, v in elem.attrib.items():
            result[f"@{cls._strip_ns(k)}"] = v

        # Text
        text = elem.text.strip() if elem.text else ""
        children = list(elem)
        
        if not children:
            return text if text else ""

        child_dict: Dict[str, Any] = {}
        for child in children:
            child_tag = cls._strip_ns(child.tag)
            child_val = cls._xml_to_dict(child)
            if child_tag in child_dict:
                if isinstance(child_dict[child_tag], list):
                    child_dict[child_tag].append(child_val)
                else:
                    child_dict[child_tag] = [child_dict[child_tag], child_val]
            else:
                child_dict[child_tag] = child_val

        if text:
            child_dict["#text"] = text

        return child_dict

    @classmethod
    def parse_xml_string_or_file(cls, xml_input: str | Path) -> Dict[str, Any]:
        """
        Parses XML file or string and extracts standardized Chandrayaan-2 metadata.
        """
        try:
            if isinstance(xml_input, Path) or (isinstance(xml_input, str) and (xml_input.endswith(".xml") or "\n" not in xml_input and Path(xml_input).exists())):
                path = Path(xml_input)
                with open(path, "r", encoding="utf-8", errors="replace") as f:
                    xml_content = f.read()
                tree = ET.fromstring(xml_content)
            else:
                xml_content = xml_input
                tree = ET.fromstring(xml_content)
        except Exception as e:
            return {
                "error": f"Failed to parse XML: {str(e)}",
                "valid": False,
                "metadata_json": {}
            }

        full_dict = cls._xml_to_dict(tree)
        extracted = cls._extract_standard_fields(tree, full_dict)
        extracted["raw_metadata_json"] = full_dict
        extracted["valid"] = True
        return extracted

    @classmethod
    def _find_text(cls, tree: ET.Element, patterns: list[str]) -> Optional[str]:
        for elem in tree.iter():
            clean_tag = cls._strip_ns(elem.tag).lower()
            for pat in patterns:
                if clean_tag == pat.lower() and elem.text and elem.text.strip():
                    return elem.text.strip()
        return None

    @classmethod
    def _find_float(cls, tree: ET.Element, patterns: list[str]) -> Optional[float]:
        val_str = cls._find_text(tree, patterns)
        if val_str is not None:
            try:
                # Remove unit suffixes if present
                clean = re.sub(r"[^\d\.\-\+eE]", "", val_str)
                return float(clean)
            except ValueError:
                pass
        return None

    @classmethod
    def _find_int(cls, tree: ET.Element, patterns: list[str]) -> Optional[int]:
        val = cls._find_float(tree, patterns)
        return int(val) if val is not None else None

    @classmethod
    def _extract_standard_fields(cls, tree: ET.Element, full_dict: Dict[str, Any]) -> Dict[str, Any]:
        # Product ID
        product_id = cls._find_text(tree, ["logical_identifier", "product_id", "productid", "product_name", "title"])
        if product_id and ":" in product_id:
            # urn:isro:ch2:payload:data_product -> extract last token
            product_id = product_id.split(":")[-1]

        # Instrument / Payload
        instrument = cls._find_text(tree, ["instrument_name", "instrument_id", "observing_system_name", "payload", "instrument"])
        norm_payload = "OHRC"
        if instrument:
            inst_up = instrument.upper()
            if "OHRC" in inst_up or "HIGH RESOLUTION" in inst_up:
                norm_payload = "OHRC"
            elif "TMC" in inst_up or "TERRAIN" in inst_up:
                norm_payload = "TMC-2"
            elif "IIRS" in inst_up or "INFRARED" in inst_up or "SPECTROMETER" in inst_up:
                norm_payload = "IIRS"
        elif product_id:
            pid_up = product_id.upper()
            if "OHR" in pid_up:
                norm_payload = "OHRC"
            elif "TMC" in pid_up:
                norm_payload = "TMC-2"
            elif "IIR" in pid_up:
                norm_payload = "IIRS"

        # Observation times
        start_time_str = cls._find_text(tree, ["start_date_time", "start_time", "starttime", "observation_time", "acquisition_time"])
        stop_time_str = cls._find_text(tree, ["stop_date_time", "stop_time", "endtime", "end_time"])
        
        # Dimensions
        lines = cls._find_int(tree, ["lines", "line_count", "elements_y", "height", "rows"]) or 1024
        samples = cls._find_int(tree, ["samples", "sample_count", "elements_x", "width", "columns"]) or 1024
        bands = cls._find_int(tree, ["bands", "band_count", "elements_z", "spectral_bands"]) or (256 if norm_payload == "IIRS" else 1)

        # Resolution (m/pixel)
        res_m = cls._find_float(tree, [
            "resolution_m_per_pixel", "ground_sampling_distance", "spatial_resolution",
            "pixel_resolution", "resolution", "gsd", "sample_resolution"
        ])
        if res_m is None:
            res_m = 0.25 if norm_payload == "OHRC" else (5.0 if norm_payload == "TMC-2" else 80.0)

        # Geographic coordinates
        min_lat = cls._find_float(tree, ["minimum_latitude", "latitude_min", "min_lat", "south_bounding_coordinate"])
        max_lat = cls._find_float(tree, ["maximum_latitude", "latitude_max", "max_lat", "north_bounding_coordinate"])
        min_lon = cls._find_float(tree, ["minimum_longitude", "longitude_min", "min_lon", "west_bounding_coordinate"])
        max_lon = cls._find_float(tree, ["maximum_longitude", "longitude_max", "max_lon", "east_bounding_coordinate"])
        
        center_lat = cls._find_float(tree, ["center_latitude", "latitude", "center_lat"])
        center_lon = cls._find_float(tree, ["center_longitude", "longitude", "center_lon"])

        if center_lat is None and min_lat is not None and max_lat is not None:
            center_lat = round((min_lat + max_lat) / 2.0, 4)
        if center_lon is None and min_lon is not None and max_lon is not None:
            center_lon = round((min_lon + max_lon) / 2.0, 4)

        if center_lat is None:
            center_lat = -74.32
        if center_lon is None:
            center_lon = 53.64

        # Solar & Illumination Geometry
        sun_elevation = cls._find_float(tree, ["sun_elevation_angle", "sun_elevation", "solar_elevation", "elevation_angle", "sun_elev"])
        sun_azimuth = cls._find_float(tree, ["sun_azimuth_angle", "sun_azimuth", "solar_azimuth", "azimuth_angle", "sun_azim"])
        incidence = cls._find_float(tree, ["incidence_angle", "solar_incidence_angle", "incidence"])
        emission = cls._find_float(tree, ["emission_angle", "emission"])
        phase = cls._find_float(tree, ["phase_angle", "solar_phase_angle", "phase"])

        if sun_elevation is None:
            sun_elevation = 28.4 if norm_payload == "OHRC" else (54.1 if norm_payload == "TMC-2" else 12.6)
        if sun_azimuth is None:
            sun_azimuth = 65.2 if norm_payload == "OHRC" else (142.8 if norm_payload == "TMC-2" else 210.4)
        if incidence is None:
            incidence = round(90.0 - sun_elevation, 2)

        # Processing level
        processing_level = cls._find_text(tree, ["processing_level_id", "processing_level", "product_level", "level"]) or "LEVEL-2"
        
        # Region Name
        region_name = cls._find_text(tree, ["target_name", "region_name", "target", "feature_name"])
        if not region_name:
            if abs(center_lat) > 85.0:
                region_name = "Shackleton Rim (South Pole)"
            elif -76.0 <= center_lat <= -70.0:
                region_name = "Boguslawsky E Crater"
            elif -45.0 <= center_lat <= -40.0:
                region_name = "Tycho Crater"
            else:
                region_name = f"Lunar Target ({center_lat:.2f}°, {center_lon:.2f}°)"

        return {
            "product_id": product_id or f"CH2_{norm_payload.replace('-','')}_{datetime.utcnow().strftime('%Y%m%d%H%M')}",
            "payload": norm_payload,
            "observation_time": start_time_str or datetime.utcnow().isoformat() + "Z",
            "start_time": start_time_str,
            "end_time": stop_time_str,
            "width": samples,
            "height": lines,
            "bands": bands,
            "resolution_m_per_pixel": res_m,
            "latitude_min": min_lat,
            "latitude_max": max_lat,
            "longitude_min": min_lon,
            "longitude_max": max_lon,
            "center_latitude": center_lat,
            "center_longitude": center_lon,
            "sun_elevation": sun_elevation,
            "sun_azimuth": sun_azimuth,
            "incidence_angle": incidence,
            "emission_angle": emission,
            "phase_angle": phase,
            "processing_level": processing_level,
            "region_name": region_name,
            "look_direction": "NADIR",
            "coordinate_system": "MOON_ME_2000"
        }
