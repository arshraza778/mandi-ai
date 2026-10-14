import { apiClient } from './api/client';
import { IMandiService, MockMandiService, HttpMandiService } from './mandi/mandi.service';
import {
  IRecommendationService,
  MockRecommendationService,
  HttpRecommendationService,
} from './recommendations/recommendation.service';
import {
  IForecastService,
  MockForecastService,
  HttpForecastService,
} from './forecasting/forecast.service';
import { IWeatherService, MockWeatherService, HttpWeatherService } from './weather/weather.service';
import { ISchemeService, MockSchemeService, HttpSchemeService } from './schemes/scheme.service';
import { ICropCareService, MockCropCareService, HttpCropCareService } from './cropcare/cropcare.service';
import { FertilizerService, IFertilizerService } from './fertilizer/fertilizer.service';
import { voiceService, VoiceService } from './voice/voice.service';
import { authService, AuthService } from './authentication/auth.service';
import { syncService, SyncService } from './sync/sync.service';

export interface ServiceRegistry {
  mandi: IMandiService;
  recommendations: IRecommendationService;
  forecast: IForecastService;
  weather: IWeatherService;
  schemes: ISchemeService;
  cropCare: ICropCareService;
  fertilizer: IFertilizerService;
  voice: VoiceService;
  auth: AuthService;
  sync: SyncService;
}

function createServices(): ServiceRegistry {
  const isMock = apiClient.isMockModeEnabled();

  return {
    mandi: isMock ? new MockMandiService() : new HttpMandiService(),
    recommendations: isMock ? new MockRecommendationService() : new HttpRecommendationService(),
    forecast: isMock ? new MockForecastService() : new HttpForecastService(),
    weather: isMock ? new MockWeatherService() : new HttpWeatherService(),
    schemes: isMock ? new MockSchemeService() : new HttpSchemeService(),
    cropCare: isMock ? new MockCropCareService() : new HttpCropCareService(),
    fertilizer: new FertilizerService(),
    voice: voiceService,
    auth: authService,
    sync: syncService,
  };
}

export const services = createServices();
