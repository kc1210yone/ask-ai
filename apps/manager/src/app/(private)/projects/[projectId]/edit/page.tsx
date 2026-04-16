import type { ReactNode } from 'react';
import { ProjectEditPage } from '#src/features/projects';

interface Props {
  params: Promise<{ projectId: string }>;
}

const Page = async ({ params }: Props): Promise<ReactNode> => {
  const { projectId } = await params;
  return <ProjectEditPage projectId={projectId} />;
};

export default Page;
