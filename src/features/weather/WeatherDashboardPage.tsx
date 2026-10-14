import React, { useState, useEffect } from 'react';
import { services } from '../../services/serviceRegistry';
import { WeatherData } from '../../types/app.types';

export const WeatherDashboardPage: React.FC = () => {
  const [weather, setWeather] = useState<WeatherData | null>(null);
  const [selectedCity, setSelectedCity] = useState('Raipur');

  useEffect(() => {
    loadWeatherData();
  }, [selectedCity]);

  const loadWeatherData = async () => {
    const data = await services.weather.getWeather(selectedCity);
    setWeather(data);
  };

  if (!weather) {
    return <div className="p-12 text-center text-on-surface-variant">मौसम डेटा लोड हो रहा है...</div>;
  }

  return (
    <div className="max-w-[1280px] mx-auto px-4 md:px-margin-lg py-space-xl space-y-space-xl">
      {/* Page Header */}
      <div className="flex flex-col md:flex-row md:items-end justify-between gap-space-md">
        <div className="space-y-space-xs">
          <div className="inline-flex items-center gap-space-xs px-space-sm py-0.5 rounded-full bg-surface-variant text-on-surface font-label-sm text-label-sm uppercase tracking-wide">
            <span className="material-symbols-outlined text-[14px] text-surface-tint">cloud_sync</span>
            <span>कृषि मौसम विज्ञान (Agri-Meteorology)</span>
          </div>
          <h1 className="font-headline-lg text-headline-lg text-primary font-bold">
            मौसम पूर्वानुमान एवं कृषि सलाह
          </h1>
          <p className="font-body-md text-body-md text-on-surface-variant max-w-2xl">
            फसल कटाई, थ्रेसिंग और कीटनाशक छिड़काव की योजना बनाने हेतु तापमान, नमी, हवा और वर्षा का सटीक 7-दिवसीय विश्लेषण।
          </p>
        </div>

        {/* Location Selector */}
        <div className="flex items-center gap-2 bg-surface-container-lowest p-1.5 rounded-xl border border-surface-container shadow-sm">
          <span className="material-symbols-outlined text-secondary text-[20px] ml-2">location_on</span>
          <select
            value={selectedCity}
            onChange={(e) => setSelectedCity(e.target.value)}
            className="p-2 bg-transparent text-body-md font-semibold text-primary focus:outline-none cursor-pointer"
          >
            <option value="Raipur">रायपुर (Raipur)</option>
            <option value="Rajnandgaon">राजनांदगांव (Rajnandgaon)</option>
            <option value="Durg">दुर्ग (Durg)</option>
            <option value="Bilaspur">बिलासपुर (Bilaspur)</option>
            <option value="Jagdalpur">जगदलपुर (Jagdalpur)</option>
          </select>
        </div>
      </div>

      {/* Hero Weather Bento Row */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-gutter-md">
        {/* Current Weather Card (6 cols) */}
        <div className="lg:col-span-6 bg-gradient-to-br from-primary to-primary-container text-on-primary rounded-3xl p-space-xl shadow-lg relative overflow-hidden flex flex-col justify-between min-h-[260px]">
          <div className="flex items-start justify-between">
            <div>
              <span className="text-secondary-fixed font-label-md text-label-md font-semibold">
                वर्तमान मौसम • {weather.city}, {weather.state}
              </span>
              <h2 className="text-display-lg font-bold mt-1">{weather.currentTemp}°C</h2>
              <p className="text-body-md text-on-primary/90 mt-1">{weather.conditionHindi}</p>
            </div>
            <span className="material-symbols-outlined text-[72px] text-tertiary-fixed-dim">
              partly_cloudy_day
            </span>
          </div>

          <div className="grid grid-cols-3 gap-space-sm pt-space-md border-t border-on-primary/20 mt-space-md">
            <div>
              <span className="text-[11px] text-primary-fixed-dim block">आर्द्रता (Humidity)</span>
              <span className="font-title-md text-title-md font-bold">{weather.humidity}%</span>
            </div>
            <div>
              <span className="text-[11px] text-primary-fixed-dim block">हवा की गति (Wind)</span>
              <span className="font-title-md text-title-md font-bold">{weather.windSpeedKmH} किमी/घंटा</span>
            </div>
            <div>
              <span className="text-[11px] text-primary-fixed-dim block">वर्षा अनुमान</span>
              <span className="font-title-md text-title-md font-bold text-secondary-fixed">0% (शुष्क)</span>
            </div>
          </div>
        </div>

        {/* Spray & Harvest Advisory Card (6 cols) */}
        <div className="lg:col-span-6 bg-surface-container-lowest rounded-3xl p-space-xl shadow-sm border border-surface-container flex flex-col justify-between gap-space-md">
          <div className="space-y-space-xs">
            <div className="flex items-center justify-between">
              <span className="px-space-sm py-1 rounded-full bg-secondary-container text-on-secondary-container font-label-sm text-label-sm font-bold flex items-center gap-1">
                <span className="material-symbols-outlined text-[16px]">check_circle</span>
                <span>{weather.harvestFavorableText}</span>
              </span>
              <span className="text-label-sm text-label-sm text-outline">अगले 48 घंटे वर्षा नहीं</span>
            </div>
            <h3 className="font-headline-sm text-headline-sm text-primary font-bold mt-2">
              कीटनाशक व खाद छिड़काव सलाह
            </h3>
            <p className="font-body-md text-body-md text-on-surface-variant leading-relaxed bg-surface-container-low p-space-md rounded-2xl border border-surface-container">
              {weather.sprayingAdvisory.recommendation}
            </p>
          </div>

          <div className="flex items-center gap-space-sm text-body-sm text-secondary font-semibold">
            <span className="material-symbols-outlined text-[20px]">agriculture</span>
            <span>फसल तुड़ाई व मंडी परिवहन के लिए मौसम पूर्णतया अनुकूल है।</span>
          </div>
        </div>
      </div>

      {/* 7-Day Extended Forecast Strip */}
      <div className="bg-surface-container-lowest p-space-lg rounded-3xl shadow-sm border border-surface-container space-y-space-md">
        <h3 className="font-headline-sm text-headline-sm text-on-surface font-bold flex items-center gap-2">
          <span className="material-symbols-outlined text-primary text-[24px]">calendar_month</span>
          आगामी 7 दिनों का मौसम पूर्वानुमान
        </h3>

        <div className="grid grid-cols-2 sm:grid-cols-4 lg:grid-cols-7 gap-space-sm">
          {weather.weeklyForecast.map((day) => (
            <div
              key={day.date}
              className="p-space-sm rounded-2xl bg-surface-container-low hover:bg-surface-container transition-colors flex flex-col items-center text-center gap-1 border border-surface-container"
            >
              <span className="font-label-md text-label-md font-bold text-on-surface">
                {day.dayLabelHindi}
              </span>
              <span className="material-symbols-outlined text-[36px] text-tertiary-fixed-dim my-1">
                {day.icon}
              </span>
              <span className="font-title-md text-title-md font-bold text-primary">
                {day.tempMax}° / {day.tempMin}°
              </span>
              <span className="text-[11px] text-secondary font-medium">{day.conditionHindi}</span>
              <span className="text-[10px] text-outline mt-1">{day.advisoryNote}</span>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};
