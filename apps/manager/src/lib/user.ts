import { createServerRunner } from '@aws-amplify/adapter-nextjs';
import { fetchUserAttributes } from 'aws-amplify/auth/server';
import { cookies } from 'next/headers';
import type { User } from '#src/generated/prisma/client';
import { getAuthUser } from '#src/features/auth';
import { amplifyConfig } from '#src/features/auth/lib/amplify-config';
import { prisma } from '#src/lib/prisma';

const { runWithAmplifyServerContext } = createServerRunner({
  config: amplifyConfig,
});

export const findOrCreateCurrentUser = async (): Promise<User> => {
  const { userId } = await getAuthUser();

  const email = await runWithAmplifyServerContext({
    nextServerContext: { cookies },
    operation: async (contextSpec) => {
      const attrs = await fetchUserAttributes(contextSpec);
      return attrs.email ?? userId;
    },
  });

  return await prisma.user.upsert({
    where: { id: userId },
    update: {},
    create: { id: userId, email },
  });
};
