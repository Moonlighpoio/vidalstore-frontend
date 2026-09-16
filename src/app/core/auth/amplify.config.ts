import { ResourcesConfig } from 'aws-amplify';
import { environment } from '../../../environments/environment';

export const amplifyConfig: ResourcesConfig = {
  Auth: {
    Cognito: {
      userPoolId: environment.cognito.userPoolId,
      userPoolClientId: environment.cognito.appClientId,
      loginWith: {
        oauth: {
          domain: environment.cognito.domain.replace(/^https?:\/\//, ''),
          scopes: environment.cognito.scopes,
          redirectSignIn: [environment.cognito.redirectSignIn],
          redirectSignOut: [environment.cognito.redirectSignOut],
          responseType: 'code'
        }
      }
    }
  }
};