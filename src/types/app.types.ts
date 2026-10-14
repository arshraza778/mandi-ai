export interface WeatherForecastDay {
  date: string;
  dayLabel: string;
  dayLabelHindi: string;
  tempMax: number;
  tempMin: number;
  condition: string;
  conditionHindi: string;
  rainProbability: number;
  humidity: number;
  windSpeedKmH: number;
  icon: string;
  advisoryNote: string;
}

export interface WeatherData {
  city: string;
  state: string;
  currentTemp: number;
  conditionText: string;
  conditionHindi: string;
  humidity: number;
  windSpeedKmH: number;
  isHarvestFavorable: boolean;
  harvestFavorableText: string;
  nextRainHoursText: string;
  threeDayForecast: WeatherForecastDay[];
  weeklyForecast: WeatherForecastDay[];
  sprayingAdvisory: {
    status: 'safe' | 'caution' | 'unsafe';
    recommendation: string;
  };
}

export interface GovernmentScheme {
  id: string;
  title: string;
  titleHindi: string;
  category: 'subsidy' | 'insurance' | 'credit' | 'infrastructure' | 'irrigation';
  categoryLabel: string;
  grantAmount: string;
  shortDescription: string;
  shortDescriptionHindi: string;
  eligibility: string[];
  documentsRequired: string[];
  officialPortalUrl: string;
  isPopular: boolean;
}

export interface FertilizerRecommendation {
  cropName: string;
  farmAreaAcres: number;
  soilType: 'clay' | 'loam' | 'sandy' | 'black_cotton';
  ureaKg: number;
  dapKg: number;
  mopKg: number;
  zincSulphateKg: number;
  ureaBags: number;
  dapBags: number;
  mopBags: number;
  estimatedCost: number;
  applicationSchedule: {
    stage: string;
    stageHindi: string;
    fertilizerDose: string;
    waterRequirement: string;
  }[];
}

export interface CropDisease {
  id: string;
  cropName: string;
  diseaseName: string;
  diseaseNameHindi: string;
  symptoms: string[];
  severity: 'low' | 'medium' | 'high';
  organicTreatment: string;
  chemicalTreatment: string;
  preventativeMeasures: string[];
  imageUrl: string;
}

export type UserRole = 'farmer' | 'supervisor' | 'admin';

export interface UserProfile {
  id: string;
  name: string;
  phone: string;
  village: string;
  district: string;
  state: string;
  preferredLanguage: 'hi' | 'en' | 'cg';
  role: UserRole;
  primaryCrops: string[];
  landAreaAcres: number;
}

export interface OfflineCacheStatus {
  isOnline: boolean;
  lastSyncedTimestamp: string;
  cachedMandiCount: number;
  cachedCropsCount: number;
  offlineReceiptsPending: number;
}
