import React from 'react';
import { useLanguage } from '../../context/LanguageContext';
import { Language } from '../../locales/translations';

interface LanguageModalProps {
  isOpen: boolean;
  onClose: () => void;
}

interface LanguageOption {
  code: Language;
  nameHindi: string;
  nameEnglish: string;
  region: string;
  isPopular?: boolean;
}

const LANGUAGE_OPTIONS: LanguageOption[] = [
  { code: 'hi', nameHindi: 'हिन्दी (Hindi)', nameEnglish: 'Hindi', region: 'राष्ट्रीय एवं मध्य भारत', isPopular: true },
  { code: 'cg', nameHindi: 'छत्तीसगढ़ी (Chhattisgarhi)', nameEnglish: 'Chhattisgarhi', region: 'छत्तीसगढ़ अंचल', isPopular: true },
  { code: 'en', nameHindi: 'English', nameEnglish: 'English', region: 'Global & Standard' },
];

export const LanguageModal: React.FC<LanguageModalProps> = ({ isOpen, onClose }) => {
  const { language, setLanguage } = useLanguage();

  if (!isOpen) return null;

  return (
    <div
      className="fixed inset-0 z-50 bg-inverse-surface/60 backdrop-blur-sm flex items-center justify-center p-4"
      onClick={(e) => {
        if (e.target === e.currentTarget) onClose();
      }}
    >
      <div className="bg-surface-container-lowest rounded-2xl max-w-md w-full p-6 shadow-2xl space-y-4">
        <div className="flex items-center justify-between pb-2 border-b border-surface-container">
          <div className="flex items-center gap-2">
            <span className="material-symbols-outlined text-primary text-[24px]">translate</span>
            <h3 className="font-headline-sm text-headline-sm text-on-surface font-bold">
              भाषा का चयन करें (Select Language)
            </h3>
          </div>
          <button onClick={onClose} className="text-on-surface-variant hover:text-on-surface">
            <span className="material-symbols-outlined text-[20px]">close</span>
          </button>
        </div>

        <p className="font-body-sm text-body-sm text-on-surface-variant">
          MandiMind AI आपकी क्षेत्रीय भाषा में मंडी भाव और ध्वनि निर्देश प्रदान करता है:
        </p>

        <div className="space-y-2">
          {LANGUAGE_OPTIONS.map((opt) => (
            <button
              key={opt.code}
              onClick={() => {
                setLanguage(opt.code);
                onClose();
              }}
              className={`w-full text-left p-3 rounded-xl border flex items-center justify-between transition-all ${
                language === opt.code
                  ? 'border-primary bg-primary-fixed/20 shadow-sm'
                  : 'border-surface-container hover:bg-surface-container-low'
              }`}
            >
              <div>
                <p className="font-title-md text-title-md font-bold text-on-surface">
                  {opt.nameHindi}
                </p>
                <p className="font-label-sm text-label-sm text-on-surface-variant">
                  {opt.nameEnglish} • {opt.region}
                </p>
              </div>
              {language === opt.code ? (
                <span className="material-symbols-outlined text-primary text-[22px]">check_circle</span>
              ) : (
                <span className="material-symbols-outlined text-outline text-[20px]">radio_button_unchecked</span>
              )}
            </button>
          ))}
        </div>

        <div className="pt-2 text-center">
          <p className="font-label-sm text-label-sm text-outline">
            डिजिटल इंडिया भाषिणी (Bhashini) भाषा तकनीक द्वारा समर्थित
          </p>
        </div>
      </div>
    </div>
  );
};
