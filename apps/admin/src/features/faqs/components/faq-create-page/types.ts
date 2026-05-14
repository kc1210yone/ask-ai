import { z } from 'zod';

export const FormSchema = z.object({
  question: z
    .string()
    .min(1, 'FAQの質問を入力してください。')
    .max(100, '100文字以内で入力してください。'),
  answer: z
    .string()
    .min(1, 'FAQの回答を入力してください。')
    .max(1000, '1,000文字以内で入力してください。'),
});
export type FormSchemaType = z.infer<typeof FormSchema>;
