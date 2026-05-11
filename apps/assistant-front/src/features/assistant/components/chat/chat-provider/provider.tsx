import { useCallback, useState, type ReactNode } from 'react';
import invariant from 'tiny-invariant';
import { z } from 'zod';
import type { Message } from '../types';
import { ChatContext } from './context';
import { timeoutSignal } from '#src/lib/timeout-signal';

const BFF_BASE_URL = z.string().parse(import.meta.env['VITE_BFF_BASE_URL']);

interface Props {
  children: ReactNode;
}

export const ChatProvider = ({ children }: Props): ReactNode => {
  const [sessionId] = useState(() => crypto.randomUUID());

  const [messages, setMessages] = useState<Message[]>([]);

  const connect = useCallback(async (): Promise<boolean> => {
    const eventSource = new EventSource(`${BFF_BASE_URL}/chat/${sessionId}`);

    let readyResolve: (value: boolean) => void;
    const readyPromise = new Promise<boolean>((resolve) => {
      readyResolve = resolve;
    });

    const onReadyListener = (): void => {
      readyResolve(true);
    };
    eventSource.addEventListener('ready', onReadyListener);

    const onOutputMessageListener = (event: MessageEvent): void => {
      const Schema = z.object({
        chunk: z.string(),
      });
      const dataString = z.string().parse(event.data);
      const data = Schema.parse(JSON.parse(dataString));
      setMessages((previous) => {
        const rest = previous.slice(0, -1);
        const last = previous[previous.length - 1];
        invariant(last);
        invariant(last.type === 'assistant-receiving');
        return [...rest, { ...last, content: last.content + data.chunk }];
      });
    };
    eventSource.addEventListener('output-message', onOutputMessageListener);

    const onDoneListener = (): void => {
      setMessages((previous) => {
        const rest = previous.slice(0, -1);
        const last = previous[previous.length - 1];
        invariant(last);
        invariant(last.type === 'assistant-receiving');
        return [...rest, { ...last, type: 'assistant-done' }];
      });
      disconnect();
    };
    eventSource.addEventListener('done', onDoneListener);

    const onErrorListener = (): void => {
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
      disconnect();
      readyResolve(false);
    };
    eventSource.addEventListener('app-error', onErrorListener);
    eventSource.addEventListener('error', onErrorListener);

    const disconnect = (): void => {
      eventSource.removeEventListener('ready', onReadyListener);
      eventSource.removeEventListener(
        'output-message',
        onOutputMessageListener,
      );
      eventSource.removeEventListener('done', onDoneListener);
      eventSource.removeEventListener('app-error', onErrorListener);
      eventSource.removeEventListener('error', onErrorListener);

      eventSource.close();
    };

    return await readyPromise;
  }, [sessionId]);

  const sendMessage = useCallback(
    async (inputMessage: string): Promise<boolean> => {
      const connectResult = await connect();
      if (!connectResult) {
        return false;
      }

      let responseBody;
      try {
        const response = await fetch(`${BFF_BASE_URL}/chat/${sessionId}`, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ inputMessage }),
          signal: timeoutSignal(10_000),
        });
        if (response.status !== 200) {
          return false;
        }
        responseBody = (await response.json()) as unknown;
      } catch {
        return false;
      }

      const Schema = z.object({
        status: z.enum(['ok', 'error']),
      });
      const parsedBody = Schema.parse(responseBody);
      if (parsedBody.status === 'error') {
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
