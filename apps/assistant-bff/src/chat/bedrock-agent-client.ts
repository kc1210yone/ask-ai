import { BedrockAgentRuntimeClient } from '@aws-sdk/client-bedrock-agent-runtime';
import { config } from '#src/config.js';

export const bedrockAgentRuntimeClient = new BedrockAgentRuntimeClient({
  region: config.awsRegion,
});
