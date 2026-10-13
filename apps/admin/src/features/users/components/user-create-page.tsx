import 'server-only';
import { Prisma } from '@internal/rdb/generated/prisma/client.js';
import { prisma } from '@internal/rdb/index.js';
import { redirect } from 'next/navigation';
import type { ReactNode } from 'react';
import { getAuthUserOrRedirect } from '#src/features/auth';
import { serverLogger } from '#src/lib/logger';

export const UserCreatePage = async (): Promise<ReactNode> => {
  const authUser = await getAuthUserOrRedirect();
  try {
    await prisma.user.create({ data: { cognitoUserId: authUser.userId } });
  } catch (e) {
    if (
      e instanceof Prisma.PrismaClientKnownRequestError &&
      e.code === 'P2002'
    ) {
      serverLogger.warn('User already exists in RDB.');
    } else {
      throw e;
    }
  }
  redirect('/');
};
