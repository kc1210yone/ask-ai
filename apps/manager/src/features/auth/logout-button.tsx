'use client';

import { signOut } from 'aws-amplify/auth';
import { useRouter } from 'next/navigation';

export const LogoutButton = () => {
  const router = useRouter();

  const handleLogout = async () => {
    await signOut();
    router.push('/login');
  };

  return (
    <button type="button" onClick={() => void handleLogout()}>
      ログアウト
    </button>
  );
};
