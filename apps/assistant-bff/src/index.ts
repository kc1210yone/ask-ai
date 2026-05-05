import 'dotenv/config';
import express from 'express';
import { chatRouter } from '#src/chat/router.js';
import { errorHandler } from '#src/middleware/error-handler.js';

const app = express();

app.use(express.json());
app.use(chatRouter);
app.use(errorHandler);

app.listen(3000, () => {
  console.info(`Assistant BFF listening on port 3000.}`);
});
