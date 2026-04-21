import Link from 'next/link';
import { Button } from '#src/components/ui/button';

interface Props {
  projectId: string;
  faqId: string;
}

export const FaqUpdatePage = async ({ projectId, faqId }: Props) => {
  return (
    <div className="flex flex-col gap-6">
      <div className="flex items-center gap-4">
        <Button variant="ghost" size="sm" asChild>
          <Link href={`/?projectId=${projectId}`}>← 戻る</Link>
        </Button>
        <h2 className="text-xl font-semibold">FAQ編集</h2>
        {faqId}
      </div>
    </div>
  );
};
