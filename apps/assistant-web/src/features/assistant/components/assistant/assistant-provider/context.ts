import { createContext } from 'react';

export interface ContextValue {
  projectId: string;
  assistantIsOpen: boolean;
  setAssistantIsOpen: (value: boolean) => void;
}

export const AssistantContext = createContext<ContextValue | null>(null);
