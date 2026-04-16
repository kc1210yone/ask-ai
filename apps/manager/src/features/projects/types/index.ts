import { z } from 'zod';

export const ProjectFormSchema = z.object({
  name: z.string().min(1, 'プロジェクト名を入力してください'),
});

export type ProjectFormValues = z.infer<typeof ProjectFormSchema>;

export type ProjectActionState = {
  errors?: {
    name?: string[];
  };
  message?: string;
} | null;
