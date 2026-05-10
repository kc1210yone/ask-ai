import { useCallback, useMemo, useRef, useState, type ReactNode } from 'react';
import invariant from 'tiny-invariant';
import { z } from 'zod';
import type { Message } from '../types';
import { ChatContext } from './context';

const BFF_BASE_URL = z.string().parse(import.meta.env['VITE_BFF_BASE_URL']);

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

  const disconnectRef = useRef<(() => void) | null>(null);

  const onReadyRef = useRef<(() => void) | null>(null);

  const readyHandler = useCallback((event: Event) => {
    console.log(event);
    onReadyRef.current?.();
  }, []);

  const doneHandler = useCallback((event: Event) => {
    console.log(event);
    disconnectRef.current?.();
  }, []);

  const appErrorHandler = useCallback((event: Event) => {
    console.log(event);
    disconnectRef.current?.();
  }, []);

  const outputMessageHandler = useCallback((event: Event) => {
    console.log(event);
    setMessages((previous) => [
      ...previous,
      { from: 'assistant', type: 'normal', content: 'message' },
    ]);
  }, []);

  const errorHandler = useCallback((event: Event) => {
    console.log(event);
    disconnectRef.current?.();
  }, []);

  const handlers = useMemo(
    () => ({
      ready: readyHandler,
      done: doneHandler,
      'app-error': appErrorHandler,
      error: errorHandler,
      'output-message': outputMessageHandler,
    }),
    [
      appErrorHandler,
      doneHandler,
      errorHandler,
      outputMessageHandler,
      readyHandler,
    ],
  );

  const connect = useCallback(async () => {
    eventSourceRef.current = new EventSource(
      `${BFF_BASE_URL}/chat/${sessionId}`,
    );
    Object.entries(handlers).forEach(([eventType, handler]) => {
      invariant(eventSourceRef.current);
      eventSourceRef.current.addEventListener(eventType, handler);
    });
    await new Promise<void>((resolve) => {
      onReadyRef.current = () => {
        resolve();
      };
    });
    disconnectRef.current = () => {
      Object.entries(handlers).forEach(([eventType, handler]) => {
        invariant(eventSourceRef.current);
        eventSourceRef.current.removeEventListener(eventType, handler);
      });
    };
  }, [handlers, sessionId]);

  const sendMessage = useCallback(
    async (inputMessage: string): Promise<boolean> => {
      await connect();
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
        { from: 'user', type: 'normal', content: inputMessage },
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
