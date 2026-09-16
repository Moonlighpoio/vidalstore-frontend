import { bootstrapApplication } from '@angular/platform-browser';
import { Amplify } from 'aws-amplify';
import { App } from './app/app';
import { appConfig } from './app/app.config';
import { amplifyConfig } from './app/core/auth/amplify.config';

// Inicialización previa obligatoria
Amplify.configure(amplifyConfig);

bootstrapApplication(App, appConfig)
  .catch((err) => console.error(err));