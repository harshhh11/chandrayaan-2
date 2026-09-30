from pydantic import BaseModel, Field
from typing import Optional, List, Dict, Any
from enum import Enum
from .dataset import SensorType, SunGeometry
from .metrics import RegistrationMetrics

class MatcherType(str, Enum):
    AUTOMATIC = "AUTOMATIC"
    CLASSICAL_SIFT = "CLASSICAL_SIFT"
    CLASSICAL_ORB = "CLASSICAL_ORB"
    CLASSICAL_AKAZE = "CLASSICAL_AKAZE"
    CROSS_MODAL = "CROSS_MODAL"
    LOFTR = "LOFTR"
    SUPERPOINT = "SUPERPOINT"

class PreprocessingMethod(str, Enum):
    NONE = "NONE"
    HISTOGRAM_EQ = "HISTOGRAM_EQ"
    CLAHE = "CLAHE"
    GRADIENT_DOMAIN = "GRADIENT_DOMAIN"
    ILLUMINATION_INVARIANT = "ILLUMINATION_INVARIANT"
    WALLIS_FILTER = "WALLIS_FILTER"

class GeometricModel(str, Enum):
    AUTOMATIC = "AUTOMATIC"
    SIMILARITY = "SIMILARITY"
    AFFINE = "AFFINE"
    HOMOGRAPHY = "HOMOGRAPHY"

class ScaleHandling(str, Enum):
    AUTOMATIC = "AUTOMATIC"
    MATCH_SOURCE_GSD = "MATCH_SOURCE_GSD"
    MATCH_REF_GSD = "MATCH_REF_GSD"
    MULTI_SCALE_PYRAMID = "MULTI_SCALE_PYRAMID"

class RegistrationConfig(BaseModel):
    matcher_type: MatcherType = MatcherType.AUTOMATIC
    preprocessing_method: PreprocessingMethod = PreprocessingMethod.CLAHE
    geometric_model: GeometricModel = GeometricModel.HOMOGRAPHY
    scale_handling: ScaleHandling = ScaleHandling.AUTOMATIC
    ransac_reproj_threshold_px: float = 3.0
    ransac_confidence: float = 0.99
    enable_subpixel_refinement: bool = True
    enable_uniform_distribution: bool = True
    grid_divisions: int = 8
    max_features: int = 2000

class CorrespondencePoint(BaseModel):
    id: int
    source_x: float
    source_y: float
    reference_x: float
    reference_y: float
    confidence: float
    is_inlier: bool
    refined_source_x: Optional[float] = None
    refined_source_y: Optional[float] = None
    reprojection_error_px: Optional[float] = None
    grid_cell: Optional[str] = None

class ProcessingStage(str, Enum):
    QUEUED = "QUEUED"
    INGESTION = "INGESTION"
    PREPROCESSING = "PREPROCESSING"
    SCALE_NORMALIZATION = "SCALE_NORMALIZATION"
    COARSE_MATCHING = "COARSE_MATCHING"
    FINE_MATCHING = "FINE_MATCHING"
    RANSAC_VERIFICATION = "RANSAC_VERIFICATION"
    SUBPIXEL_REFINEMENT = "SUBPIXEL_REFINEMENT"
    WARPING_REGISTRATION = "WARPING_REGISTRATION"
    EVALUATION = "EVALUATION"
    COMPLETED = "COMPLETED"
    FAILED = "FAILED"

class StageProgress(BaseModel):
    stage: ProcessingStage
    percentage: int
    message: str
    timestamp: str

class RegistrationJob(BaseModel):
    id: str
    source_image_id: str
    reference_image_id: str
    source_sensor: SensorType
    reference_sensor: SensorType
    source_sun_geometry: SunGeometry
    reference_sun_geometry: SunGeometry
    config: RegistrationConfig
    status: ProcessingStage
    progress_pct: int = 0
    stages_log: List[StageProgress] = []
    error_message: Optional[str] = None
    created_at: str
    completed_at: Optional[str] = None
    correspondences: List[CorrespondencePoint] = []
    metrics: Optional[RegistrationMetrics] = None
    registered_image_url: Optional[str] = None
    blend_image_url: Optional[str] = None
    difference_image_url: Optional[str] = None
    confidence_map_url: Optional[str] = None
    transformation_matrix: Optional[List[List[float]]] = None
