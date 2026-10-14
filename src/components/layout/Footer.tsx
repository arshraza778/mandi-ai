import React from 'react';
import { Link } from 'react-router-dom';

export const Footer: React.FC = () => {
  return (
    <footer className="w-full bg-surface-container-lowest shadow-[0_-1px_6px_rgba(0,0,0,0.02)] mt-space-2xl border-t border-surface-container">
      <div className="max-w-[1280px] mx-auto px-4 md:px-margin-lg py-space-2xl">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-gutter-lg pb-space-xl">
          {/* Col 1: Brand & Mission */}
          <div className="space-y-space-sm">
            <div className="flex items-center gap-space-sm">
              <div className="w-7 h-7 rounded-lg bg-primary flex items-center justify-center text-on-primary">
                <span className="material-symbols-outlined text-[18px] text-secondary-container">spa</span>
              </div>
              <span className="font-headline-sm text-headline-sm text-primary font-bold">
                MandiMind AI
              </span>
            </div>
            <p className="font-body-sm text-body-sm text-on-surface-variant leading-relaxed">
              AI-driven agricultural price intelligence, mandi route optimization, and crop advisories for Indian farmers and FPOs.
            </p>
          </div>

          {/* Col 2: Mandi Intelligence */}
          <div>
            <h4 className="font-label-lg text-label-lg text-on-surface font-semibold mb-space-sm">
              Mandi Intelligence
            </h4>
            <ul className="space-y-space-xs">
              <li className="font-body-sm text-body-sm text-on-surface-variant hover:text-primary transition-colors">
                <Link to="/mandi-rates">Live Mandi Rates</Link>
              </li>
              <li className="font-body-sm text-body-sm text-on-surface-variant hover:text-primary transition-colors">
                <Link to="/best-mandi">Best Mandi Predictor</Link>
              </li>
              <li className="font-body-sm text-body-sm text-on-surface-variant hover:text-primary transition-colors">
                <Link to="/market-trends">7-Day Price Forecast</Link>
              </li>
              <li className="font-body-sm text-body-sm text-on-surface-variant hover:text-primary transition-colors">
                <Link to="/mandi-comparison">Nearby Mandi Comparison</Link>
              </li>
            </ul>
          </div>

          {/* Col 3: Farmer Services */}
          <div>
            <h4 className="font-label-lg text-label-lg text-on-surface font-semibold mb-space-sm">
              Farmer Services
            </h4>
            <ul className="space-y-space-xs">
              <li className="font-body-sm text-body-sm text-on-surface-variant hover:text-primary transition-colors">
                <Link to="/weather">Monsoon & Weather</Link>
              </li>
              <li className="font-body-sm text-body-sm text-on-surface-variant hover:text-primary transition-colors">
                <Link to="/schemes">Sarkari Yojana</Link>
              </li>
              <li className="font-body-sm text-body-sm text-on-surface-variant hover:text-primary transition-colors">
                <Link to="/fertilizer-and-pesticide">Dosage Calculator</Link>
              </li>
              <li className="font-body-sm text-body-sm text-on-surface-variant hover:text-primary transition-colors">
                <Link to="/crop-care">Disease Identification</Link>
              </li>
            </ul>
          </div>

          {/* Col 4: Helpline & Connectivity */}
          <div>
            <h4 className="font-label-lg text-label-lg text-on-surface font-semibold mb-space-sm">
              Helpline & Connectivity
            </h4>
            <p className="font-body-sm text-body-sm text-on-surface-variant mb-space-xs">
              Toll Free Kisan Call Centre: 1800-180-1551
            </p>
            <div className="inline-flex items-center gap-space-xs px-space-sm py-space-xs rounded bg-surface-container text-on-surface-variant font-label-sm text-label-sm">
              <span className="material-symbols-outlined text-[16px] text-secondary">cloud_done</span>
              <span>AGMARKNET Sync Active</span>
            </div>
            <div className="mt-2">
              <Link
                to="/offline-sync"
                className="text-primary text-[12px] font-semibold hover:underline flex items-center gap-1"
              >
                <span className="material-symbols-outlined text-[14px]">offline_bolt</span>
                ऑफ़लाइन स्थिति व सिंक जांचें
              </Link>
            </div>
          </div>
        </div>

        {/* Bottom Bar */}
        <div className="pt-space-lg border-t border-surface-container flex flex-col sm:flex-row items-center justify-between gap-space-sm font-body-sm text-body-sm text-on-surface-variant">
          <p>© 2025 MandiMind AI. Empowering India's Annadata with Responsible AI.</p>
          <div className="flex items-center gap-space-md">
            <span className="cursor-pointer hover:text-on-surface">Privacy Policy</span>
            <span className="cursor-pointer hover:text-on-surface">Terms of Service</span>
            <span className="cursor-pointer hover:text-on-surface">Support</span>
          </div>
        </div>
      </div>
    </footer>
  );
};
