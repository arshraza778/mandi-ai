import { CropDisease } from '../../types/app.types';
import { MOCK_CROP_DISEASES } from '../../mocks/otherServicesData';
import { apiClient } from '../api/client';

export interface ICropCareService {
  getDiseases(cropName?: string): Promise<CropDisease[]>;
  getDiseaseById(id: string): Promise<CropDisease | undefined>;
}

export class MockCropCareService implements ICropCareService {
  async getDiseases(cropName?: string): Promise<CropDisease[]> {
    await new Promise((r) => setTimeout(r, 70));
    if (!cropName || cropName === 'all') {
      return MOCK_CROP_DISEASES;
    }
    return MOCK_CROP_DISEASES.filter((d) => d.cropName.toLowerCase().includes(cropName.toLowerCase()));
  }

  async getDiseaseById(id: string): Promise<CropDisease | undefined> {
    return MOCK_CROP_DISEASES.find((d) => d.id === id);
  }
}

export class HttpCropCareService implements ICropCareService {
  async getDiseases(cropName?: string): Promise<CropDisease[]> {
    return apiClient.get<CropDisease[]>('/api/cropcare/diseases', { crop: cropName });
  }

  async getDiseaseById(id: string): Promise<CropDisease | undefined> {
    return apiClient.get<CropDisease>(`/api/cropcare/diseases/${id}`);
  }
}
