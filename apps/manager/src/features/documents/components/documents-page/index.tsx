import Link from 'next/link';
import { notFound } from 'next/navigation';
import { Item } from './item';
import type { ReactNode } from 'react';
import { Button } from '#src/components/ui/button';
import { getAuthUserOrRedirect } from '#src/features/auth';
import { findUserOrRedirect } from '#src/features/users';
import { prisma } from '#src/lib/prisma';

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
    notFound();
  }

  const documents = await prisma.document.findMany({
    where: { projectId: project.id, deletedAt: null },
    orderBy: { createdAt: 'desc' },
  });

  return (
    <div>
      <h2 className="text-xl font-semibold">ドキュメント</h2>
      <Button asChild>
        <Link href={`/projects/${projectId}/documents/create`}>新規作成</Link>
      </Button>
      <div>
        {documents.map((document) => (
          <Item key={document.id} projectId={projectId} document={document} />
        ))}
      </div>
    </div>
  );
};
