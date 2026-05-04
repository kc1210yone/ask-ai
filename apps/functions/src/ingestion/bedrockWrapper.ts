import {
  BedrockAgentClient,
  StartIngestionJobCommand,
} from '@aws-sdk/client-bedrock-agent';

export const startIngestion = async (): Promise<void> => {
  const client = new BedrockAgentClient();
  const response = await client.send(
    new StartIngestionJobCommand({
      knowledgeBaseId: 'xxx',
      dataSourceId: 'xxx',
    }),
  );
  console.log(response);
};
