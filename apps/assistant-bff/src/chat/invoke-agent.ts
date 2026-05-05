import { randomUUID } from 'node:crypto';
import {
  InvokeAgentCommand,
  type InvokeAgentCommandInput,
  type ResponseStream,
} from '@aws-sdk/client-bedrock-agent-runtime';
import { ResultAsync } from 'neverthrow';
import { bedrockAgentRuntimeClient } from '#src/chat/bedrock-agent-client.js';

export interface InvokeAgentResult {
  sessionId: string;
  textChunks: AsyncGenerator<string>;
}

export const invokeAgent = (
  inputText: string,
  existingSessionId: string | undefined,
): ResultAsync<InvokeAgentResult, string> => {
  const sessionId = existingSessionId ?? randomUUID();

  const input: InvokeAgentCommandInput = {
    agentId: 'AFZV2506DY',
    agentAliasId: '',
    sessionId,
    inputText,
  };

  return ResultAsync.fromPromise(
    bedrockAgentRuntimeClient.send(new InvokeAgentCommand(input)),
    (error) => `BedrockAgent invocation failed: ${String(error)}`,
  ).map((response) => ({
    sessionId,
    textChunks: extractTextChunks(response.completion),
  }));
};

async function* extractTextChunks(
  completion: AsyncIterable<ResponseStream> | undefined,
): AsyncGenerator<string> {
  if (completion === undefined) return;

  const decoder = new TextDecoder();
  for await (const event of completion) {
    if (event.chunk?.bytes !== undefined) {
      yield decoder.decode(event.chunk.bytes);
    }
  }
}
