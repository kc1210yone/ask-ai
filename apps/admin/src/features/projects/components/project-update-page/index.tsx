import 'server-only';
import { prisma } from '@internal/rdb/index.js';
import { notFound } from 'next/navigation';
import type { ReactNode } from 'react';
import { ComponentForm } from './component-form';
import { getAuthUserOrRedirect } from '#src/features/auth';
import { findUserOrRedirect } from '#src/features/users';

interface Props {
  projectId: string;
}

export const ProjectUpdatePage = async ({
  projectId,
}: Props): Promise<ReactNode> => {
  const authUser = await getAuthUserOrRedirect();
  const user = await findUserOrRedirect(authUser.userId);

  const project = await prisma.project.findUnique({
    where: { id: projectId, deletedAt: null },
  });
  // eslint-disable-next-line @typescript-eslint/prefer-optional-chain
  if (!project || project.userId !== user.id) {
    notFound();
  }

  return (
    <>
      <h2 className="text-xl font-semibold">プロジェクト設定</h2>
      <p className="text-muted-foreground mt-4">
        プロジェクトの設定を変更してください。
      </p>
      <ComponentForm project={project} className="mt-8" />
    </>
  );
};
