import type { ReactNode } from 'react';
import { ProjectUpdatePage } from '#src/features/projects';

interface Props {
  params: Promise<{ projectId: string }>;
}

const Page = async ({ params }: Props): Promise<ReactNode> => {
  const { projectId } = await params;
  return <ProjectUpdatePage projectId={projectId} />;
};

export default Page;
