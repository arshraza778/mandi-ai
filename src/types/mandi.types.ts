export type CommodityCategory = 'all' | 'vegetable' | 'cereal' | 'pulse' | 'oilseed' | 'other';

export interface MandiRateRecord {
  id: string;
  serialNo: number;
  commodity: string;
  commodityHindi: string;
  variety: string;
  category: CommodityCategory;
  minPrice: number;
  maxPrice: number;
  modalPrice: number;
  priceChange: number; // e.g. +150, -40
  priceChangePercent?: number;
  arrivalsQuintal: number;
  mandiName: string;
  mandiNameHindi: string;
  yardName: string;
  district: string;
  state: string;
  dataSource: string;
  isLive: boolean;
  lastUpdated: string;
  trend: 'up' | 'down' | 'stable' | 'strong' | 'high_demand';
  iconType: 'nutrition' | 'eco' | 'spa' | 'grass' | 'grain' | 'potted_plant';
}

export interface MandiRateFilterParams {
  state: string;
  district: string;
  mandiId: string;
  date: string;
  category: CommodityCategory;
  searchQuery?: string;
  page?: number;
  pageSize?: number;
  sortBy?: 'modalPrice' | 'arrivalsQuintal' | 'commodity' | 'lastUpdated';
  sortOrder?: 'asc' | 'desc';
}

export interface MandiRateResponse {
  records: MandiRateRecord[];
  totalRecords: number;
  page: number;
  pageSize: number;
  totalPages: number;
  summary: {
    activeMandisCount: number;
    totalArrivalsToday: number;
    highestModalPrice: {
      price: number;
      commodity: string;
    };
    serverLatencySec: number;
    lastSyncedAt: string;
  };
  isSampleData: boolean;
}

export interface StateDistrictMandiOption {
  id: string;
  name: string;
  hindiName: string;
  districts: {
    id: string;
    name: string;
    hindiName: string;
    mandis: {
      id: string;
      name: string;
      hindiName: string;
      code: string;
      distanceKmFromRaipur?: number;
    }[];
  }[];
}
