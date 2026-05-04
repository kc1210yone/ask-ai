import {
  BedrockAgentClient,
  StartIngestionJobCommand,
} from '@aws-sdk/client-bedrock-agent';

const client = new BedrockAgentClient();

export const startIngestion = async (): Promise<void> => {
  const response = await client.send(
    new StartIngestionJobCommand({
      knowledgeBaseId: 'xxx',
      dataSourceId: 'xxx',
    }),
  );
  console.log(response);
};
