export const environment = {
  production: false,
  apiUrl: 'http://localhost:8080',
  cognito: {
    region: 'us-east-1',
    userPoolId: 'YOUR_USER_POOL_ID',
    userPoolClientId: 'YOUR_USER_POOL_CLIENT_ID',
    domain: 'YOUR_COGNITO_DOMAIN',
    redirectSignIn: 'http://localhost:4200/callback',
    redirectSignOut: 'http://localhost:4200',
    resourceServerId: 'vidalstore',
    scopes: [
      'openid',
      'email',
      'vidalstore/catalogo.leer',
      'vidalstore/catalogo.escribir',
      'vidalstore/biblioteca.leer',
    ],
  },
};