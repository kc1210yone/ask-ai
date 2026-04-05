'use client';

import { zodResolver } from '@hookform/resolvers/zod';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { useState } from 'react';
import { useForm } from 'react-hook-form';
import { Button } from '#src/components/ui/button';
import { Input } from '#src/components/ui/input';
import { useSignIn } from '#src/features/auth/hooks/use-sign-in';
import { loginSchema } from '#src/features/auth/lib/schemas';
import type { LoginInput } from '#src/features/auth/lib/schemas';

export const LoginForm = () => {
  const router = useRouter();
  const { execute, isLoading, error } = useSignIn();
  const [step, setStep] = useState<string | null>(null);

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<LoginInput>({
    resolver: zodResolver(loginSchema),
  });
  console.log(errors); // TODO

  const onSubmit = async (data: LoginInput) => {
    const signInStep = await execute(data);
    if (signInStep === 'DONE') {
      router.push('/');
    } else if (signInStep != null) {
      setStep(signInStep);
    }
  };

  if (step === 'CONFIRM_SIGN_IN_WITH_NEW_PASSWORD_REQUIRED') {
    return (
      <p className="text-center text-sm text-gray-600">
        新しいパスワードの設定が必要です。管理者にお問い合わせください。
      </p>
    );
  }

  return (
    <form
      onSubmit={(e) => void handleSubmit(onSubmit)(e)}
      className="space-y-5"
    >
      <Input
        id="email"
        type="email"
        // label="メールアドレス"
        placeholder="email@example.com"
        autoComplete="email"
        // error={errors.email?.message}
        {...register('email')}
      />
      <Input
        id="password"
        type="password"
        // label="パスワード"
        placeholder="••••••••"
        autoComplete="current-password"
        // error={errors.password?.message}
        {...register('password')}
      />
      {error != null && (
        <div className="rounded-lg bg-red-50 px-4 py-3 text-sm text-red-700">
          {error}
        </div>
      )}
      <Button type="submit" disabled={isLoading}>
        {isLoading ? 'ログイン中...' : 'ログイン'}
      </Button>
      <p className="text-center text-sm text-gray-500">
        アカウントをお持ちでない方は{' '}
        <Link
          href="/signup"
          className="font-medium text-blue-600 hover:text-blue-500"
        >
          新規登録
        </Link>
      </p>
    </form>
  );
};
