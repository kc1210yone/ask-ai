import 'server-only';
import { FileQuestionMarkIcon, PencilIcon } from 'lucide-react';
import Link from 'next/link';
import { notFound } from 'next/navigation';
import type { ReactNode } from 'react';
import { FaqItem } from './faq-item';
import { Button } from '#src/components/ui/button';
import {
  Empty,
  EmptyContent,
  EmptyDescription,
  EmptyHeader,
  EmptyMedia,
  EmptyTitle,
} from '#src/components/ui/empty';
import { ItemGroup } from '#src/components/ui/item';
import { getAuthUserOrRedirect } from '#src/features/auth';
import { findUserOrRedirect } from '#src/features/users';
import { prisma } from '#src/lib/prisma';

interface Props {
  projectId: string;
}

export const FaqsPage = async ({ projectId }: Props): Promise<ReactNode> => {
  const authUser = await getAuthUserOrRedirect();
  const user = await findUserOrRedirect(authUser.userId);

  const project = await prisma.project.findUnique({
    where: { id: projectId, deletedAt: null },
  });
  // eslint-disable-next-line @typescript-eslint/prefer-optional-chain
  if (!project || project.userId !== user.id) {
    notFound();
  }

  const faqs = await prisma.faq.findMany({
    where: { projectId: project.id, deletedAt: null },
    orderBy: { createdAt: 'desc' },
  });

  return (
    <>
      <div className="flex items-center justify-between">
        <h2 className="text-xl font-semibold">FAQ</h2>
        {faqs.length > 0 && (
          <Button asChild>
            <Link href={`/projects/${projectId}/faqs/create`}>
              <PencilIcon />
              作成
            </Link>
          </Button>
        )}
      </div>
      <p className="text-muted-foreground mt-4">
        FAQは、AIアシスタントが参照する質問と回答のペアです。
      </p>
      {faqs.length === 0 ? (
        <Empty>
          <EmptyHeader>
            <EmptyMedia variant="icon">
              <FileQuestionMarkIcon />
            </EmptyMedia>
            <EmptyTitle>FAQがまだ作成されていません</EmptyTitle>
            <EmptyDescription>
              FAQは、AIアシスタントが参照する質問と回答のペアです。
            </EmptyDescription>
          </EmptyHeader>
          <EmptyContent>
            <Button asChild>
              <Link href={`/projects/${projectId}/faqs/create`}>
                <PencilIcon />
                作成
              </Link>
            </Button>
          </EmptyContent>
        </Empty>
      ) : (
        <ItemGroup className="mt-8">
          {faqs.map((faq) => (
            <FaqItem key={faq.id} projectId={projectId} faq={faq} />
          ))}
        </ItemGroup>
      )}
    </>
  );
};
