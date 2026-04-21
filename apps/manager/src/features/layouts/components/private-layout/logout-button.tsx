'use client';

import { signOut } from 'aws-amplify/auth';
import { useRouter } from 'next/navigation';
import type { ReactNode } from 'react';
import { Button } from '#src/components/ui/button';

export const LogoutButton = (): ReactNode => {
  const router = useRouter();

  const onClick = async (): Promise<void> => {
    await signOut();
    router.push('/auth/login');
  };

  return (
    <Button variant="secondary" type="button" onClick={() => void onClick()}>
      ログアウト
    </Button>
  );
};
