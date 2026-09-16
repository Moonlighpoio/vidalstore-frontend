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
    await signOut();
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
}