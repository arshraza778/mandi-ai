import React, { useState } from 'react';
import { Link, useNavigate, useOutletContext } from 'react-router-dom';
import { useLanguage } from '../../context/LanguageContext';

export const HomeDashboard: React.FC = () => {
  const { t } = useLanguage();
  const navigate = useNavigate();
  const outletContext = useOutletContext<{ openVoiceModal?: () => void }>();

  const [searchInput, setSearchInput] = useState('');
  const [selectedCategory, setSelectedCategory] = useState<'all' | 'veg' | 'grain'>('all');

  const handleSearchSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (searchInput.trim()) {
      navigate(`/mandi-rates?q=${encodeURIComponent(searchInput.trim())}`);
    } else {
      navigate('/mandi-rates');
    }
  };

  const handleQuickTagClick = (tag: string) => {
    setSearchInput(tag);
    navigate(`/mandi-rates?q=${encodeURIComponent(tag)}`);
  };

  return (
    <div className="flex flex-col w-full">
      {/* Top Location & Live Weather Micro-Header */}
      <div className="w-full bg-surface-container-low px-4 md:px-margin-lg py-2 border-b border-surface-container">
        <div className="max-w-[1280px] mx-auto flex flex-wrap items-center justify-between gap-space-xs text-on-surface-variant font-body-sm text-body-sm">
          <div className="flex items-center gap-space-sm flex-wrap">
            <span className="inline-flex items-center gap-1 font-label-md text-label-md text-primary font-semibold">
              <span className="material-symbols-outlined text-[18px] text-secondary">location_on</span>
              रायपुर, छत्तीसगढ़ (Raipur, CG)
            </span>
            <span className="text-outline-variant">•</span>
            <span className="inline-flex items-center gap-1">
              <span className="material-symbols-outlined text-[17px] text-on-tertiary-container">partly_cloudy_day</span>
              28°C आंशिक बादल (Partial Clouds)
            </span>
          </div>
          <div className="flex items-center gap-space-md">
            <span className="inline-flex items-center gap-1 font-label-sm text-label-sm text-secondary bg-surface-container-lowest px-2 py-0.5 rounded-full shadow-sm">
              <span className="w-1.5 h-1.5 rounded-full bg-secondary animate-pulse"></span>
              {t.serverActive}
            </span>
            <span className="hidden md:inline text-on-surface-variant/80">{t.lastUpdated}</span>
          </div>
        </div>
      </div>

      {/* Hero Section with Rural Landscape and AI Omnibar */}
      <div className="relative w-full overflow-hidden bg-primary text-on-primary">
        {/* Background Image with scrim */}
        <div
          className="absolute inset-0 bg-cover bg-center opacity-30 mix-blend-luminosity"
          style={{
            backgroundImage:
              "url('https://lh3.googleusercontent.com/aida-public/AB6AXuA3dqyvb2thpacSDEG27PNk83M7wShoHu6Cm6rbZF8FSEgVVa2qnmaeAzAIapkx4vltR7PYFFr6HtX-xHMzSXCazlRMugMhOrelGG5WJ0awxflT1a9xnTBnBepVmBsN2l1pw-fpDmQiy5Ubl5sRo-lbhYKJbRSasP_OMJw_SyWtCDfr5pWcBEI_0fy8XjNMgJ9fD2rriOQ3yXauZyGGa8NS-lu5npdP7ChKf5B897RQwQ8cw0lA4fea')",
          }}
        />
        {/* Soft Radial Gradient Depth Overlay */}
        <div className="absolute inset-0 bg-gradient-to-r from-primary via-primary/95 to-primary/80" />
        <div className="absolute right-0 bottom-0 w-96 h-96 bg-secondary-container/10 rounded-full blur-3xl pointer-events-none" />

        <div className="relative max-w-[1280px] mx-auto px-4 md:px-margin-lg py-space-xl lg:py-space-2xl flex flex-col lg:flex-row items-center justify-between gap-space-xl">
          {/* Left Content: Hero Typography & Omnibar */}
          <div className="w-full lg:w-7/12 flex flex-col gap-space-md">
            <div className="inline-flex items-center gap-space-xs self-start px-space-sm py-1 rounded-full bg-surface-container-lowest/15 backdrop-blur-md text-primary-fixed font-label-md text-label-md">
              <span className="material-symbols-outlined text-[18px]">verified</span>
              <span>किसान का भरोसेमंद साथी • AI मूल्य विश्लेषक</span>
            </div>

            <div className="flex flex-col gap-space-xs">
              <h1 className="font-display-lg text-display-lg text-on-primary font-bold tracking-tight">
                सही जानकारी, <span className="text-secondary-fixed">बेहतर फ़ैसला</span>
              </h1>
              <p className="font-headline-sm text-headline-sm text-primary-fixed-dim font-medium">
                {t.subTagline}
              </p>
              <p className="font-body-lg text-body-lg text-on-primary/90 max-w-xl mt-space-xs leading-relaxed">
                MandiMind AI के साथ जानें कि आपकी उपज के लिए कौन सी मंडी देगी सबसे अधिक मुनाफ़ा। वास्तविक AGMARKNET आंकड़े और आवाक पूर्वानुमान।
              </p>
            </div>

            {/* Voice & Text Search Omnibar */}
            <form onSubmit={handleSearchSubmit} className="w-full max-w-2xl mt-space-sm">
              <div className="relative bg-surface-container-lowest text-on-surface rounded-2xl shadow-xl p-1.5 flex items-center transition-all focus-within:shadow-2xl">
                <div className="flex items-center pl-space-sm text-on-surface-variant">
                  <span className="material-symbols-outlined text-[24px] text-primary">search</span>
                </div>
                <input
                  type="text"
                  value={searchInput}
                  onChange={(e) => setSearchInput(e.target.value)}
                  className="w-full bg-transparent px-space-sm py-3 font-body-lg text-body-lg text-on-surface placeholder:text-outline focus:outline-none"
                  placeholder={t.searchPlaceholder}
                />
                <div className="flex items-center gap-1.5 pr-1">
                  <button
                    type="button"
                    onClick={() => outletContext?.openVoiceModal?.()}
                    className="flex items-center gap-1 bg-secondary-container text-on-secondary-container hover:bg-secondary-fixed transition-colors px-space-md py-2.5 rounded-xl font-label-lg text-label-lg font-bold shadow-sm cursor-pointer"
                    title="बोलकर खोजें (Voice Search)"
                  >
                    <span className="material-symbols-outlined text-[20px] text-secondary">mic</span>
                    <span className="hidden sm:inline">{t.speak}</span>
                  </button>
                  <button
                    type="submit"
                    className="bg-primary text-on-primary hover:bg-primary-container transition-colors px-space-md py-2.5 rounded-xl font-label-lg text-label-lg font-semibold shadow-sm flex items-center gap-1 cursor-pointer"
                  >
                    <span>{t.search}</span>
                    <span className="material-symbols-outlined text-[18px]">arrow_forward</span>
                  </button>
                </div>
              </div>

              {/* Suggested Quick Tags */}
              <div className="flex flex-wrap items-center gap-space-xs mt-space-sm font-label-sm text-label-sm text-on-primary/80">
                <span className="text-primary-fixed-dim">{t.quickSearch}</span>
                <button
                  type="button"
                  onClick={() => handleQuickTagClick('टमाटर')}
                  className="bg-surface-container-lowest/15 hover:bg-surface-container-lowest/25 px-2.5 py-1 rounded-full transition-colors text-surface-bright cursor-pointer"
                >
                  टमाटर (Tomato)
                </button>
                <button
                  type="button"
                  onClick={() => handleQuickTagClick('प्याज')}
                  className="bg-surface-container-lowest/15 hover:bg-surface-container-lowest/25 px-2.5 py-1 rounded-full transition-colors text-surface-bright cursor-pointer"
                >
                  प्याज (Nashik Onion)
                </button>
                <button
                  type="button"
                  onClick={() => handleQuickTagClick('सोयाबीन')}
                  className="bg-surface-container-lowest/15 hover:bg-surface-container-lowest/25 px-2.5 py-1 rounded-full transition-colors text-surface-bright cursor-pointer"
                >
                  सोयाबीन
                </button>
                <button
                  type="button"
                  onClick={() => handleQuickTagClick('धान')}
                  className="bg-surface-container-lowest/15 hover:bg-surface-container-lowest/25 px-2.5 py-1 rounded-full transition-colors text-surface-bright cursor-pointer"
                >
                  धान (Paddy)
                </button>
                <button
                  type="button"
                  onClick={() => handleQuickTagClick('सरसों')}
                  className="bg-surface-container-lowest/15 hover:bg-surface-container-lowest/25 px-2.5 py-1 rounded-full transition-colors text-surface-bright cursor-pointer"
                >
                  सरसों (Mustard)
                </button>
              </div>
            </form>
          </div>

          {/* Right Graphic / Farmer Feature Focus */}
          <div className="w-full lg:w-5/12 flex justify-center">
            <div className="relative w-full max-w-md">
              <div className="absolute -inset-2 bg-gradient-to-tr from-secondary-container to-tertiary-fixed rounded-3xl blur-lg opacity-40" />
              <div className="relative bg-surface-container-lowest text-on-surface rounded-2xl p-space-md shadow-2xl flex flex-col gap-space-sm">
                <div className="flex items-center justify-between pb-space-xs">
                  <div className="flex items-center gap-space-xs">
                    <span className="w-3 h-3 rounded-full bg-secondary"></span>
                    <span className="font-label-md text-label-md font-semibold text-primary">
                      {t.aiSuggestedPick}
                    </span>
                  </div>
                  <span className="font-label-sm text-label-sm bg-primary-fixed/40 text-on-primary-fixed-variant px-2 py-0.5 rounded font-medium">
                    94% सटीकता
                  </span>
                </div>

                {/* Farmer & Crop Visual Card */}
                <div className="relative h-44 rounded-xl overflow-hidden shadow-inner">
                  <img
                    className="w-full h-full object-cover"
                    alt="Indian farmer in lush tomato field"
                    src="https://lh3.googleusercontent.com/aida-public/AB6AXuBAub8was4RT8h-9Hgws_sBD2-MTw_1zQ7dNb7ggRlt4l0iAXAdnqJyvgHD3toXqQdKqHuvX6yxoIyaHaSZ_dEU52lftMvqHhg1VhuxvCEYG4X9lCWKb7M8ZM_2lwuvpCjaALhxkHhXUznxMplJco8MLJR4UesUFFRVzk1iYypy21B84kKH_IT6u_8g66Qe21Dim4haDONUHcOuvUdPrlrPkf9hN3JDP8yijeSmx33QfyzhYN_rh2fb"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-inverse-surface/90 via-inverse-surface/30 to-transparent flex flex-col justify-end p-space-sm text-inverse-on-surface">
                    <span className="font-label-sm text-label-sm text-secondary-fixed">
                      रायपुर संभाग • रायपुर मंडी
                    </span>
                    <p className="font-title-md text-title-md font-bold">
                      टमाटर की सर्वोत्तम शुद्ध बिक्री दर
                    </p>
                  </div>
                </div>

                {/* Metric Row */}
                <div className="grid grid-cols-2 gap-space-sm pt-space-xs">
                  <div className="bg-surface-container-low p-space-sm rounded-xl flex flex-col">
                    <span className="font-label-sm text-label-sm text-on-surface-variant">
                      {t.estimatedNetProfit}
                    </span>
                    <span className="font-headline-sm text-headline-sm text-secondary font-bold">
                      ₹ 38,500
                    </span>
                    <span className="font-label-sm text-label-sm text-outline">
                      20 क्विंटल उपज पर
                    </span>
                  </div>
                  <div className="bg-surface-container-low p-space-sm rounded-xl flex flex-col justify-between">
                    <div>
                      <span className="font-label-sm text-label-sm text-on-surface-variant">
                        {t.transportDeduction}
                      </span>
                      <p className="font-title-md text-title-md text-on-surface font-semibold">
                        ₹ 1,800 कुल
                      </p>
                    </div>
                    <Link
                      to="/best-mandi"
                      className="font-label-md text-label-md text-primary font-semibold inline-flex items-center gap-0.5 hover:text-secondary"
                    >
                      {t.details}
                      <span className="material-symbols-outlined text-[16px]">chevron_right</span>
                    </Link>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Live Market News Ticker Strip */}
      <div className="w-full bg-surface-container py-2.5 px-4 md:px-margin-lg shadow-sm border-b border-surface-container-high">
        <div className="max-w-[1280px] mx-auto flex flex-col sm:flex-row items-center justify-between gap-space-xs">
          <div className="flex items-center gap-space-sm overflow-hidden">
            <span className="inline-flex items-center gap-1 font-label-md text-label-md font-bold bg-error-container text-on-error-container px-2.5 py-1 rounded-full shrink-0">
              <span className="material-symbols-outlined text-[16px] animate-pulse">campaign</span>
              ताज़ा अपडेट
            </span>
            <p className="font-body-md text-body-md text-on-surface truncate">
              टमाटर के दामों में रायपुर व दुर्ग मंडी में पिछले 3 दिनों में 12% की बढ़ोतरी दर्ज | लहसुन व प्याज की नई आवक शुरू।
            </p>
          </div>
          <Link
            to="/market-trends"
            className="font-label-md text-label-md text-primary hover:text-secondary font-semibold shrink-0 inline-flex items-center gap-1"
          >
            सभी रुझान देखें
            <span className="material-symbols-outlined text-[16px]">arrow_forward</span>
          </Link>
        </div>
      </div>

      {/* Main Content Layout */}
      <div className="w-full max-w-[1280px] mx-auto px-4 md:px-margin-lg py-space-xl flex flex-col gap-space-2xl">
        {/* 6 Quick-Access Feature Action Cards Grid */}
        <section className="flex flex-col gap-space-md">
          <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-space-xs">
            <div>
              <span className="font-label-md text-label-md uppercase tracking-wider text-secondary font-bold">
                त्वरित सेवाएं • Quick Access
              </span>
              <h2 className="font-headline-lg text-headline-lg text-on-surface font-bold tracking-tight">
                {t.quickAccess}
              </h2>
            </div>
            <p className="font-body-md text-body-md text-on-surface-variant">
              {t.quickAccessSub}
            </p>
          </div>

          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-space-md">
            {/* 1. Mandi Rates */}
            <Link
              to="/mandi-rates"
              className="group bg-surface-container-lowest hover:bg-surface-container-low transition-all duration-200 p-space-md rounded-2xl shadow-sm hover:shadow-md flex flex-col items-center text-center gap-space-sm cursor-pointer border border-surface-container"
            >
              <div className="w-14 h-14 rounded-2xl bg-primary-container text-on-primary-container flex items-center justify-center shadow-sm group-hover:scale-105 transition-transform">
                <span className="material-symbols-outlined text-[30px] text-surface-bright">storefront</span>
              </div>
              <div className="flex flex-col">
                <span className="font-title-md text-title-md font-bold text-on-surface">मंडी भाव</span>
                <span className="font-label-sm text-label-sm text-on-surface-variant">Mandi Rates</span>
                <span className="font-body-sm text-body-sm text-secondary mt-1 font-medium">लाइव भाव देखें</span>
              </div>
            </Link>

            {/* 2. Best Mandi */}
            <Link
              to="/best-mandi"
              className="group bg-surface-container-lowest hover:bg-surface-container-low transition-all duration-200 p-space-md rounded-2xl shadow-sm hover:shadow-md flex flex-col items-center text-center gap-space-sm cursor-pointer border border-surface-container"
            >
              <div className="w-14 h-14 rounded-2xl bg-tertiary-container text-tertiary-fixed flex items-center justify-center shadow-sm group-hover:scale-105 transition-transform">
                <span className="material-symbols-outlined text-[30px] text-tertiary-fixed-dim">analytics</span>
              </div>
              <div className="flex flex-col">
                <span className="font-title-md text-title-md font-bold text-on-surface">सर्वश्रेष्ठ मंडी</span>
                <span className="font-label-sm text-label-sm text-on-surface-variant">Best Mandi</span>
                <span className="font-body-sm text-body-sm text-on-tertiary-container mt-1 font-medium">अधिकतम मुनाफा</span>
              </div>
            </Link>

            {/* 3. Weather */}
            <Link
              to="/weather"
              className="group bg-surface-container-lowest hover:bg-surface-container-low transition-all duration-200 p-space-md rounded-2xl shadow-sm hover:shadow-md flex flex-col items-center text-center gap-space-sm cursor-pointer border border-surface-container"
            >
              <div className="w-14 h-14 rounded-2xl bg-surface-variant text-on-surface flex items-center justify-center shadow-sm group-hover:scale-105 transition-transform">
                <span className="material-symbols-outlined text-[30px] text-surface-tint">cloud_sync</span>
              </div>
              <div className="flex flex-col">
                <span className="font-title-md text-title-md font-bold text-on-surface">मौसम</span>
                <span className="font-label-sm text-label-sm text-on-surface-variant">Weather Forecast</span>
                <span className="font-body-sm text-body-sm text-secondary mt-1 font-medium">7 दिन का अनुमान</span>
              </div>
            </Link>

            {/* 4. Schemes */}
            <Link
              to="/schemes"
              className="group bg-surface-container-lowest hover:bg-surface-container-low transition-all duration-200 p-space-md rounded-2xl shadow-sm hover:shadow-md flex flex-col items-center text-center gap-space-sm cursor-pointer border border-surface-container"
            >
              <div className="w-14 h-14 rounded-2xl bg-surface-container-high text-primary flex items-center justify-center shadow-sm group-hover:scale-105 transition-transform">
                <span className="material-symbols-outlined text-[30px]">account_balance</span>
              </div>
              <div className="flex flex-col">
                <span className="font-title-md text-title-md font-bold text-on-surface">सरकारी योजनाएं</span>
                <span className="font-label-sm text-label-sm text-on-surface-variant">Sarkari Schemes</span>
                <span className="font-body-sm text-body-sm text-primary mt-1 font-medium">सब्सिडी व लाभ</span>
              </div>
            </Link>

            {/* 5. Fertilizer & Pesticide */}
            <Link
              to="/fertilizer-and-pesticide"
              className="group bg-surface-container-lowest hover:bg-surface-container-low transition-all duration-200 p-space-md rounded-2xl shadow-sm hover:shadow-md flex flex-col items-center text-center gap-space-sm cursor-pointer border border-surface-container"
            >
              <div className="w-14 h-14 rounded-2xl bg-primary-fixed text-primary flex items-center justify-center shadow-sm group-hover:scale-105 transition-transform">
                <span className="material-symbols-outlined text-[30px]">science</span>
              </div>
              <div className="flex flex-col">
                <span className="font-title-md text-title-md font-bold text-on-surface">खाद व कीटनाशक</span>
                <span className="font-label-sm text-label-sm text-on-surface-variant">Fertilizer Calculator</span>
                <span className="font-body-sm text-body-sm text-secondary mt-1 font-medium">उचित मात्रा गणना</span>
              </div>
            </Link>

            {/* 6. Crop Care / Advisory */}
            <Link
              to="/crop-care"
              className="group bg-surface-container-lowest hover:bg-surface-container-low transition-all duration-200 p-space-md rounded-2xl shadow-sm hover:shadow-md flex flex-col items-center text-center gap-space-sm cursor-pointer border border-surface-container"
            >
              <div className="w-14 h-14 rounded-2xl bg-secondary-fixed text-on-secondary-fixed flex items-center justify-center shadow-sm group-hover:scale-105 transition-transform">
                <span className="material-symbols-outlined text-[30px]">psychiatry</span>
              </div>
              <div className="flex flex-col">
                <span className="font-title-md text-title-md font-bold text-on-surface">फसल सलाह</span>
                <span className="font-label-sm text-label-sm text-on-surface-variant">Crop Advisory</span>
                <span className="font-body-sm text-body-sm text-secondary mt-1 font-medium">रोग पहचान व उपचार</span>
              </div>
            </Link>
          </div>
        </section>

        {/* Compact AI Insights Prompt Card Banner */}
        <div className="relative overflow-hidden bg-gradient-to-r from-primary via-primary-container to-secondary rounded-2xl p-space-lg text-on-primary shadow-md">
          <div className="relative z-10 flex flex-col sm:flex-row items-center justify-between gap-space-md">
            <div className="flex items-center gap-space-md">
              <div className="w-12 h-12 rounded-xl bg-surface-container-lowest/20 backdrop-blur-md flex items-center justify-center shrink-0">
                <span className="material-symbols-outlined text-[28px] text-secondary-fixed">auto_awesome</span>
              </div>
              <div>
                <div className="flex items-center gap-space-xs">
                  <span className="font-label-sm text-label-sm bg-secondary-fixed text-on-secondary-fixed px-2 py-0.5 rounded font-bold">
                    MandiMind AI
                  </span>
                  <span className="font-label-sm text-label-sm text-primary-fixed-dim">
                    मशीन लर्निंग विश्लेषण
                  </span>
                </div>
                <p className="font-title-md text-title-md font-bold mt-0.5">
                  AI आधारित विश्लेषण के साथ पाएं आपकी फसल के लिए सबसे बेहतर विकल्प
                </p>
                <p className="font-body-sm text-body-sm text-on-primary/80">
                  दूरी, डीजल खर्च, मंडी कमीशन और संभावित खराबी (Spoilage) को घटाकर शुद्ध लाभ जानें।
                </p>
              </div>
            </div>
            <Link
              to="/best-mandi"
              className="shrink-0 bg-secondary-container text-on-secondary-container hover:bg-secondary-fixed px-space-lg py-2.5 rounded-xl font-label-lg text-label-lg font-bold shadow transition-all flex items-center gap-space-xs"
            >
              <span>शुरू करें</span>
              <span className="material-symbols-outlined text-[18px]">arrow_forward</span>
            </Link>
          </div>
        </div>

        {/* Today's Major Mandi Prices (आज के प्रमुख बाजार भाव) */}
        <section className="flex flex-col gap-space-md">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-space-xs">
            <div className="flex items-center gap-space-sm">
              <div className="w-2.5 h-8 bg-primary rounded-full"></div>
              <div>
                <h2 className="font-headline-lg text-headline-lg text-on-surface font-bold">
                  आज के प्रमुख बाजार भाव
                </h2>
                <p className="font-body-sm text-body-sm text-on-surface-variant">
                  छत्तीसगढ़ एवं निकटवर्ती प्रमुख मंडियों के ताज़ा भाव (AGMARKNET प्रमाणित)
                </p>
              </div>
            </div>

            <div className="flex items-center gap-space-xs flex-wrap">
              <button
                onClick={() => setSelectedCategory('all')}
                className={`px-space-md py-1.5 rounded-full font-label-md text-label-md font-semibold transition-colors cursor-pointer ${
                  selectedCategory === 'all'
                    ? 'bg-primary text-on-primary'
                    : 'bg-surface-container hover:bg-surface-container-high text-on-surface-variant'
                }`}
              >
                सभी (All)
              </button>
              <button
                onClick={() => setSelectedCategory('veg')}
                className={`px-space-md py-1.5 rounded-full font-label-md text-label-md font-semibold transition-colors cursor-pointer ${
                  selectedCategory === 'veg'
                    ? 'bg-primary text-on-primary'
                    : 'bg-surface-container hover:bg-surface-container-high text-on-surface-variant'
                }`}
              >
                सब्जियां
              </button>
              <button
                onClick={() => setSelectedCategory('grain')}
                className={`px-space-md py-1.5 rounded-full font-label-md text-label-md font-semibold transition-colors cursor-pointer ${
                  selectedCategory === 'grain'
                    ? 'bg-primary text-on-primary'
                    : 'bg-surface-container hover:bg-surface-container-high text-on-surface-variant'
                }`}
              >
                अनाज व दलहन
              </button>
              <Link
                to="/mandi-rates"
                className="ml-space-sm font-label-lg text-label-lg text-primary hover:text-secondary font-bold flex items-center"
              >
                सभी देखें →
              </Link>
            </div>
          </div>

          {/* Price Rate Cards Grid (5 Major Crops) */}
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-space-md">
            {/* 1. Tomato */}
            {(selectedCategory === 'all' || selectedCategory === 'veg') && (
              <div className="bg-surface-container-lowest rounded-2xl p-space-md shadow-sm hover:shadow-md transition-shadow flex flex-col justify-between gap-space-sm relative overflow-hidden group border border-surface-container">
                <div className="flex items-start justify-between">
                  <div className="flex items-center gap-space-sm">
                    <div className="w-12 h-12 rounded-xl bg-error-container/40 flex items-center justify-center text-error">
                      <span className="material-symbols-outlined text-[28px]">nutrition</span>
                    </div>
                    <div>
                      <h3 className="font-title-md text-title-md font-bold text-on-surface">टमाटर</h3>
                      <span className="font-body-sm text-body-sm text-outline">Tomato (हाइब्रिड)</span>
                    </div>
                  </div>
                  <span className="inline-flex items-center text-secondary font-label-sm text-label-sm font-bold bg-secondary-fixed/30 px-1.5 py-0.5 rounded">
                    +12% <span className="material-symbols-outlined text-[14px]">arrow_upward</span>
                  </span>
                </div>
                <div className="my-space-xs">
                  <div className="flex items-baseline gap-1">
                    <span className="font-display-lg text-display-lg font-bold text-primary">₹ 2,400</span>
                    <span className="font-body-sm text-body-sm text-on-surface-variant">/ क्विंटल</span>
                  </div>
                  <div className="flex items-center gap-1 text-on-surface-variant font-label-sm text-label-sm mt-1">
                    <span className="material-symbols-outlined text-[16px] text-secondary">check_circle</span>
                    <span>रायपुर मंडी • आज लाइव</span>
                  </div>
                </div>
                {/* Sparkline SVG */}
                <div className="w-full pt-space-xs bg-surface-container-low p-2 rounded-xl">
                  <div className="flex justify-between font-label-sm text-label-sm text-outline mb-1">
                    <span>7 दिन का रुझान</span>
                    <span className="text-secondary font-semibold">मजबूत</span>
                  </div>
                  <svg className="w-full h-8 text-secondary" fill="none" preserveAspectRatio="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 100 24">
                    <polyline points="0,20 18,17 36,19 54,12 72,14 90,6 100,4" strokeLinecap="round" strokeLinejoin="round" />
                  </svg>
                </div>
              </div>
            )}

            {/* 2. Onion */}
            {(selectedCategory === 'all' || selectedCategory === 'veg') && (
              <div className="bg-surface-container-lowest rounded-2xl p-space-md shadow-sm hover:shadow-md transition-shadow flex flex-col justify-between gap-space-sm relative overflow-hidden group border border-surface-container">
                <div className="flex items-start justify-between">
                  <div className="flex items-center gap-space-sm">
                    <div className="w-12 h-12 rounded-xl bg-surface-container-high flex items-center justify-center text-primary">
                      <span className="material-symbols-outlined text-[28px]">eco</span>
                    </div>
                    <div>
                      <h3 className="font-title-md text-title-md font-bold text-on-surface">प्याज</h3>
                      <span className="font-body-sm text-body-sm text-outline">Nashik Onion</span>
                    </div>
                  </div>
                  <span className="inline-flex items-center text-secondary font-label-sm text-label-sm font-bold bg-secondary-fixed/30 px-1.5 py-0.5 rounded">
                    +4% <span className="material-symbols-outlined text-[14px]">arrow_upward</span>
                  </span>
                </div>
                <div className="my-space-xs">
                  <div className="flex items-baseline gap-1">
                    <span className="font-display-lg text-display-lg font-bold text-primary">₹ 1,800</span>
                    <span className="font-body-sm text-body-sm text-on-surface-variant">/ क्विंटल</span>
                  </div>
                  <div className="flex items-center gap-1 text-on-surface-variant font-label-sm text-label-sm mt-1">
                    <span className="material-symbols-outlined text-[16px] text-secondary">check_circle</span>
                    <span>दुर्ग मंडी • आज लाइव</span>
                  </div>
                </div>
                <div className="w-full pt-space-xs bg-surface-container-low p-2 rounded-xl">
                  <div className="flex justify-between font-label-sm text-label-sm text-outline mb-1">
                    <span>7 दिन का रुझान</span>
                    <span className="text-on-surface-variant font-semibold">स्थिर</span>
                  </div>
                  <svg className="w-full h-8 text-on-surface-variant" fill="none" preserveAspectRatio="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 100 24">
                    <polyline points="0,15 20,14 40,16 60,13 80,14 100,12" strokeLinecap="round" strokeLinejoin="round" />
                  </svg>
                </div>
              </div>
            )}

            {/* 3. Potato */}
            {(selectedCategory === 'all' || selectedCategory === 'veg') && (
              <div className="bg-surface-container-lowest rounded-2xl p-space-md shadow-sm hover:shadow-md transition-shadow flex flex-col justify-between gap-space-sm relative overflow-hidden group border border-surface-container">
                <div className="flex items-start justify-between">
                  <div className="flex items-center gap-space-sm">
                    <div className="w-12 h-12 rounded-xl bg-tertiary-fixed/30 flex items-center justify-center text-tertiary">
                      <span className="material-symbols-outlined text-[28px]">spa</span>
                    </div>
                    <div>
                      <h3 className="font-title-md text-title-md font-bold text-on-surface">आलू</h3>
                      <span className="font-body-sm text-body-sm text-outline">Potato Jyoti</span>
                    </div>
                  </div>
                  <span className="inline-flex items-center text-error font-label-sm text-label-sm font-bold bg-error-container/40 px-1.5 py-0.5 rounded">
                    -2% <span className="material-symbols-outlined text-[14px]">arrow_downward</span>
                  </span>
                </div>
                <div className="my-space-xs">
                  <div className="flex items-baseline gap-1">
                    <span className="font-display-lg text-display-lg font-bold text-primary">₹ 1,600</span>
                    <span className="font-body-sm text-body-sm text-on-surface-variant">/ क्विंटल</span>
                  </div>
                  <div className="flex items-center gap-1 text-on-surface-variant font-label-sm text-label-sm mt-1">
                    <span className="material-symbols-outlined text-[16px] text-secondary">check_circle</span>
                    <span>बिलासपुर मंडी • आज</span>
                  </div>
                </div>
                <div className="w-full pt-space-xs bg-surface-container-low p-2 rounded-xl">
                  <div className="flex justify-between font-label-sm text-label-sm text-outline mb-1">
                    <span>7 दिन का रुझान</span>
                    <span className="text-error font-semibold">गिरावट</span>
                  </div>
                  <svg className="w-full h-8 text-error" fill="none" preserveAspectRatio="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 100 24">
                    <polyline points="0,8 20,10 40,9 60,15 80,16 100,20" strokeLinecap="round" strokeLinejoin="round" />
                  </svg>
                </div>
              </div>
            )}

            {/* 4. Wheat */}
            {(selectedCategory === 'all' || selectedCategory === 'grain') && (
              <div className="bg-surface-container-lowest rounded-2xl p-space-md shadow-sm hover:shadow-md transition-shadow flex flex-col justify-between gap-space-sm relative overflow-hidden group border border-surface-container">
                <div className="flex items-start justify-between">
                  <div className="flex items-center gap-space-sm">
                    <div className="w-12 h-12 rounded-xl bg-tertiary-fixed flex items-center justify-center text-tertiary-container">
                      <span className="material-symbols-outlined text-[28px]">grass</span>
                    </div>
                    <div>
                      <h3 className="font-title-md text-title-md font-bold text-on-surface">गेहूँ</h3>
                      <span className="font-body-sm text-body-sm text-outline">Lokwan Wheat</span>
                    </div>
                  </div>
                  <span className="inline-flex items-center text-secondary font-label-sm text-label-sm font-bold bg-secondary-fixed/30 px-1.5 py-0.5 rounded">
                    +5% <span className="material-symbols-outlined text-[14px]">arrow_upward</span>
                  </span>
                </div>
                <div className="my-space-xs">
                  <div className="flex items-baseline gap-1">
                    <span className="font-display-lg text-display-lg font-bold text-primary">₹ 2,200</span>
                    <span className="font-body-sm text-body-sm text-on-surface-variant">/ क्विंटल</span>
                  </div>
                  <div className="flex items-center gap-1 text-on-surface-variant font-label-sm text-label-sm mt-1">
                    <span className="material-symbols-outlined text-[16px] text-secondary">check_circle</span>
                    <span>जगदलपुर मंडी • आज</span>
                  </div>
                </div>
                <div className="w-full pt-space-xs bg-surface-container-low p-2 rounded-xl">
                  <div className="flex justify-between font-label-sm text-label-sm text-outline mb-1">
                    <span>7 दिन का रुझान</span>
                    <span className="text-secondary font-semibold">तेजी</span>
                  </div>
                  <svg className="w-full h-8 text-secondary" fill="none" preserveAspectRatio="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 100 24">
                    <polyline points="0,18 25,16 50,12 75,10 100,5" strokeLinecap="round" strokeLinejoin="round" />
                  </svg>
                </div>
              </div>
            )}

            {/* 5. Gram / Chana */}
            {(selectedCategory === 'all' || selectedCategory === 'grain') && (
              <div className="bg-surface-container-lowest rounded-2xl p-space-md shadow-sm hover:shadow-md transition-shadow flex flex-col justify-between gap-space-sm relative overflow-hidden group border border-surface-container">
                <div className="flex items-start justify-between">
                  <div className="flex items-center gap-space-sm">
                    <div className="w-12 h-12 rounded-xl bg-primary-fixed flex items-center justify-center text-primary">
                      <span className="material-symbols-outlined text-[28px]">grain</span>
                    </div>
                    <div>
                      <h3 className="font-title-md text-title-md font-bold text-on-surface">चना</h3>
                      <span className="font-body-sm text-body-sm text-outline">Desi Chana</span>
                    </div>
                  </div>
                  <span className="inline-flex items-center text-secondary font-label-sm text-label-sm font-bold bg-secondary-fixed/30 px-1.5 py-0.5 rounded">
                    +8% <span className="material-symbols-outlined text-[14px]">arrow_upward</span>
                  </span>
                </div>
                <div className="my-space-xs">
                  <div className="flex items-baseline gap-1">
                    <span className="font-display-lg text-display-lg font-bold text-primary">₹ 4,400</span>
                    <span className="font-body-sm text-body-sm text-on-surface-variant">/ क्विंटल</span>
                  </div>
                  <div className="flex items-center gap-1 text-on-surface-variant font-label-sm text-label-sm mt-1">
                    <span className="material-symbols-outlined text-[16px] text-secondary">check_circle</span>
                    <span>राजनांदगांव मंडी • आज</span>
                  </div>
                </div>
                <div className="w-full pt-space-xs bg-surface-container-low p-2 rounded-xl">
                  <div className="flex justify-between font-label-sm text-label-sm text-outline mb-1">
                    <span>7 दिन का रुझान</span>
                    <span className="text-secondary font-semibold">उच्च मांग</span>
                  </div>
                  <svg className="w-full h-8 text-secondary" fill="none" preserveAspectRatio="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 100 24">
                    <polyline points="0,19 25,15 50,14 75,9 100,4" strokeLinecap="round" strokeLinejoin="round" />
                  </svg>
                </div>
              </div>
            )}
          </div>
        </section>

        {/* Two-Column Asymmetric Deep-Dive Section: Mandi Comparison Engine & Weather/Field Advisory */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-gutter-lg">
          {/* Left Column: Mandi Comparison Snapshot (7 cols) */}
          <div className="lg:col-span-7 bg-surface-container-lowest rounded-2xl p-space-lg shadow-sm flex flex-col justify-between gap-space-md border border-surface-container">
            <div>
              <div className="flex items-center justify-between pb-space-xs">
                <div className="flex items-center gap-space-xs">
                  <span className="material-symbols-outlined text-primary text-[24px]">compare_arrows</span>
                  <h3 className="font-headline-md text-headline-md text-on-surface font-bold">
                    आसपास की मंडियों की तुलना (टमाटर)
                  </h3>
                </div>
                <span className="font-label-sm text-label-sm text-outline">आधार: 20 क्विंटल उपज</span>
              </div>
              <p className="font-body-sm text-body-sm text-on-surface-variant">
                MandiMind AI ने दूरी, डीजल खर्च और मौजूदा बोली को जोड़कर वास्तविक शुद्ध बचत का आंकलन किया है:
              </p>
            </div>

            {/* Comparison Table */}
            <div className="w-full overflow-x-auto">
              <table className="w-full text-left font-body-sm text-body-sm">
                <thead>
                  <tr className="bg-surface-container text-on-surface-variant font-label-md text-label-md">
                    <th className="py-2.5 px-space-sm rounded-l-lg">मंडी का नाम</th>
                    <th className="py-2.5 px-space-sm text-right">दूरी</th>
                    <th className="py-2.5 px-space-sm text-right">अनुमानित भाव</th>
                    <th className="py-2.5 px-space-sm text-right">कुल लागत</th>
                    <th className="py-2.5 px-space-sm text-right font-bold text-primary">शुद्ध लाभ</th>
                    <th className="py-2.5 px-space-sm text-center rounded-r-lg">सिफ़ारिश</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-surface-container">
                  <tr className="bg-primary-fixed/20">
                    <td className="py-3 px-space-sm font-title-md text-title-md font-bold text-primary">
                      १. राजनांदगांव मंडी
                    </td>
                    <td className="py-3 px-space-sm text-right text-on-surface-variant">85 किमी</td>
                    <td className="py-3 px-space-sm text-right font-semibold">₹ 1,900 / क्वि.</td>
                    <td className="py-3 px-space-sm text-right text-error font-medium">₹ 6,500</td>
                    <td className="py-3 px-space-sm text-right font-bold text-secondary text-title-md">₹ 38,500</td>
                    <td className="py-3 px-space-sm text-center">
                      <span className="bg-secondary text-on-secondary px-2.5 py-1 rounded-full font-label-sm text-label-sm font-bold">
                        उत्तम
                      </span>
                    </td>
                  </tr>
                  <tr>
                    <td className="py-3 px-space-sm font-semibold text-on-surface">२. दुर्ग मंडी</td>
                    <td className="py-3 px-space-sm text-right text-on-surface-variant">50 किमी</td>
                    <td className="py-3 px-space-sm text-right">₹ 1,750 / क्वि.</td>
                    <td className="py-3 px-space-sm text-right text-error">₹ 5,800</td>
                    <td className="py-3 px-space-sm text-right font-semibold text-on-surface">₹ 34,200</td>
                    <td className="py-3 px-space-sm text-center">
                      <span className="bg-surface-container-high text-on-surface-variant px-2 py-0.5 rounded font-label-sm text-label-sm">
                        अच्छा
                      </span>
                    </td>
                  </tr>
                  <tr>
                    <td className="py-3 px-space-sm font-semibold text-on-surface">३. रायपुर मंडी</td>
                    <td className="py-3 px-space-sm text-right text-on-surface-variant">25 किमी</td>
                    <td className="py-3 px-space-sm text-right">₹ 2,000 / क्वि.</td>
                    <td className="py-3 px-space-sm text-right text-error">₹ 7,500</td>
                    <td className="py-3 px-space-sm text-right font-semibold text-on-surface">₹ 32,000</td>
                    <td className="py-3 px-space-sm text-center">
                      <span className="bg-surface-container text-on-surface-variant px-2 py-0.5 rounded font-label-sm text-label-sm">
                        ठीक
                      </span>
                    </td>
                  </tr>
                </tbody>
              </table>
            </div>

            <div className="flex items-center justify-between pt-space-xs text-on-surface-variant font-body-sm text-body-sm">
              <span>नोट: दूरी सड़क मार्ग की है। लागत में लोडिंग-अनलोडिंग व टोल शामिल है।</span>
              <Link
                to="/best-mandi"
                className="font-label-md text-label-md text-primary font-bold hover:underline"
              >
                विस्तृत रिपोर्ट खोलें →
              </Link>
            </div>
          </div>

          {/* Right Column: Regional Weather & Seasonal Crop Tip (5 cols) */}
          <div className="lg:col-span-5 flex flex-col gap-space-md">
            {/* Live Weather Card */}
            <div className="bg-surface-container-lowest rounded-2xl p-space-md shadow-sm flex flex-col justify-between border border-surface-container">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-space-xs">
                  <span className="material-symbols-outlined text-[24px] text-surface-tint">wb_cloudy</span>
                  <h3 className="font-headline-sm text-headline-sm text-on-surface font-bold">
                    मौसम पूर्वानुमान (Raipur)
                  </h3>
                </div>
                <Link to="/weather" className="font-label-sm text-label-sm text-primary font-semibold hover:underline">
                  3 दिन का हाल
                </Link>
              </div>

              <div className="flex items-center justify-between my-space-sm">
                <div className="flex items-center gap-space-md">
                  <span className="material-symbols-outlined text-[48px] text-tertiary-fixed-dim">
                    partly_cloudy_day
                  </span>
                  <div>
                    <span className="font-display-lg text-display-lg font-bold text-on-surface">28°C</span>
                    <p className="font-body-sm text-body-sm text-on-surface-variant">
                      नमी: 68% • हवा: 11 किमी/घंटा
                    </p>
                  </div>
                </div>
                <div className="text-right">
                  <span className="font-label-md text-label-md text-secondary font-bold">कटाई के अनुकूल</span>
                  <p className="font-label-sm text-label-sm text-outline">अगले 48 घंटे वर्षा नहीं</p>
                </div>
              </div>

              <div className="grid grid-cols-3 gap-2 bg-surface-container-low p-2 rounded-xl text-center font-body-sm text-body-sm">
                <div className="flex flex-col">
                  <span className="text-outline font-label-sm text-label-sm">कल (Tomorrow)</span>
                  <span className="font-semibold text-on-surface">29° / 19°</span>
                  <span className="text-secondary font-label-sm text-label-sm">धूप खिली रहेगी</span>
                </div>
                <div className="flex flex-col">
                  <span className="text-outline font-label-sm text-label-sm">परसों</span>
                  <span className="font-semibold text-on-surface">31° / 20°</span>
                  <span className="text-secondary font-label-sm text-label-sm">साफ मौसम</span>
                </div>
                <div className="flex flex-col">
                  <span className="text-outline font-label-sm text-label-sm">गुरुवार</span>
                  <span className="font-semibold text-on-surface">27° / 18°</span>
                  <span className="text-on-tertiary-fixed-variant font-label-sm text-label-sm">हल्के बादल</span>
                </div>
              </div>
            </div>

            {/* Expert Advisory / Video Tip Card */}
            <div className="bg-surface-container-lowest rounded-2xl p-space-md shadow-sm flex items-center gap-space-md border border-surface-container">
              <div className="w-24 h-24 rounded-xl overflow-hidden shrink-0 shadow-sm relative">
                <img
                  className="w-full h-full object-cover"
                  alt="Agronomist expert inspecting crop"
                  src="https://lh3.googleusercontent.com/aida-public/AB6AXuAceiwonce4vxdO4nd9X51drl09EXPYoad8_HVGn1dWq2ixFGuOKIbBU0AAxlyZh7y0m_HcN9_92AFQCGx07VR_0PrGQDp92Qyh42Nm3z51MHLLmGAb-0MqTHJE-Yy855ILOfRSwLyGUzy8s1Qzzb0OJyGv7qdvURBGYoJ_dvs8AFY4FYSMFAao6h4VURLpd8OPR5skSmVGOV3nhGwQOc1L0wp1lM--qP14P7Pd77cbpNLHgr4oWggA"
                />
                <div className="absolute inset-0 bg-primary/20 flex items-center justify-center">
                  <span className="material-symbols-outlined text-surface-bright text-[28px]">play_circle</span>
                </div>
              </div>
              <div className="flex flex-col justify-between">
                <span className="font-label-sm text-label-sm text-secondary font-bold uppercase">
                  विशेषज्ञ सलाह • Crop Care
                </span>
                <h4 className="font-title-md text-title-md font-bold text-on-surface line-clamp-2">
                  टमाटर में झुलसा रोग (Blight) से बचाव हेतु छिड़काव सलाह
                </h4>
                <Link
                  to="/crop-care"
                  className="font-label-md text-label-md text-primary font-semibold hover:underline inline-flex items-center gap-0.5 mt-1"
                >
                  उपचार देखें
                  <span className="material-symbols-outlined text-[16px]">chevron_right</span>
                </Link>
              </div>
            </div>
          </div>
        </div>

        {/* Offline Resilience Banner & Kisan Call Centre Helper */}
        <div className="w-full bg-surface-container-low rounded-2xl p-space-md flex flex-col md:flex-row items-center justify-between gap-space-md border border-surface-container">
          <div className="flex items-center gap-space-md">
            <div className="w-12 h-12 rounded-xl bg-surface-container-lowest text-secondary flex items-center justify-center shadow-sm">
              <span className="material-symbols-outlined text-[28px]">wifi_tethering</span>
            </div>
            <div>
              <h4 className="font-title-md text-title-md font-bold text-on-surface">
                {t.offlineReadyNotice}
              </h4>
              <p className="font-body-sm text-body-sm text-on-surface-variant">
                खेत में नेटवर्क न होने पर भी आप पहले से डाउनलोड किए गए मंडी भाव व अपनी रसीदें देख सकते हैं।
              </p>
            </div>
          </div>
          <div className="flex items-center gap-space-sm shrink-0">
            <a
              href="tel:18001801551"
              className="bg-surface-container-lowest text-primary hover:bg-surface-container font-label-md text-label-md font-semibold px-space-md py-2 rounded-xl shadow-sm inline-flex items-center gap-1.5 transition-colors"
            >
              <span className="material-symbols-outlined text-[18px] text-secondary">support_agent</span>
              <span>{t.kisanCallCenter}</span>
            </a>
          </div>
        </div>
      </div>
    </div>
  );
};
