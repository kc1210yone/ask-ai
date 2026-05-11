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
    form.reset();
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

/*
<div className="flex h-96 w-80 flex-col rounded-xl border border-gray-200 bg-white shadow-lg">
  <div className="flex gap-2 border-t border-gray-100 p-3">
    <input
      type="text"
      value={inputValue}
      onChange={(event) => {
        onInputChange(event.target.value);
      }}
      placeholder="メッセージを入力..."
      disabled={isStreaming}
      className="flex-1 rounded-lg border border-gray-200 px-3 py-2 text-sm outline-none focus:border-blue-400 disabled:opacity-50"
    />
    <button
      onClick={onSend}
      disabled={isStreaming || !inputValue.trim()}
      className="rounded-lg bg-blue-500 px-3 py-2 text-sm text-white hover:bg-blue-600 disabled:opacity-50"
      aria-label="Send"
    >
      送信
    </button>
  </div>
</div>
 */
