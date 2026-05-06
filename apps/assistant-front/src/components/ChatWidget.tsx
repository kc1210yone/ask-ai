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
  const [sessionId, setSessionId] = useState<string>(() => crypto.randomUUID());
  const messagesEndRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages]);

  const handleSend = async (): Promise<void> => {
    const trimmedInput = inputValue.trim();
    if (!trimmedInput || isStreaming) return;

    setInputValue('');
    setMessages((previous) => [
      ...previous,
      { role: 'user', content: trimmedInput },
      { role: 'assistant', content: '' },
    ]);
    setIsStreaming(true);

    try {
      const postResponse = await fetch(`${bffUrl}/chat`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          message: trimmedInput,
          sessionId: sessionId,
        }),
      });

      if (!postResponse.ok) {
        const errorBody = await postResponse.text().catch(() => '');
        setMessages((previous) => {
          const updated = [...previous];
          const last = updated[updated.length - 1];
          if (last)
            last.content = `Error: ${postResponse.status.toString()} ${errorBody}`;
          return updated;
        });
        setIsStreaming(false);
        return;
      }

      const responseBody: unknown = await postResponse.json();
      if (
        typeof responseBody !== 'object' ||
        responseBody === null ||
        !('streamId' in responseBody)
      ) {
        setMessages((previous) => {
          const updated = [...previous];
          const last = updated[updated.length - 1];
          if (last) last.content = 'Error: invalid server response';
          return updated;
        });
        setIsStreaming(false);
        return;
      }

      const streamId = String((responseBody as { streamId: unknown }).streamId);
      const eventSource = new EventSource(
        `${bffUrl}/chat?streamId=${streamId}`,
      );

      eventSource.addEventListener('text', (event) => {
        const parsed: unknown = JSON.parse(event.data as string);
        if (
          typeof parsed === 'object' &&
          parsed !== null &&
          'chunk' in parsed
        ) {
          setMessages((previous) => {
            const updated = [...previous];
            const last = updated[updated.length - 1];
            if (last)
              last.content += String((parsed as { chunk: unknown }).chunk);
            return updated;
          });
        }
      });

      eventSource.addEventListener('done', (event) => {
        console.log('donedonedone');
        console.log(event.data, typeof event.data, event.data === '');
        eventSource.close();
        setIsStreaming(false);
      });

      eventSource.addEventListener('error', (event) => {
        console.log(event);
        // console.log(event as MessageEvent).data as string);
        // setMessages((previous) => {
        //   const updated = [...previous];
        //   const last = updated[updated.length - 1];
        //   if (last) {
        //     last.content = `Error: ${
        //       typeof parsed === 'object' && parsed !== null && 'error' in parsed
        //         ? String((parsed as { error: unknown }).error)
        //         : 'unknown error'
        //     }`;
        //   }
        //   return updated;
        // });
        eventSource.close();
        setIsStreaming(false);
      });

      eventSource.onerror = () => {
        if (eventSource.readyState === EventSource.CLOSED) return;
        setMessages((previous) => {
          const updated = [...previous];
          const last = updated[updated.length - 1];
          if (last) last.content = 'Error: connection failed';
          return updated;
        });
        eventSource.close();
        setIsStreaming(false);
      };
    } catch {
      setMessages((previous) => {
        const updated = [...previous];
        const last = updated[updated.length - 1];
        if (last) last.content = 'Error: connection failed';
        return updated;
      });
      setIsStreaming(false);
    }
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
              onClick={() => void handleSend()}
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
