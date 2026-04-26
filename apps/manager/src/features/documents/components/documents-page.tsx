import Link from 'next/link';
import { redirect } from 'next/navigation';
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
    where: { id: projectId },
  });
  // eslint-disable-next-line @typescript-eslint/prefer-optional-chain
  if (!project || project.userId !== user.id) {
    redirect('/');
  }

  const documents = await prisma.document.findMany({
    select: { id: true, title: true, content: true },
    where: { projectId: project.id },
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
          <div key={document.id}>
            {document.title}, {document.content}
          </div>
        ))}
      </div>
    </div>
  );
};
