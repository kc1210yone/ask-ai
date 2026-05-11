'use no memo';

import { zodResolver } from '@hookform/resolvers/zod';
import { SendHorizontalIcon } from 'lucide-react';
import { type ReactNode, useState } from 'react';
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

  const [sendError, setSendError] = useState(false);

  const form = useForm<FormSchemaType>({
    resolver: zodResolver(FormSchema),
    defaultValues: {
      message: '',
    },
  });

  const onSubmit = async (data: FormSchemaType): Promise<void> => {
    const result = await sendMessage(data.message);
    if (!result) {
      setSendError(true);
      return;
    }
    setSendError(false);
    form.reset();
  };

  return (
    <form
      onSubmit={(event) => void form.handleSubmit(onSubmit)(event)}
      className="flex flex-col gap-1 border-t border-gray-100 p-3"
    >
      <div className="flex items-end gap-2">
        <textarea
          {...form.register('message')}
          placeholder="AIに質問しましょう。"
          rows={2}
          className="w-full flex-1 resize-none rounded-lg border border-gray-200 px-3 py-2 text-sm outline-none focus:border-blue-400 disabled:opacity-50"
        />
        <button
          className="shrink-0 rounded-lg bg-blue-500 p-2 text-white transition-colors enabled:hover:bg-blue-600 disabled:opacity-50"
          disabled={sendingDisabled}
        >
          <SendHorizontalIcon size={18} />
        </button>
      </div>
      {form.formState.errors.message && (
        <p className="px-1 text-xs text-red-500">
          {form.formState.errors.message.message}
        </p>
      )}
      {sendError && (
        <p className="px-1 text-xs text-red-500">送信に失敗しました。</p>
      )}
    </form>
  );
};

/*
<div className="flex h-96 w-80 flex-col rounded-xl border border-gray-200 bg-white shadow-lg">
  <div className="flex gap-2 border-t border-gray-100 p-3">
  </div>
</div>
 */
