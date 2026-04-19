'use client';

import { zodResolver } from '@hookform/resolvers/zod';
import {
  AuthError,
  autoSignIn,
  confirmSignUp,
  resendSignUpCode,
} from 'aws-amplify/auth';
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
import { cn } from '#src/lib/utils';

interface Props {
  className?: string | undefined;
}

const FormSchema = z.object({
  code: z.string().length(6, '確認コードは6桁です'),
});
type FormSchemaType = z.infer<typeof FormSchema>;

export const ConfirmForm = ({ className }: Props): ReactNode => {
  const router = useRouter();

  const [isLoading, setIsLoading] = useState(false);

  const { email } = useAuth();

  const [resendButtonCountDown, setResendButtonCountDown] = useState(0);

  const autoSignInWrapper = async (): Promise<void> => {
    setIsLoading(true);
    const result = await autoSignIn();
    setIsLoading(false);

    switch (result.nextStep.signInStep) {
      case 'DONE':
        router.push('/users/create');
        break;
      default:
        throw new Error('Unexpected signInStep.');
    }
  };

  const onSubmit = async (data: FormSchemaType): Promise<void> => {
    invariant(email);

    setIsLoading(true);
    let result;
    try {
      result = await confirmSignUp({
        username: email,
        confirmationCode: data.code,
      });
    } catch (error) {
      invariant(error instanceof AuthError);
      let errorMessage;
      switch (error.name) {
        case 'CodeMismatchException':
          errorMessage = '確認コードが正しくありません。';
          break;
        case 'ExpiredCodeException':
          errorMessage = '確認コードの有効期限が切れています。';
          break;
        default:
          errorMessage = '確認コードの認証に失敗しました。';
          break;
      }
      toast.error(errorMessage, {
        position: 'top-center',
      });
      return;
    } finally {
      setIsLoading(false);
    }

    switch (result.nextStep.signUpStep) {
      case 'DONE':
        router.push('/auth/login');
        toast.success('アカウントが作成されました。', {
          position: 'top-center',
        });
        break;
      case 'COMPLETE_AUTO_SIGN_IN':
        await autoSignInWrapper();
        break;
      default:
        throw new Error('Unexpected signUpStep.');
    }
  };

  const onResendButtonClick = async (): Promise<void> => {
    invariant(email);
    await resendSignUpCode({ username: email });
    setResendButtonCountDown(30);
  };

  useEffect(() => {
    const intervalId = setInterval(() => {
      setResendButtonCountDown((previous) => Math.max(previous - 1, 0));
    }, 1000);
    return () => {
      clearInterval(intervalId);
    };
  }, []);

  const form = useForm<FormSchemaType>({
    resolver: zodResolver(FormSchema),
    defaultValues: {
      code: '',
    },
  });

  return (
    <form
      onSubmit={(event) => void form.handleSubmit(onSubmit)(event)}
      className={cn('flex w-full flex-col gap-4', className)}
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
            />
            {fieldState.invalid && <FieldError errors={[fieldState.error]} />}
          </Field>
        )}
      />
      <Field>
        <Button disabled={isLoading || !email}>確認する</Button>
        <Button
          type="button"
          disabled={isLoading || !email || resendButtonCountDown > 0}
          variant="secondary"
          onClick={() => void onResendButtonClick()}
        >
          確認コードを再送する
          {resendButtonCountDown > 0 && <> ({resendButtonCountDown}秒)</>}
        </Button>
      </Field>
    </form>
  );
};
