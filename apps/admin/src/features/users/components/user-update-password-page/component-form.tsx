'use client';

import 'client-only';
import { zodResolver } from '@hookform/resolvers/zod';
import { updatePassword } from 'aws-amplify/auth';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { useState, type ReactNode } from 'react';
import { Controller, useForm } from 'react-hook-form';
import { toast } from 'sonner';
import invariant from 'tiny-invariant';
import { z } from 'zod';
import { Button } from '#src/components/ui/button';
import { Field, FieldError, FieldLabel } from '#src/components/ui/field';
import { Input } from '#src/components/ui/input';
import { cn } from '#src/lib/utils';

const FormSchema = z
  .object({
    oldPassword: z
      .string()
      .min(1, '現在のパスワードを入力してください。')
      .max(128, '128文字以内で入力してください。'),
    newPassword: z
      .string()
      .min(8, 'パスワードは8文字以上で入力してください。')
      .max(128, '128文字以内で入力してください。')
      .regex(/[0-9]/, '少なくとも1つの数字を含めてください。')
      .regex(/[A-Z]/, '少なくとも1つの大文字を含めてください。')
      .regex(/[a-z]/, '少なくとも1つの小文字を含めてください。')
      .regex(
        /[\^$*.[\]{}()?\-"!@#%&/\\,><':;|_~`+= ]/,
        '少なくとも1つの特殊文字を含めてください。',
      )
      .regex(/^[^ ].*[^ ]$/, '先頭または末尾にスペースは使用できません。'),
    confirmNewPassword: z
      .string()
      .min(1, '確認用パスワードを入力してください。'),
  })
  .refine((data) => data.newPassword === data.confirmNewPassword, {
    message: 'パスワードが一致しません。',
    path: ['confirmNewPassword'],
  });
type FormSchemaType = z.infer<typeof FormSchema>;

interface Props {
  className?: string | undefined;
}

export const ComponentForm = ({ className }: Props): ReactNode => {
  const router = useRouter();

  const [isLoading, setIsLoading] = useState(false);

  const form = useForm<FormSchemaType>({
    resolver: zodResolver(FormSchema),
    defaultValues: {
      oldPassword: '',
      newPassword: '',
      confirmNewPassword: '',
    },
  });

  const onSubmit = async (data: FormSchemaType): Promise<void> => {
    setIsLoading(true);
    try {
      await updatePassword({
        oldPassword: data.oldPassword,
        newPassword: data.newPassword,
      });
    } catch (error) {
      console.warn(error);
      invariant(error instanceof Error);
      let errorMessage;
      switch (error.name) {
        case 'NotAuthorizedException':
          errorMessage = '現在のパスワードが正しくありません。';
          break;
        case 'LimitExceededException':
          errorMessage =
            '試行回数の上限に達しました。しばらくしてから再度お試しください。';
          break;
        default:
          errorMessage = 'パスワード変更に失敗しました。';
          break;
      }
      toast.error(errorMessage);
      setIsLoading(false);
      return;
    }

    router.push('/');
    toast.success('パスワードを変更しました。');
  };

  return (
    <form
      onSubmit={(event) => void form.handleSubmit(onSubmit)(event)}
      className={cn('flex flex-col gap-4', className)}
    >
      <Controller
        name="oldPassword"
        control={form.control}
        render={({ field, fieldState }) => (
          <Field data-invalid={fieldState.invalid}>
            <FieldLabel htmlFor={field.name}>現在のパスワード</FieldLabel>
            <Input
              {...field}
              id={field.name}
              aria-invalid={fieldState.invalid}
              type="password"
              autoComplete="current-password"
            />
            {fieldState.invalid && <FieldError errors={[fieldState.error]} />}
          </Field>
        )}
      />
      <Controller
        name="newPassword"
        control={form.control}
        render={({ field, fieldState }) => (
          <Field data-invalid={fieldState.invalid}>
            <FieldLabel htmlFor={field.name}>新しいパスワード</FieldLabel>
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
        name="confirmNewPassword"
        control={form.control}
        render={({ field, fieldState }) => (
          <Field data-invalid={fieldState.invalid}>
            <FieldLabel htmlFor={field.name}>
              新しいパスワード（確認）
            </FieldLabel>
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
      <Field orientation="horizontal">
        <Button variant="secondary" asChild>
          <Link href="/">キャンセル</Link>
        </Button>
        <Button disabled={isLoading}>変更</Button>
      </Field>
    </form>
  );
};
