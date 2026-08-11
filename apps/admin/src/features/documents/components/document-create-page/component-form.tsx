'use client';

import 'client-only';
import { zodResolver } from '@hookform/resolvers/zod';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { useState } from 'react';
import { Controller, useForm } from 'react-hook-form';
import { toast } from 'sonner';
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
import { cn } from '#src/lib/utils';

interface Props {
  projectId: string;
  className?: string | undefined;
}

export const ComponentForm = ({ projectId, className }: Props) => {
  const router = useRouter();

  const [isLoading, setIsLoading] = useState(false);

  const form = useForm<FormSchemaType>({
    resolver: zodResolver(FormSchema),
    defaultValues: {
      title: '',
      content: '',
    },
  });

  const onSubmit = async (data: FormSchemaType): Promise<void> => {
    setIsLoading(true);
    let response;
    try {
      response = await formAction(projectId, data);
    } catch (error) {
      console.warn(error);
      response = null;
    }
    if (response?.status === 'limit_exceeded') {
      toast.error('無料プランのドキュメント登録上限（5件）に達しました。', {
        action: {
          label: '課金ページへ',
          onClick: () => {
            router.push('/billing');
          },
        },
      });
      setIsLoading(false);
      return;
    }
    if (!response || response.status === 'error') {
      toast.error('ドキュメントの作成に失敗しました。');
      setIsLoading(false);
      return;
    }
    router.push(`/projects/${projectId}/documents`);
    toast.success('ドキュメントを作成しました。');
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
        <Button disabled={isLoading}>作成</Button>
      </Field>
    </form>
  );
};
