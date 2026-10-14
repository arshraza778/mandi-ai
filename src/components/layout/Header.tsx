import React, { useState } from 'react';
import { NavLink, Link, useNavigate } from 'react-router-dom';
import { useLanguage } from '../../context/LanguageContext';
import { useAuth } from '../../context/AuthContext';
import { UserRole } from '../../types/app.types';

interface HeaderProps {
  onOpenVoiceModal: () => void;
  onOpenLanguageModal: () => void;
}

export const Header: React.FC<HeaderProps> = ({ onOpenVoiceModal, onOpenLanguageModal }) => {
  const { language, setLanguage, t } = useLanguage();
  const { firebaseUser, profile, isGoogleAuthenticated, loginWithGoogle, logout, switchRole } = useAuth();
  const navigate = useNavigate();
  const [isMoreOpen, setIsMoreOpen] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [isUserMenuOpen, setIsUserMenuOpen] = useState(false);

  const handleRoleChange = async (role: UserRole) => {
    await switchRole(role);
    setIsUserMenuOpen(false);
  };

  const navLinkClass = ({ isActive }: { isActive: boolean }) =>
    isActive
      ? 'transition-colors text-primary font-label-lg font-bold bg-primary-fixed/30 rounded-lg px-space-sm py-space-xs'
      : 'font-label-lg text-label-lg text-on-surface-variant hover:text-on-surface transition-colors px-space-sm py-space-xs';

  return (
    <header className="fixed top-0 left-0 right-0 z-50 bg-surface-container-lowest/95 backdrop-blur-md shadow-[0_1px_8px_rgba(0,0,0,0.04)]">
      <div className="h-20 max-w-[1280px] mx-auto px-4 md:px-margin-lg flex items-center justify-between gap-space-md">
        {/* Brand Zone */}
        <div className="flex items-center gap-space-lg shrink-0">
          <Link to="/" className="flex items-center gap-space-sm">
            <div className="w-8 h-8 rounded-lg bg-primary flex items-center justify-center text-on-primary shadow-sm">
              <span className="material-symbols-outlined text-[20px] text-secondary-container">spa</span>
            </div>
            <span className="font-headline-sm text-headline-sm text-primary tracking-tight font-bold">
              MandiMind AI
            </span>
          </Link>
        </div>

        {/* Desktop Nav Zone */}
        <nav className="hidden xl:flex items-center gap-space-md">
          <NavLink to="/" className={navLinkClass}>
            {t.home}
          </NavLink>
          <NavLink to="/mandi-rates" className={navLinkClass}>
            {t.mandiRates}
          </NavLink>
          <NavLink to="/best-mandi" className={navLinkClass}>
            {t.bestMandi}
          </NavLink>
          <NavLink to="/weather" className={navLinkClass}>
            {t.weather}
          </NavLink>
          <NavLink to="/schemes" className={navLinkClass}>
            {t.schemes}
          </NavLink>
          <NavLink to="/fertilizer-and-pesticide" className={navLinkClass}>
            {t.fertilizerAndPesticide}
          </NavLink>
          <NavLink to="/crop-care" className={navLinkClass}>
            {t.cropCare}
          </NavLink>

          {/* More Dropdown */}
          <div
            className="relative"
            onMouseEnter={() => setIsMoreOpen(true)}
            onMouseLeave={() => setIsMoreOpen(false)}
          >
            <button
              className="flex items-center gap-space-xs font-label-lg text-label-lg text-on-surface-variant hover:text-on-surface transition-colors py-2"
              onClick={() => setIsMoreOpen(!isMoreOpen)}
            >
              <span>{t.more}</span>
              <span className="material-symbols-outlined text-[18px]">expand_more</span>
            </button>

            {isMoreOpen && (
              <div className="absolute top-full left-0 w-52 bg-surface-container-lowest rounded-lg shadow-[0_4px_16px_rgba(0,0,0,0.08)] py-space-xs z-50 border border-surface-container">
                <Link
                  to="/market-trends"
                  className="block px-space-md py-space-sm font-body-sm text-body-sm text-on-surface-variant hover:bg-surface-container-low hover:text-on-surface"
                  onClick={() => setIsMoreOpen(false)}
                >
                  {t.marketTrends} (पूर्वानुमान)
                </Link>
                <Link
                  to="/mandi-comparison"
                  className="block px-space-md py-space-sm font-body-sm text-body-sm text-on-surface-variant hover:bg-surface-container-low hover:text-on-surface"
                  onClick={() => setIsMoreOpen(false)}
                >
                  {t.mandiComparison} (तुलना)
                </Link>
                <Link
                  to="/voice-assistant"
                  className="block px-space-md py-space-sm font-body-sm text-body-sm text-on-surface-variant hover:bg-surface-container-low hover:text-on-surface"
                  onClick={() => setIsMoreOpen(false)}
                >
                  {t.voiceAssistant} (भाषिणी AI)
                </Link>
                <Link
                  to="/offline-sync"
                  className="block px-space-md py-space-sm font-body-sm text-body-sm text-on-surface-variant hover:bg-surface-container-low hover:text-on-surface"
                  onClick={() => setIsMoreOpen(false)}
                >
                  {t.offlineStatus} (ऑफ़लाइन)
                </Link>
                <Link
                  to="/features"
                  className="block px-space-md py-space-sm font-body-sm text-body-sm text-on-surface-variant hover:bg-surface-container-low hover:text-on-surface"
                  onClick={() => setIsMoreOpen(false)}
                >
                  सुविधाएं (All Features)
                </Link>
              </div>
            )}
          </div>
        </nav>

        {/* Right Action Tools Zone */}
        <div className="flex items-center gap-space-sm shrink-0">
          {/* AGMARKNET Status Pill */}
          <div className="hidden sm:flex items-center gap-space-xs px-space-sm py-1 rounded-full bg-surface-container-low text-on-surface-variant font-label-sm text-label-sm border border-secondary/20">
            <span className="w-2 h-2 rounded-full bg-secondary animate-pulse"></span>
            <span>{t.agmarknetLive}</span>
          </div>

          {/* Language Switcher Button */}
          <button
            onClick={onOpenLanguageModal}
            className="flex items-center gap-space-xs px-space-sm py-1 rounded-lg bg-surface-container hover:bg-surface-container-high transition-colors font-label-md text-label-md text-on-surface cursor-pointer"
            title="भाषा बदलें / Change Language"
          >
            <span className="material-symbols-outlined text-[18px] text-primary">translate</span>
            <span>
              {language === 'hi' ? 'हिंदी' : language === 'cg' ? 'छत्तीसगढ़ी' : 'Eng'}
            </span>
            <span className="material-symbols-outlined text-[16px]">arrow_drop_down</span>
          </button>

          {/* Voice Search Button */}
          <button
            onClick={onOpenVoiceModal}
            className="flex items-center gap-space-xs px-space-md py-2 rounded-full bg-secondary-container text-on-secondary-container hover:bg-secondary-fixed transition-colors font-label-md text-label-md shadow-sm active:scale-95 cursor-pointer"
            title="बोलकर पूछें (Voice Assistant)"
          >
            <span className="material-symbols-outlined text-[18px]">mic</span>
            <span className="hidden md:inline font-semibold">{t.speakToAsk}</span>
          </button>

          {/* User Profile & Role Switcher */}
          <div className="relative">
            <button
              onClick={() => setIsUserMenuOpen(!isUserMenuOpen)}
              className="w-9 h-9 rounded-full bg-primary flex items-center justify-center shrink-0 cursor-pointer shadow-sm text-on-primary hover:bg-primary-container transition-colors ring-2 ring-primary-fixed/50"
              title={`प्रोफ़ाइल: ${profile.name} (${profile.role.toUpperCase()})`}
            >
              {firebaseUser?.photoURL ? (
                <img src={firebaseUser.photoURL} alt={profile.name} className="w-full h-full rounded-full object-cover" />
              ) : (
                <span className="material-symbols-outlined text-[18px]">person</span>
              )}
            </button>

            {isUserMenuOpen && (
              <div className="absolute right-0 top-full mt-2 w-64 bg-surface-container-lowest rounded-2xl shadow-xl border border-surface-container p-3 z-50 text-left">
                <div className="px-3 py-2 border-b border-surface-container mb-2">
                  <div className="flex items-center justify-between">
                    <p className="font-label-sm text-label-sm text-on-surface-variant">सक्रिय खाता</p>
                    {isGoogleAuthenticated ? (
                      <span className="text-[10px] bg-emerald-100 text-emerald-800 font-bold px-1.5 py-0.5 rounded-full flex items-center gap-1">
                        <span className="w-1.5 h-1.5 rounded-full bg-emerald-600"></span> Google
                      </span>
                    ) : (
                      <span className="text-[10px] bg-amber-100 text-amber-800 font-medium px-1.5 py-0.5 rounded-full">
                        अतिथि
                      </span>
                    )}
                  </div>
                  <p className="font-title-md text-title-md text-primary font-bold truncate">
                    {profile.name}
                  </p>
                  {firebaseUser?.email && (
                    <p className="text-[11px] text-on-surface-variant truncate">{firebaseUser.email}</p>
                  )}
                  <div className="flex items-center gap-2 mt-1">
                    <span className="inline-block px-2 py-0.5 rounded bg-secondary-container text-on-secondary-container text-[11px] font-bold uppercase">
                      भूमिका: {profile.role}
                    </span>
                    <span className="text-[11px] text-outline font-medium">
                      {profile.district}, {profile.state}
                    </span>
                  </div>
                </div>

                {/* Google Auth Action */}
                <div className="px-1 pb-2 border-b border-surface-container mb-2">
                  {!isGoogleAuthenticated ? (
                    <button
                      onClick={async () => {
                        try {
                          await loginWithGoogle();
                          setIsUserMenuOpen(false);
                        } catch (err) {
                          console.error(err);
                        }
                      }}
                      className="w-full flex items-center justify-center gap-2 px-3 py-2 bg-primary text-on-primary rounded-xl font-label-md text-label-md font-semibold hover:bg-primary-container transition-colors shadow-sm cursor-pointer"
                    >
                      <span className="material-symbols-outlined text-[18px]">login</span>
                      <span>Google से साइन इन करें</span>
                    </button>
                  ) : (
                    <button
                      onClick={async () => {
                        await logout();
                        setIsUserMenuOpen(false);
                      }}
                      className="w-full flex items-center justify-center gap-2 px-3 py-1.5 text-error hover:bg-red-50 rounded-lg text-body-sm transition-colors cursor-pointer"
                    >
                      <span className="material-symbols-outlined text-[16px]">logout</span>
                      <span>लॉगआउट (Sign Out)</span>
                    </button>
                  )}
                </div>

                {/* Role Switcher */}
                <div className="py-1">
                  <p className="px-2 py-1 text-[11px] text-outline font-semibold uppercase">भूमिका बदलें (Switch Role)</p>
                  <button
                    onClick={() => handleRoleChange('farmer')}
                    className={`w-full text-left px-3 py-1.5 text-body-sm rounded-lg flex items-center justify-between cursor-pointer ${
                      profile.role === 'farmer' ? 'bg-primary-fixed/30 text-primary font-bold' : 'hover:bg-surface-container'
                    }`}
                  >
                    <span>किसान (Farmer)</span>
                    {profile.role === 'farmer' && <span className="material-symbols-outlined text-[16px]">check</span>}
                  </button>
                  <button
                    onClick={() => handleRoleChange('supervisor')}
                    className={`w-full text-left px-3 py-1.5 text-body-sm rounded-lg flex items-center justify-between cursor-pointer ${
                      profile.role === 'supervisor' ? 'bg-primary-fixed/30 text-primary font-bold' : 'hover:bg-surface-container'
                    }`}
                  >
                    <span>सुपरवाइजर (Supervisor)</span>
                    {profile.role === 'supervisor' && <span className="material-symbols-outlined text-[16px]">check</span>}
                  </button>
                  <button
                    onClick={() => handleRoleChange('admin')}
                    className={`w-full text-left px-3 py-1.5 text-body-sm rounded-lg flex items-center justify-between cursor-pointer ${
                      profile.role === 'admin' ? 'bg-primary-fixed/30 text-primary font-bold' : 'hover:bg-surface-container'
                    }`}
                  >
                    <span>प्रशासक (Admin)</span>
                    {profile.role === 'admin' && <span className="material-symbols-outlined text-[16px]">check</span>}
                  </button>
                </div>
              </div>
            )}
          </div>

          {/* Mobile Menu Hamburger */}
          <button
            className="xl:hidden p-2 rounded-lg text-on-surface hover:bg-surface-container"
            onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
            aria-label="Toggle Menu"
          >
            <span className="material-symbols-outlined text-[24px]">
              {isMobileMenuOpen ? 'close' : 'menu'}
            </span>
          </button>
        </div>
      </div>

      {/* Mobile Drawer Menu */}
      {isMobileMenuOpen && (
        <div className="xl:hidden bg-surface-container-lowest border-b border-surface-container px-4 py-4 space-y-2 shadow-lg">
          <NavLink
            to="/"
            className="block py-2 px-3 rounded-lg font-label-lg text-on-surface hover:bg-surface-container"
            onClick={() => setIsMobileMenuOpen(false)}
          >
            {t.home}
          </NavLink>
          <NavLink
            to="/mandi-rates"
            className="block py-2 px-3 rounded-lg font-label-lg text-on-surface hover:bg-surface-container"
            onClick={() => setIsMobileMenuOpen(false)}
          >
            {t.mandiRates}
          </NavLink>
          <NavLink
            to="/best-mandi"
            className="block py-2 px-3 rounded-lg font-label-lg text-on-surface hover:bg-surface-container"
            onClick={() => setIsMobileMenuOpen(false)}
          >
            {t.bestMandi}
          </NavLink>
          <NavLink
            to="/market-trends"
            className="block py-2 px-3 rounded-lg font-label-lg text-on-surface hover:bg-surface-container"
            onClick={() => setIsMobileMenuOpen(false)}
          >
            {t.marketTrends}
          </NavLink>
          <NavLink
            to="/mandi-comparison"
            className="block py-2 px-3 rounded-lg font-label-lg text-on-surface hover:bg-surface-container"
            onClick={() => setIsMobileMenuOpen(false)}
          >
            {t.mandiComparison}
          </NavLink>
          <NavLink
            to="/weather"
            className="block py-2 px-3 rounded-lg font-label-lg text-on-surface hover:bg-surface-container"
            onClick={() => setIsMobileMenuOpen(false)}
          >
            {t.weather}
          </NavLink>
          <NavLink
            to="/schemes"
            className="block py-2 px-3 rounded-lg font-label-lg text-on-surface hover:bg-surface-container"
            onClick={() => setIsMobileMenuOpen(false)}
          >
            {t.schemes}
          </NavLink>
          <NavLink
            to="/fertilizer-and-pesticide"
            className="block py-2 px-3 rounded-lg font-label-lg text-on-surface hover:bg-surface-container"
            onClick={() => setIsMobileMenuOpen(false)}
          >
            {t.fertilizerAndPesticide}
          </NavLink>
          <NavLink
            to="/crop-care"
            className="block py-2 px-3 rounded-lg font-label-lg text-on-surface hover:bg-surface-container"
            onClick={() => setIsMobileMenuOpen(false)}
          >
            {t.cropCare}
          </NavLink>
          <NavLink
            to="/voice-assistant"
            className="block py-2 px-3 rounded-lg font-label-lg text-on-surface hover:bg-surface-container"
            onClick={() => setIsMobileMenuOpen(false)}
          >
            {t.voiceAssistant}
          </NavLink>
          <NavLink
            to="/offline-sync"
            className="block py-2 px-3 rounded-lg font-label-lg text-on-surface hover:bg-surface-container"
            onClick={() => setIsMobileMenuOpen(false)}
          >
            {t.offlineStatus}
          </NavLink>
        </div>
      )}
    </header>
  );
};
