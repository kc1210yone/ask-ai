import 'server-only';
import type { ReactNode } from 'react';
import { PrivateWithUserLayout } from '#src/features/layouts';

interface Props {
  children: ReactNode;
}

const Layout = ({ children }: Props): ReactNode => {
  return (
    <PrivateWithUserLayout projectId={null}>{children}</PrivateWithUserLayout>
  );
};

export default Layout;
