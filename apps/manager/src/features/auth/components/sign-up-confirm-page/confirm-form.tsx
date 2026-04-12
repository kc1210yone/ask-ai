'use client';

import { zodResolver } from '@hookform/resolvers/zod';
import { autoSignIn, confirmSignUp } from 'aws-amplify/auth';
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

  const autoSignInWrapper = async (): Promise<void> => {
    setIsLoading(true);
    let result;
    try {
      result = await autoSignIn();
    } catch (e) {
      invariant(e instanceof Error);
      toast.error(e.message);
      return;
    } finally {
      setIsLoading(false);
    }

    switch (result.nextStep.signInStep) {
      case 'DONE':
        router.push('/');
        break;
      default:
        throw new Error('Unexpected signInStep.');
    }
  };

  const onSubmit = async (data: FormSchemaType): Promise<void> => {
    setIsLoading(true);
    let result;
    try {
      result = await confirmSignUp({
        username: '', // TODO
        confirmationCode: data.code,
      });
    } catch (e) {
      invariant(e instanceof Error);
      toast.error(e.message);
      return;
    } finally {
      setIsLoading(false);
    }

    switch (result.nextStep.signUpStep) {
      case 'DONE':
        router.push('/');
        break;
      case 'COMPLETE_AUTO_SIGN_IN':
        await autoSignInWrapper();
        break;
      default:
        throw new Error('Unexpected signUpStep.');
    }
  };

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
      <div className="rounded-lg bg-blue-50 px-4 py-3 text-sm text-blue-700">
        <strong>{'TODO'}</strong> に確認コードを送信しました。
      </div>
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
              autoComplete="one-time-code"
              inputMode="numeric"
              maxLength={6}
            />
            {fieldState.invalid && <FieldError errors={[fieldState.error]} />}
          </Field>
        )}
      />
      <Field>
        <Button disabled={isLoading}>確認する</Button>
      </Field>
    </form>
  );
};
