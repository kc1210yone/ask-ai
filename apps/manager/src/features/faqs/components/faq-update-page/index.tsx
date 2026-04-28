import { notFound } from 'next/navigation';
import type { ReactNode } from 'react';
import { UpdateForm } from './update-form';
import { getAuthUserOrRedirect } from '#src/features/auth';
import { findUserOrRedirect } from '#src/features/users';
import { prisma } from '#src/lib/prisma';

interface Props {
  projectId: string;
  faqId: string;
}

export const FaqUpdatePage = async ({
  projectId,
  faqId,
}: Props): Promise<ReactNode> => {
  const authUser = await getAuthUserOrRedirect();
  const user = await findUserOrRedirect(authUser.userId);

  const project = await prisma.project.findUnique({
    where: { id: projectId, deletedAt: null },
  });
  // eslint-disable-next-line @typescript-eslint/prefer-optional-chain
  if (!project || project.userId !== user.id) {
    notFound();
  }

  const faq = await prisma.faq.findUnique({
    where: { id: faqId, deletedAt: null },
  });
  // eslint-disable-next-line @typescript-eslint/prefer-optional-chain
  if (!faq || faq.projectId !== projectId) {
    notFound();
  }

  return (
    <>
      <h2 className="text-xl font-semibold">FAQ編集</h2>
      <p className="mt-4">
        FAQは、AIアシスタントが参照する質問と回答のペアです。
      </p>
      <UpdateForm projectId={projectId} faq={faq} className="mt-8" />
    </>
  );
};
