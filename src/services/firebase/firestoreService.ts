import {
  collection,
  doc,
  getDoc,
  getDocs,
  setDoc,
  deleteDoc,
  query,
  where,
  orderBy,
  serverTimestamp,
} from 'firebase/firestore';
import { db, handleFirestoreError, OperationType } from './firebase';
import { UserProfile, UserRole } from '../../types/app.types';
import { MandiRateRecord } from '../../types/mandi.types';

export interface SavedRecommendationRecord {
  id: string;
  userId: string;
  cropId: string;
  cropName: string;
  quantityQuintal: number;
  winnerMandiName: string;
  expectedNetProfit: number;
  netReturnPerQuintal: number;
  calculatedAt: string;
}

export interface UserPrivateInfoRecord {
  userId: string;
  phone: string;
  village?: string;
  landAreaAcres?: number;
  updatedAt?: string;
}

export interface PriceAlertRecord {
  id: string;
  userId: string;
  phone: string;
  crop: string;
  mandiName: string;
  createdAt: string;
}

// 1. User Profile Management
export async function fetchUserProfile(userId: string): Promise<UserProfile | null> {
  const path = `users/${userId}`;
  try {
    const snap = await getDoc(doc(db, 'users', userId));
    if (snap.exists()) {
      return snap.data() as UserProfile;
    }
    return null;
  } catch (error) {
    handleFirestoreError(error, OperationType.GET, path);
  }
}

export async function upsertUserProfile(profile: Partial<UserProfile> & { userId: string }): Promise<void> {
  const path = `users/${profile.userId}`;
  try {
    const dataToSave = {
      ...profile,
      updatedAt: new Date().toISOString(),
    };
    await setDoc(doc(db, 'users', profile.userId), dataToSave, { merge: true });
  } catch (error) {
    handleFirestoreError(error, OperationType.WRITE, path);
  }
}

// 2. User Private Info (Isolated PII)
export async function fetchUserPrivateInfo(userId: string): Promise<UserPrivateInfoRecord | null> {
  const path = `users/${userId}/private/info`;
  try {
    const snap = await getDoc(doc(db, 'users', userId, 'private', 'info'));
    if (snap.exists()) {
      return snap.data() as UserPrivateInfoRecord;
    }
    return null;
  } catch (error) {
    handleFirestoreError(error, OperationType.GET, path);
  }
}

export async function upsertUserPrivateInfo(userId: string, pii: Partial<UserPrivateInfoRecord>): Promise<void> {
  const path = `users/${userId}/private/info`;
  try {
    await setDoc(
      doc(db, 'users', userId, 'private', 'info'),
      {
        ...pii,
        userId,
        updatedAt: new Date().toISOString(),
      },
      { merge: true }
    );
  } catch (error) {
    handleFirestoreError(error, OperationType.WRITE, path);
  }
}

// 3. Saved Mandi Recommendations
export async function persistSavedRecommendation(userId: string, rec: Omit<SavedRecommendationRecord, 'id' | 'calculatedAt'>): Promise<string> {
  const recId = `rec_${Date.now()}_${Math.random().toString(36).substring(2, 7)}`;
  const path = `users/${userId}/savedRecommendations/${recId}`;
  try {
    const payload: SavedRecommendationRecord = {
      ...rec,
      id: recId,
      calculatedAt: new Date().toISOString(),
    };
    await setDoc(doc(db, 'users', userId, 'savedRecommendations', recId), payload);
    return recId;
  } catch (error) {
    handleFirestoreError(error, OperationType.CREATE, path);
  }
}

export async function fetchSavedRecommendations(userId: string): Promise<SavedRecommendationRecord[]> {
  const path = `users/${userId}/savedRecommendations`;
  try {
    const snap = await getDocs(collection(db, 'users', userId, 'savedRecommendations'));
    return snap.docs.map((d) => d.data() as SavedRecommendationRecord);
  } catch (error) {
    handleFirestoreError(error, OperationType.LIST, path);
  }
}

export async function removeSavedRecommendation(userId: string, recId: string): Promise<void> {
  const path = `users/${userId}/savedRecommendations/${recId}`;
  try {
    await deleteDoc(doc(db, 'users', userId, 'savedRecommendations', recId));
  } catch (error) {
    handleFirestoreError(error, OperationType.DELETE, path);
  }
}

// 4. Live AGMARKNET Mandi Price Records
export async function fetchFirestoreMandiRates(): Promise<MandiRateRecord[]> {
  const path = 'mandiPriceRecords';
  try {
    const snap = await getDocs(collection(db, path));
    if (snap.empty) return [];
    return snap.docs.map((d) => ({ id: d.id, ...d.data() } as MandiRateRecord));
  } catch (error) {
    handleFirestoreError(error, OperationType.LIST, path);
  }
}

export async function upsertFirestoreMandiRate(record: MandiRateRecord): Promise<void> {
  const path = `mandiPriceRecords/${record.id}`;
  try {
    await setDoc(doc(db, 'mandiPriceRecords', record.id), record, { merge: true });
  } catch (error) {
    handleFirestoreError(error, OperationType.WRITE, path);
  }
}

// 5. Price Alert Subscriptions
export async function createPriceAlert(userId: string, alert: { phone: string; crop: string; mandiName: string }): Promise<string> {
  const alertId = `alert_${Date.now()}_${Math.random().toString(36).substring(2, 7)}`;
  const path = `alerts/${alertId}`;
  try {
    const payload: PriceAlertRecord = {
      id: alertId,
      userId,
      phone: alert.phone,
      crop: alert.crop,
      mandiName: alert.mandiName,
      createdAt: new Date().toISOString(),
    };
    await setDoc(doc(db, 'alerts', alertId), payload);
    return alertId;
  } catch (error) {
    handleFirestoreError(error, OperationType.CREATE, path);
  }
}

export async function fetchUserPriceAlerts(userId: string): Promise<PriceAlertRecord[]> {
  const path = 'alerts';
  try {
    const q = query(collection(db, path), where('userId', '==', userId));
    const snap = await getDocs(q);
    return snap.docs.map((d) => d.data() as PriceAlertRecord);
  } catch (error) {
    handleFirestoreError(error, OperationType.LIST, path);
  }
}

export async function deletePriceAlert(alertId: string): Promise<void> {
  const path = `alerts/${alertId}`;
  try {
    await deleteDoc(doc(db, 'alerts', alertId));
  } catch (error) {
    handleFirestoreError(error, OperationType.DELETE, path);
  }
}
