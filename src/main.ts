import 'zone.js';
import { bootstrapApplication } from '@angular/platform-browser';
import { Amplify } from 'aws-amplify';
import { cognitoUserPoolsTokenProvider } from 'aws-amplify/auth/cognito';
import { type KeyValueStorageInterface } from '@aws-amplify/core';
import { App } from './app/app';
import { appConfig } from './app/app.config';
import { amplifyConfig } from './app/core/auth/amplify.config';

// 1. Adaptador asíncrono para sessionStorage compatible con Amplify v6
const sessionStorageAdapter: KeyValueStorageInterface = {
  setItem: async (key: string, value: string): Promise<void> => {
    sessionStorage.setItem(key, value);
  },
  getItem: async (key: string): Promise<string | null> => {
    return sessionStorage.getItem(key);
  },
  removeItem: async (key: string): Promise<void> => {
    sessionStorage.removeItem(key);
  },
  clear: async (): Promise<void> => {
    sessionStorage.clear();
  },
};

// 2. Configuración de recursos de Amplify
Amplify.configure(amplifyConfig);

// 3. Forzar almacenamiento de tokens en sessionStorage
cognitoUserPoolsTokenProvider.setKeyValueStorage(sessionStorageAdapter);

bootstrapApplication(App, appConfig)
  .catch((err) => console.error(err));