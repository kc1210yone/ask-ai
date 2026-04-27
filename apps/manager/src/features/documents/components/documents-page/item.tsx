import Link from 'next/link';
import type { Document } from '#src/generated/prisma/client';

interface Props {
  projectId: string;
  document: Document;
}

export const Item = ({ projectId, document }: Props) => {
  return (
    <div>
      {document.title}
      <Link href={`/projects/${projectId}/documents/${document.id}/update`}>
        編集
      </Link>
    </div>
  );
};
