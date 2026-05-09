import { useState, type ReactNode } from 'react';
import { MessageComponent } from './message-component';
import { SendForm } from './send-form';
import type { Message } from './types';

interface Props {
  assistantIsOpen: boolean;
  setAssistantIsOpen: (value: boolean) => void;
}

export const Chat = ({
  assistantIsOpen,
  setAssistantIsOpen,
}: Props): ReactNode => {
  const [n, setN] = useState(0);
  const [messages, setMessages] = useState<Message[]>([]);
  if (!assistantIsOpen) {
    return null;
  }
  const onPreSend = () => {
    const sessionId = crypto.randomUUID();
    const eventSource = new EventSource(
      `http://localhost:3000/chat/${sessionId}`,
    );

    eventSource.addEventListener('output-message', (event) => {
      const data = JSON.parse(event.data);
      setMessages((previous) => {
        const newValue = [...previous];
        const last = newValue[newValue.length - 1];
        if (last) {
          last.content += parsed.chunk;
        }
        return updated;
      });
    });

    eventSource.addEventListener('done', () => {
      eventSource.close();
    });

    eventSource.addEventListener('error', (event) => {
      const parsed = event.data;
      closeWithError;
    });

    eventSource.onerror = () => {
      if (eventSource.readyState === EventSource.CLOSED) {
        return;
      }
    };
  };

  return (
    <div className="fixed right-8 bottom-8">
      <button
        onClick={() => {
          setAssistantIsOpen(false);
        }}
      >
        x
      </button>
      <p>Chat</p>
      <button
        onClick={() => {
          setN((prev) => prev + 1);
        }}
      >
        Inc {n}
      </button>
      {messages.map((message, index) => (
        <MessageComponent key={index} message={message} />
      ))}
      <SendForm />
    </div>
  );
};
