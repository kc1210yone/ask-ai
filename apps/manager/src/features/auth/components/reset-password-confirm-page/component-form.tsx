'use client';

import 'client-only';
import { zodResolver } from '@hookform/resolvers/zod';
import { AuthError, confirmResetPassword } from 'aws-amplify/auth';
import { useRouter } from 'next/navigation';
import { useEffect, useState, type ReactNode } from 'react';
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
    code: z.string().length(6, '確認コードは6桁です。'),
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

  const { username } = useAuth();

  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => {
    if (!username) {
      router.push('/auth/reset-password');
    }
  }, [username, router]);

  const form = useForm<FormSchemaType>({
    resolver: zodResolver(FormSchema),
    defaultValues: {
      code: '',
      password: '',
      confirmPassword: '',
    },
  });

  const onSubmit = async (data: FormSchemaType): Promise<void> => {
    invariant(username);

    setIsLoading(true);
    try {
      await confirmResetPassword({
        username,
        newPassword: data.password,
        confirmationCode: data.code,
      });
    } catch (error) {
      invariant(error instanceof AuthError);
      let errorMessage;
      switch (error.name) {
        case 'CodeMismatchException':
          errorMessage = '確認コードが正しくありません。';
          break;
        default:
          errorMessage = 'パスワードのリセットに失敗しました。';
          break;
      }
      toast.error(errorMessage, {
        position: 'top-center',
      });
      setIsLoading(false);
      return;
    }

    router.push('/auth/login');
    toast.info('パスワードを変更しました。', {
      position: 'top-center',
    });
  };

  return (
    <form
      onSubmit={(event) => void form.handleSubmit(onSubmit)(event)}
      className="flex flex-col gap-4"
    >
      <Controller
        name="code"
        control={form.control}
        render={({ field, fieldState }) => (
          <Field data-invalid={fieldState.invalid}>
            <FieldLabel htmlFor={field.name}>確認コード</FieldLabel>
            <Input
              {...field}
              id={field.name}
              aria-invalid={fieldState.invalid}
              placeholder="123456"
              inputMode="numeric"
              maxLength={6}
              autoComplete="one-time-code"
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
        <Button disabled={isLoading || !username}>パスワードを変更</Button>
      </Field>
    </form>
  );
};
