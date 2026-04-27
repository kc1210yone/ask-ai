'use client';

import { zodResolver } from '@hookform/resolvers/zod';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { useState } from 'react';
import { Controller, useForm } from 'react-hook-form';
import { toast } from 'sonner';
import { formAction } from './actions';
import { FormSchema, type FormSchemaType } from './types';
import type { Document } from '#src/generated/prisma/client';
import { Button } from '#src/components/ui/button';
import {
  Field,
  FieldDescription,
  FieldError,
  FieldLabel,
} from '#src/components/ui/field';
import { Input } from '#src/components/ui/input';
import { Textarea } from '#src/components/ui/textarea';
import { cn } from '#src/lib/utils';

interface Props {
  projectId: string;
  document: Document;
  className?: string | undefined;
}

export const UpdateForm = ({ projectId, document, className }: Props) => {
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
    const response = await formAction(projectId, document.id, data);
    if (response.status === 'error') {
      toast.error('ドキュメントの更新に失敗しました。');
      setIsLoading(false);
      return;
    }
    router.push(`/projects/${projectId}/documents`);
    toast.success('ドキュメントを更新しました。');
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
        <Button disabled={isLoading}>更新</Button>
        <Button variant="secondary" asChild>
          <Link href={`/projects/${projectId}/documents`}>キャンセル</Link>
        </Button>
        <Button variant="destructive" asChild>
          <Link
            // TODO
            href={`/projects/${projectId}/documents`}
          >
            削除
          </Link>
        </Button>
      </Field>
    </form>
  );
};
