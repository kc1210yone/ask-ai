import { XIcon } from 'lucide-react';
import type { ReactNode } from 'react';

interface Props {
  assistantIsOpen: boolean;
  setAssistantIsOpen: (value: boolean) => void;
}

export const Inner = ({
  assistantIsOpen,
  setAssistantIsOpen,
}: Props): ReactNode => {
  const { messages, sendMessage } = useChat();

  const onSubmit = async (): Promise<void> => {
    await sendMessage();
  };

  if (!assistantIsOpen) {
    return null;
  }
  return (
    <div className="fixed right-8 bottom-8">
      <button
        onClick={() => {
          setAssistantIsOpen(false);
        }}
      >
        <XIcon />
      </button>
      <div>
        {messages.map((message, index) => (
          <div key={index}>
            {message.from}, {message.type}, {message.content}
          </div>
        ))}
      </div>
      <form action={onSubmit}>
        <input />
        <button>送信</button>
      </form>
    </div>
  );
};
