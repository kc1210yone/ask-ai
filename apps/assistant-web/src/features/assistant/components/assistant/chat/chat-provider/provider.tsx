import {
  fetchEventSource,
  type EventSourceMessage,
} from '@microsoft/fetch-event-source';
import { useCallback, useState, type ReactNode } from 'react';
import invariant from 'tiny-invariant';
import { z } from 'zod';
import { useAssistant } from '../../assistant-provider/hook';
import type { Message } from '../types';
import { ChatContext } from './context';

const BFF_BASE_URL = z.string().parse(import.meta.env['VITE_BFF_BASE_URL']);

interface Props {
  children: ReactNode;
}

export const ChatProvider = ({ children }: Props): ReactNode => {
  const { projectId } = useAssistant();

  const [sessionId] = useState(() => crypto.randomUUID());

  const [messages, setMessages] = useState<Message[]>([]);

  const [sendingDisabled, setSendingDisabled] = useState(false);

  const sendMessage = useCallback(
    async (inputMessage: string): Promise<boolean> => {
      const onMessage = (event: EventSourceMessage): void => {
        switch (event.event) {
          case 'output-message': {
            const Schema = z.object({
              chunk: z.string(),
            });
            const data = Schema.parse(JSON.parse(event.data));
            setMessages((previous) => {
              const rest = previous.slice(0, -1);
              const last = previous[previous.length - 1];
              invariant(last);
              invariant(last.type === 'assistant-receiving');
              return [...rest, { ...last, content: last.content + data.chunk }];
            });
            break;
          }
          case 'done':
            setMessages((previous) => {
              const rest = previous.slice(0, -1);
              const last = previous[previous.length - 1];
              invariant(last);
              invariant(last.type === 'assistant-receiving');
              return [...rest, { ...last, type: 'assistant-done' }];
            });
            setSendingDisabled(false);
            break;
          case 'app-error':
            throw new Error(`app-error: ${event.data}`);
          default:
            throw new Error();
        }
      };

      setSendingDisabled(true);

      let connectPromiseResolve!: (value: boolean) => void;
      const connectPromise = new Promise<boolean>((resolve) => {
        connectPromiseResolve = resolve;
      });

      void fetchEventSource(`${BFF_BASE_URL}/chat/${sessionId}`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ projectId, inputMessage }),
        // eslint-disable-next-line @typescript-eslint/require-await
        onopen: async (response) => {
          if (response.status !== 200) {
            throw new Error('Chat connection error.');
          }
          setMessages((previous) => [
            ...previous,
            { type: 'user', content: inputMessage },
            { type: 'assistant-receiving', content: '' },
          ]);
          connectPromiseResolve(true);
        },
        onmessage: onMessage,
        onerror: (error) => {
          console.warn(error);
          connectPromiseResolve(false);
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
          setSendingDisabled(false);
          throw new Error('Stop retry.');
        },
      }).catch(() => {
        // 再接続を停止させるためのthrowによりここにくるが、実際のエラーハンドリングはonerrorに書く。
      });

      return await connectPromise;
    },
    [projectId, sessionId],
  );

  return (
    <ChatContext
      value={{
        messages,
        sendMessage,
        sendingDisabled,
      }}
    >
      {children}
    </ChatContext>
  );
};
