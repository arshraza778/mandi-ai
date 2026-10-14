import React from 'react';
import { Link } from 'react-router-dom';

export const FeaturesOverviewPage: React.FC = () => {
  const modules = [
    {
      title: 'Farmer Home Dashboard',
      hindiTitle: 'किसान होम डैशबोर्ड',
      description: 'लाइव वेदर, ताज़ा बाजार भाव, स्पार्कलाइन ट्रेंड्स, त्वरित सेवाएं एवं AI मंडी पिक।',
      path: '/',
      icon: 'dashboard',
    },
    {
      title: 'Mandi Price Report (AGMARKNET Style)',
      hindiTitle: 'मंडी भाव एवं आवक रिपोर्ट',
      description: 'राज्य, जिला, मंडी और तारीख के अनुसार मोडल भाव, न्यूनतम-अधिकतम दर, आवक और CSV एक्सपोर्ट।',
      path: '/mandi-rates',
      icon: 'table_view',
    },
    {
      title: 'Best Mandi Recommendation Engine',
      hindiTitle: 'सर्वश्रेष्ठ मंडी भविष्यवक्ता',
      description: 'दूरी, डीजल खर्च, पल्लेदारी व तुलाई काटकर अधिकतम शुद्ध लाभ (Net Profit) देने वाली मंडी का सुझाव।',
      path: '/best-mandi',
      icon: 'auto_awesome',
    },
    {
      title: 'Price Forecasting & Market Trends',
      hindiTitle: 'मूल्य पूर्वानुमान एवं ऐतिहासिक विश्लेषण',
      description: 'Prophet + LightGBM v4.2 मॉडल द्वारा 95% विश्वास अंतराल के साथ 7-दिवसीय मूल्य प्रक्षेपण।',
      path: '/market-trends',
      icon: 'insights',
    },
    {
      title: 'Nearby Mandi Comparison',
      hindiTitle: 'आसपास की मंडियों की तुलना',
      description: 'विभिन्न मंडियों की दूरी, भाड़ा और शुद्ध मुनाफे की आमने-सामने तुलना।',
      path: '/mandi-comparison',
      icon: 'compare_arrows',
    },
    {
      title: 'Weather & Spray Advisory',
      hindiTitle: 'मौसम व कटाई अनुकूलता',
      description: 'तापमान, आर्द्रता, हवा की गति और कीटनाशक छिड़काव के लिए सुरक्षित समय खिड़की।',
      path: '/weather',
      icon: 'partly_cloudy_day',
    },
    {
      title: 'Government Schemes Portal',
      hindiTitle: 'सरकारी योजनाएं व सब्सिडी',
      description: 'पीएम-किसान, फसल बीमा, सोलर पंप और गोदाम निर्माण अनुदान के लिए पात्रता व दस्तावेज।',
      path: '/schemes',
      icon: 'account_balance',
    },
    {
      title: 'Fertilizer & Pesticide Calculator',
      hindiTitle: 'खाद मात्रा वैज्ञानिक कैलकुलेटर',
      description: 'एकड़ व मिट्टी के प्रकार अनुसार यूरिया, डीएपी और पोटाश की सटीक बोरियों की गणना।',
      path: '/fertilizer-and-pesticide',
      icon: 'science',
    },
    {
      title: 'Crop Care & Disease Diagnosis',
      hindiTitle: 'फसल रोग पहचान व उपचार',
      description: 'झुलसा रोग, रतुआ, बैंगनी धब्बा के लक्षण और जैविक व रासायनिक कीटनाशक संस्तुतियां।',
      path: '/crop-care',
      icon: 'psychiatry',
    },
    {
      title: 'Bhashini Voice Assistant',
      hindiTitle: 'भाषिणी AI वॉइस असिस्टेंट',
      description: 'स्थानीय बोली में प्रश्न पूछें और वॉइस आउटपुट द्वारा समाधान प्राप्त करें।',
      path: '/voice-assistant',
      icon: 'mic',
    },
    {
      title: 'Offline-First & Local Cache',
      hindiTitle: 'ऑफ़लाइन सुविधा व सिंक',
      description: 'नेटवर्क विहीन ग्रामीण अंचलों में स्थानीय कैशिंग और नेटवर्क आने पर स्वचालित सिंक।',
      path: '/offline-sync',
      icon: 'wifi_tethering',
    },
  ];

  return (
    <div className="max-w-[1280px] mx-auto px-4 md:px-margin-lg py-space-xl space-y-space-xl">
      <div className="space-y-space-xs text-center max-w-2xl mx-auto">
        <span className="inline-flex items-center gap-1 px-3 py-1 rounded-full bg-primary-fixed text-primary font-label-md text-label-md font-bold uppercase">
          MandiMind AI संपूर्ण रूपरेखा
        </span>
        <h1 className="font-headline-lg text-headline-lg text-primary font-bold">
          कृषि प्रौद्योगिकी एवं AI मॉड्यूल संग्रह
        </h1>
        <p className="font-body-md text-body-md text-on-surface-variant">
          Google Stitch से आयातित वास्तविक UI डिज़ाइन और भारतीय किसानों के लिए निर्मित एक्सटेंसिबल फ्रंटएंड।
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-space-lg">
        {modules.map((m) => (
          <Link
            key={m.title}
            to={m.path}
            className="group bg-surface-container-lowest p-space-lg rounded-3xl border border-surface-container shadow-sm hover:shadow-md transition-all flex flex-col justify-between gap-space-md"
          >
            <div className="space-y-2">
              <div className="w-12 h-12 rounded-2xl bg-surface-container-low group-hover:bg-primary-container group-hover:text-on-primary text-primary flex items-center justify-center transition-colors">
                <span className="material-symbols-outlined text-[28px]">{m.icon}</span>
              </div>
              <h3 className="font-headline-sm text-headline-sm text-primary font-bold">
                {m.hindiTitle}
              </h3>
              <p className="font-label-sm text-label-sm text-outline">{m.title}</p>
              <p className="font-body-sm text-body-sm text-on-surface-variant leading-relaxed">
                {m.description}
              </p>
            </div>
            <span className="font-label-md text-label-md text-secondary font-bold inline-flex items-center gap-1 group-hover:translate-x-1 transition-transform">
              पेज खोलें →
            </span>
          </Link>
        ))}
      </div>
    </div>
  );
};
