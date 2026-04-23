import type { ReactNode } from 'react';
import { PrivateLayout } from '#src/features/layouts';

interface Props {
  children: ReactNode;
}

const Layout = ({ children }: Props): ReactNode => {
  return <PrivateLayout projectId={null}>{children}</PrivateLayout>;
};

export default Layout;
