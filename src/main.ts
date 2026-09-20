import { Amplify } from 'aws-amplify';
import { cognitoUserPoolsTokenProvider } from 'aws-amplify/auth/cognito';
import { sessionStorage } from 'aws-amplify/utils';
import { bootstrapApplication } from '@angular/platform-browser';
import { App } from './app/app';
import { appConfig } from './app/app.config';
import { cognitoAuthConfig } from './app/core/auth/cognito.config';

// Configura Amplify con OAuth
Amplify.configure(cognitoAuthConfig);

// Configura sessionStorage para los tokens (REQUERIDO POR LA EP1)
cognitoUserPoolsTokenProvider.setKeyValueStorage(sessionStorage);

console.log('[Main] Amplify configurado con sessionStorage y OAuth');

bootstrapApplication(App, appConfig)
  .catch((err) => console.error('[Main] Error al bootstrap:', err));