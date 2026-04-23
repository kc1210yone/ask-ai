import type { ReactNode } from 'react';
import { PrivateLayout } from '#src/features/layouts';

interface Props {
  params: Promise<{ projectId: string }>;
  children: ReactNode;
}

const Layout = async ({ params, children }: Props): Promise<ReactNode> => {
  const { projectId } = await params;
  return <PrivateLayout projectId={projectId}>{children}</PrivateLayout>;
};

export default Layout;
