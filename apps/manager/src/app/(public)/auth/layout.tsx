import type { ReactNode } from 'react';
import { AuthLayout, AuthProvider } from '#src/features/auth';

interface Props {
  children: ReactNode;
}

const Layout = ({ children }: Props): ReactNode => {
  return (
    <AuthProvider>
      <AuthLayout>{children}</AuthLayout>
    </AuthProvider>
  );
};

export default Layout;
