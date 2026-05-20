import assert from 'node:assert/strict';
import {
  BedrockAgentClient,
  StartIngestionJobCommand,
} from '@aws-sdk/client-bedrock-agent';

const KNOWLEDGE_BASE_ID = 'QSCOK2GG0W';
assert(KNOWLEDGE_BASE_ID);

const KNOWLEDGE_BASE_DATA_SOURCE_ID = '39QQJTBE5B';
assert(KNOWLEDGE_BASE_DATA_SOURCE_ID);

const bedrockAgentClient = new BedrockAgentClient({ region: 'us-east-1' });

export const startIngestion = async (): Promise<void> => {
  // TODO: すでに起動していた時
  await bedrockAgentClient.send(
    new StartIngestionJobCommand({
      knowledgeBaseId: KNOWLEDGE_BASE_ID,
      dataSourceId: KNOWLEDGE_BASE_DATA_SOURCE_ID,
    }),
  );
};
