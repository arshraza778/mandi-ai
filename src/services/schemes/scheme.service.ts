import { GovernmentScheme } from '../../types/app.types';
import { MOCK_GOVERNMENT_SCHEMES } from '../../mocks/otherServicesData';
import { apiClient } from '../api/client';

export interface ISchemeService {
  getSchemes(category?: string, searchQuery?: string): Promise<GovernmentScheme[]>;
  getSchemeById(id: string): Promise<GovernmentScheme | undefined>;
}

export class MockSchemeService implements ISchemeService {
  async getSchemes(category?: string, searchQuery?: string): Promise<GovernmentScheme[]> {
    await new Promise((r) => setTimeout(r, 90));
    let schemes = [...MOCK_GOVERNMENT_SCHEMES];

    if (category && category !== 'all') {
      schemes = schemes.filter((s) => s.category === category);
    }

    if (searchQuery && searchQuery.trim() !== '') {
      const q = searchQuery.toLowerCase().trim();
      schemes = schemes.filter(
        (s) =>
          s.title.toLowerCase().includes(q) ||
          s.titleHindi.includes(q) ||
          s.shortDescription.toLowerCase().includes(q) ||
          s.shortDescriptionHindi.includes(q)
      );
    }

    return schemes;
  }

  async getSchemeById(id: string): Promise<GovernmentScheme | undefined> {
    return MOCK_GOVERNMENT_SCHEMES.find((s) => s.id === id);
  }
}

export class HttpSchemeService implements ISchemeService {
  async getSchemes(category?: string, searchQuery?: string): Promise<GovernmentScheme[]> {
    return apiClient.get<GovernmentScheme[]>('/api/schemes', { category, q: searchQuery });
  }

  async getSchemeById(id: string): Promise<GovernmentScheme | undefined> {
    return apiClient.get<GovernmentScheme>(`/api/schemes/${id}`);
  }
}
