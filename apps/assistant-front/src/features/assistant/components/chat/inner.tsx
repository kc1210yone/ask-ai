import { XIcon } from 'lucide-react';
import { useEffect, useRef, type ReactNode } from 'react';
import { cn } from 'tailwind-variants';
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

  const messagesRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const element = messagesRef.current;
    if (!element) {
      return;
    }
    element.scrollTo({
      top: element.scrollHeight - element.clientHeight,
      behavior: 'smooth',
    });
  }, [messages.length]);

  if (!assistantIsOpen) {
    return null;
  }
  return (
    <div className="fixed right-8 bottom-8 flex h-96 w-80 flex-col rounded-xl border border-solid border-gray-200 bg-white">
      <div className="flex items-center justify-between border-b border-gray-100 px-4 py-3">
        <span className="text-sm font-semibold text-gray-800">
          AIアシスタント
        </span>
        <button
          className="text-gray-400 hover:text-gray-600"
          onClick={() => {
            setAssistantIsOpen(false);
          }}
        >
          <XIcon />
        </button>
      </div>

      <div
        className="flex flex-1 flex-col gap-3 overflow-y-auto px-4 py-3"
        ref={messagesRef}
      >
        {messages.length === 0 && (
          <p className="text-center text-sm text-gray-400">
            会話履歴はありません。
          </p>
        )}
        {messages.map((message, index) => (
          <p
            key={index}
            className={cn(
              'max-w-[85%] rounded-lg px-3 py-2 text-sm wrap-break-word whitespace-pre-wrap',
              message.type === 'user'
                ? 'self-end bg-blue-500 text-white'
                : 'self-start bg-gray-100 text-gray-800',
            )}
          >
            {message.content}
            {message.type === 'assistant-receiving' && '…'}
            {message.type === 'assistant-error' && '（受信に失敗しました。）'}
          </p>
        ))}
      </div>

      <ChatForm />
    </div>
  );
};
