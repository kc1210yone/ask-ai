import { z } from 'zod';

export const DocumentFormSchema = z.object({
  title: z.string().min(1, 'タイトルを入力してください'),
  content: z.string().min(1, '本文を入力してください'),
});

export type DocumentFormValues = z.infer<typeof DocumentFormSchema>;

export type DocumentActionState = {
  errors?: {
    title?: string[];
    content?: string[];
  };
  message?: string;
} | null;
