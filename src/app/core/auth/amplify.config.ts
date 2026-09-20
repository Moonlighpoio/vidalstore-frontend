import { Amplify } from 'aws-amplify';
import { cognitoAuthConfig } from './cognito.config';

export function configureAmplify(): void {
  Amplify.configure(cognitoAuthConfig);
}