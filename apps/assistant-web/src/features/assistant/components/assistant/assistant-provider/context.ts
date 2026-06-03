import { createContext } from 'react';

export interface ContextValue {
  projectId: string;
  zIndex?: number | undefined;
  assistantIsOpen: boolean;
  setAssistantIsOpen: (value: boolean) => void;
}

export const AssistantContext = createContext<ContextValue | null>(null);
