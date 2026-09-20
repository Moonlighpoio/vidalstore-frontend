import 'zone.js';

import { bootstrapApplication } from '@angular/platform-browser';
import { cognitoUserPoolsTokenProvider } from 'aws-amplify/auth/cognito';
import { sessionStorage } from 'aws-amplify/utils';

import { App } from './app/app';
import { appConfig } from './app/app.config';
import { configureAmplify } from './app/core/auth/amplify.config';

configureAmplify();

cognitoUserPoolsTokenProvider.setKeyValueStorage(sessionStorage);

bootstrapApplication(App, appConfig).catch((err) => {
  console.error('[Main] Error al bootstrap:', err);
});