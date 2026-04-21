import Link from 'next/link';
import type { Document } from '#src/generated/prisma/client';
import { Button } from '#src/components/ui/button';

interface Props {
  projectId: string;
  documents: Document[];
}

export const DocumentList = ({ projectId, documents }: Props) => {
  return (
    <div className="flex flex-col gap-4">
      <div className="flex items-center justify-between">
        <h3 className="text-lg font-semibold">Document</h3>
        <Button size="sm" asChild>
          <Link href={`/projects/${projectId}/documents/create`}>+ 追加</Link>
        </Button>
      </div>
      {documents.length === 0 ? (
        <p className="text-muted-foreground text-sm">Documentがありません。</p>
      ) : (
        <div className="flex flex-col gap-2">
          {documents.map((doc) => (
            <div
              key={doc.id}
              className="flex items-center justify-between rounded-lg border p-3"
            >
              <span className="text-sm font-medium">{doc.title}</span>
              <div className="flex gap-2">
                <Button variant="outline" size="sm" asChild>
                  <Link
                    href={`/projects/${projectId}/documents/${doc.id}/update`}
                  >
                    編集
                  </Link>
                </Button>
                <Button>削除</Button>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};
