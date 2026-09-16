export const environment = {
  production: false,
  apiUrl: 'http://localhost:8080',
  cognito: {
    region: 'us-east-1',
    userPoolId: 'us-east-1_nSvMRuo8S',
    appClientId: '5jomtmd04jh4n5sqo8pvj80jon',
    domain: 'https://us-east-1nsvmruo8s.auth.us-east-1.amazoncognito.com',
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