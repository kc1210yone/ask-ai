'use server';

import 'server-only';
import { LambdaClient, InvokeCommand } from '@aws-sdk/client-lambda';
import { prisma } from '@internal/rdb/index.js';
import { getAuthUserOrRedirect } from '#src/features/auth';
import { findUserOrRedirect } from '#src/features/users';
import { serverLogger } from '#src/lib/logger';

const lambdaClient = new LambdaClient();

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
    serverLogger.warn('Invalid project.');
    return { status: 'error' };
  }

  const response = await lambdaClient.send(
    new InvokeCommand({
      FunctionName: 'aaa',
      InvocationType: 'Event',
      Payload: JSON.stringify({}),
    }),
  );
  console.log(response);

  return { status: 'ok' };
};
