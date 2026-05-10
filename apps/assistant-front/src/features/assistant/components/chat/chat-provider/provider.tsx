import { useCallback, useMemo, useRef, useState, type ReactNode } from 'react';
import invariant from 'tiny-invariant';
import { z } from 'zod';
import type { Message } from '../types';
import { ChatContext } from './context';

const BFF_BASE_URL = z.string().parse(import.meta.env['VITE_BFF_BASE_URL']);

const OutputMessageDataSchema = z.object({
  chunk: z.string(),
});

const PostResponseSchema = z.object({
  status: z.enum(['ok', 'error']),
});

interface Props {
  children: ReactNode;
}

export const ChatProvider = ({ children }: Props): ReactNode => {
  const [sessionId] = useState(() => crypto.randomUUID());

  const [messages, setMessages] = useState<Message[]>([]);

  const eventSourceRef = useRef<EventSource | null>(null);

  const onReadyRef = useRef<(() => void) | null>(null);

  const disconnectRef = useRef<(() => void) | null>(null);

  const onReadyListener = useCallback((): void => {
    onReadyRef.current?.();
  }, []);

  const onOutputMessageListener = useCallback((event: MessageEvent): void => {
    const dataString = z.string().parse(event.data);
    const data = OutputMessageDataSchema.parse(JSON.parse(dataString));
    setMessages((previous) => {
      const rest = previous.slice(0, -1);
      const last = previous[previous.length - 1];
      invariant(last);
      invariant(last.type === 'assistant-receiving');
      return [...rest, { ...last, content: last.content + data.chunk }];
    });
  }, []);

  const onDoneListener = useCallback((): void => {
    setMessages((previous) => {
      const rest = previous.slice(0, -1);
      const last = previous[previous.length - 1];
      invariant(last);
      invariant(last.type === 'assistant-receiving');
      return [...rest, { ...last, type: 'assistant-done' }];
    });
    disconnectRef.current?.();
  }, []);

  const onAppErrorOrError = useCallback((): void => {
    setMessages((previous) => {
      if (previous.length === 0) {
        return previous;
      }
      const rest = previous.slice(0, -1);
      const last = previous[previous.length - 1];
      invariant(last);
      if (last.type !== 'assistant-receiving') {
        return previous;
      }
      return [...rest, { ...last, type: 'assistant-error' }];
    });
    disconnectRef.current?.();
  }, []);

  const onAppErrorListener = useCallback((): void => {
    onAppErrorOrError();
  }, [onAppErrorOrError]);

  const onErrorListener = useCallback((): void => {
    onAppErrorOrError();
  }, [onAppErrorOrError]);

  const listeners = useMemo(
    () => ({
      ready: onReadyListener,
      'output-message': onOutputMessageListener,
      done: onDoneListener,
      'app-error': onAppErrorListener,
      error: onErrorListener,
    }),
    [
      onAppErrorListener,
      onDoneListener,
      onErrorListener,
      onOutputMessageListener,
      onReadyListener,
    ],
  );

  const connect = useCallback(async (): Promise<boolean> => {
    eventSourceRef.current = new EventSource(
      `${BFF_BASE_URL}/chata/${sessionId}`, // TODO
    );

    Object.entries(listeners).forEach(([eventType, listener]) => {
      invariant(eventSourceRef.current);
      eventSourceRef.current.addEventListener(eventType, listener);
    });

    disconnectRef.current = () => {
      Object.entries(listeners).forEach(([eventType, listener]) => {
        invariant(eventSourceRef.current);
        eventSourceRef.current.removeEventListener(eventType, listener);
      });
      onReadyRef.current = null;
      disconnectRef.current = null;

      invariant(eventSourceRef.current);
      eventSourceRef.current.close();
      eventSourceRef.current = null;
    };

    await new Promise<void>((resolve) => {
      onReadyRef.current = () => {
        resolve();
      };
    });

    return true;
  }, [listeners, sessionId]);

  const sendMessage = useCallback(
    async (inputMessage: string): Promise<boolean> => {
      const connectResult = await connect();
      if (!connectResult) {
        return false;
      }
      const response = await fetch(`${BFF_BASE_URL}/chat/${sessionId}`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ inputMessage }),
      });
      const responseContent = PostResponseSchema.parse(await response.json());
      if (responseContent.status === 'error') {
        return false;
      }
      setMessages((previous) => [
        ...previous,
        { type: 'user', content: inputMessage },
        { type: 'assistant-receiving', content: '' },
      ]);
      return true;
    },
    [connect, sessionId],
  );

  return (
    <ChatContext
      value={{
        messages,
        sendMessage,
      }}
    >
      {children}
    </ChatContext>
  );
};
