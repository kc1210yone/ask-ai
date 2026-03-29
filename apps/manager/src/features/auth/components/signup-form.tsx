'use client';

import { zodResolver } from '@hookform/resolvers/zod';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { useState } from 'react';
import { useForm } from 'react-hook-form';
import { z } from 'zod';
import { Button } from '#src/components/ui/button';
import { Input } from '#src/components/ui/input';
import { useSignUp } from '#src/features/auth/hooks/use-sign-up';
import { signUpSchema } from '#src/features/auth/lib/schemas';
import type { SignUpInput } from '#src/features/auth/lib/schemas';

const confirmCodeSchema = z.object({
  code: z.string().length(6, '確認コードは6桁です'),
});
type ConfirmCodeInput = z.infer<typeof confirmCodeSchema>;

export const SignUpForm = () => {
  const router = useRouter();
  const { execute, confirm, isLoading, error } = useSignUp();
  const [step, setStep] = useState<'form' | 'confirm'>('form');
  const [email, setEmail] = useState('');

  const signUpForm = useForm<SignUpInput>({
    resolver: zodResolver(signUpSchema),
  });

  const confirmForm = useForm<ConfirmCodeInput>({
    resolver: zodResolver(confirmCodeSchema),
  });

  const onSignUp = async (data: SignUpInput) => {
    const signUpStep = await execute(data);
    if (signUpStep === 'CONFIRM_SIGN_UP') {
      setEmail(data.email);
      setStep('confirm');
    } else if (
      signUpStep === 'DONE' ||
      signUpStep === 'COMPLETE_AUTO_SIGN_IN'
    ) {
      router.push('/login');
    }
  };

  const onConfirm = async (data: ConfirmCodeInput) => {
    const signUpStep = await confirm(email, data.code);
    if (signUpStep === 'DONE' || signUpStep === 'COMPLETE_AUTO_SIGN_IN') {
      router.push('/login');
    }
  };

  if (step === 'confirm') {
    return (
      <form
        onSubmit={(e) => void confirmForm.handleSubmit(onConfirm)(e)}
        className="space-y-5"
      >
        <div className="rounded-lg bg-blue-50 px-4 py-3 text-sm text-blue-700">
          <strong>{email}</strong> に確認コードを送信しました。
        </div>
        <Input
          id="code"
          type="text"
          label="確認コード"
          placeholder="123456"
          autoComplete="one-time-code"
          inputMode="numeric"
          maxLength={6}
          error={confirmForm.formState.errors.code?.message}
          {...confirmForm.register('code')}
        />
        {error != null && (
          <div className="rounded-lg bg-red-50 px-4 py-3 text-sm text-red-700">
            {error}
          </div>
        )}
        <Button type="submit" fullWidth disabled={isLoading}>
          {isLoading ? '確認中...' : '確認する'}
        </Button>
        <button
          type="button"
          className="w-full text-center text-sm text-gray-500 hover:text-gray-700"
          onClick={() => {
            setStep('form');
          }}
        >
          戻る
        </button>
      </form>
    );
  }

  return (
    <form
      onSubmit={(e) => void signUpForm.handleSubmit(onSignUp)(e)}
      className="space-y-5"
    >
      <Input
        id="email"
        type="email"
        label="メールアドレス"
        placeholder="email@example.com"
        autoComplete="email"
        error={signUpForm.formState.errors.email?.message}
        {...signUpForm.register('email')}
      />
      <Input
        id="password"
        type="password"
        label="パスワード"
        placeholder="••••••••"
        autoComplete="new-password"
        error={signUpForm.formState.errors.password?.message}
        {...signUpForm.register('password')}
      />
      <Input
        id="confirmPassword"
        type="password"
        label="パスワード（確認）"
        placeholder="••••••••"
        autoComplete="new-password"
        error={signUpForm.formState.errors.confirmPassword?.message}
        {...signUpForm.register('confirmPassword')}
      />
      {error != null && (
        <div className="rounded-lg bg-red-50 px-4 py-3 text-sm text-red-700">
          {error}
        </div>
      )}
      <Button type="submit" fullWidth disabled={isLoading}>
        {isLoading ? '作成中...' : 'アカウントを作成'}
      </Button>
      <p className="text-center text-sm text-gray-500">
        すでにアカウントをお持ちの方は{' '}
        <Link
          href="/login"
          className="font-medium text-blue-600 hover:text-blue-500"
        >
          ログイン
        </Link>
      </p>
    </form>
  );
};
