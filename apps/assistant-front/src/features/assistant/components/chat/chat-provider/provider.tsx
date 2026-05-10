import { useCallback, useState, type ReactNode } from 'react';
import type { Message } from '../types';
import { ChatContext } from './context';

interface Props {
  children: ReactNode;
}

export const ChatProvider = ({ children }: Props): ReactNode => {
  const [messages, setMessages] = useState<Message[]>([
    { from: 'user', type: 'normal', content: 'AAA' },
    { from: 'assistant', type: 'normal', content: 'BBB' },
  ]);

  const sendMessage = useCallback(
    async (inputMessage: string): Promise<boolean> => {
      await new Promise((resolve) => setTimeout(resolve, 1000));
      setMessages((previous) => [
        ...previous,
        { from: 'user', type: 'normal', content: inputMessage },
      ]);
      return true;
    },
    [],
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
