'use client';

import 'client-only';
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

const FormSchema = z.object({
  code: z.string().length(6, '確認コードは6桁です。'),
});
type FormSchemaType = z.infer<typeof FormSchema>;

export const ComponentForm = (): ReactNode => {
  const router = useRouter();

  const [isLoading, setIsLoading] = useState(false);

  const { username } = useAuth();

  const [resendButtonCountDown, setResendButtonCountDown] = useState(0);

  useEffect(() => {
    if (!username) {
      router.push('/auth/login');
    }
  }, [username, router]);

  const form = useForm<FormSchemaType>({
    resolver: zodResolver(FormSchema),
    defaultValues: {
      code: '',
    },
  });

  const autoSignInWrapper = async (): Promise<void> => {
    const result = await autoSignIn();

    switch (result.nextStep.signInStep) {
      case 'DONE':
        router.push('/');
        break;
      default:
        throw new Error('Unexpected signInStep.');
    }
  };

  const onSubmit = async (data: FormSchemaType): Promise<void> => {
    invariant(username);

    setIsLoading(true);
    let result;
    try {
      result = await confirmSignUp({
        username,
        confirmationCode: data.code,
      });
    } catch (error) {
      invariant(error instanceof AuthError);
      let errorMessage;
      switch (error.name) {
        case 'CodeMismatchException':
          // 試行回数が多すぎる場合もここに来る。
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
      setIsLoading(false);
      return;
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
    invariant(username);
    await resendSignUpCode({ username });
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
      <Field>
        <Button disabled={isLoading || !username}>確認する</Button>
        <Button
          type="button"
          disabled={isLoading || !username || resendButtonCountDown > 0}
          variant="secondary"
          onClick={() => void onResendButtonClick()}
        >
          確認コードを再送する
          {resendButtonCountDown > 0
            ? `（${resendButtonCountDown.toString()}秒）`
            : ''}
        </Button>
      </Field>
    </form>
  );
};
