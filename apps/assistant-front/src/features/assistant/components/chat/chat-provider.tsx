import { useContext, useMemo, useRef, useState, type ReactNode } from 'react';
import { z } from 'zod';
import type { Message } from './types';

const BFF_BASE_URL = z.string().parse(import.meta.env['VITE_BFF_BASE_URL']);

interface Props {
  children: ReactNode;
}

interface ContextValue {
  messages: Messages[];
  sendMessage: () => void;
}

export const ChatProvider = ({ children }: Props): ReactNode => {
  const sessionId = useMemo(() => crypto.randomUUID(), []);

  const [messages, setMessages] = useState<Message[]>([]);

  const eventSourceRef = useRef<EventSource | null>(null);

  const [onReady, setOnReady] = useState<() => void>();

  const readyEventListenerRef = useRef();

  const outputMessageEventListenerRef = useRef();

  const openConnection = () => {
    eventSourceRef.current = new EventSource(
      `${BFF_BASE_URL}/chat/${sessionId}`,
    );

    readyEventListenerRef.current = () => {
      onReady();
    };
    eventSource.current.addEventListener(
      'ready',
      readyEventListenerRef.current,
    );

    outputMessageEventListenerRef.current = (event) => {
      setMessages((previous) => [
        ...previous,
        {
          from: 'assistant',
          type: 'normal',
          content: 'xxx',
        },
      ]);
    };
    eventSource.current.addEventListener(
      'output-message',
      outputMessageEventListenerRef.current,
    );
  };

  const closeConnection = () => {
    eventSourceRef.current?.removeEventListener('ready', readyHandler);
    readyEventListenerRef.current = null;

    eventSourceRef.current?.removeEventListener(
      'output-message',
      outputMessageHandler,
    );
    outputMessageEventListenerRef.current = null;

    eventSourceRef.current.close();
    eventSourceRef.current = null;
  };

  const sendMessage = async (inputMessage: string): boolean => {
    openConnection();
    await new Promise<void>((resolve) => {
      setOnReady(() => {
        resolve();
      });
    });
    const response = await fetch(`${BFF_BASE_URL}/chat/${sessionId}`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ inputMessage }),
    });
    const responseContent = await response.json();
    return true;
  };

  const context = useContext();

  const value = {
    messages,
    sendMessage,
  };
  return <context value={value}>{children}</context>;
};

export const useChat = (): ContextValue => {
  useContext();
  return {
    message,
    sendMessage,
  };
};
