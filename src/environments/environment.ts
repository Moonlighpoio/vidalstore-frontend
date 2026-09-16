export const environment = {
  production: false,
  apiUrl: 'http://localhost:8080',
  cognito: {
    region: 'us-east-1',
    userPoolId: '',
    appClientId: '',
    domain: '',
    redirectSignIn: 'http://localhost:4200/callback',
    redirectSignOut: 'http://localhost:4200',
    resourceServerId: 'vidalstore',
    scopes: [
      'openid',
      'email',
      'vidalstore/catalogo.leer',
      'vidalstore/catalogo.escribir',
      'vidalstore/biblioteca.leer'
    ]
  }
};