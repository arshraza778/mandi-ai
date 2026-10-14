export interface BestMandiRequest {
  cropId: string;
  cropName: string;
  cropVariety: string;
  quantityQuintal: number;
  farmerLocation: string;
  farmerPincode: string;
  targetDate: string;
  vehicleType?: 'bolero_pickup' | 'tata_407' | 'tractor_trolley' | 'mini_truck';
}

export interface AlternativeMandiOption {
  rank: number;
  mandiId: string;
  mandiName: string;
  mandiNameHindi: string;
  district: string;
  districtHindi: string;
  badgeNote: string;
  distanceKm: number;
  expectedPricePerQuintal: number;
  totalCost: number;
  expectedNetProfit: number;
  netProfitPerQuintal: number;
  profitRatioPercent: number;
  statusRating: 'best' | 'good' | 'moderate' | 'low';
  ratingLabel: string;
  transportCost: number;
  loadingUnloadingCost: number;
  transitSpoilageCost: number;
  recommendedVehicle: string;
  bestWeighingTime: string;
  roadCondition: string;
  tollCost: number;
  transitHours: string;
  contactNumber: string;
}

export interface BestMandiRecommendation {
  winnerMandi: AlternativeMandiOption;
  alternatives: AlternativeMandiOption[];
  grossIncome: number;
  totalDeductions: number;
  estimatedNetProfit: number;
  netReturnPerQuintal: number;
  profitVarianceVsLocal: number;
  localMandiName: string;
  grossMarginRatioPercent: number;
  aiConclusion: string;
  aiConclusionHindi: string;
  recommendedPackaging: string;
  recommendedPackagingHindi: string;
  packagingSavingDetail: string;
  isGuaranteedIncome: false; // explicitly typed false to avoid misleading farmers
  isSampleData: boolean;
  calculatedAt: string;
}
