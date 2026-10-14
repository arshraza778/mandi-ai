import React, { createContext, useContext, useState, useEffect } from 'react';
import { User } from 'firebase/auth';
import { auth, googleProvider } from '../services/firebase/firebase';
import { signInWithPopup, signOut, onAuthStateChanged } from 'firebase/auth';
import { fetchUserProfile, upsertUserProfile } from '../services/firebase/firestoreService';
import { UserProfile, UserRole } from '../types/app.types';
import { authService } from '../services/authentication/auth.service';

interface AuthContextType {
  firebaseUser: User | null;
  profile: UserProfile;
  loading: boolean;
  isGoogleAuthenticated: boolean;
  loginWithGoogle: () => Promise<void>;
  logout: () => Promise<void>;
  switchRole: (role: UserRole) => Promise<void>;
  updateDistrictState: (district: string, state: string) => Promise<void>;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [firebaseUser, setFirebaseUser] = useState<User | null>(null);
  const [profile, setProfile] = useState<UserProfile>(authService.getCurrentUser());
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, async (user) => {
      setFirebaseUser(user);
      if (user) {
        try {
          // Check if admin email
          const isAdminUser = user.email === 'arshadraza20055@gmail.com';
          const existingProfile = await fetchUserProfile(user.uid);

          if (existingProfile) {
            const resolvedRole: UserRole = isAdminUser ? 'admin' : existingProfile.role || 'farmer';
            const updated = {
              ...existingProfile,
              role: resolvedRole,
            };
            setProfile(updated);
            authService.switchRole(resolvedRole);
          } else {
            // First time login - seed new profile
            const newProfile: UserProfile = {
              id: user.uid,
              name: user.displayName || 'किसान मित्र',
              role: isAdminUser ? 'admin' : 'farmer',
              phone: user.phoneNumber || '9876543210',
              village: 'रायपुर ग्रामीण',
              district: 'Raipur',
              state: 'Chhattisgarh',
              preferredLanguage: 'hi',
              landAreaAcres: 3.5,
              primaryCrops: ['टमाटर (Tomato)', 'धान (Paddy)'],
            };
            await upsertUserProfile({
              userId: user.uid,
              name: newProfile.name,
              role: newProfile.role,
              preferredLanguage: newProfile.preferredLanguage,
              district: newProfile.district,
              state: newProfile.state,
              village: newProfile.village,
            });
            setProfile(newProfile);
            authService.switchRole(newProfile.role);
          }
        } catch (err) {
          console.warn('Could not sync profile with Firestore:', err);
        }
      }
      setLoading(false);
    });

    return () => unsubscribe();
  }, []);

  const loginWithGoogle = async () => {
    try {
      const res = await signInWithPopup(auth, googleProvider);
      const user = res.user;
      const isAdminUser = user.email === 'arshadraza20055@gmail.com';
      const role: UserRole = isAdminUser ? 'admin' : 'farmer';
      
      const newProf: UserProfile = {
        id: user.uid,
        name: user.displayName || 'किसान मित्र',
        role,
        phone: user.phoneNumber || '9876543210',
        village: 'रायपुर ग्रामीण',
        district: 'Raipur',
        state: 'Chhattisgarh',
        preferredLanguage: 'hi',
        landAreaAcres: 3.5,
        primaryCrops: ['टमाटर', 'धान'],
      };

      setProfile(newProf);
      authService.switchRole(role);

      await upsertUserProfile({
        userId: user.uid,
        name: newProf.name,
        role: newProf.role,
        preferredLanguage: newProf.preferredLanguage,
        district: newProf.district,
        state: newProf.state,
        village: newProf.village,
      });
    } catch (err) {
      console.error('Google Sign-In failed:', err);
      throw err;
    }
  };

  const logout = async () => {
    await signOut(auth);
    setFirebaseUser(null);
    const defaultProfile = authService.switchRole('farmer');
    setProfile(defaultProfile);
  };

  const switchRole = async (role: UserRole) => {
    const updated = authService.switchRole(role);
    setProfile(updated);
    if (firebaseUser) {
      try {
        await upsertUserProfile({
          userId: firebaseUser.uid,
          name: updated.name,
          role,
          preferredLanguage: updated.preferredLanguage,
          district: updated.district,
          state: updated.state,
        });
      } catch (err) {
        console.warn('Could not update role in Firestore:', err);
      }
    }
  };

  const updateDistrictState = async (district: string, state: string) => {
    const updated = { ...profile, district, state };
    setProfile(updated);
    if (firebaseUser) {
      try {
        await upsertUserProfile({
          userId: firebaseUser.uid,
          district,
          state,
        });
      } catch (err) {
        console.warn('Could not update district/state in Firestore:', err);
      }
    }
  };

  return (
    <AuthContext.Provider
      value={{
        firebaseUser,
        profile,
        loading,
        isGoogleAuthenticated: !!firebaseUser,
        loginWithGoogle,
        logout,
        switchRole,
        updateDistrictState,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};
