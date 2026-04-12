import { AuthProvider } from '#src/features/auth';
import type { ReactNode } from 'react';

interface Props {
  children: ReactNode;
}

const AuthLayout = ({ children }: Props): ReactNode => {
  return <AuthProvider>{children}</AuthProvider>;
};

export default AuthLayout;
