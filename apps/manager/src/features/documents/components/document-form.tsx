'use client';

import Link from 'next/link';
import { useActionState } from 'react';
import type { DocumentActionState } from '../types';
import { Button } from '#src/components/ui/button';
import { Field, FieldTitle, FieldError } from '#src/components/ui/field';
import { Input } from '#src/components/ui/input';
import { Textarea } from '#src/components/ui/textarea';

interface Props {
  action: (
    prevState: DocumentActionState,
    formData: FormData,
  ) => Promise<DocumentActionState>;
  defaultValues?: { title: string; content: string };
  cancelHref: string;
}

export const DocumentForm = ({ action, defaultValues, cancelHref }: Props) => {
  const [state, formAction, isPending] = useActionState(action, null);

  return (
    <form action={formAction} className="flex flex-col gap-6">
      <Field data-invalid={!!state?.errors?.title}>
        <FieldTitle>タイトル</FieldTitle>
        <Input
          name="title"
          defaultValue={defaultValues?.title}
          placeholder="例: サービス概要"
        />
        {state?.errors?.title && (
          <FieldError
            errors={state.errors.title.map((m) => ({ message: m }))}
          />
        )}
      </Field>
      <Field data-invalid={!!state?.errors?.content}>
        <FieldTitle>本文</FieldTitle>
        <Textarea
          name="content"
          defaultValue={defaultValues?.content}
          placeholder="AIアシスタントが参照するテキストを入力してください"
          rows={10}
        />
        {state?.errors?.content && (
          <FieldError
            errors={state.errors.content.map((m) => ({ message: m }))}
          />
        )}
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
