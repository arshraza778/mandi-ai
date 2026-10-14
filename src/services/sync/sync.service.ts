import { OfflineCacheStatus } from '../../types/app.types';
import { INITIAL_MANDI_RECORDS } from '../../mocks/mandiData';

export class SyncService {
  private cacheKey = 'mandimind_offline_rates';
  private syncMetaKey = 'mandimind_sync_meta';

  constructor() {
    this.ensureBaselineCache();
  }

  private ensureBaselineCache() {
    if (!localStorage.getItem(this.cacheKey)) {
      localStorage.setItem(this.cacheKey, JSON.stringify(INITIAL_MANDI_RECORDS));
      localStorage.setItem(
        this.syncMetaKey,
        JSON.stringify({
          lastSynced: '13-10-2026, 11:45 AM',
          pendingReceipts: 0,
        })
      );
    }
  }

  public getSyncStatus(): OfflineCacheStatus {
    const isOnline = typeof navigator !== 'undefined' ? navigator.onLine : true;
    let meta = { lastSynced: '13-10-2026, 11:45 AM', pendingReceipts: 0 };
    try {
      const stored = localStorage.getItem(this.syncMetaKey);
      if (stored) meta = JSON.parse(stored);
    } catch {
      // fallback
    }

    return {
      isOnline,
      lastSyncedTimestamp: meta.lastSynced,
      cachedMandiCount: 14,
      cachedCropsCount: 8,
      offlineReceiptsPending: meta.pendingReceipts,
    };
  }

  public async synchronizePendingChanges(): Promise<OfflineCacheStatus> {
    await new Promise((r) => setTimeout(r, 600));
    const now = new Date().toLocaleDateString('hi-IN', {
      day: '2-digit',
      month: '2-digit',
      year: 'numeric',
      hour: '2-digit',
      minute: '2-digit',
    });

    localStorage.setItem(
      this.syncMetaKey,
      JSON.stringify({
        lastSynced: `आज, ${now}`,
        pendingReceipts: 0,
      })
    );

    return this.getSyncStatus();
  }
}

export const syncService = new SyncService();
