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
      question: '',
      answer: '',
    },
  });

  const onSubmit = async (data: FormSchemaType): Promise<void> => {
    setIsLoading(true);
    let status: 'ok' | 'error';
    try {
      const response = await formAction(projectId, data);
      status = response.status;
    } catch {
      status = 'error';
    }
    if (status === 'error') {
      toast.error('FAQの作成に失敗しました。');
      setIsLoading(false);
      return;
    }
    router.push(`/projects/${projectId}/faqs`);
    toast.success('FAQを作成しました。');
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
        <Button disabled={isLoading}>作成</Button>
      </Field>
    </form>
  );
};
