import 'dotenv/config';
import cors from 'cors';
import express from 'express';
import { errorHandler } from './error-handler.js';
import { chatRouter } from '#src/features/chat/index.js';
import { logger } from '#src/lib/logger/index.js';

const main = (): void => {
  const app = express();

  app.use(cors());
  app.use(express.json());

  app.use(chatRouter);

  app.use(errorHandler);

  const port = 3000;
  app.listen(port, () => {
    logger.info(
      `Assistant BFF listening on http://localhost:${port.toString()}.`,
    );
  });
};

main();
