import { z } from 'zod';

export const FormSchema = z.object({
  name: z
    .string()
    .min(1, 'プロジェクト名を入力してください。')
    .max(100, '100文字以内で入力してください。'),
});
export type FormSchemaType = z.infer<typeof FormSchema>;
