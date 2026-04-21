import { z } from 'zod';

export const FaqFormSchema = z.object({
  question: z.string().min(1, '質問を入力してください'),
  answer: z.string().min(1, '回答を入力してください'),
});

export type FaqFormValues = z.infer<typeof FaqFormSchema>;

export type FaqActionState = {
  errors?: {
    question?: string[];
    answer?: string[];
  };
  message?: string;
} | null;
