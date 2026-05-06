import assert from 'node:assert/strict';
import type { Response } from 'express';

export class SseResponse {
  constructor(private response: Response) {}

  initialize(): void {
    assert(this.response.socket);
    this.response.socket.setNoDelay(true);

    this.response.setHeader('Content-Type', 'text/event-stream');
    this.response.setHeader('Cache-Control', 'no-cache');
    this.response.flushHeaders();
  }

  sendTextEvent(chunk: string): void {
    this.sendEvent('text', { chunk });
  }

  sendDoneEvent(): void {
    this.sendEvent('done', {});
  }

  sendErrorEvent(error: string): void {
    this.sendEvent('error', { error });
  }

  private sendEvent(event: string, data: unknown): void {
    this.response.write(`event: ${event}\n`);
    this.response.write(`data: ${JSON.stringify(data)}\n\n`);
  }

  end(): void {
    this.response.end();
  }
}
