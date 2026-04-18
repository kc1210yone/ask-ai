import { redirect } from 'next/navigation';
import type { ReactNode } from 'react';
import { prisma } from '#src/lib/prisma';

interface Props {
  projectId: string;
}

export const DashboardPage = async ({
  projectId,
}: Props): Promise<ReactNode> => {
  const project = await prisma.project.findFirst({
    where: { id: projectId },
    include: {
      documents: { orderBy: { createdAt: 'desc' } },
      faqs: { orderBy: { createdAt: 'desc' } },
    },
  });

  if (!project) redirect('/');

  return (
    <div className="flex flex-col gap-6">
      {JSON.stringify(project, null, 2)}
    </div>
  );
};
