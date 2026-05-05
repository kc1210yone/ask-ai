import { z } from 'zod';

const ConfigSchema = z.object({
  bedrockAgentId: z.string().min(1),
  bedrockAgentAliasId: z.string().min(1),
  awsRegion: z.string().min(1),
  port: z.coerce.number().int().positive().default(3000),
});

const parseConfig = (): z.infer<typeof ConfigSchema> =>
  ConfigSchema.parse({
    bedrockAgentId: process.env['BEDROCK_AGENT_ID'],
    bedrockAgentAliasId: process.env['BEDROCK_AGENT_ALIAS_ID'],
    awsRegion: process.env['AWS_REGION'],
    port: process.env['PORT'],
  });

export const config = parseConfig();
