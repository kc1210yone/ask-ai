import Link from 'next/link';
import { notFound } from 'next/navigation';
import type { ReactNode } from 'react';
import {
  Card,
  CardAction,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '#src/components/ui/card';
import { getAuthUserOrRedirect } from '#src/features/auth';
import { findUserOrRedirect } from '#src/features/users';
import { prisma } from '#src/lib/prisma';

interface Props {
  projectId: string;
}

export const DashboardPage = async ({
  projectId,
}: Props): Promise<ReactNode> => {
  const authUser = await getAuthUserOrRedirect();
  const user = await findUserOrRedirect(authUser.userId);

  const project = await prisma.project.findUnique({
    where: { id: projectId },
  });
  // eslint-disable-next-line @typescript-eslint/prefer-optional-chain
  if (!project || project.userId !== user.id) {
    notFound();
  }

  const documentCount = await prisma.document.count({
    where: {
      projectId: project.id,
    },
  });
  const faqCount = await prisma.faq.count({
    where: {
      projectId: project.id,
    },
  });

  return (
    <div className="flex flex-col gap-6">
      <Link href={`/projects/${projectId}/documents`}>
        <Card>
          <CardHeader>
            <CardTitle>ドキュメント</CardTitle>
            <CardDescription>
              ドキュメントは、AIアシスタントが参照する単体の情報です。
            </CardDescription>
            <CardAction>詳細を見る</CardAction>
          </CardHeader>
          <CardContent>
            <p className="text-xl font-semibold">{documentCount}件</p>
          </CardContent>
        </Card>
      </Link>
      <Link href={`/projects/${projectId}/faqs`}>
        <Card>
          <CardHeader>
            <CardTitle>FAQ</CardTitle>
            <CardDescription>
              <p>FAQは、AIアシスタントが参照する質問と回答のペアです。</p>
            </CardDescription>
            <CardAction>詳細を見る</CardAction>
          </CardHeader>
          <CardContent>
            <p className="text-xl font-semibold">{faqCount}件</p>
          </CardContent>
        </Card>
      </Link>
    </div>
  );
};
