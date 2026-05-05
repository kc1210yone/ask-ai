import { useEffect, useRef, useState } from 'react';
import type { JSX } from 'react';

interface Message {
  role: 'user' | 'assistant';
  content: string;
}

type SseEvent =
  | { type: 'text'; chunk: string }
  | { type: 'done'; sessionId: string }
  | { type: 'error'; error: string };

const parseSseSegment = (segment: string): SseEvent | null => {
  const lines = segment.split('\n');
  let eventType = '';
  let dataLine = '';

  for (const line of lines) {
    if (line.startsWith('event: ')) {
      eventType = line.slice('event: '.length).trim();
    } else if (line.startsWith('data: ')) {
      dataLine = line.slice('data: '.length).trim();
    }
  }

  if (!eventType || !dataLine) return null;

  const parsed: unknown = JSON.parse(dataLine);
  if (typeof parsed !== 'object' || parsed === null) return null;

  if (eventType === 'text' && 'chunk' in parsed) {
    return {
      type: 'text',
      chunk: String((parsed as { chunk: unknown }).chunk),
    };
  }
  if (eventType === 'done' && 'sessionId' in parsed) {
    return {
      type: 'done',
      sessionId: String((parsed as { sessionId: unknown }).sessionId),
    };
  }
  if (eventType === 'error' && 'error' in parsed) {
    return {
      type: 'error',
      error: String((parsed as { error: unknown }).error),
    };
  }

  return null;
};

interface ChatWidgetProps {
  bffUrl: string;
}

const ChatWidget = ({ bffUrl }: ChatWidgetProps): JSX.Element => {
  const [isOpen, setIsOpen] = useState(false);
  const [messages, setMessages] = useState<Message[]>([]);
  const [inputValue, setInputValue] = useState('');
  const [isStreaming, setIsStreaming] = useState(false);
  const [sessionId, setSessionId] = useState<string | undefined>(undefined);
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
      const requestBody = {
        message: trimmedInput,
        ...(sessionId !== undefined ? { sessionId } : {}),
      };

      const response = await fetch(bffUrl + '/chat', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(requestBody),
      });

      if (!response.ok || !response.body) {
        const errorBody = await response.text().catch(() => '');
        setMessages((previous) => {
          const updated = [...previous];
          const last = updated[updated.length - 1];
          if (last)
            last.content = `Error: ${response.status.toString()} ${errorBody}`;
          return updated;
        });
        return;
      }

      const reader = response.body
        .pipeThrough(new TextDecoderStream())
        .getReader();
      let buffer = '';

      for (;;) {
        const { value, done } = await reader.read();
        if (done) break;
        buffer += value;

        const segments = buffer.split('\n\n');
        buffer = segments.pop() ?? '';

        for (const segment of segments) {
          const sseEvent = parseSseSegment(segment.trim());
          if (!sseEvent) continue;

          if (sseEvent.type === 'text') {
            setMessages((previous) => {
              const updated = [...previous];
              const last = updated[updated.length - 1];
              if (last) last.content += sseEvent.chunk;
              return updated;
            });
          } else if (sseEvent.type === 'done') {
            setSessionId(sseEvent.sessionId);
          } else {
            setMessages((previous) => {
              const updated = [...previous];
              const last = updated[updated.length - 1];
              if (last) last.content = `Error: ${sseEvent.error}`;
              return updated;
            });
          }
        }
      }
    } catch {
      setMessages((previous) => {
        const updated = [...previous];
        const last = updated[updated.length - 1];
        if (last) last.content = 'Error: connection failed';
        return updated;
      });
    } finally {
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
