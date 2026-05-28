import { StrictMode } from 'react';
import { createRoot, type Root } from 'react-dom/client';
import invariant from 'tiny-invariant';
import { Assistant } from './components/assistant';
import styles from '#src/globals.css?inline';

export class AssistantElement extends HTMLElement {
  private mountPointElement: HTMLDivElement;
  private root: Root | null = null;

  constructor() {
    super();

    this.attachShadow({ mode: 'open' });
    invariant(this.shadowRoot);

    const styleElement = document.createElement('style');
    styleElement.textContent = styles;

    this.mountPointElement = document.createElement('div');

    this.shadowRoot.append(styleElement, this.mountPointElement);
  }

  connectedCallback(): void {
    invariant(!this.root);
    this.root = createRoot(this.mountPointElement);

    const projectId = this.getAttribute('project-id');
    invariant(projectId, 'project-id属性がありません。');

    this.root.render(
      <StrictMode>
        <Assistant projectId={projectId} />
      </StrictMode>,
    );
  }

  disconnectedCallback(): void {
    invariant(this.root);
    this.root.unmount();
    this.root = null;
  }
}
