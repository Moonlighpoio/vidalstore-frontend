import { Injectable } from '@angular/core';
import { 
  signUp, 
  confirmSignUp, 
  signIn, 
  signOut, 
  fetchAuthSession, 
  getCurrentUser,
  type SignUpOutput, 
  type ConfirmSignUpOutput,
  type SignInOutput,
  type AuthSession
} from 'aws-amplify/auth';

import { environment } from '../../../environments/environment';

@Injectable({
  providedIn: 'root'
})
export class AuthService {

  async register(email: string, password: string): Promise<SignUpOutput> {
    return await signUp({
      username: email,
      password,
      options: {
        userAttributes: { email }
      }
    });
  }

  async confirmRegistrationCode(email: string, code: string): Promise<ConfirmSignUpOutput> {
    return await confirmSignUp({
      username: email,
      confirmationCode: code
    });
  }

  async login(email: string, password: string): Promise<SignInOutput> {
    return await signIn({
      username: email,
      password
    });
  }

  async logout(): Promise<void> {
    try {
      await signOut();
    } catch {
      // El signOut con flujo OAuth puede fallar en algunos entornos;
      // igual se limpia el estado local y se cierra la sesión SSO.
    }

    const prefix = 'CognitoIdentityServiceProvider.';

    for (const key of Object.keys(sessionStorage)) {
      if (key.startsWith(prefix)) {
        sessionStorage.removeItem(key);
      }
    }

    for (const key of Object.keys(localStorage)) {
      if (key.startsWith(prefix)) {
        localStorage.removeItem(key);
      }
    }

    const domain = environment.cognito.domain.replace('https://', '');
    const clientId = environment.cognito.userPoolClientId;
    const logoutUri = environment.cognito.redirectSignOut;

    window.location.assign(
      `https://${domain}/logout?client_id=${encodeURIComponent(clientId)}&logout_uri=${encodeURIComponent(logoutUri)}`,
    );
  }

  async getSession(): Promise<AuthSession> {
    return await fetchAuthSession();
  }

  async isAuthenticated(): Promise<boolean> {
    try {
      const session = await fetchAuthSession();
      return !!session.tokens?.accessToken;
    } catch {
      return false;
    }
  }

  async getCurrentUsername(): Promise<string | null> {
    try {
      const user = await getCurrentUser();
      return user.username;
    } catch {
      return null;
    }
  }

  async getUserGroups(): Promise<string[]> {
    try {
      const session = await fetchAuthSession();
      const payload = session.tokens?.accessToken?.payload || session.tokens?.idToken?.payload;
      const groups = payload?.['cognito:groups'];

      if (Array.isArray(groups)) {
        return groups as string[];
      }
      return [];
    } catch {
      return [];
    }
  }
}