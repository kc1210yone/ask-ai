import Link from 'next/link';
import { LoginForm } from './login-form';
import type { ReactNode } from 'react';

export const LoginPage = (): ReactNode => {
  return (
    <main className="flex h-screen items-center justify-center">
      <div className="flex w-100 flex-col items-center">
        <h1 className="text-2xl font-bold">ログイン</h1>
        <p className="mt-2 text-sm text-gray-500">
          管理画面にログインしてください。
        </p>
        <LoginForm className="mt-8" />
        <p className="mt-8 text-sm text-gray-500">
          アカウントをお持ちでない方は
          <Link
            href="/auth/sign-up"
            className="font-medium text-blue-600 hover:text-blue-500"
          >
            新規登録
          </Link>
        </p>
      </div>
    </main>
  );
};
