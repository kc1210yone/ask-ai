import { AssistantElement } from './assistant-element';

export const initializeAssistant = (): void => {
  customElements.define('ask-ai-assistant', AssistantElement);
};
