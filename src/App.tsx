import React, { useEffect } from 'react';
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { LanguageProvider } from './context/LanguageContext';
import { AuthProvider } from './context/AuthContext';
import { Layout } from './components/layout/Layout';
import { testConnection } from './services/firebase/firebase';

// Core 4 Screens faithfully matching Stitch exports
import { HomeDashboard } from './features/dashboard/HomeDashboard';
import { MandiRatesPage } from './features/mandi-rates/MandiRatesPage';
import { BestMandiPage } from './features/best-mandi/BestMandiPage';
import { ForecastingPage } from './features/forecasting/ForecastingPage';

// Additional Modules
import { MandiComparisonPage } from './features/mandi-comparison/MandiComparisonPage';
import { WeatherDashboardPage } from './features/weather/WeatherDashboardPage';
import { SchemesPage } from './features/schemes/SchemesPage';
import { FertilizerPage } from './features/fertilizer/FertilizerPage';
import { CropCarePage } from './features/crop-care/CropCarePage';
import { VoiceAssistantPage } from './features/voice-assistant/VoiceAssistantPage';
import { OfflineSyncPage } from './features/offline/OfflineSyncPage';
import { FeaturesOverviewPage } from './features/overview/FeaturesOverviewPage';

export default function App() {
  useEffect(() => {
    // Validate Firestore connection on app boot
    testConnection();
  }, []);

  return (
    <AuthProvider>
      <LanguageProvider>
        <BrowserRouter>
          <Routes>
            <Route path="/" element={<Layout />}>
              <Route index element={<HomeDashboard />} />
              <Route path="mandi-rates" element={<MandiRatesPage />} />
              <Route path="best-mandi" element={<BestMandiPage />} />
              <Route path="market-trends" element={<ForecastingPage />} />
              <Route path="mandi-comparison" element={<MandiComparisonPage />} />
              <Route path="weather" element={<WeatherDashboardPage />} />
              <Route path="schemes" element={<SchemesPage />} />
              <Route path="fertilizer-and-pesticide" element={<FertilizerPage />} />
              <Route path="crop-care" element={<CropCarePage />} />
              <Route path="voice-assistant" element={<VoiceAssistantPage />} />
              <Route path="offline-sync" element={<OfflineSyncPage />} />
              <Route path="features" element={<FeaturesOverviewPage />} />
              <Route path="*" element={<Navigate to="/" replace />} />
            </Route>
          </Routes>
        </BrowserRouter>
      </LanguageProvider>
    </AuthProvider>
  );
}
