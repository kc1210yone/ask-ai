import { useEffect, useRef, type ReactNode } from 'react';
import { cn } from 'tailwind-variants';
import { useChat } from './chat-provider/hook';

export const ChatMessages = (): ReactNode => {
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

  return (
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
  );
};
