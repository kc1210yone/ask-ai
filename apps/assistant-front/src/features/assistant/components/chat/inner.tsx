import { zodResolver } from '@hookform/resolvers/zod';
import { XIcon } from 'lucide-react';
import type { ReactNode } from 'react';
import { useForm } from 'react-hook-form';
import { z } from 'zod';
import { useChat } from './chat-provider/hook';

const contactSchema = z.object({
  name: z
    .string()
    .min(2, { message: 'お名前は2文字以上で入力してください' })
    .max(50, { message: 'お名前は50文字以内で入力してください' }),
  email: z
    .string()
    .email({ message: '有効なメールアドレスを入力してください' }),
  message: z
    .string()
    .min(10, { message: 'お問い合わせ内容は10文字以上で入力してください' })
    .max(1000, { message: 'お問い合わせ内容は1000文字以内で入力してください' }),
});
type ContactFormValues = z.infer<typeof contactSchema>;

interface Props {
  assistantIsOpen: boolean;
  setAssistantIsOpen: (value: boolean) => void;
}

export const Inner = ({
  assistantIsOpen,
  setAssistantIsOpen,
}: Props): ReactNode => {
  const form = useForm<ContactFormValues>({
    resolver: zodResolver(contactSchema),
    defaultValues: {
      name: '',
      email: '',
      message: '',
    },
  });

  const { messages, sendMessage } = useChat();
  console.log(sendMessage);

  const onSubmit = async (data: ContactFormValues): Promise<void> => {
    const inputMessage = formData.get('input-message');
    console.log(inputMessage);
  };

  if (!assistantIsOpen) {
    return null;
  }
  return (
    <div className="fixed right-8 bottom-8">
      <div>
        <button
          onClick={() => {
            setAssistantIsOpen(false);
          }}
        >
          <XIcon />
        </button>
      </div>
      <div>
        {messages.map((message, index) => (
          <div key={index}>
            {message.from}, {message.type}, {message.content}
          </div>
        ))}
      </div>
      <form onSubmit={form.handleSubmit(onSubmit)}>
        <input
          {...form.register('name')}
          name="input-message"
          placeholder="Input your Name"
        />
        {form.formState.errors.name && (
          <p>{form.formState.errors.name.message}</p>
        )}
        <button>送信</button>
      </form>
    </div>
  );
};
