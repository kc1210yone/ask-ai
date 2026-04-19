import { createServerRunner } from '@aws-amplify/adapter-nextjs';
import { getCurrentUser } from 'aws-amplify/auth/server';
import { cookies } from 'next/headers';
import { cache } from 'react';
import type { AuthUser } from '../types/auth-user';
import { amplifyConfig } from '#src/features/auth/lib/amplify';

const { runWithAmplifyServerContext } = createServerRunner({
  config: amplifyConfig,
});

export const getAuthUser = cache(async (): Promise<AuthUser> => {
  return await runWithAmplifyServerContext({
    nextServerContext: {
      cookies,
    },
    operation: async (contextSpec): Promise<AuthUser> => {
      const user = await getCurrentUser(contextSpec);
      return {
        userId: user.userId,
      };
    },
  });
});
