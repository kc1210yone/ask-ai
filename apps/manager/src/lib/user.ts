import type { User } from '#src/generated/prisma/client';
import { getAuthUser } from '#src/features/auth';
import { prisma } from '#src/lib/prisma';

export const findOrCreateCurrentUser = async (): Promise<User> => {
  const { userId } = await getAuthUser();
  return await prisma.user.upsert({
    where: { id: userId },
    update: {},
    create: { id: userId },
  });
};
