import { z } from 'zod';

export const FormSchema = z.object({
  title: z.string().min(1, 'ドキュメントのタイトルを入力してください。'),
  content: z.string().min(1, 'ドキュメントの内容を入力してください。'),
});
export type FormSchemaType = z.infer<typeof FormSchema>;
