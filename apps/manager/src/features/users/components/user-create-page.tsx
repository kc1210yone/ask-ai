import { redirect } from 'next/navigation';
import type { ReactNode } from 'react';
import { getAuthUserOrRedirect } from '#src/features/auth';
import { prisma } from '#src/lib/prisma';

export const UserCreatePage = async (): Promise<ReactNode> => {
  const authUser = await getAuthUserOrRedirect();
  await prisma.user.upsert({
    where: { cognitoUserId: authUser.userId },
    update: {},
    create: {
      cognitoUserId: authUser.userId,
    },
  });
  redirect('/');
};
