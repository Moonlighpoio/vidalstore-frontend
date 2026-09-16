import { environment } from '../../../environments/environment';

export const cognitoAuthConfig = {
  Auth: {
    Cognito: {
      userPoolId: environment.cognito.userPoolId,
      userPoolClientId: environment.cognito.userPoolClientId,
      loginWith: {
        oauth: {
          domain: environment.cognito.domain.replace('https://', ''),
          scopes: environment.cognito.scopes,
          redirectSignIn: [environment.cognito.redirectSignIn],
          redirectSignOut: [environment.cognito.redirectSignOut],
          responseType: 'code' as const
        }
      }
    }
  }
};