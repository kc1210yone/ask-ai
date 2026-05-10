import { zodResolver } from '@hookform/resolvers/zod';
import type { ReactNode } from 'react';
import { useForm } from 'react-hook-form';
import { z } from 'zod';
import { useChat } from './chat-provider/hook';

const FormSchema = z.object({
  message: z
    .string()
    .min(1, { message: 'テキストを入力してください。' })
    .max(300, { message: '300文字以内で入力してください。' }),
});
type FormSchemaType = z.infer<typeof FormSchema>;

export const ChatForm = (): ReactNode => {
  const { sendMessage } = useChat();

  const form = useForm<FormSchemaType>({
    resolver: zodResolver(FormSchema),
    defaultValues: {
      message: '',
    },
  });

  const onSubmit = async (data: FormSchemaType): Promise<void> => {
    await sendMessage(data.message);
  };

  return (
    <form onSubmit={(event) => void form.handleSubmit(onSubmit)(event)}>
      <textarea
        {...form.register('message')}
        placeholder="AIに質問しましょう。"
        rows={2}
      />
      {form.formState.errors.message && (
        <p>{form.formState.errors.message.message}</p>
      )}
      <button>送信</button>
    </form>
  );
};
