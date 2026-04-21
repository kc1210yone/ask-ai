import { z } from 'zod';

export const CreateDocumentRequestSchema = z.object({
  title: z.string().min(1, 'タイトルを入力してください。'),
  content: z.string().min(1, '本文を入力してください。'),
});
export type CreateDocumentRequest = z.infer<typeof CreateDocumentRequestSchema>;

export interface CreateDocumentResponse {
  status: 'ok' | 'error';
  errorMessage: string | null;
}
