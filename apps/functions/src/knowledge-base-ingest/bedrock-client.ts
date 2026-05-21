import assert from 'node:assert/strict';
import {
  BedrockAgentClient,
  StartIngestionJobCommand,
} from '@aws-sdk/client-bedrock-agent';

const KNOWLEDGE_BASE_ID = process.env['KNOWLEDGE_BASE_ID'];
assert(KNOWLEDGE_BASE_ID);

const KNOWLEDGE_BASE_DATA_SOURCE_ID =
  process.env['KNOWLEDGE_BASE_DATA_SOURCE_ID'];
assert(KNOWLEDGE_BASE_DATA_SOURCE_ID);

const bedrockAgentClient = new BedrockAgentClient({ region: 'us-east-1' });

export const startIngestion = async (): Promise<void> => {
  // TODO
  if (Math.random() < 0) {
    await bedrockAgentClient.send(
      new StartIngestionJobCommand({
        knowledgeBaseId: KNOWLEDGE_BASE_ID,
        dataSourceId: KNOWLEDGE_BASE_DATA_SOURCE_ID,
      }),
    );
  } else {
    console.log('Ingestion started.');
  }
};
