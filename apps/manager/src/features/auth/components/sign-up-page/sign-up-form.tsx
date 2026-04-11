'use client';

import { zodResolver } from '@hookform/resolvers/zod';
import { confirmSignUp, signUp } from 'aws-amplify/auth';
import { useRouter } from 'next/navigation';
import { useState, type ReactNode } from 'react';
import { Controller, useForm } from 'react-hook-form';
import { z } from 'zod';
import { Button } from '#src/components/ui/button';
import { Field, FieldError, FieldLabel } from '#src/components/ui/field';
import { Input } from '#src/components/ui/input';
import { cn } from '#src/lib/utils';

export type SignUpStep = 'DONE' | 'CONFIRM_SIGN_UP' | 'COMPLETE_AUTO_SIGN_IN';

export const signUpSchema = z
  .object({
    email: z.email('有効なメールアドレスを入力してください'),
    password: z.string().min(8, 'パスワードは8文字以上で入力してください'),
    confirmPassword: z.string().min(1, '確認用パスワードを入力してください'),
  })
  .refine((data) => data.password === data.confirmPassword, {
    message: 'パスワードが一致しません',
    path: ['confirmPassword'],
  });

export type SignUpInput = z.infer<typeof signUpSchema>;

export const useSignUp = () => {
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const execute = async (data: SignUpInput): Promise<SignUpStep | null> => {
    setIsLoading(true);
    setError(null);
    try {
      const result = await signUp({
        username: data.email,
        password: data.password,
      });
      return result.nextStep.signUpStep as SignUpStep;
    } catch (e) {
      setError(e instanceof Error ? e.message : 'アカウント作成に失敗しました');
      return null;
    } finally {
      setIsLoading(false);
    }
  };

  const confirm = async (
    email: string,
    code: string,
  ): Promise<SignUpStep | null> => {
    setIsLoading(true);
    setError(null);
    try {
      const result = await confirmSignUp({
        username: email,
        confirmationCode: code,
      });
      return result.nextStep.signUpStep as SignUpStep;
    } catch (e) {
      setError(e instanceof Error ? e.message : '確認コードが正しくありません');
      return null;
    } finally {
      setIsLoading(false);
    }
  };

  return { execute, confirm, isLoading, error };
};

const confirmCodeSchema = z.object({
  code: z.string().length(6, '確認コードは6桁です'),
});
type ConfirmCodeInput = z.infer<typeof confirmCodeSchema>;

interface Props {
  className?: string | undefined;
}

export const SignUpForm = ({ className }: Props): ReactNode => {
  const router = useRouter();
  const { execute, confirm, isLoading, error } = useSignUp();
  const [step, setStep] = useState<'form' | 'confirm'>('form');
  const [email, setEmail] = useState('');

  const signUpForm = useForm<SignUpInput>({
    resolver: zodResolver(signUpSchema),
    defaultValues: {
      email: '',
      password: '',
      confirmPassword: '',
    },
  });

  const confirmForm = useForm<ConfirmCodeInput>({
    resolver: zodResolver(confirmCodeSchema),
    defaultValues: {
      code: '',
    },
  });

  const onSignUp = async (data: SignUpInput): Promise<void> => {
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

  const onConfirm = async (data: ConfirmCodeInput): Promise<void> => {
    const signUpStep = await confirm(email, data.code);
    if (signUpStep === 'DONE' || signUpStep === 'COMPLETE_AUTO_SIGN_IN') {
      router.push('/login');
    }
  };

  if (step === 'confirm') {
    return (
      <form
        onSubmit={(event) => void confirmForm.handleSubmit(onConfirm)(event)}
        className={cn('flex w-full flex-col gap-4', className)}
      >
        <div className="rounded-lg bg-blue-50 px-4 py-3 text-sm text-blue-700">
          <strong>{email}</strong> に確認コードを送信しました。
        </div>
        <Controller
          name="code"
          control={confirmForm.control}
          render={({ field, fieldState }) => (
            <Field data-invalid={fieldState.invalid}>
              <FieldLabel htmlFor={field.name}>確認コード</FieldLabel>
              <Input
                {...field}
                id={field.name}
                aria-invalid={fieldState.invalid}
                placeholder="123456"
                autoComplete="one-time-code"
                inputMode="numeric"
                maxLength={6}
              />
              {fieldState.invalid && <FieldError errors={[fieldState.error]} />}
            </Field>
          )}
        />
        {error != null && (
          <div className="rounded-lg bg-red-50 px-4 py-3 text-sm text-red-700">
            {error}
          </div>
        )}
        <Field>
          <Button disabled={isLoading}>確認する</Button>
        </Field>
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
      onSubmit={(event) => void signUpForm.handleSubmit(onSignUp)(event)}
      className={cn('flex w-full flex-col gap-4', className)}
    >
      <Controller
        name="email"
        control={signUpForm.control}
        render={({ field, fieldState }) => (
          <Field data-invalid={fieldState.invalid}>
            <FieldLabel htmlFor={field.name}>メールアドレス</FieldLabel>
            <Input
              {...field}
              id={field.name}
              aria-invalid={fieldState.invalid}
              placeholder="email@example.com"
              autoComplete="email"
            />
            {fieldState.invalid && <FieldError errors={[fieldState.error]} />}
          </Field>
        )}
      />
      <Controller
        name="password"
        control={signUpForm.control}
        render={({ field, fieldState }) => (
          <Field data-invalid={fieldState.invalid}>
            <FieldLabel htmlFor={field.name}>パスワード</FieldLabel>
            <Input
              {...field}
              id={field.name}
              aria-invalid={fieldState.invalid}
              placeholder="••••••••"
              type="password"
              autoComplete="new-password"
            />
            {fieldState.invalid && <FieldError errors={[fieldState.error]} />}
          </Field>
        )}
      />
      <Controller
        name="confirmPassword"
        control={signUpForm.control}
        render={({ field, fieldState }) => (
          <Field data-invalid={fieldState.invalid}>
            <FieldLabel htmlFor={field.name}>パスワード（確認）</FieldLabel>
            <Input
              {...field}
              id={field.name}
              aria-invalid={fieldState.invalid}
              placeholder="••••••••"
              type="password"
              autoComplete="new-password"
            />
            {fieldState.invalid && <FieldError errors={[fieldState.error]} />}
          </Field>
        )}
      />
      {error != null && (
        <div className="rounded-lg bg-red-50 px-4 py-3 text-sm text-red-700">
          {error}
        </div>
      )}
      <Field>
        <Button disabled={isLoading}>アカウントを作成</Button>
      </Field>
    </form>
  );
};
