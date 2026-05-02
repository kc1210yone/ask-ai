import 'server-only';
import type { User } from '@internal/db/generated/prisma/client.js';
import { prisma } from '@internal/db/index.js';
import { redirect } from 'next/navigation';
import { cache } from 'react';

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
    return await prisma.user.findUnique({
      where: { cognitoUserId, deletedAt: null },
    });
  },
);
