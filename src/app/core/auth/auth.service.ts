import { Injectable } from '@angular/core';
import { signUp, confirmSignUp, type SignUpOutput, type ConfirmSignUpOutput } from 'aws-amplify/auth';

@Injectable({
  providedIn: 'root'
})
export class AuthService {

  async register(email: string, password: string): Promise<SignUpOutput> {
    return await signUp({
      username: email,
      password,
      options: {
        userAttributes: {
          email
        }
      }
    });
  }

  async confirmRegistrationCode(email: string, code: string): Promise<ConfirmSignUpOutput> {
    return await confirmSignUp({
      username: email,
      confirmationCode: code
    });
  }
}