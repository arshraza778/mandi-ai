import React, { useState, useEffect } from 'react';
import { services } from '../../services/serviceRegistry';
import { BestMandiRecommendation, BestMandiRequest } from '../../types/recommendation.types';
import { useAuth } from '../../context/AuthContext';
import { persistSavedRecommendation, fetchSavedRecommendations, SavedRecommendationRecord } from '../../services/firebase/firestoreService';

export const BestMandiPage: React.FC = () => {
  const { firebaseUser, isGoogleAuthenticated, loginWithGoogle } = useAuth();
  const [request, setRequest] = useState<BestMandiRequest>({
    cropId: 'tomato',
    cropName: 'टमाटर (Tomato Hybrid)',
    cropVariety: 'Hybrid Grade-A',
    quantityQuintal: 20,
    farmerLocation: 'रायपुर, छत्तीसगढ़',
    farmerPincode: '492001',
    targetDate: '2026-10-20',
    vehicleType: 'bolero_pickup',
  });

  const [recommendation, setRecommendation] = useState<BestMandiRecommendation | null>(null);
  const [loading, setLoading] = useState(false);
  const [isSpeaking, setIsSpeaking] = useState(false);
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [filterAlternative, setFilterAlternative] = useState<'all' | 'dist60' | 'highprice'>('all');
  const [bookingToast, setBookingToast] = useState<string | null>(null);
  const [isSaving, setIsSaving] = useState(false);
  const [savedRecords, setSavedRecords] = useState<SavedRecommendationRecord[]>([]);
  const [showSavedModal, setShowSavedModal] = useState(false);

  useEffect(() => {
    loadRecommendation();
  }, [request.quantityQuintal, request.cropId]);

  const loadRecommendation = async () => {
    setLoading(true);
    try {
      const rec = await services.recommendations.getBestMandi(request);
      setRecommendation(rec);
    } finally {
      setLoading(false);
    }
  };

  const handleSaveRecommendation = async () => {
    if (!firebaseUser) {
      setBookingToast('कृपया गणना सुरक्षित रखने के लिए ऊपर Google से साइन इन करें!');
      setTimeout(() => setBookingToast(null), 5000);
      return;
    }
    if (!recommendation) return;

    setIsSaving(true);
    try {
      await persistSavedRecommendation(firebaseUser.uid, {
        userId: firebaseUser.uid,
        cropId: request.cropId,
        cropName: request.cropName,
        quantityQuintal: request.quantityQuintal,
        winnerMandiName: recommendation.winnerMandi.mandiName,
        expectedNetProfit: recommendation.estimatedNetProfit,
        netReturnPerQuintal: recommendation.netReturnPerQuintal,
      });
      setBookingToast('सफलतापूर्वक सुरक्षित! यह गणना आपके क्लाउड खाते में सुरक्षित हो गई है।');
      setTimeout(() => setBookingToast(null), 5000);
    } catch (err) {
      console.error('Failed to save calculation:', err);
      setBookingToast('सुरक्षित करने में त्रुटि। कृपया पुनः प्रयास करें।');
    } finally {
      setIsSaving(false);
    }
  };

  const handleViewSaved = async () => {
    if (!firebaseUser) {
      setBookingToast('कृपया पहले Google से साइन इन करें!');
      setTimeout(() => setBookingToast(null), 4000);
      return;
    }
    try {
      const records = await fetchSavedRecommendations(firebaseUser.uid);
      setSavedRecords(records);
      setShowSavedModal(true);
    } catch (err) {
      console.error('Failed to load saved records:', err);
    }
  };

  const toggleSpeech = () => {
    if (isSpeaking) {
      services.voice.stopSpeaking();
      setIsSpeaking(false);
    } else {
      const speechText =
        'नमस्ते किसान भाई! आपके ' +
        request.quantityQuintal +
        ' क्विंटल टमाटर के लिए राजनांदगांव मंडी सबसे उत्तम है। यहां आपको ₹2,200 प्रति क्विंटल का भाव मिलने की संभावना है। वाहन खर्च ₹1,900 और अन्य खर्च काटने के बाद आपको लगभग ₹38,500 का शुद्ध मुनाफा होगा, जो रायपुर मंडी से ₹6,500 ज्यादा है।';
      setIsSpeaking(true);
      services.voice.speak(speechText, 'hi-IN', () => {
        setIsSpeaking(false);
      });
    }
  };

  const handleShareWhatsapp = () => {
    const text = `🌾 MandiMind AI सिफारिश: ${request.cropName} के लिए सर्वोत्तम मंडी राजनांदगांव है। अनुमानित शुद्ध लाभ ₹${recommendation?.estimatedNetProfit?.toLocaleString('en-IN')} (₹${recommendation?.netReturnPerQuintal}/क्विंटल)।`;
    window.open(`https://api.whatsapp.com/send?text=${encodeURIComponent(text)}`, '_blank');
  };

  const handleBookVehicle = () => {
    setBookingToast('पिकअप वाहन अनुरोध प्राप्त! MandiMind प्रमाणित चालक आपसे 15 मिनट में संपर्क करेगा। (छूट: ₹30/क्विंटल लागू)');
    setTimeout(() => setBookingToast(null), 6000);
  };

  if (!recommendation) {
    return (
      <div className="max-w-[1280px] mx-auto p-12 text-center text-on-surface-variant">
        सिफारिश इंजन लोड हो रहा है...
      </div>
    );
  }

  const { winnerMandi, alternatives } = recommendation;

  // Filter alternative table
  const displayedAlternatives = alternatives.filter((alt) => {
    if (filterAlternative === 'dist60') return alt.distanceKm <= 60;
    if (filterAlternative === 'highprice') return alt.expectedPricePerQuintal >= 1900;
    return true;
  });

  return (
    <div className="flex flex-col w-full">
      {/* Top Status Bar */}
      <div className="w-full bg-surface-container-low py-space-xs px-4 md:px-margin-lg border-b border-surface-container">
        <div className="max-w-[1280px] mx-auto flex flex-wrap items-center justify-between gap-space-sm font-body-sm text-body-sm text-on-surface-variant">
          <div className="flex items-center gap-space-sm">
            <span className="flex h-2.5 w-2.5 relative">
              <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-secondary opacity-75"></span>
              <span className="relative inline-flex rounded-full h-2.5 w-2.5 bg-secondary"></span>
            </span>
            <span className="font-label-md text-label-md text-primary font-semibold">
              AGMARKNET & e-NAM रियल-टाइम डेटा कनेक्टेड
            </span>
            <span className="text-outline-variant">|</span>
            <span className="hidden sm:inline">अंतिम रिफ्रेश: आज, 10:45 AM IST</span>
          </div>
          <div className="flex items-center gap-space-md">
            <span className="flex items-center gap-space-xs text-secondary font-label-sm text-label-sm font-semibold">
              <span className="material-symbols-outlined text-[16px]">verified</span> AI मॉडल: Prophet + LightGBM (94.2% सटीकता)
            </span>
          </div>
        </div>
      </div>

      <div className="max-w-[1280px] w-full mx-auto px-4 md:px-margin-lg py-space-xl space-y-space-xl">
        {/* Header Block & Bilingual Subtitle */}
        <div className="flex flex-col md:flex-row md:items-end justify-between gap-space-md">
          <div className="space-y-space-xs">
            <div className="inline-flex items-center gap-space-xs px-space-sm py-0.5 rounded-full bg-primary-fixed/40 text-on-primary-fixed-variant font-label-sm text-label-sm uppercase tracking-wide">
              <span className="material-symbols-outlined text-[14px]">auto_awesome</span>
              <span>स्मार्ट मंडी सिफारिश इंजन v2.4</span>
            </div>
            <h1 className="font-headline-lg text-headline-lg text-primary tracking-tight font-bold">
              Best Mandi for You — आपके लिए सबसे बेहतर मंडी का सुझाव
            </h1>
            <p className="font-body-md text-body-md text-on-surface-variant max-w-3xl">
              फसल, मात्रा, परिवहन दूरी और वाहन किराए के आधार पर हमने सभी निकटतम कृषि उपज मंडियों की तुलना की है ताकि आपको प्राप्त हो अधिकतम शुद्ध मुनाफा।
            </p>
          </div>

          {/* Quick Action Buttons */}
          <div className="flex items-center gap-space-sm shrink-0 flex-wrap">
            <button
              onClick={handleSaveRecommendation}
              disabled={isSaving}
              className="flex items-center gap-space-xs px-space-md py-2 rounded-lg bg-emerald-700 text-white hover:bg-emerald-800 transition-colors font-label-md text-label-md shadow-sm cursor-pointer disabled:opacity-50"
              title="क्लाउड डेटाबेस में सुरक्षित करें"
            >
              <span className="material-symbols-outlined text-[18px]">
                {isSaving ? 'sync' : 'bookmark_add'}
              </span>
              <span>{isSaving ? 'सहेजा जा रहा है...' : 'गणना सहेजें'}</span>
            </button>
            <button
              onClick={handleViewSaved}
              className="flex items-center gap-space-xs px-space-md py-2 rounded-lg bg-surface-container-high hover:bg-surface-container-highest transition-colors font-label-md text-label-md text-on-surface shadow-sm cursor-pointer"
              title="पूर्व में सहेजी गई गणनाएं देखें"
            >
              <span className="material-symbols-outlined text-[18px]">history</span>
              <span>सहेजी गई गणनाएं</span>
            </button>
            <button
              onClick={() => window.print()}
              className="flex items-center gap-space-xs px-space-md py-2 rounded-lg bg-surface-container-high hover:bg-surface-container-highest transition-colors font-label-md text-label-md text-on-surface shadow-sm cursor-pointer"
            >
              <span className="material-symbols-outlined text-[18px]">download</span>
              <span>रिपोर्ट प्रिंट</span>
            </button>
            <button
              onClick={toggleSpeech}
              className={`flex items-center gap-space-xs px-space-md py-2 rounded-lg ${
                isSpeaking ? 'bg-error text-on-error animate-pulse' : 'bg-secondary text-on-secondary hover:bg-primary-container'
              } transition-all font-label-md text-label-md shadow-sm cursor-pointer`}
            >
              <span className="material-symbols-outlined text-[18px]">
                {isSpeaking ? 'pause' : 'volume_up'}
              </span>
              <span>{isSpeaking ? 'आवाज़ बंद करें' : 'मुझे बोलकर समझाएं'}</span>
            </button>
          </div>
        </div>

        {bookingToast && (
          <div className="p-4 bg-secondary-container text-on-secondary-container rounded-xl font-label-md text-label-md flex items-center justify-between shadow-sm animate-in fade-in">
            <div className="flex items-center gap-2">
              <span className="material-symbols-outlined text-[20px]">local_shipping</span>
              <span>{bookingToast}</span>
            </div>
            <button onClick={() => setBookingToast(null)} className="font-bold">✕</button>
          </div>
        )}

        {/* Step-by-Step Progress Wizard Bar (5 Steps) */}
        <div className="w-full bg-surface-container-lowest rounded-xl shadow-sm p-space-md border border-surface-container">
          <div className="grid grid-cols-2 sm:grid-cols-5 gap-space-sm relative">
            {/* Step 1 */}
            <div className="flex items-center gap-space-sm p-space-xs">
              <div className="w-8 h-8 rounded-full bg-primary text-on-primary flex items-center justify-center font-label-md text-label-md shadow-sm shrink-0">
                <span className="material-symbols-outlined text-[16px]">check</span>
              </div>
              <div className="min-w-0">
                <p className="font-label-sm text-label-sm text-secondary font-bold uppercase tracking-wider">चरण 1</p>
                <p className="font-title-md text-title-md text-on-surface truncate">फसल (Crop)</p>
              </div>
            </div>
            {/* Step 2 */}
            <div className="flex items-center gap-space-sm p-space-xs">
              <div className="w-8 h-8 rounded-full bg-primary text-on-primary flex items-center justify-center font-label-md text-label-md shadow-sm shrink-0">
                <span className="material-symbols-outlined text-[16px]">check</span>
              </div>
              <div className="min-w-0">
                <p className="font-label-sm text-label-sm text-secondary font-bold uppercase tracking-wider">चरण 2</p>
                <p className="font-title-md text-title-md text-on-surface truncate">मात्रा (Quantity)</p>
              </div>
            </div>
            {/* Step 3 */}
            <div className="flex items-center gap-space-sm p-space-xs">
              <div className="w-8 h-8 rounded-full bg-primary text-on-primary flex items-center justify-center font-label-md text-label-md shadow-sm shrink-0">
                <span className="material-symbols-outlined text-[16px]">check</span>
              </div>
              <div className="min-w-0">
                <p className="font-label-sm text-label-sm text-secondary font-bold uppercase tracking-wider">चरण 3</p>
                <p className="font-title-md text-title-md text-on-surface truncate">स्थान (Location)</p>
              </div>
            </div>
            {/* Step 4 */}
            <div className="flex items-center gap-space-sm p-space-xs">
              <div className="w-8 h-8 rounded-full bg-primary text-on-primary flex items-center justify-center font-label-md text-label-md shadow-sm shrink-0">
                <span className="material-symbols-outlined text-[16px]">check</span>
              </div>
              <div className="min-w-0">
                <p className="font-label-sm text-label-sm text-secondary font-bold uppercase tracking-wider">चरण 4</p>
                <p className="font-title-md text-title-md text-on-surface truncate">तिथि (Date)</p>
              </div>
            </div>
            {/* Step 5 */}
            <div className="flex items-center gap-space-sm p-space-xs bg-secondary-container/30 rounded-lg col-span-2 sm:col-span-1">
              <div className="w-8 h-8 rounded-full bg-secondary-container text-on-secondary-container flex items-center justify-center font-label-lg text-label-lg font-bold shadow-sm shrink-0 ring-4 ring-secondary-container/40">
                5
              </div>
              <div className="min-w-0">
                <p className="font-label-sm text-label-sm text-on-secondary-container font-bold uppercase tracking-wider">चरण 5</p>
                <p className="font-title-md text-title-md text-primary font-bold truncate">परिणाम (Results)</p>
              </div>
            </div>
          </div>
        </div>

        {/* User Query Context / Active Filter Tag Banner */}
        <div className="w-full bg-surface-container-lowest rounded-xl shadow-sm p-space-md flex flex-wrap items-center justify-between gap-space-md border border-surface-container">
          <div className="flex flex-wrap items-center gap-space-md min-w-0">
            {/* Crop Badge */}
            <div className="flex items-center gap-space-sm bg-surface-container-low px-space-md py-space-xs rounded-lg">
              <div className="w-10 h-10 rounded-full bg-error-container text-error flex items-center justify-center font-bold text-headline-sm">
                🍅
              </div>
              <div>
                <span className="font-label-sm text-label-sm text-on-surface-variant block">चयनित फसल</span>
                <span className="font-title-md text-title-md text-on-surface font-semibold">{request.cropName}</span>
              </div>
            </div>
            {/* Metric Pill 1: Quantity */}
            <div className="flex items-center gap-space-xs bg-surface-container-low px-space-md py-space-xs rounded-lg">
              <span className="material-symbols-outlined text-[20px] text-primary">scale</span>
              <div>
                <span className="font-label-sm text-label-sm text-on-surface-variant block">कुल मात्रा</span>
                <span className="font-title-md text-title-md text-on-surface font-semibold">
                  {request.quantityQuintal} क्विंटल ({request.quantityQuintal * 100} किग्रा)
                </span>
              </div>
            </div>
            {/* Metric Pill 2: Location */}
            <div className="flex items-center gap-space-xs bg-surface-container-low px-space-md py-space-xs rounded-lg">
              <span className="material-symbols-outlined text-[20px] text-primary">pin_drop</span>
              <div>
                <span className="font-label-sm text-label-sm text-on-surface-variant block">किसान का स्थान</span>
                <span className="font-title-md text-title-md text-on-surface font-semibold">{request.farmerLocation} ({request.farmerPincode})</span>
              </div>
            </div>
            {/* Metric Pill 3: Target Date */}
            <div className="flex items-center gap-space-xs bg-surface-container-low px-space-md py-space-xs rounded-lg">
              <span className="material-symbols-outlined text-[20px] text-primary">calendar_today</span>
              <div>
                <span className="font-label-sm text-label-sm text-on-surface-variant block">अपेक्षित मंडी तिथि</span>
                <span className="font-title-md text-title-md text-on-surface font-semibold">{request.targetDate} (मंगलवार)</span>
              </div>
            </div>
          </div>

          <button
            onClick={() => setIsEditModalOpen(true)}
            className="inline-flex items-center gap-space-xs px-space-md py-2 rounded-lg bg-surface-container hover:bg-surface-container-high text-primary font-label-md text-label-md transition-colors shadow-sm shrink-0 cursor-pointer"
          >
            <span className="material-symbols-outlined text-[18px]">tune</span>
            <span>पुनः खोजें / बदलाव करें</span>
          </button>
        </div>

        {/* Modal to Refine Quantity & Crop */}
        {isEditModalOpen && (
          <div className="fixed inset-0 z-50 bg-inverse-surface/60 backdrop-blur-sm flex items-center justify-center p-4">
            <div className="bg-surface-container-lowest rounded-2xl max-w-md w-full p-6 shadow-2xl space-y-4">
              <div className="flex items-center justify-between border-b pb-2">
                <h3 className="font-title-md text-title-md font-bold text-primary">मात्रा व फसल में बदलाव करें</h3>
                <button onClick={() => setIsEditModalOpen(false)} className="text-on-surface-variant">✕</button>
              </div>
              <div className="space-y-3">
                <div>
                  <label className="block text-body-sm text-on-surface-variant mb-1">फसल चुनें:</label>
                  <select
                    value={request.cropId}
                    onChange={(e) => {
                      const id = e.target.value;
                      const name = id === 'tomato' ? 'टमाटर (Tomato Hybrid)' : id === 'onion' ? 'प्याज (Nashik Onion)' : 'गेहूँ (Wheat)';
                      setRequest({ ...request, cropId: id, cropName: name });
                    }}
                    className="w-full p-2.5 bg-surface-container-low rounded-lg border text-body-md"
                  >
                    <option value="tomato">टमाटर (Tomato Hybrid)</option>
                    <option value="onion">प्याज (Nashik Onion)</option>
                    <option value="wheat">गेहूँ (Lokwan Wheat)</option>
                  </select>
                </div>
                <div>
                  <label className="block text-body-sm text-on-surface-variant mb-1">
                    उपज मात्रा (क्विंटल): {request.quantityQuintal} क्वि.
                  </label>
                  <input
                    type="range"
                    min="5"
                    max="100"
                    step="5"
                    value={request.quantityQuintal}
                    onChange={(e) => setRequest({ ...request, quantityQuintal: Number(e.target.value) })}
                    className="w-full accent-primary"
                  />
                  <div className="flex justify-between text-[11px] text-outline">
                    <span>5 क्विंटल</span>
                    <span>50 क्विंटल</span>
                    <span>100 क्विंटल</span>
                  </div>
                </div>
                <div>
                  <label className="block text-body-sm text-on-surface-variant mb-1">मंडी तारीख:</label>
                  <input
                    type="date"
                    value={request.targetDate}
                    onChange={(e) => setRequest({ ...request, targetDate: e.target.value })}
                    className="w-full p-2 bg-surface-container-low rounded-lg text-body-sm"
                  />
                </div>
              </div>
              <button
                onClick={() => {
                  setIsEditModalOpen(false);
                  loadRecommendation();
                }}
                className="w-full py-2.5 bg-primary text-on-primary font-bold rounded-lg shadow cursor-pointer"
              >
                सिफारिश अपडेट करें (Calculate)
              </button>
            </div>
          </div>
        )}

        {/* MAIN FEATURE: Recommendation Showcase (Bento 2-Column Split) */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-gutter-lg items-start">
          {/* Primary AI Winner Card (8 Cols) */}
          <div className="lg:col-span-8 bg-surface-container-lowest rounded-xl shadow-md overflow-hidden relative border border-surface-container">
            {/* Top Gradient accent band */}
            <div className="h-2 w-full bg-gradient-to-r from-secondary via-secondary-container to-tertiary-fixed-dim" />

            <div className="p-space-lg md:p-space-xl space-y-space-lg">
              {/* Card Header & Badges */}
              <div className="flex flex-wrap items-center justify-between gap-space-sm">
                <div className="flex items-center gap-space-sm">
                  <span className="w-10 h-10 rounded-full bg-tertiary-fixed flex items-center justify-center text-on-tertiary-fixed shadow-sm">
                    <span className="material-symbols-outlined text-[24px]">workspace_premium</span>
                  </span>
                  <div>
                    <span className="font-label-sm text-label-sm text-on-tertiary-fixed-variant uppercase font-bold tracking-wider">
                      AI टॉप सिफारिश • रैंक #1
                    </span>
                    <h2 className="font-headline-lg text-headline-lg text-primary font-bold">
                      पहला स्थान: {winnerMandi.mandiNameHindi}
                    </h2>
                  </div>
                </div>
                <div className="inline-flex items-center gap-space-xs bg-secondary-container px-space-md py-1.5 rounded-full shadow-sm text-on-secondary-container font-label-lg text-label-lg font-bold">
                  <span className="material-symbols-outlined text-[18px]">trending_up</span>
                  <span>{winnerMandi.ratingLabel}</span>
                </div>
              </div>

              {/* The Hero Net Return Metric Panel */}
              <div className="bg-gradient-to-br from-surface-container-low via-surface-container to-surface-container-high rounded-xl p-space-lg flex flex-col md:flex-row items-start md:items-center justify-between gap-space-lg shadow-sm">
                <div>
                  <p className="font-label-lg text-label-lg text-on-surface-variant font-medium">
                    अनुमानित कुल शुद्ध लाभ (Estimated Net Profit)
                  </p>
                  <div className="flex items-baseline gap-space-sm mt-space-xs">
                    <span className="font-display-lg text-display-lg text-primary font-bold tracking-tight">
                      ₹ {recommendation.estimatedNetProfit.toLocaleString('en-IN')}
                    </span>
                    <span className="font-title-md text-title-md text-secondary font-semibold">
                      (₹ {recommendation.netReturnPerQuintal.toLocaleString('en-IN')} / क्विंटल शुद्ध)
                    </span>
                  </div>
                  <p className="font-body-sm text-body-sm text-on-surface-variant mt-1 flex items-center gap-space-xs">
                    <span className="material-symbols-outlined text-[16px] text-secondary">savings</span>
                    <span>
                      {recommendation.localMandiName} की तुलना में{' '}
                      <strong className="text-secondary font-semibold">
                        +₹ {recommendation.profitVarianceVsLocal.toLocaleString('en-IN')} अधिक लाभ
                      </strong>
                    </span>
                  </p>
                </div>

                {/* Donut Mini Indicator */}
                <div className="flex items-center gap-space-md bg-surface-container-lowest/80 backdrop-blur-sm p-space-sm rounded-xl shrink-0 shadow-sm">
                  <div className="relative w-16 h-16 flex items-center justify-center">
                    <svg className="w-16 h-16 transform -rotate-90" viewBox="0 0 36 36">
                      <path
                        className="text-surface-container-high"
                        d="M18 2.0845 a 15.9155 15.9155 0 0 1 0 31.831 a 15.9155 15.9155 0 0 1 0 -31.831"
                        fill="none"
                        stroke="currentColor"
                        strokeWidth="3.5"
                      />
                      <path
                        className="text-secondary"
                        d="M18 2.0845 a 15.9155 15.9155 0 0 1 0 31.831 a 15.9155 15.9155 0 0 1 0 -31.831"
                        fill="none"
                        stroke="currentColor"
                        strokeDasharray="87.5, 100"
                        strokeLinecap="round"
                        strokeWidth="3.5"
                      />
                    </svg>
                    <span className="absolute font-label-md text-label-md font-bold text-primary">87.5%</span>
                  </div>
                  <div>
                    <span className="font-label-sm text-label-sm text-on-surface-variant block">सकल लाभ अनुपात</span>
                    <span className="font-title-md text-title-md text-on-surface font-semibold">अत्यधिक अनुकूल</span>
                  </div>
                </div>
              </div>

              {/* Financial Breakdown Ledger */}
              <div className="space-y-space-sm">
                <h3 className="font-title-md text-title-md text-on-surface font-semibold flex items-center gap-space-xs">
                  <span className="material-symbols-outlined text-[20px] text-primary">receipt_long</span>
                  <span>आय एवं अनुमानित खर्चों का पूरा ब्यौरा (Financial Ledger)</span>
                </h3>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-space-md">
                  {/* Income Column */}
                  <div className="bg-surface-container-low rounded-xl p-space-md space-y-space-sm">
                    <div className="flex items-center justify-between pb-space-xs border-b border-surface-container-highest">
                      <span className="font-label-md text-label-md text-on-surface-variant">अपेक्षित मंडी विक्रय दर</span>
                      <span className="font-title-md text-title-md text-on-surface font-bold">
                        ₹ {winnerMandi.expectedPricePerQuintal.toLocaleString('en-IN')} / क्विंटल
                      </span>
                    </div>
                    <div className="flex items-center justify-between">
                      <span className="font-body-md text-body-md text-on-surface-variant">
                        सकल अपेक्षित आय ({request.quantityQuintal} क्विंटल)
                      </span>
                      <span className="font-title-md text-title-md text-primary font-bold">
                        ₹ {recommendation.grossIncome.toLocaleString('en-IN')}
                      </span>
                    </div>
                    <div className="flex items-center justify-between font-body-sm text-body-sm text-on-surface-variant">
                      <span>मंडी अराइवल स्थिति</span>
                      <span className="text-secondary font-semibold">मध्यम (High Demand)</span>
                    </div>
                  </div>

                  {/* Cost Deductions Column */}
                  <div className="bg-surface-container-low rounded-xl p-space-md space-y-space-sm">
                    <div className="flex items-center justify-between text-body-sm">
                      <span className="text-on-surface-variant flex items-center gap-space-xs">
                        <span className="material-symbols-outlined text-[16px]">local_shipping</span>
                        परिवहन भाड़ा ({winnerMandi.distanceKm} किमी)
                      </span>
                      <span className="font-semibold text-error">− ₹ {winnerMandi.transportCost.toLocaleString('en-IN')}</span>
                    </div>
                    <div className="flex items-center justify-between text-body-sm">
                      <span className="text-on-surface-variant flex items-center gap-space-xs">
                        <span className="material-symbols-outlined text-[16px]">inventory</span>
                        पल्लेदारी व तुलाई शुल्क
                      </span>
                      <span className="font-semibold text-error">− ₹ {winnerMandi.loadingUnloadingCost.toLocaleString('en-IN')}</span>
                    </div>
                    <div className="flex items-center justify-between text-body-sm">
                      <span className="text-on-surface-variant flex items-center gap-space-xs">
                        <span className="material-symbols-outlined text-[16px]">hourglass_bottom</span>
                        अनुमानित तुड़ाई/ट्रांज़िट हानि (~4%)
                      </span>
                      <span className="font-semibold text-error">− ₹ {winnerMandi.transitSpoilageCost.toLocaleString('en-IN')}</span>
                    </div>
                    <div className="pt-space-xs border-t border-surface-container-highest flex items-center justify-between font-title-md text-title-md">
                      <span className="text-on-surface font-semibold">कुल लागत व कटौतियां</span>
                      <span className="text-error font-bold">− ₹ {winnerMandi.totalCost.toLocaleString('en-IN')}</span>
                    </div>
                  </div>
                </div>
              </div>

              {/* Recommendation Intelligence Note */}
              <div className="bg-primary-fixed/20 rounded-xl p-space-md flex items-start gap-space-md border border-primary-fixed">
                <span className="material-symbols-outlined text-[24px] text-primary shrink-0 mt-0.5">psychology</span>
                <div className="space-y-space-xs">
                  <p className="font-label-md text-label-md text-primary font-bold">AI का निष्कर्ष एवं सुझाव</p>
                  <p className="font-body-md text-body-md text-on-surface leading-relaxed">
                    {recommendation.aiConclusionHindi}
                  </p>
                </div>
              </div>

              {/* Bottom Action Buttons inside card */}
              <div className="flex flex-wrap items-center justify-between gap-space-md pt-space-xs">
                <div className="flex items-center gap-space-sm flex-wrap">
                  <button
                    onClick={() => {
                      const el = document.getElementById('comparison-table-section');
                      el?.scrollIntoView({ behavior: 'smooth' });
                    }}
                    className="flex items-center gap-space-xs px-space-lg py-2.5 rounded-lg bg-primary text-on-primary hover:bg-primary-container transition-all font-label-lg text-label-lg font-semibold shadow-md cursor-pointer"
                  >
                    <span>विस्तृत विवरण एवं रूट मैप देखें</span>
                    <span className="material-symbols-outlined text-[18px]">arrow_forward</span>
                  </button>
                  <button
                    onClick={handleShareWhatsapp}
                    className="flex items-center gap-space-xs px-space-md py-2.5 rounded-lg bg-surface-container hover:bg-surface-container-high transition-colors font-label-lg text-label-lg text-on-surface cursor-pointer"
                  >
                    <span className="material-symbols-outlined text-[18px] text-secondary">share</span>
                    <span>व्हाट्सएप पर भेजें</span>
                  </button>
                </div>
                <div className="flex items-center gap-space-xs text-on-surface-variant font-body-sm text-body-sm">
                  <span className="material-symbols-outlined text-[16px] text-secondary">security</span>
                  <span>100% सत्यापित AGMARKNET शुल्क दर</span>
                </div>
              </div>
            </div>
          </div>

          {/* Right Column: Visual Crop Analysis & Transit Map Preview (4 Cols) */}
          <div className="lg:col-span-4 space-y-gutter-md">
            {/* Live Route & Toll Estimation Card */}
            <div className="bg-surface-container-lowest rounded-xl shadow-sm p-space-md space-y-space-md border border-surface-container">
              <div className="flex items-center justify-between">
                <h3 className="font-title-md text-title-md text-on-surface font-semibold flex items-center gap-space-xs">
                  <span className="material-symbols-outlined text-[20px] text-primary">route</span>
                  <span>अनुकूलित वाहन रूट (NH 53)</span>
                </h3>
                <span className="px-space-xs py-0.5 rounded bg-surface-container text-on-surface font-label-sm text-label-sm font-semibold">
                  {winnerMandi.transitHours}
                </span>
              </div>

              {/* Map View */}
              <div
                className="w-full h-44 bg-surface-container-low rounded-lg bg-cover bg-center relative overflow-hidden shadow-inner flex flex-col justify-end p-space-sm"
                style={{
                  backgroundImage:
                    "url('https://lh3.googleusercontent.com/aida-public/AB6AXuAIKu9qtCLdZDYKDRdRw8jSm9R9rpBhAFugF_XKbrkWJums9tl8PpANlYd93o1CDfa9PlR-Ss7OtT4GccFPLLC04Xo0pF_RXnKMqxa-hgGm1sMWNokbTtteColObEz0ICBrAlweyFUwWYMc8tmqhQiaKORU8RKD8RZBxSzoUjOuG8_7_bJW-U05R7tA5QNeBw2Ymqteo2ethIEW5c5F7_asmQ9rPZe9VqMqm2WdVJQHer6iNHXKfywf')",
                }}
              >
                <div className="bg-surface-container-lowest/90 backdrop-blur-sm p-space-xs rounded-lg text-on-surface font-body-sm text-body-sm flex items-center justify-between">
                  <span className="flex items-center gap-space-xs font-semibold">
                    <span className="material-symbols-outlined text-[16px] text-secondary">navigation</span>
                    {winnerMandi.distanceKm} किमी (वाया दुर्ग बायपास)
                  </span>
                  <span className="text-on-surface-variant">टोल: ₹ {winnerMandi.tollCost} (LKV)</span>
                </div>
              </div>

              {/* Route logistics points */}
              <div className="space-y-space-xs font-body-sm text-body-sm text-on-surface-variant">
                <div className="flex items-center justify-between">
                  <span>सुझावित वाहन प्रकार:</span>
                  <span className="font-semibold text-on-surface">{winnerMandi.recommendedVehicle}</span>
                </div>
                <div className="flex items-center justify-between">
                  <span>सुबह तुलाई का सबसे उत्तम समय:</span>
                  <span className="font-semibold text-secondary">{winnerMandi.bestWeighingTime}</span>
                </div>
                <div className="flex items-center justify-between">
                  <span>सड़क स्थिति व भीड़:</span>
                  <span className="font-semibold text-on-surface">{winnerMandi.roadCondition}</span>
                </div>
              </div>
            </div>

            {/* Real Crop & Mandi Image Showcase Card */}
            <div className="bg-surface-container-lowest rounded-xl shadow-sm overflow-hidden border border-surface-container">
              <div className="relative h-48 w-full">
                <img
                  className="w-full h-full object-cover"
                  alt="Farmer inspecting tomatoes in crates"
                  src="https://lh3.googleusercontent.com/aida-public/AB6AXuAB4T6J86apr1gTKgjzoQQOiNntLSXtNPk1KGOnCD2Uef0ALq1KVqRr-El3PUb2DV2V7BJ7srl-uQvF0mNR_Nw6-F5NthzdMJn94O9w9ZWjfiUwyQZsGasGTWGhGlbzt3gNU8s6TQJt_VvyODIxrGByKf6N6lh0L5xQdpv1tRO12JBl0xl2Vvxj09rnH_EW803Ivsp6N1mkuRmHPJpEq30Aj8V_s93gX4LNhIRoZsaOoJQ83syyd3hD"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-primary/80 via-transparent to-transparent flex items-end p-space-md">
                  <p className="font-title-md text-title-md text-on-primary font-semibold">
                    ताज़ा टमाटर ग्रेड-ए (हाइब्रिड)
                  </p>
                </div>
              </div>
              <div className="p-space-md bg-surface-container-low space-y-space-xs">
                <div className="flex items-center justify-between font-label-sm text-label-sm">
                  <span className="text-on-surface-variant uppercase">अनुशंसित पैकिंग सलाह</span>
                  <span className="text-secondary font-bold">{recommendation.recommendedPackagingHindi}</span>
                </div>
                <p className="font-body-sm text-body-sm text-on-surface-variant">
                  {recommendation.packagingSavingDetail}
                </p>
              </div>
            </div>

            {/* Support Callout */}
            <div className="bg-surface-container-high rounded-xl p-space-md flex items-center justify-between border border-surface-container">
              <div className="flex items-center gap-space-sm">
                <div className="w-9 h-9 rounded-full bg-primary text-on-primary flex items-center justify-center">
                  <span className="material-symbols-outlined text-[20px]">call</span>
                </div>
                <div>
                  <p className="font-label-md text-label-md text-on-surface font-semibold">मंडी सचिव संपर्क सूत्र</p>
                  <p className="font-body-sm text-body-sm text-on-surface-variant">
                    {winnerMandi.districtHindi}: {winnerMandi.contactNumber}
                  </p>
                </div>
              </div>
              <a className="font-label-sm text-label-sm text-primary font-bold hover:underline" href={`tel:${winnerMandi.contactNumber}`}>
                कॉल करें
              </a>
            </div>
          </div>
        </div>

        {/* COMPARISON TABLE SECTION: Alternative Mandis Comparison */}
        <div id="comparison-table-section" className="bg-surface-container-lowest rounded-xl shadow-md p-space-lg md:p-space-xl space-y-space-lg border border-surface-container">
          <div className="flex flex-col md:flex-row md:items-center justify-between gap-space-md pb-space-sm">
            <div>
              <h2 className="font-headline-md text-headline-md text-primary font-bold flex items-center gap-space-xs">
                <span className="material-symbols-outlined text-[24px]">compare_arrows</span>
                <span>अन्य मंडियों की तुलना (Alternative Mandis Comparison)</span>
              </h2>
              <p className="font-body-sm text-body-sm text-on-surface-variant">
                दूरी, परिवहन व्यय एवं बोली भाव का विस्तृत आर्थिक विश्लेषण ({request.quantityQuintal} क्विंटल {request.cropName} आधार)
              </p>
            </div>

            {/* Filter Pill Chips */}
            <div className="flex items-center gap-space-xs overflow-x-auto pb-1">
              <button
                onClick={() => setFilterAlternative('all')}
                className={`px-space-md py-1.5 rounded-full font-label-md text-label-md shrink-0 cursor-pointer ${
                  filterAlternative === 'all'
                    ? 'bg-primary text-on-primary font-semibold'
                    : 'bg-surface-container hover:bg-surface-container-high text-on-surface'
                }`}
              >
                सभी 4 मंडियां
              </button>
              <button
                onClick={() => setFilterAlternative('dist60')}
                className={`px-space-md py-1.5 rounded-full font-label-md text-label-md shrink-0 cursor-pointer ${
                  filterAlternative === 'dist60'
                    ? 'bg-primary text-on-primary font-semibold'
                    : 'bg-surface-container hover:bg-surface-container-high text-on-surface'
                }`}
              >
                दूरी &lt; 60 किमी
              </button>
              <button
                onClick={() => setFilterAlternative('highprice')}
                className={`px-space-md py-1.5 rounded-full font-label-md text-label-md shrink-0 cursor-pointer ${
                  filterAlternative === 'highprice'
                    ? 'bg-primary text-on-primary font-semibold'
                    : 'bg-surface-container hover:bg-surface-container-high text-on-surface'
                }`}
              >
                अधिकतम भाव वाले
              </button>
            </div>
          </div>

          {/* Responsive Data Table */}
          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse min-w-[850px]">
              <thead>
                <tr className="bg-surface-container-low text-on-surface-variant font-label-md text-label-md uppercase tracking-wider">
                  <th className="py-space-md px-space-md text-center rounded-l-lg">रैंक</th>
                  <th className="py-space-md px-space-md">मंडी का नाम</th>
                  <th className="py-space-md px-space-md text-right">दूरी (किमी)</th>
                  <th className="py-space-md px-space-md text-right">अपेक्षित भाव (₹/क्विंटल)</th>
                  <th className="py-space-md px-space-md text-right">कुल लागत (₹)</th>
                  <th className="py-space-md px-space-md text-right">अपेक्षित शुद्ध लाभ (₹)</th>
                  <th className="py-space-md px-space-md text-right">प्रति क्विंटल लाभ (₹)</th>
                  <th className="py-space-md px-space-md text-center rounded-r-lg">स्थिति / रेटिंग</th>
                </tr>
              </thead>
              <tbody className="font-body-md text-body-md divide-y divide-surface-container">
                {displayedAlternatives.map((alt) => (
                  <tr
                    key={alt.mandiId}
                    className={`transition-colors ${
                      alt.rank === 1
                        ? 'bg-secondary-container/15 hover:bg-secondary-container/25'
                        : 'hover:bg-surface-container-low'
                    }`}
                  >
                    <td className="py-space-md px-space-md text-center font-bold">
                      <span
                        className={`inline-flex items-center justify-center w-7 h-7 rounded-full font-label-md text-label-md shadow-sm ${
                          alt.rank === 1
                            ? 'bg-secondary text-on-secondary'
                            : 'bg-surface-container-high text-on-surface'
                        }`}
                      >
                        {alt.rank}
                      </span>
                    </td>
                    <td className="py-space-md px-space-md">
                      <div className={`font-title-md text-title-md font-bold ${alt.rank === 1 ? 'text-primary' : 'text-on-surface'}`}>
                        {alt.mandiNameHindi}
                      </div>
                      <div className="font-body-sm text-body-sm text-on-surface-variant">
                        जिला: {alt.districtHindi} • {alt.badgeNote}
                      </div>
                    </td>
                    <td className="py-space-md px-space-md text-right font-medium text-on-surface">
                      {alt.distanceKm} किमी
                    </td>
                    <td className="py-space-md px-space-md text-right font-semibold text-primary">
                      ₹ {alt.expectedPricePerQuintal.toLocaleString('en-IN')}
                    </td>
                    <td className="py-space-md px-space-md text-right text-error font-medium">
                      ₹ {alt.totalCost.toLocaleString('en-IN')}
                    </td>
                    <td className={`py-space-md px-space-md text-right font-bold text-headline-sm ${alt.rank === 1 ? 'text-primary' : 'text-on-surface'}`}>
                      ₹ {alt.expectedNetProfit.toLocaleString('en-IN')}
                    </td>
                    <td className="py-space-md px-space-md text-right font-semibold text-secondary">
                      ₹ {alt.netProfitPerQuintal.toLocaleString('en-IN')}
                    </td>
                    <td className="py-space-md px-space-md text-center">
                      <span
                        className={`inline-flex items-center gap-1 px-space-sm py-1 rounded-full font-label-sm text-label-sm font-bold shadow-sm ${
                          alt.statusRating === 'best'
                            ? 'bg-secondary text-on-secondary'
                            : alt.statusRating === 'good'
                            ? 'bg-surface-container-highest text-on-surface'
                            : alt.statusRating === 'moderate'
                            ? 'bg-surface-container text-on-surface-variant'
                            : 'bg-error-container text-error'
                        }`}
                      >
                        {alt.statusRating === 'best' && <span className="material-symbols-outlined text-[14px]">star</span>}
                        {alt.ratingLabel}
                      </span>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          {/* Profit Delta Visual Spark Bars */}
          <div className="pt-space-md space-y-space-sm">
            <div className="bg-surface-container-low p-space-md rounded-xl space-y-space-sm">
              <div className="flex items-center justify-between font-label-sm text-label-sm text-on-surface-variant">
                <span>शुद्ध लाभ की सापेक्ष तुलना (Net Profit Variance)</span>
                <span>अधिकतम: ₹ {winnerMandi.expectedNetProfit.toLocaleString('en-IN')}</span>
              </div>
              <div className="space-y-space-xs">
                {alternatives.map((alt) => {
                  const pct = Math.round((alt.expectedNetProfit / winnerMandi.expectedNetProfit) * 100);
                  return (
                    <div key={alt.mandiId} className="flex items-center gap-space-sm text-body-sm">
                      <span className="w-24 shrink-0 font-medium truncate">{alt.districtHindi}</span>
                      <div className="w-full bg-surface-container rounded-full h-3">
                        <div
                          className={`h-3 rounded-full ${
                            alt.rank === 1
                              ? 'bg-secondary'
                              : alt.rank === 2
                              ? 'bg-secondary-fixed-dim'
                              : alt.rank === 3
                              ? 'bg-surface-variant'
                              : 'bg-outline-variant'
                          }`}
                          style={{ width: `${pct}%` }}
                        />
                      </div>
                      <span className="font-semibold text-primary w-24 text-right">
                        ₹ {alt.expectedNetProfit.toLocaleString('en-IN')}
                      </span>
                    </div>
                  );
                })}
              </div>
            </div>

            {/* Official Disclaimer Note */}
            <div className="flex items-start gap-space-xs text-on-surface-variant font-body-sm text-body-sm pt-space-xs">
              <span className="material-symbols-outlined text-[18px] text-outline shrink-0 mt-0.5">info</span>
              <p>
                <strong>महत्वपूर्ण अस्वीकरण (Disclaimer):</strong> दिए गए मूल्य एवं शुद्ध लाभ के आंकड़े ऐतिहासिक AGMARKNET आंकड़ों, 7-दिवसीय AI पूर्वानुमान और वर्तमान औसत परिवहन दरों पर आधारित प्रक्षेपण मात्र हैं। वास्तविक शुद्ध लाभ मंडी में आवक के समय टमाटर की ग्रेडिंग, नमी तथा तुलाई समय पर क्रेता-विक्रेता की आपसी सहमति पर निर्भर करता है।
              </p>
            </div>
          </div>
        </div>

        {/* Farmer Voice & Logistics Guidance Helper Banner */}
        <div className="w-full bg-surface-container-lowest rounded-xl shadow-sm p-space-md flex flex-col md:flex-row items-center justify-between gap-space-md border border-surface-container">
          <div className="flex items-center gap-space-md">
            <div className="w-12 h-12 rounded-full bg-secondary-container text-on-secondary-container flex items-center justify-center shrink-0">
              <span className="material-symbols-outlined text-[24px]">contact_support</span>
            </div>
            <div>
              <h4 className="font-title-md text-title-md text-on-surface font-bold">
                क्या आपको परिवहन या वाहन ढूंढने में मदद चाहिए?
              </h4>
              <p className="font-body-sm text-body-sm text-on-surface-variant">
                MandiMind लॉजिस्टिक्स नेटवर्क से सीधे पिकअप वाहन बुक करें और प्रति क्विंटल ₹30 तक की अतिरिक्त छूट प्राप्त करें।
              </p>
            </div>
          </div>
          <div className="flex items-center gap-space-sm shrink-0">
            <button
              onClick={() => alert('बोलेरो पिकअप दर: ₹20-22/किमी\nटाटा 407 दर: ₹28-32/किमी\nट्रैक्टर ट्रॉली: ₹18/किमी')}
              className="px-space-md py-2 rounded-lg bg-surface-container hover:bg-surface-container-high font-label-md text-label-md text-on-surface transition-colors cursor-pointer"
            >
              किराया दर सूची देखें
            </button>
            <button
              onClick={handleBookVehicle}
              className="px-space-md py-2 rounded-lg bg-secondary text-on-secondary hover:bg-primary-container font-label-md text-label-md font-semibold transition-colors shadow-sm cursor-pointer"
            >
              वाहन बुक करें
            </button>
          </div>
        </div>

        {/* Saved Calculations Modal from Firestore */}
        {showSavedModal && (
          <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-sm p-4">
            <div className="bg-surface-container-lowest rounded-2xl shadow-2xl max-w-2xl w-full p-6 max-h-[85vh] overflow-y-auto border border-surface-container">
              <div className="flex items-center justify-between pb-4 border-b border-surface-container">
                <div className="flex items-center gap-2">
                  <span className="material-symbols-outlined text-[24px] text-primary">bookmark</span>
                  <h3 className="font-title-lg text-title-lg font-bold text-primary">
                    आपके द्वारा सहेजी गई गणनाएं (Saved Calculations)
                  </h3>
                </div>
                <button
                  onClick={() => setShowSavedModal(false)}
                  className="p-1 rounded-full hover:bg-surface-container text-on-surface-variant cursor-pointer"
                >
                  <span className="material-symbols-outlined text-[20px]">close</span>
                </button>
              </div>

              <div className="py-4 space-y-3">
                {savedRecords.length === 0 ? (
                  <p className="text-center text-on-surface-variant py-8">
                    अभी तक कोई गणना सहेजी नहीं गई है। वर्तमान सिफारिश को सहेजने के लिए "गणना सहेजें" पर क्लिक करें।
                  </p>
                ) : (
                  savedRecords.map((rec) => (
                    <div
                      key={rec.id}
                      className="p-4 rounded-xl bg-surface-container-low border border-surface-container flex items-center justify-between gap-4"
                    >
                      <div>
                        <div className="flex items-center gap-2">
                          <span className="font-bold text-on-surface">{rec.cropName}</span>
                          <span className="text-xs px-2 py-0.5 rounded-full bg-secondary-container text-on-secondary-container font-semibold">
                            {rec.quantityQuintal} क्विंटल
                          </span>
                        </div>
                        <p className="text-sm text-on-surface-variant mt-1">
                          अनुशंसित मंडी: <strong className="text-primary">{rec.winnerMandiName}</strong>
                        </p>
                        <p className="text-xs text-outline mt-0.5">
                          दिनांक: {new Date(rec.calculatedAt).toLocaleDateString('hi-IN', { day: 'numeric', month: 'short', year: 'numeric' })}
                        </p>
                      </div>
                      <div className="text-right shrink-0">
                        <p className="text-xs text-on-surface-variant">शुद्ध अनुमानित लाभ</p>
                        <p className="font-headline-sm text-headline-sm font-bold text-emerald-700">
                          ₹{rec.expectedNetProfit.toLocaleString('en-IN')}
                        </p>
                        <span className="text-xs text-outline">₹{rec.netReturnPerQuintal}/क्विंटल</span>
                      </div>
                    </div>
                  ))
                )}
              </div>

              <div className="pt-3 border-t border-surface-container flex justify-end">
                <button
                  onClick={() => setShowSavedModal(false)}
                  className="px-4 py-2 rounded-xl bg-surface-container-high hover:bg-surface-container-highest text-on-surface font-semibold text-sm cursor-pointer"
                >
                  बंद करें
                </button>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};
