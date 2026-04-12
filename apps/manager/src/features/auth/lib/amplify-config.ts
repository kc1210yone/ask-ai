import invariant from 'tiny-invariant';
import type { ResourcesConfig } from 'aws-amplify';

const userPoolId = process.env['NEXT_PUBLIC_USER_POOL_ID'];
invariant(userPoolId);

const userPoolClientId = process.env['NEXT_PUBLIC_USER_POOL_CLIENT_ID'];
invariant(userPoolClientId);

export const amplifyConfig: ResourcesConfig = {
  Auth: {
    Cognito: {
      userPoolId,
      userPoolClientId,
      loginWith: {
        email: true,
      },
    },
  },
};
