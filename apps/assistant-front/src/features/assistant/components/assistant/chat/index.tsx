import { type ReactNode } from 'react';
import { useAssistant } from '../assistant-provider/hook';
import { ChatForm } from './chat-form';
import { ChatHeader } from './chat-header';
import { ChatMessages } from './chat-messages';
import { ChatProvider } from './chat-provider/provider';

export const Chat = (): ReactNode => {
  const { assistantIsOpen } = useAssistant();

  return (
    <ChatProvider>
      {assistantIsOpen && (
        <div className="fixed right-8 bottom-8 flex h-96 w-80 flex-col rounded-xl border border-solid border-gray-200 bg-white">
          <ChatHeader />
          <ChatMessages />
          <ChatForm />
        </div>
      )}
    </ChatProvider>
  );
};
