import 'dotenv/config';
import express from 'express';
import { chatRouter } from '#src/chat/router.js';
import { config } from '#src/config.js';
import { errorHandler } from '#src/middleware/error-handler.js';

const application = express();

application.use(express.json());
application.use(chatRouter);
application.use(errorHandler);

application.listen(config.port, () => {
  console.log(`Assistant BFF listening on port ${String(config.port)}`);
});
