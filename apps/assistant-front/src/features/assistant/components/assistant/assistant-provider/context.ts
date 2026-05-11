import { createContext } from 'react';

export interface ContextValue {
  assistantIsOpen: boolean;
  setAssistantIsOpen: (value: boolean) => void;
}

export const AssistantContext = createContext<ContextValue | null>(null);
