export type Language = 'hi' | 'en' | 'cg';

export interface Translations {
  appName: string;
  tagline: string;
  subTagline: string;
  home: string;
  mandiRates: string;
  bestMandi: string;
  weather: string;
  schemes: string;
  fertilizerAndPesticide: string;
  cropCare: string;
  more: string;
  marketTrends: string;
  transportLogistics: string;
  agriNews: string;
  mandiComparison: string;
  voiceAssistant: string;
  offlineStatus: string;
  speakToAsk: string;
  agmarknetLive: string;
  serverActive: string;
  lastUpdated: string;
  searchPlaceholder: string;
  speak: string;
  search: string;
  quickSearch: string;
  quickAccess: string;
  quickAccessSub: string;
  currencyPerQuintal: string;
  viewAll: string;
  disclaimer: string;
  aiSuggestedPick: string;
  estimatedNetProfit: string;
  transportDeduction: string;
  details: string;
  kisanCallCenter: string;
  offlineReadyNotice: string;
  syncActive: string;
}

export const translationsMap: Record<Language, Translations> = {
  hi: {
    appName: 'MandiMind AI',
    tagline: 'सही जानकारी, बेहतर फ़ैसला',
    subTagline: 'Better Information. Higher Returns.',
    home: 'Home',
    mandiRates: 'Mandi Rates',
    bestMandi: 'Best Mandi',
    weather: 'Weather',
    schemes: 'Schemes',
    fertilizerAndPesticide: 'Fertilizer & Pesticide',
    cropCare: 'Crop Care',
    more: 'More',
    marketTrends: 'Market Trends',
    transportLogistics: 'Transport Logistics',
    agriNews: 'Agri News',
    mandiComparison: 'Nearby Mandi Comparison',
    voiceAssistant: 'Voice Assistant',
    offlineStatus: 'Offline Status & Sync',
    speakToAsk: 'बोलकर पूछें',
    agmarknetLive: 'AGMARKNET Live',
    serverActive: 'ई-नाम (e-NAM) व AGMARKNET सर्वर एक्टिव',
    lastUpdated: 'अंतिम अपडेट: आज 11:30 AM',
    searchPlaceholder: 'फसल का नाम बोलें या टाइप करें (जैसे - टमाटर, प्याज, गेहूँ)...',
    speak: 'बोलें',
    search: 'खोजें',
    quickSearch: 'त्वरित खोज:',
    quickAccess: 'किसान उपयोगी उपकरण एवं सेवाएं',
    quickAccessSub: 'अपनी आवश्यकतानुसार सेवा चुनें और सटीक निर्णय लें',
    currencyPerQuintal: '₹ / क्विंटल',
    viewAll: 'सभी देखें →',
    disclaimer: 'यह डेटा AGMARKNET पोर्टल (कृषि एवं किसान कल्याण मंत्रालय) से प्राप्त है।',
    aiSuggestedPick: 'आज का AI मंडी सुझाव (AI Pick)',
    estimatedNetProfit: 'अनुमानित शुद्ध लाभ',
    transportDeduction: 'परिवहन व भाड़ा कटौत',
    details: 'विस्तार देखें',
    kisanCallCenter: 'किसान हेल्पलाइन: 1800-180-1551',
    offlineReadyNotice: 'ऑफ़लाइन सुविधा (Offline-First Ready)',
    syncActive: 'AGMARKNET Sync Active',
  },
  en: {
    appName: 'MandiMind AI',
    tagline: 'Accurate Information, Superior Decisions',
    subTagline: 'Better Information. Higher Returns.',
    home: 'Home',
    mandiRates: 'Mandi Rates',
    bestMandi: 'Best Mandi',
    weather: 'Weather',
    schemes: 'Schemes',
    fertilizerAndPesticide: 'Fertilizer & Pesticide',
    cropCare: 'Crop Care',
    more: 'More',
    marketTrends: 'Market Trends',
    transportLogistics: 'Transport Logistics',
    agriNews: 'Agri News',
    mandiComparison: 'Mandi Comparison',
    voiceAssistant: 'Voice Assistant',
    offlineStatus: 'Offline Status & Sync',
    speakToAsk: 'Voice Search',
    agmarknetLive: 'AGMARKNET Live',
    serverActive: 'e-NAM & AGMARKNET Server Active',
    lastUpdated: 'Last Updated: Today 11:30 AM',
    searchPlaceholder: 'Speak or type crop name (e.g. Tomato, Onion, Wheat)...',
    speak: 'Speak',
    search: 'Search',
    quickSearch: 'Quick Search:',
    quickAccess: 'Farmer Tools & Smart Services',
    quickAccessSub: 'Select a service to get accurate data and maximum returns',
    currencyPerQuintal: '₹ / Quintal',
    viewAll: 'View All →',
    disclaimer: 'Data sourced from Ministry of Agriculture AGMARKNET portal.',
    aiSuggestedPick: "Today's AI Mandi Pick",
    estimatedNetProfit: 'Estimated Net Profit',
    transportDeduction: 'Freight & Toll Deductions',
    details: 'View Details',
    kisanCallCenter: 'Kisan Toll Free Helpline: 1800-180-1551',
    offlineReadyNotice: 'Offline-First Ready',
    syncActive: 'AGMARKNET Sync Active',
  },
  cg: {
    appName: 'MandiMind AI',
    tagline: 'सही जानकारी, बढ़िया फ़ैसला',
    subTagline: 'Better Information. Higher Returns.',
    home: 'Home',
    mandiRates: 'Mandi Rates',
    bestMandi: 'Best Mandi',
    weather: 'Weather',
    schemes: 'Schemes',
    fertilizerAndPesticide: 'Fertilizer & Pesticide',
    cropCare: 'Crop Care',
    more: 'More',
    marketTrends: 'Market Trends',
    transportLogistics: 'Transport Logistics',
    agriNews: 'Agri News',
    mandiComparison: 'Nearby Mandi Comparison',
    voiceAssistant: 'Voice Assistant',
    offlineStatus: 'Offline Status & Sync',
    speakToAsk: 'बोल के पूछव',
    agmarknetLive: 'AGMARKNET Live',
    serverActive: 'ई-नाम (e-NAM) व AGMARKNET सर्वर चालू हे',
    lastUpdated: 'अंतिम अपडेट: आज 11:30 AM',
    searchPlaceholder: 'फसल के नाम बोलव या लिखव (जैसे - टमाटर, प्याज, धान)...',
    speak: 'बोलव',
    search: 'खोजव',
    quickSearch: 'झटपट खोज:',
    quickAccess: 'किसान बर उपयोगी साधन अउ सेवा मन',
    quickAccessSub: 'अपन पसंद के सेवा चुनव अउ सही निर्णय लेवव',
    currencyPerQuintal: '₹ / क्विंटल',
    viewAll: 'सबो देखव →',
    disclaimer: 'यह जानकारी भारत सरकार के AGMARKNET पोर्टल ले हे।',
    aiSuggestedPick: 'आज के AI मंडी सुझाव',
    estimatedNetProfit: 'अनुमानित शुद्ध फायदा',
    transportDeduction: 'भाड़ा अउ टोल खर्च',
    details: 'विस्तार देखव',
    kisanCallCenter: 'किसान हेल्पलाइन: 1800-180-1551',
    offlineReadyNotice: 'ऑफ़लाइन सुविधा चालू हे',
    syncActive: 'AGMARKNET Sync Active',
  },
};
