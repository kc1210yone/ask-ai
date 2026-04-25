import { redirect } from 'next/navigation';
import type { ReactNode } from 'react';
import { getAuthUserOrRedirect } from '#src/features/auth';
import { Prisma } from '#src/generated/prisma/client';
import { prisma } from '#src/lib/prisma';

export const UserCreatePage = async (): Promise<ReactNode> => {
  const authUser = await getAuthUserOrRedirect();
  try {
    await prisma.user.create({ data: { cognitoUserId: authUser.userId } });
  } catch (e) {
    // 「すでにレコードが存在する場合」以外のエラーなら再throw。
    if (
      !(e instanceof Prisma.PrismaClientKnownRequestError && e.code === 'P2002')
    ) {
      throw e;
    }
  }
  redirect('/');
};
