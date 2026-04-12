'use client';

import { zodResolver } from '@hookform/resolvers/zod';
import { signUp } from 'aws-amplify/auth';
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
    email: z.email('有効なメールアドレスを入力してください。'),
    password: z.string().min(8, 'パスワードは8文字以上で入力してください。'),
    confirmPassword: z.string().min(1, '確認用パスワードを入力してください。'),
  })
  .refine((data) => data.password === data.confirmPassword, {
    message: 'パスワードが一致しません。',
    path: ['confirmPassword'],
  });
type FormSchemaType = z.infer<typeof FormSchema>;

interface Props {
  className?: string | undefined;
}

export const SignUpForm = ({ className }: Props): ReactNode => {
  const [isLoading, setIsLoading] = useState(false);

  const form = useForm<FormSchemaType>({
    resolver: zodResolver(FormSchema),
    defaultValues: {
      email: '',
      password: '',
      confirmPassword: '',
    },
  });

  const onSubmit = async (data: FormSchemaType): Promise<void> => {
    setIsLoading(true);
    let result;
    try {
      result = await signUp({
        username: data.email,
        password: data.password,
      });
    } catch (error) {
      invariant(error instanceof Error);
      toast.error(error.message);
      return;
    } finally {
      setIsLoading(false);
    }

    switch (result.nextStep.signUpStep) {
      case 'CONFIRM_SIGN_UP':
        break;
      default:
        throw new Error('Unexpected signUpStep.');
    }
  };

  return (
    <form
      onSubmit={(event) => void form.handleSubmit(onSubmit)(event)}
      className={cn('flex w-full flex-col gap-4', className)}
    >
      <Controller
        name="email"
        control={form.control}
        render={({ field, fieldState }) => (
          <Field data-invalid={fieldState.invalid}>
            <FieldLabel htmlFor={field.name}>メールアドレス</FieldLabel>
            <Input
              {...field}
              id={field.name}
              aria-invalid={fieldState.invalid}
              placeholder="email@example.com"
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
              placeholder="••••••••"
              type="password"
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
              placeholder="••••••••"
              type="password"
            />
            {fieldState.invalid && <FieldError errors={[fieldState.error]} />}
          </Field>
        )}
      />
      <Field>
        <Button disabled={isLoading}>アカウントを作成</Button>
      </Field>
    </form>
  );
};
