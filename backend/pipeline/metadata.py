import math
from typing import Dict, Any, Tuple
from ..models.dataset import SunGeometry

def analyze_sun_geometry(
    source_sun: SunGeometry,
    reference_sun: SunGeometry
) -> Dict[str, Any]:
    """
    Computes angular differences between two lunar observation conditions:
    Sun azimuth delta, Sun elevation delta, and overall illumination difference severity.
    """
    # Azimuth difference in [0, 180]
    raw_az_diff = abs(source_sun.azimuth_deg - reference_sun.azimuth_deg) % 360
    az_diff = 360 - raw_az_diff if raw_az_diff > 180 else raw_az_diff
    
    # Elevation difference in [0, 180]
    el_diff = abs(source_sun.elevation_deg - reference_sun.elevation_deg)
    
    # Combined illumination angle distance (3D vector dot product)
    # Convert spherical to cartesian vectors
    def to_vec(az, el):
        az_r, el_r = math.radians(az), math.radians(el)
        return (
            math.cos(el_r) * math.cos(az_r),
            math.cos(el_r) * math.sin(az_r),
            math.sin(el_r)
        )
    
    v1 = to_vec(source_sun.azimuth_deg, source_sun.elevation_deg)
    v2 = to_vec(reference_sun.azimuth_deg, reference_sun.elevation_deg)
    dot_prod = max(-1.0, min(1.0, v1[0]*v2[0] + v1[1]*v2[1] + v1[2]*v2[2]))
    angular_dist_deg = math.degrees(math.acos(dot_prod))
    
    if angular_dist_deg < 25.0 and el_diff < 15.0:
        diff_level = "LOW"
    elif angular_dist_deg < 55.0 and el_diff < 35.0:
        diff_level = "MODERATE"
    else:
        diff_level = "HIGH"

    return {
        "sun_azimuth_delta_deg": round(az_diff, 2),
        "sun_elevation_delta_deg": round(el_diff, 2),
        "angular_distance_deg": round(angular_dist_deg, 2),
        "illumination_difference_level": diff_level,
        "requires_shadow_compensation": diff_level in ["MODERATE", "HIGH"]
    }
