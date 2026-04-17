import { z } from 'zod';

export const UpdateDocumentRequestSchema = z.object({
  title: z.string().min(1, 'タイトルを入力してください。'),
  content: z.string().min(1, '本文を入力してください。'),
});
export type UpdateDocumentRequest = z.infer<typeof UpdateDocumentRequestSchema>;

export interface UpdateDocumentResponse {
  status: 'ok' | 'error';
  errorMessage: string | null;
}
