'use client';

import { zodResolver } from '@hookform/resolvers/zod';
import Link from 'next/link';
import { Controller, useForm } from 'react-hook-form';
import { z } from 'zod';
import { Button } from '#src/components/ui/button';
import { Field, FieldError, FieldLabel } from '#src/components/ui/field';
import { Input } from '#src/components/ui/input';
import { cn } from '#src/lib/utils';

interface Props {
  className?: string | undefined;
}

const FormSchema = z.object({
  name: z.string().min(1, 'プロジェクト名を入力してください。'),
});
type FormSchemaType = z.infer<typeof FormSchema>;

export const CreateForm = ({ className }: Props) => {
  const form = useForm<FormSchemaType>({
    resolver: zodResolver(FormSchema),
    defaultValues: {
      name: '',
    },
  });

  const onSubmit = async (data: FormSchemaType): Promise<void> => {
    await new Promise((resolve) => setTimeout(resolve, 1000));
    console.log(data);
  };

  return (
    <form
      onSubmit={(event) => void form.handleSubmit(onSubmit)(event)}
      className={cn('flex w-full flex-col gap-4', className)}
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
        <Button disabled={false}>ログイン</Button>
        <Button variant="secondary" asChild disabled={false}>
          <Link href="/">キャンセル</Link>
        </Button>
      </Field>
    </form>
  );
};
