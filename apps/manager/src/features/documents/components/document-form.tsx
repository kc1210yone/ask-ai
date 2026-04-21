'use client';

import Link from 'next/link';
import { useActionState } from 'react';
import type { CreateDocumentResponse } from '../types/create-document';
import { Button } from '#src/components/ui/button';
import { Field, FieldTitle, FieldError } from '#src/components/ui/field';
import { Input } from '#src/components/ui/input';
import { Textarea } from '#src/components/ui/textarea';

interface Props {
  action: (
    prevState: CreateDocumentResponse,
    formData: FormData,
  ) => Promise<CreateDocumentResponse>;
  defaultValues?: { title: string; content: string };
  cancelHref: string;
}

export const DocumentForm = ({ action, defaultValues, cancelHref }: Props) => {
  // eslint-disable-next-line @typescript-eslint/no-unsafe-argument, @typescript-eslint/no-explicit-any
  const [state, formAction, isPending] = useActionState(action as any, null);
  console.log(state);

  const falseValue = new Date().getTime() < 0;
  return (
    <form action={formAction} className="flex flex-col gap-6">
      <Field data-invalid={false}>
        <FieldTitle>タイトル</FieldTitle>
        <Input
          name="title"
          defaultValue={defaultValues?.title}
          placeholder="例: サービス概要"
        />
        {falseValue && <FieldError errors={[]} />}
      </Field>
      <Field data-invalid={false}>
        <FieldTitle>本文</FieldTitle>
        <Textarea
          name="content"
          defaultValue={defaultValues?.content}
          placeholder="AIアシスタントが参照するテキストを入力してください"
          rows={10}
        />
        {falseValue && <FieldError errors={[]} />}
      </Field>
      <div className="flex gap-3">
        <Button type="submit" disabled={isPending}>
          {isPending ? '保存中...' : '保存'}
        </Button>
        <Button type="button" variant="outline" asChild>
          <Link href={cancelHref}>キャンセル</Link>
        </Button>
      </div>
    </form>
  );
};
