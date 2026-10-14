import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { services } from '../../services/serviceRegistry';

export const MandiComparisonPage: React.FC = () => {
  const [selectedCrop, setSelectedCrop] = useState('tomato');
  const [quantity, setQuantity] = useState(25);
  const [farmerLocation, setFarmerLocation] = useState('रायपुर');
  const [dieselPrice, setDieselPrice] = useState(94);

  // Mandis to compare
  const comparisonItems = [
    {
      name: 'राजनांदगांव APMC मंडी',
      distanceKm: 85,
      ratePerQ: selectedCrop === 'tomato' ? 2200 : selectedCrop === 'onion' ? 1850 : 2250,
      handlingFeePerQ: 30,
      toll: 65,
      transitHours: '1 घंटा 45 मिनट',
      recommendation: 'सर्वोत्तम (Best Returns)',
      isWinner: true,
    },
    {
      name: 'दुर्ग फल एवं सब्जी मंडी',
      distanceKm: 50,
      ratePerQ: selectedCrop === 'tomato' ? 1950 : selectedCrop === 'onion' ? 1720 : 2100,
      handlingFeePerQ: 28,
      toll: 0,
      transitHours: '1 घंटा 10 मिनट',
      recommendation: 'मध्यम (Moderate)',
      isWinner: false,
    },
    {
      name: 'रायपुर स्थानीय मंडी (पंडरी)',
      distanceKm: 25,
      ratePerQ: selectedCrop === 'tomato' ? 1750 : selectedCrop === 'onion' ? 1600 : 2050,
      handlingFeePerQ: 25,
      toll: 0,
      transitHours: '45 मिनट',
      recommendation: 'नजदीक (Low Freight)',
      isWinner: false,
    },
    {
      name: 'बिलासपुर तिफरा मंडी',
      distanceKm: 110,
      ratePerQ: selectedCrop === 'tomato' ? 1650 : selectedCrop === 'onion' ? 1550 : 2000,
      handlingFeePerQ: 35,
      toll: 110,
      transitHours: '2 घंटे 30 मिनट',
      recommendation: 'कम लाभ (High Distance)',
      isWinner: false,
    },
  ];

  return (
    <div className="max-w-[1280px] mx-auto px-4 md:px-margin-lg py-space-xl space-y-space-xl">
      {/* Page Header */}
      <div className="flex flex-col md:flex-row md:items-end justify-between gap-space-md">
        <div className="space-y-space-xs">
          <div className="inline-flex items-center gap-space-xs px-space-sm py-0.5 rounded-full bg-primary-fixed/40 text-on-primary-fixed-variant font-label-sm text-label-sm uppercase tracking-wide">
            <span className="material-symbols-outlined text-[14px]">compare_arrows</span>
            <span>निकटवर्ती मंडी तुलना उपकरण</span>
          </div>
          <h1 className="font-headline-lg text-headline-lg text-primary font-bold">
            आसपास की मंडियों की विस्तृत तुलना
          </h1>
          <p className="font-body-md text-body-md text-on-surface-variant max-w-2xl">
            दूरी, डीजल खर्च, मंडी तुलाई शुल्क और संभावित शुद्ध लाभ की पारदर्शी तुलना करके जानें अपनी उपज का सही गंतव्य।
          </p>
        </div>
      </div>

      {/* Interactive Controls Bar */}
      <div className="bg-surface-container-lowest p-space-md md:p-space-lg rounded-2xl shadow-sm border border-surface-container grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-space-md">
        <div>
          <label className="block text-label-md text-on-surface-variant mb-1 font-medium">फसल का चयन करें:</label>
          <select
            value={selectedCrop}
            onChange={(e) => setSelectedCrop(e.target.value)}
            className="w-full p-2.5 bg-surface-container-low rounded-lg border text-body-md"
          >
            <option value="tomato">🍅 टमाटर (Tomato)</option>
            <option value="onion">🧅 प्याज (Onion)</option>
            <option value="wheat">🌾 गेहूँ (Wheat)</option>
          </select>
        </div>

        <div>
          <label className="block text-label-md text-on-surface-variant mb-1 font-medium">
            उपज मात्रा: <strong>{quantity} क्विंटल</strong>
          </label>
          <input
            type="range"
            min="5"
            max="100"
            step="5"
            value={quantity}
            onChange={(e) => setQuantity(Number(e.target.value))}
            className="w-full accent-primary mt-2"
          />
        </div>

        <div>
          <label className="block text-label-md text-on-surface-variant mb-1 font-medium">आपका गांव/स्थान:</label>
          <input
            type="text"
            value={farmerLocation}
            onChange={(e) => setFarmerLocation(e.target.value)}
            className="w-full p-2.5 bg-surface-container-low rounded-lg border text-body-md"
          />
        </div>

        <div>
          <label className="block text-label-md text-on-surface-variant mb-1 font-medium">डीजल दर (₹/लीटर):</label>
          <input
            type="number"
            value={dieselPrice}
            onChange={(e) => setDieselPrice(Number(e.target.value))}
            className="w-full p-2.5 bg-surface-container-low rounded-lg border text-body-md"
          />
        </div>
      </div>

      {/* Comparison Cards Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-space-md">
        {comparisonItems.map((item, idx) => {
          const gross = quantity * item.ratePerQ;
          const freight = Math.round(item.distanceKm * 22) + item.toll;
          const handling = quantity * item.handlingFeePerQ;
          const spoilage = Math.round(gross * (item.distanceKm > 60 ? 0.04 : 0.02));
          const totalCost = freight + handling + spoilage;
          const net = gross - totalCost;
          const netPerQ = Math.round(net / quantity);

          return (
            <div
              key={item.name}
              className={`rounded-2xl p-space-md flex flex-col justify-between gap-space-md border transition-all ${
                item.isWinner
                  ? 'bg-secondary-container/15 border-secondary shadow-md ring-2 ring-secondary/30'
                  : 'bg-surface-container-lowest border-surface-container shadow-sm'
              }`}
            >
              <div className="space-y-space-xs">
                <div className="flex items-center justify-between">
                  <span className={`px-2 py-0.5 rounded text-[11px] font-bold ${
                    item.isWinner ? 'bg-secondary text-on-secondary' : 'bg-surface-container text-on-surface-variant'
                  }`}>
                    रैंक #{idx + 1}
                  </span>
                  <span className="text-[12px] font-semibold text-outline">{item.distanceKm} किमी</span>
                </div>

                <h3 className="font-title-md text-title-md font-bold text-primary">
                  {item.name}
                </h3>
                <p className="text-body-sm text-on-surface-variant">समय: {item.transitHours}</p>

                <div className="pt-2 border-t border-surface-container space-y-1 text-body-sm">
                  <div className="flex justify-between">
                    <span className="text-on-surface-variant">बोली भाव:</span>
                    <span className="font-bold text-primary">₹ {item.ratePerQ} /क्वि.</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-on-surface-variant">सकल आय:</span>
                    <span className="font-semibold text-on-surface">₹ {gross.toLocaleString('en-IN')}</span>
                  </div>
                  <div className="flex justify-between text-error">
                    <span>कुल भाड़ा व खर्च:</span>
                    <span className="font-semibold">− ₹ {totalCost.toLocaleString('en-IN')}</span>
                  </div>
                </div>
              </div>

              <div className="pt-space-xs border-t border-surface-container bg-surface-container-low p-space-sm rounded-xl">
                <span className="text-label-sm text-label-sm text-on-surface-variant block">शुद्ध लाभ (Net Profit):</span>
                <span className={`font-headline-sm text-headline-sm font-bold block ${item.isWinner ? 'text-secondary' : 'text-on-surface'}`}>
                  ₹ {net.toLocaleString('en-IN')}
                </span>
                <span className="text-[11px] text-outline">₹ {netPerQ} प्रति क्विंटल शुद्ध</span>
              </div>
            </div>
          );
        })}
      </div>

      {/* Return to Best Mandi Calculator */}
      <div className="bg-primary-fixed/20 p-space-md rounded-2xl flex flex-col sm:flex-row items-center justify-between gap-space-md border border-primary-fixed">
        <div className="flex items-center gap-space-md">
          <span className="material-symbols-outlined text-primary text-[32px]">auto_awesome</span>
          <div>
            <h4 className="font-title-md text-title-md font-bold text-primary">सर्वश्रेष्ठ मंडी सिफारिश पर जाएं</h4>
            <p className="font-body-sm text-body-sm text-on-surface">
              पूर्ण वित्तीय विवरण, रूट मैप और कमीशन रसीद के साथ AI सिफारिश देखें।
            </p>
          </div>
        </div>
        <Link
          to="/best-mandi"
          className="px-space-lg py-2.5 bg-primary text-on-primary font-bold rounded-xl shadow shrink-0"
        >
          बेस्ट मंडी खोलें →
        </Link>
      </div>
    </div>
  );
};
