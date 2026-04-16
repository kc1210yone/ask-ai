import type { ReactNode } from 'react';
import { ProjectPage } from '#src/features/projects';

interface Props {
  params: Promise<{ projectId: string }>;
}

const Page = async ({ params }: Props): Promise<ReactNode> => {
  const { projectId } = await params;
  return <ProjectPage projectId={projectId} />;
};

export default Page;
