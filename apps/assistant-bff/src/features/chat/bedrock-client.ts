import assert from 'node:assert/strict';
import {
  BedrockAgentRuntimeClient,
  InvokeAgentCommand,
  type InvokeAgentCommandOutput,
} from '@aws-sdk/client-bedrock-agent-runtime';

const BEDROCK_AGENT_ID = '855FTTEZR5';
const BEDROCK_AGENT_ALIAS_ID = '9TCHRYR2PC';

export const bedrockAgentRuntimeClient = new BedrockAgentRuntimeClient();

export const invokeAgent = async (
  sessionId: string,
  projectId: string,
  inputMessage: string,
): Promise<AsyncGenerator<string>> => {
  // TODO
  console.log(projectId);
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
