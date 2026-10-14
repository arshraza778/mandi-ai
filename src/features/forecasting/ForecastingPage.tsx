import React, { useState, useEffect } from 'react';
import { Link, useOutletContext } from 'react-router-dom';
import { services } from '../../services/serviceRegistry';
import { CropForecastResponse } from '../../types/forecast.types';

export const ForecastingPage: React.FC = () => {
  const outletContext = useOutletContext<{ openVoiceModal?: () => void }>();

  const [selectedCrop, setSelectedCrop] = useState('tomato');
  const [selectedMandi, setSelectedMandi] = useState('rajnandgaon');
  const [selectedRange, setSelectedRange] = useState<'1m' | '3m' | '6m' | '1y'>('6m');
  const [forecastData, setForecastData] = useState<CropForecastResponse | null>(null);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    loadForecast();
  }, [selectedCrop, selectedMandi, selectedRange]);

  const loadForecast = async () => {
    setLoading(true);
    try {
      const data = await services.forecast.getForecast(selectedCrop, selectedMandi, selectedRange);
      setForecastData(data);
    } finally {
      setLoading(false);
    }
  };

  if (!forecastData) {
    return (
      <div className="max-w-[1280px] mx-auto p-12 text-center text-on-surface-variant">
        पूर्वानुमान डेटा लोड हो रहा है...
      </div>
    );
  }

  const { metrics, dailyForecastList } = forecastData;

  return (
    <div className="flex flex-col w-full">
      {/* Top Utility Context Bar */}
      <div className="w-full bg-surface-container-low border-b border-surface-container">
        <div className="max-w-[1280px] mx-auto px-4 md:px-margin-lg py-space-sm flex flex-wrap items-center justify-between gap-space-sm">
          <div className="flex items-center gap-space-sm text-on-surface-variant font-label-md text-label-md flex-wrap">
            <span className="flex items-center gap-1 font-semibold text-secondary">
              <span className="w-2 h-2 rounded-full bg-secondary animate-pulse"></span>
              AGMARKNET Real-Time Sync
            </span>
            <span className="text-outline-variant">•</span>
            <span>अंतिम अपडेट: आज 11:30 AM</span>
            <span className="text-outline-variant hidden sm:inline">•</span>
            <span className="hidden sm:inline bg-surface-container px-space-xs py-0.5 rounded text-on-surface font-label-sm text-label-sm">
              Prophet + LightGBM v4.2
            </span>
          </div>

          <div className="flex items-center gap-space-md">
            <div className="flex items-center gap-space-xs text-on-surface-variant font-label-md text-label-md">
              <span className="material-symbols-outlined text-[16px] text-surface-tint">verified_user</span>
              <span>95% कॉन्फिडेंस इंटरवल सक्रिय</span>
            </div>
            <button
              onClick={() => window.print()}
              className="flex items-center gap-1 text-primary font-label-md text-label-md hover:underline cursor-pointer"
              type="button"
            >
              <span className="material-symbols-outlined text-[16px]">file_download</span>
              <span>रिपोर्ट डाउनलोड करें (PDF)</span>
            </button>
          </div>
        </div>
      </div>

      {/* Main Content Layout */}
      <div className="max-w-[1280px] mx-auto w-full px-4 md:px-margin-lg py-space-lg space-y-space-lg">
        {/* Title & Breadcrumb Block */}
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-space-md">
          <div className="space-y-space-xs">
            <div className="flex items-center gap-space-xs text-on-surface-variant font-label-md text-label-md">
              <Link to="/" className="hover:text-primary cursor-pointer">मुख्य पृष्ठ (Home)</Link>
              <span className="material-symbols-outlined text-[14px]">chevron_right</span>
              <span className="hover:text-primary cursor-pointer">मंडी एनालिटिक्स</span>
              <span className="material-symbols-outlined text-[14px]">chevron_right</span>
              <span className="text-primary font-bold">मूल्य पूर्वानुमान</span>
            </div>
            <h1 className="font-headline-lg text-headline-lg text-primary tracking-tight flex items-center gap-space-xs">
              <span>मूल्य पूर्वानुमान एवं ऐतिहासिक विश्लेषण</span>
              <span className="material-symbols-outlined text-secondary text-[26px]">insights</span>
            </h1>
            <p className="font-body-md text-body-md text-on-surface-variant">
              मशीन लर्निंग (Prophet + LightGBM) द्वारा संचालित ऐतिहासिक आवक और 7-दिवसीय संभावित मंडी भाव का सटीक विश्लेषण।
            </p>
          </div>

          {/* Quick Action Controls */}
          <div className="flex items-center gap-space-sm self-start md:self-auto">
            <button
              onClick={() => outletContext?.openVoiceModal?.()}
              className="flex items-center gap-space-xs px-space-md py-2.5 rounded-full bg-secondary-container text-on-secondary-container hover:bg-secondary-fixed transition-colors font-label-md text-label-md shadow-sm cursor-pointer"
            >
              <span className="material-symbols-outlined text-[18px]">mic</span>
              <span>{forecastData.cropName.split(' ')[0]} का भाव पूछें</span>
            </button>
            <button
              onClick={() => {
                const text = `🌾 MandiMind AI मूल्य पूर्वानुमान: ${forecastData.cropName} का 7-दिवसीय अनुमानित भाव ₹${forecastData.predicted7DayAvgPrice}/क्विंटल (दायरा: ₹${forecastData.confidenceRange.min} - ₹${forecastData.confidenceRange.max})।`;
                window.open(`https://api.whatsapp.com/send?text=${encodeURIComponent(text)}`, '_blank');
              }}
              className="flex items-center justify-center w-10 h-10 rounded-full bg-surface-container hover:bg-surface-container-high transition-colors text-on-surface cursor-pointer"
              title="साझा करें"
            >
              <span className="material-symbols-outlined text-[20px]">share</span>
            </button>
          </div>
        </div>

        {/* Filter Control Bar */}
        <div className="bg-surface-container-lowest rounded-xl p-space-md shadow-sm border border-surface-container">
          <form className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-12 gap-space-md items-end" onSubmit={(e) => { e.preventDefault(); loadForecast(); }}>
            {/* Crop Selector */}
            <div className="lg:col-span-3 space-y-space-xs">
              <label className="block font-label-md text-label-md text-on-surface-variant">
                फसल (Crop)
              </label>
              <div className="relative">
                <span className="material-symbols-outlined absolute left-3 top-2.5 text-[20px] text-outline">eco</span>
                <select
                  value={selectedCrop}
                  onChange={(e) => setSelectedCrop(e.target.value)}
                  className="w-full pl-10 pr-8 py-2.5 bg-surface-container-low rounded-lg font-body-md text-body-md text-on-surface appearance-none focus:outline-none focus:ring-2 focus:ring-primary cursor-pointer"
                >
                  <option value="tomato">🍅 टमाटर (Tomato - Hybrid)</option>
                  <option value="onion">🧅 प्याज (Onion - Nashik Red)</option>
                  <option value="potato">🥔 आलू (Potato - Jyoti)</option>
                  <option value="wheat">🌾 गेहूं (Wheat - Sharbati)</option>
                </select>
                <span className="material-symbols-outlined absolute right-3 top-2.5 text-[18px] text-outline pointer-events-none">expand_more</span>
              </div>
            </div>

            {/* Mandi Selector */}
            <div className="lg:col-span-3 space-y-space-xs">
              <label className="block font-label-md text-label-md text-on-surface-variant">
                मंडी (Mandi Yard)
              </label>
              <div className="relative">
                <span className="material-symbols-outlined absolute left-3 top-2.5 text-[20px] text-outline">storefront</span>
                <select
                  value={selectedMandi}
                  onChange={(e) => setSelectedMandi(e.target.value)}
                  className="w-full pl-10 pr-8 py-2.5 bg-surface-container-low rounded-lg font-body-md text-body-md text-on-surface appearance-none focus:outline-none focus:ring-2 focus:ring-primary cursor-pointer"
                >
                  <option value="rajnandgaon">राजनांदगांव मंडी (छत्तीसगढ़)</option>
                  <option value="raipur">रायपुर मुख्य APMC मंडी</option>
                  <option value="durg">दुर्ग फल एवं सब्जी मंडी</option>
                  <option value="bilaspur">बिलासपुर थोक मंडी</option>
                  <option value="jagdalpur">जगदलपुर कृषि उपज मंडी</option>
                </select>
                <span className="material-symbols-outlined absolute right-3 top-2.5 text-[18px] text-outline pointer-events-none">expand_more</span>
              </div>
            </div>

            {/* Period Selector */}
            <div className="lg:col-span-4 space-y-space-xs">
              <label className="block font-label-md text-label-md text-on-surface-variant">
                अवधि (Time Range)
              </label>
              <div className="relative">
                <span className="material-symbols-outlined absolute left-3 top-2.5 text-[20px] text-outline">calendar_month</span>
                <select
                  value={selectedRange}
                  onChange={(e) => setSelectedRange(e.target.value as any)}
                  className="w-full pl-10 pr-8 py-2.5 bg-surface-container-low rounded-lg font-body-md text-body-md text-on-surface appearance-none focus:outline-none focus:ring-2 focus:ring-primary cursor-pointer"
                >
                  <option value="6m">पिछले 6 महीने + अगले 7 दिन (अनुशंसित)</option>
                  <option value="3m">पिछले 3 महीने + अगले 7 दिन</option>
                  <option value="1m">पिछले 30 दिन + अगले 7 दिन</option>
                  <option value="1y">विगत 1 वर्ष (वार्षिक ट्रेंड)</option>
                </select>
                <span className="material-symbols-outlined absolute right-3 top-2.5 text-[18px] text-outline pointer-events-none">expand_more</span>
              </div>
            </div>

            {/* Apply CTA Button */}
            <div className="lg:col-span-2">
              <button
                type="submit"
                className="w-full flex items-center justify-center gap-space-xs py-2.5 px-space-lg rounded-lg bg-primary-container text-on-primary hover:bg-primary transition-colors font-label-lg text-label-lg shadow-sm cursor-pointer"
              >
                <span className="material-symbols-outlined text-[18px]">search_check</span>
                <span>देखें (Apply)</span>
              </button>
            </div>
          </form>
        </div>

        {/* Analytics Dashboard Split Layout */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-gutter-md items-start">
          {/* LEFT: Main Forecast & Historical Chart (8 Cols) */}
          <div className="lg:col-span-8 space-y-space-md">
            <div className="bg-surface-container-lowest rounded-xl p-space-md sm:p-space-lg shadow-sm space-y-space-md border border-surface-container">
              {/* Chart Header & Interactive Legends */}
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-space-sm pb-space-xs">
                <div>
                  <div className="flex items-center gap-space-xs">
                    <h2 className="font-headline-sm text-headline-sm text-on-surface font-bold">
                      ऐतिहासिक मूल्य एवं 7-दिवसीय पूर्वानुमान
                    </h2>
                    <span className="px-space-xs py-0.5 rounded bg-primary-fixed/40 text-on-primary-fixed-variant font-label-sm text-label-sm">
                      AI मॉडल लाइव
                    </span>
                  </div>
                  <p className="font-body-sm text-body-sm text-on-surface-variant">
                    इकाई: ₹ प्रति क्विंटल | वास्तविक बनाम अनुमानित दर
                  </p>
                </div>

                {/* Legend Items */}
                <div className="flex flex-wrap items-center gap-space-md text-on-surface font-label-sm text-label-sm">
                  <div className="flex items-center gap-1.5">
                    <span className="w-4 h-1 bg-surface-tint rounded-full"></span>
                    <span>ऐतिहासिक मूल्य</span>
                  </div>
                  <div className="flex items-center gap-1.5">
                    <span className="w-4 h-0.5 border-t-2 border-dashed border-secondary"></span>
                    <span>पूर्वानुमान (Forecast)</span>
                  </div>
                  <div className="flex items-center gap-1.5">
                    <span className="w-3.5 h-3.5 rounded bg-secondary-container/50"></span>
                    <span>विश्वास अंतराल (95% CI)</span>
                  </div>
                </div>
              </div>

              {/* Scalable Interactive SVG Chart Container */}
              <div className="relative w-full overflow-hidden bg-surface-container-low rounded-lg p-space-sm sm:p-space-md border border-surface-container">
                {/* Floating Data Tooltip Indicator */}
                <div className="hidden sm:flex absolute right-16 top-10 flex-col bg-inverse-surface text-inverse-on-surface px-space-sm py-1.5 rounded shadow-lg pointer-events-none z-10 font-label-sm text-label-sm">
                  <div className="flex items-center gap-1">
                    <span className="w-2 h-2 rounded-full bg-secondary-container"></span>
                    <span className="font-bold">18-20 Oct 2026</span>
                  </div>
                  <span>अनुमान: ₹ {forecastData.predicted7DayAvgPrice} / क्विंटल</span>
                  <span className="text-secondary-fixed text-[10px]">
                    दायरा: ₹{forecastData.confidenceRange.min} - ₹{forecastData.confidenceRange.max}
                  </span>
                </div>

                {/* Inline SVG Chart */}
                <div className="w-full aspect-[16/9] max-h-[380px]">
                  <svg className="w-full h-full overflow-visible" preserveAspectRatio="none" viewBox="0 0 740 340">
                    <defs>
                      <linearGradient id="ciGradient" x1="0%" x2="0%" y1="0%" y2="100%">
                        <stop offset="0%" stopColor="#6cf8bb" stopOpacity="0.45" />
                        <stop offset="100%" stopColor="#6cf8bb" stopOpacity="0.05" />
                      </linearGradient>
                      <linearGradient id="histGradient" x1="0%" x2="0%" y1="0%" y2="100%">
                        <stop offset="0%" stopColor="#296a4b" stopOpacity="0.22" />
                        <stop offset="100%" stopColor="#296a4b" stopOpacity="0.0" />
                      </linearGradient>
                    </defs>

                    {/* Horizontal Grid Lines */}
                    <line stroke="#dce9ff" strokeWidth="1" x1="50" x2="720" y1="40" y2="40" />
                    <text className="font-body-sm text-[11px]" fill="#707972" textAnchor="end" x="42" y="44">3,000</text>
                    <line stroke="#dce9ff" strokeDasharray="3,3" strokeWidth="1" x1="50" x2="720" y1="100" y2="100" />
                    <text className="font-body-sm text-[11px]" fill="#707972" textAnchor="end" x="42" y="104">2,500</text>
                    <line stroke="#dce9ff" strokeDasharray="3,3" strokeWidth="1" x1="50" x2="720" y1="160" y2="160" />
                    <text className="font-body-sm text-[11px]" fill="#707972" textAnchor="end" x="42" y="164">2,000</text>
                    <line stroke="#dce9ff" strokeDasharray="3,3" strokeWidth="1" x1="50" x2="720" y1="220" y2="220" />
                    <text className="font-body-sm text-[11px]" fill="#707972" textAnchor="end" x="42" y="224">1,500</text>
                    <line stroke="#bfc9c0" strokeWidth="1" x1="50" x2="720" y1="280" y2="280" />
                    <text className="font-body-sm text-[11px]" fill="#707972" textAnchor="end" x="42" y="284">1,000</text>

                    {/* Forecast Divider Line */}
                    <line stroke="#00714d" strokeDasharray="4,4" strokeWidth="1.5" x1="560" x2="560" y1="30" y2="280" />
                    <rect fill="#6cf8bb" fillOpacity="0.06" height="250" width="160" x="560" y="30" />
                    <text className="font-label-sm text-[10px] font-bold" fill="#005236" x="568" y="52">
                      आज (TODAY) ➜ 7-दिन आगे
                    </text>

                    {/* Confidence Interval Shaded Area */}
                    <polygon fill="url(#ciGradient)" points="560,150 610,135 660,115 710,105 710,170 660,175 610,185 560,175" />

                    {/* Historical Area Under Curve */}
                    <polygon fill="url(#histGradient)" points="60,280 60,250 135,260 210,230 285,245 360,210 435,200 510,165 560,165 560,280" />

                    {/* Historical Actual Line */}
                    <polyline
                      fill="none"
                      points="60,250 135,260 210,230 285,245 360,210 435,200 510,165 560,165"
                      stroke="#296a4b"
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth="3"
                    />

                    {/* Historical Data Points */}
                    <circle cx="60" cy="250" fill="#296a4b" r="3.5" />
                    <circle cx="135" cy="260" fill="#296a4b" r="3.5" />
                    <circle cx="210" cy="230" fill="#296a4b" r="3.5" />
                    <circle cx="285" cy="245" fill="#296a4b" r="3.5" />
                    <circle cx="360" cy="210" fill="#296a4b" r="3.5" />
                    <circle cx="435" cy="200" fill="#296a4b" r="3.5" />
                    <circle cx="510" cy="165" fill="#296a4b" r="3.5" />
                    <circle cx="560" cy="165" fill="#003a24" r="4.5" />

                    {/* Forecasted Trend Line */}
                    <polyline
                      fill="none"
                      points="560,165 610,155 660,138 710,132"
                      stroke="#00714d"
                      strokeDasharray="6,5"
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth="3.5"
                    />

                    {/* Forecast Points */}
                    <circle cx="610" cy="155" fill="#ffffff" r="4" stroke="#00714d" strokeWidth="2.5" />
                    <circle cx="660" cy="138" fill="#ffffff" r="4" stroke="#00714d" strokeWidth="2.5" />
                    <circle cx="710" cy="132" fill="#00714d" r="5" stroke="#ffffff" strokeWidth="2" />

                    {/* Month Labels along X-Axis */}
                    <text className="font-label-md text-[12px]" fill="#404943" textAnchor="middle" x="60" y="305">अप्रैल 26</text>
                    <text className="font-label-md text-[12px]" fill="#404943" textAnchor="middle" x="135" y="305">मई</text>
                    <text className="font-label-md text-[12px]" fill="#404943" textAnchor="middle" x="210" y="305">जून</text>
                    <text className="font-label-md text-[12px]" fill="#404943" textAnchor="middle" x="285" y="305">जुलाई</text>
                    <text className="font-label-md text-[12px]" fill="#404943" textAnchor="middle" x="360" y="305">अगस्त</text>
                    <text className="font-label-md text-[12px]" fill="#404943" textAnchor="middle" x="435" y="305">सितंबर</text>
                    <text className="font-label-md text-[12px] font-bold" fill="#003a24" textAnchor="middle" x="560" y="305">13 अक्टूबर</text>
                    <text className="font-label-md text-[12px] font-bold" fill="#00714d" textAnchor="middle" x="710" y="305">20 अक्टूबर (अनुमान)</text>
                  </svg>
                </div>

                {/* Time Range Quick Toggles */}
                <div className="mt-space-sm pt-space-xs flex flex-wrap items-center justify-between gap-space-sm text-on-surface-variant font-label-sm text-label-sm">
                  <span className="flex items-center gap-1">
                    <span className="material-symbols-outlined text-[16px] text-surface-tint">info</span>
                    डॉटेड लाइन आगामी 7 दिनों का अनुमानित रुख दर्शाती है।
                  </span>
                  <div className="flex items-center gap-1">
                    {(['1m', '3m', '6m', '1y'] as const).map((r) => (
                      <button
                        key={r}
                        onClick={() => setSelectedRange(r)}
                        className={`px-2 py-0.5 rounded cursor-pointer ${
                          selectedRange === r
                            ? 'bg-primary text-on-primary font-bold'
                            : 'bg-surface-container font-medium text-on-surface hover:bg-surface-container-high'
                        }`}
                      >
                        {r.toUpperCase()}
                      </button>
                    ))}
                  </div>
                </div>
              </div>

              {/* Historical Summary Stats Grid */}
              <div className="grid grid-cols-2 sm:grid-cols-4 gap-space-sm pt-space-xs">
                {/* Metric 1 */}
                <div className="p-space-sm sm:p-space-md rounded-lg bg-surface-container-low border border-surface-container">
                  <div className="flex items-center justify-between text-on-surface-variant mb-1">
                    <span className="font-label-sm text-label-sm">औसत मूल्य (Avg Price)</span>
                    <span className="material-symbols-outlined text-[18px] text-surface-tint">equalizer</span>
                  </div>
                  <div className="font-headline-sm text-headline-sm text-on-surface font-bold">
                    ₹ {forecastData.averagePrice.toLocaleString('en-IN')}
                  </div>
                  <span className="font-body-sm text-body-sm text-on-surface-variant">प्रति क्विंटल (6 माह)</span>
                </div>

                {/* Metric 2 */}
                <div className="p-space-sm sm:p-space-md rounded-lg bg-surface-container-low border border-surface-container">
                  <div className="flex items-center justify-between text-on-surface-variant mb-1">
                    <span className="font-label-sm text-label-sm">न्यूनतम मूल्य (Min Price)</span>
                    <span className="material-symbols-outlined text-[18px] text-outline">trending_down</span>
                  </div>
                  <div className="font-headline-sm text-headline-sm text-on-surface font-bold">
                    ₹ {forecastData.minPrice.toLocaleString('en-IN')}
                  </div>
                  <span className="font-body-sm text-body-sm text-on-surface-variant">{forecastData.minPriceDate}</span>
                </div>

                {/* Metric 3 */}
                <div className="p-space-sm sm:p-space-md rounded-lg bg-surface-container-low border border-surface-container">
                  <div className="flex items-center justify-between text-on-surface-variant mb-1">
                    <span className="font-label-sm text-label-sm">अधिकतम मूल्य (Max Price)</span>
                    <span className="material-symbols-outlined text-[18px] text-secondary">trending_up</span>
                  </div>
                  <div className="font-headline-sm text-headline-sm text-primary font-bold">
                    ₹ {forecastData.maxPrice.toLocaleString('en-IN')}
                  </div>
                  <span className="font-body-sm text-body-sm text-on-surface-variant">{forecastData.maxPriceDate}</span>
                </div>

                {/* Metric 4 */}
                <div className="p-space-sm sm:p-space-md rounded-lg bg-surface-container-low border border-surface-container">
                  <div className="flex items-center justify-between text-on-surface-variant mb-1">
                    <span className="font-label-sm text-label-sm">कुल दर्ज आवक (Arrivals)</span>
                    <span className="material-symbols-outlined text-[18px] text-tertiary-container">local_shipping</span>
                  </div>
                  <div className="font-headline-sm text-headline-sm text-on-surface font-bold">
                    {forecastData.totalArrivals.toLocaleString('en-IN')}
                  </div>
                  <span className="font-body-sm text-body-sm text-on-surface-variant">क्विंटल ({forecastData.mandiName.split(' ')[0]})</span>
                </div>
              </div>
            </div>

            {/* Agricultural Visual Context Cards */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-space-md">
              <div className="bg-surface-container-lowest rounded-xl p-space-md shadow-sm flex items-center gap-space-md border border-surface-container">
                <div className="w-24 h-24 rounded-lg overflow-hidden shrink-0 bg-surface-container">
                  <img
                    className="w-full h-full object-cover"
                    alt="Fresh harvested produce in crates"
                    src="https://lh3.googleusercontent.com/aida-public/AB6AXuBqwsMKwwaMuvBCa_kT6qO4W92T_NjRUjWSiDHXzPrR34f0sTl3io2CaIVWbvA-afkWOCAg0BwhGwpnXeTlP384sospU2Q2PukFSHL17OR6povkPjMFttPQVh0KKexE7rjs5eFwyMhn0dRC5wL8-ZM7yvUz8wCjk27-J2pjUWtVUPK6mb5D5n-RXID1wZufyr6p9kqaEcIsD-gt5cBDbuCghuZ6EfXcSpKzZ7EI5byt25s0qIfrgNZM"
                  />
                </div>
                <div className="space-y-1">
                  <div className="inline-flex items-center gap-1 text-secondary font-label-sm text-label-sm font-semibold">
                    <span className="material-symbols-outlined text-[14px]">psychiatry</span>
                    <span>गुणवत्ता वर्गीकरण: {forecastData.qualityClassification.grade}</span>
                  </div>
                  <h4 className="font-title-md text-title-md text-on-surface font-bold">
                    {forecastData.cropName}
                  </h4>
                  <p className="font-body-sm text-body-sm text-on-surface-variant">
                    स्थानीय खेतों से ताजा आवक, फर्मनेस {forecastData.qualityClassification.firmnessPercent}%, भंडारण अवधि {forecastData.qualityClassification.storageDays}।
                  </p>
                </div>
              </div>

              <div className="bg-surface-container-lowest rounded-xl p-space-md shadow-sm flex items-center gap-space-md border border-surface-container">
                <div className="w-24 h-24 rounded-lg overflow-hidden shrink-0 bg-surface-container">
                  <img
                    className="w-full h-full object-cover"
                    alt="Mandi auction scene"
                    src="https://lh3.googleusercontent.com/aida-public/AB6AXuBmZpPE11adKth1DSHxZnW6fjGpTburb7U1YlEkmfTI9SIkc0Q0xD80HoTF1niWxqcGoMbk2bLjhe7u7kyZta2E9K1bbSswF1SG__faND_2fnGCag3jpdwPiFg5xgPiJ6JL_ceHBD60SXtLNBj-u92F28aJnj81ZPoLb8F2igRJ0CU3P473OouFQBuvBF_T8dJimXxrX4jH42KRbLOq3lrqXYhr5Ds0hfREmf9wLbmzJWG-jciBqXt2"
                  />
                </div>
                <div className="space-y-1">
                  <div className="inline-flex items-center gap-1 text-primary font-label-sm text-label-sm font-semibold">
                    <span className="material-symbols-outlined text-[14px]">store</span>
                    <span>मंडी प्रांगण गतिविधि</span>
                  </div>
                  <h4 className="font-title-md text-title-md text-on-surface font-bold">दैनिक नीलामी समय</h4>
                  <p className="font-body-sm text-body-sm text-on-surface-variant">
                    {forecastData.mandiYardActivity.auctionTiming}। {forecastData.mandiYardActivity.peakBiddingWindow}
                  </p>
                </div>
              </div>
            </div>
          </div>

          {/* RIGHT: AI Insights & Recommendation Panel (4 Cols) */}
          <div className="lg:col-span-4 space-y-space-md">
            {/* Primary AI Forecast Card */}
            <div className="bg-surface-container-lowest rounded-xl p-space-md sm:p-space-lg shadow-sm space-y-space-md relative overflow-hidden border border-surface-container">
              {/* Top Accent */}
              <div className="absolute top-0 left-0 right-0 h-1.5 bg-gradient-to-r from-secondary-container via-secondary to-primary-container" />

              <div className="flex items-center justify-between">
                <span className="px-space-sm py-1 rounded-full bg-secondary-container text-on-secondary-container font-label-sm text-label-sm font-bold flex items-center gap-1">
                  <span className="material-symbols-outlined text-[16px]">auto_awesome</span>
                  <span>AI भविष्यवाणी (7 दिन)</span>
                </span>
                <span className="font-label-sm text-label-sm text-on-surface-variant">
                  सटीकता: {metrics.accuracyPercent}%
                </span>
              </div>

              {/* Main Estimated Price Display */}
              <div className="space-y-1">
                <span className="font-body-sm text-body-sm text-on-surface-variant font-medium">
                  अगले 7 दिनों का अनुमानित मूल्य
                </span>
                <div className="flex items-baseline gap-space-xs">
                  <span className="font-display-lg text-display-lg text-primary tracking-tight font-bold">
                    ₹ {forecastData.predicted7DayAvgPrice.toLocaleString('en-IN')}
                  </span>
                  <span className="font-headline-sm text-headline-sm text-on-surface-variant">/ क्विंटल</span>
                </div>
                <div className="inline-flex items-center gap-1 font-label-lg text-label-lg text-secondary font-bold">
                  <span className="material-symbols-outlined text-[20px]">north_east</span>
                  <span>↑ {forecastData.priceGrowthPercent}% (पिछले सप्ताह की तुलना में तेजी)</span>
                </div>
              </div>

              {/* Confidence Interval Card */}
              <div className="p-space-sm rounded-lg bg-surface-container-low space-y-space-xs border border-surface-container">
                <div className="flex items-center justify-between text-on-surface font-label-md text-label-md">
                  <span className="text-on-surface-variant">विश्वास दायरा (Confidence Range):</span>
                  <span className="font-bold text-primary">
                    ₹ {forecastData.confidenceRange.min} – ₹ {forecastData.confidenceRange.max}
                  </span>
                </div>
                <div className="w-full bg-surface-container h-2 rounded-full overflow-hidden flex">
                  <div className="w-1/4 bg-transparent"></div>
                  <div className="w-1/2 bg-secondary rounded-full"></div>
                  <div className="w-1/4 bg-transparent"></div>
                </div>
                <div className="flex justify-between font-label-sm text-label-sm text-outline">
                  <span>कम से कम: ₹{forecastData.confidenceRange.min}</span>
                  <span>अधिकतम: ₹{forecastData.confidenceRange.max}</span>
                </div>
              </div>

              {/* AI Reasoning / Market Driver */}
              <div className="space-y-space-xs pt-space-xs">
                <h3 className="font-label-lg text-label-lg text-on-surface font-semibold flex items-center gap-1">
                  <span className="material-symbols-outlined text-[18px] text-tertiary-fixed-dim">lightbulb</span>
                  <span>AI विश्लेषण और कारण (Market Driver)</span>
                </h3>
                <p className="font-body-md text-body-md text-on-surface-variant bg-surface-container-low p-space-sm rounded-lg border border-surface-container">
                  "{forecastData.marketDriverExplanation}"
                </p>
              </div>

              {/* Farmer Advisory Suggestion */}
              <div className="p-space-sm rounded-lg bg-primary-fixed/30 flex items-start gap-space-sm border border-primary-fixed">
                <span className="material-symbols-outlined text-primary text-[20px] shrink-0 mt-0.5">thumb_up</span>
                <div className="space-y-0.5">
                  <h4 className="font-label-md text-label-md text-on-primary-fixed font-bold">किसान सलाह (Recommendation)</h4>
                  <p className="font-body-sm text-body-sm text-on-primary-fixed-variant">
                    {forecastData.farmerAdvisory}
                  </p>
                </div>
              </div>

              {/* Model Telemetry Metrics */}
              <div className="pt-space-xs space-y-space-xs">
                <div className="flex items-center justify-between text-on-surface-variant font-label-sm text-label-sm">
                  <span>एल्गोरिदम प्रदर्शन (Model Metrics)</span>
                  <span className="font-mono text-outline">{metrics.modelName}</span>
                </div>
                <div className="grid grid-cols-3 gap-1.5 text-center">
                  <div className="bg-surface-container-low p-1.5 rounded border border-surface-container">
                    <span className="block text-[10px] text-on-surface-variant font-mono">MAE</span>
                    <span className="font-label-md text-label-md font-bold text-on-surface">{metrics.mae}</span>
                  </div>
                  <div className="bg-surface-container-low p-1.5 rounded border border-surface-container">
                    <span className="block text-[10px] text-on-surface-variant font-mono">RMSE</span>
                    <span className="font-label-md text-label-md font-bold text-on-surface">{metrics.rmse}</span>
                  </div>
                  <div className="bg-surface-container-low p-1.5 rounded border border-surface-container">
                    <span className="block text-[10px] text-on-surface-variant font-mono">MAPE</span>
                    <span className="font-label-md text-label-md font-bold text-secondary">{metrics.mapePercent}%</span>
                  </div>
                </div>
                <p className="text-[10px] text-outline text-center">MAPE &lt; 10% उच्च विश्वसनीयता (High Accuracy) का परिचायक है।</p>
              </div>

              {/* Action Button to Compare Other Mandis */}
              <Link
                to="/best-mandi"
                className="w-full flex items-center justify-center gap-space-xs py-3 px-space-md rounded-lg bg-primary text-on-primary hover:bg-primary-container transition-colors font-label-lg text-label-lg shadow-sm"
              >
                <span>अन्य मंडियों से तुलना करें (Compare Mandis)</span>
                <span className="material-symbols-outlined text-[18px]">arrow_forward</span>
              </Link>
            </div>

            {/* 7-Day Day-by-Day Forecast Table */}
            <div className="bg-surface-container-lowest rounded-xl p-space-md shadow-sm space-y-space-sm border border-surface-container">
              <div className="flex items-center justify-between">
                <h4 className="font-title-md text-title-md text-on-surface font-semibold">दैनिक अनुमानित सूची</h4>
                <span className="font-label-sm text-label-sm text-on-surface-variant">अक्टूबर 2026</span>
              </div>
              <div className="space-y-1">
                {dailyForecastList.map((day) => (
                  <div
                    key={day.date}
                    className={`flex items-center justify-between p-2 rounded font-body-sm text-body-sm ${
                      day.isPeak
                        ? 'bg-secondary-container/20 border border-secondary/30'
                        : 'bg-surface-container-low'
                    }`}
                  >
                    <div className="flex items-center gap-2">
                      <span className={`font-bold ${day.isPeak ? 'text-on-secondary-container' : 'text-on-surface'}`}>
                        {day.formattedDate}
                      </span>
                      {day.isPeak ? (
                        <span className="material-symbols-outlined text-[14px] text-secondary">star</span>
                      ) : (
                        <span className="px-1.5 py-0.2 bg-surface text-[10px] rounded text-on-surface-variant">
                          {day.dayHindi}
                        </span>
                      )}
                    </div>
                    <span className={`font-bold ${day.isPeak ? 'text-secondary' : 'text-primary'}`}>
                      ₹ {day.minRange.toLocaleString('en-IN')} - ₹ {day.maxRange.toLocaleString('en-IN')}
                    </span>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>

        {/* Official Model Notice Disclaimer Banner */}
        <div className="w-full p-space-md rounded-xl bg-surface-container-low flex flex-col sm:flex-row sm:items-center justify-between gap-space-sm border border-surface-container">
          <div className="flex items-start gap-space-sm">
            <span className="material-symbols-outlined text-outline text-[22px] shrink-0 mt-0.5">verified</span>
            <p className="font-body-sm text-body-sm text-on-surface-variant">
              <strong className="text-on-surface">सूचना एवं अस्वीकरण:</strong> यह मूल्य पूर्वानुमान ऐतिहासिक AGMARKNET आंकड़ों, आवक-मांग रुझान और AI मॉडल (Prophet एवं LightGBM) पर आधारित गणितीय अनुमान है। वास्तविक मंडी भाव स्थानीय फसल गुणवत्ता (ग्रेडिंग), मौसम और प्रांगण में तात्कालिक मांग के अनुसार भिन्न हो सकते हैं।
            </p>
          </div>
          <div className="shrink-0 flex items-center gap-2 self-end sm:self-auto">
            <span className="font-label-sm text-label-sm text-on-surface-variant">डेटा स्रोत: AGMARKNET / e-NAM</span>
          </div>
        </div>
      </div>
    </div>
  );
};
