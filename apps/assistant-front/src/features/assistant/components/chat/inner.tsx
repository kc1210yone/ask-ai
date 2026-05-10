import { XIcon } from 'lucide-react';
import type { ReactNode } from 'react';
import { ChatForm } from './chat-form';
import { useChat } from './chat-provider/hook';

interface Props {
  assistantIsOpen: boolean;
  setAssistantIsOpen: (value: boolean) => void;
}

export const Inner = ({
  assistantIsOpen,
  setAssistantIsOpen,
}: Props): ReactNode => {
  const { messages } = useChat();

  if (!assistantIsOpen) {
    return null;
  }
  return (
    <div className="fixed right-8 bottom-8 border border-solid">
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
            {message.type}, {message.content}
          </div>
        ))}
      </div>
      <ChatForm />
    </div>
  );
};
