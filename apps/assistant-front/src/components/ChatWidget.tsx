import { useEffect, useRef, useState } from 'react';
import type { JSX } from 'react';

interface Message {
  role: 'user' | 'assistant';
  content: string;
}

interface ChatWidgetProps {
  bffUrl: string;
}

const ChatWidget = ({ bffUrl }: ChatWidgetProps): JSX.Element => {
  const [isOpen, setIsOpen] = useState(false);
  const [messages, setMessages] = useState<Message[]>([]);
  const [inputValue, setInputValue] = useState('');
  const [isStreaming, setIsStreaming] = useState(false);
  const [sessionId] = useState<string>(() => crypto.randomUUID());
  const messagesEndRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages]);

  const handleSend = (): void => {
    const trimmedInput = inputValue.trim();
    if (!trimmedInput || isStreaming) return;

    setInputValue('');
    setMessages((previous) => [
      ...previous,
      { role: 'user', content: trimmedInput },
      { role: 'assistant', content: '' },
    ]);
    setIsStreaming(true);

    const eventSource = new EventSource(`${bffUrl}/chat/${sessionId}`);

    const closeWithError = (message: string): void => {
      setMessages((previous) => {
        const updated = [...previous];
        const last = updated[updated.length - 1];
        if (last) last.content = message;
        return updated;
      });
      eventSource.close();
      setIsStreaming(false);
    };

    eventSource.addEventListener(
      'ready',
      () => {
        void fetch(`${bffUrl}/chat/${sessionId}`, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ message: trimmedInput }),
        }).catch(() => {
          closeWithError('Error: failed to send message');
        });
      },
      { once: true },
    );

    eventSource.addEventListener('text', (event) => {
      const parsed: unknown = JSON.parse(event.data as string);
      if (typeof parsed === 'object' && parsed !== null && 'chunk' in parsed) {
        setMessages((previous) => {
          const updated = [...previous];
          const last = updated[updated.length - 1];
          if (last)
            last.content += String((parsed as { chunk: unknown }).chunk);
          return updated;
        });
      }
    });

    eventSource.addEventListener('done', () => {
      eventSource.close();
      setIsStreaming(false);
    });

    eventSource.addEventListener('error', (event) => {
      const parsed: unknown = JSON.parse(
        (event as MessageEvent).data as string,
      );
      closeWithError(
        `Error: ${
          typeof parsed === 'object' && parsed !== null && 'error' in parsed
            ? String((parsed as { error: unknown }).error)
            : 'unknown error'
        }`,
      );
    });

    eventSource.onerror = () => {
      if (eventSource.readyState === EventSource.CLOSED) return;
      closeWithError('Error: connection failed');
    };
  };

  return (
    <div className="fixed right-4 bottom-4 flex flex-col items-end gap-2">
      {isOpen && (
        <div className="flex h-96 w-80 flex-col rounded-xl border border-gray-200 bg-white shadow-lg">
          <div className="flex items-center justify-between border-b border-gray-100 px-4 py-3">
            <span className="text-sm font-medium text-gray-800">
              AI Assistant
            </span>
            <button
              onClick={() => {
                setIsOpen(false);
              }}
              className="text-gray-400 hover:text-gray-600"
              aria-label="Close"
            >
              ✕
            </button>
          </div>

          <div className="flex-1 space-y-3 overflow-y-auto px-4 py-3">
            {messages.length === 0 && (
              <p className="text-center text-sm text-gray-400">
                何でも聞いてください
              </p>
            )}
            {messages.map((message, index) => (
              <div
                key={index}
                className={`flex ${message.role === 'user' ? 'justify-end' : 'justify-start'}`}
              >
                <span
                  className={`max-w-[85%] rounded-lg px-3 py-2 text-sm wrap-break-word whitespace-pre-wrap ${
                    message.role === 'user'
                      ? 'bg-blue-500 text-white'
                      : 'bg-gray-100 text-gray-800'
                  }`}
                >
                  {message.content}
                  {isStreaming &&
                    index === messages.length - 1 &&
                    message.role === 'assistant' && (
                      <span className="animate-pulse">▌</span>
                    )}
                </span>
              </div>
            ))}
            <div ref={messagesEndRef} />
          </div>

          <div className="flex gap-2 border-t border-gray-100 p-3">
            <input
              type="text"
              value={inputValue}
              onChange={(event) => {
                setInputValue(event.target.value);
              }}
              placeholder="メッセージを入力..."
              disabled={isStreaming}
              className="flex-1 rounded-lg border border-gray-200 px-3 py-2 text-sm outline-none focus:border-blue-400 disabled:opacity-50"
            />
            <button
              onClick={handleSend}
              disabled={isStreaming || !inputValue.trim()}
              className="rounded-lg bg-blue-500 px-3 py-2 text-sm text-white hover:bg-blue-600 disabled:opacity-50"
              aria-label="Send"
            >
              送信
            </button>
          </div>
        </div>
      )}

      <button
        onClick={() => {
          setIsOpen((previous) => !previous);
        }}
        className="flex h-12 w-12 items-center justify-center rounded-full bg-blue-500 text-white shadow-lg hover:bg-blue-600"
        aria-label="Toggle chat"
      >
        {isOpen ? '✕' : '💬'}
      </button>
    </div>
  );
};

export default ChatWidget;
