import React, { useState, useEffect } from 'react';
import { services } from '../../services/serviceRegistry';
import { CropDisease } from '../../types/app.types';

export const CropCarePage: React.FC = () => {
  const [diseases, setDiseases] = useState<CropDisease[]>([]);
  const [selectedCrop, setSelectedCrop] = useState('all');

  useEffect(() => {
    loadDiseases();
  }, [selectedCrop]);

  const loadDiseases = async () => {
    const list = await services.cropCare.getDiseases(selectedCrop);
    setDiseases(list);
  };

  return (
    <div className="max-w-[1280px] mx-auto px-4 md:px-margin-lg py-space-xl space-y-space-xl">
      {/* Page Header */}
      <div className="flex flex-col md:flex-row md:items-end justify-between gap-space-md">
        <div className="space-y-space-xs">
          <div className="inline-flex items-center gap-space-xs px-space-sm py-0.5 rounded-full bg-secondary-fixed text-on-secondary-fixed font-label-sm text-label-sm uppercase tracking-wide">
            <span className="material-symbols-outlined text-[14px]">psychiatry</span>
            <span>फसल स्वास्थ्य एवं सुरक्षा (Plant Protection)</span>
          </div>
          <h1 className="font-headline-lg text-headline-lg text-primary font-bold">
            फसल रोग पहचान, रोकथाम एवं उपचार
          </h1>
          <p className="font-body-md text-body-md text-on-surface-variant max-w-2xl">
            रोग के लक्षणों की पहचान करें और कृषि वैज्ञानिकों द्वारा अनुशंसित जैविक व रासायनिक कीटनाशक छिड़काव मात्रा जानें।
          </p>
        </div>

        {/* Crop Filter */}
        <div className="flex items-center gap-2">
          {['all', 'Tomato', 'Onion', 'Wheat'].map((c) => (
            <button
              key={c}
              onClick={() => setSelectedCrop(c)}
              className={`px-space-md py-1.5 rounded-full font-label-md text-label-md cursor-pointer ${
                selectedCrop === c
                  ? 'bg-primary text-on-primary font-bold shadow-sm'
                  : 'bg-surface-container text-on-surface-variant hover:bg-surface-container-high'
              }`}
            >
              {c === 'all' ? 'सभी फसलें' : c === 'Tomato' ? 'टमाटर' : c === 'Onion' ? 'प्याज' : 'गेहूँ'}
            </button>
          ))}
        </div>
      </div>

      {/* Disease Cards Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-space-lg">
        {diseases.map((dis) => (
          <div
            key={dis.id}
            className="bg-surface-container-lowest rounded-3xl overflow-hidden shadow-sm border border-surface-container flex flex-col justify-between"
          >
            <div>
              {/* Photo Banner */}
              <div className="relative h-48 w-full bg-surface-container-low">
                <img src={dis.imageUrl} alt={dis.diseaseName} className="w-full h-full object-cover" />
                <span className="absolute top-3 left-3 bg-inverse-surface/80 text-inverse-on-surface px-2.5 py-0.5 rounded-full text-[11px] font-bold">
                  {dis.cropName}
                </span>
                <span
                  className={`absolute top-3 right-3 px-2 py-0.5 rounded-full text-[11px] font-bold ${
                    dis.severity === 'high'
                      ? 'bg-error text-on-error'
                      : 'bg-tertiary-fixed text-on-tertiary-fixed'
                  }`}
                >
                  {dis.severity === 'high' ? 'गंभीर जोखिम' : 'मध्यम प्रभाव'}
                </span>
              </div>

              <div className="p-space-lg space-y-space-md">
                <div>
                  <h3 className="font-headline-sm text-headline-sm text-primary font-bold">
                    {dis.diseaseNameHindi}
                  </h3>
                  <span className="text-body-sm text-outline">{dis.diseaseName}</span>
                </div>

                {/* Symptoms */}
                <div>
                  <h4 className="font-label-md text-label-md text-on-surface font-bold mb-1">
                    प्रमुख लक्षण (Key Symptoms):
                  </h4>
                  <ul className="space-y-1 text-body-sm text-on-surface-variant">
                    {dis.symptoms.map((sym, idx) => (
                      <li key={idx} className="flex items-start gap-1.5">
                        <span className="text-error font-bold">•</span>
                        <span>{sym}</span>
                      </li>
                    ))}
                  </ul>
                </div>

                {/* Organic Treatment */}
                <div className="bg-primary-fixed/20 p-space-sm rounded-xl border border-primary-fixed">
                  <span className="font-label-sm text-label-sm text-secondary font-bold uppercase block">
                    🌿 जैविक समाधान (Organic Remedy):
                  </span>
                  <p className="font-body-sm text-body-sm text-on-surface mt-1">
                    {dis.organicTreatment}
                  </p>
                </div>

                {/* Chemical Treatment */}
                <div className="bg-surface-container-low p-space-sm rounded-xl border border-surface-container">
                  <span className="font-label-sm text-label-sm text-primary font-bold uppercase block">
                    🧪 रासायनिक उपचार (Chemical Dose):
                  </span>
                  <p className="font-body-sm text-body-sm text-on-surface-variant mt-1">
                    {dis.chemicalTreatment}
                  </p>
                </div>
              </div>
            </div>

            <div className="p-space-lg pt-0">
              <a
                href="tel:18001801551"
                className="w-full py-2.5 bg-surface-container hover:bg-surface-container-high rounded-xl text-primary font-label-md text-label-md font-bold flex items-center justify-center gap-1.5 transition-colors"
              >
                <span className="material-symbols-outlined text-[18px]">support_agent</span>
                <span>कृषि वैज्ञानिक से सलाह लें (1800-180-1551)</span>
              </a>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};
