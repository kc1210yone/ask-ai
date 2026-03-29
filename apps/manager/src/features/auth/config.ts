import invariant from 'tiny-invariant';
import type { ResourcesConfig } from 'aws-amplify';

invariant(process.env['NEXT_PUBLIC_USER_POOL_ID']);
invariant(process.env['NEXT_PUBLIC_USER_POOL_CLIENT_ID']);

export const amplifyConfig: ResourcesConfig = {
  Auth: {
    Cognito: {
      userPoolId: process.env['NEXT_PUBLIC_USER_POOL_ID'],
      userPoolClientId: process.env['NEXT_PUBLIC_USER_POOL_CLIENT_ID'],
      loginWith: {
        email: true,
      },
    },
  },
};
