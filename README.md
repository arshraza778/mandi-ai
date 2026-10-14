# MandiMind AI — Agricultural Price Intelligence & Farmer Support Platform

MandiMind AI is a production-grade React and TypeScript frontend built on Vite, preserving the exact visual identity, agricultural green theme, card hierarchy, typography, and AGMARKNET table styling designed in Google Stitch.

---

## 🌾 Core Implemented Screens

1. **Farmer Home Dashboard (`/`)**:
   - Live location & weather micro-bar with AGMARKNET server status.
   - Hero section with agricultural backdrop and AI Omnibar (voice search, text input, quick crop tags).
   - "आज का AI मंडी सुझाव" (AI Pick) card featuring net return calculations and transport deduction breakdown.
   - Live market news ticker strip.
   - 6 Quick-Access service cards.
   - Today's major mandi rates with 5 crops and dynamic sparkline graphs.
   - Two-column deep dive: Mandi comparison table + 3-day weather & expert video advisory.
   - Offline-First readiness banner and Kisan Call Centre hotline (1800-180-1551).

2. **Mandi Price Report — AGMARKNET Style (`/mandi-rates`)**:
   - Filter console: State, District, Mandi Yard, and Date pickers.
   - Commodity category pills (Vegetables, Cereals, Pulses, Oilseeds, Others).
   - Structured AGMARKNET data table with min, max, and modal prices, daily arrivals, and price change indicators.
   - Real CSV report export and print actions.
   - Configurable pagination (10, 25, 50 rows per page).
   - Daily rate alert subscription.

3. **Best Mandi Recommendation — AI Engine (`/best-mandi`)**:
   - 5-step wizard progress tracker.
   - Dynamic crop quantity, location, and date inputs.
   - Winner Mandi showcase with net profit estimation (₹ 38,500 on 20 quintal tomato), donut gauge (87.5% gross margin ratio), and financial ledger deductions.
   - Speech synthesis audio explanation in Hindi ("मुझे बोलकर समझाएं").
   - Transit route preview (NH 53) with distance, toll, and optimal weighing time window.
   - 4-Mandi comparison table with relative profit variance bars and official disclaimer.
   - Logistics network vehicle booking.

4. **Price Forecasting and Historical Trends (`/market-trends`)**:
   - Prophet + LightGBM v4.2 model telemetry (MAE, RMSE, MAPE 6.8%).
   - Scalable SVG chart displaying historical prices, area fill, 95% confidence intervals, and 7-day predicted curve.
   - Interactive 1M, 3M, 6M, 1Y time-range toggles.
   - 7-day daily forecast calendar with peak detection (18 Oct peak price: ₹ 2,200 - ₹ 2,350).
   - Quality grading (Grade-A, 88% firmness) and mandi yard auction timing advisory.

5. **Additional Functional Modules**:
   - **Nearby Mandi Comparison (`/mandi-comparison`)**: Side-by-side economic ledger comparing diesel, toll, handling, and net returns.
   - **Weather Dashboard (`/weather`)**: 7-day temperature, humidity, wind speed, and safe pesticide spraying time-window advisory.
   - **Government Schemes (`/schemes`)**: PM-KISAN, PMFBY, KUSUM Solar Pump, Soil Health Card, and AIF loan subsidies with eligibility checklists.
   - **Fertilizer Calculator (`/fertilizer-and-pesticide`)**: NPK dosage calculator computing exact bags of Urea, DAP, and MOP based on acreage and soil type.
   - **Crop Care & Disease Advisory (`/crop-care`)**: Identification of Blight, Purple Blotch, and Yellow Rust with organic and chemical remedies.
   - **Bhashini Voice Assistant (`/voice-assistant`)**: Multilingual voice recognition and speech synthesis.
   - **Offline-First Synchronization (`/offline-sync`)**: Local storage caching, connection status, and manual synchronization trigger.
   - **Features Catalog (`/features`)**: System overview of all modules.

---

## 🛠️ Architecture & Service Layer

All page components interact strictly through typed service interfaces, decoupling the UI from data sources:

```
src/
├── types/                  # Typed contracts (Mandi, Recommendation, Forecast, Weather, Schemes)
├── services/
│   ├── api/client.ts       # Centralized HTTP client with error normalization and mock switch
│   ├── mandi/              # IMandiService (MockMandiService & HttpMandiService)
│   ├── recommendations/    # IRecommendationService (Economic calculation engine)
│   ├── forecasting/        # IForecastService (Prophet + LightGBM mock & API)
│   ├── weather/            # IWeatherService
│   ├── schemes/            # ISchemeService
│   ├── fertilizer/         # Fertilizer dosage calculator
│   ├── cropcare/           # ICropCareService
│   ├── voice/              # Web Speech Recognition + Web Speech Synthesis
│   ├── authentication/     # Role-based auth (Farmer, Supervisor, Administrator)
│   ├── sync/               # Local cache & offline sync
│   └── serviceRegistry.ts  # Central Dependency Injection container
├── locales/                # Hindi, English, and Chhattisgarhi translations
├── context/                # LanguageContext and auth state
├── components/
│   ├── layout/             # Header, Footer, master Layout
│   └── modals/             # Bhashini Voice Assistant modal, Language selector modal
└── features/               # Route-based page implementations
```

---

## 🔌 Future Backend & API Integration

### Switching from Mock to Real API
In `.env`:
```bash
# Set your real backend API URL
VITE_API_BASE_URL="https://api.yourdomain.com"

# Disable mock mode
VITE_USE_MOCK_API="false"
```

When `VITE_USE_MOCK_API="false"`, `serviceRegistry.ts` automatically instantiates `HttpMandiService`, `HttpRecommendationService`, `HttpForecastService`, etc., which send typed HTTP requests to:
- `GET /api/mandi/rates`
- `POST /api/recommendations/best-mandi`
- `GET /api/forecast?cropId=tomato&mandiId=rajnandgaon`
- `GET /api/weather?city=Raipur`
- `GET /api/schemes`

If a request fails, the UI surfaces a user-friendly error message with a retry action, rather than silently falling back to mock data.

---

## 👥 Role Support (Farmer, Supervisor, Admin)
The header includes a profile icon where users can switch between:
1. **किसान (Farmer)**: Consumer of recommendations, voice assistant, and mandi rates.
2. **सुपरवाइजर (Supervisor)**: Local mandi yard monitoring and data verification.
3. **प्रशासक (Administrator)**: Regional price intelligence and scheme oversight.
