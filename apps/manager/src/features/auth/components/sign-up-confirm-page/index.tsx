import { ConfirmForm } from './confirm-form';
import type { ReactNode } from 'react';

export const SignUpConfirmPage = (): ReactNode => {
  return (
    <main className="flex h-screen items-center justify-center">
      <ConfirmForm />
    </main>
  );
};
