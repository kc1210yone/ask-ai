'use client';

import Link from 'next/link';
import { useActionState } from 'react';
import type { ProjectActionState } from '../types';
import { Button } from '#src/components/ui/button';
import { Field, FieldTitle, FieldError } from '#src/components/ui/field';
import { Input } from '#src/components/ui/input';

interface Props {
  action: (
    prevState: ProjectActionState,
    formData: FormData,
  ) => Promise<ProjectActionState>;
  defaultValues?: { name: string };
  cancelHref: string;
}

export const ProjectForm = ({ action, defaultValues, cancelHref }: Props) => {
  const [state, formAction, isPending] = useActionState(action, null);

  return (
    <form action={formAction} className="flex flex-col gap-6">
      <Field data-invalid={!!state?.errors?.name}>
        <FieldTitle>プロジェクト名</FieldTitle>
        <Input
          name="name"
          defaultValue={defaultValues?.name}
          placeholder="例: コーポレートサイト"
        />
        {state?.errors?.name && (
          <FieldError errors={state.errors.name.map((m) => ({ message: m }))} />
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
