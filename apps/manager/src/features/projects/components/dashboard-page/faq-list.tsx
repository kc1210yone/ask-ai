import Link from 'next/link';
import { DeleteFaqButton } from '../../../faqs/components/delete-faq-button';
import type { Faq } from '#src/generated/prisma/client';
import { Button } from '#src/components/ui/button';

interface Props {
  projectId: string;
  faqs: Faq[];
}

export const FaqList = ({ projectId, faqs }: Props) => {
  return (
    <div className="flex flex-col gap-4">
      <div className="flex items-center justify-between">
        <h3 className="text-lg font-semibold">FAQ</h3>
        <Button size="sm" asChild>
          <Link href={`/projects/${projectId}/faqs/create`}>+ 追加</Link>
        </Button>
      </div>
      {faqs.length === 0 ? (
        <p className="text-muted-foreground text-sm">FAQがありません。</p>
      ) : (
        <div className="flex flex-col gap-2">
          {faqs.map((faq) => (
            <div
              key={faq.id}
              className="flex items-center justify-between rounded-lg border p-3"
            >
              <span className="text-sm font-medium">{faq.question}</span>
              <div className="flex gap-2">
                <Button variant="outline" size="sm" asChild>
                  <Link href={`/projects/${projectId}/faqs/${faq.id}/update`}>
                    編集
                  </Link>
                </Button>
                <DeleteFaqButton projectId={projectId} faqId={faq.id} />
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};
