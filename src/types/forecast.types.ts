export interface HistoricalPricePoint {
  date: string;
  monthLabel: string;
  actualPrice: number;
  arrivalsQuintal: number;
}

export interface ForecastDailyPoint {
  date: string;
  dayHindi: string;
  dayShort: string;
  formattedDate: string;
  forecastPrice: number;
  minRange: number;
  maxRange: number;
  isPeak: boolean;
  confidencePercent: number;
}

export interface ForecastMetrics {
  mae: number;
  rmse: number;
  mapePercent: number;
  modelName: string;
  accuracyPercent: number;
  confidenceLevel: string;
}

export interface CropForecastResponse {
  cropId: string;
  cropName: string;
  cropVariety: string;
  mandiId: string;
  mandiName: string;
  timeRange: '1m' | '3m' | '6m' | '1y';
  averagePrice: number;
  minPrice: number;
  minPriceDate: string;
  maxPrice: number;
  maxPriceDate: string;
  totalArrivals: number;
  predicted7DayAvgPrice: number;
  priceGrowthPercent: number;
  confidenceRange: {
    min: number;
    max: number;
  };
  marketDriverExplanation: string;
  farmerAdvisory: string;
  metrics: ForecastMetrics;
  historicalSeries: HistoricalPricePoint[];
  dailyForecastList: ForecastDailyPoint[];
  qualityClassification: {
    grade: string;
    firmnessPercent: number;
    storageDays: string;
    imageDescription: string;
  };
  mandiYardActivity: {
    auctionTiming: string;
    peakBiddingWindow: string;
  };
  isSampleData: boolean;
}
