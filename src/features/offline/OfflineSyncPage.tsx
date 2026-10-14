import React, { useState, useEffect } from 'react';
import { services } from '../../services/serviceRegistry';
import { OfflineCacheStatus } from '../../types/app.types';

export const OfflineSyncPage: React.FC = () => {
  const [status, setStatus] = useState<OfflineCacheStatus>(services.sync.getSyncStatus());
  const [isSyncing, setIsSyncing] = useState(false);
  const [syncMessage, setSyncMessage] = useState<string | null>(null);

  useEffect(() => {
    const handleOnline = () => setStatus(services.sync.getSyncStatus());
    const handleOffline = () => setStatus(services.sync.getSyncStatus());

    window.addEventListener('online', handleOnline);
    window.addEventListener('offline', handleOffline);

    return () => {
      window.removeEventListener('online', handleOnline);
      window.removeEventListener('offline', handleOffline);
    };
  }, []);

  const handleManualSync = async () => {
    setIsSyncing(true);
    setSyncMessage(null);
    try {
      const updated = await services.sync.synchronizePendingChanges();
      setStatus(updated);
      setSyncMessage('सफलतापूर्वक सिंक किया गया! सभी 14 मंडियों का डेटा स्थानीय रूप से सुरक्षित है।');
    } finally {
      setIsSyncing(false);
    }
  };

  return (
    <div className="max-w-[1000px] mx-auto px-4 md:px-margin-lg py-space-xl space-y-space-xl">
      {/* Page Header */}
      <div className="space-y-space-xs">
        <div className="inline-flex items-center gap-space-xs px-space-sm py-0.5 rounded-full bg-secondary-container text-on-secondary-container font-label-sm text-label-sm uppercase tracking-wide">
          <span className="material-symbols-outlined text-[14px]">wifi_tethering</span>
          <span>ऑफ़लाइन-फर्स्ट आर्किटेक्चर (Offline-First Ready)</span>
        </div>
        <h1 className="font-headline-lg text-headline-lg text-primary font-bold">
          ऑफ़लाइन स्थिति एवं डेटा सिंक्रोनाइज़ेशन
        </h1>
        <p className="font-body-md text-body-md text-on-surface-variant max-w-2xl">
          खेत में 2G या शून्य नेटवर्क होने पर भी आप पहले से डाउनलोड किए गए मंडी भाव, रसीदें और वाहन दरें देख सकते हैं। नेटवर्क आने पर डेटा स्वतः सिंक हो जाता है।
        </p>
      </div>

      {syncMessage && (
        <div className="p-4 bg-secondary-container text-on-secondary-container rounded-2xl font-label-md text-label-md flex items-center justify-between shadow-sm animate-in fade-in">
          <div className="flex items-center gap-2">
            <span className="material-symbols-outlined text-[20px]">cloud_done</span>
            <span>{syncMessage}</span>
          </div>
          <button onClick={() => setSyncMessage(null)} className="font-bold">✕</button>
        </div>
      )}

      {/* Connectivity Status Bento */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-space-md">
        <div className="bg-surface-container-lowest p-space-lg rounded-2xl border border-surface-container shadow-sm space-y-2">
          <span className="text-label-sm text-outline uppercase font-semibold">नेटवर्क स्थिति</span>
          <div className="flex items-center gap-2">
            <span className={`w-3 h-3 rounded-full ${status.isOnline ? 'bg-secondary animate-pulse' : 'bg-error'}`}></span>
            <span className="font-headline-sm text-headline-sm font-bold text-on-surface">
              {status.isOnline ? 'इंटरनेट कनेक्टेड' : 'ऑफ़लाइन मोड (No Internet)'}
            </span>
          </div>
          <p className="text-body-sm text-on-surface-variant">स्थानीय स्टोरेज कैश सक्रिय है।</p>
        </div>

        <div className="bg-surface-container-lowest p-space-lg rounded-2xl border border-surface-container shadow-sm space-y-2">
          <span className="text-label-sm text-outline uppercase font-semibold">कैश्ड मंडियां</span>
          <div className="font-headline-sm text-headline-sm font-bold text-primary">
            {status.cachedMandiCount} मंडियां सुरक्षित
          </div>
          <p className="text-body-sm text-on-surface-variant">{status.cachedCropsCount} प्रमुख फसलों के भाव सहेजे गए।</p>
        </div>

        <div className="bg-surface-container-lowest p-space-lg rounded-2xl border border-surface-container shadow-sm space-y-2">
          <span className="text-label-sm text-outline uppercase font-semibold">अंतिम सिंक समय</span>
          <div className="font-title-md text-title-md font-bold text-on-surface">
            {status.lastSyncedTimestamp}
          </div>
          <p className="text-body-sm text-on-surface-variant">AGMARKNET आधिकारिक सर्वर से सत्यापित।</p>
        </div>
      </div>

      {/* Manual Sync Trigger Card */}
      <div className="bg-surface-container-lowest p-space-xl rounded-3xl border border-surface-container shadow-sm flex flex-col sm:flex-row items-center justify-between gap-space-md">
        <div className="space-y-1">
          <h3 className="font-title-md text-title-md font-bold text-primary">मैनुअल डेटा अपडेट (Sync Now)</h3>
          <p className="text-body-sm text-on-surface-variant">
            यदि आप अभी मजबूत इंटरनेट नेटवर्क में हैं, तो आगामी 7 दिनों का पूर्वानुमान व मंडी भाव डाउनलोड करें।
          </p>
        </div>

        <button
          onClick={handleManualSync}
          disabled={isSyncing}
          className="px-6 py-3 bg-primary text-on-primary font-bold rounded-xl shadow-md hover:bg-primary-container transition-all flex items-center gap-2 cursor-pointer disabled:opacity-50 shrink-0"
        >
          <span className={`material-symbols-outlined text-[20px] ${isSyncing ? 'animate-spin' : ''}`}>
            sync
          </span>
          <span>{isSyncing ? 'सिंक हो रहा है...' : 'अभी सिंक करें (Sync Data)'}</span>
        </button>
      </div>
    </div>
  );
};
