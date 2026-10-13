import 'server-only';
import { prisma } from '@internal/rdb/index.js';
import { notFound } from 'next/navigation';
import type { ReactNode } from 'react';
import { UploadButton } from './upload-button';
import { getAuthUserOrRedirect } from '#src/features/auth';
import { findUserOrRedirect } from '#src/features/users';
import { formatWithTimeZone } from '#src/lib/date-time-utils';
import { serverLogger } from '#src/lib/logger';

interface Props {
  projectId: string;
}

export const KnowledgeBaseUploadPage = async ({
  projectId,
}: Props): Promise<ReactNode> => {
  const authUser = await getAuthUserOrRedirect();
  const user = await findUserOrRedirect(authUser.userId);

  const project = await prisma.project.findUnique({
    where: { id: projectId, deletedAt: null },
  });
  // eslint-disable-next-line @typescript-eslint/prefer-optional-chain
  if (!project || project.userId !== user.id) {
    serverLogger.warn('Invalid project.');
    notFound();
  }

  return (
    <>
      <h2 className="text-xl font-semibold">ナレッジベースの反映</h2>
      <p className="text-muted-foreground mt-4">
        ナレッジベースとは、登録済みのドキュメントとFAQをまとめたものです。反映を行うと、最新のナレッジベースの内容がAIアシスタントに同期されます。
      </p>
      <p className="mt-4">
        最終反映日時:{' '}
        {project.knowledgeBaseLastUploadDateTime
          ? formatWithTimeZone(
              project.knowledgeBaseLastUploadDateTime,
              'yyyy/MM/dd HH:mm',
            )
          : '-'}
      </p>
      <UploadButton projectId={project.id} className="mt-4" />
    </>
  );
};
