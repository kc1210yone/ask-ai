'use client';

import Link from 'next/link';
import { type ReactNode } from 'react';
import { SignUpForm } from './sign-up-form';

export const SignUpPage = (): ReactNode => {
  return (
    <main className="flex h-screen items-center justify-center">
      <div className="flex w-100 flex-col items-center">
        <h1 className="text-2xl font-bold">アカウントを作成</h1>
        <p className="mt-2 text-sm text-gray-500">
          管理画面の新規アカウントを作成します。
        </p>
        <SignUpForm className="mt-8" />
        <p className="mt-8 text-sm text-gray-500">
          すでにアカウントをお持ちの方は
          <Link
            href="/login"
            className="font-medium text-blue-600 hover:text-blue-500"
          >
            ログイン
          </Link>
        </p>
      </div>
    </main>
  );
};
