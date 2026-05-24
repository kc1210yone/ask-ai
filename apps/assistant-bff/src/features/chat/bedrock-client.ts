import assert from 'node:assert/strict';
import {
  BedrockAgentRuntimeClient,
  InvokeAgentCommand,
  type InvokeAgentCommandOutput,
} from '@aws-sdk/client-bedrock-agent-runtime';

const BEDROCK_AGENT_ID = 'AFZV2506DY';
const BEDROCK_AGENT_ALIAS_ID = 'JROKIVARG6';

export const bedrockAgentRuntimeClient = new BedrockAgentRuntimeClient();

export const invokeAgent = async (
  sessionId: string,
  inputMessage: string,
): Promise<AsyncGenerator<string>> => {
  // TODO
  if (Math.random() >= 0) {
    return generateDummyOutputMessageChunks();
  }
  const response = await bedrockAgentRuntimeClient.send(
    new InvokeAgentCommand({
      agentId: BEDROCK_AGENT_ID,
      agentAliasId: BEDROCK_AGENT_ALIAS_ID,
      sessionId,
      inputText: inputMessage,
    }),
  );
  return generateOutputMessageChunks(response);
};

async function* generateOutputMessageChunks(
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

async function* generateDummyOutputMessageChunks(): AsyncGenerator<string> {
  const chunks = [
    'こんにちは！\n',
    'これは',
    'ダミーの',
    'ストリーミング',
    'レスポンスです。',
  ];
  for (const chunk of chunks) {
    await new Promise((resolve) => setTimeout(resolve, 500));
    yield chunk;
  }
}
