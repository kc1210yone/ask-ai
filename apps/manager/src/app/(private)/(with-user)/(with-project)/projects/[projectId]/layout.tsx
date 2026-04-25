import type { ReactNode } from 'react';
import { PrivateWithUserLayout } from '#src/features/layouts';

interface Props {
  params: Promise<{ projectId: string }>;
  children: ReactNode;
}

const Layout = async ({ params, children }: Props): Promise<ReactNode> => {
  const { projectId } = await params;
  return (
    <PrivateWithUserLayout projectId={projectId}>
      {children}
    </PrivateWithUserLayout>
  );
};

export default Layout;
