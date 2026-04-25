'use client';

import { zodResolver } from '@hookform/resolvers/zod';
import { AuthError, signIn } from 'aws-amplify/auth';
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

const FormSchema = z.object({
  username: z.email('有効なメールアドレスを入力してください。'),
  password: z.string().min(1, 'パスワードを入力してください。'),
});
type FormSchemaType = z.infer<typeof FormSchema>;

export const LoginForm = (): ReactNode => {
  const router = useRouter();

  const { setUsername } = useAuth();

  const [isLoading, setIsLoading] = useState(false);

  const form = useForm<FormSchemaType>({
    resolver: zodResolver(FormSchema),
    defaultValues: {
      username: '',
      password: '',
    },
  });

  const onSubmit = async (data: FormSchemaType): Promise<void> => {
    setIsLoading(true);
    let result;
    try {
      result = await signIn({
        username: data.username,
        password: data.password,
      });
    } catch (error) {
      invariant(error instanceof AuthError);
      let errorMessage;
      switch (error.name) {
        case 'NotAuthorizedException':
          errorMessage = 'ユーザー名かパスワードが間違っています。';
          break;
        default:
          errorMessage = 'ログインに失敗しました。';
          break;
      }
      toast.error(errorMessage, {
        position: 'top-center',
      });
      setIsLoading(false);
      return;
    }

    switch (result.nextStep.signInStep) {
      case 'DONE':
        router.push('/');
        break;
      case 'CONFIRM_SIGN_UP':
        setUsername(data.username);
        router.push('/auth/sign-up-confirm');
        break;
      default:
        throw new Error('Unexpected signInStep.');
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
              autoComplete="current-password"
            />
            {fieldState.invalid && <FieldError errors={[fieldState.error]} />}
          </Field>
        )}
      />
      <Field>
        <Button disabled={isLoading}>ログイン</Button>
      </Field>
    </form>
  );
};
