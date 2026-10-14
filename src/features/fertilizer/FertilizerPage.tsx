import React, { useState } from 'react';
import { services } from '../../services/serviceRegistry';
import { FertilizerRecommendation } from '../../types/app.types';

export const FertilizerPage: React.FC = () => {
  const [selectedCrop, setSelectedCrop] = useState('Tomato');
  const [areaAcres, setAreaAcres] = useState(2);
  const [soilType, setSoilType] = useState<'clay' | 'loam' | 'sandy' | 'black_cotton'>('loam');

  const recommendation: FertilizerRecommendation = services.fertilizer.calculateDosage(
    selectedCrop,
    areaAcres,
    soilType
  );

  return (
    <div className="max-w-[1280px] mx-auto px-4 md:px-margin-lg py-space-xl space-y-space-xl">
      {/* Page Header */}
      <div className="flex flex-col md:flex-row md:items-end justify-between gap-space-md">
        <div className="space-y-space-xs">
          <div className="inline-flex items-center gap-space-xs px-space-sm py-0.5 rounded-full bg-primary-fixed text-primary font-label-sm text-label-sm uppercase tracking-wide">
            <span className="material-symbols-outlined text-[14px]">science</span>
            <span>सटीक पोषण प्रबंधन (Nutrient Calculator)</span>
          </div>
          <h1 className="font-headline-lg text-headline-lg text-primary font-bold">
            खाद एवं कीटनाशक मात्रा कैलकुलेटर
          </h1>
          <p className="font-body-md text-body-md text-on-surface-variant max-w-2xl">
            खेत के रकबे, मिट्टी के प्रकार और फसल के अनुसार यूरिया, डीएपी (DAP), और पोटाश (MOP) की सटीक बोरियों की गणना करें।
          </p>
        </div>
      </div>

      {/* Input Console */}
      <div className="bg-surface-container-lowest p-space-md md:p-space-lg rounded-2xl shadow-sm border border-surface-container grid grid-cols-1 md:grid-cols-3 gap-space-md">
        {/* Crop Selection */}
        <div>
          <label className="block text-label-md text-on-surface-variant mb-1 font-medium">फसल का चयन करें:</label>
          <select
            value={selectedCrop}
            onChange={(e) => setSelectedCrop(e.target.value)}
            className="w-full p-3 bg-surface-container-low rounded-xl border text-body-md font-semibold text-primary"
          >
            <option value="Tomato">🍅 टमाटर (Tomato)</option>
            <option value="Paddy">🌾 धान (Paddy)</option>
            <option value="Wheat">🌿 गेहूँ (Wheat)</option>
            <option value="Onion">🧅 प्याज (Onion)</option>
            <option value="Chana">🌱 चना (Gram)</option>
          </select>
        </div>

        {/* Acreage Slider */}
        <div>
          <div className="flex justify-between items-center mb-1">
            <label className="text-label-md text-on-surface-variant font-medium">खेत का क्षेत्रफल:</label>
            <span className="font-title-md text-title-md font-bold text-primary">{areaAcres} एकड़ (Acres)</span>
          </div>
          <input
            type="range"
            min="0.5"
            max="25"
            step="0.5"
            value={areaAcres}
            onChange={(e) => setAreaAcres(Number(e.target.value))}
            className="w-full accent-primary mt-2"
          />
          <div className="flex justify-between text-[11px] text-outline mt-1">
            <span>0.5 एकड़</span>
            <span>12 एकड़</span>
            <span>25 एकड़</span>
          </div>
        </div>

        {/* Soil Type */}
        <div>
          <label className="block text-label-md text-on-surface-variant mb-1 font-medium">मिट्टी का प्रकार (Soil Type):</label>
          <select
            value={soilType}
            onChange={(e) => setSoilType(e.target.value as any)}
            className="w-full p-3 bg-surface-container-low rounded-xl border text-body-md"
          >
            <option value="loam">दोमट मिट्टी (Loamy Soil - सामान्य)</option>
            <option value="clay">चिकनी / मटासी मिट्टी (Clay Soil)</option>
            <option value="black_cotton">काली मिट्टी (Black Cotton Soil)</option>
            <option value="sandy">बलुई मिट्टी (Sandy Soil)</option>
          </select>
        </div>
      </div>

      {/* Recommended Bags Bento Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-space-md">
        {/* DAP Bag Card */}
        <div className="bg-surface-container-lowest p-space-md rounded-2xl border border-surface-container shadow-sm flex flex-col justify-between">
          <div className="flex items-start justify-between">
            <div>
              <span className="text-label-sm text-label-sm text-outline uppercase font-semibold">फॉस्फोरस + नाइट्रोजन</span>
              <h3 className="font-headline-sm text-headline-sm text-primary font-bold">डीएपी (DAP)</h3>
            </div>
            <div className="w-10 h-10 rounded-full bg-primary-fixed/40 text-primary flex items-center justify-center font-bold">
              18:46
            </div>
          </div>
          <div className="my-space-md">
            <span className="text-display-lg font-bold text-primary block">{recommendation.dapBags} बोरी</span>
            <span className="text-body-sm text-on-surface-variant">कुल वजन: {recommendation.dapKg} किग्रा (50kg बोरी)</span>
          </div>
          <div className="pt-2 border-t border-surface-container text-[12px] text-outline">
            बुवाई के समय खेत में डालें (Basal Dose)
          </div>
        </div>

        {/* Urea Bag Card */}
        <div className="bg-surface-container-lowest p-space-md rounded-2xl border border-surface-container shadow-sm flex flex-col justify-between">
          <div className="flex items-start justify-between">
            <div>
              <span className="text-label-sm text-label-sm text-outline uppercase font-semibold">नाइट्रोजन (N)</span>
              <h3 className="font-headline-sm text-headline-sm text-primary font-bold">नीम लेपित यूरिया</h3>
            </div>
            <div className="w-10 h-10 rounded-full bg-secondary-container text-on-secondary-container flex items-center justify-center font-bold">
              46% N
            </div>
          </div>
          <div className="my-space-md">
            <span className="text-display-lg font-bold text-secondary block">{recommendation.ureaBags} बोरी</span>
            <span className="text-body-sm text-on-surface-variant">कुल वजन: {recommendation.ureaKg} किग्रा (45kg बोरी)</span>
          </div>
          <div className="pt-2 border-t border-surface-container text-[12px] text-outline">
            3 चरणों में विभाजित करके डालें (Top Dressing)
          </div>
        </div>

        {/* MOP (Potash) Card */}
        <div className="bg-surface-container-lowest p-space-md rounded-2xl border border-surface-container shadow-sm flex flex-col justify-between">
          <div className="flex items-start justify-between">
            <div>
              <span className="text-label-sm text-label-sm text-outline uppercase font-semibold">पोटाश (K2O)</span>
              <h3 className="font-headline-sm text-headline-sm text-primary font-bold">म्यूरिएट ऑफ पोटाश (MOP)</h3>
            </div>
            <div className="w-10 h-10 rounded-full bg-tertiary-fixed text-tertiary flex items-center justify-center font-bold">
              60% K
            </div>
          </div>
          <div className="my-space-md">
            <span className="text-display-lg font-bold text-tertiary block">{recommendation.mopBags} बोरी</span>
            <span className="text-body-sm text-on-surface-variant">कुल वजन: {recommendation.mopKg} किग्रा (50kg बोरी)</span>
          </div>
          <div className="pt-2 border-t border-surface-container text-[12px] text-outline">
            फलों के रंग व रोग प्रतिरोधक क्षमता हेतु
          </div>
        </div>

        {/* Total Cost Card */}
        <div className="bg-surface-container-lowest p-space-md rounded-2xl border border-surface-container shadow-sm flex flex-col justify-between">
          <div>
            <span className="text-label-sm text-label-sm text-outline uppercase font-semibold">अनुमानित सरकारी दर</span>
            <h3 className="font-headline-sm text-headline-sm text-on-surface font-bold">कुल अनुमानित खर्च</h3>
          </div>
          <div className="my-space-md">
            <span className="text-display-lg font-bold text-primary block">
              ₹ {recommendation.estimatedCost.toLocaleString('en-IN')}
            </span>
            <span className="text-body-sm text-secondary font-medium">जिंक सल्फेट {recommendation.zincSulphateKg} किग्रा शामिल</span>
          </div>
          <div className="pt-2 border-t border-surface-container text-[12px] text-outline">
            पैक्स समिति / इफको सरकारी दर आधार
          </div>
        </div>
      </div>

      {/* Application Schedule Timeline */}
      <div className="bg-surface-container-lowest p-space-lg rounded-3xl shadow-sm border border-surface-container space-y-space-md">
        <h3 className="font-headline-sm text-headline-sm text-primary font-bold flex items-center gap-2">
          <span className="material-symbols-outlined text-[24px]">schedule</span>
          उर्वरक देने की वैज्ञानिक समय-सारणी (Split Dosage Schedule)
        </h3>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-space-md">
          {recommendation.applicationSchedule.map((stage, idx) => (
            <div key={idx} className="bg-surface-container-low p-space-md rounded-2xl border border-surface-container space-y-2">
              <span className="w-7 h-7 rounded-full bg-primary text-on-primary font-bold text-body-sm flex items-center justify-center">
                {idx + 1}
              </span>
              <h4 className="font-title-md text-title-md font-bold text-on-surface">{stage.stage}</h4>
              <p className="text-body-sm text-primary font-semibold">{stage.fertilizerDose}</p>
              <p className="text-[12px] text-on-surface-variant">{stage.waterRequirement}</p>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};
