import 'server-only';
import { prisma } from '@internal/rdb/index.js';
import { FileIcon, PencilIcon } from 'lucide-react';
import Link from 'next/link';
import { notFound } from 'next/navigation';
import type { ReactNode } from 'react';
import { DocumentItem } from './document-item';
import { Button } from '#src/components/ui/button';
import {
  Empty,
  EmptyContent,
  EmptyDescription,
  EmptyHeader,
  EmptyMedia,
  EmptyTitle,
} from '#src/components/ui/empty';
import { ItemGroup } from '#src/components/ui/item';
import { getAuthUserOrRedirect } from '#src/features/auth';
import { findUserOrRedirect } from '#src/features/users';
import { serverLogger } from '#src/lib/logger';

interface Props {
  projectId: string;
}

export const DocumentsPage = async ({
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

  const documents = await prisma.document.findMany({
    where: { projectId: project.id, deletedAt: null },
    orderBy: { createdAt: 'desc' },
  });

  return (
    <>
      <div className="flex items-center justify-between">
        <h2 className="text-xl font-semibold">ドキュメント</h2>
        {documents.length > 0 && (
          <Button asChild>
            <Link href={`/projects/${projectId}/documents/create`}>
              <PencilIcon />
              作成
            </Link>
          </Button>
        )}
      </div>
      <p className="text-muted-foreground mt-4">
        ドキュメントとは、AIアシスタントが回答時に参照する単体の情報のことです。
      </p>
      {documents.length === 0 ? (
        <Empty>
          <EmptyHeader>
            <EmptyMedia variant="icon">
              <FileIcon />
            </EmptyMedia>
            <EmptyTitle>ドキュメントがまだ作成されていません</EmptyTitle>
            <EmptyDescription>
              「作成」ボタンから、最初のドキュメントを登録しましょう。
            </EmptyDescription>
          </EmptyHeader>
          <EmptyContent>
            <Button asChild>
              <Link href={`/projects/${projectId}/documents/create`}>
                <PencilIcon />
                作成
              </Link>
            </Button>
          </EmptyContent>
        </Empty>
      ) : (
        <ItemGroup className="mt-8">
          {documents.map((document) => (
            <DocumentItem
              key={document.id}
              projectId={projectId}
              document={document}
            />
          ))}
        </ItemGroup>
      )}
    </>
  );
};
