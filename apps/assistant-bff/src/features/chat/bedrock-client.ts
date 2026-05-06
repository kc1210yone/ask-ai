import assert from 'node:assert/strict';
import {
  BedrockAgentRuntimeClient,
  InvokeAgentCommand,
  type InvokeAgentCommandOutput,
} from '@aws-sdk/client-bedrock-agent-runtime';

export const bedrockAgentRuntimeClient = new BedrockAgentRuntimeClient();

export const invokeAgent = async (
  inputText: string,
  sessionId: string,
): Promise<AsyncGenerator<string>> => {
  const response = await bedrockAgentRuntimeClient.send(
    new InvokeAgentCommand({
      agentId: 'AFZV2506DY',
      agentAliasId: 'JROKIVARG6',
      sessionId,
      inputText,
    }),
  );
  return generateTextChunks(response);
};

async function* generateTextChunks(
  response: InvokeAgentCommandOutput,
): AsyncGenerator<string> {
  assert(response.completion);
  const textDecoder = new TextDecoder();
  for await (const event of response.completion) {
    const chunk = event.chunk;
    assert(chunk);
    yield textDecoder.decode(chunk.bytes);
  }
}
