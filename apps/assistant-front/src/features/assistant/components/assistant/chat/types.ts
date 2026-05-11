export interface Message {
  type: 'user' | 'assistant-receiving' | 'assistant-done' | 'assistant-error';
  content: string;
}
