import { createServerRunner } from '@aws-amplify/adapter-nextjs';
import { fetchAuthSession, getCurrentUser } from 'aws-amplify/auth/server';
import { cookies } from 'next/headers';
import { cache } from 'react';
import { amplifyConfig } from '#src/features/auth/lib/amplify-config';

const { runWithAmplifyServerContext } = createServerRunner({
  config: amplifyConfig,
});

export const getUser = cache(async () => {
  const a = await runWithAmplifyServerContext({
    nextServerContext: {
      cookies,
    },
    operation: async (contextSpec) => {
      const [session, user] = await Promise.all([
        fetchAuthSession(contextSpec),
        getCurrentUser(contextSpec),
      ]);

      return {
        name: user.username,
        email: user.signInDetails?.loginId,
        groups: session.tokens?.idToken?.payload['cognito:groups'] ?? [],
      };
    },
  });
  return a;
});
