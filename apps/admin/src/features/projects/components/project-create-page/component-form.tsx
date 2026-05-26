'use client';

import 'client-only';
import { zodResolver } from '@hookform/resolvers/zod';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { useState } from 'react';
import { Controller, useForm } from 'react-hook-form';
import { toast } from 'sonner';
import invariant from 'tiny-invariant';
import { formAction } from './actions';
import { FormSchema, type FormSchemaType } from './types';
import { Button } from '#src/components/ui/button';
import { Field, FieldError, FieldLabel } from '#src/components/ui/field';
import { Input } from '#src/components/ui/input';
import { cn } from '#src/lib/utils';

interface Props {
  className?: string | undefined;
}

export const ComponentForm = ({ className }: Props) => {
  const router = useRouter();

  const [isLoading, setIsLoading] = useState(false);

  const form = useForm<FormSchemaType>({
    resolver: zodResolver(FormSchema),
    defaultValues: {
      name: '',
    },
  });

  const onSubmit = async (data: FormSchemaType): Promise<void> => {
    setIsLoading(true);
    let response;
    try {
      response = await formAction(data);
    } catch (error) {
      console.warn(error);
      response = null;
    }
    if (!response || response.status === 'error') {
      toast.error('プロジェクトの作成に失敗しました。');
      setIsLoading(false);
      return;
    }
    invariant(response.projectId);
    router.push(`/projects/${response.projectId}/dashboard`);
    toast.success('プロジェクトを作成しました。');
  };

  return (
    <form
      onSubmit={(event) => void form.handleSubmit(onSubmit)(event)}
      className={cn('flex flex-col gap-4', className)}
    >
      <Controller
        name="name"
        control={form.control}
        render={({ field, fieldState }) => (
          <Field data-invalid={fieldState.invalid}>
            <FieldLabel htmlFor={field.name}>プロジェクト名</FieldLabel>
            <Input
              {...field}
              id={field.name}
              aria-invalid={fieldState.invalid}
              placeholder="会社のウェブサイト"
            />
            {fieldState.invalid && <FieldError errors={[fieldState.error]} />}
          </Field>
        )}
      />
      <Field orientation="horizontal">
        <Button variant="secondary" asChild>
          <Link href="/">キャンセル</Link>
        </Button>
        <Button disabled={isLoading}>作成</Button>
      </Field>
    </form>
  );
};
