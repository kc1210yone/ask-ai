import { createContext } from 'react';
import type { Message } from '../types';

export interface ContextValue {
  messages: Message[];
  sendMessage: (inputMessage: string) => Promise<boolean>;
}

export const ChatContext = createContext<ContextValue | null>(null);

//a
