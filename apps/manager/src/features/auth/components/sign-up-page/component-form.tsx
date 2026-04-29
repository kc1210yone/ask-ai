'use client';

import 'client-only';
import { zodResolver } from '@hookform/resolvers/zod';
import { AuthError, signUp } from 'aws-amplify/auth';
import { useRouter } from 'next/navigation';
import { useState, type ReactNode } from 'react';
import { Controller, useForm } from 'react-hook-form';
import { toast } from 'sonner';
import invariant from 'tiny-invariant';
import { z } from 'zod';
import { Button } from '#src/components/ui/button';
import { Field, FieldError, FieldLabel } from '#src/components/ui/field';
import { Input } from '#src/components/ui/input';
import { useAuth } from '#src/features/auth/providers/auth-provider';

const FormSchema = z
  .object({
    username: z
      .email('有効なメールアドレスを入力してください。')
      .max(254, '254文字以内で入力してください。'),
    password: z
      .string()
      .min(8, 'パスワードは8文字以上で入力してください。')
      .max(128, '128文字以内で入力してください。'),
    confirmPassword: z.string().min(1, '確認用パスワードを入力してください。'),
  })
  .refine((data) => data.password === data.confirmPassword, {
    message: 'パスワードが一致しません。',
    path: ['confirmPassword'],
  });
type FormSchemaType = z.infer<typeof FormSchema>;

export const ComponentForm = (): ReactNode => {
  const router = useRouter();

  const { setUsername } = useAuth();

  const [isLoading, setIsLoading] = useState(false);

  const form = useForm<FormSchemaType>({
    resolver: zodResolver(FormSchema),
    defaultValues: {
      username: '',
      password: '',
      confirmPassword: '',
    },
  });

  const onSubmit = async (data: FormSchemaType): Promise<void> => {
    setIsLoading(true);
    let result;
    try {
      result = await signUp({
        username: data.username,
        password: data.password,
        options: {
          userAttributes: {
            email: data.username,
          },
          autoSignIn: true,
        },
      });
    } catch (error) {
      invariant(error instanceof AuthError);
      let errorMessage;
      switch (error.name) {
        case 'UsernameExistsException':
          errorMessage = 'このユーザー名は既に使用されています。';
          break;
        default:
          errorMessage = 'アカウント作成に失敗しました。';
          break;
      }
      toast.error(errorMessage, {
        position: 'top-center',
      });
      setIsLoading(false);
      return;
    }

    switch (result.nextStep.signUpStep) {
      case 'CONFIRM_SIGN_UP':
        setUsername(data.username);
        router.push('/auth/sign-up-confirm');
        break;
      default:
        throw new Error('Unexpected signUpStep.');
    }
  };

  return (
    <form
      onSubmit={(event) => void form.handleSubmit(onSubmit)(event)}
      className="flex flex-col gap-4"
    >
      <Controller
        name="username"
        control={form.control}
        render={({ field, fieldState }) => (
          <Field data-invalid={fieldState.invalid}>
            <FieldLabel htmlFor={field.name}>
              ユーザー名（メールアドレス）
            </FieldLabel>
            <Input
              {...field}
              id={field.name}
              aria-invalid={fieldState.invalid}
              placeholder="email@example.com"
              type="email"
              autoComplete="email"
            />
            {fieldState.invalid && <FieldError errors={[fieldState.error]} />}
          </Field>
        )}
      />
      <Controller
        name="password"
        control={form.control}
        render={({ field, fieldState }) => (
          <Field data-invalid={fieldState.invalid}>
            <FieldLabel htmlFor={field.name}>パスワード</FieldLabel>
            <Input
              {...field}
              id={field.name}
              aria-invalid={fieldState.invalid}
              type="password"
              autoComplete="new-password"
            />
            {fieldState.invalid && <FieldError errors={[fieldState.error]} />}
          </Field>
        )}
      />
      <Controller
        name="confirmPassword"
        control={form.control}
        render={({ field, fieldState }) => (
          <Field data-invalid={fieldState.invalid}>
            <FieldLabel htmlFor={field.name}>パスワード（確認）</FieldLabel>
            <Input
              {...field}
              id={field.name}
              aria-invalid={fieldState.invalid}
              type="password"
              autoComplete="new-password"
            />
            {fieldState.invalid && <FieldError errors={[fieldState.error]} />}
          </Field>
        )}
      />
      <Field>
        <Button disabled={isLoading}>アカウント作成</Button>
      </Field>
    </form>
  );
};
