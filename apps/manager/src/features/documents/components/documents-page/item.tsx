import Link from 'next/link';
import type { Document } from '#src/generated/prisma/client';

interface Props {
  projectId: string;
  document: Pick<Document, 'id' | 'title' | 'content'>;
}

export const Item = ({ projectId, document }: Props) => {
  return (
    <div key={document.id}>
      {document.title}, {document.content}
      <Link href={`/projects/${projectId}/documents/${document.id}/update`}>
        編集
      </Link>
    </div>
  );
};
