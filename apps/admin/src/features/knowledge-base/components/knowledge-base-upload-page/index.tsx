import 'server-only';
import { prisma } from '@internal/rdb/index.js';
import { format } from 'date-fns';
import { notFound } from 'next/navigation';
import type { ReactNode } from 'react';
import { UploadButton } from './upload-button';
import { getAuthUserOrRedirect } from '#src/features/auth';
import { findUserOrRedirect } from '#src/features/users';

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
    notFound();
  }

  return (
    <>
      <h2 className="text-xl font-semibold">ナレッジベースの反映</h2>
      <p className="text-muted-foreground mt-4">
        ナレッジベースとはドキュメントとFAQのことです。
        ナレッジベースの反映を行うことで、ナレッジベースのデータをAIアシスタントに同期します。
        ナレッジベースの反映を行ってから実際にAIアシスタントの回答にデータが反映されるまで、最大1時間程度かかります。
      </p>
      <p className="mt-4">
        最終反映日時:{' '}
        {project.knowledgeBaseLastUploadDateTime
          ? format(project.knowledgeBaseLastUploadDateTime, 'yyyy/MM/dd HH:mm')
          : '-'}
      </p>
      <UploadButton
        project={{
          id: project.id,
          knowledgeBaseIsUploading: project.knowledgeBaseIsUploading,
        }}
        className="mt-4"
      />
    </>
  );
};
