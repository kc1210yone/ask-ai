import { BotMessageSquareIcon } from 'lucide-react';
import type { ReactNode } from 'react';
import { useAssistant } from './assistant-provider/hook';

export const AssistantButton = (): ReactNode => {
  const { assistantIsOpen, setAssistantIsOpen, zIndex } = useAssistant();

  if (assistantIsOpen) {
    return null;
  }
  return (
    <button
      className="fixed right-8 bottom-8 flex h-12 w-12 items-center justify-center rounded-full bg-blue-500 text-white transition hover:bg-blue-600"
      style={{ zIndex }}
      onClick={() => {
        setAssistantIsOpen(true);
      }}
    >
      <BotMessageSquareIcon />
    </button>
  );
};
