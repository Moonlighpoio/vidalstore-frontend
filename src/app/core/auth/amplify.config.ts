import { Amplify } from 'aws-amplify';
import { cognitoAuthConfig } from './cognito.config';  // ← Cambia cognitoConfig por cognitoAuthConfig

export function configureAmplify(): void {
  Amplify.configure(cognitoAuthConfig);  // ← Cambia aquí también
  console.log('[Amplify] Configuración inicializada con OAuth');
}