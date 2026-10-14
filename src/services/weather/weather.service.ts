import { WeatherData } from '../../types/app.types';
import { MOCK_WEATHER_DATA } from '../../mocks/otherServicesData';
import { apiClient } from '../api/client';

export interface IWeatherService {
  getWeather(city?: string): Promise<WeatherData>;
}

export class MockWeatherService implements IWeatherService {
  async getWeather(city: string = 'Raipur'): Promise<WeatherData> {
    await new Promise((r) => setTimeout(r, 80));
    return { ...MOCK_WEATHER_DATA, city };
  }
}

export class HttpWeatherService implements IWeatherService {
  async getWeather(city: string = 'Raipur'): Promise<WeatherData> {
    return apiClient.get<WeatherData>('/api/weather', { city });
  }
}
