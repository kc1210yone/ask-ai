import 'server-only';
import { notFound } from 'next/navigation';
import type { ReactNode } from 'react';
import { UpdateForm } from './update-form';
import { getAuthUserOrRedirect } from '#src/features/auth';
import { findUserOrRedirect } from '#src/features/users';
import { prisma } from '#src/lib/prisma';

interface Props {
  projectId: string;
  documentId: string;
}

export const DocumentUpdatePage = async ({
  projectId,
  documentId,
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

  const document = await prisma.document.findUnique({
    where: { id: documentId, deletedAt: null },
  });
  // eslint-disable-next-line @typescript-eslint/prefer-optional-chain
  if (!document || document.projectId !== projectId) {
    notFound();
  }

  return (
    <>
      <h2 className="text-xl font-semibold">ドキュメント編集</h2>
      <p className="mt-4">
        ドキュメントは、AIアシスタントが参照する単体の情報です。
      </p>
      <UpdateForm projectId={projectId} document={document} className="mt-8" />
    </>
  );
};
