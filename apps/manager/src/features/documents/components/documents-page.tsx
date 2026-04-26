import { redirect } from 'next/navigation';
import type { ReactNode } from 'react';
import { getAuthUserOrRedirect } from '#src/features/auth';
import { findUserOrRedirect } from '#src/features/users';
import { prisma } from '#src/lib/prisma';

interface Props {
  projectId: string;
}

export const DocumentsPage = async ({
  projectId,
}: Props): Promise<ReactNode> => {
  const authUser = await getAuthUserOrRedirect();
  const user = await findUserOrRedirect(authUser.userId);

  const project = await prisma.project.findUnique({
    where: { id: projectId },
  });
  // eslint-disable-next-line @typescript-eslint/prefer-optional-chain
  if (!project || project.userId !== user.id) {
    redirect('/');
  }

  const documents = await prisma.document.findMany({
    select: { id: true, title: true, content: true },
    where: { projectId: project.id },
  });
  console.log(documents);

  return <div>Documents Page {projectId}</div>;
};
