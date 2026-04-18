import type { ReactNode } from 'react';
import { ProjectLayout } from '#src/features/layouts';

interface Props {
  params: Promise<{ projectId: string }>;
  children: ReactNode;
}

const Layout = async ({ params, children }: Props): Promise<ReactNode> => {
  const { projectId } = await params;
  return <ProjectLayout projectId={projectId}>{children}</ProjectLayout>;
};

export default Layout;
