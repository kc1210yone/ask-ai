'use client';

import { zodResolver } from '@hookform/resolvers/zod';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { useState } from 'react';
import { Controller, useForm } from 'react-hook-form';
import { toast } from 'sonner';
import { DeleteButtonWrapper } from '../delete-button-wrapper';
import { formAction } from './actions';
import { FormSchema, type FormSchemaType } from './types';
import type { Faq } from '#src/generated/prisma/client';
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
  faq: Faq;
  className?: string | undefined;
}

export const UpdateForm = ({ projectId, faq, className }: Props) => {
  const router = useRouter();

  const [isLoading, setIsLoading] = useState(false);

  const form = useForm<FormSchemaType>({
    resolver: zodResolver(FormSchema),
    defaultValues: {
      question: faq.question,
      answer: faq.answer,
    },
  });

  const onSubmit = async (data: FormSchemaType): Promise<void> => {
    setIsLoading(true);
    const response = await formAction(projectId, faq.id, data);
    if (response.status === 'error') {
      toast.error('FAQの更新に失敗しました。');
      setIsLoading(false);
      return;
    }
    router.push(`/projects/${projectId}/faqs`);
    toast.success('FAQを更新しました。');
  };

  const preDelete = (): void => {
    setIsLoading(true);
  };

  const postDelete = (status: 'ok' | 'error'): void => {
    if (status === 'error') {
      toast.error('FAQの削除に失敗しました。');
      setIsLoading(false);
      return;
    }
    router.push(`/projects/${projectId}/faqs`);
    toast.success('FAQを削除しました。');
  };

  return (
    <form
      onSubmit={(event) => void form.handleSubmit(onSubmit)(event)}
      className={cn('flex flex-col gap-4', className)}
    >
      <Controller
        name="question"
        control={form.control}
        render={({ field, fieldState }) => (
          <Field data-invalid={fieldState.invalid}>
            <FieldLabel htmlFor={field.name}>質問</FieldLabel>
            <Input
              {...field}
              id={field.name}
              aria-invalid={fieldState.invalid}
              placeholder="AIアシスタントはどうやってサイトに設置しますか？"
            />
            <FieldDescription>
              AIアシスタントに認識させるQ&AのQの部分です。ユーザーからの想定質問を入力します。
            </FieldDescription>
            {fieldState.invalid && <FieldError errors={[fieldState.error]} />}
          </Field>
        )}
      />
      <Controller
        name="answer"
        control={form.control}
        render={({ field, fieldState }) => (
          <Field data-invalid={fieldState.invalid}>
            <FieldLabel htmlFor={field.name}>回答</FieldLabel>
            <Textarea
              {...field}
              id={field.name}
              aria-invalid={fieldState.invalid}
              placeholder="管理画面から取得できる短いコードをサイトのソースコードに貼り付けるだけでAIアシスタントを設置できます。"
              className="h-50"
            />
            <FieldDescription>
              AIアシスタントに認識させるQ&AのAの部分です。ユーザーからの想定質問への回答を入力します。
            </FieldDescription>
            {fieldState.invalid && <FieldError errors={[fieldState.error]} />}
          </Field>
        )}
      />
      <Field orientation="horizontal">
        <Button variant="secondary" asChild>
          <Link href={`/projects/${projectId}/faqs`}>キャンセル</Link>
        </Button>
        <DeleteButtonWrapper
          projectId={projectId}
          faqId={faq.id}
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
