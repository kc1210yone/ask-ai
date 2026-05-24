'use server';

import 'server-only';
import { prisma } from '@internal/rdb/index.js';
import { getAuthUserOrRedirect } from '#src/features/auth';
import { findUserOrRedirect } from '#src/features/users';

interface ActionResponse {
  status: 'ok' | 'error';
}

export const upload = async (projectId: string): Promise<ActionResponse> => {
  const authUser = await getAuthUserOrRedirect();
  const user = await findUserOrRedirect(authUser.userId);

  const project = await prisma.project.findUnique({
    where: { id: projectId, deletedAt: null },
  });
  // eslint-disable-next-line @typescript-eslint/prefer-optional-chain
  if (!project || project.userId !== user.id) {
    return { status: 'error' };
  }

  return { status: 'ok' };
};
