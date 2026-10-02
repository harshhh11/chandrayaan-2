import { DatasetItem, RegistrationJob, RegistrationConfig, RegistrationMetrics, CorrespondencePoint } from '@/types/api';
import { DEFAULT_DATASETS } from './defaultDatasets';

const API_BASE = process.env.NEXT_PUBLIC_API_URL || 'http://127.0.0.1:8000';

export interface BackendDataset {
  id: string;
  product_id: string;
  title: string;
  dataset: string;
  instrument: string;
  acquisition: string;
  lat: number;
  lon: number;
  region: string;
  sun_elevation: number;
  sun_azimuth: number;
  resolution: string;
  gsd_m: number;
  image_url: string;
  thumbnail_url: string;
  file_size_kb: number;
  width: number;
  height: number;
  status: string;
  source: string;
}

export interface CandidateSceneMatch {
  reference_dataset_id: string;
  reference_product_id: string;
  reference_payload: string;
  reference_resolution: number;
  reference_sun_elevation: number;
  reference_sun_azimuth: number;
  target_dataset_id: string;
  target_product_id: string;
  target_payload: string;
  target_resolution: number;
  target_sun_elevation: number;
  target_sun_azimuth: number;
  latitude: number;
  longitude: number;
  region_name: string;
  sun_angle_difference: number;
  resolution_ratio: number;
  match_suitability: number;
}

export interface AnalyticsOverview {
  images_indexed: number;
  ohrc_count: number;
  tmc_count: number;
  iirs_count: number;
  matches_processed: number;
  avg_correspondence_rate: number;
  avg_rmse_px: number;
  active_analyses: number;
  cross_modal_benchmarks?: any[];
  sun_angle_performance?: any[];
}

export const apiClient = {
  async getHealth(): Promise<{ status: string; service: string; pipeline_ready: boolean; pradan_gateway?: any }> {
    try {
      const res = await fetch(`${API_BASE}/api/health`, { cache: 'no-store' });
      if (!res.ok) throw new Error('API offline');
      return await res.json();
    } catch {
      return { status: 'STANDALONE_HYBRID', service: 'EDOLUS Client Mode', pipeline_ready: true };
    }
  },

  async getDatasets(payload?: string, query?: string): Promise<BackendDataset[]> {
    try {
      let url = `${API_BASE}/api/datasets`;
      const params = new URLSearchParams();
      if (payload && payload !== 'ALL') params.append('payload', payload);
      if (query) params.append('query', query);
      if (params.toString()) url += `?${params.toString()}`;

      const res = await fetch(url, { cache: 'no-store' });
      if (!res.ok) throw new Error('Failed to load datasets');
      const data = await res.json();
      return data.length > 0 ? data : [];
    } catch {
      return [];
    }
  },

  async getDataset(id: string): Promise<any> {
    try {
      const res = await fetch(`${API_BASE}/api/datasets/${id}`, { cache: 'no-store' });
      if (res.ok) return await res.json();
    } catch {}
    return null;
  },

  async getDatasetMetadata(id: string): Promise<any> {
    try {
      const res = await fetch(`${API_BASE}/api/datasets/${id}/metadata`, { cache: 'no-store' });
      if (res.ok) return await res.json();
    } catch {}
    return null;
  },

  async getCandidateMatches(): Promise<CandidateSceneMatch[]> {
    try {
      const res = await fetch(`${API_BASE}/api/candidate-matches`, { cache: 'no-store' });
      if (res.ok) return await res.json();
    } catch {}
    return [];
  },

  async runCorrespondence(sourceId: string, referenceId: string, config?: RegistrationConfig): Promise<RegistrationJob> {
    const res = await fetch(`${API_BASE}/api/correspondence/run`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        source_image_id: sourceId,
        reference_image_id: referenceId,
        config: config || {
          matcher_type: 'AUTOMATIC',
          preprocessing_method: 'CLAHE',
          geometric_model: 'HOMOGRAPHY',
          scale_handling: 'AUTOMATIC',
          ransac_reproj_threshold_px: 2.5,
          ransac_confidence: 0.99,
          enable_subpixel_refinement: true,
          enable_uniform_distribution: true,
          grid_divisions: 8,
          max_features: 2000,
        },
      }),
    });

    if (!res.ok) {
      const err = await res.json().catch(() => ({ detail: 'Job creation failed' }));
      throw new Error(err.detail || 'Failed to start correspondence job');
    }
    return await res.json();
  },

  async getCorrespondence(jobId: string): Promise<any> {
    const res = await fetch(`${API_BASE}/api/correspondence/${jobId}`, { cache: 'no-store' });
    if (!res.ok) throw new Error(`Job ${jobId} not found`);
    return await res.json();
  },

  async getCorrespondenceResults(jobId: string): Promise<any> {
    const res = await fetch(`${API_BASE}/api/correspondence/${jobId}/results`, { cache: 'no-store' });
    if (!res.ok) throw new Error(`Results for ${jobId} not found`);
    return await res.json();
  },

  async getAnalytics(): Promise<AnalyticsOverview> {
    try {
      const res = await fetch(`${API_BASE}/api/analytics/overview`, { cache: 'no-store' });
      if (res.ok) return await res.json();
    } catch {}
    return {
      images_indexed: 0,
      ohrc_count: 0,
      tmc_count: 0,
      iirs_count: 0,
      matches_processed: 0,
      avg_correspondence_rate: 0,
      avg_rmse_px: 0,
      active_analyses: 0
    };
  },

  async listJobs(): Promise<any[]> {
    try {
      const res = await fetch(`${API_BASE}/api/jobs`, { cache: 'no-store' });
      if (res.ok) return await res.json();
    } catch {}
    return [];
  },

  async getJobs(): Promise<any[]> {
    return this.listJobs();
  },

  async getJob(jobId: string): Promise<any> {
    return this.getCorrespondence(jobId);
  },

  async ingestDataset(formData: FormData): Promise<any> {
    const res = await fetch(`${API_BASE}/api/datasets/ingest`, {
      method: 'POST',
      body: formData,
    });
    if (!res.ok) {
      const err = await res.json().catch(() => ({ detail: 'Ingestion failed' }));
      throw new Error(err.detail || 'Dataset ingestion failed');
    }
    return await res.json();
  },

  async scanRawStorage(): Promise<any> {
    const res = await fetch(`${API_BASE}/api/ingest/scan-raw`, {
      method: 'POST',
    });
    if (!res.ok) throw new Error('Failed to scan raw storage');
    return await res.json();
  },

  async search(query: string): Promise<any> {
    const res = await fetch(`${API_BASE}/api/search?q=${encodeURIComponent(query)}`, { cache: 'no-store' });
    if (!res.ok) throw new Error('Search failed');
    return await res.json();
  },

  async generateReport(payload: any): Promise<any> {
    const res = await fetch(`${API_BASE}/api/reports/generate`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(payload),
    });
    if (!res.ok) throw new Error('Failed to generate report');
    return await res.json();
  },

  getExportUrl(jobId: string): string {
    return `${API_BASE}/api/export/${jobId}`;
  },
};
