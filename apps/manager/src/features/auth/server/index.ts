import 'server-only';
import { createServerRunner } from '@aws-amplify/adapter-nextjs';
import { AuthError } from 'aws-amplify/auth';
import { fetchUserAttributes, getCurrentUser } from 'aws-amplify/auth/server';
import { cookies } from 'next/headers';
import { redirect } from 'next/navigation';
import { cache } from 'react';
import invariant from 'tiny-invariant';
import type { AuthUser } from '../types/auth-user';
import { amplifyConfig } from '#src/features/auth/lib/amplify';

const { runWithAmplifyServerContext } = createServerRunner({
  config: amplifyConfig,
});

export const getAuthUserOrRedirect = async (): Promise<AuthUser> => {
  const authUser = await getAuthUser();
  if (!authUser) {
    redirect('/auth/login');
  }
  return authUser;
};

export const getAuthUser = cache(async (): Promise<AuthUser | null> => {
  return await runWithAmplifyServerContext({
    nextServerContext: {
      cookies,
    },
    operation: async (contextSpec): Promise<AuthUser | null> => {
      let currentUser;
      let userAttributes;
      try {
        [currentUser, userAttributes] = await Promise.all([
          getCurrentUser(contextSpec),
          fetchUserAttributes(contextSpec),
        ]);
      } catch (e) {
        invariant(e instanceof AuthError);
        if (e.name === 'UserUnAuthenticatedException') {
          return null;
        }
        throw e;
      }
      invariant(userAttributes.email);
      return {
        userId: currentUser.userId,
        username: userAttributes.email,
      };
    },
  });
});
