import { BestMandiRequest, BestMandiRecommendation, AlternativeMandiOption } from '../../types/recommendation.types';
import { MOCK_BEST_MANDI_RECOMMENDATION } from '../../mocks/recommendationData';
import { apiClient } from '../api/client';

export interface IRecommendationService {
  getBestMandi(request: BestMandiRequest): Promise<BestMandiRecommendation>;
  compareMandis(request: BestMandiRequest): Promise<AlternativeMandiOption[]>;
  calculateEstimatedNetReturn(
    quantityQuintal: number,
    expectedPricePerQuintal: number,
    distanceKm: number,
    toll: number
  ): { gross: number; deductions: number; net: number; netPerQuintal: number };
}

export class MockRecommendationService implements IRecommendationService {
  async getBestMandi(request: BestMandiRequest): Promise<BestMandiRecommendation> {
    await new Promise((r) => setTimeout(r, 150));

    const qty = request.quantityQuintal > 0 ? request.quantityQuintal : 20;
    
    // Dynamically adjust financial metrics according to quantity
    const basePrice = 2200;
    const grossIncome = qty * basePrice;
    const freightRatePerKm = 22; // ~ ₹22/km for 85km Bolero/407
    const transportCost = Math.round(85 * freightRatePerKm);
    const loadingUnloadingCost = Math.round(qty * 30);
    const transitSpoilageCost = Math.round(grossIncome * 0.04);
    const totalDeductions = transportCost + loadingUnloadingCost + transitSpoilageCost;
    const estimatedNetProfit = grossIncome - totalDeductions;
    const netReturnPerQuintal = Math.round(estimatedNetProfit / qty);

    const winner: AlternativeMandiOption = {
      ...MOCK_BEST_MANDI_RECOMMENDATION.winnerMandi,
      expectedPricePerQuintal: basePrice,
      transportCost,
      loadingUnloadingCost,
      transitSpoilageCost,
      totalCost: totalDeductions,
      expectedNetProfit: estimatedNetProfit,
      netProfitPerQuintal: netReturnPerQuintal,
    };

    const alternatives: AlternativeMandiOption[] = MOCK_BEST_MANDI_RECOMMENDATION.alternatives.map((alt) => {
      const altGross = qty * alt.expectedPricePerQuintal;
      const altFreight = Math.round(alt.distanceKm * freightRatePerKm);
      const altLoading = Math.round(qty * 30);
      const altSpoilage = Math.round(altGross * (alt.distanceKm > 70 ? 0.04 : 0.025));
      const altTotalCost = altFreight + altLoading + altSpoilage;
      const altNet = altGross - altTotalCost;
      return {
        ...alt,
        transportCost: altFreight,
        loadingUnloadingCost: altLoading,
        transitSpoilageCost: altSpoilage,
        totalCost: altTotalCost,
        expectedNetProfit: altNet,
        netProfitPerQuintal: Math.round(altNet / qty),
      };
    });

    const localMandi = alternatives.find((a) => a.mandiId === 'raipur') || alternatives[2];
    const profitVarianceVsLocal = estimatedNetProfit - localMandi.expectedNetProfit;

    return {
      ...MOCK_BEST_MANDI_RECOMMENDATION,
      winnerMandi: winner,
      alternatives,
      grossIncome,
      totalDeductions,
      estimatedNetProfit,
      netReturnPerQuintal,
      profitVarianceVsLocal: profitVarianceVsLocal > 0 ? profitVarianceVsLocal : 6500,
      isGuaranteedIncome: false,
      isSampleData: true,
      calculatedAt: new Date().toLocaleDateString('hi-IN', {
        day: '2-digit',
        month: '2-digit',
        year: 'numeric',
        hour: '2-digit',
        minute: '2-digit',
      }),
    };
  }

  async compareMandis(request: BestMandiRequest): Promise<AlternativeMandiOption[]> {
    const rec = await this.getBestMandi(request);
    return rec.alternatives;
  }

  calculateEstimatedNetReturn(
    quantityQuintal: number,
    expectedPricePerQuintal: number,
    distanceKm: number,
    toll: number = 0
  ) {
    const gross = quantityQuintal * expectedPricePerQuintal;
    const transport = Math.round(distanceKm * 22) + toll;
    const handling = Math.round(quantityQuintal * 30);
    const transitLoss = Math.round(gross * (distanceKm > 60 ? 0.04 : 0.02));
    const deductions = transport + handling + transitLoss;
    const net = gross - deductions;
    return {
      gross,
      deductions,
      net,
      netPerQuintal: Math.round(net / (quantityQuintal || 1)),
    };
  }
}

export class HttpRecommendationService implements IRecommendationService {
  async getBestMandi(request: BestMandiRequest): Promise<BestMandiRecommendation> {
    return apiClient.post<BestMandiRecommendation>('/api/recommendations/best-mandi', request);
  }

  async compareMandis(request: BestMandiRequest): Promise<AlternativeMandiOption[]> {
    return apiClient.post<AlternativeMandiOption[]>('/api/recommendations/compare', request);
  }

  calculateEstimatedNetReturn(
    quantityQuintal: number,
    expectedPricePerQuintal: number,
    distanceKm: number,
    toll: number = 0
  ) {
    const gross = quantityQuintal * expectedPricePerQuintal;
    const deductions = distanceKm * 22 + toll + quantityQuintal * 30;
    const net = gross - deductions;
    return {
      gross,
      deductions,
      net,
      netPerQuintal: Math.round(net / (quantityQuintal || 1)),
    };
  }
}
