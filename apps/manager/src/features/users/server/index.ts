import { redirect } from 'next/navigation';
import { cache } from 'react';
import type { User } from '#src/generated/prisma/client';
import { prisma } from '#src/lib/prisma';

export const findUserOrRedirect = async (
  cognitoUserId: string,
): Promise<User> => {
  const user = await findUser(cognitoUserId);
  if (!user) {
    redirect('/users/create');
  }
  return user;
};

export const findUser = cache(
  async (cognitoUserId: string): Promise<User | null> => {
    return await prisma.user.findUnique({ where: { cognitoUserId } });
  },
);
