'use client';

import 'client-only';
import { zodResolver } from '@hookform/resolvers/zod';
import type { Project } from '@internal/rdb/generated/prisma/client.js';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { useState } from 'react';
import { Controller, useForm } from 'react-hook-form';
import { toast } from 'sonner';
import { formAction } from './actions';
import { FormSchema, type FormSchemaType } from './types';
import { Button } from '#src/components/ui/button';
import { Field, FieldError, FieldLabel } from '#src/components/ui/field';
import { Input } from '#src/components/ui/input';
import { cn } from '#src/lib/ui-utils';

interface Props {
  project: Project;
  className?: string | undefined;
}

export const ComponentForm = ({ project, className }: Props) => {
  const router = useRouter();

  const [isLoading, setIsLoading] = useState(false);

  const form = useForm<FormSchemaType>({
    resolver: zodResolver(FormSchema),
    defaultValues: {
      name: project.name,
    },
  });

  const onSubmit = async (data: FormSchemaType): Promise<void> => {
    setIsLoading(true);
    let response;
    try {
      response = await formAction(project.id, data);
    } catch (error) {
      console.warn(error);
      response = null;
    }
    if (!response || response.status === 'error') {
      toast.error('プロジェクトの更新に失敗しました。');
      setIsLoading(false);
      return;
    }
    router.push(`/projects/${project.id}/dashboard`);
    toast.success('プロジェクトを更新しました。');
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
          <Link href={`/projects/${project.id}/dashboard`}>キャンセル</Link>
        </Button>
        <Button disabled={isLoading}>変更</Button>
      </Field>
    </form>
  );
};
