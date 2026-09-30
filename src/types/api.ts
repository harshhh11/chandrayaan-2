export type SensorType = 'OHRC' | 'TMC-2' | 'IIRS' | 'LUNAR_REF';

export interface SunGeometry {
  azimuth_deg: number;
  elevation_deg: number;
  incidence_deg?: number;
  emission_deg?: number;
  phase_deg?: number;
}

export interface LunarCoordinates {
  center_lat: number;
  center_lon: number;
  region_name: string;
  bounding_box?: [number, number, number, number];
}

export interface DatasetItem {
  id: string;
  title: string;
  sensor: SensorType;
  acquisition_date: string;
  location: LunarCoordinates;
  gsd_m: number;
  sun_geometry: SunGeometry;
  image_url: string;
  thumbnail_url?: string;
  width: number;
  height: number;
  bit_depth: number;
  channels: number;
  file_size_kb: number;
  description: string;
}

export type MatcherType =
  | 'AUTOMATIC'
  | 'CLASSICAL_SIFT'
  | 'CLASSICAL_ORB'
  | 'CLASSICAL_AKAZE'
  | 'CROSS_MODAL'
  | 'LOFTR'
  | 'SUPERPOINT';

export type PreprocessingMethod =
  | 'NONE'
  | 'HISTOGRAM_EQ'
  | 'CLAHE'
  | 'GRADIENT_DOMAIN'
  | 'ILLUMINATION_INVARIANT'
  | 'WALLIS_FILTER';

export type GeometricModel = 'AUTOMATIC' | 'SIMILARITY' | 'AFFINE' | 'HOMOGRAPHY';

export type ScaleHandling = 'AUTOMATIC' | 'MATCH_SOURCE_GSD' | 'MATCH_REF_GSD' | 'MULTI_SCALE_PYRAMID';

export interface RegistrationConfig {
  matcher_type: MatcherType;
  preprocessing_method: PreprocessingMethod;
  geometric_model: GeometricModel;
  scale_handling: ScaleHandling;
  ransac_reproj_threshold_px: number;
  ransac_confidence: number;
  enable_subpixel_refinement: boolean;
  enable_uniform_distribution: boolean;
  grid_divisions: number;
  max_features: number;
}

export interface CorrespondencePoint {
  id: number;
  source_x: number;
  source_y: number;
  reference_x: number;
  reference_y: number;
  confidence: number;
  is_inlier: boolean;
  refined_source_x?: number;
  refined_source_y?: number;
  reprojection_error_px?: number;
  grid_cell?: string;
}

export type ProcessingStage =
  | 'QUEUED'
  | 'INGESTION'
  | 'PREPROCESSING'
  | 'SCALE_NORMALIZATION'
  | 'COARSE_MATCHING'
  | 'FINE_MATCHING'
  | 'RANSAC_VERIFICATION'
  | 'SUBPIXEL_REFINEMENT'
  | 'WARPING_REGISTRATION'
  | 'EVALUATION'
  | 'COMPLETED'
  | 'FAILED';

export interface StageProgress {
  stage: ProcessingStage;
  percentage: number;
  message: string;
  timestamp: string;
}

export interface RegistrationMetrics {
  rmse_px: number;
  mae_px: number;
  inlier_count: number;
  total_matches: number;
  inlier_ratio_pct: number;
  mean_confidence: number;
  spatial_coverage_pct: number;
  spatial_uniformity_score: number;
  mutual_information?: number;
  scale_factor_estimated: number;
  rotation_deg_estimated: number;
  translation_x_estimated: number;
  translation_y_estimated: number;
  sun_azimuth_delta_deg: number;
  sun_elevation_delta_deg: number;
  illumination_difference_level: 'LOW' | 'MODERATE' | 'HIGH';
  processing_time_ms: number;
  confidence_rating: 'HIGH' | 'NOMINAL' | 'MARGINAL';
  is_demo?: boolean;
}

export interface RegistrationJob {
  id: string;
  source_image_id: string;
  reference_image_id: string;
  source_sensor: SensorType;
  reference_sensor: SensorType;
  source_sun_geometry: SunGeometry;
  reference_sun_geometry: SunGeometry;
  config: RegistrationConfig;
  status: ProcessingStage;
  progress_pct: number;
  stages_log: StageProgress[];
  error_message?: string;
  created_at: string;
  completed_at?: string;
  correspondences: CorrespondencePoint[];
  metrics?: RegistrationMetrics;
  registered_image_url?: string;
  blend_image_url?: string;
  difference_image_url?: string;
  confidence_map_url?: string;
  transformation_matrix?: number[][];
}
