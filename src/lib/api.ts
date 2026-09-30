import { DatasetItem, RegistrationJob, RegistrationConfig, RegistrationMetrics, CorrespondencePoint } from '@/types/api';
import { DEFAULT_DATASETS } from './defaultDatasets';

const API_BASE = process.env.NEXT_PUBLIC_API_URL || 'http://127.0.0.1:8000';

export const apiClient = {
  async getHealth(): Promise<{ status: string; pipeline_ready: boolean }> {
    try {
      const res = await fetch(`${API_BASE}/api/health`, { cache: 'no-store' });
      if (!res.ok) throw new Error('API offline');
      return await res.json();
    } catch {
      return { status: 'STANDALONE_HYBRID', pipeline_ready: true };
    }
  },

  async getDatasets(): Promise<DatasetItem[]> {
    try {
      const res = await fetch(`${API_BASE}/api/datasets`, { cache: 'no-store' });
      if (!res.ok) throw new Error('Failed to load datasets');
      const data = await res.json();
      return data.length > 0 ? data : DEFAULT_DATASETS;
    } catch {
      return DEFAULT_DATASETS;
    }
  },

  async getDataset(id: string): Promise<DatasetItem | undefined> {
    try {
      const res = await fetch(`${API_BASE}/api/datasets/${id}`, { cache: 'no-store' });
      if (res.ok) return await res.json();
    } catch {}
    return DEFAULT_DATASETS.find((d) => d.id === id);
  },

  async createJob(sourceId: string, referenceId: string, config?: RegistrationConfig): Promise<RegistrationJob> {
    const res = await fetch(`${API_BASE}/api/registration/create`, {
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
          ransac_reproj_threshold_px: 3.0,
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
      throw new Error(err.detail || 'Failed to create registration job');
    }
    return await res.json();
  },

  async getJob(jobId: string): Promise<RegistrationJob> {
    const res = await fetch(`${API_BASE}/api/registration/${jobId}`, { cache: 'no-store' });
    if (!res.ok) throw new Error(`Job ${jobId} not found`);
    return await res.json();
  },

  async listJobs(): Promise<RegistrationJob[]> {
    try {
      const res = await fetch(`${API_BASE}/api/jobs`, { cache: 'no-store' });
      if (res.ok) return await res.json();
    } catch {}
    return [];
  },

  async uploadRaster(formData: FormData): Promise<DatasetItem> {
    const res = await fetch(`${API_BASE}/api/images/upload`, {
      method: 'POST',
      body: formData,
    });
    if (!res.ok) {
      const err = await res.json().catch(() => ({ detail: 'Upload failed' }));
      throw new Error(err.detail || 'Image upload failed');
    }
    return await res.json();
  },

  getExportUrl(jobId: string): string {
    return `${API_BASE}/api/registration/${jobId}/export`;
  },
};
