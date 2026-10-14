import React, { useState, useEffect } from 'react';
import { services } from '../../services/serviceRegistry';
import { GovernmentScheme } from '../../types/app.types';

export const SchemesPage: React.FC = () => {
  const [schemes, setSchemes] = useState<GovernmentScheme[]>([]);
  const [selectedCategory, setSelectedCategory] = useState('all');
  const [searchQuery, setSearchQuery] = useState('');
  const [eligibilityModalScheme, setEligibilityModalScheme] = useState<GovernmentScheme | null>(null);

  useEffect(() => {
    loadSchemes();
  }, [selectedCategory, searchQuery]);

  const loadSchemes = async () => {
    const list = await services.schemes.getSchemes(selectedCategory, searchQuery);
    setSchemes(list);
  };

  return (
    <div className="max-w-[1280px] mx-auto px-4 md:px-margin-lg py-space-xl space-y-space-xl">
      {/* Page Header */}
      <div className="flex flex-col md:flex-row md:items-end justify-between gap-space-md">
        <div className="space-y-space-xs">
          <div className="inline-flex items-center gap-space-xs px-space-sm py-0.5 rounded-full bg-surface-container-high text-primary font-label-sm text-label-sm uppercase tracking-wide">
            <span className="material-symbols-outlined text-[14px]">account_balance</span>
            <span>केंद्रीय एवं राज्य सरकारी योजनाएं</span>
          </div>
          <h1 className="font-headline-lg text-headline-lg text-primary font-bold">
            सरकारी योजनाएं, सब्सिडी व वित्तीय लाभ
          </h1>
          <p className="font-body-md text-body-md text-on-surface-variant max-w-2xl">
            पीएम-किसान, फसल बीमा, सोलर पंप, गोदाम निर्माण व खाद सब्सिडी की विस्तृत जानकारी, आवश्यक दस्तावेज व पात्रता जांच।
          </p>
        </div>
      </div>

      {/* Filter and Search Bar */}
      <div className="bg-surface-container-lowest p-space-md rounded-2xl shadow-sm border border-surface-container flex flex-col sm:flex-row items-center justify-between gap-space-md">
        {/* Category Pills */}
        <div className="flex items-center gap-space-xs overflow-x-auto pb-1 w-full sm:w-auto">
          {[
            { id: 'all', label: 'सभी योजनाएं' },
            { id: 'subsidy', label: 'सब्सिडी व अनुदान' },
            { id: 'insurance', label: 'फसल बीमा (PMFBY)' },
            { id: 'irrigation', label: 'सिंचाई व सोलर (KUSUM)' },
            { id: 'infrastructure', label: 'ऋण व गोदाम (AIF)' },
          ].map((cat) => (
            <button
              key={cat.id}
              onClick={() => setSelectedCategory(cat.id)}
              className={`px-space-md py-1.5 rounded-full font-label-md text-label-md shrink-0 cursor-pointer ${
                selectedCategory === cat.id
                  ? 'bg-primary text-on-primary font-bold shadow-sm'
                  : 'bg-surface-container text-on-surface-variant hover:bg-surface-container-high'
              }`}
            >
              {cat.label}
            </button>
          ))}
        </div>

        {/* Search Input */}
        <div className="relative w-full sm:w-72">
          <span className="material-symbols-outlined absolute left-3 top-2.5 text-[20px] text-outline">
            search
          </span>
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="योजना का नाम खोजें..."
            className="w-full pl-10 pr-4 py-2 bg-surface-container-low rounded-xl border text-body-sm focus:outline-none focus:ring-2 focus:ring-primary"
          />
        </div>
      </div>

      {/* Schemes Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-space-lg">
        {schemes.map((scheme) => (
          <div
            key={scheme.id}
            className="bg-surface-container-lowest rounded-2xl p-space-lg shadow-sm border border-surface-container flex flex-col justify-between gap-space-md hover:shadow-md transition-shadow relative"
          >
            {scheme.isPopular && (
              <span className="absolute top-4 right-4 bg-tertiary-fixed text-on-tertiary-fixed font-label-sm text-label-sm px-2.5 py-0.5 rounded-full font-bold">
                लोकप्रिय
              </span>
            )}

            <div className="space-y-space-sm">
              <span className="font-label-sm text-label-sm text-secondary font-bold uppercase tracking-wider block">
                {scheme.categoryLabel}
              </span>
              <h3 className="font-headline-sm text-headline-sm text-primary font-bold">
                {scheme.titleHindi}
              </h3>
              <p className="font-body-sm text-body-sm text-on-surface-variant leading-relaxed">
                {scheme.shortDescriptionHindi}
              </p>

              {/* Grant Amount Highlight */}
              <div className="bg-primary-fixed/20 p-space-sm rounded-xl border border-primary-fixed">
                <span className="font-label-sm text-label-sm text-primary-fixed-dim block text-outline">
                  अनुदान व सहायता राशि:
                </span>
                <span className="font-title-md text-title-md font-bold text-primary">
                  {scheme.grantAmount}
                </span>
              </div>

              {/* Documents Checklist Preview */}
              <div className="space-y-1">
                <span className="text-[11px] font-bold text-outline uppercase">आवश्यक दस्तावेज:</span>
                <div className="flex flex-wrap gap-1">
                  {scheme.documentsRequired.map((doc) => (
                    <span
                      key={doc}
                      className="px-2 py-0.5 bg-surface-container rounded font-label-sm text-[11px] text-on-surface"
                    >
                      ✓ {doc}
                    </span>
                  ))}
                </div>
              </div>
            </div>

            {/* Action Row */}
            <div className="pt-space-sm border-t border-surface-container flex items-center justify-between gap-space-sm">
              <button
                onClick={() => setEligibilityModalScheme(scheme)}
                className="font-label-md text-label-md text-secondary font-semibold hover:underline cursor-pointer"
              >
                पात्रता विवरण देखें
              </button>
              <a
                href={scheme.officialPortalUrl}
                target="_blank"
                rel="noreferrer"
                className="px-space-md py-1.5 bg-primary text-on-primary font-label-md text-label-md font-semibold rounded-lg shadow-sm hover:bg-primary-container transition-colors inline-flex items-center gap-1"
              >
                <span>आवेदन पोर्टल</span>
                <span className="material-symbols-outlined text-[16px]">open_in_new</span>
              </a>
            </div>
          </div>
        ))}
      </div>

      {/* Eligibility Modal */}
      {eligibilityModalScheme && (
        <div className="fixed inset-0 z-50 bg-inverse-surface/60 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="bg-surface-container-lowest rounded-3xl max-w-lg w-full p-6 space-y-4 shadow-2xl border border-surface-container">
            <div className="flex items-center justify-between border-b pb-2">
              <h3 className="font-title-md text-title-md font-bold text-primary">
                {eligibilityModalScheme.titleHindi}
              </h3>
              <button onClick={() => setEligibilityModalScheme(null)} className="text-on-surface-variant font-bold">
                ✕
              </button>
            </div>

            <div>
              <h4 className="font-label-md text-label-md text-secondary font-bold mb-2">पात्रता शर्तें (Eligibility):</h4>
              <ul className="space-y-1.5 text-body-sm text-on-surface">
                {eligibilityModalScheme.eligibility.map((item, idx) => (
                  <li key={idx} className="flex items-start gap-2">
                    <span className="text-secondary font-bold">✓</span>
                    <span>{item}</span>
                  </li>
                ))}
              </ul>
            </div>

            <div>
              <h4 className="font-label-md text-label-md text-primary font-bold mb-2">आवेदन हेतु आवश्यक दस्तावेज:</h4>
              <div className="flex flex-wrap gap-1.5">
                {eligibilityModalScheme.documentsRequired.map((doc, idx) => (
                  <span key={idx} className="px-2.5 py-1 bg-surface-container-low rounded-lg text-body-sm font-medium">
                    📄 {doc}
                  </span>
                ))}
              </div>
            </div>

            <div className="pt-2 flex justify-end gap-2">
              <button
                onClick={() => setEligibilityModalScheme(null)}
                className="px-4 py-2 bg-surface-container text-on-surface font-semibold rounded-xl"
              >
                बंद करें
              </button>
              <a
                href={eligibilityModalScheme.officialPortalUrl}
                target="_blank"
                rel="noreferrer"
                className="px-4 py-2 bg-primary text-on-primary font-semibold rounded-xl"
              >
                आधिकारिक पोर्टल पर जाएं →
              </a>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
