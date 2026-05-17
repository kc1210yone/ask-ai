import assert from 'node:assert/strict';
import {
  BedrockAgentClient,
  GetIngestionJobCommand,
  StartIngestionJobCommand,
} from '@aws-sdk/client-bedrock-agent';

const KNOWLEDGE_BASE_ID = 'NOTTQ5JXC7';
const DATA_SOURCE_ID = 'SWSWIA7F4D';

const bedrockAgentClient = new BedrockAgentClient();

export const startIngestion = async (): Promise<string> => {
  const response = await bedrockAgentClient.send(
    new StartIngestionJobCommand({
      knowledgeBaseId: KNOWLEDGE_BASE_ID,
      dataSourceId: DATA_SOURCE_ID,
    }),
  );
  const ingestionJobId = response.ingestionJob?.ingestionJobId;
  assert(ingestionJobId);
  return ingestionJobId;
};

export const waitForIngestionFinish = async (
  ingestionJobId: string,
): Promise<void> => {
  let shouldContinue = true;
  while (shouldContinue) {
    await new Promise((resolve) => setTimeout(resolve, 10_000));
    const response = await bedrockAgentClient.send(
      new GetIngestionJobCommand({
        knowledgeBaseId: KNOWLEDGE_BASE_ID,
        dataSourceId: DATA_SOURCE_ID,
        ingestionJobId,
      }),
    );
    const status = response.ingestionJob?.status;
    assert(status);
    switch (status) {
      case 'COMPLETE':
        shouldContinue = false;
        break;
      case 'FAILED':
        throw new Error('Ingestion job failed.');
      default:
        break;
    }
  }
};
