export interface Message {
  from: 'user' | 'assistant';
  type: 'normal' | 'error';
  content: string;
}
