import { redirect } from 'next/navigation';
import type { User } from '#src/generated/prisma/client';
import { prisma } from '#src/lib/prisma';

export const getUser = async (cognitoUserId: string): Promise<User> => {
  const user = await prisma.user.findUnique({ where: { cognitoUserId } });
  if (!user) {
    redirect('/users/create');
  }
  return user;
};
