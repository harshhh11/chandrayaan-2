from pydantic import BaseModel, Field
from typing import Optional, List, Dict

class RegistrationMetrics(BaseModel):
    rmse_px: float = Field(..., description="Root Mean Square Error of inlier reprojection in pixels")
    mae_px: float = Field(..., description="Mean Absolute Error in pixels")
    inlier_count: int = Field(..., description="Number of verified inlier correspondences")
    total_matches: int = Field(..., description="Total candidate matches before geometric verification")
    inlier_ratio_pct: float = Field(..., description="Percentage of inliers (inliers / total_matches * 100)")
    mean_confidence: float = Field(..., description="Average match confidence score (0.0 to 1.0)")
    spatial_coverage_pct: float = Field(..., description="Spatial grid coverage across 8x8 cells")
    spatial_uniformity_score: float = Field(..., description="Shannon entropy uniformity score (0.0 to 1.0)")
    mutual_information: Optional[float] = Field(None, description="Mutual Information between registered and reference image")
    scale_factor_estimated: float = Field(..., description="Estimated scale ratio (source to reference)")
    rotation_deg_estimated: float = Field(..., description="Estimated relative rotation angle in degrees")
    translation_x_estimated: float = Field(..., description="Estimated translation dx in pixels")
    translation_y_estimated: float = Field(..., description="Estimated translation dy in pixels")
    sun_azimuth_delta_deg: float = Field(..., description="Difference in Sun azimuth angle")
    sun_elevation_delta_deg: float = Field(..., description="Difference in Sun elevation angle")
    illumination_difference_level: str = Field(..., description="LOW, MODERATE, or HIGH")
    processing_time_ms: float = Field(..., description="Total execution time in milliseconds")
    confidence_rating: str = Field(..., description="HIGH, NOMINAL, or MARGINAL")
    is_demo: bool = False
