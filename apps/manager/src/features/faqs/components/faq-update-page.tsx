import Link from 'next/link';
import { notFound } from 'next/navigation';
import { updateFaq } from '../actions';
import { getFaq } from '../lib/queries';
import { FaqForm } from './faq-form';
import { Button } from '#src/components/ui/button';
import { prisma } from '#src/lib/prisma';
import { findOrCreateCurrentUser } from '#src/lib/user';

interface Props {
  projectId: string;
  faqId: string;
}

export const FaqUpdatePage = async ({ projectId, faqId }: Props) => {
  const user = await findOrCreateCurrentUser();
  const project = await prisma.project.findFirst({
    where: { id: projectId, userId: user.id },
  });
  if (!project) notFound();

  const faq = await getFaq(faqId, projectId);
  if (!faq) notFound();

  const boundAction = updateFaq.bind(null, projectId, faqId);

  return (
    <div className="flex flex-col gap-6">
      <div className="flex items-center gap-4">
        <Button variant="ghost" size="sm" asChild>
          <Link href={`/?projectId=${projectId}`}>← 戻る</Link>
        </Button>
        <h2 className="text-xl font-semibold">FAQ編集</h2>
      </div>
      <FaqForm
        action={boundAction}
        defaultValues={{ question: faq.question, answer: faq.answer }}
        cancelHref={`/?projectId=${projectId}`}
      />
    </div>
  );
};
