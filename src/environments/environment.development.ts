export const environment = {
  production: false,
  apiUrl: 'http://localhost:8080',
  cognito: {
    userPoolId: 'us-east-1_nSvMRuo8S',
    userPoolClientId: '5jomtmd04jh4n5sqo8pvj80jon',
    domain: 'us-east-1nsvmruo8s.auth.us-east-1.amazoncognito.com',
    redirectSignIn: 'http://localhost:4200/callback',
    redirectSignOut: 'http://localhost:4200',
    scopes: [
      'openid',
      'email',
      'vidalstore/catalogo.leer',
      'vidalstore/catalogo.escribir',
      'vidalstore/biblioteca.leer'
    ]
  }
};