import { UserProfile, UserRole } from '../../types/app.types';
import { MOCK_USER_PROFILE } from '../../mocks/otherServicesData';
import { apiClient } from '../api/client';

export interface IAuthService {
  getCurrentUser(): UserProfile;
  switchRole(role: UserRole): UserProfile;
  updateLanguage(lang: 'hi' | 'en' | 'cg'): void;
}

export class AuthService implements IAuthService {
  private currentUser: UserProfile;

  constructor() {
    const saved = localStorage.getItem('mandimind_user');
    if (saved) {
      try {
        this.currentUser = JSON.parse(saved);
      } catch {
        this.currentUser = { ...MOCK_USER_PROFILE };
      }
    } else {
      this.currentUser = { ...MOCK_USER_PROFILE };
    }
  }

  getCurrentUser(): UserProfile {
    return this.currentUser;
  }

  switchRole(role: UserRole): UserProfile {
    this.currentUser = {
      ...this.currentUser,
      role,
      name:
        role === 'admin'
          ? 'अधीक्षक / प्रशासक (Administrator)'
          : role === 'supervisor'
          ? 'मंडी सुपरवाइजर (Supervisor)'
          : 'रामकुमार वर्मा (Farmer)',
    };
    localStorage.setItem('mandimind_user', JSON.stringify(this.currentUser));
    return this.currentUser;
  }

  updateLanguage(lang: 'hi' | 'en' | 'cg'): void {
    this.currentUser = {
      ...this.currentUser,
      preferredLanguage: lang,
    };
    localStorage.setItem('mandimind_user', JSON.stringify(this.currentUser));
  }
}

export const authService = new AuthService();
