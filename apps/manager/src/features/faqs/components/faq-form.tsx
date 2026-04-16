'use client';

import Link from 'next/link';
import { useActionState } from 'react';
import type { FaqActionState } from '../types';
import { Button } from '#src/components/ui/button';
import { Field, FieldTitle, FieldError } from '#src/components/ui/field';
import { Input } from '#src/components/ui/input';
import { Textarea } from '#src/components/ui/textarea';

interface Props {
  action: (
    prevState: FaqActionState,
    formData: FormData,
  ) => Promise<FaqActionState>;
  defaultValues?: { question: string; answer: string };
  cancelHref: string;
}

export const FaqForm = ({ action, defaultValues, cancelHref }: Props) => {
  const [state, formAction, isPending] = useActionState(action, null);

  return (
    <form action={formAction} className="flex flex-col gap-6">
      <Field data-invalid={!!state?.errors?.question}>
        <FieldTitle>質問</FieldTitle>
        <Input
          name="question"
          defaultValue={defaultValues?.question}
          placeholder="例: 返品はできますか？"
        />
        {state?.errors?.question && (
          <FieldError
            errors={state.errors.question.map((m) => ({ message: m }))}
          />
        )}
      </Field>
      <Field data-invalid={!!state?.errors?.answer}>
        <FieldTitle>回答</FieldTitle>
        <Textarea
          name="answer"
          defaultValue={defaultValues?.answer}
          placeholder="質問への回答を入力してください"
          rows={6}
        />
        {state?.errors?.answer && (
          <FieldError
            errors={state.errors.answer.map((m) => ({ message: m }))}
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
