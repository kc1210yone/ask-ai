import Link from 'next/link';
import { createFaq } from '../actions';
import { FaqForm } from './faq-form';
import { Button } from '#src/components/ui/button';

interface Props {
  projectId: string;
}

export const FaqNewPage = ({ projectId }: Props) => {
  const boundAction = createFaq.bind(null, projectId);

  return (
    <div className="flex flex-col gap-6">
      <div className="flex items-center gap-4">
        <Button variant="ghost" size="sm" asChild>
          <Link href={`/?projectId=${projectId}`}>← 戻る</Link>
        </Button>
        <h2 className="text-xl font-semibold">FAQ作成</h2>
      </div>
      <FaqForm action={boundAction} cancelHref={`/?projectId=${projectId}`} />
    </div>
  );
};
