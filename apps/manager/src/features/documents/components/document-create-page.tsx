import Link from 'next/link';
import { createDocument } from '../actions/create-document';
import { Button } from '#src/components/ui/button';

interface Props {
  projectId: string;
}

export const DocumentCreatePage = ({ projectId }: Props) => {
  const boundAction = createDocument.bind(null, projectId);
  console.log(boundAction);

  return (
    <div className="flex flex-col gap-6">
      <div className="flex items-center gap-4">
        <Button variant="ghost" size="sm" asChild>
          <Link href={`/?projectId=${projectId}`}>← 戻る</Link>
        </Button>
        <h2 className="text-xl font-semibold">Document作成</h2>
      </div>
    </div>
  );
};
