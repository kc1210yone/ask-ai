import { useCallback, useRef, useState, type ReactNode } from 'react';
import invariant from 'tiny-invariant';
import { z } from 'zod';
import type { Message } from '../types';
import { ChatContext } from './context';

const BFF_BASE_URL = z.string().parse(import.meta.env['VITE_BFF_BASE_URL']);

interface Props {
  children: ReactNode;
}

export const ChatProvider = ({ children }: Props): ReactNode => {
  const [sessionId] = useState(() => crypto.randomUUID());

  const [messages, setMessages] = useState<Message[]>([]);

  const eventSourceRef = useRef<EventSource | null>(null);

  const eventHandlerRef = useRef<((event: Event) => void) | null>(null);

  const connect = useCallback(() => {
    invariant(!eventSourceRef.current);
    eventSourceRef.current = new EventSource(
      `${BFF_BASE_URL}/chat/${sessionId}`,
    );

    eventHandlerRef.current = (event) => {
      console.log(event);
    };
    eventSourceRef.current.addEventListener('ready', eventHandlerRef.current);
    eventSourceRef.current.addEventListener('error', eventHandlerRef.current);
  }, [sessionId]);

  const disconnect = () => {
    invariant(eventSourceRef.current);
    eventSourceRef.current.close();
    eventSourceRef.current = null;
  };

  const sendMessage = useCallback(
    async (inputMessage: string): Promise<boolean> => {
      connect();
      await new Promise((resolve) => setTimeout(resolve, 1000));
      setMessages((previous) => [
        ...previous,
        { from: 'user', type: 'normal', content: inputMessage },
      ]);
      return true;
    },
    [connect],
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
