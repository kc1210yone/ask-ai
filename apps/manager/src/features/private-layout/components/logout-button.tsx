'use client';

import { signOut } from 'aws-amplify/auth';
import { useRouter } from 'next/navigation';
import { Button } from '#src/components/ui/button';
import type { ReactNode } from 'react';

export const LogoutButton = (): ReactNode => {
  const router = useRouter();

  const onClick = async (): Promise<void> => {
    await signOut();
    router.push('/login');
  };

  return (
    <Button variant="secondary" type="button" onClick={() => void onClick()}>
      ログアウト
    </Button>
  );
};
