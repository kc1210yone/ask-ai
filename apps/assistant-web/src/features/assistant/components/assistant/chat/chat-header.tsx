import { XIcon } from 'lucide-react';
import type { ReactNode } from 'react';
import { useAssistant } from '../assistant-provider/hook';

export const ChatHeader = (): ReactNode => {
  const { setAssistantIsOpen } = useAssistant();

  return (
    <div className="flex items-center justify-between border-b border-gray-100 px-4 py-3">
      <span className="text-sm font-semibold text-gray-800">
        AIアシスタント
      </span>
      <button
        className="text-gray-400 hover:text-gray-600"
        onClick={() => {
          setAssistantIsOpen(false);
        }}
      >
        <XIcon />
      </button>
    </div>
  );
};
