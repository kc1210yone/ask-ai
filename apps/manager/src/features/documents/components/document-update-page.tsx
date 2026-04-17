import Link from 'next/link';
import { notFound } from 'next/navigation';
import { updateDocument } from '../actions/update-document';
import { getDocument } from '../lib/queries';
import { Button } from '#src/components/ui/button';
import { prisma } from '#src/lib/prisma';
import { findOrCreateCurrentUser } from '#src/lib/user';

interface Props {
  projectId: string;
  documentId: string;
}

export const DocumentUpdatePage = async ({ projectId, documentId }: Props) => {
  const user = await findOrCreateCurrentUser();
  const project = await prisma.project.findFirst({
    where: { id: projectId, userId: user.id },
  });
  if (!project) notFound();

  const document = await getDocument(documentId, projectId);
  if (!document) notFound();

  const boundAction = updateDocument.bind(null, projectId, documentId);
  console.log(boundAction);

  return (
    <div className="flex flex-col gap-6">
      <div className="flex items-center gap-4">
        <Button variant="ghost" size="sm" asChild>
          <Link href={`/?projectId=${projectId}`}>← 戻る</Link>
        </Button>
        <h2 className="text-xl font-semibold">Document編集</h2>
      </div>
    </div>
  );
};
