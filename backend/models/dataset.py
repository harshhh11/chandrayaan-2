from pydantic import BaseModel, Field
from typing import Optional, List, Dict, Any
from enum import Enum

class SensorType(str, Enum):
    OHRC = "OHRC"
    TMC2 = "TMC-2"
    IIRS = "IIRS"
    LUNAR_REF = "LUNAR_REF"

class SunGeometry(BaseModel):
    azimuth_deg: float = Field(..., description="Sun azimuth angle in degrees (0-360)")
    elevation_deg: float = Field(..., description="Sun elevation angle in degrees (-90 to 90)")
    incidence_deg: Optional[float] = Field(None, description="Sun incidence angle in degrees")
    emission_deg: Optional[float] = Field(None, description="Emission angle in degrees")
    phase_deg: Optional[float] = Field(None, description="Phase angle in degrees")

class LunarCoordinates(BaseModel):
    center_lat: float = Field(..., description="Center latitude in degrees")
    center_lon: float = Field(..., description="Center longitude in degrees")
    region_name: str = Field(..., description="Named feature or crater area (e.g. Boguslawsky, Shackleton, Tycho)")
    bounding_box: Optional[List[float]] = Field(None, description="[min_lat, min_lon, max_lat, max_lon]")

class DatasetItem(BaseModel):
    id: str
    title: str
    sensor: SensorType
    acquisition_date: str
    location: LunarCoordinates
    gsd_m: float = Field(..., description="Ground Sampling Distance in meters/pixel")
    sun_geometry: SunGeometry
    image_url: str
    thumbnail_url: Optional[str] = None
    width: int
    height: int
    bit_depth: int = 8
    channels: int = 1
    file_size_kb: int
    description: str
