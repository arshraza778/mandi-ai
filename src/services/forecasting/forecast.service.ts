import { CropForecastResponse, ForecastMetrics } from '../../types/forecast.types';
import { MOCK_TOMATO_FORECAST } from '../../mocks/forecastData';
import { apiClient } from '../api/client';

export interface IForecastService {
  getForecast(cropId: string, mandiId: string, timeRange?: '1m' | '3m' | '6m' | '1y'): Promise<CropForecastResponse>;
  getForecastMetrics(cropId: string): Promise<ForecastMetrics>;
}

export class MockForecastService implements IForecastService {
  async getForecast(
    cropId: string = 'tomato',
    mandiId: string = 'rajnandgaon',
    timeRange: '1m' | '3m' | '6m' | '1y' = '6m'
  ): Promise<CropForecastResponse> {
    await new Promise((r) => setTimeout(r, 120));

    // Base mock
    let forecast = { ...MOCK_TOMATO_FORECAST, timeRange, cropId, mandiId };

    if (cropId === 'onion') {
      forecast.cropName = 'Onion (प्याज - नासिक रेड)';
      forecast.averagePrice = 1600;
      forecast.minPrice = 1100;
      forecast.maxPrice = 2100;
      forecast.predicted7DayAvgPrice = 1680;
      forecast.priceGrowthPercent = 4;
      forecast.confidenceRange = { min: 1550, max: 1820 };
      forecast.marketDriverExplanation = 'महाराष्ट्र की लासलगांव और पिंपलगांव मंडियों से नई खरीफ प्याज की आवक सामान्य बनी हुई है। कीमतें अगले 7 दिन स्थिर रहने की 88% संभावना है।';
      forecast.farmerAdvisory = 'कंद को अच्छी तरह सुखाकर हवादार भंडारगृह में रखें, यदि भाव ₹1,800 पार करे तभी मंडी लाएं।';
    } else if (cropId === 'potato') {
      forecast.cropName = 'Potato (आलू - ज्योति)';
      forecast.averagePrice = 1450;
      forecast.minPrice = 1050;
      forecast.maxPrice = 1850;
      forecast.predicted7DayAvgPrice = 1480;
      forecast.priceGrowthPercent = -2;
      forecast.confidenceRange = { min: 1390, max: 1590 };
      forecast.marketDriverExplanation = 'उत्तर प्रदेश और पंजाब के शीतगृहों (Cold Storage) से भारी निकासी के चलते आपूर्ति प्रचुर है। कीमतों में हल्की नरमी की संभावना है।';
      forecast.farmerAdvisory = 'ताजा खेत से निकले आलू को तुरंत नजदीकी स्थानीय मंडी में ग्रेडिंग करके बेचें।';
    } else if (cropId === 'wheat') {
      forecast.cropName = 'Wheat (गेहूं - शरबती)';
      forecast.averagePrice = 2100;
      forecast.minPrice = 1850;
      forecast.maxPrice = 2500;
      forecast.predicted7DayAvgPrice = 2220;
      forecast.priceGrowthPercent = 5;
      forecast.confidenceRange = { min: 2150, max: 2340 };
      forecast.marketDriverExplanation = 'आटा मिलों और सहकारी संस्थाओं द्वारा सक्रिय खरीद जारी रहने से गेहूं के भाव में मजबूत आधार बना हुआ है।';
      forecast.farmerAdvisory = 'नमी 12% से कम रखें ताकि मंडी में ग्रेड-A का उच्चतम समर्थन मूल्य अथवा प्रीमियम मिल सके।';
    }

    return forecast;
  }

  async getForecastMetrics(cropId: string): Promise<ForecastMetrics> {
    return MOCK_TOMATO_FORECAST.metrics;
  }
}

export class HttpForecastService implements IForecastService {
  async getForecast(
    cropId: string,
    mandiId: string,
    timeRange: '1m' | '3m' | '6m' | '1y' = '6m'
  ): Promise<CropForecastResponse> {
    return apiClient.get<CropForecastResponse>('/api/forecast', {
      cropId,
      mandiId,
      timeRange,
    });
  }

  async getForecastMetrics(cropId: string): Promise<ForecastMetrics> {
    return apiClient.get<ForecastMetrics>(`/api/forecast/metrics/${cropId}`);
  }
}
