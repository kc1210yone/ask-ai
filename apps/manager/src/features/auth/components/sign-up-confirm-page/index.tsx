'use client';

import { useRouter } from 'next/navigation';
import { useEffect, type ReactNode } from 'react';
import { useAuth } from '#src/features/auth/providers/auth-provider';
import { ConfirmForm } from './confirm-form';

export const SignUpConfirmPage = (): ReactNode => {
  const router = useRouter();

  const { email } = useAuth();

  useEffect(() => {
    if (!email) {
      router.push('/login');
    }
  }, [email, router]);

  return (
    <main className="flex h-screen items-center justify-center">
      <div className="flex w-100 flex-col items-center">
        <h1 className="text-2xl font-bold">アカウント認証</h1>
        <p className="mt-2 text-sm text-gray-500">
          メールに送信された確認コードを入力してください。
        </p>
        <ConfirmForm className="mt-4" />
      </div>
    </main>
  );
};
