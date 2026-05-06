import 'dotenv/config';
import cors from 'cors';
import express from 'express';
import { errorHandler } from './error-handler.js';
import { chatRouter } from '#src/features/chat/index.js';

const app = express();

app.use(cors());
app.use(express.json());

app.use(chatRouter);

app.use(errorHandler);

const port = 3000;
app.listen(port, () => {
  console.info(
    `Assistant BFF listening on http://localhost:${port.toString()}.`,
  );
});
