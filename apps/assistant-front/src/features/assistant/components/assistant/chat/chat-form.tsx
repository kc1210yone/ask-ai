'use no memo';

import { zodResolver } from '@hookform/resolvers/zod';
import { SendHorizontalIcon } from 'lucide-react';
import { type ReactNode, useState, type KeyboardEvent } from 'react';
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
  const { sendMessage, sendingDisabled } = useChat();

  const [error, setError] = useState<string | null>(null);

  const form = useForm<FormSchemaType>({
    resolver: zodResolver(FormSchema),
    defaultValues: {
      message: '',
    },
  });

  const onSubmit = async (data: FormSchemaType): Promise<void> => {
    setError(null);

    const result = await sendMessage(data.message);
    if (!result) {
      setError('送信に失敗しました。');
      return;
    }

    form.reset();
  };

  const onTextAreaKeyDown = async (
    event: KeyboardEvent<HTMLTextAreaElement>,
  ): Promise<void> => {
    const isSendKey = (event.ctrlKey || event.metaKey) && event.key === 'Enter';
    if (!isSendKey || sendingDisabled) {
      return;
    }
    await form.handleSubmit(onSubmit)();
  };

  return (
    <form
      onSubmit={(event) => void form.handleSubmit(onSubmit)(event)}
      className="border-t border-gray-100 p-3"
    >
      <div className="flex items-end gap-2">
        <textarea
          {...form.register('message')}
          placeholder="AIに質問しましょう。"
          rows={2}
          className="flex-1 resize-none rounded-lg border border-gray-200 px-3 py-2 text-sm outline-none focus:border-blue-400 disabled:opacity-50"
          onKeyDown={(event) => void onTextAreaKeyDown(event)}
        />
        <button
          className="rounded-lg bg-blue-500 p-2 text-white transition enabled:hover:bg-blue-600 disabled:opacity-50"
          disabled={sendingDisabled}
        >
          <SendHorizontalIcon size={18} />
        </button>
      </div>
      {form.formState.errors.message && (
        <p className="mt-1 text-xs text-red-500">
          {form.formState.errors.message.message}
        </p>
      )}
      {error && <p className="mt-1 text-xs text-red-500">{error}</p>}
    </form>
  );
};
