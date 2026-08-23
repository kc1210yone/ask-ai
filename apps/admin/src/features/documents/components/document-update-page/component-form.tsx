'use client';

import 'client-only';
import { zodResolver } from '@hookform/resolvers/zod';
import type { Document } from '@internal/rdb/generated/prisma/client.js';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { useState } from 'react';
import { Controller, useForm } from 'react-hook-form';
import { toast } from 'sonner';
import { DeleteButtonWrapper } from '../delete-button-wrapper';
import { formAction } from './actions';
import { FormSchema, type FormSchemaType } from './types';
import { Button } from '#src/components/ui/button';
import {
  Field,
  FieldDescription,
  FieldError,
  FieldLabel,
} from '#src/components/ui/field';
import { Input } from '#src/components/ui/input';
import { Textarea } from '#src/components/ui/textarea';
import { cn } from '#src/lib/ui-utils';

interface Props {
  projectId: string;
  document: Document;
  className?: string | undefined;
}

export const ComponentForm = ({ projectId, document, className }: Props) => {
  const router = useRouter();

  const [isLoading, setIsLoading] = useState(false);

  const form = useForm<FormSchemaType>({
    resolver: zodResolver(FormSchema),
    defaultValues: {
      title: document.title,
      content: document.content,
    },
  });

  const onSubmit = async (data: FormSchemaType): Promise<void> => {
    setIsLoading(true);
    let response;
    try {
      response = await formAction(projectId, document.id, data);
    } catch (error) {
      console.warn(error);
      response = null;
    }
    if (!response || response.status === 'error') {
      toast.error('ドキュメントの更新に失敗しました。');
      setIsLoading(false);
      return;
    }
    router.push(`/projects/${projectId}/documents`);
    toast.success('ドキュメントを更新しました。');
  };

  const preDelete = (): void => {
    setIsLoading(true);
  };

  const postDelete = (status: 'ok' | 'error'): void => {
    if (status === 'error') {
      toast.error('ドキュメントの削除に失敗しました。');
      setIsLoading(false);
      return;
    }
    router.push(`/projects/${projectId}/documents`);
    toast.success('ドキュメントを削除しました。');
  };

  return (
    <form
      onSubmit={(event) => void form.handleSubmit(onSubmit)(event)}
      className={cn('flex flex-col gap-4', className)}
    >
      <Controller
        name="title"
        control={form.control}
        render={({ field, fieldState }) => (
          <Field data-invalid={fieldState.invalid}>
            <FieldLabel htmlFor={field.name}>タイトル</FieldLabel>
            <Input
              {...field}
              id={field.name}
              aria-invalid={fieldState.invalid}
              placeholder="プロダクトの説明"
            />
            <FieldDescription>
              ドキュメントを探しやすくするためのタイトルです。AIアシスタントはタイトルは参照しません。
            </FieldDescription>
            {fieldState.invalid && <FieldError errors={[fieldState.error]} />}
          </Field>
        )}
      />
      <Controller
        name="content"
        control={form.control}
        render={({ field, fieldState }) => (
          <Field data-invalid={fieldState.invalid}>
            <FieldLabel htmlFor={field.name}>内容</FieldLabel>
            <Textarea
              {...field}
              id={field.name}
              aria-invalid={fieldState.invalid}
              placeholder="このプロダクトは、誰でも簡単にウェブサイトにAIアシスタントを設置できるサービスです。"
              className="h-50"
            />
            <FieldDescription>
              AIアシスタントに読み込ませたい内容を入力してください。
            </FieldDescription>
            {fieldState.invalid && <FieldError errors={[fieldState.error]} />}
          </Field>
        )}
      />
      <Field orientation="horizontal">
        <Button variant="secondary" asChild>
          <Link href={`/projects/${projectId}/documents`}>キャンセル</Link>
        </Button>
        <DeleteButtonWrapper
          projectId={projectId}
          documentId={document.id}
          preDelete={preDelete}
          postDelete={postDelete}
        >
          <Button disabled={isLoading} type="button" variant="destructive">
            削除
          </Button>
        </DeleteButtonWrapper>
        <Button disabled={isLoading}>更新</Button>
      </Field>
    </form>
  );
};
