import Link from 'next/link';
import invariant from 'tiny-invariant';
import type { ReactNode } from 'react';
import {
  Card,
  CardAction,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '#src/components/ui/card';
import { prisma } from '#src/lib/prisma';

interface Props {
  projectId: string;
}

export const DashboardPage = async ({
  projectId,
}: Props): Promise<ReactNode> => {
  const project = await prisma.project.findUnique({
    where: { id: projectId },
  });
  invariant(project);

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
              <p>
                FAQは、AIアシスタントが参照する質問と回答のペアです。ユーザーからの質問に対して、AIアシスタントが適切な回答を返すために使用されます。
              </p>
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
