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
import { cn } from '#src/lib/utils';

const FormSchema = z.object({
  email: z.email('有効なメールアドレスを入力してください。'),
  password: z.string().min(1, 'パスワードを入力してください。'),
});
type FormSchemaType = z.infer<typeof FormSchema>;

interface Props {
  className?: string | undefined;
}

export const LoginForm = ({ className }: Props): ReactNode => {
  const router = useRouter();

  const { setEmail } = useAuth();

  const [isLoading, setIsLoading] = useState(false);

  const form = useForm<FormSchemaType>({
    resolver: zodResolver(FormSchema),
    defaultValues: {
      email: '',
      password: '',
    },
  });

  const onSubmit = async (data: FormSchemaType): Promise<void> => {
    setIsLoading(true);
    let result;
    try {
      result = await signIn({
        username: data.email,
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
      return;
    } finally {
      setIsLoading(false);
    }

    switch (result.nextStep.signInStep) {
      case 'DONE':
        router.push('/');
        break;
      case 'CONFIRM_SIGN_UP':
        setEmail(data.email);
        router.push('/sign-up-confirm');
        break;
      default:
        throw new Error('Unexpected signInStep.');
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
      <Field>
        <Button disabled={isLoading}>ログイン</Button>
      </Field>
    </form>
  );
};
