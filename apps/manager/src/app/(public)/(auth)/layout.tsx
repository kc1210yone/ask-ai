import type { ReactNode } from 'react';
import { AuthProvider } from '#src/features/auth';

interface Props {
  children: ReactNode;
}

const AuthLayout = ({ children }: Props): ReactNode => {
  return <AuthProvider>{children}</AuthProvider>;
};

export default AuthLayout;
