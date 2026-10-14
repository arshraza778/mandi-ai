import { MandiRateFilterParams, MandiRateResponse, StateDistrictMandiOption } from '../../types/mandi.types';
import { INITIAL_MANDI_RECORDS, STATES_AND_MANDIS } from '../../mocks/mandiData';
import { apiClient } from '../api/client';

export interface IMandiService {
  getMarketPrices(filters: MandiRateFilterParams): Promise<MandiRateResponse>;
  getMandiDetails(mandiId: string): Promise<any>;
  getAvailableCrops(): Promise<{ id: string; name: string; nameHindi: string; category: string }[]>;
  getAvailableLocations(): Promise<StateDistrictMandiOption[]>;
  exportPricesCsv(filters: MandiRateFilterParams): Promise<string>;
}

export class MockMandiService implements IMandiService {
  async getMarketPrices(filters: MandiRateFilterParams): Promise<MandiRateResponse> {
    // Artificial small delay for realistic UX feedback
    await new Promise((r) => setTimeout(r, 120));

    let filtered = [...INITIAL_MANDI_RECORDS];

    // Filter by category
    if (filters.category && filters.category !== 'all') {
      filtered = filtered.filter((r) => r.category === filters.category);
    }

    // Filter by district
    if (filters.district && filters.district !== 'all') {
      filtered = filtered.filter(
        (r) => r.district.toLowerCase().includes(filters.district.toLowerCase())
      );
    }

    // Filter by mandi
    if (filters.mandiId && filters.mandiId !== 'all') {
      filtered = filtered.filter(
        (r) =>
          r.id.toLowerCase().includes(filters.mandiId.toLowerCase()) ||
          r.mandiName.toLowerCase().includes(filters.mandiId.toLowerCase())
      );
    }

    // Search query
    if (filters.searchQuery && filters.searchQuery.trim() !== '') {
      const q = filters.searchQuery.toLowerCase().trim();
      filtered = filtered.filter(
        (r) =>
          r.commodity.toLowerCase().includes(q) ||
          r.commodityHindi.includes(q) ||
          r.mandiName.toLowerCase().includes(q) ||
          r.mandiNameHindi.includes(q) ||
          r.variety.toLowerCase().includes(q)
      );
    }

    const pageSize = filters.pageSize || 10;
    const page = filters.page || 1;
    const totalRecords = filtered.length;
    const totalPages = Math.ceil(totalRecords / pageSize) || 1;
    const paginated = filtered.slice((page - 1) * pageSize, page * pageSize);

    const highestPrice = filtered.reduce(
      (max, r) => (r.modalPrice > max.price ? { price: r.modalPrice, commodity: r.commodityHindi } : max),
      { price: 0, commodity: 'N/A' }
    );

    const totalArrivals = filtered.reduce((sum, r) => sum + r.arrivalsQuintal, 0);

    return {
      records: paginated,
      totalRecords,
      page,
      pageSize,
      totalPages,
      summary: {
        activeMandisCount: 14,
        totalArrivalsToday: totalArrivals > 0 ? totalArrivals : 1165,
        highestModalPrice: highestPrice.price > 0 ? highestPrice : { price: 4400, commodity: 'चना' },
        serverLatencySec: 0.24,
        lastSyncedAt: '13-10-2026, 11:45 AM',
      },
      isSampleData: true,
    };
  }

  async getMandiDetails(mandiId: string): Promise<any> {
    const record = INITIAL_MANDI_RECORDS.find((r) => r.id === mandiId || r.mandiName.toLowerCase().includes(mandiId.toLowerCase()));
    return record || INITIAL_MANDI_RECORDS[0];
  }

  async getAvailableCrops() {
    return [
      { id: 'tomato', name: 'Tomato', nameHindi: 'टमाटर', category: 'vegetable' },
      { id: 'onion', name: 'Onion', nameHindi: 'प्याज', category: 'vegetable' },
      { id: 'potato', name: 'Potato', nameHindi: 'आलू', category: 'vegetable' },
      { id: 'wheat', name: 'Wheat', nameHindi: 'गेहूँ', category: 'cereal' },
      { id: 'paddy', name: 'Paddy', nameHindi: 'धान', category: 'cereal' },
      { id: 'chana', name: 'Gram / Chana', nameHindi: 'चना', category: 'pulse' },
      { id: 'mustard', name: 'Mustard', nameHindi: 'सरसों', category: 'oilseed' },
      { id: 'soybean', name: 'Soybean', nameHindi: 'सोयाबीन', category: 'oilseed' },
    ];
  }

  async getAvailableLocations(): Promise<StateDistrictMandiOption[]> {
    return STATES_AND_MANDIS;
  }

  async exportPricesCsv(filters: MandiRateFilterParams): Promise<string> {
    const res = await this.getMarketPrices({ ...filters, pageSize: 1000 });
    const headers = [
      'क्र.सं.',
      'फसल (Commodity)',
      'किस्म (Variety)',
      'न्यूनतम भाव (₹/क्वि.)',
      'अधिकतम भाव (₹/क्वि.)',
      'मोडल भाव (₹/क्वि.)',
      'आवक (क्विंतल)',
      'मंडी का नाम',
      'डेटा स्रोत',
      'अंतिम अपडेट',
    ];
    const rows = res.records.map((r, i) => [
      i + 1,
      `"${r.commodityHindi} (${r.commodity})"`,
      `"${r.variety}"`,
      r.minPrice,
      r.maxPrice,
      r.modalPrice,
      r.arrivalsQuintal,
      `"${r.mandiNameHindi} (${r.mandiName})"`,
      `"${r.dataSource}"`,
      `"${r.lastUpdated}"`,
    ]);

    return [headers.join(','), ...rows.map((row) => row.join(','))].join('\n');
  }
}

export class HttpMandiService implements IMandiService {
  async getMarketPrices(filters: MandiRateFilterParams): Promise<MandiRateResponse> {
    return apiClient.get<MandiRateResponse>('/api/mandi/rates', {
      state: filters.state,
      district: filters.district,
      mandiId: filters.mandiId,
      date: filters.date,
      category: filters.category,
      q: filters.searchQuery,
      page: filters.page,
      pageSize: filters.pageSize,
    });
  }

  async getMandiDetails(mandiId: string): Promise<any> {
    return apiClient.get<any>(`/api/mandi/${mandiId}`);
  }

  async getAvailableCrops() {
    return apiClient.get<{ id: string; name: string; nameHindi: string; category: string }[]>('/api/mandi/crops');
  }

  async getAvailableLocations(): Promise<StateDistrictMandiOption[]> {
    return apiClient.get<StateDistrictMandiOption[]>('/api/mandi/locations');
  }

  async exportPricesCsv(filters: MandiRateFilterParams): Promise<string> {
    return apiClient.get<string>('/api/mandi/export-csv', {
      state: filters.state,
      district: filters.district,
      mandiId: filters.mandiId,
      category: filters.category,
    });
  }
}
