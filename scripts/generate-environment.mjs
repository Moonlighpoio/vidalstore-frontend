import fs from 'node:fs';
import dotenv from 'dotenv';

dotenv.config();

const requiredVariables = [
  'API_URL',
  'REGION',
  'USER_POOL_ID',
  'USER_POOL_CLIENT_ID',
  'COGNITO_DOMAIN',
  'REDIRECT_SIGN_IN',
  'REDIRECT_SIGN_OUT',
  'RESOURCE_SERVER_ID',
  'SCOPE_CATALOGO_LEER',
  'SCOPE_CATALOGO_ESCRIBIR',
  'SCOPE_BIBLIOTECA_LEER',
];

for (const variable of requiredVariables) {
  if (!process.env[variable]) {
    throw new Error(`Missing environment variable: ${variable}`);
  }
}

const scopes = [
  'openid',
  'email',
  process.env.SCOPE_CATALOGO_LEER,
  process.env.SCOPE_CATALOGO_ESCRIBIR,
  process.env.SCOPE_BIBLIOTECA_LEER,
];

const environmentFile = `export const environment = {
  production: false,
  apiUrl: '${process.env.API_URL}',
  cognito: {
    region: '${process.env.REGION}',
    userPoolId: '${process.env.USER_POOL_ID}',
    userPoolClientId: '${process.env.USER_POOL_CLIENT_ID}',
    domain: '${process.env.COGNITO_DOMAIN}',
    redirectSignIn: '${process.env.REDIRECT_SIGN_IN}',
    redirectSignOut: '${process.env.REDIRECT_SIGN_OUT}',
    resourceServerId: '${process.env.RESOURCE_SERVER_ID}',
    scopes: ${JSON.stringify(scopes)},
  },
};
`;

fs.writeFileSync(
  'src/environments/environment.development.ts',
  environmentFile,
);

console.log('Environment configuration generated successfully.');