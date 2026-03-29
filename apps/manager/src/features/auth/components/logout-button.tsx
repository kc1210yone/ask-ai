'use client';

import { signOut } from 'aws-amplify/auth';
import { useRouter } from 'next/navigation';
import { Button } from '#src/components/ui/button';

export const LogoutButton = () => {
  const router = useRouter();

  const handleLogout = async () => {
    await signOut();
    router.push('/login');
  };

  return (
    <Button
      variant="secondary"
      size="sm"
      type="button"
      onClick={() => void handleLogout()}
    >
      ログアウト
    </Button>
  );
};
